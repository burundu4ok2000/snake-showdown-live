import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { leaderboardApi } from '@/services/api';
import { LeaderboardEntry, GameMode } from '@/types/game';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const rankIcons = [
  <Trophy key="1" className="w-5 h-5 text-yellow-500" />,
  <Medal key="2" className="w-5 h-5 text-gray-400" />,
  <Award key="3" className="w-5 h-5 text-amber-600" />,
];

interface LeaderboardProps {
  className?: string;
}

export function Leaderboard({ className }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | GameMode>('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await leaderboardApi.getLeaderboard(
          filter === 'all' ? undefined : filter
        );
        setEntries(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [filter]);

  return (
    <Card className={cn("w-full max-w-md glass-card border-0", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pass-through">Pass-Through</TabsTrigger>
            <TabsTrigger value="walls">Walls</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-0">
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {entries.slice(0, 10).map((entry, index) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      index < 3 ? "bg-accent" : "bg-card hover:bg-accent/50"
                    )}
                  >
                    <div className="w-8 flex justify-center">
                      {index < 3 ? rankIcons[index] : (
                        <span className="text-muted-foreground font-mono">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{entry.username}</p>
                      <p className="text-xs text-muted-foreground">{entry.date}</p>
                    </div>
                    <Badge variant={entry.mode === 'walls' ? 'default' : 'secondary'} className="text-xs">
                      {entry.mode}
                    </Badge>
                    <span className="font-mono font-bold text-primary">{entry.score}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
