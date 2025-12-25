// gamePlay.js - Clean, unified level system (no autoscroll!)
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { getLevel } from '../config/levels.js';
import { 
  setupLevelMusic,
  addLevelEnvironment,
  addUIBackgrounds,
  addVictoryArea,
  addCups,
  addSpecialItems,
  addLaserBeams,
  createPlayer,
  setupPlayerControls,
  createUnifiedHUD,
  updateUnifiedHUD,
  setupVictoryCollision,
  setupCupCollection,
  setupSpecialItemCollection,
  setupTimer,
  setupFallDetection,
  setupCucumberSpawner,
  setupCucumberCollision,
  setupRatSpawner,
  setupRatCollision,
  setupLaserCollision,
  setupPlayerCamera,
  setupLevelPause, 
  setupOneWayPlatforms
} from '../helpers/levelHelpers.js';
import { createVolumeToggle } from '../utils/audioControls.js';


function createUnifiedLevel(levelId, data) {
  const character = data?.character || data;
  const startHP = data?.playerHP || data?.startHP;
  const startLives = data?.lives ?? 3;
  
  const levelConfig = getLevel(levelId);
  console.log(`🎮 ${levelConfig.name.toUpperCase()} INITIATED`);
  console.log('❤️ Starting HP:', startHP || levelConfig.playerHP.start);
  console.log('💙 Starting Lives:', startLives);

  onKeyPress("d", () => {
    debug.inspect = !debug.inspect;
    debug.showArea = !debug.showArea;
  });

  setGravity(1600);
  setupLevelMusic(levelConfig);

  const { bg } = addLevelEnvironment(levelConfig);
  addUIBackgrounds();
  addVictoryArea(levelConfig);
  
  addCups(levelConfig);
  addSpecialItems(levelConfig);
  
  addLaserBeams(levelConfig);

  const player = createPlayer(levelConfig, character, startHP || levelConfig.playerHP.start);
  setupOneWayPlatforms(player);

  let score = 0;
  let timeLeft = levelConfig.timeLimit;
  let gameActive = true;
  let lives = startLives;

  const getGameActive = () => gameActive;
  const setGameActive = (val) => { gameActive = val; };
  const getScore = () => score;
  const setScore = (val) => { score = val; };
  const getTimeLeft = () => timeLeft;
  const setTimeLeft = (val) => { timeLeft = val; };
  const getLives = () => lives;
  const setLives = (val) => { lives = val; };
  const getCharacter = () => character;

  setupPlayerControls(player, getGameActive);

  setupVictoryCollision(player, levelId, levelConfig.nextBoss, character, getGameActive, setGameActive, getScore, levelConfig, levelConfig.bossSprite);  setupCupCollection(player, getScore, setScore);
  setupSpecialItemCollection(player, getLives, setLives, getScore, setScore);
  
  setupCucumberSpawner(levelConfig, getGameActive);
  setupCucumberCollision(player, levelConfig, getGameActive, setGameActive, levelId, getScore, getLives, setLives, getCharacter);
  
  setupRatSpawner(levelConfig, getGameActive, player);
  setupRatCollision(player, levelConfig, getGameActive, setGameActive, levelId, getScore, setScore, getLives, setLives, getCharacter);
  
  setupLaserCollision(player, levelConfig, getGameActive, setGameActive, levelId, getScore, getLives, setLives, getCharacter);

  setupTimer(levelConfig, getGameActive, setGameActive, getTimeLeft, setTimeLeft, levelId, getScore, getLives, setLives, getCharacter);
  setupFallDetection(player, getGameActive, setGameActive, levelId, getScore, getLives, setLives, getCharacter);
  
  const hudElements = createUnifiedHUD(player);
  
  setupLevelPause(getGameActive, setGameActive);
  
  setupPlayerCamera(player, character, bg, getGameActive);

  onUpdate(() => {
    if (gameActive) {
      updateUnifiedHUD(hudElements, score, timeLeft, player, lives);
    }
  });

  createVolumeToggle();
}


export function createLevel1Scene(data) {
  createUnifiedLevel('level1', data);
}


export function createLevel2Scene(data) {
  createUnifiedLevel('level2', data);
}


export function createLevel3Scene(data) {
  createUnifiedLevel('level3', data);
}


export function createLevel4Scene(data) {
  createUnifiedLevel('level4', data);
}


export function createLevel5Scene(data) {
  const character = data?.character || data;
  const startHP = data?.playerHP || data?.startHP;
  const startLives = data?.lives || 3;
  
  const levelConfig = getLevel('level5');
  console.log('🎮 LEVEL 5 - FINAL GAUNTLET');
  console.log('❤️ Starting HP:', startHP || levelConfig.playerHP.start);
  console.log('💙 Starting Lives:', startLives);

  onKeyPress("d", () => {
    debug.inspect = !debug.inspect;
    debug.showArea = !debug.showArea;
  });

  setGravity(1600);
  setupLevelMusic(levelConfig);

  const { bg } = addLevelEnvironment(levelConfig);
  addUIBackgrounds();
  addVictoryArea(levelConfig);
  
  addCups(levelConfig);
  addSpecialItems(levelConfig);
  addLaserBeams(levelConfig);
  
  const player = createPlayer(levelConfig, character, startHP || levelConfig.playerHP.start);
  setupOneWayPlatforms(player);


  let score = 0;
  let timeLeft = levelConfig.timeLimit;
  let gameActive = true;
  let lives = startLives;

  const getGameActive = () => gameActive;
  const setGameActive = (val) => { gameActive = val; };
  const getScore = () => score;
  const setScore = (val) => { score = val; };
  const getTimeLeft = () => timeLeft;
  const setTimeLeft = (val) => { timeLeft = val; };
  const getLives = () => lives;
  const setLives = (val) => { lives = val; };
  const getCharacter = () => character;

  setupPlayerControls(player, getGameActive);
  setupCupCollection(player, getScore, setScore);
  setupSpecialItemCollection(player, getLives, setLives, getScore, setScore);
  
  setupCucumberSpawner(levelConfig, getGameActive);
  setupCucumberCollision(player, levelConfig, getGameActive, setGameActive, 'level5', getScore, getLives, setLives, getCharacter);
  
  setupRatSpawner(levelConfig, getGameActive, player);
  setupRatCollision(player, levelConfig, getGameActive, setGameActive, 'level5', getScore, setScore, getLives, setLives, getCharacter);  
  setupLaserCollision(player, levelConfig, getGameActive, setGameActive, 'level5', getScore, getLives, setLives, getCharacter);
  
  player.onCollide("victoryPlatform", (platform) => {
    if (player.vel.y >= 0 && getGameActive()) {
      console.log('🏆 LEVEL 5 COMPLETE! Heading to final boss...');
      setGameActive(false);
      
      wait(0.5, () => {
        go("transition", "Transition6", character, player.hp);
      });
    }
  });

  setupTimer(levelConfig, getGameActive, setGameActive, getTimeLeft, setTimeLeft, 'level5', getScore, getLives, setLives, getCharacter);
  setupFallDetection(player, getGameActive, setGameActive, 'level5', getScore, getLives, setLives, getCharacter);
  
  const hudElements = createUnifiedHUD(player);
  setupLevelPause(getGameActive, setGameActive);
  setupPlayerCamera(player, character, bg, getGameActive);

  onUpdate(() => {
    if (gameActive) {
      updateUnifiedHUD(hudElements, score, timeLeft, player, lives);
    }
  });

  createVolumeToggle();
}