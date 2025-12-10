# Snake Quest RPG Mode 🐍⚔️

An epic adventure mode for Snake Showdown where you embark on a quest to recover the stolen Emerald Apple!

## 📖 Story

The evil dragon Draco has stolen the Emerald Apple! Help Naga the snake recover the 20 shards across 5 mystical worlds!

## 🎮 Features

### Current Implementation

- **12 Levels** across 3 worlds (Forest + Desert + Ice)
- **Level Progression** - Complete objectives to advance
- **Enemy Variety** - 9 unique enemy types with different behaviors
- **Boss Fights** - Caterpillar Queen (L4), Djinn (L8), Frost Giant (L12)
- **Collectibles** - Apples, gems, meat, stars, and gold
- **RPG Mechanics** - XP, leveling, health, score tracking
- **Custom Visuals** - Hand-drawn enemies and food items
- **Terrain Variety** - Floor, sand, ice with visual variety

### Game Mechanics

#### Controls
- **WASD** or **Arrow Keys** - Move the snake
- **P** or **ESC** - Pause game

#### Objectives
Each level has specific objectives:
- **Kill All** - Defeat a certain number of enemies
- **Collect Items** - Find hidden stars
- **Reach Exit** - Navigate to the level exit

#### Progression
- Earn XP by defeating enemies and collecting food
- Level up to increase stats
- Collect stars for bonus rewards
- Gather gold for future shop upgrades

## 🗺️ World 1: Forest (Levels 1-4)

### Level 1: Tutorial Forest
- **Enemies**: 2 Caterpillars, 1 Scorpion
- **Theme**: Introduction to basic mechanics
- **Layout**: Simple corridors with obstacles

### Level 2: Deeper Woods
- **Enemies**: 2 Snakes, 1 Caterpillar, 1 Scorpion
- **Theme**: Introduces fast-moving enemies
- **Layout**: Maze-like corridors

### Level 3: Bat Cave
- **Enemies**: 3 Bats, 2 Scorpions
- **Theme**: Flying enemies in a circular cave
- **Layout**: Circular arena with random walls

### Level 4: Queen's Lair (Boss)
- **Boss**: Caterpillar Queen (15 HP)
- **Enemies**: 4 Caterpillar minions spawn over time
- **Theme**: First mini-boss battle
- **Layout**: Open arena with pillars

## 🏜️ World 2: Desert (Levels 5-8)

### Level 5: Desert Entrance
- **Enemies**: 3 Lizards, 2 Scorpions
- **Theme**: Introduction to desert and fast lizards
- **Layout**: Sandy terrain with dunes
- **New**: Sand tiles with varied colors

### Level 6: Sandstorm
- **Enemies**: 2 Lizards, 2 Snakes, 2 Scorpions
- **Theme**: Mixed enemy challenge
- **Layout**: Full sand terrain with scattered rocks
- **New**: Lightning power-up

### Level 7: Oasis
- **Enemies**: 2 Lizards, 1 Spider, 2 Scorpions, 1 Snake
- **Theme**: Desert oasis with mixed terrain
- **Layout**: Circular oasis (floor) surrounded by sand
- **New**: First appearance of Spider enemy

### Level 8: Ancient Temple (Boss)
- **Boss**: Ancient Djinn (5 HP, high damage)
- **Enemies**: 2 Scorpions, 2 Lizards spawn as reinforcements
- **Theme**: Boss battle in ancient temple
- **Layout**: Temple arena with pillars and sand patches

## 👾 Enemies

| Enemy | HP | Damage | Speed | XP | Behavior |
|-------|-----|--------|-------|-----|----------|
| Caterpillar | 1 | 1 | 1.5 | 5 | Random Walk |
| Scorpion | 2 | 1 | 2.5 | 10 | Follow Player |
| Snake | 2 | 1 | 3.5 | 8 | Fast Chaser |
| Bat | 1 | 1 | 3.0 | 6 | Flying Follower |
| Lizard | 2 | 1 | 3.0 | 12 | Follow Player |
| Spider | 3 | 1 | 2.0 | 15 | Ranged Attack |
| Elemental | 5 | 2 | 2.5 | 20 | Ice Attack |
| Golem | 10 | 2 | 1.0 | 30 | Slow Tank |
| Caterpillar Queen | 15 | 2 | 1.0 | 100 | Boss - Random Walk |
| Djinn | 5 | 2 | 2.0 | 25 | Boss - Teleport |
| Frost Giant (Golem) | 10 | 2 | 1.0 | 30 | Boss - Tank |

## 🍎 Food & Collectibles

| Item | Points | XP | Effect |
|------|--------|-----|--------|
| Apple | 10 | 5 | Basic food |
| Gem | 50 | 25 | Valuable collectible |
| Meat | 15 | 10 | Speed boost (3s) |
| Lightning | 20 | 15 | Invincibility (2s) |
| Shield | 0 | 5 | Protective shield |
| Gold | 5 | 0 | Currency |
| Star | 100 | 50 | Hidden bonus |

## 🏗️ Architecture

### File Structure

```
game-rpg/
├── components/          # React components
│   ├── RPGCanvas.tsx   # Main game renderer
│   ├── RPGControls.tsx # UI controls panel
│   └── RPGUI.tsx       # In-game overlay
├── data/
│   └── levels.ts       # Level definitions
├── hooks/
│   └── useRPGGame.ts   # Main game logic hook
├── systems/            # Game systems
│   ├── CombatSystem.ts # Combat calculations
│   ├── EnemySystem.ts  # Enemy AI
│   ├── LevelSystem.ts  # Level management
│   └── ProgressionSystem.ts # XP & leveling
├── types/              # TypeScript types
│   ├── entities.ts
│   ├── gameState.ts
│   ├── level.ts
│   └── progression.ts
└── utils/              # Utility functions
    ├── collision.ts
    ├── movement.ts
    └── pathfinding.ts
```

### Key Systems

#### Game Loop
- **Move Interval**: 150ms between moves
- **Grid-based movement** - Snake moves exactly 1 tile per step
- **Enemy AI updates** - Independent timing for each enemy type

#### Combat System
- Player collision with enemies damages both
- Invincibility frames prevent instant death
- Health bar display for damaged enemies
- Boss enemies have special health bars

#### Level System
- Objective tracking and completion
- Enemy and food spawning
- Exit detection and level transitions

## ❄️ World 3: Ice Caves (Levels 9-12) - COMPLETED

### Level 9: Frozen Entrance
- **Enemies**: 2 Ice Elementals, 2 Bats
- **Theme**: Introduction to ice caves
- **Layout**: Mixed ice and floor tiles
- **New**: Ice tiles with sparkle effects

### Level 10: Crystal Chambers
- **Enemies**: 2 Ice Elementals, 1 Golem, 2 Spiders
- **Theme**: Ice maze with crystal formations
- **Layout**: Full ice terrain with crystal walls

### Level 11: Frozen Lake
- **Enemies**: 2 Ice  Elementals, 1 Golem, 2 Bats, 1 Snake
- **Theme**: Vast frozen lake
- **Layout**: Ice lake with scattered floor islands

### Level 12: Frost Giant's Throne (Boss)
- **Boss**: Frost Giant (Golem) - 10 HP
- **Enemies**: Additional Golems, Elementals, Bats
- **Theme**: Epic ice boss battle
- **Layout**: Throne room with ice pillars

## 🚀 Future Plans

### World 4: Volcano (Levels 13-16)
- Lava tiles dealing damage
- Fire enemies (Elementals, Golems)
- Eruption events

### World 5: Dragon's Castle (Levels 17-20)
- Complex puzzle levels
- Multiple boss encounters
- Final showdown with Draco

### Additional Features
- **Shop System** - Spend gold on upgrades
- **Abilities** - Active skills (Dash, Fire Breath, etc.)
- **Achievements** - Track milestones
- **Save System** - Continue progress
- **Leaderboards** - Compare scores

## 🎨 Visual Design

All enemies and food items use custom canvas rendering:
- **No emoji** - Pure shape-based graphics
- **Grid-aligned** - Precise positioning
- **Color-coded** - Each type has distinct colors
- **Health bars** - Visual damage feedback
- **Glow effects** - Important items stand out

## 🔧 Development

### Adding a New Level

1. Create level data in `data/levels.ts`:
```typescript
export const LEVEL_X: LevelData = {
    id: X,
    worldId: Y,
    name: 'Level Name',
    description: 'Description',
    musicTrack: 'forest',
    nextLevel: X + 1,
    map: {
        width: 30,
        height: 20,
        spawnPoint: { x: 5, y: 10 },
        exitPoint: { x: 26, y: 10 },
        tiles: createLevelXMap(),
        enemySpawns: [...],
        foodSpawns: [...],
        secretRooms: [],
    },
    objectives: [...],
};
```

2. Create map generator function
3. Add to LEVELS export object
4. Test and balance difficulty

### Adding a New Enemy

1. Add type to `types/entities.ts`
2. Add stats to `systems/EnemySystem.ts`
3. Add AI behavior in `systems/LevelSystem.ts`
4. Add visual rendering in `components/RPGCanvas.tsx`

## 📝 Credits

- **Game Design**: Custom RPG mechanics for Snake
- **Visual Design**: Hand-drawn canvas graphics
- **Level Design**: Progressive difficulty curve
