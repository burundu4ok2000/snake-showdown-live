// RPG Canvas Component
// Renders the game world on canvas

import React, { useRef, useEffect } from 'react';
import { RPGGameState } from '../types/gameState';

interface RPGCanvasProps {
    gameState: RPGGameState;
}

const TILE_SIZE = 25; // pixels per tile (increased for better visibility)
const CANVAS_PADDING = 40;

export function RPGCanvas({ gameState }: RPGCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !gameState.currentLevel) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const map = gameState.currentLevel.data.map;

        // Set canvas size
        const width = map.width * TILE_SIZE + CANVAS_PADDING * 2;
        const height = map.height * TILE_SIZE + CANVAS_PADDING * 2;

        canvas.width = width;
        canvas.height = height;

        // Clear canvas
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        // Save context
        ctx.save();
        ctx.translate(CANVAS_PADDING, CANVAS_PADDING);

        // Render tiles
        renderTiles(ctx, map);

        // Render food
        gameState.food.forEach(food => renderFood(ctx, food));

        // Render enemies
        gameState.enemies.forEach(enemy => renderEnemy(ctx, enemy));

        // Render snake
        renderSnake(ctx, gameState.player.snake, gameState.player.invincible);

        // Render exit
        renderExit(ctx, map.exitPoint);

        // Restore context
        ctx.restore();
    }, [gameState]);

    return (
        <canvas
            ref={canvasRef}
            className="border-2 border-white/20 rounded-lg bg-black shadow-2xl"
            style={{
                imageRendering: 'pixelated',
            }}
        />
    );
}

// Render tiles/map
function renderTiles(ctx: CanvasRenderingContext2D, map: any) {
    for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
            const tile = map.tiles[y][x];
            const px = x * TILE_SIZE;
            const py = y * TILE_SIZE;

            switch (tile.type) {
                case 'floor':
                    ctx.fillStyle = '#1a4d2e';
                    break;
                case 'wall':
                    ctx.fillStyle = '#4a5568';
                    break;
                case 'lava':
                    // Animated lava with red/orange variation
                    const lavaShade = Math.floor((x + y + Date.now() / 200) % 3);
                    const lavaColors = ['#ff4400', '#ff6622', '#ff3311'];
                    ctx.fillStyle = lavaColors[lavaShade];
                    break;
                case 'ice':
                    // Bright ice with cyan/blue variation
                    const iceShade = Math.floor((x + y) % 4);
                    const iceColors = ['#a8daff', '#88ccff', '#b8e6ff', '#98d8ff'];
                    ctx.fillStyle = iceColors[iceShade];
                    break;
                case 'sand':
                    // Warm desert sand with slight variation
                    const sandShade = Math.floor((x + y) % 3);
                    const sandColors = ['#e6c35c', '#d4af37', '#f0d77a'];
                    ctx.fillStyle = sandColors[sandShade];
                    break;
                default:
                    ctx.fillStyle = '#1a4d2e';
            }

            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

            // Grid lines
            ctx.strokeStyle = '#00000020';
            ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

            // Add sparkle effect for ice
            if (tile.type === 'ice' && Math.random() > 0.95) {
                ctx.fillStyle = '#ffffff80';
                ctx.fillRect(px + TILE_SIZE * 0.7, py + TILE_SIZE * 0.2, 2, 2);
            }

            // Add bubbles for lava
            if (tile.type === 'lava' && Math.random() > 0.92) {
                ctx.fillStyle = '#ff880060';
                ctx.beginPath();
                ctx.arc(px + TILE_SIZE * 0.5, py + TILE_SIZE * 0.5, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// Render food
function renderFood(ctx: CanvasRenderingContext2D, food: any) {
    // Center in grid cell
    const px = food.position.x * TILE_SIZE + TILE_SIZE / 2;
    const py = food.position.y * TILE_SIZE + TILE_SIZE / 2;

    ctx.save();

    // Draw different shapes based on food type with more details
    switch (food.type) {
        case 'apple':
            // Red apple with leaf
            ctx.fillStyle = '#ff3333';
            ctx.beginPath();
            ctx.arc(px, py, TILE_SIZE * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#990000';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Leaf on top
            ctx.fillStyle = '#44ff44';
            ctx.beginPath();
            ctx.ellipse(px + TILE_SIZE * 0.15, py - TILE_SIZE * 0.3, TILE_SIZE * 0.12, TILE_SIZE * 0.08, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
            // Highlight
            ctx.fillStyle = '#ff9999';
            ctx.beginPath();
            ctx.arc(px - TILE_SIZE * 0.12, py - TILE_SIZE * 0.12, TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'gem':
            // Sparkling diamond with facets
            ctx.fillStyle = '#00ff88';
            ctx.beginPath();
            ctx.moveTo(px, py - TILE_SIZE * 0.4);
            ctx.lineTo(px + TILE_SIZE * 0.3, py);
            ctx.lineTo(px, py + TILE_SIZE * 0.4);
            ctx.lineTo(px - TILE_SIZE * 0.3, py);
            ctx.closePath();
            ctx.fill();
            // Facets
            ctx.strokeStyle = '#00cc66';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px, py - TILE_SIZE * 0.4);
            ctx.lineTo(px, py + TILE_SIZE * 0.4);
            ctx.moveTo(px - TILE_SIZE * 0.3, py);
            ctx.lineTo(px + TILE_SIZE * 0.3, py);
            ctx.stroke();
            // Shine
            ctx.fillStyle = '#ccffee';
            ctx.beginPath();
            ctx.arc(px - TILE_SIZE * 0.1, py - TILE_SIZE * 0.15, TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'meat':
            // Meat on bone
            ctx.fillStyle = '#dd6633';
            const meatSize = TILE_SIZE * 0.35;
            // Meat part
            ctx.beginPath();
            ctx.arc(px - TILE_SIZE * 0.1, py, meatSize, 0, Math.PI * 2);
            ctx.fill();
            // Bone
            ctx.fillStyle = '#ffeecc';
            ctx.fillRect(px + TILE_SIZE * 0.05, py - TILE_SIZE * 0.05, TILE_SIZE * 0.25, TILE_SIZE * 0.1);
            ctx.beginPath();
            ctx.arc(px + TILE_SIZE * 0.3, py, TILE_SIZE * 0.08, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#cc4422';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(px - TILE_SIZE * 0.1, py, meatSize, 0, Math.PI * 2);
            ctx.stroke();
            break;

        case 'lightning':
            // Zigzag lightning bolt
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(px, py - TILE_SIZE * 0.4);
            ctx.lineTo(px - TILE_SIZE * 0.1, py - TILE_SIZE * 0.05);
            ctx.lineTo(px + TILE_SIZE * 0.15, py);
            ctx.lineTo(px - TILE_SIZE * 0.05, py + TILE_SIZE * 0.05);
            ctx.lineTo(px, py + TILE_SIZE * 0.4);
            ctx.lineTo(px + TILE_SIZE * 0.05, py);
            ctx.lineTo(px - TILE_SIZE * 0.15, py - TILE_SIZE * 0.1);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#cc9900';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Glow
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
            break;

        case 'shield':
            // Shield with cross
            ctx.fillStyle = '#4477ff';
            ctx.beginPath();
            // Shield shape (rounded top, pointed bottom)
            ctx.moveTo(px, py - TILE_SIZE * 0.35);
            ctx.lineTo(px + TILE_SIZE * 0.3, py - TILE_SIZE * 0.2);
            ctx.lineTo(px + TILE_SIZE * 0.3, py + TILE_SIZE * 0.1);
            ctx.lineTo(px, py + TILE_SIZE * 0.4);
            ctx.lineTo(px - TILE_SIZE * 0.3, py + TILE_SIZE * 0.1);
            ctx.lineTo(px - TILE_SIZE * 0.3, py - TILE_SIZE * 0.2);
            ctx.closePath();
            ctx.fill();
            // Cross on shield
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(px, py - TILE_SIZE * 0.25);
            ctx.lineTo(px, py + TILE_SIZE * 0.15);
            ctx.moveTo(px - TILE_SIZE * 0.2, py - TILE_SIZE * 0.05);
            ctx.lineTo(px + TILE_SIZE * 0.2, py - TILE_SIZE * 0.05);
            ctx.stroke();
            // Border
            ctx.strokeStyle = '#2244aa';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px, py - TILE_SIZE * 0.35);
            ctx.lineTo(px + TILE_SIZE * 0.3, py - TILE_SIZE * 0.2);
            ctx.lineTo(px + TILE_SIZE * 0.3, py + TILE_SIZE * 0.1);
            ctx.lineTo(px, py + TILE_SIZE * 0.4);
            ctx.lineTo(px - TILE_SIZE * 0.3, py + TILE_SIZE * 0.1);
            ctx.lineTo(px - TILE_SIZE * 0.3, py - TILE_SIZE * 0.2);
            ctx.closePath();
            ctx.stroke();
            break;

        case 'gold':
            // Gold coin with $
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(px, py, TILE_SIZE * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#cc9900';
            ctx.lineWidth = 3;
            ctx.stroke();
            // Inner circle
            ctx.strokeStyle = '#ffdd66';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(px, py, TILE_SIZE * 0.28, 0, Math.PI * 2);
            ctx.stroke();
            // $ symbol
            ctx.fillStyle = '#996600';
            ctx.font = `bold ${TILE_SIZE * 0.5}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', px, py);
            break;

        case 'star':
            // Glowing 5-pointed star
            ctx.fillStyle = '#ffee00';
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
                const radius = i % 2 === 0 ? TILE_SIZE * 0.4 : TILE_SIZE * 0.18;
                const x = px + Math.cos(angle) * radius;
                const y = py + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            // Glow effect
            ctx.shadowColor = '#ffee00';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.shadowBlur = 0;
            // Border
            ctx.strokeStyle = '#cc9900';
            ctx.lineWidth = 2;
            ctx.stroke();
            // White center
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(px, py, TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.fill();
            break;

        default:
            // Default circle
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(px, py, TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.fill();
    }

    ctx.restore();
}

// Render enemy
function renderEnemy(ctx: CanvasRenderingContext2D, enemy: any) {
    if (enemy.state === 'dead') return;

    // Center in grid cell
    const px = enemy.position.x * TILE_SIZE + TILE_SIZE / 2; // Center X
    const py = enemy.position.y * TILE_SIZE + TILE_SIZE / 2; // Center Y

    ctx.save();

    // Draw different shapes based on enemy type
    switch (enemy.type) {
        case 'caterpillar':
            // Green wavy creature (3 circles)
            ctx.fillStyle = '#88ff44';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                const offset = (i - 1) * TILE_SIZE * 0.2;
                ctx.arc(px + offset, py, TILE_SIZE * 0.15, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.strokeStyle = '#66cc22';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                const offset = (i - 1) * TILE_SIZE * 0.2;
                ctx.arc(px + offset, py, TILE_SIZE * 0.15, 0, Math.PI * 2);
                ctx.stroke();
            }
            break;

        case 'scorpion':
            // Orange menacing shape (triangle with tail)
            ctx.fillStyle = '#ff8844';
            ctx.beginPath();
            // Main body (triangle)
            ctx.moveTo(px, py - TILE_SIZE * 0.3);
            ctx.lineTo(px + TILE_SIZE * 0.3, py + TILE_SIZE * 0.2);
            ctx.lineTo(px - TILE_SIZE * 0.3, py + TILE_SIZE * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#cc5522';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Tail (small circle on top)
            ctx.fillStyle = '#ff4422';
            ctx.beginPath();
            ctx.arc(px, py - TILE_SIZE * 0.4, TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'spider':
            // Purple scary spider (octagon with legs)
            ctx.fillStyle = '#aa44ff';
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x = px + Math.cos(angle) * TILE_SIZE * 0.3;
                const y = py + Math.sin(angle) * TILE_SIZE * 0.3;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#7722cc';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Eyes
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(px - TILE_SIZE * 0.1, py - TILE_SIZE * 0.05, TILE_SIZE * 0.05, 0, Math.PI * 2);
            ctx.arc(px + TILE_SIZE * 0.1, py - TILE_SIZE * 0.05, TILE_SIZE * 0.05, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'lizard':
            // Yellow-orange reptile (elongated hexagon)
            ctx.fillStyle = '#ffaa44';
            ctx.beginPath();
            ctx.moveTo(px - TILE_SIZE * 0.4, py);
            ctx.lineTo(px - TILE_SIZE * 0.2, py - TILE_SIZE * 0.25);
            ctx.lineTo(px + TILE_SIZE * 0.2, py - TILE_SIZE * 0.25);
            ctx.lineTo(px + TILE_SIZE * 0.4, py);
            ctx.lineTo(px + TILE_SIZE * 0.2, py + TILE_SIZE * 0.25);
            ctx.lineTo(px - TILE_SIZE * 0.2, py + TILE_SIZE * 0.25);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#cc7722';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;

        case 'djinn':
            // Blue genie lamp shape (simple blob)
            ctx.fillStyle = '#4488ff';
            ctx.beginPath();
            ctx.ellipse(px, py + TILE_SIZE * 0.1, TILE_SIZE * 0.3, TILE_SIZE * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#2266cc';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Crown eyes
            ctx.fillStyle = '#000000';
            ctx.fillRect(px - TILE_SIZE * 0.1, py - TILE_SIZE * 0.05, 4, 4);
            ctx.fillRect(px + TILE_SIZE * 0.05, py - TILE_SIZE * 0.05, 4, 4);
            break;

        case 'golem':
            // Grey rock-like shape (irregular polygon)
            ctx.fillStyle = '#888888';
            ctx.beginPath();
            ctx.moveTo(px - TILE_SIZE * 0.3, py - TILE_SIZE * 0.3);
            ctx.lineTo(px + TILE_SIZE * 0.2, py - TILE_SIZE * 0.4);
            ctx.lineTo(px + TILE_SIZE * 0.4, py - TILE_SIZE * 0.1);
            ctx.lineTo(px + TILE_SIZE * 0.3, py + TILE_SIZE * 0.3);
            ctx.lineTo(px - TILE_SIZE * 0.1, py + TILE_SIZE * 0.4);
            ctx.lineTo(px - TILE_SIZE * 0.4, py + TILE_SIZE * 0.1);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#555555';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;

        case 'elemental':
            // Fiery shape (jagged circle/star)
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            const numPoints = 8;
            const outerRadius = TILE_SIZE * 0.4;
            const innerRadius = TILE_SIZE * 0.2;
            for (let i = 0; i < numPoints * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i / (numPoints * 2)) * Math.PI * 2;
                const x = px + Math.cos(angle) * radius;
                const y = py + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#cc3300';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;

        case 'snake':
            // Slithering snake (wavy body)
            ctx.fillStyle = '#cc3333';
            ctx.beginPath();
            // Head (diamond shape)
            ctx.moveTo(px, py - TILE_SIZE * 0.35);
            ctx.lineTo(px + TILE_SIZE * 0.25, py);
            ctx.lineTo(px, py + TILE_SIZE * 0.35);
            ctx.lineTo(px - TILE_SIZE * 0.25, py);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#990000';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Eyes
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(px - TILE_SIZE * 0.08, py - TILE_SIZE * 0.08, TILE_SIZE * 0.06, 0, Math.PI * 2);
            ctx.arc(px + TILE_SIZE * 0.08, py - TILE_SIZE * 0.08, TILE_SIZE * 0.06, 0, Math.PI * 2);
            ctx.fill();
            // Tongue
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(px, py + TILE_SIZE * 0.25);
            ctx.lineTo(px, py + TILE_SIZE * 0.4);
            ctx.stroke();
            break;

        case 'bat':
            // Bat with spread wings
            ctx.fillStyle = '#663399';
            // Body (oval)
            ctx.beginPath();
            ctx.ellipse(px, py, TILE_SIZE * 0.15, TILE_SIZE * 0.2, 0, 0, Math.PI * 2);
            ctx.fill();
            // Wings (two triangles)
            ctx.fillStyle = '#553388';
            ctx.beginPath();
            // Left wing
            ctx.moveTo(px - TILE_SIZE * 0.1, py);
            ctx.lineTo(px - TILE_SIZE * 0.4, py - TILE_SIZE * 0.2);
            ctx.lineTo(px - TILE_SIZE * 0.3, py + TILE_SIZE * 0.1);
            ctx.closePath();
            ctx.fill();
            // Right wing
            ctx.beginPath();
            ctx.moveTo(px + TILE_SIZE * 0.1, py);
            ctx.lineTo(px + TILE_SIZE * 0.4, py - TILE_SIZE * 0.2);
            ctx.lineTo(px + TILE_SIZE * 0.3, py + TILE_SIZE * 0.1);
            ctx.closePath();
            ctx.fill();
            // Ears
            ctx.fillStyle = '#663399';
            ctx.beginPath();
            ctx.moveTo(px - TILE_SIZE * 0.08, py - TILE_SIZE * 0.15);
            ctx.lineTo(px - TILE_SIZE * 0.15, py - TILE_SIZE * 0.35);
            ctx.lineTo(px, py - TILE_SIZE * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(px + TILE_SIZE * 0.08, py - TILE_SIZE * 0.15);
            ctx.lineTo(px + TILE_SIZE * 0.15, py - TILE_SIZE * 0.35);
            ctx.lineTo(px, py - TILE_SIZE * 0.2);
            ctx.closePath();
            ctx.fill();
            // Eyes (red glow)
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(px - TILE_SIZE * 0.05, py - TILE_SIZE * 0.05, TILE_SIZE * 0.04, 0, Math.PI * 2);
            ctx.arc(px + TILE_SIZE * 0.05, py - TILE_SIZE * 0.05, TILE_SIZE * 0.04, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'caterpillar_queen':
            // Large boss caterpillar with crown
            ctx.fillStyle = '#ffdd00';
            // Segments (5 large circles)
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                const offset = (i - 2) * TILE_SIZE * 0.18;
                const radius = i === 2 ? TILE_SIZE * 0.25 : TILE_SIZE * 0.2; // Middle is larger
                ctx.arc(px + offset, py, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            // Borders
            ctx.strokeStyle = '#ccaa00';
            ctx.lineWidth = 3;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                const offset = (i - 2) * TILE_SIZE * 0.18;
                const radius = i === 2 ? TILE_SIZE * 0.25 : TILE_SIZE * 0.2;
                ctx.arc(px + offset, py, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
            // Crown on head
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.moveTo(px - TILE_SIZE * 0.45, py - TILE_SIZE * 0.2);
            ctx.lineTo(px - TILE_SIZE * 0.35, py - TILE_SIZE * 0.4);
            ctx.lineTo(px - TILE_SIZE * 0.4, py - TILE_SIZE * 0.2);
            ctx.lineTo(px - TILE_SIZE * 0.3, py - TILE_SIZE * 0.35);
            ctx.lineTo(px - TILE_SIZE * 0.35, py - TILE_SIZE * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#cc00cc';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Eyes
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(px - TILE_SIZE * 0.45, py - TILE_SIZE * 0.05, TILE_SIZE * 0.06, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'draco':
            // EPIC DRAGON BOSS!!!
            const dragonTime = Date.now() / 100;

            // Dragon body (large, menacing)
            ctx.fillStyle = '#8B0000'; // Dark red
            ctx.beginPath();
            ctx.ellipse(px, py, TILE_SIZE * 0.6, TILE_SIZE * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#5a0000';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Wings (flapping animation)
            const wingFlap = Math.sin(dragonTime) * 0.15;
            ctx.fillStyle = '#a01010';

            // Left wing
            ctx.beginPath();
            ctx.moveTo(px - TILE_SIZE * 0.3, py);
            ctx.lineTo(px - TILE_SIZE * 0.7, py - TILE_SIZE * 0.4 + wingFlap);
            ctx.lineTo(px - TILE_SIZE * 0.5, py + TILE_SIZE * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#5a0000';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Right wing
            ctx.beginPath();
            ctx.moveTo(px + TILE_SIZE * 0.3, py);
            ctx.lineTo(px + TILE_SIZE * 0.7, py - TILE_SIZE * 0.4 + wingFlap);
            ctx.lineTo(px + TILE_SIZE * 0.5, py + TILE_SIZE * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Dragon head (fearsome)
            ctx.fillStyle = '#8B0000';
            ctx.beginPath();
            ctx.ellipse(px, py - TILE_SIZE * 0.15, TILE_SIZE * 0.35, TILE_SIZE * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#5a0000';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Horns
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.moveTo(px - TILE_SIZE * 0.25, py - TILE_SIZE * 0.35);
            ctx.lineTo(px - TILE_SIZE * 0.3, py - TILE_SIZE * 0.55);
            ctx.lineTo(px - TILE_SIZE * 0.2, py - TILE_SIZE * 0.4);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(px + TILE_SIZE * 0.25, py - TILE_SIZE * 0.35);
            ctx.lineTo(px + TILE_SIZE * 0.3, py - TILE_SIZE * 0.55);
            ctx.lineTo(px + TILE_SIZE * 0.2, py - TILE_SIZE * 0.4);
            ctx.fill();

            // Eyes (glowing)
            ctx.fillStyle = '#ffff00';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ffaa00';
            ctx.fillRect(px - TILE_SIZE * 0.15, py - TILE_SIZE * 0.2, 5, 5);
            ctx.fillRect(px + TILE_SIZE * 0.1, py - TILE_SIZE * 0.2, 5, 5);
            ctx.shadowBlur = 0;

            // Fire breath effect (random)
            if (Math.random() > 0.7) {
                ctx.fillStyle = '#ff660060';
                ctx.beginPath();
                ctx.arc(px + TILE_SIZE * 0.4, py - TILE_SIZE * 0.1, 6, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        default:
            // Default enemy (square)
            ctx.fillStyle = '#ff0000';
            const size = TILE_SIZE * 0.5;
            ctx.fillRect(px - size / 2, py - size / 2, size, size);
            ctx.strokeStyle = '#aa0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(px - size / 2, py - size / 2, size, size);
    }

    // Draw health bar above enemy
    if (enemy.health < enemy.maxHealth) {
        const barWidth = TILE_SIZE * 0.8;
        const barHeight = 4;
        const barX = px - barWidth / 2;
        const barY = py - TILE_SIZE * 0.5 - 8;

        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health
        const healthPercent = enemy.health / enemy.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#44ff44' : healthPercent > 0.25 ? '#ffaa44' : '#ff4444';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }

    ctx.restore();
}

// Render snake
function renderSnake(ctx: CanvasRenderingContext2D, snake: any[], invincible: boolean) {
    snake.forEach((segment, index) => {
        // Center in grid cell
        const px = segment.x * TILE_SIZE + TILE_SIZE / 2; // Center X
        const py = segment.y * TILE_SIZE + TILE_SIZE / 2; // Center Y

        const isHead = index === 0;
        const alpha = invincible ? 0.6 + Math.sin(Date.now() / 100) * 0.4 : 1.0;

        ctx.save();
        ctx.globalAlpha = alpha;

        const size = TILE_SIZE * 0.7;

        if (isHead) {
            // Head - brighter green with glow
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(
                px - size / 2,
                py - size / 2,
                size,
                size
            );

            // Stronger border for head
            ctx.strokeStyle = '#00ffaa';
            ctx.lineWidth = 3;
            ctx.strokeRect(
                px - size / 2,
                py - size / 2,
                size,
                size
            );
        } else {
            // Body - darker green
            ctx.fillStyle = '#00aa66';
            ctx.fillRect(
                px - size / 2,
                py - size / 2,
                size,
                size
            );

            // Thinner border for body
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                px - size / 2,
                py - size / 2,
                size,
                size
            );
        }

        ctx.restore();
    });
}

// Render exit
function renderExit(ctx: CanvasRenderingContext2D, exit: any) {
    // Center in grid cell
    const px = exit.x * TILE_SIZE + TILE_SIZE / 2;
    const py = exit.y * TILE_SIZE + TILE_SIZE / 2;

    // Pulsing glow
    const pulse = 0.5 + Math.sin(Date.now() / 300) * 0.5;
    const gradient = ctx.createRadialGradient(
        px, py, 0,
        px, py, TILE_SIZE
    );
    gradient.addColorStop(0, `rgba(255, 215, 0, ${pulse})`);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.fillRect(px - TILE_SIZE, py - TILE_SIZE, TILE_SIZE * 2, TILE_SIZE * 2);

    // Portal emoji
    ctx.font = `${TILE_SIZE * 1.2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚪', px, py);
}
