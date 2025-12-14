import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { getRPGLeaderboard, RPGLeaderboardEntry } from '@/services/rpg-api';
import { Trophy, Clock, Star } from 'lucide-react';

export default function RPGLeaderboardPage() {
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [leaderboard, setLeaderboard] = useState<RPGLeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadLeaderboard();
    }, [selectedLevel]);

    const loadLeaderboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRPGLeaderboard(selectedLevel, 10);
            setLeaderboard(data);
        } catch (err) {
            setError('Failed to load leaderboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
                        <Trophy className="w-10 h-10 text-yellow-500" />
                        RPG Leaderboard
                    </h1>
                    <p className="text-muted-foreground">
                        Top scores for each level - compete with players worldwide!
                    </p>
                </div>

                {/* Level Selector */}
                <div className="max-w-5xl mx-auto mb-6">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 border border-primary/30">
                        <label className="text-sm font-semibold text-primary mb-3 block">
                            Select Level (1-20)
                        </label>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setSelectedLevel(level)}
                                    className={`px-3 py-2 rounded-lg font-bold transition-all ${selectedLevel === level
                                            ? 'bg-primary text-white shadow-lg shadow-primary/50'
                                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border-2 border-primary/60 overflow-hidden shadow-2xl">
                        {/* Table Header */}
                        <div className="bg-gradient-to-r from-primary to-pink-500 px-6 py-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                Level {selectedLevel} - Top 10
                            </h2>
                        </div>

                        {/* Loading/Error States */}
                        {loading && (
                            <div className="p-12 text-center text-white/70">
                                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                                Loading leaderboard...
                            </div>
                        )}

                        {error && (
                            <div className="p-12 text-center text-red-400">
                                {error}
                                <button
                                    onClick={loadLeaderboard}
                                    className="block mx-auto mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Table Content */}
                        {!loading && !error && (
                            <>
                                {leaderboard.length === 0 ? (
                                    <div className="p-12 text-center text-white/50">
                                        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p className="text-lg">No scores yet for this level!</p>
                                        <p className="text-sm mt-2">Be the first to complete it!</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-800/50">
                                                <tr className="text-left text-sm text-gray-300">
                                                    <th className="px-6 py-3 w-16">Rank</th>
                                                    <th className="px-6 py-3">Player</th>
                                                    <th className="px-6 py-3 text-right">Score</th>
                                                    <th className="px-6 py-3 text-right">Time</th>
                                                    <th className="px-6 py-3 text-right">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-700/50">
                                                {leaderboard.map((entry) => (
                                                    <tr
                                                        key={entry.rank}
                                                        className={`transition-colors hover:bg-gray-700/30 ${entry.rank === 1
                                                                ? 'bg-yellow-500/10'
                                                                : entry.rank === 2
                                                                    ? 'bg-gray-400/10'
                                                                    : entry.rank === 3
                                                                        ? 'bg-orange-700/10'
                                                                        : ''
                                                            }`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                {entry.rank === 1 && (
                                                                    <span className="text-2xl mr-2">🥇</span>
                                                                )}
                                                                {entry.rank === 2 && (
                                                                    <span className="text-2xl mr-2">🥈</span>
                                                                )}
                                                                {entry.rank === 3 && (
                                                                    <span className="text-2xl mr-2">🥉</span>
                                                                )}
                                                                <span
                                                                    className={`font-bold ${entry.rank <= 3
                                                                            ? 'text-yellow-400'
                                                                            : 'text-gray-400'
                                                                        }`}
                                                                >
                                                                    #{entry.rank}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-semibold text-white">
                                                                {entry.username}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className="font-mono font-bold text-primary">
                                                                {entry.score.toLocaleString()}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className="font-mono text-blue-400 flex items-center justify-end gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                {formatTime(entry.time_seconds)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right text-sm text-gray-400">
                                                            {new Date(entry.completed_at).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/30">
                        <p className="text-sm text-white/80">
                            <strong className="text-blue-300">💡 Tip:</strong> Leaderboard ranks by highest score first, then fastest time as tiebreaker. Complete levels to submit your score!
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
