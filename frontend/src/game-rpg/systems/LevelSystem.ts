// Level System - Manages level loading, objectives, and completion

import { LevelData, Objective } from '../types/level';
import { CurrentLevel } from '../types/gameState';
import { Enemy, Food } from '../types/entities';
import { EnemySystem } from './EnemySystem';

export class LevelSystem {
    // Load a level and create its initial state
    static loadLevel(levelData: LevelData): CurrentLevel {
        return {
            data: levelData,
            timeElapsed: 0,
            starsCollected: 0,
            enemiesKilled: 0,
            completedObjectives: [],
        };
    }

    // Spawn enemies from level data
    static spawnEnemies(levelData: LevelData): Enemy[] {
        const enemies: Enemy[] = [];

        for (const spawn of levelData.map.enemySpawns) {
            const enemy = EnemySystem.createEnemy(
                spawn.enemyType,
                spawn.position,
                this.getDefaultAI(spawn.enemyType)
            );

            // Set patrol path if provided
            if (spawn.patrolPath) {
                enemy.ai = 'patrol_path';
                enemy.patrolPath = spawn.patrolPath;
                enemy.currentPathIndex = 0;
            }

            enemies.push(enemy);
        }

        return enemies;
    }

    // Get default AI for enemy type
    private static getDefaultAI(enemyType: string): Enemy['ai'] {
        const aiMap: Record<string, Enemy['ai']> = {
            caterpillar: 'random_walk',
            scorpion: 'follow_player',
            spider: 'ranged_attack',
            lizard: 'follow_player',
            djinn: 'teleport_random',
            golem: 'ranged_attack',
            elemental: 'follow_player',
            snake: 'follow_player', // Fast chaser
            bat: 'follow_player', // Flying follower
            caterpillar_queen: 'random_walk', // Boss - slow mover
            draco: 'follow_player', // FINAL BOSS - aggressive chaser
        };

        return aiMap[enemyType] || 'random_walk';
    }

    // Spawn food from level data
    static spawnFood(levelData: LevelData): Food[] {
        const food: Food[] = [];

        for (const spawn of levelData.map.foodSpawns) {
            const foodItem = this.createFood(spawn.foodType, spawn.position);
            food.push(foodItem);
        }

        return food;
    }

    // Create a food item
    private static createFood(type: Food['type'], position: Food['position']): Food {
        const foodConfig: Record<Food['type'], {
            points: number;
            xp: number;
            specialEffect?: Food['specialEffect'];
            effectDuration?: number;
        }> = {
            apple: { points: 10, xp: 5 },
            gem: { points: 50, xp: 25 },
            meat: { points: 15, xp: 10, specialEffect: 'speed', effectDuration: 3 },
            lightning: { points: 20, xp: 15, specialEffect: 'invincibility', effectDuration: 2 },
            shield: { points: 0, xp: 5, specialEffect: 'shield' },
            gold: { points: 5, xp: 0 },
            star: { points: 100, xp: 50 },
        };

        const config = foodConfig[type];

        return {
            id: `food_${Date.now()}_${Math.random()}`,
            type,
            position: { ...position },
            points: config.points,
            xp: config.xp,
            specialEffect: config.specialEffect,
            effectDuration: config.effectDuration,
        };
    }

    // Check if objectives are completed
    static checkObjectives(level: CurrentLevel, enemies: Enemy[], food: Food[]): boolean {
        let allCompleted = true;

        for (const objective of level.data.objectives) {
            if (objective.completed) continue;

            switch (objective.type) {
                case 'kill_all':
                    objective.current = level.enemiesKilled;
                    objective.completed = level.enemiesKilled >= objective.required;
                    break;

                case 'collect_items':
                    // Count collected stars
                    objective.current = level.starsCollected;
                    objective.completed = level.starsCollected >= objective.required;
                    break;

                case 'survive':
                    // Time-based objective (in seconds)
                    objective.current = Math.floor(level.timeElapsed);
                    objective.completed = level.timeElapsed >= objective.required;
                    break;

                case 'reach_exit':
                    // This will be checked externally when player reaches exit
                    break;

                case 'defeat_boss':
                    // Check if boss enemy is dead
                    const bossAlive = enemies.some(e => e.type === 'boss' && e.state !== 'dead');
                    objective.completed = !bossAlive;
                    break;
            }

            if (!objective.completed) {
                allCompleted = false;
            }
        }

        return allCompleted;
    }

    // Update level state
    static updateLevel(level: CurrentLevel, deltaTime: number): void {
        level.timeElapsed += deltaTime;
    }

    // Mark objective as completed
    static completeObjective(level: CurrentLevel, objectiveId: string): void {
        if (!level.completedObjectives.includes(objectiveId)) {
            level.completedObjectives.push(objectiveId);
        }
    }

    // Check if level is completed
    static isLevelCompleted(level: CurrentLevel): boolean {
        return level.data.objectives.every(obj => obj.completed);
    }
}
