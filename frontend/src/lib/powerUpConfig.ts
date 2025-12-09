import { PowerUpType } from '@/types/game';

export interface PowerUpConfig {
    emoji: string;
    label: string;
    duration: number; // milliseconds
    color: string;
    description: string;
}

export const POWERUP_CONFIG: Record<PowerUpType, PowerUpConfig> = {
    'speed-boost': {
        emoji: '🚀',
        label: 'Speed Boost',
        duration: 5000,
        color: 'text-blue-400',
        description: 'Move faster! +50% score',
    },
    'slow-motion': {
        emoji: '🐢',
        label: 'Slow Motion',
        duration: 7000,
        color: 'text-green-400',
        description: 'Time slows down',
    },
    'shield': {
        emoji: '🛡️',
        label: 'Shield',
        duration: 0, // One-time use
        color: 'text-yellow-400',
        description: 'Protects from one collision',
    },
    'double-points': {
        emoji: '💎',
        label: 'Double Points',
        duration: 10000,
        color: 'text-purple-400',
        description: 'Double score for 10 seconds',
    },
    'star': {
        emoji: '🌟',
        label: 'Invincibility',
        duration: 5000,
        color: 'text-pink-400',
        description: 'Pass through yourself',
    },
};

export const POWERUP_SPAWN_CHANCE = 0.15; // 15% chance to spawn after eating food
export const POWERUP_LIFETIME = 10000; // 10 seconds before disappearing

export function getRandomPowerUpType(): PowerUpType {
    const types = Object.keys(POWERUP_CONFIG) as PowerUpType[];
    return types[Math.floor(Math.random() * types.length)];
}

export function getPowerUpConfig(type: PowerUpType): PowerUpConfig {
    return POWERUP_CONFIG[type];
}
