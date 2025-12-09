import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { livePlayersApi } from '@/services/api';
import { LivePlayer } from '@/types/game';
import { Users, Eye, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LivePlayersListProps {
  onSelectPlayer: (player: LivePlayer) => void;
  selectedPlayerId?: string;
  className?: string;
}

export function LivePlayersList({ onSelectPlayer, selectedPlayerId, className }: LivePlayersListProps) {
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await livePlayersApi.getLivePlayers();
        setPlayers(data);
      } catch (error) {
        console.error('Failed to fetch live players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
    const interval = setInterval(fetchPlayers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={cn("w-full max-w-md glass-card border-0", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Live Players
          <Badge variant="outline" className="ml-auto">
            <Radio className="w-3 h-3 mr-1 text-destructive animate-pulse" />
            {players.length} online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : players.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No players currently online
          </p>
        ) : (
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer",
                  selectedPlayerId === player.id
                    ? "bg-primary/10 border border-primary"
                    : "bg-card hover:bg-accent/50 border border-transparent"
                )}
                onClick={() => onSelectPlayer(player)}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {player.username[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{player.username}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={player.mode === 'walls' ? 'default' : 'secondary'} className="text-xs">
                      {player.mode}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Score: {player.score}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Eye className="w-4 h-4" />
                  Watch
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
