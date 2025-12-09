import { useState, useCallback, useEffect, useRef } from 'react';
import { GameMode, GameState, Direction } from '@/types/game';
import {
  createInitialState,
  moveSnake,
  changeDirection,
  getDirectionFromKey
} from '@/lib/gameLogic';
import { gameApi, livePlayersApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const GAME_SPEED = 100; // ms per frame
const UPDATE_INTERVAL = 1000; // Update live player every 1 second

export function useSnakeGame(initialMode: GameMode = 'pass-through') {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(initialMode));
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const directionQueueRef = useRef<Direction[]>([]);
  const playerIdRef = useRef<string | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const { user } = useAuth();

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...createInitialState(prev.mode),
      status: 'playing',
    }));
    directionQueueRef.current = [];
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: prev.status === 'playing' ? 'paused' : prev.status,
    }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: prev.status === 'paused' ? 'playing' : prev.status,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => createInitialState(prev.mode));
    directionQueueRef.current = [];
  }, []);

  const setMode = useCallback((mode: GameMode) => {
    setGameState(prev => ({
      ...createInitialState(mode),
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
  }, [gameState.status]);

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

  // Update high score and save game on game over
  useEffect(() => {
    if (gameState.status === 'game-over') {
      if (gameState.score > highScore) {
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
    handleDirectionChange,
  };
}
