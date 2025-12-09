import React from 'react';
import { Button } from '@/components/ui/button';
import { GameMode, GameStatus, GameDifficulty } from '@/types/game';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDifficultyConfig, DIFFICULTY_CONFIG } from '@/lib/difficultyConfig';

interface GameControlsProps {
  status: GameStatus;
  mode: GameMode;
  difficulty: GameDifficulty;
  score: number;
  highScore: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: GameDifficulty) => void;
  className?: string;
}

export function GameControls({
  status,
  mode,
  difficulty,
  score,
  highScore,
  onStart,
  onPause,
  onResume,
  onReset,
  onModeChange,
  onDifficultyChange,
  className,
}: GameControlsProps) {
  return (
    <div className={cn("grid md:grid-cols-4 gap-4 p-4 glass-card rounded-xl items-center", className)}>
      {/* Score Display - Takes 1 column */}
      <div className="flex flex-col md:flex-row gap-4 md:col-span-2 lg:col-span-1">
        <div className="flex-1 flex flex-col items-center justify-center p-3 rounded-lg bg-black/20 border border-white/5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Score</p>
          <p className="text-2xl font-bold text-primary font-mono">{score}</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-3 rounded-lg bg-black/20 border border-white/5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Best</p>
          <p className="text-2xl font-bold text-accent font-mono">{highScore}</p>
        </div>
      </div>

      {/* Mode Selector - Takes 1 column */}
      <div className="space-y-1 md:col-span-2 lg:col-span-1">
        <div className="flex bg-black/20 p-1 rounded-lg border border-white/5 h-14 items-center">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 h-full rounded-md transition-all text-xs lg:text-sm",
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
              "flex-1 h-full rounded-md transition-all text-xs lg:text-sm",
              mode === 'walls' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
            onClick={() => onModeChange('walls')}
            disabled={status === 'playing'}
          >
            Walls
          </Button>
        </div>
      </div>

      {/* Difficulty Selector - Full width on mobile, 2 cols on medium+ */}
      <div className="space-y-1 md:col-span-4 lg:col-span-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest pl-1 mb-1">Difficulty</p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
          {(Object.keys(DIFFICULTY_CONFIG) as GameDifficulty[]).map((diff) => {
            const config = getDifficultyConfig(diff);
            return (
              <Button
                key={diff}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-12 md:h-10 rounded-md transition-all flex flex-col items-center justify-center gap-0.5 p-1",
                  difficulty === diff
                    ? `bg-primary text-primary-foreground shadow-md`
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
                onClick={() => onDifficultyChange(diff)}
                disabled={status === 'playing'}
                title={`${config.label} (×${config.scoreMultiplier} score)`}
              >
                <span className="text-base md:text-sm">{config.emoji}</span>
                <span className="text-[9px] md:text-[10px] font-medium">{config.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Game Actions - Takes remaining columns */}
      <div className="flex gap-2 md:col-span-4 lg:col-span-2">
        {status === 'idle' || status === 'game-over' ? (
          <Button onClick={onStart} className="flex-1 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Play className="w-5 h-5 mr-2 fill-current" />
            Start Game
          </Button>
        ) : status === 'playing' ? (
          <Button onClick={onPause} variant="secondary" className="flex-1 h-14 text-lg font-semibold bg-white/10 hover:bg-white/20 text-white">
            <Pause className="w-5 h-5 mr-2 fill-current" />
            Pause
          </Button>
        ) : (
          <Button onClick={onResume} className="flex-1 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Play className="w-5 h-5 mr-2 fill-current" />
            Resume
          </Button>
        )}

        <Button
          onClick={onReset}
          variant="outline"
          size="icon"
          className="h-14 w-14 border-white/10 bg-white/5 hover:bg-destructive hover:border-destructive hover:text-white transition-colors"
          disabled={status === 'idle'}
          title="Reset Game"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Instructions - Hidden on small screens, integrated nicely */}
      <div className="hidden lg:flex md:col-span-4 justify-between text-[10px] text-muted-foreground px-2 border-t border-white/5 pt-2 mt-1">
        <span>Use <kbd className="bg-black/30 px-1 rounded text-foreground font-mono">Arrows</kbd> or <kbd className="bg-black/30 px-1 rounded text-foreground font-mono">WASD</kbd> to move</span>
        <span>Press <kbd className="bg-black/30 px-1 rounded text-foreground font-mono">Space</kbd> to pause</span>
      </div>
    </div>
  );
}
