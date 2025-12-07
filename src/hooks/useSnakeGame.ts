import { useState, useCallback, useEffect, useRef } from 'react';
import { GameMode, GameState, Direction } from '@/types/game';
import { 
  createInitialState, 
  moveSnake, 
  changeDirection, 
  getDirectionFromKey 
} from '@/lib/gameLogic';
import { gameApi } from '@/services/api';

const GAME_SPEED = 100; // ms per frame

export function useSnakeGame(initialMode: GameMode = 'pass-through') {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(initialMode));
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const directionQueueRef = useRef<Direction[]>([]);

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
