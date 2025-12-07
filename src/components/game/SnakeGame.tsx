import React from 'react';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { GameCanvas } from './GameCanvas';
import { GameControls } from './GameControls';
import { GameOverlay } from './GameOverlay';

export function SnakeGame() {
  const {
    gameState,
    highScore,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    setMode,
    handleDirectionChange,
  } = useSnakeGame();

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
      <div className="relative">
        <GameCanvas gameState={gameState} />
        <GameOverlay
          status={gameState.status}
          score={gameState.score}
          onStart={startGame}
          onResume={resumeGame}
        />
      </div>
      
      <GameControls
        status={gameState.status}
        mode={gameState.mode}
        score={gameState.score}
        highScore={highScore}
        onStart={startGame}
        onPause={pauseGame}
        onResume={resumeGame}
        onReset={resetGame}
        onModeChange={setMode}
        onDirectionChange={handleDirectionChange}
        className="w-full max-w-xs"
      />
    </div>
  );
}
