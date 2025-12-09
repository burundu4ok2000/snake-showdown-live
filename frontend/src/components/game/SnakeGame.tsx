import React from 'react';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { GameCanvas } from './GameCanvas';
import { GameControls } from './GameControls';
import { GameOverlay } from './GameOverlay';
import { MobileControls } from './MobileControls';
import { getDifficultyConfig } from '@/lib/difficultyConfig';

export function SnakeGame() {
  const {
    gameState,
    highScore,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    setMode,
    setDifficulty,
    handleDirectionChange,
  } = useSnakeGame();

  const difficultyConfig = getDifficultyConfig(gameState.difficulty);

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

          {/* Difficulty Badge */}
          {gameState.status === 'playing' && (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1 flex items-center gap-2">
              <span className="text-lg">{difficultyConfig.emoji}</span>
              <div className="flex flex-col items-start">
                <span className={`text-xs font-semibold ${difficultyConfig.color}`}>
                  {difficultyConfig.label}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  ×{difficultyConfig.scoreMultiplier}
                </span>
              </div>
            </div>
          )}
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
        difficulty={gameState.difficulty}
        score={gameState.score}
        highScore={highScore}
        onStart={startGame}
        onPause={pauseGame}
        onResume={resumeGame}
        onReset={resetGame}
        onModeChange={setMode}
        onDifficultyChange={setDifficulty}
        className="w-full"
      />
    </div>
  );
}
