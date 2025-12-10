// RPG UI Component
// HUD overlay showing health, XP, level, etc.

import React from 'react';
import { PlayerState } from '../types/gameState';

interface RPGUIProps {
    player: PlayerState;
    levelName?: string;
    currentLevelId?: number;
    objectives?: Array<{ description: string; completed: boolean }>;
}

export function RPGUI({ player, levelName, currentLevelId }: RPGUIProps) {
    // Calculate XP percentage
    const xpPercent = (player.xp / player.xpToNext) * 100;

    return (
        <div className="w-full">
            <div className="max-w-4xl mx-auto">
                {/* Top HUD */}
                <div className="bg-black/80 backdrop-blur-md border-2 border-white/30 rounded-xl p-4 mb-4 shadow-2xl">
                    <div className="flex items-center justify-between gap-6 flex-wrap">
                        {/* Left Side: Health and Level */}
                        <div className="flex items-center gap-6">
                            {/* Health - Hearts */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-red-300">HP:</span>
                                <div className="flex gap-1">
                                    {Array.from({ length: player.maxHealth }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`relative transition-all duration-200 ${i < player.health ? 'scale-100' : 'scale-90 opacity-40'
                                                }`}
                                        >
                                            {i < player.health ? (
                                                <span className="text-2xl drop-shadow-lg">❤️</span>
                                            ) : (
                                                <span className="text-2xl">🖤</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Player Level */}
                            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 rounded-lg border border-yellow-500/30">
                                <span className="text-xs font-bold text-yellow-300">LVL</span>
                                <span className="text-2xl font-black text-yellow-400 drop-shadow-lg">
                                    {player.level}
                                </span>
                            </div>
                        </div>

                        {/* Center: XP Bar */}
                        <div className="flex-1 min-w-[200px] max-w-md">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-blue-300">EXPERIENCE</span>
                                <span className="text-xs font-mono text-white/70">
                                    {player.xp} / {player.xpToNext}
                                </span>
                            </div>
                            <div className="relative w-full h-4 bg-black/50 rounded-full overflow-hidden border border-blue-500/30">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 relative overflow-hidden"
                                    style={{ width: `${Math.min(xpPercent, 100)}%` }}
                                >
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Resources */}
                        <div className="flex items-center gap-4">
                            {/* Gold */}
                            <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 px-3 py-1.5 rounded-lg border border-yellow-500/30">
                                <span className="text-xl">💰</span>
                                <span className="text-lg font-bold text-yellow-300">
                                    {player.gold}
                                </span>
                            </div>

                            {/* Stars */}
                            <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400/20 to-white/20 px-3 py-1.5 rounded-lg border border-yellow-300/30">
                                <span className="text-xl animate-pulse">⭐</span>
                                <span className="text-lg font-bold text-yellow-200">
                                    {player.stars}
                                </span>
                            </div>

                            {/* Score */}
                            <div className="flex items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 px-3 py-1.5 rounded-lg border border-white/20">
                                <span className="text-xs font-bold text-white/70">SCORE</span>
                                <span className="text-lg font-mono font-bold text-white">
                                    {player.score.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Level Counter */}
                    {currentLevelId && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-white/50">QUEST PROGRESS</span>
                                    <span className="text-sm font-bold text-white">
                                        Level {currentLevelId} / 20
                                    </span>
                                </div>
                                {levelName && (
                                    <span className="text-sm font-semibold text-cyan-300">
                                        {levelName}
                                    </span>
                                )}
                            </div>
                            {/* Progress bar for overall quest */}
                            <div className="mt-2 w-full h-2 bg-black/50 rounded-full overflow-hidden border border-cyan-500/20">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                    style={{ width: `${(currentLevelId / 20) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Active Effects Display */}
                {player.powerups.length > 0 && (
                    <div className="flex gap-2">
                        {player.powerups.map((effect, index) => {
                            const timeLeft = Math.max(0, Math.ceil((effect.expiresAt - Date.now()) / 1000));
                            const icons: Record<string, string> = {
                                speed: '⚡',
                                invincibility: '✨',
                                shield: '🛡️',
                            };
                            const colors: Record<string, string> = {
                                speed: 'border-yellow-400/50 bg-yellow-500/20',
                                invincibility: 'border-purple-400/50 bg-purple-500/20',
                                shield: 'border-blue-400/50 bg-blue-500/20',
                            };

                            return (
                                <div
                                    key={index}
                                    className={`backdrop-blur-md border-2 rounded-lg px-3 py-2 flex items-center gap-2 ${colors[effect.type]}`}
                                >
                                    <span className="text-2xl animate-pulse">{icons[effect.type]}</span>
                                    <span className="text-sm font-bold text-white">
                                        {timeLeft}s
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
