/**
 * Centralized API service for all backend calls.
 */

import { GameMode, LeaderboardEntry, LivePlayer, User } from '@/types/game';

// Use /api prefix for production (nginx proxy), or env variable
const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  // Some endpoints might return empty body
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    localStorage.setItem('token', data.token);
    return data;
  },

  async signup(username: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await handleResponse(response);
    localStorage.setItem('token', data.token);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: getHeaders(),
      });
    } catch (e) {
      console.error("Logout failed", e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('snake_user');
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch current user", error);
      return null;
    }
  },

  async getStoredSession(): Promise<{ user: User; token: string } | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // Verify token by fetching current user
    const user = await this.getCurrentUser();
    if (user) {
      return { user, token };
    }

    // If invalid, clear storage
    this.clearSession();
    return null;
  },

  saveSession(user: User): void {
    localStorage.setItem('snake_user', JSON.stringify(user));
  },

  clearSession(): void {
    localStorage.removeItem('snake_user');
    localStorage.removeItem('token');
  },
};

// Leaderboard API
export const leaderboardApi = {
  async getLeaderboard(mode?: GameMode): Promise<LeaderboardEntry[]> {
    const url = new URL(`${API_URL}/leaderboard`);
    if (mode) {
      url.searchParams.append('mode', mode);
    }

    const response = await fetch(url.toString(), {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async submitScore(score: number, mode: GameMode): Promise<LeaderboardEntry> {
    const response = await fetch(`${API_URL}/leaderboard`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ score, mode }),
    });
    return handleResponse(response);
  },
};

// Live Players API
export const livePlayersApi = {
  async getLivePlayers(): Promise<LivePlayer[]> {
    const response = await fetch(`${API_URL}/live-players`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getPlayerById(id: string): Promise<LivePlayer | null> {
    try {
      const response = await fetch(`${API_URL}/live-players/${id}`, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch {
      return null;
    }
  },

  // Simulation is now client-side, see lib/simulation.ts
  // Kept here for compatibility if needed, but SpectatorView uses lib function now.
  async simulatePlayerMove(playerId: string): Promise<LivePlayer | null> {
    // No-op or throw, as proper simulation is moved
    console.warn("livePlayersApi.simulatePlayerMove is deprecated. Use client-side simulation.");
    return null;
  },
};

// Game API (for future multiplayer)
export const gameApi = {
  async saveGame(score: number, mode: GameMode): Promise<void> {
    await leaderboardApi.submitScore(score, mode);
  },
};
