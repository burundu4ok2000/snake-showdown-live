import { GameDifficulty } from '@/types/game';

export interface DifficultyConfig {
    speed: number; // ms per frame
    scoreMultiplier: number;
    label: string;
    color: string;
    emoji: string;
}

export const DIFFICULTY_CONFIG: Record<GameDifficulty, DifficultyConfig> = {
    easy: {
        speed: 150,
        scoreMultiplier: 0.8,
        label: 'Easy',
        color: 'text-green-500',
        emoji: '🟢',
    },
    normal: {
        speed: 100,
        scoreMultiplier: 1.0,
        label: 'Normal',
        color: 'text-yellow-500',
        emoji: '🟡',
    },
    hard: {
        speed: 70,
        scoreMultiplier: 1.3,
        label: 'Hard',
        color: 'text-orange-500',
        emoji: '🟠',
    },
    nightmare: {
        speed: 50,
        scoreMultiplier: 1.5,
        label: 'Nightmare',
        color: 'text-red-500',
        emoji: '🔴',
    },
    impossible: {
        speed: 30,
        scoreMultiplier: 2.0,
        label: 'Impossible',
        color: 'text-purple-500',
        emoji: '💀',
    },
};

export function getDifficultyConfig(difficulty: GameDifficulty): DifficultyConfig {
    return DIFFICULTY_CONFIG[difficulty];
}

export function calculateScore(baseScore: number, difficulty: GameDifficulty): number {
    const multiplier = DIFFICULTY_CONFIG[difficulty].scoreMultiplier;
    return Math.floor(baseScore * multiplier);
}
