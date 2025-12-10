// RPG Game State types

import { Position } from './entities';
import type { Enemy, Food, Projectile, ActiveEffect } from './entities';
import type { LevelData } from './level';
import type { Achievement, Quest, PlayerStats, PlayerUpgrade } from './progression';

// Game Status
export type GameStatus = 'menu' | 'playing' | 'paused' | 'cutscene' | 'shop' | 'game-over' | 'victory' | 'level-complete';

// Difficulty
export type Difficulty = 'easy' | 'normal' | 'hard';

// Player State
export interface PlayerState {
    snake: Position[];        // Snake body segments
    direction: 'up' | 'down' | 'left' | 'right';
    nextDirection: 'up' | 'down' | 'left' | 'right';
    health: number;
    maxHealth: number;
    level: number;
    xp: number;
    xpToNext: number;
    gold: number;
    stars: number;
    score: number;
    powerups: ActiveEffect[];
    upgrades: PlayerUpgrade[];
    invincible: boolean;
    hasShield: boolean;
}

// Current Level State
export interface CurrentLevel {
    data: LevelData;
    timeElapsed: number;
    starsCollected: number;
    enemiesKilled: number;
    completedObjectives: string[];
}

// RPG Game State
export interface RPGGameState {
    // Game State
    status: GameStatus;
    difficulty: Difficulty;

    // Player
    player: PlayerState;

    // Current Level
    currentLevel: CurrentLevel | null;

    // Entities
    enemies: Enemy[];
    food: Food[];
    projectiles: Projectile[];

    // Progression
    unlockedWorlds: number[];
    completedLevels: string[];
    achievements: Achievement[];
    quests: Quest[];
    stats: PlayerStats;

    // Session
    lastUpdate: number;
    isPaused: boolean;
}

// Initial state factory
export function createInitialRPGGameState(): RPGGameState {
    return {
        status: 'menu',
        difficulty: 'normal',
        player: {
            snake: [{ x: 10, y: 10 }],
            direction: 'right',
            nextDirection: 'right',
            health: 3,
            maxHealth: 3,
            level: 1,
            xp: 0,
            xpToNext: 100,
            gold: 0,
            stars: 0,
            score: 0,
            powerups: [],
            upgrades: [],
            invincible: false,
            hasShield: false,
        },
        currentLevel: null,
        enemies: [],
        food: [],
        projectiles: [],
        unlockedWorlds: [1],
        completedLevels: [],
        achievements: [],
        quests: [],
        stats: {
            totalPlayTime: 0,
            totalKills: 0,
            totalDeaths: 0,
            levelsCompleted: [],
            starsCollected: 0,
            totalStars: 0,
            highestScore: 0,
        },
        lastUpdate: Date.now(),
        isPaused: false,
    };
}
