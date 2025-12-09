import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Volume2, Gamepad2, Trophy, Eye, Smartphone } from 'lucide-react';

export function HowToPlayPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Game
                    </Link>

                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-pink-500 to-violet-500 bg-clip-text text-transparent mb-4">
                        🐍 How to Play Snake Arena
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Master the ultimate snake experience with power-ups, difficulty levels, and epic effects!
                    </p>
                </div>

                {/* Quick Start */}
                <section className="glass-card p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Gamepad2 className="w-6 h-6 text-primary" />
                        Quick Start
                    </h2>
                    <div className="space-y-3 text-muted-foreground">
                        <p>🎮 <strong>Controls:</strong> Use WASD or Arrow Keys (Desktop) or Touch D-Pad (Mobile)</p>
                        <p>🍎 <strong>Goal:</strong> Eat food to grow and score points</p>
                        <p>💀 <strong>Avoid:</strong> Hitting walls (in Walls mode) or yourself (unless you have Invincibility!)</p>
                        <p>⏸️ <strong>Pause:</strong> Press Space or click Pause button</p>
                    </div>
                </section>

                {/* Game Modes */}
                <section className="glass-card p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">🎮 Game Modes</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-background/60 p-4 rounded-lg border border-white/10">
                            <h3 className="text-xl font-semibold mb-2 text-green-400">🌀 Pass-Through (Classic)</h3>
                            <p className="text-sm text-muted-foreground">
                                Cross the edges to appear on the opposite side. Perfect for beginners!
                            </p>
                        </div>
                        <div className="bg-background/60 p-4 rounded-lg border border-white/10">
                            <h3 className="text-xl font-semibold mb-2 text-red-400">🧱 Walls (Hardcore)</h3>
                            <p className="text-sm text-muted-foreground">
                                Hit the walls and it's game over! For experienced players.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Difficulty Levels */}
                <section className="glass-card p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        Difficulty Levels
                    </h2>
                    <div className="space-y-3">
                        {[
                            { emoji: '🟢', name: 'Easy', speed: '150ms', multi: '×0.8', desc: 'Perfect for learning' },
                            { emoji: '🟡', name: 'Normal', speed: '100ms', multi: '×1.0', desc: 'Classic experience' },
                            { emoji: '🟠', name: 'Hard', speed: '70ms', multi: '×1.3', desc: 'Fast-paced action' },
                            { emoji: '🔴', name: 'Nightmare', speed: '50ms', multi: '×1.5', desc: 'Expert level' },
                            { emoji: '💀', name: 'Impossible', speed: '30ms', multi: '×2.0', desc: 'Insane speed!' },
                        ].map((diff) => (
                            <div key={diff.name} className="bg-background/60 p-3 rounded-lg border border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{diff.emoji}</span>
                                    <div>
                                        <p className="font-semibold">{diff.name}</p>
                                        <p className="text-xs text-muted-foreground">{diff.desc}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-mono">{diff.speed}</p>
                                    <p className="text-xs text-primary font-bold">{diff.multi} points</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        💡 <strong>Pro Tip:</strong> Harder = More Points! Impossible gives 20 points per food!
                    </p>
                </section>

                {/* Power-Ups */}
                <section className="glass-card p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        Power-Ups
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        15% chance to spawn after eating food. Collect them for powerful effects!
                    </p>
                    <div className="space-y-4">
                        {[
                            {
                                emoji: '🚀',
                                name: 'Speed Boost',
                                duration: '5s',
                                color: 'text-blue-400',
                                effect: 'Move 1.5× faster + 50% score bonus',
                                tip: 'Great for speedruns and high scores!',
                            },
                            {
                                emoji: '🐢',
                                name: 'Slow Motion',
                                duration: '7s',
                                color: 'text-green-400',
                                effect: 'Slow down to 0.67× speed',
                                tip: 'Perfect for difficult situations!',
                            },
                            {
                                emoji: '🛡️',
                                name: 'Shield',
                                duration: 'Until used',
                                color: 'text-yellow-400',
                                effect: 'Block ONE collision/death',
                                tip: 'Your second chance! Saves you once.',
                            },
                            {
                                emoji: '💎',
                                name: 'Double Points',
                                duration: '10s',
                                color: 'text-purple-400',
                                effect: 'Score ×2 multiplier',
                                tip: 'Combo with Impossible for ×4 points!',
                            },
                            {
                                emoji: '🌟',
                                name: 'Invincibility',
                                duration: '5s',
                                color: 'text-pink-400',
                                effect: 'Pass through yourself!',
                                tip: 'God mode activated! No self-collision.',
                            },
                        ].map((powerup) => (
                            <div key={powerup.name} className="bg-background/60 p-4 rounded-lg border border-white/10">
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl">{powerup.emoji}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`text-lg font-semibold ${powerup.color}`}>
                                                {powerup.name}
                                            </h3>
                                            <span className="text-xs text-muted-foreground">{powerup.duration}</span>
                                        </div>
                                        <p className="text-sm mb-2">{powerup.effect}</p>
                                        <p className="text-xs text-muted-foreground italic">💡 {powerup.tip}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pro Combos */}
                <section className="glass-card p-6 mb-8 border-2 border-yellow-500/30">
                    <h2 className="text-2xl font-bold mb-4">🔥 Pro Combos</h2>
                    <div className="space-y-3">
                        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 rounded-lg border border-yellow-500/30">
                            <h3 className="font-semibold text-yellow-400 mb-2">⚡ "Speedrun King"</h3>
                            <p className="text-sm text-muted-foreground mb-1">
                                Impossible + Speed Boost + Double Points
                            </p>
                            <p className="text-xs text-primary">
                                = 40 points per food at lightning speed! 2000+ score possible in 1 minute!
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-green-500/10 to-yellow-500/10 p-4 rounded-lg border border-green-500/30">
                            <h3 className="font-semibold text-green-400 mb-2">🛡️ "Immortal Tank"</h3>
                            <p className="text-sm text-muted-foreground mb-1">
                                Shield + Invincibility + Slow Motion
                            </p>
                            <p className="text-xs text-primary">
                                = Unkillable for 5 seconds! Perfect escape from danger.
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-4 rounded-lg border border-pink-500/30">
                            <h3 className="font-semibold text-pink-400 mb-2">💰 "Money Maker"</h3>
                            <p className="text-sm text-muted-foreground mb-1">
                                Impossible (×2.0) + Double Points (×2.0)
                            </p>
                            <p className="text-xs text-primary">
                                = ×4 SCORE MULTIPLIER! 40 points per apple! 🤑
                            </p>
                        </div>
                    </div>
                </section>

                {/* Visual Effects */}
                <section className="glass-card p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Volume2 className="w-6 h-6 text-primary" />
                        Effects & Polish
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-sm">🎵 <strong>Sound Effects:</strong> Retro beeps generated in-browser</p>
                            <p className="text-sm">🎆 <strong>Particles:</strong> Colorful explosions when eating</p>
                            <p className="text-sm">💥 <strong>Death Effect:</strong> Epic explosion + screen shake</p>
                            <p className="text-sm">🌈 <strong>Trail:</strong> Snake fades from head to tail</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm">✨ <strong>Glow:</strong> Power-ups pulse with color</p>
                            <p className="text-sm">⏱️ <strong>Timers:</strong> Live countdown for active effects</p>
                            <p className="text-sm">🎯 <strong>Badge:</strong> Shows current difficulty</p>
                            <p className="text-sm">🔇 <strong>Mute:</strong> Toggle sounds anytime</p>
                        </div>
                    </div>
                </section>

                {/* Live Mode */}
                <section className="glass-card p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Eye className="w-6 h-6 text-primary" />
                        Live Spectator Mode
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        Watch other players in real-time! See who's playing right now and their current scores.
                    </p>
                    <div className="bg-background/60 p-4 rounded-lg border border-white/10">
                        <p className="text-sm mb-2">👀 <strong>Features:</strong></p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                            <li>• Real-time player list with live updates</li>
                            <li>• See current score, mode, and difficulty</li>
                            <li>• Auto-updates every second</li>
                            <li>• Perfect for community events!</li>
                        </ul>
                    </div>
                </section>

                {/* Mobile */}
                <section className="glass-card p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Smartphone className="w-6 h-6 text-primary" />
                        Mobile & PWA
                    </h2>
                    <div className="space-y-3 text-muted-foreground">
                        <p>📱 <strong>Touch Controls:</strong> Responsive D-pad for mobile devices</p>
                        <p>📲 <strong>Install as App:</strong> Add to home screen for full-screen experience</p>
                        <p>🚀 <strong>Standalone Mode:</strong> Runs like a native app</p>
                        <p>📶 <strong>Offline Ready:</strong> Play even without internet (coming soon!)</p>
                    </div>
                </section>

                {/* Tips & Tricks */}
                <section className="glass-card p-6 mb-8 bg-gradient-to-br from-primary/5 to-pink/5">
                    <h2 className="text-2xl font-bold mb-4">💡 Pro Tips</h2>
                    <div className="space-y-2 text-sm">
                        <p>✅ Start with Easy/Normal to learn, then increase difficulty</p>
                        <p>✅ Power-ups appear randomly - grab them fast before they disappear!</p>
                        <p>✅ Shield shows "∞" - it's permanent until you use it</p>
                        <p>✅ Speed Boost on Impossible = 20ms speed (INSANE!)</p>
                        <p>✅ Slow Motion can make Impossible feel like Normal</p>
                        <p>✅ Invincibility lets you do loops - use it strategically!</p>
                        <p>✅ Double Points + high difficulty = massive scores</p>
                        <p>✅ Watch the active effects panel to plan your moves</p>
                        <p>✅ Mute button in header if sounds get annoying</p>
                        <p>✅ Challenge friends to beat your high score!</p>
                    </div>
                </section>

                {/* Footer CTA */}
                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg"
                    >
                        🎮 Start Playing Now!
                    </Link>
                    <p className="text-muted-foreground mt-4 text-sm">
                        Ready to become a Snake Arena legend? 🏆
                    </p>
                </div>
            </div>
        </div>
    );
}
