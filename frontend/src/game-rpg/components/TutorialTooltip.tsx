// Tutorial Tooltip Component
// Compact and beautiful tutorial for RPG mode

import React from 'react';

interface TutorialTooltipProps {
    onClose: () => void;
}

export function TutorialTooltip({ onClose }: TutorialTooltipProps) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto p-2">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500/60 rounded-2xl max-w-7xl w-[95%] max-h-[92vh] overflow-y-auto shadow-2xl">
                {/* Compact Header */}
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-t-xl text-center">
                    <div className="text-4xl mb-2">🐍⚔️</div>
                    <h2 className="text-xl font-bold text-white mb-1">Welcome to Snake Quest RPG!</h2>
                    <p className="text-white/90 text-xs">Your epic adventure guide</p>
                </div>

                <div className="p-4 space-y-3">
                    {/* Controls & Goal */}
                    <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-lg p-3 border border-cyan-500/30">
                            <h3 className="font-bold text-base mb-2 text-cyan-300 flex items-center gap-2">
                                <span className="text-lg">🕹️</span> Controls
                            </h3>
                            <div className="space-y-1.5 text-sm text-white/90">
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-gray-700/80 rounded font-mono text-xs">WASD</kbd>
                                    <span className="text-white/60">or</span>
                                    <kbd className="px-2 py-1 bg-gray-700/80 rounded font-mono text-xs">Arrows</kbd>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-gray-700/80 rounded font-mono text-xs">P/ESC</kbd>
                                    <span className="text-white/70">Pause</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-lg p-3 border border-yellow-500/30">
                            <h3 className="font-bold text-base mb-2 text-yellow-300 flex items-center gap-2">
                                <span className="text-lg">🎯</span> How to Win
                            </h3>
                            <div className="space-y-1 text-sm text-white/90">
                                <div>✓ Kill all enemies</div>
                                <div>✓ Collect all stars ⭐</div>
                                <div>✓ Reach the exit 🚪</div>
                            </div>
                        </div>
                    </div>

                    {/* Game Elements */}
                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-3 border border-purple-500/30">
                        <h3 className="font-bold text-base mb-2 text-purple-300 flex items-center gap-2">
                            <span className="text-lg">🎨</span> What You'll See
                        </h3>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                            <div className="bg-black/20 p-2 rounded text-center">
                                <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-1"></div>
                                <div className="font-semibold text-green-300">You</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded text-center">
                                <div className="w-6 h-6 bg-red-500 rounded mx-auto mb-1 shadow-lg shadow-red-500/50"></div>
                                <div className="font-semibold text-red-300">Enemies</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded text-center">
                                <div className="text-2xl">⭐</div>
                                <div className="font-semibold text-yellow-300">Stars</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded text-center">
                                <div className="text-2xl">🛡️</div>
                                <div className="font-semibold text-blue-300">Shield</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded text-center">
                                <div className="text-2xl">⚡</div>
                                <div className="font-semibold text-yellow-300">Lightning</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded text-center">
                                <div className="text-2xl">🍎</div>
                                <div className="font-semibold text-red-300">Food</div>
                            </div>
                        </div>
                    </div>

                    {/* Combat */}
                    <div className="bg-gradient-to-br from-red-900/30 to-orange-900/20 rounded-lg p-3 border border-red-500/30">
                        <h3 className="font-bold text-base mb-2 text-red-300 flex items-center gap-2">
                            <span className="text-lg">⚔️</span> Combat System
                        </h3>
                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                            <div className="bg-black/20 p-2 rounded">
                                <div className="font-semibold text-green-400 mb-0.5 text-sm">✓ Weak Enemies (HP=1)</div>
                                <div className="text-xs text-white/70">One-shot kill, no damage to you!</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded">
                                <div className="font-semibold text-orange-400 mb-0.5 text-sm">⚠️ Strong Enemies</div>
                                <div className="text-xs text-white/70">Multiple hits needed, they damage you!</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded">
                                <div className="font-semibold text-blue-400 mb-0.5 text-sm">❤️ Healing</div>
                                <div className="text-xs text-white/70">Apples 🍎 and meat 🥩 restore health</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded">
                                <div className="font-semibold text-yellow-400 mb-0.5 text-sm">⚡ Invincibility</div>
                                <div className="text-xs text-white/70">Lightning = 2 seconds god mode!</div>
                            </div>
                        </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-3 border border-yellow-500/30">
                        <div className="text-sm text-yellow-300 font-semibold mb-1">💡 Pro Tip</div>
                        <div className="text-xs text-white/80">
                            Enemies with RED GLOW are dangerous! Door PULSES GREEN when ready to enter. Shield blocks 1 attack, Lightning gives invincibility!
                        </div>
                    </div>
                </div>

                {/* Compact Footer */}
                <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg text-base transition-all transform hover:scale-105 shadow-lg"
                    >
                        Got it! Let's Play! 🎮
                    </button>
                    <p className="text-center text-white/50 text-xs mt-2">Press "❓ Help" anytime to see this again</p>
                </div>
            </div>
        </div>
    );
}
