import React from 'react';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { GameCanvas } from './GameCanvas';
import { GameControls } from './GameControls';
import { GameOverlay } from './GameOverlay';
import { MobileControls } from './MobileControls';

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
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div className="relative flex flex-col gap-4 w-full">
        <div className="relative w-full flex justify-center">
          <GameCanvas gameState={gameState} />
          <GameOverlay
            status={gameState.status}
            score={gameState.score}
            onStart={startGame}
            onResume={resumeGame}
          />
        </div>

        {/* Mobile Controls - visible only on touch devices */}
        <MobileControls
          onMove={handleDirectionChange}
          className="lg:hidden"
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
        className="w-full"
      />
    </div>
  );
}
