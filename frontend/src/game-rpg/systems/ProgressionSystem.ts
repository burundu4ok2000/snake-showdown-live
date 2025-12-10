// Progression System - Handles XP, leveling, and rewards

import { PlayerState } from '../types/gameState';

export class ProgressionSystem {
    // XP table for different actions
    private static XP_VALUES = {
        eat_apple: 5,
        eat_gem: 25,
        eat_meat: 10,
        eat_lightning: 15,
        eat_star: 50,
        kill_enemy: 10,
        kill_boss: 100,
        complete_level: 100,
        complete_quest: 50,
        find_star: 30,
    };

    // Calculate XP required for a given level
    // Formula: XP = 100 * (1.5 ^ (level - 1))
    static xpForLevel(level: number): number {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }

    // Get XP reward for an action
    static getXP(action: keyof typeof ProgressionSystem.XP_VALUES): number {
        return this.XP_VALUES[action] || 0;
    }

    // Add XP to player and handle level ups
    static addXP(player: PlayerState, amount: number): { leveledUp: boolean; newLevel: number } {
        player.xp += amount;
        let leveledUp = false;
        let levelsGained = 0;

        // Handle multiple level ups
        while (player.xp >= player.xpToNext) {
            player.xp -= player.xpToNext;
            player.level++;
            levelsGained++;
            leveledUp = true;

            // Calculate next level requirements
            player.xpToNext = this.xpForLevel(player.level + 1);

            // Level up rewards
            this.applyLevelUpRewards(player);
        }

        return { leveledUp, newLevel: player.level };
    }

    // Apply rewards when leveling up
    private static applyLevelUpRewards(player: PlayerState): void {
        // Restore full health
        player.health = player.maxHealth;

        // Every 5 levels, increase max health
        if (player.level % 5 === 0) {
            player.maxHealth++;
            player.health = player.maxHealth;
        }

        // Gold reward (50 + 10 per level)
        player.gold += 50 + (player.level * 10);

        // Score bonus
        player.score += player.level * 100;
    }

    // Add gold
    static addGold(player: PlayerState, amount: number): void {
        player.gold += amount;
    }

    // Add star
    static addStar(player: PlayerState): void {
        player.stars++;
    }

    // Check if player can afford upgrade
    static canAffordUpgrade(player: PlayerState, cost: number): boolean {
        return player.gold >= cost;
    }

    // Purchase upgrade
    static purchaseUpgrade(player: PlayerState, cost: number): boolean {
        if (this.canAffordUpgrade(player, cost)) {
            player.gold -= cost;
            return true;
        }
        return false;
    }
}
