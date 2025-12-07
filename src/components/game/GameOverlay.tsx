import React from 'react';
import { GameStatus } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
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
      "absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg",
      className
    )}>
      {status === 'idle' && (
        <>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Snake Arena</h2>
          <p className="text-muted-foreground mb-6">Press Space or click to start</p>
          <Button onClick={onStart} size="lg" className="gap-2">
            <Play className="w-5 h-5" />
            Start Game
          </Button>
        </>
      )}

      {status === 'paused' && (
        <>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Paused</h2>
          <Button onClick={onResume} size="lg" className="gap-2">
            <Play className="w-5 h-5" />
            Resume
          </Button>
        </>
      )}

      {status === 'game-over' && (
        <>
          <h2 className="text-3xl font-bold mb-2 text-destructive">Game Over</h2>
          <p className="text-xl text-foreground mb-6">
            Final Score: <span className="font-mono font-bold text-primary">{score}</span>
          </p>
          <Button onClick={onStart} size="lg" className="gap-2">
            <Play className="w-5 h-5" />
            Play Again
          </Button>
        </>
      )}
    </div>
  );
}
