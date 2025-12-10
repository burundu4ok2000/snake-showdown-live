import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SnakeGame } from '@/components/game/SnakeGame';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { LivePlayersList } from '@/components/spectator/LivePlayersList';
import { ArenaTutorial } from '@/components/game/ArenaTutorial';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);

  // Show tutorial on first visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('arena_tutorial_seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('arena_tutorial_seen', 'true');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Snake Arena</h1>
          <p className="text-muted-foreground">
            Choose your mode, compete for the top score, and watch others play!
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Game Area */}
          <div className="xl:col-span-2 flex justify-center relative">
            <SnakeGame />

            {/* Tutorial Overlay */}
            {showTutorial && <ArenaTutorial onClose={handleCloseTutorial} />}

            {/* Help Button - Always visible */}
            <button
              onClick={() => setShowTutorial(true)}
              className="absolute top-4 right-4 px-4 py-2 bg-primary/90 hover:bg-primary text-white font-bold rounded-lg shadow-lg transition-all backdrop-blur-sm z-40"
            >
              ❓ Help
            </button>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <Leaderboard />
            <LivePlayersList
              onSelectPlayer={(player) => navigate(`/spectate?player=${player.id}`)}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
