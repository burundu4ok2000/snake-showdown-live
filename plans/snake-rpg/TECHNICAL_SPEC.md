# 🛠️ TECHNICAL SPECIFICATION - Snake Quest RPG

## Architecture Overview

### High-Level Architecture
```
┌─────────────┐
│   PLAYER    │
└──────┬──────┘
       │
┌──────▼──────────────────────────────┐
│      PRESENTATION LAYER             │
│  ┌────────┐  ┌────────┐  ┌────────┐│
│  │  UI    │  │ Canvas │  │ Audio  ││
│  └────────┘  └────────┘  └────────┘│
└──────┬──────────────────────────────┘
       │
┌──────▼──────────────────────────────┐
│      GAME LOGIC LAYER               │
│  ┌────────┐  ┌────────┐  ┌────────┐│
│  │ Snake  │  │Enemies │  │Levels  ││
│  └────────┘  └────────┘  └────────┘│
└──────┬──────────────────────────────┘
       │
┌──────▼──────────────────────────────┐
│      DATA LAYER                     │
│  ┌────────┐  ┌────────┐  ┌────────┐│
│  │LocalDB │  │Backend │  │ State  ││
│  └────────┘  └────────┘  └────────┘│
└─────────────────────────────────────┘
```

---

## 📁 File Structure

```
frontend/src/
├── game-rpg/                    # New RPG game mode
│   ├── components/
│   │   ├── RPGCanvas.tsx        # Main game canvas
│   │   ├── RPGControls.tsx      # Game controls
│   │   ├── RPGUI.tsx            # HUD overlay
│   │   ├── Cutscene.tsx         # Story cutscenes
│   │   ├── DialogBox.tsx        # NPC dialogs
│   │   ├── UpgradeShop.tsx      # Upgrade menu
│   │   ├── QuestLog.tsx         # Quest tracker
│   │   └── BossHealthBar.tsx    # Boss HP display
│   │
│   ├── systems/
│   │   ├── LevelSystem.ts       # Level management
│   │   ├── ProgressionSystem.ts # XP & leveling
│   │   ├── EnemySystem.ts       # Enemy AI
│   │   ├── CombatSystem.ts      # Damage calculation
│   │   ├── QuestSystem.ts       # Quest logic
│   │   └── AchievementSystem.ts # Achievements
│   │
│   ├── entities/
│   │   ├── Snake.ts             # Player snake
│   │   ├── Enemy.ts             # Base enemy class
│   │   ├── Boss.ts              # Boss class
│   │   ├── Food.ts              # Food items
│   │   └── Projectile.ts        # Enemy projectiles
│   │
│   ├── levels/
│   │   ├── World1/              # Forest levels
│   │   │   ├── Level1.ts
│   │   │   ├── Level2.ts
│   │   │   ├── Level3.ts
│   │   │   ├── Level4.ts
│   │   │   └── Boss1.ts
│   │   ├── World2/              # Desert levels
│   │   ├── World3/              # Ice levels
│   │   ├── World4/              # Fire levels
│   │   └── World5/              # Tower levels
│   │
│   ├── data/
│   │   ├── enemies.json         # Enemy definitions
│   │   ├── levels.json          # Level layouts
│   │   ├── quests.json          # Quest data
│   │   ├── achievements.json    # Achievement list
│   │   ├── dialogs.json         # Story dialogs
│   │   └── upgrades.json        # Shop items
│   │
│   ├── hooks/
│   │   ├── useRPGGame.ts        # Main game hook
│   │   ├── useProgression.ts    # Level/XP hook
│   │   ├── useCombat.ts         # Combat hook
│   │   └── useQuests.ts         # Quest hook
│   │
│   └── utils/
│       ├── pathfinding.ts       # Enemy AI pathfinding
│       ├── collision.ts         # Collision detection
│       ├── worldGen.ts          # Level generation
│       └── saveManager.ts       # Save/load system
│
└── assets/
    └── rpg/
        ├── sprites/             # Character sprites
        ├── tiles/               # Level tiles
        ├── effects/             # Particle effects
        └── ui/                  # UI elements
```

---

## 🎮 Core Systems

### 1. RPG Game State

```typescript
interface RPGGameState {
  // Player
  player: {
    snake: Position[];
    health: number;
    maxHealth: number;
    level: number;
    xp: number;
    xpToNext: number;
    gold: number;
    stars: number;
    powerups: ActivePowerup[];
    upgrades: PlayerUpgrade[];
  };

  // Current Level
  level: {
    worldId: number;
    levelId: number;
    map: LevelMap;
    objectives: Objective[];
    timeElapsed: number;
    starsCollected: number;
  };

  // Entities
  enemies: Enemy[];
  food: Food[];
  projectiles: Projectile[];
  
  // Game State
  status: 'menu' | 'playing' | 'paused' | 'cutscene' | 'shop' | 'game-over' | 'victory';
  difficulty: 'easy' | 'normal' | 'hard';
  
  // Progression
  unlockedWorlds: number[];
  completedLevels: string[];
  achievements: Achievement[];
  quests: Quest[];
}
```

### 2. Level System

```typescript
interface LevelMap {
  width: number;
  height: number;
  tiles: Tile[][];
  spawnPoint: Position;
  exitPoint: Position;
  enemySpawns: EnemySpawn[];
  foodSpawns: FoodSpawn[];
  secretRooms: SecretRoom[];
}

interface Tile {
  type: 'floor' | 'wall' | 'lava' | 'ice' | 'water';
  walkable: boolean;
  damage: number;
  friction: number;
  sprite: string;
}

interface EnemySpawn {
  enemyType: string;
  position: Position;
  patrolPath?: Position[];
  spawnDelay: number;
}
```

### 3. Enemy AI System

```typescript
interface Enemy {
  id: string;
  type: EnemyType;
  position: Position;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  ai: AIBehavior;
  state: 'idle' | 'patrol' | 'chase' | 'attack' | 'flee';
  attackCooldown: number;
}

type AIBehavior = 
  | 'random_walk'      // Caterpillar
  | 'follow_player'    // Scorpion
  | 'patrol_path'      // Guard
  | 'teleport_random'  // Djinn
  | 'ranged_attack'    // Spider
  | 'boss_pattern';    // Bosses

// AI Update Loop
function updateEnemyAI(enemy: Enemy, player: Snake, deltaTime: number) {
  switch (enemy.ai) {
    case 'random_walk':
      moveRandomly(enemy);
      break;
    case 'follow_player':
      const path = findPath(enemy.position, player.head);
      moveAlongPath(enemy, path);
      break;
    case 'ranged_attack':
      if (canSeePlayer(enemy, player)) {
        shootProjectile(enemy, player.head);
      }
      break;
    // ... etc
  }
}
```

### 4. Combat System

```typescript
interface CombatSystem {
  // Damage calculation
  calculateDamage(attacker: Entity, defender: Entity): number {
    const baseDamage = attacker.damage;
    const defense = defender.defense || 0;
    const critChance = attacker.critChance || 0;
    
    let damage = baseDamage - defense;
    
    // Critical hit
    if (Math.random() < critChance) {
      damage *= 2;
      spawnFloatingText("CRITICAL!", defender.position);
    }
    
    return Math.max(1, damage);
  }

  // Handle collision
  onCollision(entity1: Entity, entity2: Entity) {
    if (entity1 instanceof Snake && entity2 instanceof Enemy) {
      // Player hit enemy
      if (entity1.hasShield) {
        entity1.hasShield = false;
        playSound('shield_block');
      } else {
        entity1.health -= this.calculateDamage(entity2, entity1);
        playSound('player_hurt');
        screenShake(0.3);
      }
    }
  }
}
```

### 5. Progression System

```typescript
interface ProgressionSystem {
  // XP calculation
  calculateXP(action: string): number {
    const xpTable = {
      'eat_apple': 5,
      'eat_gem': 25,
      'kill_enemy': 10,
      'complete_level': 100,
      'complete_quest': 50,
      'find_star': 30,
    };
    return xpTable[action] || 0;
  }

  // Level up formula
  xpForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  // Add XP
  addXP(player: Player, amount: number) {
    player.xp += amount;
    spawnFloatingText(`+${amount} XP`, player.position);
    
    while (player.xp >= player.xpToNext) {
      this.levelUp(player);
    }
  }

  // Level up!
  levelUp(player: Player) {
    player.level++;
    player.xp -= player.xpToNext;
    player.xpToNext = this.xpForLevel(player.level + 1);
    
    // Rewards
    player.maxHealth += 1;
    player.health = player.maxHealth;
    player.gold += 50;
    
    // Effects
    playSound('level_up');
    spawnParticles('level_up', player.position);
    showNotification(`LEVEL UP! You are now Level ${player.level}!`);
    pauseGame(2); // Dramatic pause
  }
}
```

### 6. Quest System

```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'kill' | 'collect' | 'survive' | 'explore';
  target: number;
  current: number;
  reward: {
    gold?: number;
    xp?: number;
    item?: string;
  };
  completed: boolean;
}

// Example quests
const quests: Quest[] = [
  {
    id: 'forest_1',
    title: 'Gem Collector',
    description: 'Collect 10 gems in the forest',
    type: 'collect',
    target: 10,
    current: 0,
    reward: { gold: 100, xp: 50 },
    completed: false,
  },
  {
    id: 'desert_1',
    title: 'Sand Serpent Slayer',
    description: 'Defeat 5 desert lizards',
    type: 'kill',
    target: 5,
    current: 0,
    reward: { gold: 200, item: 'shield' },
    completed: false,
  },
];
```

---

## 🎨 Rendering System

### Canvas Layers

```typescript
// Multiple canvas layers for optimization
const layers = {
  background: ctx1,   // Static tiles, rarely updates
  entities: ctx2,     // Enemies, food, player
  effects: ctx3,      // Particles, projectiles
  ui: ctx4,           // Health bars, HUD
};

// Render pipeline
function render(gameState: RPGGameState) {
  // Layer 1: Background (cached)
  if (needsRedraw) {
    renderBackground(layers.background, gameState.level.map);
  }
  
  // Layer 2: Entities (every frame)
  clearLayer(layers.entities);
  renderFood(layers.entities, gameState.food);
  renderEnemies(layers.entities, gameState.enemies);
  renderSnake(layers.entities, gameState.player.snake);
  
  // Layer 3: Effects (every frame)
  clearLayer(layers.effects);
  renderProjectiles(layers.effects, gameState.projectiles);
  renderParticles(layers.effects, particleSystem);
  
  // Layer 4: UI (when changed)
  if (uiNeedsUpdate) {
    renderUI(layers.ui, gameState.player);
  }
}
```

### Sprite System

```typescript
interface Sprite {
  image: HTMLImageElement;
  frames: number;
  frameWidth: number;
  frameHeight: number;
  currentFrame: number;
  animation: 'idle' | 'walk' | 'attack' | 'death';
}

class SpriteRenderer {
  sprites: Map<string, Sprite> = new Map();
  
  loadSprite(id: string, path: string, frames: number) {
    const img = new Image();
    img.src = path;
    this.sprites.set(id, {
      image: img,
      frames,
      frameWidth: img.width / frames,
      frameHeight: img.height,
      currentFrame: 0,
      animation: 'idle',
    });
  }
  
  render(ctx: CanvasRenderingContext2D, spriteId: string, x: number, y: number) {
    const sprite = this.sprites.get(spriteId);
    if (!sprite) return;
    
    const sx = sprite.currentFrame * sprite.frameWidth;
    ctx.drawImage(
      sprite.image,
      sx, 0, sprite.frameWidth, sprite.frameHeight,
      x, y, sprite.frameWidth, sprite.frameHeight
    );
    
    // Animate
    if (Date.now() % 100 < 50) {
      sprite.currentFrame = (sprite.currentFrame + 1) % sprite.frames;
    }
  }
}
```

---

## 💾 Save System

```typescript
interface SaveData {
  version: string;
  timestamp: number;
  player: {
    level: number;
    xp: number;
    gold: number;
    health: number;
    upgrades: string[];
  };
  progression: {
    currentWorld: number;
    currentLevel: number;
    completedLevels: string[];
    starsCollected: number;
    totalStars: number;
  };
  achievements: string[];
  stats: {
    totalPlayTime: number;
    totalKills: number;
    totalDeaths: number;
    highestScore: number;
  };
}

class SaveManager {
  save(gameState: RPGGameState) {
    const saveData: SaveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      player: {
        level: gameState.player.level,
        xp: gameState.player.xp,
        gold: gameState.player.gold,
        health: gameState.player.health,
        upgrades: gameState.player.upgrades.map(u => u.id),
      },
      // ... rest of data
    };
    
    // Local storage
    localStorage.setItem('snake_rpg_save', JSON.stringify(saveData));
    
    // Backend (if logged in)
    if (isAuthenticated) {
      api.savegame.upload(saveData);
    }
  }
  
  load(): SaveData | null {
    const local = localStorage.getItem('snake_rpg_save');
    if (local) {
      return JSON.parse(local);
    }
    return null;
  }
  
  // Auto-save every 30 seconds
  enableAutoSave(gameState: RPGGameState) {
    setInterval(() => {
      if (gameState.status === 'playing') {
        this.save(gameState);
      }
    }, 30000);
  }
}
```

---

## 🎵 Audio System

```typescript
class RPGAudioSystem {
  music: Map<string, HTMLAudioElement> = new Map();
  sfx: Map<string, HTMLAudioElement> = new Map();
  currentMusic: string | null = null;
  
  // Load all audio
  async loadAudio() {
    // Music tracks
    await this.loadMusic('menu', '/audio/music/menu.mp3');
    await this.loadMusic('forest', '/audio/music/forest.mp3');
    await this.loadMusic('desert', '/audio/music/desert.mp3');
    await this.loadMusic('boss', '/audio/music/boss.mp3');
    
    // Sound effects
    await this.loadSFX('eat', '/audio/sfx/eat.wav');
    await this.loadSFX('hit', '/audio/sfx/hit.wav');
    await this.loadSFX('level_up', '/audio/sfx/level_up.wav');
  }
  
  // Play music with crossfade
  playMusic(track: string, crossfade = 1000) {
    const newTrack = this.music.get(track);
    const oldTrack = this.currentMusic ? this.music.get(this.currentMusic) : null;
    
    if (oldTrack) {
      this.fadeOut(oldTrack, crossfade);
    }
    
    if (newTrack) {
      newTrack.volume = 0;
      newTrack.loop = true;
      newTrack.play();
      this.fadeIn(newTrack, crossfade);
      this.currentMusic = track;
    }
  }
  
  // Play SFX
  playSFX(sound: string, volume = 1.0) {
    const sfx = this.sfx.get(sound)?.cloneNode() as HTMLAudioElement;
    if (sfx) {
      sfx.volume = volume;
      sfx.play();
    }
  }
}
```

---

## 🔄 Game Loop

```typescript
class RPGGameLoop {
  private lastTime = 0;
  private fps = 60;
  private frameTime = 1000 / this.fps;
  private accumulator = 0;
  
  start(gameState: RPGGameState) {
    const loop = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      
      this.accumulator += deltaTime;
      
      // Fixed timestep updates
      while (this.accumulator >= this.frameTime) {
        this.update(gameState, this.frameTime / 1000);
        this.accumulator -= this.frameTime;
      }
      
      // Render
      this.render(gameState);
      
      requestAnimationFrame(loop);
    };
    
    requestAnimationFrame(loop);
  }
  
  update(gameState: RPGGameState, dt: number) {
    if (gameState.status !== 'playing') return;
    
    // Update systems
    this.updateSnake(gameState.player, dt);
    this.updateEnemies(gameState.enemies, gameState.player, dt);
    this.updateProjectiles(gameState.projectiles, dt);
    this.updateParticles(dt);
    
    // Check collisions
    this.checkCollisions(gameState);
    
    // Check objectives
    this.checkObjectives(gameState);
    
    // Update timer
    gameState.level.timeElapsed += dt;
  }
  
  render(gameState: RPGGameState) {
    // Render all layers
    renderGame(gameState);
  }
}
```

---

## 📊 Performance Optimization

### Techniques:
1. **Object Pooling** - Reuse enemy/projectile objects
2. **Spatial Partitioning** - Grid-based collision detection
3. **Lazy Loading** - Load levels on demand
4. **Canvas Layering** - Separate static/dynamic content
5. **Web Workers** - Pathfinding in background thread

```typescript
// Object pool example
class EntityPool<T> {
  private available: T[] = [];
  private active: T[] = [];
  
  get(): T {
    return this.available.pop() || this.create();
  }
  
  release(entity: T) {
    this.available.push(entity);
    const index = this.active.indexOf(entity);
    if (index > -1) this.active.splice(index, 1);
  }
  
  protected create(): T {
    // Override in subclass
    return {} as T;
  }
}

const enemyPool = new EntityPool<Enemy>();
const projectilePool = new EntityPool<Projectile>();
```

---

## 🧪 Testing Strategy

### Unit Tests:
- `collision.test.ts` - Collision detection
- `pathfinding.test.ts` - AI pathfinding
- `progression.test.ts` - XP calculations
- `combat.test.ts` - Damage formulas

### Integration Tests:
- Enemy AI behaviors
- Level completion flow
- Save/load functionality
- Achievement unlocking

### Playtesting Metrics:
- Average level completion time
- Death rate per level
- Player feedback on difficulty
- Bug reports

---

## 🚀 Deployment

### Build Process:
```bash
# Frontend build
cd frontend
npm run build

# Optimize assets
npm run optimize-images
npm run compress-audio

# Deploy
npm run deploy
```

### Environment Variables:
```
VITE_API_URL=https://api.snake-quest.com
VITE_ENABLE_DEBUG=false
VITE_ANALYTICS_ID=GA-XXXXX
```

---

## 📈 Analytics & Monitoring

### Track Events:
- `level_start` - Level ID, difficulty
- `level_complete` - Time, deaths, stars
- `enemy_kill` - Enemy type
- `player_death` - Cause, level
- `upgrade_purchase` - Upgrade ID
- `achievement_unlock` - Achievement ID

### Performance Metrics:
- FPS (target: 60)
- Memory usage
- Load times
- API response times

---

**STATUS: 🔧 TECHNICAL DESIGN COMPLETE**

*Ready for implementation!* 🚀

---

*Last updated: 2025-12-09*
