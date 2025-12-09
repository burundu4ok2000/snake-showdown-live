import React from 'react';
import { GameStatus } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameOverlayProps {
  status: GameStatus;
  score: number;
  onStart: () => void;
  onResume: () => void;
  className?: string;
}

export function GameOverlay({ status, score, onStart, onResume, className }: GameOverlayProps) {
  if (status === 'playing') return null;

  return (
    <div className={cn(
      "absolute inset-0 flex flex-col items-center justify-center z-10 glass rounded-xl p-6 text-center animate-in fade-in duration-300",
      className
    )}>
      {status === 'idle' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 drop-shadow-sm">
              Snake Arena
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Classic Arcade Action
            </p>
          </div>

          <Button
            onClick={onStart}
            size="lg"
            className="h-16 px-8 text-xl rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 border-t border-white/20 transition-all hover:scale-105"
          >
            <Play className="w-6 h-6 mr-2 fill-current" />
            Play Now
          </Button>

          <p className="text-xs text-muted-foreground animate-pulse">
            Press Space or Tap to Start
          </p>
        </div>
      )}

      {status === 'paused' && (
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-foreground tracking-tight">Paused</h2>
          <Button
            onClick={onResume}
            size="lg"
            className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 border-t border-white/20 shadow-lg transition-all hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            Resume Game
          </Button>
        </div>
      )}

      {status === 'game-over' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-destructive drop-shadow-sm">Game Over</h2>
            <div className="flex flex-col items-center gap-1">
              <span className="text-muted-foreground uppercase text-xs tracking-wider">Final Score</span>
              <span className="text-5xl font-mono font-bold text-foreground tabular-nums tracking-tight">
                {score}
              </span>
            </div>
          </div>

          <Button
            onClick={onStart}
            size="lg"
            className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 border-t border-white/20 transition-all hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
