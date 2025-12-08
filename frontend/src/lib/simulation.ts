import { LivePlayer } from '@/types/game';
import { generateFood, GRID_SIZE } from './gameLogic';

export function simulatePlayerMove(player: LivePlayer): LivePlayer {
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

    return {
        ...player,
        snake: newSnake,
        food: newFood,
        direction: newDirection,
        score: newScore,
    };
}
