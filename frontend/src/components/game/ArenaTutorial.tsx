// Arena Tutorial Component
// Compact and beautiful tutorial for Arena mode

import React from 'react';

interface ArenaTutorialProps {
    onClose: () => void;
}

export function ArenaTutorial({ onClose }: ArenaTutorialProps) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto p-2">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-primary/60 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Compact Header */}
                <div className="bg-gradient-to-r from-primary to-pink-500 p-5 rounded-t-xl text-center">
                    <div className="text-4xl mb-2">🐍</div>
                    <h2 className="text-xl font-bold text-white mb-1">Snake Arena Quick Guide</h2>
                    <p className="text-white/80 text-xs">Everything you need to know!</p>
                </div>

                <div className="p-5 space-y-4">
                    {/* Controls & Goal - Side by side */}
                    <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 rounded-lg p-4 border border-cyan-500/30">
                            <h3 className="font-bold text-base mb-2 text-cyan-300 flex items-center gap-2">
                                <span className="text-xl">🎮</span> Controls
                            </h3>
                            <div className="space-y-1.5 text-sm text-white/90">
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-gray-700/80 rounded font-mono text-xs">WASD</kbd>
                                    <span className="text-white/60">or</span>
                                    <kbd className="px-2 py-1 bg-gray-700/80 rounded font-mono text-xs">Arrows</kbd>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-gray-700/80 rounded font-mono text-xs">SPACE</kbd>
                                    <span className="text-white/70">Pause</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 rounded-lg p-4 border border-yellow-500/30">
                            <h3 className="font-bold text-base mb-2 text-yellow-300 flex items-center gap-2">
                                <span className="text-xl">🎯</span> Goal
                            </h3>
                            <div className="space-y-1 text-sm text-white/90">
                                <div>🍎 Eat food to grow</div>
                                <div>💀 Don't hit yourself</div>
                                <div>🧱 Avoid walls (if enabled)</div>
                            </div>
                        </div>
                    </div>

                    {/* Modes - Compact */}
                    <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-lg p-4 border border-purple-500/30">
                        <h3 className="font-bold text-base mb-3 text-purple-300 flex items-center gap-2">
                            <span className="text-xl">🔀</span> Modes & Difficulty
                        </h3>
                        <div className="flex gap-3 text-sm">
                            <div className="flex-1 bg-black/30 rounded p-2 text-center">
                                <div className="text-xl mb-1">🌀</div>
                                <div className="font-semibold text-green-400 text-xs">Pass-Through</div>
                                <div className="text-white/60 text-xs">Easier</div>
                            </div>
                            <div className="flex-1 bg-black/30 rounded p-2 text-center">
                                <div className="text-xl mb-1">🧱</div>
                                <div className="font-semibold text-red-400 text-xs">Walls</div>
                                <div className="text-white/60 text-xs">Harder</div>
                            </div>
                            <div className="flex-1 bg-black/30 rounded p-2 text-center">
                                <div className="text-xl mb-1">⚡</div>
                                <div className="font-semibold text-orange-400 text-xs">Difficulty</div>
                                <div className="text-white/60 text-xs">×0.8 to ×2.0</div>
                            </div>
                        </div>
                    </div>

                    {/* Power-ups - Grid */}
                    <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 rounded-lg p-4 border border-pink-500/30">
                        <h3 className="font-bold text-base mb-3 text-pink-300 flex items-center gap-2">
                            <span className="text-xl">⚡</span> Power-Ups
                        </h3>
                        <div className="grid grid-cols-5 gap-2 text-center text-xs">
                            <div className="bg-black/30 rounded p-2">
                                <div className="text-2xl">🚀</div>
                                <div className="text-blue-400 font-semibold mt-1">Speed</div>
                            </div>
                            <div className="bg-black/30 rounded p-2">
                                <div className="text-2xl">🐢</div>
                                <div className="text-green-400 font-semibold mt-1">Slow</div>
                            </div>
                            <div className="bg-black/30 rounded p-2">
                                <div className="text-2xl">🛡️</div>
                                <div className="text-yellow-400 font-semibold mt-1">Shield</div>
                            </div>
                            <div className="bg-black/30 rounded p-2">
                                <div className="text-2xl">💎</div>
                                <div className="text-purple-400 font-semibold mt-1">×2 Pts</div>
                            </div>
                            <div className="bg-black/30 rounded p-2">
                                <div className="text-2xl">🌟</div>
                                <div className="text-pink-400 font-semibold mt-1">Invincible</div>
                            </div>
                        </div>
                        <p className="text-center text-white/60 text-xs mt-2">15% spawn chance after eating</p>
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-3 border border-yellow-500/30">
                        <div className="text-sm text-yellow-300 font-semibold mb-1">💡 Pro Tip</div>
                        <div className="text-xs text-white/80">
                            Harder difficulty = More points! Impossible (×2.0) + Double Points (×2.0) = <strong className="text-yellow-400">×4 score!</strong>
                        </div>
                    </div>
                </div>

                {/* Compact Footer */}
                <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white font-bold rounded-lg text-base transition-all transform hover:scale-105 shadow-lg"
                    >
                        Got it! Let's Play! 🎮
                    </button>
                    <p className="text-center text-white/40 text-xs mt-2">Press ❓ Help to see this again</p>
                </div>
            </div>
        </div>
    );
}
