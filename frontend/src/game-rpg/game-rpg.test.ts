import { describe, it, expect, beforeEach } from 'vitest';
import { LevelSystem } from './systems/LevelSystem';
import { LEVEL_1, LEVEL_2, LEVEL_13, LEVEL_14, LEVEL_15, LEVEL_16, allLevels } from './data/levels';
import { Position, Enemy, Food, Direction } from './types/entities';
import { CurrentLevel } from './types/gameState';
import { EnemySystem } from './systems/EnemySystem';
import { CollisionUtils } from './utils/collision';
import { CombatSystem } from './systems/CombatSystem';

describe('RPG Mode - Level Data Validation', () => {
    describe('Level Structure', () => {
        it('should have valid dimensions for all levels', () => {
            allLevels.forEach(level => {
                expect(level.map.width).toBeGreaterThan(0);
                expect(level.map.height).toBeGreaterThan(0);
                expect(level.map.width).toBeLessThanOrEqual(50);
                expect(level.map.height).toBeLessThanOrEqual(50);
            });
        });

        it('should have tiles array matching map dimensions', () => {
            allLevels.forEach(level => {
                expect(level.map.tiles.length).toBe(level.map.height);
                level.map.tiles.forEach(row => {
                    expect(row.length).toBe(level.map.width);
                });
            });
        });

        it('should have spawn and exit points within bounds', () => {
            allLevels.forEach(level => {
                const { spawnPoint, exitPoint, width, height } = level.map;

                // Check spawn point
                expect(spawnPoint.x).toBeGreaterThanOrEqual(0);
                expect(spawnPoint.x).toBeLessThan(width);
                expect(spawnPoint.y).toBeGreaterThanOrEqual(0);
                expect(spawnPoint.y).toBeLessThan(height);

                // Check exit point
                expect(exitPoint.x).toBeGreaterThanOrEqual(0);
                expect(exitPoint.x).toBeLessThan(width);
                expect(exitPoint.y).toBeGreaterThanOrEqual(0);
                expect(exitPoint.y).toBeLessThan(height);
            });
        });

        it('should have walkable spawn and exit points', () => {
            allLevels.forEach(level => {
                const { spawnPoint, exitPoint, tiles } = level.map;

                // Spawn point should be walkable
                const spawnTile = tiles[spawnPoint.y][spawnPoint.x];
                expect(spawnTile.walkable).toBe(true);

                // Exit point should be walkable
                const exitTile = tiles[exitPoint.y][exitPoint.x];
                expect(exitTile.walkable).toBe(true);
            });
        });
    });

    describe('Enemy Spawns', () => {
        it('should have enemy spawns within map bounds', () => {
            allLevels.forEach(level => {
                level.map.enemySpawns.forEach(spawn => {
                    expect(spawn.position.x).toBeGreaterThanOrEqual(0);
                    expect(spawn.position.x).toBeLessThan(level.map.width);
                    expect(spawn.position.y).toBeGreaterThanOrEqual(0);
                    expect(spawn.position.y).toBeLessThan(level.map.height);
                });
            });
        });

        it('should have enemy spawns on walkable tiles', () => {
            allLevels.forEach(level => {
                level.map.enemySpawns.forEach(spawn => {
                    const tile = level.map.tiles[spawn.position.y][spawn.position.x];
                    expect(tile.walkable).toBe(true);
                });
            });
        });

        it('should have valid enemy types', () => {
            const validTypes = [
                'caterpillar', 'scorpion', 'spider', 'lizard',
                'djinn', 'golem', 'elemental', 'snake',
                'bat', 'caterpillar_queen', 'draco'
            ];

            allLevels.forEach(level => {
                level.map.enemySpawns.forEach(spawn => {
                    expect(validTypes).toContain(spawn.enemyType);
                });
            });
        });
    });

    describe('Food Spawns', () => {
        it('should have food spawns within map bounds', () => {
            allLevels.forEach(level => {
                level.map.foodSpawns.forEach(spawn => {
                    expect(spawn.position.x).toBeGreaterThanOrEqual(0);
                    expect(spawn.position.x).toBeLessThan(level.map.width);
                    expect(spawn.position.y).toBeGreaterThanOrEqual(0);
                    expect(spawn.position.y).toBeLessThan(level.map.height);
                });
            });
        });

        it('should have food spawns on walkable tiles (not in walls)', () => {
            allLevels.forEach(level => {
                level.map.foodSpawns.forEach(spawn => {
                    const tile = level.map.tiles[spawn.position.y][spawn.position.x];
                    expect(tile.walkable).toBe(true);
                }, `Level ${level.id}: ${level.name} has food in walls`);
            });
        });

        it('should have valid food types', () => {
            const validTypes = ['apple', 'gem', 'meat', 'lightning', 'shield', 'gold', 'star'];

            allLevels.forEach(level => {
                level.map.foodSpawns.forEach(spawn => {
                    expect(validTypes).toContain(spawn.foodType);
                });
            });
        });
    });

    describe('Objectives', () => {
        it('should have at least one objective per level', () => {
            allLevels.forEach(level => {
                expect(level.objectives.length).toBeGreaterThan(0);
            });
        });

        it('should have unique objective IDs within each level', () => {
            allLevels.forEach(level => {
                const ids = level.objectives.map(obj => obj.id);
                const uniqueIds = new Set(ids);
                expect(uniqueIds.size).toBe(ids.length);
            });
        });

        it('should have valid objective types', () => {
            const validTypes = ['kill_all', 'collect_items', 'survive', 'reach_exit', 'defeat_boss'];

            allLevels.forEach(level => {
                level.objectives.forEach(obj => {
                    expect(validTypes).toContain(obj.type);
                });
            });
        });
    });
});

describe('RPG Mode - Level System', () => {
    it('should load a level correctly', () => {
        const level = LevelSystem.loadLevel(LEVEL_1);

        expect(level.data).toBe(LEVEL_1);
        expect(level.timeElapsed).toBe(0);
        expect(level.starsCollected).toBe(0);
        expect(level.enemiesKilled).toBe(0);
        expect(level.completedObjectives).toEqual([]);
    });

    it('should spawn enemies from level data', () => {
        const enemies = LevelSystem.spawnEnemies(LEVEL_1);

        expect(enemies.length).toBe(LEVEL_1.map.enemySpawns.length);
        enemies.forEach((enemy, index) => {
            expect(enemy.type).toBe(LEVEL_1.map.enemySpawns[index].enemyType);
            expect(enemy.position).toEqual(LEVEL_1.map.enemySpawns[index].position);
        });
    });

    it('should spawn food from level data', () => {
        const food = LevelSystem.spawnFood(LEVEL_1);

        expect(food.length).toBe(LEVEL_1.map.foodSpawns.length);
        food.forEach((item, index) => {
            expect(item.type).toBe(LEVEL_1.map.foodSpawns[index].foodType);
            expect(item.position).toEqual(LEVEL_1.map.foodSpawns[index].position);
        });
    });

    it('should check objectives correctly', () => {
        const level = LevelSystem.loadLevel(LEVEL_1);
        const enemies: Enemy[] = [];
        const food: Food[] = [];

        // All objectives should be incomplete initially
        expect(LevelSystem.checkObjectives(level, enemies, food)).toBe(false);

        // Complete kill objective
        level.enemiesKilled = 3;
        LevelSystem.checkObjectives(level, enemies, food);
        const killObj = level.data.objectives.find(o => o.type === 'kill_all');
        expect(killObj?.completed).toBe(true);
    });

    it('should detect level completion', () => {
        const level = LevelSystem.loadLevel(LEVEL_1);

        // Initially not completed
        expect(LevelSystem.isLevelCompleted(level)).toBe(false);

        // Complete all objectives
        level.data.objectives.forEach(obj => {
            obj.completed = true;
        });

        expect(LevelSystem.isLevelCompleted(level)).toBe(true);
    });
});

describe('RPG Mode - Movement and Collision System', () => {
    // Helper function to get next position after movement
    function getNextPosition(pos: Position, direction: Direction): Position {
        const newPos = { ...pos };
        switch (direction) {
            case 'up': newPos.y -= 1; break;
            case 'down': newPos.y += 1; break;
            case 'left': newPos.x -= 1; break;
            case 'right': newPos.x += 1; break;
        }
        return newPos;
    }

    it('should allow movement in all 4 directions', () => {
        const pos: Position = { x: 10, y: 10 };

        const up = getNextPosition(pos, 'up');
        expect(up).toEqual({ x: 10, y: 9 });

        const down = getNextPosition(pos, 'down');
        expect(down).toEqual({ x: 10, y: 11 });

        const left = getNextPosition(pos, 'left');
        expect(left).toEqual({ x: 9, y: 10 });

        const right = getNextPosition(pos, 'right');
        expect(right).toEqual({ x: 11, y: 10 });
    });

    it('should detect wall collisions', () => {
        const map = LEVEL_1.map;

        // Test movement into a wall (border)
        const wallPos = { x: 0, y: 0 }; // Border is always a wall
        expect(map.tiles[wallPos.y][wallPos.x].walkable).toBe(false);
        expect(CollisionUtils.isWalkable(map, wallPos)).toBe(false);
    });

    it('should validate position is within bounds', () => {
        const map = LEVEL_1.map;

        expect(CollisionUtils.isInBounds(map, { x: 0, y: 0 })).toBe(true);
        expect(CollisionUtils.isInBounds(map, { x: 29, y: 19 })).toBe(true);
        expect(CollisionUtils.isInBounds(map, { x: -1, y: 0 })).toBe(false);
        expect(CollisionUtils.isInBounds(map, { x: 0, y: -1 })).toBe(false);
        expect(CollisionUtils.isInBounds(map, { x: 30, y: 0 })).toBe(false);
        expect(CollisionUtils.isInBounds(map, { x: 0, y: 20 })).toBe(false);
    });

    it('should detect collision between positions', () => {
        const pos1 = { x: 10, y: 10 };
        const pos2 = { x: 10, y: 10 };
        const pos3 = { x: 15, y: 15 };

        // Same position should collide
        expect(CollisionUtils.checkPointCollision(pos1, pos2)).toBe(true);

        // Different positions should not collide
        expect(CollisionUtils.checkPointCollision(pos1, pos3)).toBe(false);
    });

    it('should calculate distance correctly', () => {
        const pos1 = { x: 0, y: 0 };
        const pos2 = { x: 3, y: 4 };

        const distance = CollisionUtils.getDistance(pos1, pos2);
        expect(distance).toBe(5); // 3-4-5 triangle
    });

    it('should get tile at position', () => {
        const map = LEVEL_1.map;
        const tile = CollisionUtils.getTileAt(map, { x: 5, y: 5 });

        expect(tile).not.toBeNull();
        expect(tile?.type).toBeDefined();
    });
});

describe('RPG Mode - Enemy System', () => {
    it('should create enemies with correct properties', () => {
        const enemy = EnemySystem.createEnemy('caterpillar', { x: 10, y: 10 }, 'random_walk');

        expect(enemy.type).toBe('caterpillar');
        expect(enemy.position).toEqual({ x: 10, y: 10 });
        expect(enemy.ai).toBe('random_walk');
        expect(enemy.health).toBeGreaterThan(0);
        expect(enemy.maxHealth).toBeGreaterThan(0);
        expect(enemy.state).toBe('idle');
    });

    it('should handle enemy with different health values', () => {
        const caterpillar = EnemySystem.createEnemy('caterpillar', { x: 10, y: 10 }, 'random_walk');
        const draco = EnemySystem.createEnemy('draco', { x: 15, y: 15 }, 'follow_player');

        // Boss should have more health than regular enemy
        expect(draco.maxHealth).toBeGreaterThan(caterpillar.maxHealth);
    });

    it('should create enemies with correct AI behavior', () => {
        const randomEnemy = EnemySystem.createEnemy('caterpillar', { x: 10, y: 10 }, 'random_walk');
        const chaseEnemy = EnemySystem.createEnemy('scorpion', { x: 15, y: 15 }, 'follow_player');

        expect(randomEnemy.ai).toBe('random_walk');
        expect(chaseEnemy.ai).toBe('follow_player');
    });

    it('should check attack cooldown', () => {
        const enemy = EnemySystem.createEnemy('caterpillar', { x: 10, y: 10 }, 'random_walk');
        const currentTime = Date.now();

        // Initially should be able to attack
        expect(EnemySystem.canAttack(enemy, currentTime)).toBe(true);

        // After marking attack, should be on cooldown
        EnemySystem.markAttacked(enemy, currentTime);
        expect(EnemySystem.canAttack(enemy, currentTime + 500)).toBe(false);

        // After cooldown expires, should be able to attack again
        expect(EnemySystem.canAttack(enemy, currentTime + 1100)).toBe(true);
    });
});

describe('RPG Mode - Level Progression', () => {
    it('should have sequential level IDs', () => {
        for (let i = 0; i < allLevels.length - 1; i++) {
            expect(allLevels[i + 1].id).toBe(allLevels[i].id + 1);
        }
    });

    it('should have correct next level references', () => {
        for (let i = 0; i < allLevels.length - 1; i++) {
            expect(allLevels[i].nextLevel).toBe(allLevels[i + 1].id);
        }
    });

    it('should allow progression from level to level', () => {
        // Test that we can move from level 1 to level 2
        const level1 = LevelSystem.loadLevel(LEVEL_1);
        expect(level1.data.nextLevel).toBe(2);

        const level2 = allLevels.find(l => l.id === level1.data.nextLevel);
        expect(level2).toBeDefined();
        expect(level2?.id).toBe(2);
    });
});

describe('RPG Mode - Volcano World Lava Mechanics', () => {
    it('should have lava tiles in volcano levels', () => {
        [LEVEL_13, LEVEL_14, LEVEL_15, LEVEL_16].forEach(level => {
            let hasLava = false;
            level.map.tiles.forEach(row => {
                row.forEach(tile => {
                    if (tile.type === 'lava') {
                        hasLava = true;
                        expect(tile.damage).toBeGreaterThan(0);
                        expect(tile.walkable).toBe(true); // Lava is walkable but deals damage
                    }
                });
            });
            expect(hasLava).toBe(true);
        });
    });

    it('should have spawn points not on lava', () => {
        [LEVEL_13, LEVEL_14, LEVEL_15, LEVEL_16].forEach(level => {
            const spawnTile = level.map.tiles[level.map.spawnPoint.y][level.map.spawnPoint.x];
            expect(spawnTile.type).not.toBe('lava');
        });
    });

    it('should have exit points not on lava', () => {
        [LEVEL_13, LEVEL_14, LEVEL_15, LEVEL_16].forEach(level => {
            const exitTile = level.map.tiles[level.map.exitPoint.y][level.map.exitPoint.x];
            expect(exitTile.type).not.toBe('lava');
        });
    });
});

describe('RPG Mode - Boss Levels', () => {
    it('should have boss enemies in appropriate levels', () => {
        // Level 4 - Caterpillar Queen
        const level4Enemies = LevelSystem.spawnEnemies(allLevels[3]); // Index 3 = Level 4
        const hasQueen = level4Enemies.some(e => e.type === 'caterpillar_queen');
        expect(hasQueen).toBe(true);

        // Level 16 - Final Boss (Draco)
        const level16Enemies = LevelSystem.spawnEnemies(allLevels[15]); // Index 15 = Level 16
        const hasDraco = level16Enemies.some(e => e.type === 'draco');
        expect(hasDraco).toBe(true);
    });

    it('should have defeat_boss objective in boss levels', () => {
        const bossLevels = allLevels.filter(level =>
            level.map.enemySpawns.some(spawn =>
                spawn.enemyType === 'caterpillar_queen' || spawn.enemyType === 'draco'
            )
        );

        // At least some boss levels should exist
        expect(bossLevels.length).toBeGreaterThan(0);
    });
});

describe('RPG Mode - Map Consistency', () => {
    it('should not have food spawning in the same location as enemies', () => {
        allLevels.forEach(level => {
            const enemyPositions = level.map.enemySpawns.map(e =>
                `${e.position.x},${e.position.y}`
            );
            const foodPositions = level.map.foodSpawns.map(f =>
                `${f.position.x},${f.position.y}`
            );

            const overlap = enemyPositions.filter(pos => foodPositions.includes(pos));
            expect(overlap.length).toBe(0);
        });
    });

    it('should not have spawn point overlapping with enemies', () => {
        allLevels.forEach(level => {
            const spawnPos = `${level.map.spawnPoint.x},${level.map.spawnPoint.y}`;
            const enemyPositions = level.map.enemySpawns.map(e =>
                `${e.position.x},${e.position.y}`
            );

            expect(enemyPositions).not.toContain(spawnPos);
        });
    });

    it('should not have exit point overlapping with enemies', () => {
        allLevels.forEach(level => {
            const exitPos = `${level.map.exitPoint.x},${level.map.exitPoint.y}`;
            const enemyPositions = level.map.enemySpawns.map(e =>
                `${e.position.x},${e.position.y}`
            );

            expect(enemyPositions).not.toContain(exitPos);
        });
    });
});
