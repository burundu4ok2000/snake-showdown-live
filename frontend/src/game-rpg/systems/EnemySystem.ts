// Enemy System - Handles enemy AI and behavior

import { Enemy, Position, Direction, EnemyType } from '../types/entities';
import { LevelMap } from '../types/level';

export class EnemySystem {
    private static ENEMY_STATS: Record<EnemyType, {
        health: number;
        damage: number;
        speed: number;
        xp: number;
    }> = {
            caterpillar: { health: 1, damage: 1, speed: 1.5, xp: 5 },
            scorpion: { health: 2, damage: 1, speed: 2.5, xp: 10 },
            spider: { health: 3, damage: 1, speed: 2.0, xp: 15 },
            lizard: { health: 2, damage: 1, speed: 3.0, xp: 12 },
            djinn: { health: 5, damage: 2, speed: 2.0, xp: 25 },
            golem: { health: 10, damage: 2, speed: 1.0, xp: 30 },
            elemental: { health: 5, damage: 2, speed: 2.5, xp: 20 },
            snake: { health: 2, damage: 1, speed: 3.5, xp: 8 },
            bat: { health: 1, damage: 1, speed: 3.0, xp: 6 },
            caterpillar_queen: { health: 15, damage: 2, speed: 1.0, xp: 100 }, // Mini-boss
            draco: { health: 25, damage: 3, speed: 1.5, xp: 500 }, // FINAL BOSS
        };


    // Create a new enemy
    static createEnemy(type: EnemyType, position: Position, ai: Enemy['ai']): Enemy {
        const stats = this.ENEMY_STATS[type];

        return {
            id: `enemy_${Date.now()}_${Math.random()}`,
            type,
            position: { ...position },
            health: stats.health,
            maxHealth: stats.health,
            damage: stats.damage,
            speed: stats.speed,
            ai,
            state: 'idle',
            attackCooldown: 1.0, // 1 second cooldown
            lastAttackTime: 0,
            direction: 'right',
            animation: 'idle',
        };
    }

    // Update enemy AI and movement
    static updateEnemy(enemy: Enemy, playerHead: Position, map: LevelMap, deltaTime: number): void {
        if (enemy.state === 'dead') return;

        switch (enemy.ai) {
            case 'random_walk':
                this.randomWalkAI(enemy, map, deltaTime);
                break;
            case 'follow_player':
                this.followPlayerAI(enemy, playerHead, map, deltaTime);
                break;
            case 'ranged_attack':
                this.rangedAttackAI(enemy, playerHead, map, deltaTime);
                break;
            case 'patrol_path':
                this.patrolPathAI(enemy, deltaTime);
                break;
            default:
                this.randomWalkAI(enemy, map, deltaTime);
        }
    }

    // Random walk AI - moves randomly
    private static randomWalkAI(enemy: Enemy, map: LevelMap, deltaTime: number): void {
        // Change direction randomly every 1-3 seconds
        if (Math.random() < 0.01) {
            const directions: Direction[] = ['up', 'down', 'left', 'right'];
            enemy.direction = directions[Math.floor(Math.random() * directions.length)];
        }

        this.moveEnemy(enemy, enemy.direction, map, deltaTime);
    }

    // Follow player AI - chases the player
    private static followPlayerAI(enemy: Enemy, playerHead: Position, map: LevelMap, deltaTime: number): void {
        const dx = playerHead.x - enemy.position.x;
        const dy = playerHead.y - enemy.position.y;

        // Simple pursuit - move towards player
        if (Math.abs(dx) > Math.abs(dy)) {
            enemy.direction = dx > 0 ? 'right' : 'left';
        } else {
            enemy.direction = dy > 0 ? 'down' : 'up';
        }

        this.moveEnemy(enemy, enemy.direction, map, deltaTime);
        enemy.state = 'chase';
    }

    // Ranged attack AI - keeps distance and shoots
    private static rangedAttackAI(enemy: Enemy, playerHead: Position, map: LevelMap, deltaTime: number): void {
        const dx = playerHead.x - enemy.position.x;
        const dy = playerHead.y - enemy.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Keep optimal distance (5-10 units)
        if (distance < 5) {
            // Too close, back away
            enemy.direction = dx > 0 ? 'left' : 'right';
            this.moveEnemy(enemy, enemy.direction, map, deltaTime);
        } else if (distance > 10) {
            // Too far, get closer
            if (Math.abs(dx) > Math.abs(dy)) {
                enemy.direction = dx > 0 ? 'right' : 'left';
            } else {
                enemy.direction = dy > 0 ? 'down' : 'up';
            }
            this.moveEnemy(enemy, enemy.direction, map, deltaTime);
        }

        enemy.state = 'attack';
    }

    // Patrol path AI - follows predefined path
    private static patrolPathAI(enemy: Enemy, deltaTime: number): void {
        if (!enemy.patrolPath || enemy.patrolPath.length === 0) {
            enemy.ai = 'random_walk';
            return;
        }

        const currentIndex = enemy.currentPathIndex || 0;
        const target = enemy.patrolPath[currentIndex];

        // Move towards current patrol point
        const dx = target.x - enemy.position.x;
        const dy = target.y - enemy.position.y;

        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
            // Reached patrol point, move to next
            enemy.currentPathIndex = (currentIndex + 1) % enemy.patrolPath.length;
        } else {
            // Move towards patrol point
            const angle = Math.atan2(dy, dx);
            enemy.position.x += Math.cos(angle) * enemy.speed * deltaTime;
            enemy.position.y += Math.sin(angle) * enemy.speed * deltaTime;
        }

        enemy.state = 'patrol';
    }

    // Move enemy in a direction
    private static moveEnemy(enemy: Enemy, direction: Direction, map: LevelMap, deltaTime: number): void {
        const speed = enemy.speed * deltaTime;
        const newPos = { ...enemy.position };

        switch (direction) {
            case 'up':
                newPos.y -= speed;
                break;
            case 'down':
                newPos.y += speed;
                break;
            case 'left':
                newPos.x -= speed;
                break;
            case 'right':
                newPos.x += speed;
                break;
        }

        // Check if new position is valid
        if (this.isValidPosition(newPos, map)) {
            enemy.position = newPos;
            enemy.animation = 'walk';
        } else {
            enemy.animation = 'idle';
        }
    }

    // Check if position is valid (within bounds and walkable)
    private static isValidPosition(pos: Position, map: LevelMap): boolean {
        const tileX = Math.floor(pos.x);
        const tileY = Math.floor(pos.y);

        if (tileX < 0 || tileY < 0 || tileX >= map.width || tileY >= map.height) {
            return false;
        }

        const tile = map.tiles[tileY]?.[tileX];
        return tile?.walkable ?? false;
    }

    // Check if enemy can attack (cooldown expired)
    static canAttack(enemy: Enemy, currentTime: number): boolean {
        return currentTime - enemy.lastAttackTime >= enemy.attackCooldown * 1000;
    }

    // Mark enemy as having attacked
    static markAttacked(enemy: Enemy, currentTime: number): void {
        enemy.lastAttackTime = currentTime;
    }
}
