import React, { useRef, useEffect } from 'react';
import { GameState, Position } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameCanvasProps {
  gameState: GameState;
  className?: string;
  showControls?: boolean;
}

const CELL_SIZE = 20;

// Premium Theme Colors
const COLORS = {
  background: '#09090b', // zinc-950
  grid: '#18181b',       // zinc-900
  snakeHead: '#8b5cf6',  // violet-500
  snakeBody: '#a78bfa',  // violet-400
  snakeGlow: 'rgba(139, 92, 246, 0.5)',
  food: '#db2777',       // pink-600
  foodGlow: 'rgba(219, 39, 119, 0.6)',
  walls: '#27272a',      // zinc-800
};

export function GameCanvas({ gameState, className, showControls = false }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { snake, food, gridSize, mode } = gameState;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = gridSize * CELL_SIZE;
    // Set internal resolution
    canvas.width = size;
    canvas.height = size;

    // Clear and draw background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, size, size);

    // Draw grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(size, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw walls border for walls mode
    if (mode === 'walls') {
      ctx.strokeStyle = COLORS.walls;
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, size - 4, size - 4);
    }

    // Draw food with glow
    ctx.shadowColor = COLORS.foodGlow;
    ctx.shadowBlur = 15;
    ctx.fillStyle = COLORS.food;
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;

      if (isHead) {
        ctx.shadowColor = COLORS.snakeGlow;
        ctx.shadowBlur = 10;
      }

      ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snakeBody;

      const padding = isHead ? 1 : 2;
      const radius = isHead ? 6 : 4;

      // Draw rounded rectangle
      const x = segment.x * CELL_SIZE + padding;
      const y = segment.y * CELL_SIZE + padding;
      const w = CELL_SIZE - padding * 2;
      const h = CELL_SIZE - padding * 2;

      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fill();

      if (isHead) {
        ctx.shadowBlur = 0;

        // Draw eyes
        ctx.fillStyle = '#fff';
        const eyeSize = 3;
        const eyeOffset = 4;

        const eye1X = x + w / 2 - eyeOffset;
        const eye2X = x + w / 2 + eyeOffset;
        const eyeY = y + h / 3;

        ctx.beginPath();
        ctx.arc(eye1X, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.arc(eye2X, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

  }, [snake, food, gridSize, mode]);

  return (
    <div className={cn("relative flex justify-center items-center w-full", className)}>
      <canvas
        ref={canvasRef}
        className="rounded-xl border border-white/10 shadow-2xl w-full max-w-[500px] h-auto aspect-square"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}

