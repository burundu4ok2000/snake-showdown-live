import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authApi, leaderboardApi, livePlayersApi } from '@/services/api';

describe('authApi', () => {
  beforeEach(() => {
    localStorage.clear();
    authApi.clearSession();
  });

  describe('login', () => {
    it('should login and return user with token', async () => {
      const result = await authApi.login('test@example.com', 'password');
      
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBe('mock-jwt-token');
    });

    it('should create new user if not found', async () => {
      const result = await authApi.login('newuser@example.com', 'password');
      
      expect(result.user.username).toBe('newuser');
    });
  });

  describe('signup', () => {
    it('should create new user', async () => {
      const result = await authApi.signup('testuser', 'testuser@example.com', 'password');
      
      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('testuser@example.com');
    });

    it('should throw error for existing email', async () => {
      await authApi.signup('user1', 'duplicate@example.com', 'password');
      
      await expect(
        authApi.signup('user2', 'duplicate@example.com', 'password')
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('session management', () => {
    it('should save and retrieve session', async () => {
      const user = { id: '1', username: 'test', email: 'test@example.com' };
      
      authApi.saveSession(user);
      const session = await authApi.getStoredSession();
      
      expect(session?.user).toEqual(user);
    });

    it('should clear session', async () => {
      const user = { id: '1', username: 'test', email: 'test@example.com' };
      
      authApi.saveSession(user);
      authApi.clearSession();
      const session = await authApi.getStoredSession();
      
      expect(session).toBeNull();
    });
  });
});

describe('leaderboardApi', () => {
  describe('getLeaderboard', () => {
    it('should return all entries when no filter', async () => {
      const entries = await leaderboardApi.getLeaderboard();
      
      expect(entries.length).toBeGreaterThan(0);
    });

    it('should filter by mode', async () => {
      const wallsEntries = await leaderboardApi.getLeaderboard('walls');
      
      expect(wallsEntries.every(e => e.mode === 'walls')).toBe(true);
    });

    it('should sort by score descending', async () => {
      const entries = await leaderboardApi.getLeaderboard();
      
      for (let i = 1; i < entries.length; i++) {
        expect(entries[i - 1].score).toBeGreaterThanOrEqual(entries[i].score);
      }
    });
  });

  describe('submitScore', () => {
    it('should require authentication', async () => {
      authApi.clearSession();
      
      await expect(
        leaderboardApi.submitScore(100, 'pass-through')
      ).rejects.toThrow('Must be logged in to submit score');
    });

    it('should submit score when authenticated', async () => {
      await authApi.login('scorer@example.com', 'password');
      
      const entry = await leaderboardApi.submitScore(500, 'walls');
      
      expect(entry.score).toBe(500);
      expect(entry.mode).toBe('walls');
    });
  });
});

describe('livePlayersApi', () => {
  describe('getLivePlayers', () => {
    it('should return array of live players', async () => {
      const players = await livePlayersApi.getLivePlayers();
      
      expect(Array.isArray(players)).toBe(true);
      expect(players.length).toBeGreaterThan(0);
    });

    it('should return players with required properties', async () => {
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
      const players = await livePlayersApi.getLivePlayers();
      const firstPlayer = players[0];
      
      const player = await livePlayersApi.getPlayerById(firstPlayer.id);
      
      expect(player?.id).toBe(firstPlayer.id);
    });

    it('should return null for non-existent id', async () => {
      const player = await livePlayersApi.getPlayerById('non-existent-id');
      
      expect(player).toBeNull();
    });
  });

  describe('simulatePlayerMove', () => {
    it('should update player state', async () => {
      const players = await livePlayersApi.getLivePlayers();
      const playerId = players[0].id;
      const initialSnake = [...players[0].snake];
      
      const updated = await livePlayersApi.simulatePlayerMove(playerId);
      
      expect(updated).not.toBeNull();
      expect(updated?.snake[0]).not.toEqual(initialSnake[0]);
    });

    it('should return null for non-existent player', async () => {
      const result = await livePlayersApi.simulatePlayerMove('non-existent');
      
      expect(result).toBeNull();
    });
  });
});
