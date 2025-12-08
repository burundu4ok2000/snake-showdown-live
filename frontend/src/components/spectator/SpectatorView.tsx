import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameCanvas } from '@/components/game/GameCanvas';
import { livePlayersApi } from '@/services/api';
import { LivePlayer, GameState } from '@/types/game';
import { Eye, X, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpectatorViewProps {
  player: LivePlayer;
  onClose: () => void;
  className?: string;
}

export function SpectatorView({ player, onClose, className }: SpectatorViewProps) {
  const [currentPlayer, setCurrentPlayer] = useState<LivePlayer>(player);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Simulate the player's game
    const simulateGame = async () => {
      const updated = await livePlayersApi.simulatePlayerMove(player.id);
      if (updated) {
        setCurrentPlayer(updated);
      }
    };

    intervalRef.current = window.setInterval(simulateGame, 150);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [player.id]);

  const gameState: GameState = {
    snake: currentPlayer.snake,
    food: currentPlayer.food,
    direction: currentPlayer.direction,
    score: currentPlayer.score,
    status: currentPlayer.status,
    mode: currentPlayer.mode,
    gridSize: 20,
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Watching: {currentPlayer.username}
            <Badge variant="outline" className="ml-2">
              <Radio className="w-3 h-3 mr-1 text-destructive animate-pulse" />
              LIVE
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <GameCanvas gameState={gameState} />
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase">Mode</p>
            <Badge variant={currentPlayer.mode === 'walls' ? 'default' : 'secondary'}>
              {currentPlayer.mode}
            </Badge>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase">Score</p>
            <p className="text-2xl font-bold text-primary font-mono">{currentPlayer.score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase">Length</p>
            <p className="text-xl font-mono text-foreground">{currentPlayer.snake.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
