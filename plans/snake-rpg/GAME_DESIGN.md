# 🐍⚔️ SNAKE QUEST: THE SERPENT'S PROPHECY

## Game Design Document

**Жанр:** Action RPG / Arcade  
**Платформа:** Web (Progressive Web App)  
**Целевая аудитория:** 12+  
**Вдохновение:** Classic Nokia Snake + Skyrim + Mario

---

## 🎯 CORE CONCEPT

**"Что если змейка из Nokia 3310 попала в мир Skyrim?"**

Классическая змейка встречает полноценную RPG с сюжетом, боссами, квестами и прогрессией!

---

## 📖 СЮЖЕТ

### Backstory
Давным-давно в королевстве **Серпентия** жил мудрый змей-хранитель **Нага**. Он веками охранял **Изумрудное Яблоко Вечности** - магический артефакт, дающий жизнь всему королевству.

Но однажды злой дракон **Драко Тёмный** напал на храм, похитил яблоко и разбил его на **20 осколков**, разбросав их по пяти мирам!

Без силы яблока королевство начало умирать. Нага - последняя надежда. Он должен пройти через все миры, собрать осколки, победить Драко и восстановить яблоко!

### Концовки
- **Good Ending:** Все 20 осколков собраны, Драко побеждён, мир спасён
- **Bad Ending:** Нага умирает в бою, королевство погибает
- **Secret Ending:** Собраны все 100 звёзд → разблокировка секретного мира + божественная форма Наги

---

## 🗺️ МИРЫ И УРОВНИ

### Структура: 5 миров × 4 уровня + финальный босс = 20 levels

#### 🌲 Мир 1: ИЗУМРУДНЫЙ ЛЕС (Levels 1-4)
**Тема:** Светлый лес, зелёные поляны, руины храма

**Уровни:**
- **Level 1:** Tutorial Forest - пустая арена, учимся управлению
- **Level 2:** Ancient Ruins - первые препятствия (камни)
- **Level 3:** Thorny Path - коридоры с шипами
- **Level 4:** 🐉 BOSS: Forest Guardian (Лесной страж-дракон)

**Враги:**
- 🐛 Caterpillar - медленно ползает
- 🦂 Forest Scorpion - быстро бегает
- 🕷️ Giant Spider - стреляет паутиной (замедление)

**Награды:**
- 💎 Emerald Shards × 4
- 🏆 Achievement: "Forest Conqueror"
- 🔓 Unlock: Sprint ability

---

#### 🏜️ Мир 2: ПУСТЫНЯ ЗАБВЕНИЯ (Levels 5-8)
**Тема:** Песчаные дюны, древние пирамиды, палящее солнце

**Уровни:**
- **Level 5:** Sandy Dunes - скользкий песок
- **Level 6:** Lost Pyramid - лабиринт внутри пирамиды
- **Level 7:** Quicksand Arena - зоны с зыбучим песком (урон)
- **Level 8:** 🐉 BOSS: Sand Serpent (Гигантский песчаный червь)

**Враги:**
- 🦎 Desert Lizard - прыгает через препятствия
- 🧞 Fire Djinn - телепортируется
- 💀 Mummy - медленный но живучий

**Награды:**
- 💎 Ruby Shards × 4
- 🏆 Achievement: "Desert Survivor"
- 🔓 Unlock: Shield ability (блок 1 удара)

---

#### ❄️ Мир 3: ЛЕДЯНЫЕ ПИКИ (Levels 9-12)
**Тема:** Скользкий лёд, снежные бури, замёрзшие пещеры

**Механика:** Инерция! Змейка скользит на льду!

**Уровни:**
- **Level 9:** Frozen Lake - весь пол - лёд
- **Level 10:** Ice Cave - узкие проходы
- **Level 11:** Blizzard Arena - метель ограничивает видимость
- **Level 12:** 🐉 BOSS: Ice Dragon (Ледяной дракон)

**Враги:**
- ⛄ Snow Golem - стреляет снежками
- 🐺 Ice Wolf - быстрый, агрессивный
- 🧊 Living Ice - медленно преследует

**Награды:**
- 💎 Sapphire Shards × 4
- 🏆 Achievement: "Ice Breaker"
- 🔓 Unlock: +1 Extra Life (permanent)

---

#### 🌋 Мир 4: ОГНЕННАЯ БЕЗДНА (Levels 13-16)
**Тема:** Лава, огонь, вулканы, тьма

**Механика:** Лава наносит урон при касании!

**Уровни:**
- **Level 13:** Lava Rivers - реки лавы, узкие мосты
- **Level 14:** Volcano Core - внутри вулкана
- **Level 15:** Demon Fortress - замок демонов
- **Level 16:** 🐉 BOSS: Inferno Demon (Огненный демон)

**Враги:**
- 🔥 Fire Elemental - движется по лаве
- 👹 Lesser Demon - летает, атакует с воздуха
- 🦇 Lava Bat - быстрый, хаотичный

**Награды:**
- 💎 Obsidian Shards × 4
- 🏆 Achievement: "Hell Walker"
- 🔓 Unlock: Fire Resistance

---

#### 🏰 Мир 5: БАШНЯ ДРАКО (Levels 17-20)
**Тема:** Тёмная башня, магия, финальная битва

**Уровни:**
- **Level 17:** Tower Entrance - армия врагов
- **Level 18:** Cursed Library - книжные лабиринты
- **Level 19:** Throne Room Approach - все враги сразу!
- **Level 20:** 🐉 FINAL BOSS: DRACO THE DARK

**Финальный босс:**
```
🐉 DRACO THE DARK
HP: ████████████ 2000
Phases: 3
- Phase 1: Огненное дыхание
- Phase 2: Призыв миньонов
- Phase 3: Берсерк режим (×2 speed)
```

**Награды:**
- 💎 Diamond Shards × 4
- 🏆 Achievement: "Dragonslayer"
- 🎊 GAME COMPLETED!
- 🔓 Unlock: Endless Mode + New Game+

---

## 🎮 ГЕЙМПЛЕЙ МЕХАНИКИ

### Базовые механики (как классическая змейка):
- ⬆️⬇️⬅️➡️ Управление (WASD / Arrows / Touch)
- 🍎 Ешь еду → растёшь
- ❌ Столкновение с собой / стеной = урон
- 📊 Счёт увеличивается

### RPG механики (новое!):

#### 💪 Progression System
```
Level 1: 0 XP
Level 2: 100 XP
Level 3: 250 XP
Level 4: 500 XP
Level 5: 1000 XP
...
Level 20: 10000 XP
```

#### ❤️ Health System
- Старт: 3 lives (❤️❤️❤️)
- Урон: -1 life
- 0 lives = Game Over
- Recovery: +1 life каждые 500 очков
- Max lives: 5

#### 🎯 Food Types
| Еда | Очки | XP | Спецэффект |
|-----|------|----|----|
| 🍎 Apple | +10 | +5 | Обычная еда |
| 💎 Gem | +50 | +25 | Редкая, мигает |
| 🍖 Meat | +15 | +10 | Speed boost 3s |
| ⚡ Lightning | +20 | +15 | Invincibility 2s |
| 🛡️ Shield | +0 | +5 | Щит на 1 удар |
| 💰 Gold | +5 | +0 | Валюта для апгрейдов |
| 🌟 Star | +100 | +50 | Секретная, 1 на уровень |

#### ⚔️ Враги (AI поведение)
| Враг | HP | Урон | Поведение |
|------|-------|------|-----------|
| 🐛 Caterpillar | 1 | 1 | Random walk |
| 🦂 Scorpion | 2 | 1 | Follows player |
| 🕷️ Spider | 3 | 1 | Ranged attack |
| 🦎 Lizard | 2 | 1 | Jump pattern |
| 🧞 Djinn | 5 | 2 | Teleport |
| ⛄ Golem | 10 | 2 | Projectiles |
| 🔥 Elemental | 5 | 2 | Immune to walls |

#### 🔨 Power-ups (разблокируются по мере прогресса)
1. **Sprint** (Level 5) - ускорение на 3s
2. **Shield** (Level 10) - блокировка урона
3. **Extra Life** (Level 15) - +1 постоянная жизнь
4. **Fire Resist** (Level 18) - иммунитет к лаве

#### 💰 Upgrade Shop (между уровнями)
Тратишь gold coins на:
- **Speed Up** - 100💰 - постоянно быстрее
- **Health Up** - 150💰 - +1 max health
- **Magnet** - 200💰 - еда притягивается
- **X-Ray** - 250💰 - видишь еду через стены
- **Ghost Mode** - 500💰 - можешь проходить через себя 1 раз

---

## 🎨 ВИЗУАЛЬНЫЙ СТИЛЬ

### Арт-стиль
- **Pixel Art** + **Neon Glow** эффекты
- Вдохновение: Hotline Miami + Hyper Light Drifter
- Цветовая палитра меняется по мирам:
  - 🌲 Лес: Зелёный + золотой
  - 🏜️ Пустыня: Оранжевый + жёлтый
  - ❄️ Льды: Синий + белый
  - 🌋 Огонь: Красный + чёрный
  - 🏰 Башня: Фиолетовый + тёмно-серый

### Анимации
- Плавное движение змейки (interpolation)
- Glow trails за головой
- Particle effects при поедании
- Explosion при смерти врагов
- Screen shake при ударах
- Slow-motion при level up

### UI Theme
```
┌─────────────────────────────────┐
│ ❤️❤️❤️  Level 12  XP: ▓▓▓▓░░  │
│ 💰 350   ⭐ 5/20   🛡️ Ready   │
│                                 │
│  [GAME ARENA]                   │
│                                 │
│ Quest: Defeat Ice Dragon 🐉     │
└─────────────────────────────────┘
```

---

## 💬 NARRATIVE ELEMENTS

### Cutscenes (между мирами)
**Format:** Pixel art slides + текстовые диалоги

**Пример - Intro:**
```
[SLIDE 1: Храм в руинах]
Narrator: "The temple lies in ruins..."

[SLIDE 2: Драко улетает с яблоком]
Narrator: "Draco has stolen the Apple!"

[SLIDE 3: Нага просыпается]
Owl: "Naga! You must save us!"
Naga: "I will not fail." 🐍⚔️

[FADE TO LEVEL 1]
```

### NPC Dialogs
Встречаются между уровнями:

**🦉 Wise Owl** (даёт подсказки):
- "The forest is treacherous, young serpent."
- "Collect the stars for special rewards!"

**👑 King Serpentus** (в катсценах):
- "Please, Naga, you're our only hope!"
- "The kingdom believes in you!"

**🧙 Old Wizard** (даёт квесты):
- "Bring me 10 gems, I'll give you power!"

### Quest System
**Side Quests** (опциональные):
1. "Collector" - собери все звёзды на уровне
2. "Speedrun" - пройди уровень за 60 секунд
3. "Pacifist" - не убивай врагов
4. "Explorer" - найди секретную комнату

**Награды за квесты:**
- Extra XP
- Rare items
- Cosmetic skins для змейки

---

## 🎵 AUDIO DESIGN

### Music Themes
- **Main Menu:** Epic orchestral
- **Forest:** Celtic flute + acoustic guitar
- **Desert:** Arabian instruments + drums
- **Ice:** Ambient + piano
- **Fire:** Heavy metal guitars
- **Tower:** Dark choir + organ
- **Boss Fights:** Intense battle music

### Sound Effects
- 🎵 Food eat - satisfying "nom"
- ⚔️ Enemy hit - impact sound
- 💥 Enemy death - explosion
- 🛡️ Shield block - metallic clang
- 📈 Level up - fanfare
- ⭐ Star collect - magical chime
- 🐉 Boss roar - deep growl

---

## 🏆 ACHIEVEMENTS SYSTEM

### Achievements List (50 total)
**Story:**
- ✅ "The Journey Begins" - Complete Level 1
- ✅ "Forest Hero" - Beat Forest Guardian
- ✅ "Desert Wanderer" - Survive the Desert
- ✅ "Ice Breaker" - Conquer the Ice
- ✅ "Hell Walker" - Cross the Fire
- ✅ "Dragonslayer" - Defeat Draco
- ✅ "True Ending" - Get secret ending

**Skill:**
- ✅ "No Hit Run" - Complete level without damage
- ✅ "Speedrunner" - Finish level in 30s
- ✅ "Pacifist" - Complete level without kills
- ✅ "Maximum Length" - Reach 50 body segments
- ✅ "Collector" - Collect all stars in world

**Misc:**
- ✅ "First Blood" - Kill first enemy
- ✅ "Rich Snake" - Collect 1000 gold
- ✅ "Shopaholic" - Buy all upgrades
- ✅ "Explorer" - Find all secret rooms

---

## 📊 PROGRESSION META

### Daily Challenges
Каждый день новый челлендж:
- "Survive 5 minutes in Endless Mode"
- "Complete Desert world without upgrades"
- "Collect 20 gems in one run"

**Reward:** Эксклюзивные скины

### Leaderboards
- Story Mode - fastest completion
- Endless Mode - highest score
- Boss Rush - best time
- Daily Challenge rankings

### Unlockables
**Skins для змейки:**
- 🐍 Classic (default)
- 🌈 Rainbow (beat game)
- 👑 Royal (collect all stars)
- 🔥 Inferno (beat hard mode)
- ⚡ Lightning (speedrun achievement)
- 💎 Diamond (secret ending)

**Game Modes:**
- 🎮 Story Mode (default)
- ♾️ Endless Mode (unlock at level 10)
- ⚔️ Boss Rush (beat story)
- 🌟 Hard Mode (New Game+)
- 👥 Co-op Mode (future DLC?)

---

## 🔮 FUTURE EXPANSIONS

### DLC Ideas:
1. **"The Frozen Wastes"** - 5 новых уровней в Арктике
2. **"Underworld Descent"** - Ад с новыми врагами
3. **"Sky Temples"** - Летающие острова
4. **"Multiplayer Arena"** - PvP snake battle

### Features Roadmap:
- [ ] Mobile app version
- [ ] Achievement system
- [ ] Cloud save
- [ ] Replay system
- [ ] Level editor (community levels!)
- [ ] Mod support

---

## 💾 TECHNICAL SPECS

### Technology Stack:
- **Frontend:** React + TypeScript + Canvas API
- **Backend:** FastAPI + SQLite
- **Audio:** Web Audio API
- **Graphics:** Custom pixel art + particle system
- **Storage:** LocalStorage + Backend DB

### Performance Targets:
- 60 FPS gameplay
- <2s level load time
- <500ms input lag
- Works offline (PWA)

---

## 🎯 SUCCESS METRICS

### Player Engagement:
- Average session: 15-30 minutes
- Completion rate: 40%+ finish story
- Daily return rate: 30%+
- Social shares: Achievements unlocked

### Quality Targets:
- Bug-free launch
- Smooth 60 FPS
- No game-breaking exploits
- Balanced difficulty curve

---

## 📝 DEVELOPMENT PHASES

### Phase 1: MVP (2-3 weeks)
- [x] Basic snake mechanics
- [ ] Level 1-5 (Forest world)
- [ ] Health system
- [ ] Basic enemies
- [ ] First boss

### Phase 2: Core Game (4-6 weeks)
- [ ] All 20 levels
- [ ] All 5 bosses
- [ ] Full progression system
- [ ] Upgrade shop
- [ ] Achievement system

### Phase 3: Polish (2-3 weeks)
- [ ] Cutscenes + story
- [ ] Sound effects + music
- [ ] Visual effects polish
- [ ] Bug fixes
- [ ] Balancing

### Phase 4: Launch (1 week)
- [ ] Marketing materials
- [ ] Deploy to production
- [ ] Social media campaign
- [ ] Press release

---

**STATUS: 🟡 IN CONCEPT PHASE**

*This is going to be EPIC!* 🐍⚔️🏆

---

*Last updated: 2025-12-09*
