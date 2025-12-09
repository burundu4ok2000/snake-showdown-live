import { Direction, GameMode, GameState, Position, GameDifficulty, PowerUp, ActiveEffect } from '@/types/game';
import { getDifficultyConfig } from './difficultyConfig';
import { POWERUP_SPAWN_CHANCE, POWERUP_LIFETIME, getRandomPowerUpType, getPowerUpConfig } from './powerUpConfig';

export const GRID_SIZE = 25;
export const INITIAL_SNAKE_LENGTH = 3;

export function createInitialState(mode: GameMode, difficulty: GameDifficulty = 'normal'): GameState {
  const centerX = Math.floor(GRID_SIZE / 2);
  const centerY = Math.floor(GRID_SIZE / 2);

  const snake: Position[] = [];
  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ x: centerX - i, y: centerY });
  }

  return {
    snake,
    food: generateFood(snake),
    direction: 'RIGHT',
    score: 0,
    status: 'idle',
    mode,
    difficulty,
    gridSize: GRID_SIZE,
    powerUps: [],
    activeEffects: [],
  };
}

export function generateFood(snake: Position[], avoidPositions: Position[] = []): Position {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (
    isPositionOnSnake(food, snake) ||
    isPositionOnSnake(food, avoidPositions)
  );
  return food;
}

export function isPositionOnSnake(position: Position, snake: Position[]): boolean {
  return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

export function getNextHeadPosition(head: Position, direction: Direction, mode: GameMode, gridSize: number): Position {
  let newX = head.x;
  let newY = head.y;

  switch (direction) {
    case 'UP':
      newY -= 1;
      break;
    case 'DOWN':
      newY += 1;
      break;
    case 'LEFT':
      newX -= 1;
      break;
    case 'RIGHT':
      newX += 1;
      break;
  }

  if (mode === 'pass-through') {
    // Wrap around the grid
    newX = (newX + gridSize) % gridSize;
    newY = (newY + gridSize) % gridSize;
  }

  return { x: newX, y: newY };
}

export function isOutOfBounds(position: Position, gridSize: number): boolean {
  return position.x < 0 || position.x >= gridSize || position.y < 0 || position.y >= gridSize;
}

export function checkCollision(head: Position, snake: Position[], mode: GameMode, gridSize: number): boolean {
  // Check wall collision only in walls mode
  if (mode === 'walls' && isOutOfBounds(head, gridSize)) {
    return true;
  }

  // Check self collision (skip head)
  const body = snake.slice(1);
  return isPositionOnSnake(head, body);
}

export function moveSnake(state: GameState): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  const newHead = getNextHeadPosition(
    state.snake[0],
    state.direction,
    state.mode,
    state.gridSize
  );

  // Check for collision
  if (checkCollision(newHead, state.snake, state.mode, state.gridSize)) {
    return {
      ...state,
      status: 'game-over',
    };
  }

  const newSnake = [newHead, ...state.snake];
  let newFood = state.food;
  let newScore = state.score;
  let newPowerUps = [...state.powerUps];
  let newActiveEffects = [...state.activeEffects];
  const now = Date.now();

  // Check if food is eaten
  if (newHead.x === state.food.x && newHead.y === state.food.y) {
    newFood = generateFood(newSnake);

    // Apply difficulty multiplier to score
    const basePoints = 10;
    const multiplier = getDifficultyConfig(state.difficulty).scoreMultiplier;

    // Apply double points effect if active
    const hasDoublePoints = newActiveEffects.some(e => e.type === 'double-points');
    const scoreMultiplier = hasDoublePoints ? multiplier * 2 : multiplier;

    newScore += Math.floor(basePoints * scoreMultiplier);

    // 15% chance to spawn power-up
    if (Math.random() < POWERUP_SPAWN_CHANCE) {
      const powerUpType = getRandomPowerUpType();
      const powerUpPosition = generateFood(newSnake, [...newPowerUps.map(p => p.position)]);

      newPowerUps.push({
        id: `powerup_${now}_${Math.random()}`,
        type: powerUpType,
        position: powerUpPosition,
        expiresAt: now + POWERUP_LIFETIME,
      });
    }
  } else {
    // Remove tail if no food eaten
    newSnake.pop();
  }

  // Check power-up collision
  for (let i = newPowerUps.length - 1; i >= 0; i--) {
    const powerUp = newPowerUps[i];

    if (newHead.x === powerUp.position.x && newHead.y === powerUp.position.y) {
      // Collect power-up
      const config = getPowerUpConfig(powerUp.type);

      // Add active effect (except shield which is one-time)
      if (config.duration > 0) {
        newActiveEffects.push({
          type: powerUp.type,
          expiresAt: now + config.duration,
        });
      } else if (powerUp.type === 'shield') {
        // Shield is instant-use, add it
        newActiveEffects.push({
          type: 'shield',
          expiresAt: 0, // No expiry, consumed on hit
        });
      }

      // Remove collected power-up
      newPowerUps.splice(i, 1);
    }
  }

  // Remove expired power-ups
  newPowerUps = newPowerUps.filter(p => p.expiresAt > now);

  // Remove expired effects
  newActiveEffects = newActiveEffects.filter(e => e.expiresAt === 0 || e.expiresAt > now);

  return {
    ...state,
    snake: newSnake,
    food: newFood,
    score: newScore,
    powerUps: newPowerUps,
    activeEffects: newActiveEffects,
  };
}

export function changeDirection(currentDirection: Direction, newDirection: Direction): Direction {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };

  // Prevent 180-degree turns
  if (opposites[currentDirection] === newDirection) {
    return currentDirection;
  }

  return newDirection;
}

export function getDirectionFromKey(key: string): Direction | null {
  const keyMap: Record<string, Direction> = {
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    ArrowLeft: 'LEFT',
    ArrowRight: 'RIGHT',
    w: 'UP',
    W: 'UP',
    s: 'DOWN',
    S: 'DOWN',
    a: 'LEFT',
    A: 'LEFT',
    d: 'RIGHT',
    D: 'RIGHT',
  };

  return keyMap[key] || null;
}
