import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { LivePlayersList } from '@/components/spectator/LivePlayersList';
import { SpectatorView } from '@/components/spectator/SpectatorView';
import { livePlayersApi } from '@/services/api';
import { LivePlayer } from '@/types/game';

export function SpectatePage() {
  const [searchParams] = useSearchParams();
  const [selectedPlayer, setSelectedPlayer] = useState<LivePlayer | null>(null);

  useEffect(() => {
    const playerId = searchParams.get('player');
    if (playerId) {
      livePlayersApi.getPlayerById(playerId).then((player) => {
        if (player) setSelectedPlayer(player);
      });
    }
  }, [searchParams]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Spectate Mode</h1>
          <p className="text-muted-foreground">
            Watch other players compete in real-time!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LivePlayersList
            onSelectPlayer={setSelectedPlayer}
            selectedPlayerId={selectedPlayer?.id}
          />
          
          {selectedPlayer ? (
            <SpectatorView
              player={selectedPlayer}
              onClose={() => setSelectedPlayer(null)}
            />
          ) : (
            <div className="flex items-center justify-center bg-card rounded-lg border border-border p-12 text-center">
              <div>
                <p className="text-xl text-muted-foreground mb-2">Select a player to watch</p>
                <p className="text-sm text-muted-foreground/70">
                  Click on any live player from the list to start spectating their game
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default SpectatePage;
