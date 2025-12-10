// Combat System - Handles damage, collisions, and combat logic

import { PlayerState } from '../types/gameState';
import { Enemy, Position } from '../types/entities';

export class CombatSystem {
    // Calculate damage from attacker to defender
    static calculateDamage(
        attackerDamage: number,
        defenderDefense: number = 0,
        critChance: number = 0
    ): { damage: number; isCrit: boolean } {
        let damage = Math.max(1, attackerDamage - defenderDefense);
        let isCrit = false;

        // Critical hit chance
        if (Math.random() < critChance) {
            damage *= 2;
            isCrit = true;
        }

        return { damage, isCrit };
    }

    // Handle player taking damage
    static playerTakeDamage(player: PlayerState, damage: number): boolean {
        // Check if player is invincible
        if (player.invincible) {
            return false; // No damage taken
        }

        // Check if player has shield
        if (player.hasShield) {
            player.hasShield = false;
            return false; // Shield blocked the damage
        }

        // Take damage
        player.health -= damage;

        // Check if player died
        if (player.health <= 0) {
            player.health = 0;
            return true; // Player died
        }

        return false; // Player survived
    }

    // Handle enemy taking damage
    static enemyTakeDamage(enemy: Enemy, damage: number): boolean {
        enemy.health -= damage;

        // Check if enemy died
        if (enemy.health <= 0) {
            enemy.health = 0;
            enemy.state = 'dead';
            return true; // Enemy died
        }

        return false; // Enemy survived
    }

    // Check collision between two positions
    static checkCollision(pos1: Position, pos2: Position, threshold: number = 1): boolean {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < threshold;
    }

    // Check if snake collides with itself
    static checkSelfCollision(snake: Position[]): boolean {
        if (snake.length < 4) return false; // Can't collide with itself if too short

        const head = snake[0];

        // Check collision with body (skip first 3 segments to avoid false positives)
        for (let i = 3; i < snake.length; i++) {
            if (this.checkCollision(head, snake[i], 0.5)) {
                return true;
            }
        }

        return false;
    }

    // Get XP reward for killing an enemy
    static getEnemyXPReward(enemyType: string, playerLevel: number): number {
        const baseXP: Record<string, number> = {
            caterpillar: 5,
            scorpion: 10,
            spider: 15,
            lizard: 12,
            djinn: 25,
            golem: 30,
            elemental: 20,
        };

        const xp = baseXP[enemyType] || 10;

        // Scale XP based on player level (enemies give less XP as you level up)
        const levelScaling = Math.max(0.5, 1 - (playerLevel * 0.05));

        return Math.floor(xp * levelScaling);
    }

    // Get gold reward for killing an enemy
    static getEnemyGoldReward(enemyType: string): number {
        const baseGold: Record<string, number> = {
            caterpillar: 2,
            scorpion: 5,
            spider: 7,
            lizard: 6,
            djinn: 15,
            golem: 20,
            elemental: 10,
        };

        return baseGold[enemyType] || 3;
    }
}
