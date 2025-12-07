import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';

export function LeaderboardPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            See who's dominating Snake Arena!
          </p>
        </div>

        <div className="flex justify-center">
          <Leaderboard className="max-w-2xl w-full" />
        </div>
      </div>
    </Layout>
  );
}

export default LeaderboardPage;
