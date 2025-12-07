import React from 'react';
import { Button } from '@/components/ui/button';
import { GameMode, GameStatus } from '@/types/game';
import { Play, Pause, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
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
  onDirectionChange: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
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
  onDirectionChange,
  className,
}: GameControlsProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Score Display */}
      <div className="flex justify-between items-center px-4 py-3 bg-card rounded-lg border border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Score</p>
          <p className="text-2xl font-bold text-primary font-mono">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">High Score</p>
          <p className="text-2xl font-bold text-accent-foreground font-mono">{highScore}</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'pass-through' ? 'default' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => onModeChange('pass-through')}
          disabled={status === 'playing'}
        >
          Pass-Through
        </Button>
        <Button
          variant={mode === 'walls' ? 'default' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => onModeChange('walls')}
          disabled={status === 'playing'}
        >
          Walls
        </Button>
      </div>

      {/* Game Actions */}
      <div className="flex gap-2">
        {status === 'idle' || status === 'game-over' ? (
          <Button onClick={onStart} className="flex-1 gap-2">
            <Play className="w-4 h-4" />
            {status === 'game-over' ? 'Play Again' : 'Start Game'}
          </Button>
        ) : status === 'playing' ? (
          <Button onClick={onPause} variant="secondary" className="flex-1 gap-2">
            <Pause className="w-4 h-4" />
            Pause
          </Button>
        ) : (
          <Button onClick={onResume} className="flex-1 gap-2">
            <Play className="w-4 h-4" />
            Resume
          </Button>
        )}
        <Button onClick={onReset} variant="outline" size="icon" disabled={status === 'idle'}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Direction Controls */}
      <div className="grid grid-cols-3 gap-2 w-36 mx-auto md:hidden">
        <div />
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onDirectionChange('UP')}
          disabled={status !== 'playing'}
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
        <div />
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onDirectionChange('LEFT')}
          disabled={status !== 'playing'}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onDirectionChange('DOWN')}
          disabled={status !== 'playing'}
        >
          <ArrowDown className="w-5 h-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onDirectionChange('RIGHT')}
          disabled={status !== 'playing'}
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>Use Arrow keys or WASD to move</p>
        <p>Press Space to start/pause</p>
      </div>
    </div>
  );
}
