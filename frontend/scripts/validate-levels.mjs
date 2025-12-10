#!/usr/bin/env node

/**
 * Level Validation Script
 * Checks all levels for common issues and reports problems
 */

import { allLevels } from '../src/game-rpg/data/levels';
import { LevelData } from '../src/game-rpg/types/level';

let hasErrors = false;
const issues: string[] = [];

function reportIssue(level: LevelData, message: string) {
    const issue = `❌ Level ${level.id} (${level.name}): ${message}`;
    issues.push(issue);
    console.error(issue);
    hasErrors = true;
}

function reportWarning(level: LevelData, message: string) {
    const warning = `⚠️  Level ${level.id} (${level.name}): ${message}`;
    issues.push(warning);
    console.warn(warning);
}

function checkLevel(level: LevelData) {
    const { map } = level;

    // Check spawn point
    const spawnTile = map.tiles[map.spawnPoint.y]?.[map.spawnPoint.x];
    if (!spawnTile) {
        reportIssue(level, `Spawn point (${map.spawnPoint.x}, ${map.spawnPoint.y}) is out of bounds`);
    } else if (!spawnTile.walkable) {
        reportIssue(level, `Spawn point is on unwalkable tile: ${spawnTile.type}`);
    } else if (spawnTile.type === 'lava') {
        reportIssue(level, `Spawn point is on lava!`);
    }

    // Check exit point
    const exitTile = map.tiles[map.exitPoint.y]?.[map.exitPoint.x];
    if (!exitTile) {
        reportIssue(level, `Exit point (${map.exitPoint.x}, ${map.exitPoint.y}) is out of bounds`);
    } else if (!exitTile.walkable) {
        reportIssue(level, `Exit point is on unwalkable tile: ${exitTile.type}`);
    } else if (exitTile.type === 'lava') {
        reportIssue(level, `Exit point is on lava!`);
    }

    // Check enemy spawns
    map.enemySpawns.forEach((spawn, index) => {
        const { position } = spawn;
        if (position.x < 0 || position.x >= map.width || position.y < 0 || position.y >= map.height) {
            reportIssue(level, `Enemy ${index} (${spawn.enemyType}) spawns out of bounds at (${position.x}, ${position.y})`);
            return;
        }

        const tile = map.tiles[position.y][position.x];
        if (!tile.walkable) {
            reportIssue(level, `Enemy ${index} (${spawn.enemyType}) spawns on unwalkable tile: ${tile.type} at (${position.x}, ${position.y})`);
        }
    });

    // Check food spawns
    map.foodSpawns.forEach((spawn, index) => {
        const { position } = spawn;
        if (position.x < 0 || position.x >= map.width || position.y < 0 || position.y >= map.height) {
            reportIssue(level, `Food ${index} (${spawn.foodType}) spawns out of bounds at (${position.x}, ${position.y})`);
            return;
        }

        const tile = map.tiles[position.y][position.x];
        if (!tile.walkable) {
            reportIssue(level, `Food ${index} (${spawn.foodType}) spawns on unwalkable tile: ${tile.type} at (${position.x}, ${position.y})`);
        }
    });

    // Check for overlapping spawns
    const allPositions = new Map < string, string[]> ();

    allPositions.set(`${map.spawnPoint.x},${map.spawnPoint.y}`, ['Player Spawn']);
    allPositions.set(`${map.exitPoint.x},${map.exitPoint.y}`, ['Exit']);

    map.enemySpawns.forEach(spawn => {
        const key = `${spawn.position.x},${spawn.position.y}`;
        const existing = allPositions.get(key) || [];
        existing.push(`Enemy (${spawn.enemyType})`);
        allPositions.set(key, existing);
    });

    map.foodSpawns.forEach(spawn => {
        const key = `${spawn.position.x},${spawn.position.y}`;
        const existing = allPositions.get(key) || [];
        existing.push(`Food (${spawn.foodType})`);
        allPositions.set(key, existing);
    });

    allPositions.forEach((items, pos) => {
        if (items.length > 1) {
            reportIssue(level, `Multiple entities at same position ${pos}: ${items.join(', ')}`);
        }
    });

    // Check lava mechanics for volcano levels
    if (level.worldId === 4) {
        let hasLava = false;
        map.tiles.forEach(row => {
            row.forEach(tile => {
                if (tile.type === 'lava') {
                    hasLava = true;
                    if (!tile.walkable) {
                        reportWarning(level, `Lava tile should be walkable (deals damage but passable)`);
                        return; // Only report once
                    }
                }
            });
        });

        if (!hasLava) {
            reportWarning(level, `Volcano world level should have lava tiles`);
        }
    }

    console.log(`✓ Level ${level.id} (${level.name}) checked`);
}

console.log('🔍 Validating all levels...\n');

allLevels.forEach(checkLevel);

console.log(`\n📊 Validation complete!`);
console.log(`   Total levels: ${allLevels.length}`);
console.log(`   Total issues: ${issues.length}`);

if (hasErrors) {
    console.error('\n❌ Validation failed. Please fix the issues above.');
    process.exit(1);
} else {
    console.log('\n✅ All levels passed validation!');
    process.exit(0);
}
