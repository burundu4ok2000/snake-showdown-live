// Level and map type definitions

import { Position, EnemyType, FoodType } from './entities';

// Tile Types
export type TileType = 'floor' | 'wall' | 'lava' | 'ice' | 'water' | 'sand';

export interface Tile {
    type: TileType;
    walkable: boolean;
    damage: number;        // Damage per second if standing on it
    friction: number;      // 1.0 = normal, < 1.0 = slippery, > 1.0 = sticky
    sprite?: string;       // Optional sprite identifier
}

// Enemy Spawn Configuration
export interface EnemySpawn {
    enemyType: EnemyType;
    position: Position;
    patrolPath?: Position[];
    spawnDelay: number;    // Delay in seconds before spawning
}

// Food Spawn Configuration
export interface FoodSpawn {
    foodType: FoodType;
    position: Position;
    respawnTime?: number;  // Time in seconds before respawn (0 = no respawn)
}

// Secret Room
export interface SecretRoom {
    entrance: Position;
    area: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    reward: FoodSpawn[];
}

// Level Map
export interface LevelMap {
    width: number;
    height: number;
    tiles: Tile[][];
    spawnPoint: Position;
    exitPoint: Position;
    enemySpawns: EnemySpawn[];
    foodSpawns: FoodSpawn[];
    secretRooms?: SecretRoom[];
}

// Level Objective
export interface Objective {
    id: string;
    type: 'kill_all' | 'collect_items' | 'survive' | 'reach_exit' | 'defeat_boss';
    description: string;
    required: number;
    current: number;
    completed: boolean;
}

// World Info
export interface World {
    id: number;
    name: string;
    theme: 'forest' | 'desert' | 'ice' | 'fire' | 'tower';
    levels: number[];
    bossLevel: number;
    unlocked: boolean;
}

// Level Data
export interface LevelData {
    id: number;
    worldId: number;
    name: string;
    description: string;
    map: LevelMap;
    objectives: Objective[];
    musicTrack?: string;
    nextLevel?: number;
}
