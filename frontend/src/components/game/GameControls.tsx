import React from 'react';
import { Button } from '@/components/ui/button';
import { GameMode, GameStatus } from '@/types/game';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  status: GameStatus;
  mode: GameMode;
  score: number;
  highScore: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
  className?: string;
}

export function GameControls({
  status,
  mode,
  score,
  highScore,
  onStart,
  onPause,
  onResume,
  onReset,
  onModeChange,
  className,
}: GameControlsProps) {
  return (
    <div className={cn("flex flex-col gap-6 p-6 glass-card rounded-xl", className)}>
      {/* Score Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-black/20 border border-white/5">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Score</p>
          <p className="text-3xl font-bold text-primary font-mono">{score}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-black/20 border border-white/5">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">High Score</p>
          <p className="text-3xl font-bold text-accent font-mono">{highScore}</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-widest pl-1">Game Mode</p>
        <div className="flex bg-black/20 p-1 rounded-lg border border-white/5">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 rounded-md transition-all",
              mode === 'pass-through' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
            onClick={() => onModeChange('pass-through')}
            disabled={status === 'playing'}
          >
            Classic
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 rounded-md transition-all",
              mode === 'walls' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
            onClick={() => onModeChange('walls')}
            disabled={status === 'playing'}
          >
            Walls
          </Button>
        </div>
      </div>

      {/* Game Actions */}
      <div className="flex gap-3">
        {status === 'idle' || status === 'game-over' ? (
          <Button onClick={onStart} className="flex-1 h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Play className="w-5 h-5 mr-2 fill-current" />
            Start
          </Button>
        ) : status === 'playing' ? (
          <Button onClick={onPause} variant="secondary" className="flex-1 h-12 text-lg font-semibold bg-white/10 hover:bg-white/20 text-white">
            <Pause className="w-5 h-5 mr-2 fill-current" />
            Pause
          </Button>
        ) : (
          <Button onClick={onResume} className="flex-1 h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Play className="w-5 h-5 mr-2 fill-current" />
            Resume
          </Button>
        )}

        <Button
          onClick={onReset}
          variant="outline"
          size="icon"
          className="h-12 w-12 border-white/10 bg-white/5 hover:bg-destructive hover:border-destructive hover:text-white transition-colors"
          disabled={status === 'idle'}
          title="Reset Game"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-xs text-muted-foreground text-center space-y-1 pt-2 border-t border-white/5">
        <p>Use <kbd className="bg-black/30 px-1 rounded text-foreground font-mono">Arrow Keys</kbd> or <kbd className="bg-black/30 px-1 rounded text-foreground font-mono">WASD</kbd> to move</p>
        <p>Press <kbd className="bg-black/30 px-1 rounded text-foreground font-mono">Space</kbd> to pause</p>
      </div>
    </div>
  );
}
