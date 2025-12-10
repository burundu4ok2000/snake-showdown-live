import { allLevels } from './data/levels';
import { LevelSystem } from './systems/LevelSystem';

const testLevel = allLevels[0]; // Level 1
const currentLevel = LevelSystem.loadLevel(testLevel);

console.log('Level 1 objectives:');
currentLevel.data.objectives.forEach(obj => {
    console.log(`- ${obj.description}: completed = ${obj.completed}`);
});

console.log(`\nisLevelCompleted: ${LevelSystem.isLevelCompleted(currentLevel)}`);
console.log(`every check: ${currentLevel.data.objectives.every(obj => obj.completed)}`);
