// Tutorial Tooltip Component
// Shows helpful tips for RPG mode on first play

import React from 'react';

interface TutorialTooltipProps {
    onClose: () => void;
}

export function TutorialTooltip({ onClose }: TutorialTooltipProps) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto p-2">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500/60 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-t-xl text-center">
                    <div className="text-5xl mb-2">🐍⚔️</div>
                    <h2 className="text-2xl font-bold text-white mb-1">Welcome to Snake Quest RPG!</h2>
                    <p className="text-white/90 text-xs">Your adventure awaits - here's everything you need to know</p>
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
                                    <kbd className="px-3 py-2 bg-gray-700/80 rounded font-mono text-sm">P</kbd>
                                    <span className="text-white/70">or</span>
                                    <kbd className="px-3 py-2 bg-gray-700/80 rounded font-mono text-sm">ESC</kbd>
                                    <span>Pause</span>
                                </div>
                            </div>
                        </div>

                        {/* Win Condition */}
                        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-xl p-3 border border-yellow-500/30">
                            <h3 className="font-bold text-lg mb-2 text-yellow-300 flex items-center gap-2">
                                <span>🎯</span> How to Win
                            </h3>
                            <p className="text-white/90 mb-1.5 text-xs">Complete ALL 3 objectives:</p>
                            <div className="space-y-1 text-white/90 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400 text-lg">✓</span>
                                    <span>Kill all enemies</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400 text-lg">✓</span>
                                    <span>Collect all stars ⭐</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400 text-lg">✓</span>
                                    <span>Reach the exit 🚪</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Game Elements */}
                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-3 border border-purple-500/30">
                        <h3 className="font-bold text-lg mb-2 text-purple-300 flex items-center gap-2">
                            <span>🎨</span> What You'll See
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-white/90 text-sm">
                            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-green-300"></div>
                                <div>
                                    <div className="font-semibold">Your Snake</div>
                                    <div className="text-xs text-white/60">That's you!</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                                <div className="w-8 h-8 bg-red-500 rounded shadow-lg shadow-red-500/50"></div>
                                <div>
                                    <div className="font-semibold text-red-300">Enemies</div>
                                    <div className="text-xs text-white/60">Red glow = danger!</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                                <div className="text-3xl">⭐</div>
                                <div>
                                    <div className="font-semibold text-yellow-300">Stars</div>
                                    <div className="text-xs text-white/60">Must collect!</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                                <div className="w-8 h-8 bg-blue-500 rounded shadow-lg shadow-blue-500/50"></div>
                                <div>
                                    <div className="font-semibold text-blue-300">Shield 🛡️</div>
                                    <div className="text-xs text-white/60">Blocks 1 attack</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                                <div className="text-3xl">⚡</div>
                                <div>
                                    <div className="font-semibold text-yellow-300">Lightning</div>
                                    <div className="text-xs text-white/60">Invincible 2s!</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                                <div className="text-3xl">🍎</div>
                                <div>
                                    <div className="font-semibold text-red-300">Food</div>
                                    <div className="text-xs text-white/60">Heals you</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Combat */}
                    <div className="bg-gradient-to-br from-red-900/30 to-orange-900/20 rounded-xl p-3 border border-red-500/30">
                        <h3 className="font-bold text-lg mb-2 text-red-300 flex items-center gap-2">
                            <span>⚔️</span> Combat System (IMPORTANT!)
                        </h3>
                        <div className="grid md:grid-cols-2 gap-2 text-white/90 text-sm">
                            <div className="bg-black/20 p-2 rounded-lg">
                                <div className="font-semibold text-green-400 mb-0.5 text-sm">✓ One-Shot Kills</div>
                                <div className="text-xs text-white/70">Weak enemies (HP=1) die instantly - you take NO damage!</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg">
                                <div className="font-semibold text-orange-400 mb-0.5 text-sm">⚠️ Tough Enemies</div>
                                <div className="text-xs text-white/70">Strong enemies need multiple hits - they WILL damage you!</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg">
                                <div className="font-semibold text-blue-400 mb-0.5 text-sm">❤️ Healing</div>
                                <div className="text-xs text-white/70">Collect apples 🍎 and meat 🥩 to restore health</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg">
                                <div className="font-semibold text-yellow-400 mb-0.5 text-sm">⚡ Invincibility</div>
                                <div className="text-xs text-white/70">Lightning makes you invincible for 2 seconds!</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                        Got it! Let's Play! 🎮
                    </button>
                    <p className="text-center text-white/50 text-xs mt-2">Press "❓ Help" anytime to see this again</p>
                </div>
            </div>
        </div>
    );
}
