// Main RPG Game Hook
// Manages all game state and logic for RPG mode

import { useState, useEffect, useRef, useCallback } from 'react';
import { RPGGameState, createInitialRPGGameState, GameStatus } from '../types/gameState';
import { Position, Direction, Enemy, Food } from '../types/entities';
import { LevelSystem } from '../systems/LevelSystem';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { EnemySystem } from '../systems/EnemySystem';
import { CollisionUtils } from '../utils/collision';
import { LEVELS } from '../data/levels';
import { soundManager } from '@/lib/soundManager';

const MOVE_INTERVAL = 150; // Milliseconds between moves (slower = easier)
const SNAKE_GROW_SIZE = 1;

export function useRPGGame() {
    const [gameState, setGameState] = useState<RPGGameState>(createInitialRPGGameState());
    const animationFrameRef = useRef<number>();
    const lastTimeRef = useRef<number>(Date.now());

    // Start a new game
    const startGame = useCallback((levelId: number = 1) => {
        const levelData = LEVELS[levelId];
        if (!levelData) {
            console.error(`Level ${levelId} not found`);
            return;
        }

        const level = LevelSystem.loadLevel(levelData);
        const enemies = LevelSystem.spawnEnemies(levelData);
        const food = LevelSystem.spawnFood(levelData);

        setGameState(state => ({
            ...state,
            status: 'playing',
            currentLevel: level,
            enemies,
            food,
            projectiles: [],
            player: {
                ...state.player,
                snake: [{ ...levelData.map.spawnPoint }],
                direction: 'right',
                nextDirection: 'right',
                health: state.player.maxHealth,
            },
            lastUpdate: Date.now(),
            isPaused: false,
        }));

        lastTimeRef.current = Date.now();
        soundManager.playStartSound();
    }, []);

    // Pause game
    const pauseGame = useCallback(() => {
        setGameState(state => ({
            ...state,
            status: 'paused',
            isPaused: true,
        }));
    }, []);

    // Resume game
    const resumeGame = useCallback(() => {
        setGameState(state => ({
            ...state,
            status: 'playing',
            isPaused: false,
        }));
        lastTimeRef.current = Date.now();
    }, []);

    // Reset game
    const resetGame = useCallback(() => {
        setGameState(createInitialRPGGameState());
    }, []);

    // Go to next level
    const nextLevel = useCallback(() => {
        setGameState(state => {
            if (!state.currentLevel?.data.nextLevel) {
                // No more levels - victory!
                return {
                    ...state,
                    status: 'victory',
                };
            }

            const nextLevelId = state.currentLevel.data.nextLevel;
            const levelData = LEVELS[nextLevelId];

            if (!levelData) {
                console.error(`Level ${nextLevelId} not found`);
                return state;
            }

            const level = LevelSystem.loadLevel(levelData);
            const enemies = LevelSystem.spawnEnemies(levelData);
            const food = LevelSystem.spawnFood(levelData);

            return {
                ...state,
                status: 'playing',
                currentLevel: level,
                enemies,
                food,
                projectiles: [],
                player: {
                    ...state.player,
                    snake: [{ ...levelData.map.spawnPoint }],
                    direction: 'right',
                    nextDirection: 'right',
                    // Keep player progress but restore health
                    health: state.player.maxHealth,
                },
                lastUpdate: Date.now(),
            };
        });

        lastTimeRef.current = Date.now();
        soundManager.playStartSound();
    }, []);

    // Handle direction change
    const handleDirectionChange = useCallback((newDirection: Direction) => {
        setGameState(state => {
            // Prevent 180-degree turns
            const opposites: Record<Direction, Direction> = {
                up: 'down',
                down: 'up',
                left: 'right',
                right: 'left',
            };

            if (opposites[newDirection] === state.player.direction) {
                return state;
            }

            return {
                ...state,
                player: {
                    ...state.player,
                    nextDirection: newDirection,
                },
            };
        });
    }, []);

    // Main game loop
    const gameLoop = useCallback(() => {
        const now = Date.now();

        setGameState(state => {
            if (state.status !== 'playing' || !state.currentLevel) {
                return state;
            }

            // Only move if enough time has passed
            if (now - state.lastUpdate < MOVE_INTERVAL) {
                return state;
            }

            const newState = { ...state };
            newState.lastUpdate = now;

            // Update direction
            newState.player.direction = newState.player.nextDirection;

            // Move snake one tile
            const head = newState.player.snake[0];
            const newHead: Position = { ...head };

            // Move exactly 1 tile in the current direction
            switch (newState.player.direction) {
                case 'up':
                    newHead.y -= 1;
                    break;
                case 'down':
                    newHead.y += 1;
                    break;
                case 'left':
                    newHead.x -= 1;
                    break;
                case 'right':
                    newHead.x += 1;
                    break;
            }

            // Check wall collision
            if (!CollisionUtils.isWalkable(newState.currentLevel.data.map, newHead)) {
                // Hit wall, take damage
                const died = CombatSystem.playerTakeDamage(newState.player, 1);
                if (died) {
                    newState.status = 'game-over';
                    soundManager.playGameOverSound();
                    return newState;
                }
                soundManager.playTakeDamageSound();
                // Don't move
                return newState;
            }

            // Check self collision
            if (CombatSystem.checkSelfCollision([newHead, ...newState.player.snake.slice(1)])) {
                const died = CombatSystem.playerTakeDamage(newState.player, 1);
                if (died) {
                    newState.status = 'game-over';
                    soundManager.playGameOverSound();
                    return newState;
                }
                soundManager.playTakeDamageSound();
                return newState;
            }

            // Update snake position
            newState.player.snake = [newHead, ...newState.player.snake.slice(0, -1)];

            // Check food collision
            newState.food = newState.food.filter(foodItem => {
                if (CollisionUtils.checkPointCollision(newHead, foodItem.position, 0.5, 0.5)) {
                    // Collect food
                    newState.player.score += foodItem.points;

                    // Add XP
                    const { leveledUp } = ProgressionSystem.addXP(newState.player, foodItem.xp);

                    // Level up sound!
                    if (leveledUp) {
                        soundManager.playLevelUpSound();
                    }

                    // Grow snake
                    const tail = newState.player.snake[newState.player.snake.length - 1];
                    for (let i = 0; i < SNAKE_GROW_SIZE; i++) {
                        newState.player.snake.push({ ...tail });
                    }

                    // Play sound based on food type
                    if (foodItem.type === 'star') {
                        soundManager.playCollectStarSound();
                    } else if (foodItem.type === 'gem') {
                        soundManager.playCollectGemSound();
                    } else {
                        soundManager.playEatSound();
                    }

                    // Handle special effects
                    if (foodItem.specialEffect) {
                        const effect = {
                            type: foodItem.specialEffect,
                            startTime: now,
                            duration: (foodItem.effectDuration || 0) * 1000,
                            expiresAt: now + (foodItem.effectDuration || 0) * 1000,
                        };

                        if (foodItem.specialEffect === 'shield') {
                            newState.player.hasShield = true;
                        } else if (foodItem.specialEffect === 'invincibility') {
                            newState.player.invincible = true;
                            newState.player.powerups.push(effect);
                        } else {
                            newState.player.powerups.push(effect);
                        }
                    }

                    // Track stars
                    if (foodItem.type === 'star') {
                        newState.currentLevel.starsCollected++;
                        ProgressionSystem.addStar(newState.player);
                    }

                    // Track gold
                    if (foodItem.type === 'gold') {
                        ProgressionSystem.addGold(newState.player, 10);
                    }

                    return false; // Remove food
                }
                return true; // Keep food
            });

            // Update enemies (they move slower than player)
            newState.enemies.forEach(enemy => {
                if (enemy.state === 'dead') return;

                // Enemies update every frame but move slower
                // EnemySystem handles its own timing

                // Check collision with player
                if (CollisionUtils.checkPointCollision(newHead, enemy.position, 0.5, 0.5)) {
                    // Player hit enemy - deal damage to enemy FIRST

                    // Enemy takes damage from player
                    const enemyDied = CombatSystem.enemyTakeDamage(enemy, 1);
                    soundManager.playHitEnemySound();

                    // Player takes damage from enemy ONLY if enemy survived the hit (unless invincible)
                    // This makes one-shot kills safe and fair!
                    if (!enemyDied && !newState.player.invincible) {
                        const playerDied = CombatSystem.playerTakeDamage(newState.player, enemy.damage);
                        if (playerDied) {
                            newState.status = 'game-over';
                            soundManager.playGameOverSound();
                        } else {
                            soundManager.playTakeDamageSound();
                        }
                    }
                }
            });

            // Remove dead enemies and award XP
            newState.enemies = newState.enemies.filter(enemy => {
                if (enemy.state === 'dead' && enemy.health <= 0) {
                    // Award XP and gold
                    const xp = CombatSystem.getEnemyXPReward(enemy.type, newState.player.level);
                    const gold = CombatSystem.getEnemyGoldReward(enemy.type);

                    ProgressionSystem.addXP(newState.player, xp);
                    ProgressionSystem.addGold(newState.player, gold);

                    newState.currentLevel!.enemiesKilled++;
                    newState.stats.totalKills++;

                    // Enemy death sound
                    soundManager.playEnemyDeathSound();

                    return false; // Remove enemy
                }
                return true;
            });

            // Update active effects
            newState.player.powerups = newState.player.powerups.filter(effect => {
                if (now >= effect.expiresAt) {
                    // Effect expired
                    if (effect.type === 'invincibility') {
                        newState.player.invincible = false;
                    }
                    return false;
                }
                return true;
            });

            // Update level (with fixed time step)
            LevelSystem.updateLevel(newState.currentLevel, MOVE_INTERVAL / 1000);

            // Check if player reached exit
            const exitPoint = newState.currentLevel.data.map.exitPoint;
            if (newHead.x === exitPoint.x && newHead.y === exitPoint.y) {
                // Mark reach_exit objective as completed
                const exitObjective = newState.currentLevel.data.objectives.find(
                    obj => obj.type === 'reach_exit'
                );
                if (exitObjective && !exitObjective.completed) {
                    exitObjective.completed = true;
                    exitObjective.current = 1;
                }
            }

            // Check objectives
            const allCompleted = LevelSystem.checkObjectives(
                newState.currentLevel,
                newState.enemies,
                newState.food
            );

            if (allCompleted && !newState.completedLevels.includes(`level_${newState.currentLevel.data.id}`)) {
                newState.status = 'level-complete';
                newState.completedLevels.push(`level_${newState.currentLevel.data.id}`);
                newState.stats.levelsCompleted.push(`level_${newState.currentLevel.data.id}`);
            }

            return newState;
        });
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState.status !== 'playing') return;

            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    e.preventDefault();
                    handleDirectionChange('up');
                    break;
                case 's':
                case 'arrowdown':
                    e.preventDefault();
                    handleDirectionChange('down');
                    break;
                case 'a':
                case 'arrowleft':
                    e.preventDefault();
                    handleDirectionChange('left');
                    break;
                case 'd':
                case 'arrowright':
                    e.preventDefault();
                    handleDirectionChange('right');
                    break;
                case 'escape':
                case 'p':
                    e.preventDefault();
                    if (gameState.status === 'playing') {
                        pauseGame();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState.status, handleDirectionChange, pauseGame]);

    // Game loop effect
    useEffect(() => {
        if (gameState.status === 'playing') {
            const loop = () => {
                gameLoop();
                animationFrameRef.current = requestAnimationFrame(loop);
            };
            animationFrameRef.current = requestAnimationFrame(loop);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [gameState.status, gameLoop]);

    return {
        gameState,
        startGame,
        pauseGame,
        resumeGame,
        resetGame,
        nextLevel,
        handleDirectionChange,
    };
}
