import { useState, useCallback, useEffect, useRef } from 'react';
import { GameMode, GameState, Direction, GameDifficulty } from '@/types/game';
import {
  createInitialState,
  moveSnake,
  changeDirection,
  getDirectionFromKey
} from '@/lib/gameLogic';
import { gameApi, livePlayersApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { soundManager } from '@/lib/soundManager';
import { getDifficultyConfig } from '@/lib/difficultyConfig';

const UPDATE_INTERVAL = 1000; // Update live player every 1 second

export function useSnakeGame(initialMode: GameMode = 'pass-through', initialDifficulty: GameDifficulty = 'normal') {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(initialMode, initialDifficulty));
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const directionQueueRef = useRef<Direction[]>([]);
  const playerIdRef = useRef<string | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const { user } = useAuth();

  const startGame = useCallback(() => {
    soundManager.playStartSound();
    setGameState(prev => ({
      ...createInitialState(prev.mode, prev.difficulty),
      status: 'playing',
    }));
    directionQueueRef.current = [];
  }, []);

  const pauseGame = useCallback(() => {
    soundManager.playPauseSound();
    setGameState(prev => ({
      ...prev,
      status: prev.status === 'playing' ? 'paused' : prev.status,
    }));
  }, []);

  const resumeGame = useCallback(() => {
    soundManager.playStartSound();
    setGameState(prev => ({
      ...prev,
      status: prev.status === 'paused' ? 'playing' : prev.status,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => createInitialState(prev.mode, prev.difficulty));
    directionQueueRef.current = [];
  }, []);

  const setMode = useCallback((mode: GameMode) => {
    setGameState(prev => ({
      ...createInitialState(mode, prev.difficulty),
    }));
    directionQueueRef.current = [];
  }, []);

  const setDifficulty = useCallback((difficulty: GameDifficulty) => {
    setGameState(prev => ({
      ...createInitialState(prev.mode, difficulty),
    }));
    directionQueueRef.current = [];
  }, []);

  const handleDirectionChange = useCallback((newDirection: Direction) => {
    directionQueueRef.current.push(newDirection);
  }, []);

  // Create live player when game starts
  useEffect(() => {
    if (gameState.status === 'playing' && !playerIdRef.current && user) {
      const playerId = `${user.id}-${Date.now()}`;
      playerIdRef.current = playerId;

      livePlayersApi.createPlayer({
        id: playerId,
        username: user.username,
        score: gameState.score,
        mode: gameState.mode,
        snake: gameState.snake,
        food: gameState.food,
        direction: gameState.direction,
        status: gameState.status,
      }).catch(error => {
        console.error('Failed to create live player:', error);
        playerIdRef.current = null;
      });
    }
  }, [gameState.status, user, gameState.score, gameState.mode, gameState.snake, gameState.food, gameState.direction]);

  // Update live player state periodically (every 1 second)
  useEffect(() => {
    if (gameState.status === 'playing' && playerIdRef.current) {
      const now = Date.now();
      if (now - lastUpdateRef.current >= UPDATE_INTERVAL) {
        lastUpdateRef.current = now;

        livePlayersApi.updatePlayer(playerIdRef.current, {
          id: playerIdRef.current,
          username: user?.username || 'Guest',
          score: gameState.score,
          mode: gameState.mode,
          snake: gameState.snake,
          food: gameState.food,
          direction: gameState.direction,
          status: gameState.status,
        }).catch(error => {
          console.error('Failed to update live player:', error);
        });
      }
    }
  }, [gameState, user]);

  // Remove live player on game over
  useEffect(() => {
    if (gameState.status === 'game-over' && playerIdRef.current) {
      livePlayersApi.removePlayer(playerIdRef.current).finally(() => {
        playerIdRef.current = null;
      });
    }
  }, [gameState.status]);

  // Cleanup: remove player on unmount or tab close
  useEffect(() => {
    const cleanup = () => {
      if (playerIdRef.current) {
        livePlayersApi.removePlayer(playerIdRef.current);
      }
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.status !== 'playing') {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const GAME_SPEED = getDifficultyConfig(gameState.difficulty).speed;
    let lastTime = 0;

    const gameLoop = (currentTime: number) => {
      if (currentTime - lastTime >= GAME_SPEED) {
        lastTime = currentTime;

        setGameState(prev => {
          // Process direction queue
          let newDirection = prev.direction;
          while (directionQueueRef.current.length > 0) {
            const queuedDirection = directionQueueRef.current.shift()!;
            const changed = changeDirection(newDirection, queuedDirection);
            if (changed !== newDirection) {
              newDirection = changed;
              break;
            }
          }

          const stateWithNewDirection = { ...prev, direction: newDirection };
          return moveSnake(stateWithNewDirection);
        });
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.status, gameState.difficulty]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const direction = getDirectionFromKey(e.key);
      if (direction) {
        e.preventDefault();
        handleDirectionChange(direction);
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (gameState.status === 'idle' || gameState.status === 'game-over') {
          startGame();
        } else if (gameState.status === 'playing') {
          pauseGame();
        } else if (gameState.status === 'paused') {
          resumeGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, handleDirectionChange, startGame, pauseGame, resumeGame]);

  // Play eat sound when score increases
  const previousScoreRef = useRef(0);
  useEffect(() => {
    if (gameState.score > previousScoreRef.current && gameState.status === 'playing') {
      soundManager.playEatSound();
    }
    previousScoreRef.current = gameState.score;
  }, [gameState.score, gameState.status]);

  // Update high score and save game on game over
  useEffect(() => {
    if (gameState.status === 'game-over') {
      soundManager.playGameOverSound();

      const isNewHighScore = gameState.score > highScore;
      if (isNewHighScore) {
        // Play high score sound after game over sound
        setTimeout(() => {
          soundManager.playHighScoreSound();
        }, 800);
        setHighScore(gameState.score);
      }
      // Save score
      gameApi.saveGame(gameState.score, gameState.mode);
    }
  }, [gameState.status, gameState.score, gameState.mode, highScore]);

  return {
    gameState,
    highScore,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    setMode,
    setDifficulty,
    handleDirectionChange,
  };
}
