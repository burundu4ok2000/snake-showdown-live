// RPG Controls Component
// Game controls panel with stats and buttons

import React from 'react';
import { Button } from '@/components/ui/button';
import { GameStatus } from '../types/gameState';

interface RPGControlsProps {
    status: GameStatus;
    score: number;
    levelName?: string;
    objectives?: Array<{ description: string; completed: boolean }>;
    onStart: () => void;
    onPause: () => void;
    onResume: () => void;
    onReset: () => void;
    className?: string;
}

export function RPGControls({
    status,
    score,
    levelName,
    objectives,
    onStart,
    onPause,
    onResume,
    onReset,
    className,
}: RPGControlsProps) {
    return (
        <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Snake Quest RPG</h2>

            <div className="space-y-4">
                {/* Level Info */}
                {status === 'playing' && levelName && (
                    <div className="bg-background rounded-lg p-4">
                        <div className="text-lg font-bold text-foreground mb-3">{levelName}</div>
                        {objectives && objectives.length > 0 && (
                            <div className="space-y-2">
                                <div className="text-sm font-semibold text-muted-foreground">Objectives:</div>
                                <div className="space-y-1">
                                    {objectives.map((obj, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <span className={obj.completed ? 'text-green-400' : 'text-muted-foreground'}>
                                                {obj.completed ? '✓' : '○'}
                                            </span>
                                            <span className={obj.completed ? 'text-green-400 line-through' : 'text-foreground'}>
                                                {obj.description}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Score Display */}
                <div className="bg-background rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Current Score</div>
                    <div className="text-3xl font-bold text-foreground">
                        {score.toLocaleString()}
                    </div>
                </div>

                {/* Game Controls */}
                <div className="space-y-2">
                    {status === 'menu' && (
                        <Button onClick={onStart} className="w-full" size="lg">
                            Start Adventure
                        </Button>
                    )}

                    {status === 'playing' && (
                        <>
                            <Button onClick={onPause} className="w-full" variant="secondary">
                                Pause
                            </Button>
                            <Button onClick={onReset} className="w-full" variant="outline">
                                Restart Level
                            </Button>
                        </>
                    )}

                    {status === 'paused' && (
                        <>
                            <Button onClick={onResume} className="w-full">
                                Resume
                            </Button>
                            <Button onClick={onReset} className="w-full" variant="outline">
                                Restart Level
                            </Button>
                        </>
                    )}

                    {status === 'game-over' && (
                        <>
                            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-red-400 mb-2">Game Over</div>
                                <div className="text-sm text-muted-foreground">
                                    Final Score: {score.toLocaleString()}
                                </div>
                            </div>
                            <Button onClick={onStart} className="w-full">
                                Try Again
                            </Button>
                        </>
                    )}

                    {status === 'level-complete' && (
                        <>
                            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-400 mb-2">Level Complete!</div>
                                <div className="text-sm text-muted-foreground">
                                    Score: {score.toLocaleString()}
                                </div>
                            </div>
                            <Button onClick={onStart} className="w-full">
                                Continue
                            </Button>
                        </>
                    )}
                </div>

                {/* Instructions */}
                <div className="bg-background rounded-lg p-4 text-sm">
                    <div className="font-semibold mb-2 text-foreground">Controls:</div>
                    <div className="space-y-1 text-muted-foreground">
                        <div>WASD / Arrow Keys - Move</div>
                        <div>P / ESC - Pause</div>
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-background rounded-lg p-4 text-sm">
                    <div className="font-semibold mb-2 text-foreground">Tips:</div>
                    <div className="space-y-1 text-muted-foreground">
                        <div>🍎 Collect food to grow and gain XP</div>
                        <div>⚔️ Defeat enemies for rewards</div>
                        <div>⭐ Find hidden stars in each level</div>
                        <div>❤️ Avoid walls and enemies</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
