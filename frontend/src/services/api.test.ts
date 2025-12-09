import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authApi, leaderboardApi, livePlayersApi } from '@/services/api';

// Mock fetch globally
global.fetch = vi.fn();

// Create a proper localStorage mock with in-memory storage
const createLocalStorageMock = (): Storage => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFetch = (data: any, status = 200) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global.fetch as any).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    text: async () => JSON.stringify(data),
    json: async () => data,
  });
};

describe('authApi', () => {
  beforeEach(() => {
    // Reset localStorage with a fresh mock
    global.localStorage = createLocalStorageMock();
    authApi.clearSession();
    vi.clearAllMocks();
  });


  describe('login', () => {
    it('should login and return user with token', async () => {
      const mockResponse = {
        user: { id: '1', username: 'testuser', email: 'test@example.com' },
        token: 'test-token'
      };
      mockFetch(mockResponse);

      const result = await authApi.login('test@example.com', 'password');

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBe('test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('should create new user if not found', async () => {
      const mockResponse = {
        user: { id: '2', username: 'newuser', email: 'newuser@example.com' },
        token: 'new-token'
      };
      mockFetch(mockResponse);

      const result = await authApi.login('newuser@example.com', 'password');

      expect(result.user.username).toBe('newuser');
    });
  });

  describe('signup', () => {
    it('should create new user', async () => {
      const mockResponse = {
        user: { id: '3', username: 'testuser', email: 'testuser@example.com' },
        token: 'signup-token'
      };
      mockFetch(mockResponse, 201);

      const result = await authApi.signup('testuser', 'testuser@example.com', 'password');

      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('testuser@example.com');
    });

    it('should throw error for existing email', async () => {
      mockFetch({ detail: 'User already exists' }, 409);

      await expect(
        authApi.signup('user2', 'duplicate@example.com', 'password')
      ).rejects.toThrow();
    });
  });

  describe('session management', () => {
    it('should save and retrieve session', async () => {
      const user = { id: '1', username: 'test', email: 'test@example.com' };
      localStorage.setItem('token', 'test-token');

      authApi.saveSession(user);

      // Mock getCurrentUser response
      mockFetch(user);

      const session = await authApi.getStoredSession();

      expect(session?.user).toEqual(user);
      expect(session?.token).toBe('test-token');
    });

    it('should clear session', async () => {
      const user = { id: '1', username: 'test', email: 'test@example.com' };

      authApi.saveSession(user);
      localStorage.setItem('token', 'test-token');
      authApi.clearSession();

      const session = await authApi.getStoredSession();

      expect(session).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});

describe('leaderboardApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLeaderboard', () => {
    it('should return all entries when no filter', async () => {
      const mockEntries = [
        { id: '1', username: 'player1', score: 100, mode: 'walls', date: '2024-01-01' },
        { id: '2', username: 'player2', score: 90, mode: 'pass-through', date: '2024-01-02' }
      ];
      mockFetch(mockEntries);

      const entries = await leaderboardApi.getLeaderboard();

      expect(entries.length).toBe(2);
    });

    it('should filter by mode', async () => {
      const mockEntries = [
        { id: '1', username: 'player1', score: 100, mode: 'walls', date: '2024-01-01' }
      ];
      mockFetch(mockEntries);

      const wallsEntries = await leaderboardApi.getLeaderboard('walls');

      expect(wallsEntries.every(e => e.mode === 'walls')).toBe(true);
    });

    it('should sort by score descending', async () => {
      const mockEntries = [
        { id: '1', username: 'player1', score: 100, mode: 'walls', date: '2024-01-01' },
        { id: '2', username: 'player2', score: 50, mode: 'walls', date: '2024-01-02' }
      ];
      mockFetch(mockEntries);

      const entries = await leaderboardApi.getLeaderboard();

      for (let i = 1; i < entries.length; i++) {
        expect(entries[i - 1].score).toBeGreaterThanOrEqual(entries[i].score);
      }
    });
  });

  describe('submitScore', () => {
    it('should require authentication', async () => {
      localStorage.removeItem('token');
      mockFetch({ detail: 'Not authenticated' }, 401);

      await expect(
        leaderboardApi.submitScore(100, 'pass-through')
      ).rejects.toThrow();
    });

    it('should submit score when authenticated', async () => {
      localStorage.setItem('token', 'valid-token');
      const mockEntry = { id: '10', username: 'scorer', score: 500, mode: 'walls', date: '2024-01-10' };
      mockFetch(mockEntry, 201);

      const entry = await leaderboardApi.submitScore(500, 'walls');

      expect(entry.score).toBe(500);
      expect(entry.mode).toBe('walls');
    });
  });
});

describe('livePlayersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLivePlayers', () => {
    it('should return array of live players', async () => {
      const mockPlayers = [
        {
          id: 'live-1',
          username: 'player1',
          score: 100,
          mode: 'walls' as const,
          snake: [{ x: 10, y: 10 }],
          food: { x: 5, y: 5 },
          direction: 'RIGHT' as const,
          status: 'playing' as const
        }
      ];
      mockFetch(mockPlayers);

      const players = await livePlayersApi.getLivePlayers();

      expect(Array.isArray(players)).toBe(true);
      expect(players.length).toBeGreaterThan(0);
    });

    it('should return players with required properties', async () => {
      const mockPlayers = [
        {
          id: 'live-1',
          username: 'player1',
          score: 100,
          mode: 'walls' as const,
          snake: [{ x: 10, y: 10 }],
          food: { x: 5, y: 5 },
          direction: 'RIGHT' as const,
          status: 'playing' as const
        }
      ];
      mockFetch(mockPlayers);

      const players = await livePlayersApi.getLivePlayers();
      const player = players[0];

      expect(player).toHaveProperty('id');
      expect(player).toHaveProperty('username');
      expect(player).toHaveProperty('score');
      expect(player).toHaveProperty('mode');
      expect(player).toHaveProperty('snake');
      expect(player).toHaveProperty('food');
      expect(player).toHaveProperty('direction');
      expect(player).toHaveProperty('status');
    });
  });

  describe('getPlayerById', () => {
    it('should return player by id', async () => {
      const mockPlayer = {
        id: 'live-1',
        username: 'player1',
        score: 100,
        mode: 'walls' as const,
        snake: [{ x: 10, y: 10 }],
        food: { x: 5, y: 5 },
        direction: 'RIGHT' as const,
        status: 'playing' as const
      };
      mockFetch(mockPlayer);

      const player = await livePlayersApi.getPlayerById('live-1');

      expect(player?.id).toBe('live-1');
    });

    it('should return null for non-existent id', async () => {
      mockFetch({ detail: 'Player not found' }, 404);

      const player = await livePlayersApi.getPlayerById('non-existent-id');

      expect(player).toBeNull();
    });
  });
});
