// Level 1 - Tutorial Forest
// First level of the RPG mode

import { LevelData, Tile, TileType } from '../types/level';

// Create a simple tile
function tile(type: TileType, walkable: boolean = true): Tile {
    return {
        type,
        walkable,
        damage: type === 'lava' ? 1 : 0,
        friction: type === 'ice' ? 0.5 : type === 'sand' ? 1.2 : 1.0,
    };
}

// Level 1: Tutorial Forest
// A simple 30x20 level with some obstacles
export const LEVEL_1: LevelData = {
    id: 1,
    worldId: 1,
    name: 'Tutorial Forest',
    description: 'Learn the basics of Snake Quest. Defeat a few enemies and reach the exit!',
    musicTrack: 'forest',
    nextLevel: 2,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 5, y: 10 }, // Moved right to avoid wall collision
        exitPoint: { x: 26, y: 10 }, // Tile index

        // Create the tile map
        tiles: createLevel1Map(),

        // Enemy spawns
        enemySpawns: [
            {
                enemyType: 'caterpillar',
                position: { x: 12, y: 6 },
                spawnDelay: 0,
            },
            {
                enemyType: 'caterpillar',
                position: { x: 15, y: 15 },
                spawnDelay: 2,
            },
            {
                enemyType: 'scorpion',
                position: { x: 20, y: 10 },
                spawnDelay: 5,
            },
        ],

        // Food spawns (verified against wall positions)
        // Walls: border (x=0,29 y=0,19), vertical wall x=10 y=5-14 (gap at 10), 
        //        horizontal walls y=7,13 x=15-24 (gap at 20), cluster at (5,5),(6,5),(5,6)
        foodSpawns: [
            { foodType: 'apple', position: { x: 7, y: 10 } },  // Safe left corridor
            { foodType: 'apple', position: { x: 12, y: 4 } },  // Safe upper middle
            { foodType: 'apple', position: { x: 12, y: 15 } }, // Safe lower middle
            { foodType: 'gem', position: { x: 15, y: 10 } },   // Safe middle gap
            { foodType: 'meat', position: { x: 21, y: 4 } },   // Safe right upper (away from walls)
            { foodType: 'star', position: { x: 25, y: 16 } },  // Secret star safe corner
        ],

        secretRooms: [],
    },

    objectives: [
        {
            id: 'kill_enemies',
            type: 'kill_all',
            description: 'Defeat all enemies (3)',
            required: 3,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the hidden star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

// Create the tile map for Level 1
function createLevel1Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    // Initialize with floor tiles
    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Add walls around the border
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Add some obstacles in the middle
    // Vertical wall
    for (let y = 5; y < 15; y++) {
        if (y !== 10) { // Leave a gap
            map[y][10] = tile('wall', false);
        }
    }

    // Horizontal wall
    for (let x = 15; x < 25; x++) {
        if (x !== 20) { // Leave a gap
            map[7][x] = tile('wall', false);
            map[13][x] = tile('wall', false);
        }
    }

    // Small obstacle cluster
    map[5][5] = tile('wall', false);
    map[5][6] = tile('wall', false);
    map[6][5] = tile('wall', false);

    return map;
}

// Level 2: Deeper Woods
// Introduces snakes and more complex layouts
export const LEVEL_2: LevelData = {
    id: 2,
    worldId: 1,
    name: 'Deeper Woods',
    description: 'The forest grows darker. Beware of swift snakes!',
    musicTrack: 'forest',
    nextLevel: 3,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 3, y: 3 },
        exitPoint: { x: 26, y: 16 },
        tiles: createLevel2Map(),
        enemySpawns: [
            {
                enemyType: 'snake',
                position: { x: 10, y: 10 },
                spawnDelay: 0,
            },
            {
                enemyType: 'caterpillar',
                position: { x: 15, y: 5 },
                spawnDelay: 1,
            },
            {
                enemyType: 'snake',
                position: { x: 20, y: 15 },
                spawnDelay: 2,
            },
            {
                enemyType: 'scorpion',
                position: { x: 12, y: 12 },
                spawnDelay: 3,
            },
        ],
        foodSpawns: [
            { foodType: 'apple', position: { x: 7, y: 7 } },
            { foodType: 'apple', position: { x: 10, y: 15 } },
            { foodType: 'meat', position: { x: 15, y: 10 } },
            { foodType: 'gem', position: { x: 20, y: 5 } },
            { foodType: 'apple', position: { x: 25, y: 10 } },
            { foodType: 'star', position: { x: 8, y: 18 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'kill_snakes',
            type: 'kill_all',
            description: 'Defeat all snakes (2)',
            required: 2,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the hidden star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel2Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Maze-like corridors
    for (let y = 5; y < 15; y += 3) {
        for (let x = 5; x < 25; x++) {
            if (x !== 10 && x !== 15 && x !== 20) {
                map[y][x] = tile('wall', false);
            }
        }
    }

    return map;
}

// Level 3: Bat Cave
// Introduces flying enemies
export const LEVEL_3: LevelData = {
    id: 3,
    worldId: 1,
    name: 'Bat Cave',
    description: 'A dark cave filled with aggressive bats!',
    musicTrack: 'forest',
    nextLevel: 4,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 15, y: 18 },
        exitPoint: { x: 15, y: 2 },
        tiles: createLevel3Map(),
        enemySpawns: [
            {
                enemyType: 'bat',
                position: { x: 8, y: 10 },
                spawnDelay: 0,
            },
            {
                enemyType: 'bat',
                position: { x: 22, y: 10 },
                spawnDelay: 0.5,
            },
            {
                enemyType: 'bat',
                position: { x: 15, y: 8 },
                spawnDelay: 1,
            },
            {
                enemyType: 'scorpion',
                position: { x: 10, y: 15 },
                spawnDelay: 2,
            },
            {
                enemyType: 'scorpion',
                position: { x: 20, y: 15 },
                spawnDelay: 2.5,
            },
        ],
        foodSpawns: [
            { foodType: 'apple', position: { x: 5, y: 5 } },
            { foodType: 'apple', position: { x: 23, y: 10 } },
            { foodType: 'meat', position: { x: 15, y: 12 } },
            { foodType: 'gem', position: { x: 10, y: 5 } },
            { foodType: 'gem', position: { x: 20, y: 5 } },
            { foodType: 'star', position: { x: 3, y: 3 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'kill_bats',
            type: 'kill_all',
            description: 'Defeat all bats (3)',
            required: 3,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the hidden star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel3Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Create circular cave structure
    const centerX = 15;
    const centerY = 10;
    const radius = 8;

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Create wall ring
            if (distance > radius && distance < radius + 3) {
                if (Math.random() > 0.3) {
                    map[y][x] = tile('wall', false);
                }
            }
        }
    }

    return map;
}

// Level 4: Queen's Lair (Mini-Boss)
// First boss fight - Caterpillar Queen
export const LEVEL_4: LevelData = {
    id: 4,
    worldId: 1,
    name: "Queen's Lair",
    description: 'Face the Caterpillar Queen! Watch out for her minions!',
    musicTrack: 'forest',
    nextLevel: 5,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 15, y: 18 },
        exitPoint: { x: 15, y: 2 },
        tiles: createLevel4Map(),
        enemySpawns: [
            {
                enemyType: 'caterpillar_queen',
                position: { x: 15, y: 6 },
                spawnDelay: 0,
            },
            {
                enemyType: 'caterpillar',
                position: { x: 10, y: 10 },
                spawnDelay: 3,
            },
            {
                enemyType: 'caterpillar',
                position: { x: 20, y: 10 },
                spawnDelay: 3,
            },
            {
                enemyType: 'caterpillar',
                position: { x: 12, y: 14 },
                spawnDelay: 6,
            },
            {
                enemyType: 'caterpillar',
                position: { x: 18, y: 14 },
                spawnDelay: 6,
            },
        ],
        foodSpawns: [
            { foodType: 'meat', position: { x: 5, y: 15 } },
            { foodType: 'meat', position: { x: 25, y: 15 } },
            { foodType: 'gem', position: { x: 5, y: 5 } },
            { foodType: 'gem', position: { x: 25, y: 5 } },
            { foodType: 'apple', position: { x: 15, y: 15 } },
            { foodType: 'star', position: { x: 15, y: 10 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'kill_queen',
            type: 'kill_all',
            description: 'Defeat the Caterpillar Queen!',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Collect the Queen\'s star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel4Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Boss arena - open rectangular space with pillars
    const pillarPositions = [
        { x: 8, y: 8 },
        { x: 22, y: 8 },
        { x: 8, y: 12 },
        { x: 22, y: 12 },
    ];

    pillarPositions.forEach(pos => {
        map[pos.y][pos.x] = tile('wall', false);
        map[pos.y][pos.x + 1] = tile('wall', false);
        map[pos.y + 1][pos.x] = tile('wall', false);
        map[pos.y + 1][pos.x + 1] = tile('wall', false);
    });

    return map;
}

// ========================================
// WORLD 2: DESERT (Levels 5-8)
// ========================================

// Level 5: Desert Entrance
// Introduction to desert with sand tiles
export const LEVEL_5: LevelData = {
    id: 5,
    worldId: 2,
    name: 'Desert Entrance',
    description: 'The scorching desert awaits. Watch out for quick lizards!',
    musicTrack: 'desert',
    nextLevel: 6,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 2, y: 10 },
        exitPoint: { x: 27, y: 10 },
        tiles: createLevel5Map(),
        enemySpawns: [
            {
                enemyType: 'lizard',
                position: { x: 12, y: 9 },
                spawnDelay: 0,
            },
            {
                enemyType: 'scorpion',
                position: { x: 15, y: 12 },
                spawnDelay: 1,
            },
            {
                enemyType: 'lizard',
                position: { x: 20, y: 10 },
                spawnDelay: 2,
            },
            {
                enemyType: 'scorpion',
                position: { x: 12, y: 5 },
                spawnDelay: 3,
            },
            {
                enemyType: 'lizard',
                position: { x: 18, y: 15 },
                spawnDelay: 4,
            },
        ],
        foodSpawns: [
            { foodType: 'apple', position: { x: 8, y: 10 } },
            { foodType: 'meat', position: { x: 15, y: 8 } },
            { foodType: 'gem', position: { x: 22, y: 12 } },
            { foodType: 'apple', position: { x: 15, y: 15 } },
            { foodType: 'gem', position: { x: 10, y: 3 } },
            { foodType: 'star', position: { x: 27, y: 2 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'kill_lizards',
            type: 'kill_all',
            description: 'Defeat all lizards (3)',
            required: 3,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the desert star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel5Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            // Mix of sand and floor tiles
            map[y][x] = Math.random() > 0.3 ? tile('sand', true) : tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Sand dunes (impassable areas)
    for (let x = 8; x < 12; x++) {
        map[8][x] = tile('wall', false);
    }
    for (let x = 18; x < 22; x++) {
        map[12][x] = tile('wall', false);
    }

    return map;
}

// Level 6: Sandstorm
// More challenging with mixed enemies
export const LEVEL_6: LevelData = {
    id: 6,
    worldId: 2,
    name: 'Sandstorm',
    description: 'The wind howls with sand. Visibility is low!',
    musicTrack: 'desert',
    nextLevel: 7,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 15, y: 18 },
        exitPoint: { x: 15, y: 2 },
        tiles: createLevel6Map(),
        enemySpawns: [
            {
                enemyType: 'lizard',
                position: { x: 8, y: 12 },
                spawnDelay: 0,
            },
            {
                enemyType: 'lizard',
                position: { x: 22, y: 12 },
                spawnDelay: 0.5,
            },
            {
                enemyType: 'scorpion',
                position: { x: 15, y: 10 },
                spawnDelay: 1,
            },
            {
                enemyType: 'snake',
                position: { x: 10, y: 6 },
                spawnDelay: 2,
            },
            {
                enemyType: 'snake',
                position: { x: 20, y: 6 },
                spawnDelay: 2.5,
            },
            {
                enemyType: 'scorpion',
                position: { x: 15, y: 14 },
                spawnDelay: 3,
            },
        ],
        foodSpawns: [
            { foodType: 'apple', position: { x: 6, y: 10 } },
            { foodType: 'apple', position: { x: 24, y: 10 } },
            { foodType: 'meat', position: { x: 15, y: 15 } },
            { foodType: 'gem', position: { x: 8, y: 4 } },
            { foodType: 'gem', position: { x: 22, y: 4 } },
            { foodType: 'lightning', position: { x: 15, y: 8 } },
            { foodType: 'star', position: { x: 3, y: 10 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'survive',
            type: 'kill_all',
            description: 'Defeat all enemies (6)',
            required: 6,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the hidden star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel6Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('sand', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Scattered rocks
    const rocks = [
        { x: 5, y: 5 }, { x: 6, y: 5 },
        { x: 24, y: 5 }, { x: 25, y: 5 },
        { x: 5, y: 14 }, { x: 6, y: 14 },
        { x: 24, y: 14 }, { x: 25, y: 14 },
        { x: 12, y: 10 }, { x: 18, y: 10 },
    ];

    rocks.forEach(pos => {
        map[pos.y][pos.x] = tile('wall', false);
    });

    return map;
}

// Level 7: Oasis
// Desert oasis with varied terrain
export const LEVEL_7: LevelData = {
    id: 7,
    worldId: 2,
    name: 'Oasis',
    description: 'A rare oasis in the desert. But danger lurks in paradise!',
    musicTrack: 'desert',
    nextLevel: 8,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 3, y: 3 },
        exitPoint: { x: 26, y: 16 },
        tiles: createLevel7Map(),
        enemySpawns: [
            {
                enemyType: 'lizard',
                position: { x: 12, y: 8 },
                spawnDelay: 0,
            },
            {
                enemyType: 'lizard',
                position: { x: 18, y: 12 },
                spawnDelay: 0.5,
            },
            {
                enemyType: 'spider',
                position: { x: 15, y: 10 },
                spawnDelay: 1,
            },
            {
                enemyType: 'scorpion',
                position: { x: 8, y: 15 },
                spawnDelay: 2,
            },
            {
                enemyType: 'scorpion',
                position: { x: 22, y: 5 },
                spawnDelay: 2.5,
            },
            {
                enemyType: 'snake',
                position: { x: 15, y: 15 },
                spawnDelay: 3,
            },
        ],
        foodSpawns: [
            { foodType: 'apple', position: { x: 10, y: 10 } },
            { foodType: 'apple', position: { x: 20, y: 10 } },
            { foodType: 'meat', position: { x: 8, y: 8 } },
            { foodType: 'meat', position: { x: 22, y: 12 } },
            { foodType: 'gem', position: { x: 8, y: 12 } },
            { foodType: 'gem', position: { x: 22, y: 8 } },
            { foodType: 'gold', position: { x: 17, y: 10 } },
            { foodType: 'star', position: { x: 15, y: 5 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'kill_all',
            type: 'kill_all',
            description: 'Clear the oasis (6 enemies)',
            required: 6,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the oasis star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel7Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('sand', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Create oasis (floor tiles in center)
    const centerX = 15;
    const centerY = 10;
    const oasisRadius = 5;

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < oasisRadius) {
                map[y][x] = tile('floor', true);
            }
        }
    }

    // Palm trees (walls) around oasis
    const palms = [
        { x: 10, y: 6 }, { x: 20, y: 6 },
        { x: 10, y: 14 }, { x: 20, y: 14 },
    ];

    palms.forEach(pos => {
        map[pos.y][pos.x] = tile('wall', false);
    });

    return map;
}

// Level 8: Ancient Temple (Desert Boss)
// Boss fight with Djinn
export const LEVEL_8: LevelData = {
    id: 8,
    worldId: 2,
    name: 'Ancient Temple',
    description: 'Face the ancient Djinn guardian of the desert temple!',
    musicTrack: 'desert',
    nextLevel: 9,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 15, y: 18 },
        exitPoint: { x: 15, y: 2 },
        tiles: createLevel8Map(),
        enemySpawns: [
            {
                enemyType: 'djinn',
                position: { x: 15, y: 6 },
                spawnDelay: 0,
            },
            {
                enemyType: 'scorpion',
                position: { x: 8, y: 10 },
                spawnDelay: 5,
            },
            {
                enemyType: 'scorpion',
                position: { x: 22, y: 10 },
                spawnDelay: 5,
            },
            {
                enemyType: 'lizard',
                position: { x: 12, y: 12 },
                spawnDelay: 8,
            },
            {
                enemyType: 'lizard',
                position: { x: 18, y: 12 },
                spawnDelay: 8,
            },
        ],
        foodSpawns: [
            { foodType: 'meat', position: { x: 5, y: 15 } },
            { foodType: 'meat', position: { x: 25, y: 15 } },
            { foodType: 'gem', position: { x: 5, y: 5 } },
            { foodType: 'gem', position: { x: 25, y: 5 } },
            { foodType: 'lightning', position: { x: 15, y: 12 } },
            { foodType: 'apple', position: { x: 10, y: 15 } },
            { foodType: 'apple', position: { x: 20, y: 15 } },
            { foodType: 'star', position: { x: 15, y: 10 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'defeat_djinn',
            type: 'kill_all',
            description: 'Defeat the Ancient Djinn!',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Claim the temple star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Escape the temple',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel8Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Temple pillars (symmetrical)
    const pillars = [
        { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 7, y: 8 }, { x: 8, y: 8 },
        { x: 22, y: 7 }, { x: 23, y: 7 }, { x: 22, y: 8 }, { x: 23, y: 8 },
        { x: 7, y: 12 }, { x: 8, y: 12 }, { x: 7, y: 13 }, { x: 8, y: 13 },
        { x: 22, y: 12 }, { x: 23, y: 12 }, { x: 22, y: 13 }, { x: 23, y: 13 },
    ];

    pillars.forEach(pos => {
        map[pos.y][pos.x] = tile('wall', false);
    });

    // Some sand patches for variety
    for (let i = 0; i < 30; i++) {
        const x = Math.floor(Math.random() * (width - 2)) + 1;
        const y = Math.floor(Math.random() * (height - 2)) + 1;
        if (map[y][x].walkable) {
            map[y][x] = tile('sand', true);
        }
    }

    return map;
}

// ========================================
// WORLD 3: ICE CAVES (Levels 9-12)
// ========================================

// Level 9: Frozen Entrance
// Introduction to ice caves
export const LEVEL_9: LevelData = {
    id: 9,
    worldId: 3,
    name: 'Frozen Entrance',
    description: 'The icy caves are treacherous. Watch your step!',
    musicTrack: 'ice',
    nextLevel: 10,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 3, y: 10 },
        exitPoint: { x: 26, y: 10 },
        tiles: createLevel9Map(),
        enemySpawns: [
            {
                enemyType: 'elemental',
                position: { x: 12, y: 9 },
                spawnDelay: 0,
            },
            {
                enemyType: 'bat',
                position: { x: 15, y: 12 },
                spawnDelay: 1,
            },
            {
                enemyType: 'elemental',
                position: { x: 20, y: 10 },
                spawnDelay: 2,
            },
            {
                enemyType: 'bat',
                position: { x: 12, y: 5 },
                spawnDelay: 3,
            },
        ],
        foodSpawns: [
            { foodType: 'apple', position: { x: 8, y: 10 } },
            { foodType: 'meat', position: { x: 15, y: 8 } },
            { foodType: 'gem', position: { x: 22, y: 12 } },
            { foodType: 'apple', position: { x: 15, y: 15 } },
            { foodType: 'shield', position: { x: 10, y: 3 } },
            { foodType: 'star', position: { x: 27, y: 2 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'kill_elementals',
            type: 'kill_all',
            description: 'Defeat ice elementals (2)',
            required: 2,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the frozen star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel9Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            // Mix of ice and floor tiles
            map[y][x] = Math.random() > 0.4 ? tile('ice', true) : tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Ice formations
    for (let x = 8; x < 12; x++) {
        map[8][x] = tile('wall', false);
    }
    for (let x = 18; x < 22; x++) {
        map[12][x] = tile('wall', false);
    }

    return map;
}

// Level 10: Crystal Chambers
// Ice maze with crystals
export const LEVEL_10: LevelData = {
    id: 10,
    worldId: 3,
    name: 'Crystal Chambers',
    description: 'Navigate through chambers of frozen crystals!',
    musicTrack: 'ice',
    nextLevel: 11,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 15, y: 18 },
        exitPoint: { x: 15, y: 2 },
        tiles: createLevel10Map(),
        enemySpawns: [
            {
                enemyType: 'elemental',
                position: { x: 8, y: 12 },
                spawnDelay: 0,
            },
            {
                enemyType: 'elemental',
                position: { x: 22, y: 12 },
                spawnDelay: 0.5,
            },
            {
                enemyType: 'golem',
                position: { x: 15, y: 12 },
                spawnDelay: 1,
            },
            {
                enemyType: 'spider',
                position: { x: 10, y: 6 },
                spawnDelay: 2,
            },
            {
                enemyType: 'spider',
                position: { x: 20, y: 6 },
                spawnDelay: 2.5,
            },
        ],
        foodSpawns: [
            { foodType: 'apple', position: { x: 6, y: 10 } },
            { foodType: 'apple', position: { x: 24, y: 10 } },
            { foodType: 'meat', position: { x: 15, y: 15 } },
            { foodType: 'gem', position: { x: 8, y: 4 } },
            { foodType: 'gem', position: { x: 22, y: 4 } },
            { foodType: 'lightning', position: { x: 15, y: 8 } },
            { foodType: 'star', position: { x: 3, y: 10 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'survive',
            type: 'kill_all',
            description: 'Defeat all enemies (5)',
            required: 5,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the crystal star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel10Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('ice', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Crystal formations (walls in patterns)
    const crystals = [
        { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 6 },
        { x: 24, y: 5 }, { x: 25, y: 5 }, { x: 25, y: 6 },
        { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 5, y: 15 },
        { x: 24, y: 14 }, { x: 25, y: 14 }, { x: 25, y: 15 },
        { x: 15, y: 10 },
    ];

    crystals.forEach(pos => {
        map[pos.y][pos.x] = tile('wall', false);
    });

    return map;
}

// Level 11: Frozen Lake
// Large ice arena
export const LEVEL_11: LevelData = {
    id: 11,
    worldId: 3,
    name: 'Frozen Lake',
    description: 'A vast frozen lake. Danger lurks beneath the ice!',
    musicTrack: 'ice',
    nextLevel: 12,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 3, y: 3 },
        exitPoint: { x: 26, y: 16 },
        tiles: createLevel11Map(),
        enemySpawns: [
            {
                enemyType: 'elemental',
                position: { x: 12, y: 8 },
                spawnDelay: 0,
            },
            {
                enemyType: 'elemental',
                position: { x: 18, y: 12 },
                spawnDelay: 0.5,
            },
            {
                enemyType: 'golem',
                position: { x: 15, y: 10 },
                spawnDelay: 1,
            },
            {
                enemyType: 'bat',
                position: { x: 8, y: 15 },
                spawnDelay: 2,
            },
            {
                enemyType: 'bat',
                position: { x: 22, y: 5 },
                spawnDelay: 2.5,
            },
            {
                enemyType: 'snake',
                position: { x: 15, y: 15 },
                spawnDelay: 3,
            },
        ],
        foodSpawns: [
            { foodType: 'apple', position: { x: 10, y: 10 } },
            { foodType: 'apple', position: { x: 20, y: 10 } },
            { foodType: 'meat', position: { x: 15, y: 8 } },
            { foodType: 'meat', position: { x: 15, y: 12 } },
            { foodType: 'gem', position: { x: 8, y: 8 } },
            { foodType: 'gem', position: { x: 22, y: 12 } },
            { foodType: 'shield', position: { x: 17, y: 10 } },
            { foodType: 'star', position: { x: 15, y: 5 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'kill_all',
            type: 'kill_all',
            description: 'Clear the frozen lake (6 enemies)',
            required: 6,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the lake star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel11Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('ice', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Frozen islands (floor tiles)
    const centerX = 15;
    const centerY = 10;

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Small floor islands scattered
            if (distance < 3 || (Math.abs(dx) < 10 && Math.abs(dy) < 5 && Math.random() > 0.8)) {
                map[y][x] = tile('floor', true);
            }
        }
    }

    return map;
}

// Level 12: Frost Giant's Throne (Ice Boss)
// Boss fight with Frost Giant
export const LEVEL_12: LevelData = {
    id: 12,
    worldId: 3,
    name: "Frost Giant's Throne",
    description: 'Face the mighty Frost Giant, ruler of the ice caves!',
    musicTrack: 'ice',
    nextLevel: 13,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 15, y: 18 },
        exitPoint: { x: 15, y: 2 },
        tiles: createLevel12Map(),
        enemySpawns: [
            {
                enemyType: 'golem',
                position: { x: 15, y: 6 },
                spawnDelay: 0,
            },
            {
                enemyType: 'elemental',
                position: { x: 8, y: 10 },
                spawnDelay: 5,
            },
            {
                enemyType: 'elemental',
                position: { x: 22, y: 10 },
                spawnDelay: 5,
            },
            {
                enemyType: 'golem',
                position: { x: 12, y: 12 },
                spawnDelay: 8,
            },
            {
                enemyType: 'bat',
                position: { x: 18, y: 12 },
                spawnDelay: 8,
            },
        ],
        foodSpawns: [
            { foodType: 'meat', position: { x: 5, y: 15 } },
            { foodType: 'meat', position: { x: 25, y: 15 } },
            { foodType: 'gem', position: { x: 5, y: 5 } },
            { foodType: 'gem', position: { x: 25, y: 5 } },
            { foodType: 'lightning', position: { x: 15, y: 12 } },
            { foodType: 'shield', position: { x: 10, y: 15 } },
            { foodType: 'apple', position: { x: 20, y: 15 } },
            { foodType: 'star', position: { x: 15, y: 10 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'defeat_giant',
            type: 'kill_all',
            description: 'Defeat the Frost Giant!',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Claim the ice throne star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Escape the throne room',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel12Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('ice', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Throne room architecture - ice pillars
    const pillars = [
        { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 6, y: 7 }, { x: 7, y: 7 },
        { x: 23, y: 6 }, { x: 24, y: 6 }, { x: 23, y: 7 }, { x: 24, y: 7 },
        { x: 6, y: 13 }, { x: 7, y: 13 }, { x: 6, y: 14 }, { x: 7, y: 14 },
        { x: 23, y: 13 }, { x: 24, y: 13 }, { x: 23, y: 14 }, { x: 24, y: 14 },
    ];

    pillars.forEach(pos => {
        map[pos.y][pos.x] = tile('wall', false);
    });

    // Throne platform (floor area)
    for (let y = 4; y < 8; y++) {
        for (let x = 13; x < 18; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    return map;
}

// ========================================
// WORLD 4: VOLCANO (Levels 13-16)
// ========================================

// Level 13: Volcano Entrance
// Introduction to volcano with lava hazards
export const LEVEL_13: LevelData = {
    id: 13,
    worldId: 4,
    name: 'Volcano Entrance',
    description: 'The heat is intense. Avoid the lava!',
    musicTrack: 'volcano',
    nextLevel: 14,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 3, y: 10 },
        exitPoint: { x: 26, y: 10 },
        tiles: createLevel13Map(),
        enemySpawns: [
            {
                enemyType: 'elemental',
                position: { x: 10, y: 8 },
                spawnDelay: 0,
            },
            {
                enemyType: 'golem',
                position: { x: 15, y: 12 },
                spawnDelay: 1,
            },
            {
                enemyType: 'elemental',
                position: { x: 20, y: 10 },
                spawnDelay: 2,
            },
            {
                enemyType: 'scorpion',
                position: { x: 12, y: 5 },
                spawnDelay: 3,
            },
            {
                enemyType: 'lizard',
                position: { x: 18, y: 15 },
                spawnDelay: 4,
            },
        ],
        foodSpawns: [
            { foodType: 'apple', position: { x: 8, y: 10 } },
            { foodType: 'meat', position: { x: 15, y: 8 } },
            { foodType: 'gem', position: { x: 22, y: 12 } },
            { foodType: 'shield', position: { x: 15, y: 15 } },
            { foodType: 'lightning', position: { x: 10, y: 3 } },
            { foodType: 'star', position: { x: 27, y: 2 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'kill_fire_enemies',
            type: 'kill_all',
            description: 'Defeat fire enemies (5)',
            required: 5,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the volcano star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel13Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            // Mix of floor and lava tiles
            map[y][x] = Math.random() > 0.7 ? tile('lava', true) : tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Lava rivers (impassable)
    for (let y = 8; y < 13; y++) {
        if (y !== 10) {
            map[y][10] = tile('lava', true);
            map[y][20] = tile('lava', true);
        }
    }

    // Ensure spawn and exit points are safe floor tiles
    map[10][3] = tile('floor', true); // Spawn point area
    map[10][26] = tile('floor', true); // Exit point area
    // Clear area around spawn
    map[10][2] = tile('floor', true);
    map[10][4] = tile('floor', true);
    map[9][3] = tile('floor', true);
    map[11][3] = tile('floor', true);
    // Clear area around exit
    map[10][25] = tile('floor', true);
    map[10][27] = tile('floor', true);
    map[9][26] = tile('floor', true);
    map[11][26] = tile('floor', true);

    return map;
}

// Level 14: Magma Chambers
// Navigate through rooms of lava
export const LEVEL_14: LevelData = {
    id: 14,
    worldId: 4,
    name: 'Magma Chambers',
    description: 'Chambers filled with molten rock. Stay on solid ground!',
    musicTrack: 'volcano',
    nextLevel: 15,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 15, y: 18 },
        exitPoint: { x: 15, y: 2 },
        tiles: createLevel14Map(),
        enemySpawns: [
            {
                enemyType: 'golem',
                position: { x: 8, y: 12 },
                spawnDelay: 0,
            },
            {
                enemyType: 'golem',
                position: { x: 22, y: 12 },
                spawnDelay: 0.5,
            },
            {
                enemyType: 'elemental',
                position: { x: 15, y: 10 },
                spawnDelay: 1,
            },
            {
                enemyType: 'spider',
                position: { x: 10, y: 6 },
                spawnDelay: 2,
            },
            {
                enemyType: 'spider',
                position: { x: 20, y: 6 },
                spawnDelay: 2.5,
            },
            {
                enemyType: 'elemental',
                position: { x: 15, y: 14 },
                spawnDelay: 3,
            },
        ],
        foodSpawns: [
            { foodType: 'apple', position: { x: 6, y: 10 } },
            { foodType: 'apple', position: { x: 24, y: 10 } },
            { foodType: 'meat', position: { x: 15, y: 15 } },
            { foodType: 'gem', position: { x: 8, y: 4 } },
            { foodType: 'gem', position: { x: 22, y: 4 } },
            { foodType: 'lightning', position: { x: 15, y: 8 } },
            { foodType: 'shield', position: { x: 3, y: 10 } },
            { foodType: 'star', position: { x: 27, y: 10 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'survive',
            type: 'kill_all',
            description: 'Defeat all enemies (6)',
            required: 6,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the magma star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel14Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    // Start with floor
    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Lava pools scattered
    const lavaPools = [
        { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 6 }, { x: 6, y: 6 },
        { x: 24, y: 5 }, { x: 25, y: 5 }, { x: 24, y: 6 }, { x: 25, y: 6 },
        { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 5, y: 15 }, { x: 6, y: 15 },
        { x: 24, y: 14 }, { x: 25, y: 14 }, { x: 24, y: 15 }, { x: 25, y: 15 },
        { x: 14, y: 10 }, { x: 15, y: 10 }, { x: 16, y: 10 },
    ];

    lavaPools.forEach(pos => {
        map[pos.y][pos.x] = tile('lava', true);
    });

    return map;
}

// Level 15: Obsidian Halls
// Dangerous volcanic maze
export const LEVEL_15: LevelData = {
    id: 15,
    worldId: 4,
    name: 'Obsidian Halls',
    description: 'Ancient halls of volcanic glass. Tread carefully!',
    musicTrack: 'volcano',
    nextLevel: 16,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 3, y: 3 },
        exitPoint: { x: 26, y: 16 },
        tiles: createLevel15Map(),
        enemySpawns: [
            {
                enemyType: 'golem',
                position: { x: 12, y: 8 },
                spawnDelay: 0,
            },
            {
                enemyType: 'golem',
                position: { x: 18, y: 12 },
                spawnDelay: 0.5,
            },
            {
                enemyType: 'elemental',
                position: { x: 15, y: 10 },
                spawnDelay: 1,
            },
            {
                enemyType: 'elemental',
                position: { x: 10, y: 16 },
                spawnDelay: 3,
            },
            {
                enemyType: 'snake',
                position: { x: 20, y: 6 },
                spawnDelay: 4,
            },
            {
                enemyType: 'spider',
                position: { x: 15, y: 15 },
                spawnDelay: 3,
            },
            {
                enemyType: 'lizard',
                position: { x: 10, y: 5 },
                spawnDelay: 3.5,
            },
        ],
        foodSpawns: [
            { foodType: 'apple', position: { x: 10, y: 10 } },
            { foodType: 'apple', position: { x: 20, y: 10 } },
            { foodType: 'meat', position: { x: 15, y: 8 } },
            { foodType: 'meat', position: { x: 15, y: 12 } },
            { foodType: 'gem', position: { x: 8, y: 8 } },
            { foodType: 'gem', position: { x: 22, y: 12 } },
            { foodType: 'lightning', position: { x: 15, y: 5 } },
            { foodType: 'shield', position: { x: 5, y: 10 } },
            { foodType: 'star', position: { x: 25, y: 3 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'kill_all',
            type: 'kill_all',
            description: 'Clear the obsidian halls (7 enemies)',
            required: 7,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the obsidian star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Reach the exit',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel15Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Obsidian walls (maze-like)
    const obsidianWalls = [
        // Vertical walls
        { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 },
        { x: 22, y: 5 }, { x: 22, y: 6 }, { x: 22, y: 7 },
        { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 8, y: 15 },
        { x: 22, y: 13 }, { x: 22, y: 14 }, { x: 22, y: 15 },
        // Horizontal walls
        { x: 12, y: 10 }, { x: 13, y: 10 }, { x: 14, y: 10 },
        { x: 16, y: 10 }, { x: 17, y: 10 }, { x: 18, y: 10 },
    ];

    obsidianWalls.forEach(pos => {
        map[pos.y][pos.x] = tile('wall', false);
    });

    // Scattered lava
    for (let i = 0; i < 15; i++) {
        const x = Math.floor(Math.random() * (width - 2)) + 1;
        const y = Math.floor(Math.random() * (height - 2)) + 1;
        if (map[y][x].walkable) {
            map[y][x] = tile('lava', true);
        }
    }

    // Ensure spawn and exit points are safe floor tiles
    map[3][3] = tile('floor', true); // Spawn point
    map[16][26] = tile('floor', true); // Exit point
    // Clear area around spawn
    map[2][3] = tile('floor', true);
    map[4][3] = tile('floor', true);
    map[3][2] = tile('floor', true);
    map[3][4] = tile('floor', true);
    // Clear area around exit
    map[15][26] = tile('floor', true);
    map[17][26] = tile('floor', true);
    map[16][25] = tile('floor', true);
    map[16][27] = tile('floor', true);

    return map;
}

// Level 16: Inferno Core (Volcano Boss)
// Final volcano boss battle
export const LEVEL_16: LevelData = {
    id: 16,
    worldId: 4,
    name: 'Dragon\'s Caldera - FINAL BOSS',
    description: 'Face Draco, the ancient dragon of the volcano! This is the final battle!',
    musicTrack: 'volcano',
    nextLevel: 17,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 15, y: 18 },
        exitPoint: { x: 15, y: 2 },
        tiles: createLevel16Map(),
        enemySpawns: [
            {
                enemyType: 'draco', // FINAL BOSS!
                position: { x: 15, y: 6 },
                spawnDelay: 0,
            },
            {
                enemyType: 'golem',
                position: { x: 12, y: 8 },
                spawnDelay: 3,
            },
            {
                enemyType: 'golem',
                position: { x: 18, y: 8 },
                spawnDelay: 3,
            },
            {
                enemyType: 'elemental',
                position: { x: 8, y: 10 },
                spawnDelay: 6,
            },
            {
                enemyType: 'elemental',
                position: { x: 22, y: 10 },
                spawnDelay: 6,
            },
        ],
        foodSpawns: [
            // Lots of healing        foodSpawns: [
            { foodType: 'meat', position: { x: 7, y: 16 } },
            { foodType: 'meat', position: { x: 23, y: 16 } },
            { foodType: 'lightning', position: { x: 10, y: 15 } },
            { foodType: 'lightning', position: { x: 20, y: 15 } },
            { foodType: 'shield', position: { x: 8, y: 12 } },
            { foodType: 'shield', position: { x: 22, y: 12 } },
            { foodType: 'apple', position: { x: 15, y: 15 } },
            { foodType: 'star', position: { x: 15, y: 10 } },
            { foodType: 'gem', position: { x: 10, y: 6 } },
            { foodType: 'gem', position: { x: 20, y: 6 } },
            { foodType: 'star', position: { x: 15, y: 10 } }, // FINAL STAR - THE EMERALD APPLE!
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'defeat_draco',
            type: 'defeat_boss',
            description: 'Defeat Draco, the Dragon Boss!',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Claim the dragon\'s star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Escape the caldera',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel16Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Arena pillars
    const pillars = [
        { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 6, y: 7 }, { x: 7, y: 7 },
        { x: 23, y: 6 }, { x: 24, y: 6 }, { x: 23, y: 7 }, { x: 24, y: 7 },
        { x: 6, y: 13 }, { x: 7, y: 13 }, { x: 6, y: 14 }, { x: 7, y: 14 },
        { x: 23, y: 13 }, { x: 24, y: 13 }, { x: 23, y: 14 }, { x: 24, y: 14 },
    ];

    pillars.forEach(pos => {
        map[pos.y][pos.x] = tile('wall', false);
    });

    // Lava ring around center
    for (let x = 11; x <= 19; x++) {
        if (x === 11 || x === 19) {
            for (let y = 8; y <= 12; y++) {
                map[y][x] = tile('lava', true);
            }
        } else {
            map[8][x] = tile('lava', true);
            map[12][x] = tile('lava', true);
        }
    }

    // Core platform (floor in center)
    // Core platform (floor in center)
    for (let y = 9; y <= 11; y++) {
        for (let x = 13; x <= 17; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Ensure spawn and exit points are safe floor tiles (boss arena)
    map[18][15] = tile('floor', true); // Spawn point
    map[2][15] = tile('floor', true); // Exit point
    // Clear area around spawn
    map[17][15] = tile('floor', true);
    map[18][14] = tile('floor', true);
    map[18][16] = tile('floor', true);
    // Clear area around exit
    map[3][15] = tile('floor', true);
    map[2][14] = tile('floor', true);
    map[2][16] = tile('floor', true);

    return map;
}

// ========================================
// WORLD 5: DRAGON'S CASTLE (Levels 17-20)
// THE FINAL SHOWDOWN
// ========================================

// Level 17: Castle Gates
// Enter the dragon's fortress
export const LEVEL_17: LevelData = {
    id: 17,
    worldId: 5,
    name: 'Castle Gates',
    description: "You've reached Draco's fortress. The final battle awaits!",
    musicTrack: 'castle',
    nextLevel: 18,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 15, y: 18 },
        exitPoint: { x: 15, y: 2 },
        tiles: createLevel17Map(),
        enemySpawns: [
            {
                enemyType: 'golem',
                position: { x: 10, y: 12 },
                spawnDelay: 0,
            },
            {
                enemyType: 'golem',
                position: { x: 20, y: 12 },
                spawnDelay: 0.5,
            },
            {
                enemyType: 'elemental',
                position: { x: 8, y: 8 },
                spawnDelay: 1,
            },
            {
                enemyType: 'elemental',
                position: { x: 22, y: 8 },
                spawnDelay: 1.5,
            },
            {
                enemyType: 'spider',
                position: { x: 15, y: 10 },
                spawnDelay: 2,
            },
        ],
        foodSpawns: [
            { foodType: 'apple', position: { x: 8, y: 16 } },
            { foodType: 'apple', position: { x: 22, y: 16 } },
            { foodType: 'meat', position: { x: 10, y: 8 } },
            { foodType: 'meat', position: { x: 20, y: 8 } },
            { foodType: 'gem', position: { x: 5, y: 5 } },
            { foodType: 'gem', position: { x: 25, y: 5 } },
            { foodType: 'lightning', position: { x: 15, y: 12 } },
            { foodType: 'shield', position: { x: 8, y: 4 } },
            { foodType: 'star', position: { x: 22, y: 4 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'breach_gates',
            type: 'kill_all',
            description: 'Breach the castle gates (5 enemies)',
            required: 5,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the castle star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Enter the castle',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel17Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Gate towers (walls on sides)
    for (let y = 10; y < 16; y++) {
        map[y][6] = tile('wall', false);
        map[y][24] = tile('wall', false);
    }
    for (let x = 6; x < 10; x++) {
        map[10][x] = tile('wall', false);
        map[15][x] = tile('wall', false);
    }
    for (let x = 21; x < 25; x++) {
        map[10][x] = tile('wall', false);
        map[15][x] = tile('wall', false);
    }

    return map;
}

// Level 18: Throne Room
// Navigate the grand hall
export const LEVEL_18: LevelData = {
    id: 18,
    worldId: 5,
    name: 'Throne Room',
    description: 'The grand throne room. Draco is near!',
    musicTrack: 'castle',
    nextLevel: 19,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 3, y: 10 },
        exitPoint: { x: 26, y: 10 },
        tiles: createLevel18Map(),
        enemySpawns: [
            {
                enemyType: 'golem',
                position: { x: 12, y: 10 },
                spawnDelay: 0,
            },
            {
                enemyType: 'golem',
                position: { x: 18, y: 10 },
                spawnDelay: 0.5,
            },
            {
                enemyType: 'elemental',
                position: { x: 10, y: 6 },
                spawnDelay: 1,
            },
            {
                enemyType: 'elemental',
                position: { x: 20, y: 14 },
                spawnDelay: 1.5,
            },
            {
                enemyType: 'spider',
                position: { x: 15, y: 5 },
                spawnDelay: 2,
            },
            {
                enemyType: 'spider',
                position: { x: 15, y: 15 },
                spawnDelay: 2.5,
            },
        ],
        foodSpawns: [
            { foodType: 'meat', position: { x: 8, y: 10 } },
            { foodType: 'meat', position: { x: 22, y: 10 } },
            { foodType: 'gem', position: { x: 10, y: 3 } },
            { foodType: 'gem', position: { x: 20, y: 17 } },
            { foodType: 'lightning', position: { x: 15, y: 10 } },
            { foodType: 'shield', position: { x: 6, y: 10 } },
            { foodType: 'apple', position: { x: 24, y: 10 } },
            { foodType: 'star', position: { x: 15, y: 2 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'clear_throne',
            type: 'kill_all',
            description: 'Clear the throne room (6 enemies)',
            required: 6,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the throne star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Continue deeper',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel18Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Throne room columns (symmetrical)
    const columns = [
        { x: 8, y: 6 }, { x: 8, y: 14 },
        { x: 22, y: 6 }, { x: 22, y: 14 },
    ];

    columns.forEach(pos => {
        map[pos.y][pos.x] = tile('wall', false);
        map[pos.y][pos.x + 1] = tile('wall', false);
        map[pos.y + 1][pos.x] = tile('wall', false);
        map[pos.y + 1][pos.x + 1] = tile('wall', false);
    });

    return map;
}

// Level 19: Dragon's Hoard
// The treasure vault before the final battle
export const LEVEL_19: LevelData = {
    id: 19,
    worldId: 5,
    name: "Dragon's Hoard",
    description: 'Mountains of treasure... and danger!',
    musicTrack: 'castle',
    nextLevel: 20,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 15, y: 18 },
        exitPoint: { x: 15, y: 2 },
        tiles: createLevel19Map(),
        enemySpawns: [
            {
                enemyType: 'golem',
                position: { x: 10, y: 10 },
                spawnDelay: 0,
            },
            {
                enemyType: 'golem',
                position: { x: 20, y: 10 },
                spawnDelay: 0.5,
            },
            {
                enemyType: 'elemental',
                position: { x: 8, y: 6 },
                spawnDelay: 1,
            },
            {
                enemyType: 'elemental',
                position: { x: 22, y: 14 },
                spawnDelay: 1.5,
            },
            {
                enemyType: 'elemental',
                position: { x: 15, y: 10 },
                spawnDelay: 2,
            },
            {
                enemyType: 'spider',
                position: { x: 12, y: 14 },
                spawnDelay: 3,
            },
            {
                enemyType: 'spider',
                position: { x: 18, y: 6 },
                spawnDelay: 3.5,
            },
        ],
        foodSpawns: [
            { foodType: 'gem', position: { x: 6, y: 10 } },
            { foodType: 'gem', position: { x: 10, y: 6 } },
            { foodType: 'gem', position: { x: 20, y: 14 } },
            { foodType: 'gem', position: { x: 24, y: 10 } },
            { foodType: 'gold', position: { x: 15, y: 8 } },
            { foodType: 'gold', position: { x: 15, y: 12 } },
            { foodType: 'meat', position: { x: 8, y: 15 } },
            { foodType: 'meat', position: { x: 22, y: 5 } },
            { foodType: 'lightning', position: { x: 5, y: 10 } },
            { foodType: 'lightning', position: { x: 25, y: 10 } },
            { foodType: 'shield', position: { x: 15, y: 15 } },
            { foodType: 'star', position: { x: 15, y: 5 } },
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'loot_hoard',
            type: 'kill_all',
            description: 'Defeat the hoard guardians (7 enemies)',
            required: 7,
            current: 0,
            completed: false,
        },
        {
            id: 'collect_star',
            type: 'collect_items',
            description: 'Find the hoard star',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: "Face Draco's lair",
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel19Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Treasure piles (walls scattered)
    const treasurePiles = [
        { x: 6, y: 6 }, { x: 7, y: 6 },
        { x: 23, y: 6 }, { x: 24, y: 6 },
        { x: 6, y: 14 }, { x: 7, y: 14 },
        { x: 23, y: 14 }, { x: 24, y: 14 },
        { x: 12, y: 8 }, { x: 13, y: 8 },
        { x: 17, y: 12 }, { x: 18, y: 12 },
    ];

    treasurePiles.forEach(pos => {
        map[pos.y][pos.x] = tile('wall', false);
    });

    return map;
}

// Level 20: Dragon's Lair
// THE FINAL BOSS BATTLE - DRACO!
export const LEVEL_20: LevelData = {
    id: 20,
    worldId: 5,
    name: "Dragon's Lair - FINAL BATTLE",
    description: 'FACE DRACO THE DRAGON! The fate of the Emerald Apple is in your hands!',
    musicTrack: 'boss',
    nextLevel: undefined, // FINAL LEVEL!
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 15, y: 18 },
        exitPoint: { x: 15, y: 2 },
        tiles: createLevel20Map(),
        enemySpawns: [
            {
                enemyType: 'draco',
                position: { x: 15, y: 6 },
                spawnDelay: 0,
            },
            // Minions spawn during fight
            {
                enemyType: 'elemental',
                position: { x: 8, y: 10 },
                spawnDelay: 10,
            },
            {
                enemyType: 'elemental',
                position: { x: 22, y: 10 },
                spawnDelay: 10,
            },
            {
                enemyType: 'golem',
                position: { x: 12, y: 12 },
                spawnDelay: 15,
            },
            {
                enemyType: 'golem',
                position: { x: 18, y: 12 },
                spawnDelay: 15,
            },
        ],
        foodSpawns: [
            // Lots of healing
            { foodType: 'meat', position: { x: 7, y: 16 } },
            { foodType: 'meat', position: { x: 23, y: 16 } },
            { foodType: 'lightning', position: { x: 10, y: 15 } },
            { foodType: 'lightning', position: { x: 20, y: 15 } },
            { foodType: 'shield', position: { x: 8, y: 12 } },
            { foodType: 'shield', position: { x: 22, y: 12 } },
            { foodType: 'apple', position: { x: 15, y: 15 } },
            { foodType: 'star', position: { x: 15, y: 10 } },
            { foodType: 'gem', position: { x: 7, y: 6 } },
            { foodType: 'gem', position: { x: 23, y: 6 } },
            { foodType: 'star', position: { x: 15, y: 10 } }, // FINAL STAR - THE EMERALD APPLE!
        ],
        secretRooms: [],
    },
    objectives: [
        {
            id: 'defeat_draco',
            type: 'kill_all',
            description: '🐉 DEFEAT DRACO THE DRAGON! 🐉',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'claim_emerald_apple',
            type: 'collect_items',
            description: '⭐ CLAIM THE EMERALD APPLE! ⭐',
            required: 1,
            current: 0,
            completed: false,
        },
        {
            id: 'reach_exit',
            type: 'reach_exit',
            description: 'Escape victorious!',
            required: 1,
            current: 0,
            completed: false,
        },
    ],
};

function createLevel20Map(): Tile[][] {
    const width = 30;
    const height = 20;
    const map: Tile[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = tile('floor', true);
        }
    }

    // Border walls
    for (let x = 0; x < width; x++) {
        map[0][x] = tile('wall', false);
        map[height - 1][x] = tile('wall', false);
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = tile('wall', false);
        map[y][width - 1] = tile('wall', false);
    }

    // Dragon lair pillars (epic arena)
    const largePillars = [
        { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 6 }, { x: 6, y: 6 },
        { x: 24, y: 5 }, { x: 25, y: 5 }, { x: 24, y: 6 }, { x: 25, y: 6 },
        { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 5, y: 15 }, { x: 6, y: 15 },
        { x: 24, y: 14 }, { x: 25, y: 14 }, { x: 24, y: 15 }, { x: 25, y: 15 },
    ];

    largePillars.forEach(pos => {
        map[pos.y][pos.x] = tile('wall', false);
    });

    // Add some lava pools for dramatic effect
    const lavaSpots = [
        { x: 10, y: 8 }, { x: 11, y: 8 },
        { x: 19, y: 8 }, { x: 20, y: 8 },
        { x: 10, y: 12 }, { x: 11, y: 12 },
        { x: 19, y: 12 }, { x: 20, y: 12 },
    ];

    lavaSpots.forEach(pos => {
        map[pos.y][pos.x] = tile('lava', true);
    });

    return map;
}

// Export all levels
export const LEVELS: Record<number, LevelData> = {
    1: LEVEL_1,
    2: LEVEL_2,
    3: LEVEL_3,
    4: LEVEL_4,
    5: LEVEL_5,
    6: LEVEL_6,
    7: LEVEL_7,
    8: LEVEL_8,
    9: LEVEL_9,
    10: LEVEL_10,
    11: LEVEL_11,
    12: LEVEL_12,
    13: LEVEL_13,
    14: LEVEL_14,
    15: LEVEL_15,
    16: LEVEL_16,
    17: LEVEL_17,
    18: LEVEL_18,
    19: LEVEL_19,
    20: LEVEL_20, // FINAL LEVEL!!!
};

// Export all levels as array for tests
export const allLevels: LevelData[] = [
    LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5,
    LEVEL_6, LEVEL_7, LEVEL_8, LEVEL_9, LEVEL_10,
    LEVEL_11, LEVEL_12, LEVEL_13, LEVEL_14, LEVEL_15,
    LEVEL_16, LEVEL_17, LEVEL_18, LEVEL_19, LEVEL_20,
];
