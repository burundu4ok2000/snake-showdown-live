// Entity type definitions for RPG mode

export interface Position {
    x: number;
    y: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

// Food Types
export type FoodType = 'apple' | 'gem' | 'meat' | 'lightning' | 'shield' | 'gold' | 'star';

export interface Food {
    id: string;
    type: FoodType;
    position: Position;
    points: number;
    xp: number;
    specialEffect?: 'speed' | 'invincibility' | 'shield';
    effectDuration?: number;
}

// Enemy Types
export type EnemyType = 'caterpillar' | 'scorpion' | 'spider' | 'lizard' | 'djinn' | 'golem' | 'elemental' | 'snake' | 'bat' | 'caterpillar_queen' | 'draco';


export type AIBehavior =
    | 'random_walk'      // Random movement
    | 'follow_player'    // Chase player
    | 'patrol_path'      // Follow patrol route
    | 'teleport_random'  // Teleport around
    | 'ranged_attack'    // Shoot projectiles
    | 'boss_pattern';    // Complex boss AI

export type EnemyState = 'idle' | 'patrol' | 'chase' | 'attack' | 'flee' | 'dead';

export interface Enemy {
    id: string;
    type: EnemyType;
    position: Position;
    health: number;
    maxHealth: number;
    damage: number;
    speed: number;
    ai: AIBehavior;
    state: EnemyState;
    attackCooldown: number;
    lastAttackTime: number;
    patrolPath?: Position[];
    currentPathIndex?: number;
    direction: Direction;
    animation: 'idle' | 'walk' | 'attack' | 'death';
}

// Projectile (for ranged enemies)
export interface Projectile {
    id: string;
    position: Position;
    velocity: { x: number; y: number };
    damage: number;
    ownerId: string; // Enemy ID
    lifetime: number;
    createdAt: number;
}

// Active Effects
export interface ActiveEffect {
    type: 'speed' | 'invincibility' | 'shield';
    startTime: number;
    duration: number;
    expiresAt: number;
}
