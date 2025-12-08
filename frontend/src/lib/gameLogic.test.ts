import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  generateFood,
  isPositionOnSnake,
  getNextHeadPosition,
  isOutOfBounds,
  checkCollision,
  moveSnake,
  changeDirection,
  getDirectionFromKey,
  GRID_SIZE,
  INITIAL_SNAKE_LENGTH,
} from '@/lib/gameLogic';

describe('createInitialState', () => {
  it('should create initial state with correct default values', () => {
    const state = createInitialState('pass-through');
    
    expect(state.snake.length).toBe(INITIAL_SNAKE_LENGTH);
    expect(state.direction).toBe('RIGHT');
    expect(state.score).toBe(0);
    expect(state.status).toBe('idle');
    expect(state.mode).toBe('pass-through');
    expect(state.gridSize).toBe(GRID_SIZE);
  });

  it('should create state with walls mode', () => {
    const state = createInitialState('walls');
    expect(state.mode).toBe('walls');
  });

  it('should position snake in the center', () => {
    const state = createInitialState('pass-through');
    const centerY = Math.floor(GRID_SIZE / 2);
    
    expect(state.snake[0].y).toBe(centerY);
  });
});

describe('generateFood', () => {
  it('should generate food not on snake', () => {
    const snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    
    for (let i = 0; i < 100; i++) {
      const food = generateFood(snake);
      expect(isPositionOnSnake(food, snake)).toBe(false);
    }
  });

  it('should generate food within grid bounds', () => {
    const snake = [{ x: 10, y: 10 }];
    
    for (let i = 0; i < 100; i++) {
      const food = generateFood(snake);
      expect(food.x).toBeGreaterThanOrEqual(0);
      expect(food.x).toBeLessThan(GRID_SIZE);
      expect(food.y).toBeGreaterThanOrEqual(0);
      expect(food.y).toBeLessThan(GRID_SIZE);
    }
  });
});

describe('isPositionOnSnake', () => {
  it('should return true if position is on snake', () => {
    const snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ];
    
    expect(isPositionOnSnake({ x: 5, y: 5 }, snake)).toBe(true);
    expect(isPositionOnSnake({ x: 4, y: 5 }, snake)).toBe(true);
  });

  it('should return false if position is not on snake', () => {
    const snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ];
    
    expect(isPositionOnSnake({ x: 6, y: 5 }, snake)).toBe(false);
    expect(isPositionOnSnake({ x: 5, y: 6 }, snake)).toBe(false);
  });
});

describe('getNextHeadPosition', () => {
  const head = { x: 10, y: 10 };

  it('should move up correctly', () => {
    const next = getNextHeadPosition(head, 'UP', 'pass-through', GRID_SIZE);
    expect(next).toEqual({ x: 10, y: 9 });
  });

  it('should move down correctly', () => {
    const next = getNextHeadPosition(head, 'DOWN', 'pass-through', GRID_SIZE);
    expect(next).toEqual({ x: 10, y: 11 });
  });

  it('should move left correctly', () => {
    const next = getNextHeadPosition(head, 'LEFT', 'pass-through', GRID_SIZE);
    expect(next).toEqual({ x: 9, y: 10 });
  });

  it('should move right correctly', () => {
    const next = getNextHeadPosition(head, 'RIGHT', 'pass-through', GRID_SIZE);
    expect(next).toEqual({ x: 11, y: 10 });
  });

  it('should wrap around in pass-through mode', () => {
    const topEdge = { x: 0, y: 0 };
    const bottomEdge = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };

    expect(getNextHeadPosition(topEdge, 'UP', 'pass-through', GRID_SIZE))
      .toEqual({ x: 0, y: GRID_SIZE - 1 });
    
    expect(getNextHeadPosition(topEdge, 'LEFT', 'pass-through', GRID_SIZE))
      .toEqual({ x: GRID_SIZE - 1, y: 0 });
    
    expect(getNextHeadPosition(bottomEdge, 'DOWN', 'pass-through', GRID_SIZE))
      .toEqual({ x: GRID_SIZE - 1, y: 0 });
    
    expect(getNextHeadPosition(bottomEdge, 'RIGHT', 'pass-through', GRID_SIZE))
      .toEqual({ x: 0, y: GRID_SIZE - 1 });
  });

  it('should not wrap around in walls mode', () => {
    const topEdge = { x: 0, y: 0 };
    const next = getNextHeadPosition(topEdge, 'UP', 'walls', GRID_SIZE);
    expect(next).toEqual({ x: 0, y: -1 });
  });
});

describe('isOutOfBounds', () => {
  it('should return true for positions outside grid', () => {
    expect(isOutOfBounds({ x: -1, y: 0 }, GRID_SIZE)).toBe(true);
    expect(isOutOfBounds({ x: 0, y: -1 }, GRID_SIZE)).toBe(true);
    expect(isOutOfBounds({ x: GRID_SIZE, y: 0 }, GRID_SIZE)).toBe(true);
    expect(isOutOfBounds({ x: 0, y: GRID_SIZE }, GRID_SIZE)).toBe(true);
  });

  it('should return false for positions inside grid', () => {
    expect(isOutOfBounds({ x: 0, y: 0 }, GRID_SIZE)).toBe(false);
    expect(isOutOfBounds({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 }, GRID_SIZE)).toBe(false);
    expect(isOutOfBounds({ x: 10, y: 10 }, GRID_SIZE)).toBe(false);
  });
});

describe('checkCollision', () => {
  it('should detect wall collision in walls mode', () => {
    const snake = [{ x: 0, y: 0 }];
    const outOfBoundsHead = { x: -1, y: 0 };
    
    expect(checkCollision(outOfBoundsHead, snake, 'walls', GRID_SIZE)).toBe(true);
  });

  it('should not detect wall collision in pass-through mode', () => {
    const snake = [{ x: 0, y: 0 }];
    const wrappedHead = { x: -1, y: 0 };
    
    expect(checkCollision(wrappedHead, snake, 'pass-through', GRID_SIZE)).toBe(false);
  });

  it('should detect self collision', () => {
    const snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
    ];
    const collidingHead = { x: 4, y: 5 };
    
    expect(checkCollision(collidingHead, snake, 'pass-through', GRID_SIZE)).toBe(true);
  });

  it('should not detect collision with head itself', () => {
    const snake = [{ x: 5, y: 5 }];
    const head = { x: 5, y: 5 };
    
    expect(checkCollision(head, snake, 'pass-through', GRID_SIZE)).toBe(false);
  });
});

describe('moveSnake', () => {
  it('should not move when not playing', () => {
    const state = createInitialState('pass-through');
    const newState = moveSnake(state);
    
    expect(newState).toEqual(state);
  });

  it('should move snake when playing', () => {
    const state = {
      ...createInitialState('pass-through'),
      status: 'playing' as const,
    };
    const originalHead = state.snake[0];
    const newState = moveSnake(state);
    
    expect(newState.snake[0]).not.toEqual(originalHead);
    expect(newState.snake[0].x).toBe(originalHead.x + 1);
  });

  it('should grow snake when eating food', () => {
    const state = {
      ...createInitialState('pass-through'),
      status: 'playing' as const,
      food: { x: 11, y: 10 },
      snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    };
    
    const newState = moveSnake(state);
    
    expect(newState.snake.length).toBe(state.snake.length + 1);
    expect(newState.score).toBe(state.score + 10);
  });

  it('should game over on collision', () => {
    const state = {
      ...createInitialState('walls'),
      status: 'playing' as const,
      snake: [{ x: GRID_SIZE - 1, y: 10 }, { x: GRID_SIZE - 2, y: 10 }],
      direction: 'RIGHT' as const,
    };
    
    const newState = moveSnake(state);
    
    expect(newState.status).toBe('game-over');
  });
});

describe('changeDirection', () => {
  it('should change direction normally', () => {
    expect(changeDirection('RIGHT', 'UP')).toBe('UP');
    expect(changeDirection('UP', 'LEFT')).toBe('LEFT');
    expect(changeDirection('LEFT', 'DOWN')).toBe('DOWN');
    expect(changeDirection('DOWN', 'RIGHT')).toBe('RIGHT');
  });

  it('should prevent 180-degree turns', () => {
    expect(changeDirection('RIGHT', 'LEFT')).toBe('RIGHT');
    expect(changeDirection('LEFT', 'RIGHT')).toBe('LEFT');
    expect(changeDirection('UP', 'DOWN')).toBe('UP');
    expect(changeDirection('DOWN', 'UP')).toBe('DOWN');
  });
});

describe('getDirectionFromKey', () => {
  it('should map arrow keys correctly', () => {
    expect(getDirectionFromKey('ArrowUp')).toBe('UP');
    expect(getDirectionFromKey('ArrowDown')).toBe('DOWN');
    expect(getDirectionFromKey('ArrowLeft')).toBe('LEFT');
    expect(getDirectionFromKey('ArrowRight')).toBe('RIGHT');
  });

  it('should map WASD keys correctly', () => {
    expect(getDirectionFromKey('w')).toBe('UP');
    expect(getDirectionFromKey('W')).toBe('UP');
    expect(getDirectionFromKey('s')).toBe('DOWN');
    expect(getDirectionFromKey('S')).toBe('DOWN');
    expect(getDirectionFromKey('a')).toBe('LEFT');
    expect(getDirectionFromKey('A')).toBe('LEFT');
    expect(getDirectionFromKey('d')).toBe('RIGHT');
    expect(getDirectionFromKey('D')).toBe('RIGHT');
  });

  it('should return null for unknown keys', () => {
    expect(getDirectionFromKey('x')).toBeNull();
    expect(getDirectionFromKey(' ')).toBeNull();
    expect(getDirectionFromKey('Enter')).toBeNull();
  });
});
