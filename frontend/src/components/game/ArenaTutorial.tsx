// Arena Tutorial Component
// Shows helpful tips for Arena mode on first play

import React from 'react';

interface ArenaTutorialProps {
    onClose: () => void;
}

export function ArenaTutorial({ onClose }: ArenaTutorialProps) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto p-2">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-primary/60 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-pink-500 p-4 rounded-t-xl text-center">
                    <div className="text-5xl mb-2">🐍🎮</div>
                    <h2 className="text-2xl font-bold text-white mb-1">Welcome to Snake Arena!</h2>
                    <p className="text-white/90 text-xs">Classic snake with epic power-ups and effects!</p>
                </div>

                <div className="p-4 space-y-3">
                    {/* Two column layout */}
                    <div className="grid md:grid-cols-2 gap-3">
                        {/* Controls */}
                        <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-xl p-3 border border-cyan-500/30">
                            <h3 className="font-bold text-lg mb-2 text-cyan-300 flex items-center gap-2">
                                <span>🕹️</span> Controls
                            </h3>
                            <div className="space-y-1.5 text-white/90 text-sm">
                                <div className="flex items-center gap-2">
                                    <kbd className="px-3 py-2 bg-gray-700/80 rounded font-mono text-sm">WASD</kbd>
                                    <span className="text-white/70">or</span>
                                    <kbd className="px-3 py-2 bg-gray-700/80 rounded font-mono text-sm">↑↓←→</kbd>
                                    <span>Move</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-3 py-2 bg-gray-700/80 rounded font-mono text-sm">SPACE</kbd>
                                    <span>Pause</span>
                                </div>
                                <div className="text-xs text-white/60 mt-2">
                                    📱 Mobile: Touch screen D-pad controls
                                </div>
                            </div>
                        </div>

                        {/* Goal */}
                        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-xl p-3 border border-yellow-500/30">
                            <h3 className="font-bold text-lg mb-2 text-yellow-300 flex items-center gap-2">
                                <span>🎯</span> How to Win
                            </h3>
                            <div className="space-y-1 text-white/90 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400">🍎</span>
                                    <span>Eat food to grow & score points</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-red-400">💀</span>
                                    <span>Don't hit yourself!</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-400">🧱</span>
                                    <span>Walls mode: Don't hit edges</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Game Modes */}
                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-3 border border-purple-500/30">
                        <h3 className="font-bold text-lg mb-2 text-purple-300 flex items-center gap-2">
                            <span>🎮</span> Game Modes
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-white/90 text-sm">
                            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                                <div className="text-3xl">🌀</div>
                                <div>
                                    <div className="font-semibold text-green-400">Pass-Through</div>
                                    <div className="text-xs text-white/60">Cross edges (easier)</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                                <div className="text-3xl">🧱</div>
                                <div>
                                    <div className="font-semibold text-red-400">Walls</div>
                                    <div className="text-xs text-white/60">Hit wall = death!</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Power-ups */}
                    <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 rounded-xl p-3 border border-pink-500/30">
                        <h3 className="font-bold text-lg mb-2 text-pink-300 flex items-center gap-2">
                            <span>⚡</span> Power-Ups (15% spawn chance)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-white/90 text-xs">
                            <div className="bg-black/20 p-2 rounded-lg">
                                <div className="text-2xl mb-1">🚀</div>
                                <div className="font-semibold text-blue-400">Speed Boost</div>
                                <div className="text-white/60">1.5× faster, 5s</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg">
                                <div className="text-2xl mb-1">🐢</div>
                                <div className="font-semibold text-green-400">Slow Motion</div>
                                <div className="text-white/60">0.67× slower, 7s</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg">
                                <div className="text-2xl mb-1">🛡️</div>
                                <div className="font-semibold text-yellow-400">Shield</div>
                                <div className="text-white/60">Blocks 1 death!</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg">
                                <div className="text-2xl mb-1">💎</div>
                                <div className="font-semibold text-purple-400">Double Points</div>
                                <div className="text-white/60">×2 score, 10s</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg">
                                <div className="text-2xl mb-1">🌟</div>
                                <div className="font-semibold text-pink-400">Invincibility</div>
                                <div className="text-white/60">No self-hit, 5s</div>
                            </div>
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div className="bg-gradient-to-br from-orange-900/30 to-red-900/20 rounded-xl p-3 border border-orange-500/30">
                        <h3 className="font-bold text-lg mb-2 text-orange-300 flex items-center gap-2">
                            <span>🏆</span> Difficulty = More Points!
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                            <div className="bg-black/20 p-2 rounded-lg text-center">
                                <div className="text-lg mb-1">🟢</div>
                                <div className="font-semibold text-green-400">Easy</div>
                                <div className="text-white/60">×0.8 points</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg text-center">
                                <div className="text-lg mb-1">🟡</div>
                                <div className="font-semibold text-yellow-400">Normal</div>
                                <div className="text-white/60">×1.0 points</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg text-center">
                                <div className="text-lg mb-1">🟠</div>
                                <div className="font-semibold text-orange-400">Hard</div>
                                <div className="text-white/60">×1.3 points</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg text-center">
                                <div className="text-lg mb-1">🔴</div>
                                <div className="font-semibold text-red-400">Nightmare</div>
                                <div className="text-white/60">×1.5 points</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg text-center">
                                <div className="text-lg mb-1">💀</div>
                                <div className="font-semibold text-purple-400">Impossible</div>
                                <div className="text-white/60">×2.0 points!</div>
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-yellow-300 bg-black/20 p-2 rounded">
                            💡 <strong>Pro Tip:</strong> Impossible + Double Points = ×4 score (40 points per food!)
                        </div>
                    </div>

                    {/* Spectate */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 rounded-xl p-3 border border-blue-500/30">
                        <h3 className="font-bold text-lg mb-2 text-blue-300 flex items-center gap-2">
                            <span>👀</span> Spectate Mode
                        </h3>
                        <p className="text-white/90 text-sm">
                            Watch other players in real-time! See live scores, modes, and difficulty levels. Perfect for learning and community events!
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white font-bold rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                        Got it! Let's Play! 🎮
                    </button>
                    <p className="text-center text-white/50 text-xs mt-2">Press "❓ Help" button anytime to see this again</p>
                </div>
            </div>
        </div>
    );
}
