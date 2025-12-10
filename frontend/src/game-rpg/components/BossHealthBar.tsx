// Boss Health Bar Component
// Special health bar displayed at the top for boss enemies

import React from 'react';
import { Enemy } from '../types/entities';

interface BossHealthBarProps {
    boss: Enemy;
}

export function BossHealthBar({ boss }: BossHealthBarProps) {
    const healthPercent = (boss.health / boss.maxHealth) * 100;

    // Boss names
    const bossNames: Record<string, string> = {
        caterpillar_queen: '👑 Caterpillar Queen',
        djinn: '🧞 Ancient Djinn',
        golem: '❄️ Frost Giant',
        frost_giant: '❄️ Frost Giant',
        lava_lord: '🌋 Lava Lord',
        draco: '🐉 Draco the Dragon',
    };

    const bossName = bossNames[boss.type] || boss.type.toUpperCase();

    return (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 pointer-events-none z-50">
            <div className="bg-black/90 backdrop-blur-md border-4 border-red-500/50 rounded-xl p-4 shadow-2xl">
                {/* Boss Name */}
                <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-red-500/50" />
                    <h2 className="text-2xl font-black text-red-400 drop-shadow-lg uppercase tracking-wider">
                        {bossName}
                    </h2>
                    <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-red-500/50" />
                </div>

                {/* Health Bar */}
                <div className="relative">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-xs font-bold text-red-300">BOSS HP</span>
                        <span className="text-sm font-mono font-bold text-white">
                            {boss.health} / {boss.maxHealth}
                        </span>
                    </div>

                    <div className="relative h-8 bg-black/80 rounded-full overflow-hidden border-2 border-red-500/50">
                        {/* Health fill */}
                        <div
                            className="h-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 transition-all duration-300 relative"
                            style={{ width: `${healthPercent}%` }}
                        >
                            {/* Pulse effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />

                            {/* Damage flash effect */}
                            <div className="absolute inset-0 bg-white/30 animate-pulse" style={{
                                animationDuration: '0.3s',
                                opacity: healthPercent < 100 ? 0.3 : 0
                            }} />
                        </div>

                        {/* Damage threshold markers */}
                        <div className="absolute inset-0 flex items-center">
                            {[25, 50, 75].map(threshold => (
                                <div
                                    key={threshold}
                                    className="absolute h-full w-0.5 bg-black/50"
                                    style={{ left: `${threshold}%` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Low health warning */}
                    {healthPercent < 30 && (
                        <div className="absolute -top-1 -right-1 animate-bounce">
                            <span className="text-2xl">⚠️</span>
                        </div>
                    )}
                </div>

                {/* Boss indicator */}
                <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-red-500/30" />
                    <span className="text-xs font-bold text-red-400/70 uppercase tracking-widest">
                        Boss Battle
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-red-500/30" />
                </div>
            </div>
        </div>
    );
}
