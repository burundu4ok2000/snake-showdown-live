import { describe, it, expect } from 'vitest';
import { allLevels } from './data/levels';
import { LevelSystem } from './systems/LevelSystem';

describe('RPG Mode - Level Completion Logic', () => {
    describe('Exit Accessibility', () => {
        it('should have reach_exit objective in every level', () => {
            allLevels.forEach(level => {
                const hasExitObjective = level.objectives.some(obj => obj.type === 'reach_exit');
                expect(hasExitObjective, `Level ${level.id} (${level.name}) missing reach_exit objective`).toBe(true);
            });
        });

        it('should have exit point accessible (not surrounded by walls)', () => {
            allLevels.forEach(level => {
                const { exitPoint, tiles, width, height } = level.map;
                const { x, y } = exitPoint;

                // Check if exit tile itself is walkable
                const exitTile = tiles[y][x];
                expect(exitTile.walkable).toBe(true);

                // Check if there's at least one adjacent walkable tile
                const adjacentTiles = [
                    { x: x - 1, y }, // left
                    { x: x + 1, y }, // right
                    { x, y: y - 1 }, // up
                    { x, y: y + 1 }, // down
                ];

                const hasAccessiblePath = adjacentTiles.some(adj => {
                    if (adj.x < 0 || adj.x >= width || adj.y < 0 || adj.y >= height) {
                        return false;
                    }
                    return tiles[adj.y][adj.x].walkable;
                });

                expect(hasAccessiblePath, `Level ${level.id} (${level.name}) has exit blocked by walls`).toBe(true);
            });
        });
    });

    describe('Objective Types', () => {
        it('should have valid objective types only', () => {
            const validTypes = ['kill_all', 'collect_items', 'survive', 'reach_exit', 'defeat_boss'];

            allLevels.forEach(level => {
                level.objectives.forEach(obj => {
                    expect(validTypes).toContain(obj.type);
                });
            });
        });

        it('should have required field greater than 0 for non-reach_exit objectives', () => {
            allLevels.forEach(level => {
                level.objectives.forEach(obj => {
                    if (obj.type !== 'reach_exit') {
                        expect(obj.required).toBeGreaterThan(0);
                    }
                });
            });
        });
    });

    describe('Level Completion Requirements', () => {
        it('should be possible to complete all objectives', () => {
            allLevels.forEach(level => {
                const currentLevel = LevelSystem.loadLevel(level);
                const enemies = LevelSystem.spawnEnemies(level);
                const food = LevelSystem.spawnFood(level);

                level.objectives.forEach(obj => {
                    switch (obj.type) {
                        case 'kill_all':
                            // Check if there are enough enemies
                            expect(enemies.length).toBeGreaterThanOrEqual(obj.required);
                            break;

                        case 'collect_items':
                            // Check if there are enough collectible items (stars)
                            const stars = food.filter(f => f.type === 'star');
                            expect(stars.length).toBeGreaterThanOrEqual(obj.required);
                            break;

                        case 'defeat_boss':
                            // Check if there's a boss enemy
                            const bossTypes = ['caterpillar_queen', 'draco'];
                            const hasBoss = enemies.some(e => bossTypes.includes(e.type));
                            expect(hasBoss).toBe(true);
                            break;

                        case 'reach_exit':
                            // Exit must exist and be walkable (already checked above)
                            expect(level.map.exitPoint).toBeDefined();
                            break;

                        case 'survive':
                            // Time-based objective - always possible
                            expect(obj.required).toBeGreaterThan(0);
                            break;
                    }
                });
            });
        });

        it('should allow level completion when all objectives are met', () => {
            allLevels.forEach(level => {
                const currentLevel = LevelSystem.loadLevel(level);

                // Simulate completing all objectives
                currentLevel.data.objectives.forEach(obj => {
                    obj.completed = true;
                });

                // Level should be completable
                const isCompleted = LevelSystem.isLevelCompleted(currentLevel);
                expect(isCompleted).toBe(true);
            });
        });
    });

    describe('Spawn to Exit Path', () => {
        it('should have spawn and exit in different locations', () => {
            allLevels.forEach(level => {
                const { spawnPoint, exitPoint } = level.map;

                const sameLocation = spawnPoint.x === exitPoint.x && spawnPoint.y === exitPoint.y;
                expect(sameLocation, `Level ${level.id} (${level.name}) has spawn and exit at same location`).toBe(false);
            });
        });

        it('should have reasonable distance between spawn and exit', () => {
            allLevels.forEach(level => {
                const { spawnPoint, exitPoint } = level.map;

                const dx = Math.abs(exitPoint.x - spawnPoint.x);
                const dy = Math.abs(exitPoint.y - spawnPoint.y);
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Minimum distance should be at least 5 tiles
                expect(distance).toBeGreaterThan(5);
            });
        });
    });

    describe('Boss Levels Logic', () => {
        it('should have defeat_boss objective for levels with boss enemies', () => {
            allLevels.forEach(level => {
                const enemies = LevelSystem.spawnEnemies(level);
                const bossTypes = ['caterpillar_queen', 'draco'];
                const hasBoss = enemies.some(e => bossTypes.includes(e.type));

                if (hasBoss) {
                    const hasBossObjective = level.objectives.some(obj =>
                        obj.type === 'defeat_boss' || obj.type === 'kill_all'
                    );
                    expect(hasBossObjective).toBe(true);
                }
            });
        });
    });

    describe('Next Level Progression', () => {
        it('should have valid next level references', () => {
            allLevels.forEach((level, index) => {
                if (index < allLevels.length - 1) {
                    // Not the last level - should have next level
                    expect(level.nextLevel).toBe(allLevels[index + 1].id);
                } else {
                    // Last level - might not have next level or have special value
                    // This is OK
                }
            });
        });

        it('should allow progression through all levels', () => {
            // Start from level 1
            let currentLevelId = 1;
            const visitedLevels = new Set<number>();

            while (currentLevelId && !visitedLevels.has(currentLevelId)) {
                visitedLevels.add(currentLevelId);

                const currentLevel = allLevels.find(l => l.id === currentLevelId);
                expect(currentLevel).toBeDefined();

                if (currentLevel) {
                    currentLevelId = currentLevel.nextLevel || 0;
                }

                // Safety check - prevent infinite loops
                if (visitedLevels.size > 25) {
                    break;
                }
            }

            // Should visit all 20 levels
            expect(visitedLevels.size).toBe(20);
        });
    });

    describe('Level State Machine', () => {
        it('should properly track objective completion', () => {
            const testLevel = allLevels[0]; // Level 1
            const currentLevel = LevelSystem.loadLevel(testLevel);
            const enemies = LevelSystem.spawnEnemies(testLevel);
            const food = LevelSystem.spawnFood(testLevel);

            // Simulate killing all enemies
            const killAllObj = currentLevel.data.objectives.find(o => o.type === 'kill_all');
            if (killAllObj) {
                currentLevel.enemiesKilled = killAllObj.required;
                LevelSystem.checkObjectives(currentLevel, [], food);
                expect(killAllObj.completed, 'Kill all objective should be completed').toBe(true);
            }

            // Simulate collecting stars
            const collectObj = currentLevel.data.objectives.find(o => o.type === 'collect_items');
            if (collectObj) {
                currentLevel.starsCollected = collectObj.required;
                LevelSystem.checkObjectives(currentLevel, [], food);
                expect(collectObj.completed, 'Collect items objective should be completed').toBe(true);
            }

            // Exit objective needs to be manually completed (when player reaches exit)
            const exitObj = currentLevel.data.objectives.find(o => o.type === 'reach_exit');
            if (exitObj) {
                exitObj.completed = true;
            }

            // Now level should be complete
            const finalComplete = LevelSystem.isLevelCompleted(currentLevel);
            expect(finalComplete, 'Level should be completed after all objectives are met').toBe(true);
        });
    });
});
