import { allLevels } from './data/levels';

console.log('🔍 Checking for problematic spawns...\n');

let hasIssues = false;

allLevels.forEach(level => {
    // Check enemy spawns
    level.map.enemySpawns.forEach((spawn, index) => {
        const tile = level.map.tiles[spawn.position.y][spawn.position.x];
        if (!tile.walkable) {
            console.error(`❌ Level ${level.id} (${level.name}): Enemy #${index} (${spawn.enemyType}) at (${spawn.position.x}, ${spawn.position.y}) is on unwalkable tile: ${tile.type}`);
            hasIssues = true;
        }
    });

    // Check food spawns
    level.map.foodSpawns.forEach((spawn, index) => {
        const tile = level.map.tiles[spawn.position.y][spawn.position.x];
        if (!tile.walkable) {
            console.error(`❌ Level ${level.id} (${level.name}): Food #${index} (${spawn.foodType}) at (${spawn.position.x}, ${spawn.position.y}) is on unwalkable tile: ${tile.type}`);
            hasIssues = true;
        }
    });

    // Check overlaps
    const enemyPos = level.map.enemySpawns.map(e => `${e.position.x},${e.position.y}`);
    const foodPos = level.map.foodSpawns.map(f => `${f.position.x},${f.position.y}`);
    const overlaps = enemyPos.filter(pos => foodPos.includes(pos));

    overlaps.forEach(pos => {
        console.error(`❌ Level ${level.id} (${level.name}): Food and Enemy overlap at position ${pos}`);
        hasIssues = true;
    });
});

if (!hasIssues) {
    console.log('✅ All spawns are valid!');
} else {
    console.log('\n🔧 Please fix the issues above.');
}
