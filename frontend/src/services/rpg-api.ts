// RPG Leaderboard API Service

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface RPGLeaderboardEntry {
    rank: number;
    username: string;
    score: number;
    time_seconds: number;
    completed_at: string;
}

export interface RPGScoreSubmission {
    level_id: number;
    score: number;
    time_seconds: number;
}

/**
 * Submit a score to RPG leaderboard for a specific level
 * Requires authentication token
 */
export async function submitRPGScore(
    levelId: number,
    score: number,
    timeSeconds: number,
    token: string
): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/rpg/leaderboard?level_id=${levelId}&score=${score}&time_seconds=${timeSeconds}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to submit score: ${response.statusText}`);
    }
}

/**
 * Get leaderboard for a specific RPG level
 * Public endpoint, no auth required
 */
export async function getRPGLeaderboard(
    levelId: number,
    limit: number = 10
): Promise<RPGLeaderboardEntry[]> {
    const response = await fetch(`${API_BASE_URL}/rpg/leaderboard/${levelId}?limit=${limit}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }

    return response.json();
}
