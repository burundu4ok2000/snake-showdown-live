export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameMode = 'pass-through' | 'walls';

export type GameDifficulty = 'easy' | 'normal' | 'hard' | 'nightmare' | 'impossible';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'game-over';

export type PowerUpType = 'speed-boost' | 'slow-motion' | 'shield' | 'double-points' | 'star';

export interface Position {
  x: number;
  y: number;
}

export interface PowerUp {
  id: string;
  type: PowerUpType;
  position: Position;
  expiresAt: number; // timestamp when power-up disappears
}

export interface ActiveEffect {
  type: PowerUpType;
  expiresAt: number; // timestamp when effect ends
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  status: GameStatus;
  mode: GameMode;
  difficulty: GameDifficulty;
  gridSize: number;
  powerUps: PowerUp[];
  activeEffects: ActiveEffect[];
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  mode: GameMode;
  date: string;
}

export interface LivePlayer {
  id: string;
  username: string;
  score: number;
  mode: GameMode;
  snake: Position[];
  food: Position;
  direction: Direction;
  status: GameStatus;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
