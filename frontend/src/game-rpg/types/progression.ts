// Progression system types

// Player Upgrade
export interface PlayerUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    purchased: boolean;
    effect: {
        type: 'speed' | 'health' | 'magnet' | 'xray' | 'ghost';
        value: number;
    };
}

// Achievement
export interface Achievement {
    id: string;
    name: string;
    description: string;
    category: 'story' | 'skill' | 'misc';
    unlocked: boolean;
    unlockedAt?: number;
    icon?: string;
}

// Quest
export interface Quest {
    id: string;
    title: string;
    description: string;
    type: 'kill' | 'collect' | 'survive' | 'explore';
    target: number;
    current: number;
    reward: {
        gold?: number;
        xp?: number;
        item?: string;
    };
    completed: boolean;
}

// Player Stats
export interface PlayerStats {
    totalPlayTime: number;
    totalKills: number;
    totalDeaths: number;
    levelsCompleted: string[];
    starsCollected: number;
    totalStars: number;
    highestScore: number;
}
