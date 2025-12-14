import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useRPGGame } from '../game-rpg/hooks/useRPGGame';
import { RPGCanvas } from '../game-rpg/components/RPGCanvas';
import { RPGUI } from '../game-rpg/components/RPGUI';
import { BossHealthBar } from '../game-rpg/components/BossHealthBar';
import { TutorialTooltip } from '../game-rpg/components/TutorialTooltip';
import { useAuth } from '@/contexts/AuthContext';

export default function RPGPage() {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);
    const gameContainerRef = useRef<HTMLDivElement>(null);

    // Developer mode - only for specific user
    const isDevMode = user?.email === 'burundu4ok2000@outlook.com';

    const {
        gameState,
        startGame,
        pauseGame,
        resumeGame,
        resetGame,
        nextLevel,
    } = useRPGGame(isDevMode);

    // Show tutorial on first visit
    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('rpg_tutorial_seen');
        if (!hasSeenTutorial && gameState.status === 'menu') {
            setShowTutorial(true);
        }
    }, [gameState.status]);

    // Auto-scroll to game area when playing
    useEffect(() => {
        if (gameState.status === 'playing' && gameContainerRef.current) {
            // Scroll with smooth animation
            gameContainerRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [gameState.status]);

    const handleCloseTutorial = () => {
        setShowTutorial(false);
        localStorage.setItem('rpg_tutorial_seen', 'true');
    };

    const handleStart = () => {
        startGame(1); // Start Level 1
    };

    // Find boss enemy if present
    const bossEnemy = gameState.status === 'playing' && gameState.enemies.find(enemy =>
        enemy.type === 'caterpillar_queen' ||
        enemy.type === 'draco'
    );

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Hide title when menu is shown to avoid overlap */}
                {gameState.status !== 'menu' && (
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            Snake Quest RPG
                        </h1>
                        <p className="text-muted-foreground">
                            Embark on an epic adventure through 20 levels of serpent-powered action!
                        </p>
                    </div>
                )}

                {/* Game Area with Side Panel */}
                <div ref={gameContainerRef} className="flex flex-row items-start justify-center gap-6">
                    {/* Canvas - Left Side */}
                    <div className="relative inline-block">
                        {/* Canvas */}
                        <RPGCanvas gameState={gameState} />

                        {/* Menu Overlay */}
                        {gameState.status === 'menu' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/95 via-black/90 to-black/95 backdrop-blur-md" style={{ minHeight: '580px' }}>
                                <div className="text-center px-6 max-w-5xl w-full">
                                    {/* Animated Title */}
                                    <div className="mb-6 animate-pulse">
                                        <div className="text-7xl mb-3">🐍⚔️🐉</div>
                                        <h2 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 text-transparent bg-clip-text mb-2 drop-shadow-lg">
                                            Snake Quest
                                        </h2>
                                        <div className="text-yellow-400 text-xl font-semibold tracking-wide">
                                            ⚔️ RPG MODE ⚔️
                                        </div>
                                    </div>

                                    {/* Story Box */}
                                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-xl p-6 mb-6 border-2 border-yellow-500/30 backdrop-blur">
                                        <p className="text-white/90 mb-3 text-lg leading-relaxed">
                                            The evil dragon <span className="text-red-400 font-bold">Draco</span> has stolen the legendary{' '}
                                            <span className="text-green-400 font-bold">Emerald Apple</span>!
                                        </p>
                                        <p className="text-white/80 text-base">
                                            Help <span className="text-cyan-400 font-bold">Naga</span> the brave snake recover{' '}
                                            <span className="text-yellow-400 font-bold">20 magical shards</span> across{' '}
                                            <span className="text-purple-400 font-bold">5 mystical worlds</span>!
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                                        <div className="bg-black/40 rounded-lg p-3 border border-cyan-500/30">
                                            <div className="text-2xl mb-1">🗺️</div>
                                            <div className="text-cyan-300 font-semibold">20 Levels</div>
                                            <div className="text-white/60 text-xs">Epic Adventure</div>
                                        </div>
                                        <div className="bg-black/40 rounded-lg p-3 border border-red-500/30">
                                            <div className="text-2xl mb-1">👾</div>
                                            <div className="text-red-300 font-semibold">10+ Enemies</div>
                                            <div className="text-white/60 text-xs">+ 4 Bosses</div>
                                        </div>
                                        <div className="bg-black/40 rounded-lg p-3 border border-yellow-500/30">
                                            <div className="text-2xl mb-1">⚡</div>
                                            <div className="text-yellow-300 font-semibold">Power-ups</div>
                                            <div className="text-white/60 text-xs">Shields & More</div>
                                        </div>
                                        <div className="bg-black/40 rounded-lg p-3 border border-purple-500/30">
                                            <div className="text-2xl mb-1">🎯</div>
                                            <div className="text-purple-300 font-semibold">Progression</div>
                                            <div className="text-white/60 text-xs">Level Up System</div>
                                        </div>
                                    </div>

                                    {/* Start Button */}
                                    <button
                                        onClick={handleStart}
                                        className="group relative px-10 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-500 hover:via-emerald-500 hover:to-green-600 text-white font-bold rounded-xl text-2xl transition-all transform hover:scale-105 shadow-2xl shadow-green-500/50 border-2 border-green-400"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            ⚔️ Begin Quest ⚔️
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </button>

                                    <p className="text-white/40 text-xs mt-4">Press ❓ Help button for controls and tips</p>
                                </div>
                            </div>
                        )}

                        {/* Pause Overlay */}
                        {gameState.status === 'paused' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                                <div className="text-center">
                                    <h2 className="text-4xl font-bold text-white mb-4">Paused</h2>
                                    <button
                                        onClick={resumeGame}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                                    >
                                        Resume
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Game Over Overlay */}
                        {gameState.status === 'game-over' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                                <div className="text-center px-4">
                                    <div className="text-6xl mb-4">💀</div>
                                    <h2 className="text-4xl font-bold text-red-500 mb-4">
                                        Game Over
                                    </h2>
                                    <p className="text-white/80 mb-2">
                                        Level: {gameState.currentLevel?.data.name || 'Unknown'}
                                    </p>
                                    <p className="text-white/80 mb-6">
                                        Score: {gameState.player.score}
                                    </p>
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={() => startGame(gameState.currentLevel?.data.id || 1)}
                                            className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xl transition-colors"
                                        >
                                            Try Again
                                        </button>
                                        <button
                                            onClick={resetGame}
                                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg"
                                        >
                                            Main Menu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Level Complete Overlay */}
                        {gameState.status === 'level-complete' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/85 backdrop-blur-sm">
                                <div className="text-center px-4">
                                    <div className="text-6xl mb-4">✨</div>
                                    <h2 className="text-4xl font-bold text-yellow-400 mb-4">
                                        Level Complete!
                                    </h2>
                                    <p className="text-white/90 mb-2 text-lg">
                                        {gameState.currentLevel?.data.name}
                                    </p>
                                    <div className="text-white/80 mb-6">
                                        <p>Score: {gameState.player.score}</p>
                                        <p>Stars: {gameState.player.stars} ⭐</p>
                                        <p>Level: {gameState.player.level}</p>
                                    </div>
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={nextLevel}
                                            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xl transition-colors"
                                        >
                                            Next Level →
                                        </button>
                                        <Link
                                            to="/rpg/leaderboard"
                                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            📊 Leaderboard
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Victory Overlay */}
                        {gameState.status === 'victory' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur">
                                <div className="text-center px-4">
                                    <div className="text-8xl mb-4">🎉</div>
                                    <h2 className="text-5xl font-bold text-yellow-300 mb-4">
                                        VICTORY!
                                    </h2>
                                    <p className="text-white/90 mb-6 text-xl">
                                        You have completed Snake Quest!
                                    </p>
                                    <div className="text-white/90 mb-6 text-lg">
                                        <p>Final Score: {gameState.player.score}</p>
                                        <p>Total Stars: {gameState.player.stars} ⭐</p>
                                        <p>Total Kills: {gameState.stats.totalKills}</p>
                                        <p>Levels Completed: {gameState.stats.levelsCompleted.length}</p>
                                    </div>
                                    <button
                                        onClick={resetGame}
                                        className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xl transition-colors"
                                    >
                                        Play Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Tutorial Tooltip */}
                        {showTutorial && <TutorialTooltip onClose={handleCloseTutorial} />}
                    </div>

                    {/* UI Stats & Controls - Right Side Panel */}
                    {gameState.status === 'playing' && gameState.currentLevel && (
                        <div className="w-64 flex-shrink-0 flex flex-col gap-4">
                            {/* Player Stats */}
                            <RPGUI
                                player={gameState.player}
                                levelName={gameState.currentLevel.data.name}
                                currentLevelId={gameState.currentLevel.data.id}
                                objectives={gameState.currentLevel.data.objectives}
                            />

                            {/* Boss Health Bar */}
                            {bossEnemy && bossEnemy.state !== 'dead' && (
                                <div className="bg-gray-900/50 rounded-lg p-3 border border-red-500/30">
                                    <BossHealthBar boss={bossEnemy} />
                                </div>
                            )}

                            {/* Control Buttons */}
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={pauseGame}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all w-full">
                                    ⏸️ Pause
                                </button>
                                <button
                                    onClick={resetGame}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg shadow-lg transition-all w-full">
                                    🏠 Menu
                                </button>
                                <button
                                    onClick={() => setShowTutorial(true)}
                                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg shadow-lg transition-all w-full">
                                    ❓ Help
                                </button>
                            </div>

                            {/* Developer Mode Controls */}
                            {isDevMode && (
                                <div className="flex flex-col gap-2">
                                    <div className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded text-center">
                                        🛠️ DEV MODE
                                    </div>
                                    <div className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded text-center">
                                        ⚡ GOD MODE
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const currentId = gameState.currentLevel?.data.id || 1;
                                                if (currentId > 1) startGame(currentId - 1);
                                            }}
                                            disabled={(gameState.currentLevel?.data.id || 1) <= 1}
                                            className="flex-1 px-2 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500/50 text-white font-bold rounded-lg shadow-lg transition-all text-xs">
                                            ← Prev
                                        </button>
                                        <button
                                            onClick={() => {
                                                const currentId = gameState.currentLevel?.data.id || 1;
                                                if (currentId < 20) startGame(currentId + 1);
                                            }}
                                            disabled={(gameState.currentLevel?.data.id || 1) >= 20}
                                            className="flex-1 px-2 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500/50 text-white font-bold rounded-lg shadow-lg transition-all text-xs">
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
