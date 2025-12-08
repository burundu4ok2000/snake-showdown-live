/**
 * Centralized API service for all backend calls.
 * Currently mocked, but structured to be easily replaced with real API calls.
 */

import { GameMode, LeaderboardEntry, LivePlayer, User } from '@/types/game';
import { generateFood, GRID_SIZE, INITIAL_SNAKE_LENGTH } from '@/lib/gameLogic';

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let mockUsers: User[] = [
  { id: '1', username: 'ProSnaker', email: 'pro@snake.com' },
  { id: '2', username: 'SnakeKing', email: 'king@snake.com' },
  { id: '3', username: 'Slither99', email: 'slither@snake.com' },
];

let mockCurrentUser: User | null = null;

const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', username: 'ProSnaker', score: 2450, mode: 'walls', date: '2024-01-15' },
  { id: '2', username: 'SnakeKing', score: 2100, mode: 'pass-through', date: '2024-01-14' },
  { id: '3', username: 'Slither99', score: 1890, mode: 'walls', date: '2024-01-13' },
  { id: '4', username: 'GameMaster', score: 1750, mode: 'pass-through', date: '2024-01-12' },
  { id: '5', username: 'NightCrawler', score: 1620, mode: 'walls', date: '2024-01-11' },
  { id: '6', username: 'PixelHunter', score: 1500, mode: 'pass-through', date: '2024-01-10' },
  { id: '7', username: 'RetroGamer', score: 1350, mode: 'walls', date: '2024-01-09' },
  { id: '8', username: 'ArcadeChamp', score: 1200, mode: 'pass-through', date: '2024-01-08' },
  { id: '9', username: 'SnakeWhisperer', score: 1100, mode: 'walls', date: '2024-01-07' },
  { id: '10', username: 'GridRunner', score: 950, mode: 'pass-through', date: '2024-01-06' },
];

// Generate mock live players with simulated game states
function generateMockLivePlayers(): LivePlayer[] {
  const modes: GameMode[] = ['pass-through', 'walls'];
  const names = ['SpeedySnake', 'NeonViper', 'CyberSerpent', 'QuantumCoil', 'PixelPython'];
  
  return names.map((name, index) => {
    const centerX = Math.floor(GRID_SIZE / 2);
    const centerY = Math.floor(GRID_SIZE / 2);
    const snakeLength = INITIAL_SNAKE_LENGTH + Math.floor(Math.random() * 10);
    
    const snake = [];
    for (let i = 0; i < snakeLength; i++) {
      snake.push({ 
        x: (centerX - i + GRID_SIZE) % GRID_SIZE, 
        y: centerY 
      });
    }
    
    return {
      id: `live-${index}`,
      username: name,
      score: Math.floor(Math.random() * 500) + 100,
      mode: modes[index % 2],
      snake,
      food: generateFood(snake),
      direction: 'RIGHT' as const,
      status: 'playing' as const,
    };
  });
}

let mockLivePlayers = generateMockLivePlayers();

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(500);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      // For demo, create a new user if not found
      const newUser: User = {
        id: String(mockUsers.length + 1),
        username: email.split('@')[0],
        email,
      };
      mockUsers.push(newUser);
      mockCurrentUser = newUser;
      return { user: newUser, token: 'mock-jwt-token' };
    }
    
    mockCurrentUser = user;
    return { user, token: 'mock-jwt-token' };
  },
  
  async signup(username: string, email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(500);
    
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const newUser: User = {
      id: String(mockUsers.length + 1),
      username,
      email,
    };
    mockUsers.push(newUser);
    mockCurrentUser = newUser;
    
    return { user: newUser, token: 'mock-jwt-token' };
  },
  
  async logout(): Promise<void> {
    await delay(200);
    mockCurrentUser = null;
  },
  
  async getCurrentUser(): Promise<User | null> {
    await delay(200);
    return mockCurrentUser;
  },
  
  async getStoredSession(): Promise<{ user: User; token: string } | null> {
    await delay(100);
    const storedUser = localStorage.getItem('snake_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      mockCurrentUser = user;
      return { user, token: 'mock-jwt-token' };
    }
    return null;
  },
  
  saveSession(user: User): void {
    localStorage.setItem('snake_user', JSON.stringify(user));
    mockCurrentUser = user;
  },
  
  clearSession(): void {
    localStorage.removeItem('snake_user');
    mockCurrentUser = null;
  },
};

// Leaderboard API
export const leaderboardApi = {
  async getLeaderboard(mode?: GameMode): Promise<LeaderboardEntry[]> {
    await delay(300);
    
    let entries = [...mockLeaderboard];
    if (mode) {
      entries = entries.filter(e => e.mode === mode);
    }
    
    return entries.sort((a, b) => b.score - a.score);
  },
  
  async submitScore(score: number, mode: GameMode): Promise<LeaderboardEntry> {
    await delay(300);
    
    if (!mockCurrentUser) {
      throw new Error('Must be logged in to submit score');
    }
    
    const entry: LeaderboardEntry = {
      id: String(mockLeaderboard.length + 1),
      username: mockCurrentUser.username,
      score,
      mode,
      date: new Date().toISOString().split('T')[0],
    };
    
    mockLeaderboard.push(entry);
    return entry;
  },
};

// Live Players API
export const livePlayersApi = {
  async getLivePlayers(): Promise<LivePlayer[]> {
    await delay(200);
    return [...mockLivePlayers];
  },
  
  async getPlayerById(id: string): Promise<LivePlayer | null> {
    await delay(100);
    return mockLivePlayers.find(p => p.id === id) || null;
  },
  
  // Simulate player movement for spectator mode
  async simulatePlayerMove(playerId: string): Promise<LivePlayer | null> {
    await delay(50);
    
    const playerIndex = mockLivePlayers.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return null;
    
    const player = mockLivePlayers[playerIndex];
    const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'] as const;
    const opposites: Record<string, string> = {
      UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT'
    };
    
    // Random direction change (20% chance)
    let newDirection = player.direction;
    if (Math.random() < 0.2) {
      const validDirections = directions.filter(d => d !== opposites[player.direction]);
      newDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
    }
    
    // Calculate new head position
    const head = player.snake[0];
    let newX = head.x;
    let newY = head.y;
    
    switch (newDirection) {
      case 'UP': newY = (newY - 1 + GRID_SIZE) % GRID_SIZE; break;
      case 'DOWN': newY = (newY + 1) % GRID_SIZE; break;
      case 'LEFT': newX = (newX - 1 + GRID_SIZE) % GRID_SIZE; break;
      case 'RIGHT': newX = (newX + 1) % GRID_SIZE; break;
    }
    
    const newHead = { x: newX, y: newY };
    const newSnake = [newHead, ...player.snake];
    let newFood = player.food;
    let newScore = player.score;
    
    // Check if food eaten
    if (newHead.x === player.food.x && newHead.y === player.food.y) {
      newFood = generateFood(newSnake);
      newScore += 10;
    } else {
      newSnake.pop();
    }
    
    const updatedPlayer: LivePlayer = {
      ...player,
      snake: newSnake,
      food: newFood,
      direction: newDirection,
      score: newScore,
    };
    
    mockLivePlayers[playerIndex] = updatedPlayer;
    return updatedPlayer;
  },
};

// Game API (for future multiplayer)
export const gameApi = {
  async saveGame(score: number, mode: GameMode): Promise<void> {
    await delay(200);
    if (mockCurrentUser) {
      await leaderboardApi.submitScore(score, mode);
    }
  },
};
