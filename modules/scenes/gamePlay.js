// gamePlay.js
import { getLevel } from '../config/levels.js';
import { 
  setupLevelMusic,
  addLevelEnvironment,
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
  setupOneWayPlatforms,
  setupSequentialPlatforms,
  setupSequentialPlatformActivation,
  addMiniBoss,
  setupMiniBossReflect,
  spawnRewardItems,
  hideHUD,
  showHUD,
  setupParticleSystem
} from '../helpers/levelHelpers.js';
import { 
  addDoorsToLevel, 
  setupDoorInteraction 
} from '../helpers/roomHelper.js';
import { 
  applyUpgradesToPlayer,
  getUpgrades 
} from '../helpers/upgradeHelper.js';
import { getRoom } from '../config/challengeRoom.js';
import { setupMobilePlayerControls, setupTouchEvents, setupMobileDoorInteraction, showJoystickControls, hideJoystickControls } from '../helpers/mobileControls.js';
//import { stopAllMusic, ensureMusicLoaded, setLevelBackground, hideLevelBackgrounds } from '../helpers/kittyHelpers.js'; // PLANNING TO REVISIT CSS BACKGROUNDS LATER
import { stopAllMusic, ensureMusicLoaded } from '../helpers/kittyHelpers.js';


function createUnifiedLevel(levelId, data) {
  //setLevelBackground(levelId); // PLANNING TO REVISIT LATER
  showHUD();
  const character = data?.character || data;
  const startHP = data?.startHP;
  const startLives = data?.lives ?? 3;
  const startScore = data?.score ?? 0;
  const startTime = data?.timeLeft ?? 90;
  
  const spawnX = data?.returnX;
  const spawnY = data?.returnY;
  
  const levelConfig = getLevel(levelId);
  console.log(`ðŸŽ® ${levelConfig.name.toUpperCase()} INITIATED`);
  console.log('â¤ï¸ Starting HP:', startHP);
  console.log('ðŸ’™ Starting Lives:', startLives);
  console.log('ðŸ’° Starting Score:', startScore);
  
  const currentUpgrades = getUpgrades();
  console.log('ðŸ“Š Current Upgrades:', currentUpgrades);

  // MOBILE vs  DESKTOP CONTROLS
  const mobileSetup = window.mobileSetup;

  let logTimer = 0;
  onUpdate(() => {
    logTimer += dt();
    if (logTimer >= 3) {
      console.log('=== OBJECTS IN SCENE ===', {
        rats: get("rat")?.length || 0,
        cucumbers: get("cucumber")?.length || 0,
        lasers: get("laser")?.length || 0,
        cups: get("cup")?.length || 0,
        totalObjects: get("*")?.length || 0
      });
      
      if (window.debugCounts) {
        console.log('=== UPDATE COUNTS (last 3s) ===', window.debugCounts);
        window.debugCounts = { rats: 0, cucumbers: 0, lasers: 0, player: 0, cups: 0 };
      }
      
      logTimer = 0;
    }
  });

  onKeyPress("d", () => {
    debug.inspect = !debug.inspect;
    debug.showArea = !debug.showArea;
  });

  setGravity(1500);
  setupLevelMusic(levelConfig);

  const { bg } = addLevelEnvironment(levelConfig);
  addVictoryArea(levelConfig);
  
  addCups(levelConfig);
  addSpecialItems(levelConfig);
  addLaserBeams(levelConfig);

  const player = createPlayer(levelConfig, character, startHP);
  setupParticleSystem(player); 
  
  applyUpgradesToPlayer(player);
  
  if (spawnX !== undefined && spawnY !== undefined) {
    player.pos = vec2(spawnX, spawnY);
    console.log(`ðŸšª Spawning at challenge room exit: (${spawnX}, ${spawnY})`);
  }
  
  setupOneWayPlatforms(player);

  const sequentialPlatforms = setupSequentialPlatforms(levelConfig);
  setupSequentialPlatformActivation(player, sequentialPlatforms);

  let score = startScore; 
  let timeLeft = startTime;
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

  const { doorsIn, doorsOut } = addDoorsToLevel(levelConfig);

  // MOBILE vs DESKTOP CONTROLS
  if (mobileSetup && mobileSetup.isMobile) {
    // MOBILE CONTROLS
    setupMobilePlayerControls(player, getGameActive, mobileSetup.mobileState);
    setupTouchEvents(mobileSetup.controls, mobileSetup.mobileState, document.getElementById("gameCanvas"));
    console.log('ðŸ"± About to show joystick controls...');
    setTimeout(() => showJoystickControls(), 100);
    if (doorsIn.length > 0 && levelConfig.challengeDoorIN) {
      const doorData = doorsIn.map((doorObj, index) => ({
        doorObj: doorObj,
        doorConfig: levelConfig.challengeDoorIN[index]
      }));
      
      setupMobileDoorInteraction(player, doorData, levelConfig, levelId, () => ({
        character: getCharacter(),
        lives: getLives(),
        score: getScore(),
        timeLeft: getTimeLeft()
      }), mobileSetup.mobileState);
    }
  } else {
    //DESKTOP CONTROLS
    setupPlayerControls(player, getGameActive);

    if (doorsIn.length > 0 && levelConfig.challengeDoorIN) {
      const doorData = doorsIn.map((doorObj, index) => ({
        doorObj: doorObj,
        doorConfig: levelConfig.challengeDoorIN[index]
      }));
      
      setupDoorInteraction(player, doorData, levelConfig, levelId, () => ({
        character: getCharacter(),
        lives: getLives(),
        score: getScore(),
        timeLeft: getTimeLeft()  
      }));
    }
  }

  setupVictoryCollision(player, levelId, levelConfig.nextBoss, character, getGameActive, setGameActive, getScore, levelConfig, levelConfig.bossSprite, getLives);   
  setupCupCollection(player, getScore, setScore);
  setupSpecialItemCollection(player, getLives, setLives, getScore, setScore);
  
  setupCucumberSpawner(levelConfig, getGameActive);
  setupCucumberCollision(player, levelConfig, getGameActive, setGameActive, levelId, getScore, getLives, setLives, getCharacter, startScore);  
    
  setupRatSpawner(levelConfig, getGameActive, player);
  setupRatCollision(player, levelConfig, getGameActive, setGameActive, levelId, getScore, setScore, getLives, setLives, getCharacter, startScore);  
    
  setupLaserCollision(player, levelConfig, getGameActive, setGameActive, levelId, getScore, getLives, setLives, getCharacter, startScore);  

  setupTimer(levelConfig, getGameActive, setGameActive, getTimeLeft, setTimeLeft, levelId, getScore, getLives, setLives, getCharacter, startScore);  
  setupFallDetection(player, getGameActive, setGameActive, levelId, getScore, getLives, setLives, getCharacter, startScore); 
  
  const hudElements = createUnifiedHUD(player);
  
  setupLevelPause(getGameActive, setGameActive);
  
  setupPlayerCamera(player, character, bg, getGameActive);

  let hudUpdateCounter = 0;
  onUpdate(() => {
    if (gameActive) {
      hudUpdateCounter++;
      if (hudUpdateCounter % 5 === 0) {
        if (window.debugCounts) window.debugCounts.hud++;
        
        // ==================== UPDATE HUD ====================
        updateUnifiedHUD(hudElements, score, timeLeft, player, lives);
        // ===========================================================================
      }
    }
  });

  onSceneLeave(() => {
    hideHUD();
    //hideLevelBackgrounds();  // PLANNING TO REVISIT LATER
  });
}


export async function createLevel1Scene(data) {
  await ensureMusicLoaded("PlatformerTrack1", "assets/sounds/tracks/level1.m4a");
  createUnifiedLevel('level1', data);
}

export async function createLevel2Scene(data) {
  await ensureMusicLoaded("PlatformerTrack2", "assets/sounds/tracks/level2.m4a");
  createUnifiedLevel('level2', data);
}

export async function createLevel3Scene(data) {
  await ensureMusicLoaded("PlatformerTrack3", "assets/sounds/tracks/level3.m4a");
  createUnifiedLevel('level3', data);
}

export async function createLevel4Scene(data) {
  await ensureMusicLoaded("PlatformerTrack4", "assets/sounds/tracks/level4.m4a");
  createUnifiedLevel('level4', data);
}


export async function createLevel5Scene(data) {
  await ensureMusicLoaded("PlatformerTrack5", "assets/sounds/tracks/level5.m4a");
  //setLevelBackground('level5'); // PLANNING TO REVISIT LATER
  showHUD();
  const character = data?.character || data;
  const startHP = data?.startHP;
  const startLives = data?.lives ?? 3;
  const startScore = data?.score ?? 0;
  const startTime = data?.timeLeft ?? 90; 
  
  const spawnX = data?.returnX;
  const spawnY = data?.returnY;
  
  const levelConfig = getLevel('level5');
  console.log('ðŸŽ® LEVEL 5 - FINAL GAUNTLET');
  console.log('â¤ï¸ Starting HP:', startHP);
  console.log('ðŸ’™ Starting Lives:', startLives);
  
  const currentUpgrades = getUpgrades();
  console.log('ðŸ“Š Current Upgrades:', currentUpgrades);

  // MOBILE vs  DESKTOP CONTROLS
  const mobileSetup = window.mobileSetup;

  let logTimer = 0;
  onUpdate(() => {
    logTimer += dt();
    if (logTimer >= 3) {
      console.log('=== LEVEL 5 OBJECTS ===', {
        rats: get("rat")?.length || 0,
        cucumbers: get("cucumber")?.length || 0,
        lasers: get("laser")?.length || 0,
        miniBoss: get("miniBoss")?.length || 0,
        totalObjects: get("*")?.length || 0
      });
      
      if (window.debugCounts) {
        console.log('=== UPDATE COUNTS (last 3s) ===', window.debugCounts);
        window.debugCounts = { rats: 0, cucumbers: 0, lasers: 0, player: 0, cups: 0 };
      }
      
      logTimer = 0;
    }
  });

  onKeyPress("d", () => {
    debug.inspect = !debug.inspect;
    debug.showArea = !debug.showArea;
  });

  setGravity(1500);
  setupLevelMusic(levelConfig);

  const { bg } = addLevelEnvironment(levelConfig);
  addVictoryArea(levelConfig);
  
  addCups(levelConfig);
  addSpecialItems(levelConfig);
  addLaserBeams(levelConfig);
  
  const player = createPlayer(levelConfig, character, startHP);
  setupParticleSystem(player); 
  
  applyUpgradesToPlayer(player);
  
  if (spawnX !== undefined && spawnY !== undefined) {
    player.pos = vec2(spawnX, spawnY);
    console.log(`ðŸšª Spawning at challenge room exit: (${spawnX}, ${spawnY})`);
  }
  
  setupOneWayPlatforms(player);

  const miniBoss = addMiniBoss(levelConfig, () => gameActive, player);

  let score = startScore;
  let timeLeft = startTime;
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

  const { doorsIn, doorsOut } = addDoorsToLevel(levelConfig);

  // MOBILE vs DESKTOP CONTROLS
  if (mobileSetup && mobileSetup.isMobile) {
    // MOBILE CONTROLS
    setupMobilePlayerControls(player, getGameActive, mobileSetup.mobileState);
    setupTouchEvents(mobileSetup.controls, mobileSetup.mobileState, document.getElementById("gameCanvas"));
    setTimeout(() => showJoystickControls(), 100); 
    
    if (doorsIn.length > 0 && levelConfig.challengeDoorIN) {
      const doorData = doorsIn.map((doorObj, index) => ({
        doorObj: doorObj,
        doorConfig: levelConfig.challengeDoorIN[index]
      }));
      
      setupMobileDoorInteraction(player, doorData, levelConfig, 'level5', () => ({
        character: getCharacter(),
        lives: getLives(),
        score: getScore(),
        timeLeft: getTimeLeft()
      }), mobileSetup.mobileState);
    }
  } else {
    // DESKTOP CONTROLS
    setupPlayerControls(player, getGameActive);

    if (doorsIn.length > 0 && levelConfig.challengeDoorIN) {
      const doorData = doorsIn.map((doorObj, index) => ({
        doorObj: doorObj,
        doorConfig: levelConfig.challengeDoorIN[index]
      }));
      
      setupDoorInteraction(player, doorData, levelConfig, 'level5', () => ({
        character: getCharacter(),
        lives: getLives(),
        score: getScore(),
        timeLeft: getTimeLeft()  
      }));
    }
  }
  
  setupCupCollection(player, getScore, setScore);
  setupSpecialItemCollection(player, getLives, setLives, getScore, setScore);
  
  setupMiniBossReflect(player, miniBoss, () => {
    spawnRewardItems(levelConfig.rewardItems);
  });
  
  setupCucumberSpawner(levelConfig, getGameActive);
  setupCucumberCollision(player, levelConfig, getGameActive, setGameActive, 'level5', getScore, getLives, setLives, getCharacter, startScore);
  
  setupRatSpawner(levelConfig, getGameActive, player);
  setupRatCollision(player, levelConfig, getGameActive, setGameActive, 'level5', getScore, setScore, getLives, setLives, getCharacter, startScore);  
  setupLaserCollision(player, levelConfig, getGameActive, setGameActive, 'level5', getScore, getLives, setLives, getCharacter, startScore);
  
  player.onCollide("victoryPlatform", (platform) => {
    if (player.vel.y >= 0 && getGameActive()) {
      console.log('ðŸ† LEVEL 5 COMPLETE! Heading to final boss...');
      setGameActive(false);
      
      wait(0.5, () => {
        go("transition", "Transition6", character, player.hp, getLives(), getScore());
      });
    }
  });

  setupTimer(levelConfig, getGameActive, setGameActive, getTimeLeft, setTimeLeft, 'level5', getScore, getLives, setLives, getCharacter, startScore);
  setupFallDetection(player, getGameActive, setGameActive, 'level5', getScore, getLives, setLives, getCharacter, startScore);
  
  const hudElements = createUnifiedHUD(player);
  setupLevelPause(getGameActive, setGameActive);
  setupPlayerCamera(player, character, bg, getGameActive);

  let hudUpdateCounter = 0;
  onUpdate(() => {
    if (gameActive) {
      hudUpdateCounter++;
      if (hudUpdateCounter % 5 === 0) {
        if (window.debugCounts) window.debugCounts.hud++;
        
// ==================== UPDATE HUD ====================
        updateUnifiedHUD(hudElements, score, timeLeft, player, lives);
      }
    }
  });

  onSceneLeave(() => {
    hideHUD();
    //hideLevelBackgrounds();  // PLANNING TO REVISIT LATER
  });
}