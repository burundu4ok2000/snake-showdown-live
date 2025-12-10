import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRPGGame } from '../game-rpg/hooks/useRPGGame';
import { RPGCanvas } from '../game-rpg/components/RPGCanvas';
import { RPGUI } from '../game-rpg/components/RPGUI';
import { RPGControls } from '../game-rpg/components/RPGControls';
import { BossHealthBar } from '../game-rpg/components/BossHealthBar';

export default function RPGPage() {
    const {
        gameState,
        startGame,
        pauseGame,
        resumeGame,
        resetGame,
        nextLevel,
    } = useRPGGame();

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
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        Snake Quest RPG
                    </h1>
                    <p className="text-muted-foreground">
                        Embark on an epic adventure through 20 levels of serpent-powered action!
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Game Area */}
                    <div className="xl:col-span-2 flex flex-col items-center">
                        {/* UI Stats Above Game - Only when playing */}
                        {gameState.status === 'playing' && gameState.currentLevel && (
                            <div className="w-full max-w-4xl mb-4">
                                <RPGUI
                                    player={gameState.player}
                                    levelName={gameState.currentLevel.data.name}
                                    currentLevelId={gameState.currentLevel.data.id}
                                    objectives={gameState.currentLevel.data.objectives}
                                />
                            </div>
                        )}

                        <div className="relative inline-block">
                            {/* Canvas */}
                            <RPGCanvas gameState={gameState} />

                            {/* Boss Health Bar */}
                            {bossEnemy && bossEnemy.state !== 'dead' && (
                                <BossHealthBar boss={bossEnemy} />
                            )}

                            {/* Menu Overlay */}
                            {gameState.status === 'menu' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm" style={{ minHeight: '580px' }}>
                                    <div className="text-center px-4">
                                        <div className="text-6xl mb-4">🐍⚔️</div>
                                        <h2 className="text-3xl font-bold text-white mb-4">
                                            Snake Quest
                                        </h2>
                                        <p className="text-white/70 mb-6 max-w-md mx-auto">
                                            The evil dragon Draco has stolen the Emerald Apple!
                                            Help Naga the snake recover the 20 shards across 5 worlds!
                                        </p>
                                        <button
                                            onClick={handleStart}
                                            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xl transition-colors"
                                        >
                                            Begin Adventure
                                        </button>
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

                            {/* Level Complete Overlay */}
                            {gameState.status === 'level-complete' && gameState.currentLevel && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                                    <div className="text-center px-4">
                                        <div className="text-6xl mb-4">🎉</div>
                                        <h2 className="text-4xl font-bold text-yellow-400 mb-4">
                                            Level Complete!
                                        </h2>
                                        <p className="text-white/90 text-xl mb-2">
                                            {gameState.currentLevel.data.name}
                                        </p>
                                        <div className="text-white/70 mb-6">
                                            <p>Stars: {gameState.currentLevel.starsCollected} ⭐</p>
                                            <p>Enemies Defeated: {gameState.currentLevel.enemiesKilled}</p>
                                            <p>Score: {gameState.player.score}</p>
                                        </div>
                                        <div className="flex gap-4 justify-center">
                                            <button
                                                onClick={nextLevel}
                                                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xl transition-colors"
                                            >
                                                Next Level →
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

                            {/* Game Over Overlay */}
                            {gameState.status === 'game-over' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                                    <div className="text-center px-4">
                                        <div className="text-6xl mb-4">💀</div>
                                        <h2 className="text-4xl font-bold text-red-500 mb-4">
                                            Game Over
                                        </h2>
                                        <p className="text-white/70 mb-6">
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

                            {/* Victory Overlay */}
                            {gameState.status === 'victory' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-yellow-900/90 to-purple-900/90 backdrop-blur-sm">
                                    <div className="text-center px-4">
                                        <div className="text-8xl mb-4">🏆👑</div>
                                        <h2 className="text-5xl font-bold text-yellow-300 mb-4">
                                            Victory!
                                        </h2>
                                        <p className="text-white text-xl mb-2">
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
                        </div>
                    </div>

                    {/* Side Panel - Controls */}
                    <div>
                        <RPGControls
                            status={gameState.status}
                            score={gameState.player.score}
                            levelName={gameState.status === 'playing' && gameState.currentLevel ? gameState.currentLevel.data.name : undefined}
                            objectives={gameState.status === 'playing' && gameState.currentLevel ? gameState.currentLevel.data.objectives : undefined}
                            onStart={handleStart}
                            onPause={pauseGame}
                            onResume={resumeGame}
                            onReset={resetGame}
                            className="sticky top-4"
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
