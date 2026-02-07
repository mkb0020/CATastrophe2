import kaplay from "kaplay";
import { SCREEN_W, SCREEN_H, Colors, BUBBLE_FRAMES, updateScreenDimensions } from './config/gameConfig.js';
import {   initializeMobileControls, 
  MobileHUDController, 
  detectMobile, showJoystickControls } from './helpers/mobileControls.js';
import { getCharacterList, SPRITE_FRAMES, RAINBOW_CAT_FRAMES } from './config/characters.js';
import { getLevel } from './config/levels.js';
import { getBoss } from './config/bosses.js';
import { stopAllMusic, startMenuMusic, initializeAllUIHelpers  } from './helpers/kittyHelpers.js';
import { createStartScene, createMainMenuScene, createCharSelectScene } from './scenes/mainMenu.js';
import { createTransitionScene } from './scenes/transitionScene.js';
import { createLevel1Scene, createLevel2Scene, createLevel3Scene, createLevel4Scene, createLevel5Scene } from './scenes/gamePlay.js';
import { 
  createLaserPointerBossScene,
  createCupBossScene, 
  createCucumberBossScene, 
  createRatKingBossScene,         
  createObserverBossScene 
} from './scenes/bossScene.js';
import {  
  createYouDiedScene,  
  createVictoryScene, 
  createLevelCompleteScene,
  createBossDefeatedScene,
  createGameOverScene,
} from './scenes/gameOver.js';
import { initDebugTools } from './helpers/debugTools.js';
import { createChallengeRoomScene } from './scenes/challengeRoomScene.js';

console.log('🎮 CATastrophe 2 - Kaplay Edition Loading...');

// ======================================== RESPONSIVE CANVAS SETUP ========================================
function getCanvasSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

// ======================================== INITIALIZE KAPLAY ========================================
const canvasSize = getCanvasSize();

updateScreenDimensions(canvasSize.width, canvasSize.height);
const scale = 2;
const k = kaplay({
  width: (SCREEN_W / 2) * scale,   
  height: (SCREEN_H / 2) * scale,  
  scale,
  letterbox: true,  
  background: [11, 11, 27, 0],
  global: false, 
  canvas: document.getElementById("gameCanvas"),
  debug: true,
  stretch: true,  
  crisp: true     
});

window.k = k;
Object.assign(window, k);

console.log('✅ Kaplay initialized!');
console.log(`📐 Canvas size: ${canvasSize.width}x${canvasSize.height}`);
console.log(`📐 Virtual size: ${SCREEN_W}x${SCREEN_H}`);

initDebugTools(k);

// ======================================== HANDLE WINDOW RESIZE ========================================
window.addEventListener('resize', () => {
  const newSize = getCanvasSize();
  console.log(`📐 Resizing canvas to: ${newSize.width}x${newSize.height}`);
  
  updateScreenDimensions(newSize.width, newSize.height);
    const canvas = document.getElementById("gameCanvas");
  if (canvas) {
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
  }
});


// ==================== MOBILE INITIALIZATION ====================

const mobileSetup = initializeMobileControls(document.getElementById("gameCanvas"));
window.mobileSetup = mobileSetup;


const mobileHUD = new MobileHUDController();
window.mobileHUD = mobileHUD; 

if (mobileSetup.isMobile) {
  console.log('📱 Mobile controls enabled');
  mobileHUD.setupVolumeButton(() => {
    const currentVolume = volume();
    const newVolume = currentVolume > 0 ? 0 : 0.5;
    volume(newVolume);
    return newVolume === 0; 
  });

  mobileHUD.setupPauseButton(() => {
    if (window.gamePauseSystem) {
      window.gamePauseSystem.pause();
    }
  });
}



loadFont("narrow", "assets/fonts/PTSansNarrow-Regular.ttf");
loadFont("narrowBold", "assets/fonts/PTSansNarrow-Bold.ttf");
loadFont("orbitron", "assets/fonts/Orbitron-Regular.ttf");
loadFont("orbitronBold", "assets/fonts/Orbitron-Bold.ttf");
loadFont("science", "assets/fonts/ScienceGothic.ttf");

// ======================================== LOAD  GAME ASSETS ========================================
async function loadAssets() {
  console.log('📦 Loading game assets...');
  //MUSIC 
  loadSound("menuMusic", "assets/sounds/tracks/mainMenu.m4a"); 
  loadSound("GameOverTrack", "assets/sounds/tracks/GameOverTrack.m4a")
  loadSound("finalVictory", "assets/sounds/tracks/endCredits.m4a");
  //FX SOUNDS
  loadSound("door", "assets/sounds/fx/doorOpen.m4a");
  loadSound("pour", "assets/sounds/fx/coffeePour.m4a");
  loadSound("shop", "assets/sounds/fx/coffeeShop.m4a");
  loadSound("collectCup", "assets/sounds/fx/collectCup.m4a");
  loadSound("powerUp", "assets/sounds/fx/HappyMeow.m4a");
  loadSound("extraLife", "assets/sounds/fx/exrtraLife.m4a");
  loadSound("flip", "assets/sounds/fx/flip.m4a");
  loadSound("ratKill", "assets/sounds/fx/ratKill.m4a");
  loadSound("takeHit", "assets/sounds/fx/takehit.m4a");
  loadSound("laserHit", "assets/sounds/fx/laserHit.m4a");
  loadSound("gameOverSound", "assets/sounds/fx/gameOverSound.m4a");
  loadSound("VictorySound", "assets/sounds/fx/VictorySound.m4a");
  loadSound("lightning", "assets/sounds/fx/Lightning.m4a");
  loadSound("bossLand", "assets/sounds/fx/bossLand.m4a");
  loadSound("egg", "assets/sounds/fx/egg.m4a");
  loadSound("miniBossDie", "assets/sounds/fx/miniBossDie.m4a");
  loadSound("throw", "assets/sounds/fx/throw.m4a");
  loadSound("reflect", "assets/sounds/fx/reflect.m4a");
  loadSound("newMove", "assets/sounds/fx/newMove.m4a");
  loadSound("crumble", "assets/sounds/fx/crumble.m4a");
  loadSound("upgrade", "assets/sounds/fx/upgrade.m4a");
  // MEOWS
  loadSound("happyMeow", "assets/sounds/fx/meow06.m4a");
  loadSound("meow00", "assets/sounds/fx/meow00.m4a");
  loadSound("meow01", "assets/sounds/fx/meow01.m4a");
  loadSound("meow02", "assets/sounds/fx/meow05.m4a"); 
// SPECIAL MOVE SOUNDS
  loadSound("cupFinishHim", "assets/sounds/fx/cup.m4a");
  loadSound("cucumberFinishHim", "assets/sounds/fx/cucumber.m4a");
  loadSound("ratFinishHim", "assets/sounds/fx/rat.m4a");
  loadSound("laserFinishHim", "assets/sounds/fx/laser.m4a");
  loadSound("finalFinishHim", "assets/sounds/fx/finalBoom.m4a");
  loadSound("finalFinishHim2", "assets/sounds/fx/finalBossEnd.m4a");
  loadSound("atmosphere", "assets/sounds/fx/atmosphere.m4a");
  loadSound("finalMovePowerUp", "assets/sounds/fx/finalMovePowerUp.m4a");
  loadSound("finalMoveZap", "assets/sounds/fx/finalMoveZap.m4a");

// ======================================== SPRITES ========================================


  loadSprite("realNona", "assets/images/realNona.PNG");
  loadSprite("title", "assets/images/title.PNG");
  loadSprite("bubbles", "assets/images/items/bubbles.png", {
    sliceX: 11,
    sliceY: 1
  });
  // BACKGRUNDS
  loadSprite("startBG", "assets/images/backgrounds/StartBG.png");
  loadSprite("menuBG", "assets/images/backgrounds/MenuBG3.png");
  loadSprite("SelectBG", "assets/images/backgrounds/Select.png");
  loadSprite("transitionBG", "assets/images/backgrounds/transitionBG.png");
  loadSprite("transitionBG2", "assets/images/backgrounds/transitionBG2.png");
  loadSprite("transitionBG3", "assets/images/backgrounds/transitionBG3.png");
  loadSprite("transitionBG4", "assets/images/backgrounds/transitionBG4.png");
  loadSprite("transitionBG5", "assets/images/backgrounds/transitionBG5.png");
  loadSprite("transitionBG6", "assets/images/backgrounds/transitionBG6.png");
  loadSprite("transitionBG7", "assets/images/backgrounds/TransitionBG7.png");
  loadSprite("observerIntro", "assets/images/backgrounds/ObserverIntro.png");
  loadSprite("battleBG1", "assets/images/backgrounds/BattleBG1.png");
  loadSprite("cafe", "assets/images/backgrounds/Cafe.png"); // FOR FINAL VICTORY
  loadSprite("groundPlatform", "assets/images/backgrounds/ground.png");
  loadSprite("platform", "assets/images/backgrounds/platform.png");
  loadSprite("window", "assets/images/items/window.png", {
    sliceX: 2, // FRAME 1 IS WINDOW SHUT.  FRAM 2 IS WINDOW OPEN.  EACH FRAME IS 200x150 SO NO SCALING SHOULD BE NEEDED
    sliceY: 1
  });
  // ENEMIES
  loadSprite("cup", "assets/images/enemies/Cup.png");
  loadSprite("littleCucumber", "assets/images/animationSprites/LittleCucumber.PNG");
  loadSprite("smallRat", "assets/images/enemies/smallRat2.png");
  loadSprite("smallRat2", "assets/images/enemies/smallRat2.png");
  loadSprite("ghostRat", "assets/images/animationSprites/GhostRat.PNG");
  loadSprite("miniBossRat", "assets/images/animationSprites/bigRatAnimate.png", {
    sliceX: 7,
    sliceY: 1
  });
  loadSprite("bossLaserPointer", "assets/images/enemies/BossLaserPointer.png");
  loadSprite("bossCup", "assets/images/enemies/BossCup.png");
  loadSprite("bossRat", "assets/images/enemies/BossRatKing.png");
  loadSprite("bossCucumber", "assets/images/enemies/BossCucumber.png");
  loadSprite("bossRat", "assets/images/enemies/BossRatKing.png");
  loadSprite("observer", "assets/images/enemies/Observer.png");
  // ITEMS
  loadSprite("catTower", "assets/images/items/CatTower.png");
  loadSprite("arrow", "assets/images/items/Arrow.png");
  loadSprite("catnip", "assets/images/items/Catnip.PNG");
  loadSprite("fish", "assets/images/items/FishBones.png");
  loadSprite("tunaCan", "assets/images/items/TunaCan.PNG");
  loadSprite("milkBottle", "assets/images/items/MilkBottle.png");
  loadSprite("egg", "assets/images/items/egg.png"); // BUNUS HP ITEM
  loadSprite("catnip", "assets/images/items/Catnip.PNG");
  loadSprite("yeet", "assets/images/items/yeet.png");
  loadSprite("statsUpgrade", "assets/images/animationSprites/statsUpgrade.png", { sliceX:8, sliceY:1, anims:{pulse:{from:0,to:7, loop: true, speed:5}} });
  loadSprite("moveUpgrade", "assets/images/animationSprites/moveUpgrade.png", { sliceX:33, sliceY:1, anims:{pulse:{from:0,to:32, loop: true, speed:5}} });
  // SCENES
  loadSprite("drip", "assets/images/animationSprites/drip.png", { 
    sliceX: 14, 
    sliceY: 1, 
    anims: { drip: { from: 0, to: 13 } } 
});
  loadSprite("lightning", "assets/images/animationSprites/Lightning.png", { sliceX:6, sliceY:1, anims:{glitch:{from:0,to:5}} });
  loadSprite("smokeClear", "assets/images/animationSprites/smokeClear.png", { sliceX:18, sliceY:1, anims:{puff:{from:0,to:17, loop: false, speed:10}} });
  loadSprite("levelShiftStart", "assets/images/animationSprites/glitchTransition.png", { 
    sliceX: 55, 
    sliceY: 1, 
    anims: {
      glitch: { from: 0, to: 16, loop: false, speed: 50 }
    } 
  });
  loadSprite("levelShiftEnd", "assets/images/animationSprites/glitchTransition.png", { 
    sliceX: 55, 
    sliceY: 1, 
    anims: {
      glitch: { from: 32, to: 54, loop: false, speed: 50 }
    } 
  });
  loadSprite("cafeDay", "assets/images/backgrounds/cafeDay.png", { 
    sliceX: 2, 
    sliceY: 1, 
    anims: { fade: { from: 0, to: 1 } } 
});
  loadSprite("pour", "assets/images/animationSprites/pour2.png", { 
    sliceX: 18, 
    sliceY: 1, 
    anims: { fade: { from: 0, to: 17 } } 
});
  loadSprite("transformBubbles", "assets/images/animationSprites/bubbles.png", { 
    sliceX: 7, 
    sliceY: 1, 
    anims: { fade: { from: 0, to: 6, loop: true} } 
});
  loadSprite("transformRainbow", "assets/images/animationSprites/rainbow.png", { 
    sliceX: 7, 
    sliceY: 1, 
    anims: { fade: { from: 0, to: 6, loop: true}} 
});
  loadSprite("newMove", "assets/images/animationSprites/transform.png", { 
    sliceX: 64, 
    sliceY: 1, 
    anims: { fade: { from: 0, to: 63 } }
});

  loadSprite("finalMoveBG", "assets/images/animationSprites/finalMoveBG.png", { 
    sliceX: 80, 
    sliceY: 1, 
    anims: { fade: { from: 0, to: 79 } }
});
  loadSprite("finalMove1", "assets/images/animationSprites/finalMove1.png", {
    sliceX: 10, 
    sliceY: 1, 
    anims: { fade: { from: 0, to: 9 } }
});

  loadSprite("finalMove2", "assets/images/animationSprites/finalMove2.png", { 
    sliceX: 10, 
    sliceY: 1, 
    anims: { fade: { from: 0, to: 9 } }
});



//loadSprite("finalMoveBG1", "assets/images/animationSprites/finalMoveBG1.png");
//loadSprite("finalMoveBG2", "assets/images/animationSprites/finalMoveBG2.png", { 
//    sliceX: 32, 
//    sliceY: 1, 
 //   anims: { fade: { from: 0, to: 31 } }
//});

  // BATTLE ANIMATIONS
  loadSprite("smokeBlob", "assets/images/animationSprites/newSmoke.png", { sliceX:9, sliceY:1, anims:{puff:{from:0,to:8}} });
  loadSprite("poof", "assets/images/animationSprites/newPoof.png", { sliceX:8, sliceY:1, anims:{puff:{from:0,to:7}} });
  loadSprite("greenBlast", "assets/images/animationSprites/GreenBlast.png", { sliceX:12, sliceY:1, anims:{glitch:{from:0,to:11}} });
  loadSprite("bam", "assets/images/animationSprites/newBoom2.png", { sliceX: 7, sliceY: 1, anims: { burst: { from: 0, to: 6 } }});
  loadSprite("powerup", "assets/images/animationSprites/PowerUp.png", { sliceX:9, sliceY:1, anims:{beam:{from:0,to:8}} });
  loadSprite("fireball", "assets/images/animationSprites/Fireball.png", { sliceX:4, sliceY:1, anims:{glitch:{from:0,to:3}} });
  loadSprite("zoomies", "assets/images/animationSprites/Zoomies.png", { sliceX:3, sliceY:3, anims:{glitch:{from:0,to:8}} });
  loadSprite("claw", "assets/images/animationSprites/CatnipClaw.png", { sliceX:32, sliceY:1, anims:{slash:{from:0,to:31,speed:30}} }); 
  loadSprite("biscuits", "assets/images/animationSprites/Biscuits.png", { sliceX:8, sliceY:1, anims:{glitch:{from:0,to:7}},  loop: true, });
  loadSprite("scratch2", "assets/images/animationSprites/Scratch2.png", { sliceX:5, sliceY:1, anims:{glitch:{from:0,to:4}} });
  loadSprite("superposition", "assets/images/animationSprites/Superposition.png", { sliceX: 4,   sliceY: 1,   anims: { glitch: { from: 0, to: 3 } }});
  loadSprite("shock", "assets/images/animationSprites/Shock.png", {   sliceX: 4, sliceY: 1,   anims: { burst: { from: 0, to: 3 } }});
  loadSprite("hammer", "assets/images/animationSprites/HydrogenHammer.png", { sliceX: 10, sliceY: 1, anims: { smash: { from: 0, to: 9 } }});
  loadSprite("box", "assets/images/animationSprites/Box.png", { sliceX: 2, sliceY: 1, anims: { glitch: { from: 0, to: 1 } }});
  loadSprite("bottle", "assets/images/animationSprites/PoisonBottle.png", { sliceX: 1, sliceY: 1, anims: { glitch: { from: 0, to: 0 } }});
  loadSprite("shatter", "assets/images/animationSprites/Shatter.png", { sliceX: 6, sliceY: 1, anims: { glitch: { from: 0, to: 5 } }});
  loadSprite("poison", "assets/images/animationSprites/Poison.png", { sliceX: 4, sliceY: 1, anims: { glitch: { from: 0, to: 3 } }});
  loadSprite("bite", "assets/images/animationSprites/Bite.png", { sliceX: 4, sliceY: 1, anims: { glitch: { from: 0, to: 3 } }});
  loadSprite("laserCharge", "assets/images/animationSprites/LaserCharge.png", { sliceX: 6, sliceY: 1, anims: { glitch: { from: 0, to: 5 } }});
  loadSprite("laserBeam", "assets/images/animationSprites/LaserBeam.png", { sliceX: 4, sliceY: 1, anims: { glitch: { from: 0, to: 3 } }});
  loadSprite("rage", "assets/images/animationSprites/RodentRage.png", { sliceX:3, sliceY:3, anims:{glitch:{from:0,to:8}} });
  //FINISH HIM MOVES
  loadSprite("lock", "assets/images/animationSprites/LockOn.png", { sliceX:22, sliceY:1, anims:{glitch:{from:0,to:21,speed:15}} });
  loadSprite("catArrow", "assets/images/animationSprites/CatArrow2.PNG");
  loadSprite("CocktailLight", "assets/images/animationSprites/MeowlotovCocktailLight2.png", { sliceX:3, sliceY:1, anims:{glitch:{from:0,to:2}} });
  loadSprite("CocktailSpin", "assets/images/animationSprites/MeowlotovCocktailSpin2.png", { sliceX:4, sliceY:1, anims:{glitch:{from:0,to:3}} });
  loadSprite("Burn", "assets/images/animationSprites/Burn.png", { sliceX:4, sliceY:1, anims:{glitch:{from:0,to:3}} });
  loadSprite("Burn2", "assets/images/animationSprites/Burn2.png", { sliceX:16, sliceY:1, anims:{glitch:{from:0,to:15}} });
  loadSprite("MuzzleFlash", "assets/images/animationSprites/MuzzleFlash.png", { sliceX:6, sliceY:1, anims:{burst:{from:0,to:5}} });
  loadSprite("mushroom", "assets/images/animationSprites/MushroomCloud2.PNG", { sliceX:4, sliceY:2, anims:{burst:{from:0,to:7}} });
  loadSprite("splat", "assets/images/animationSprites/Splat.png", { sliceX: 4, sliceY: 1, anims: { glitch: { from: 0, to: 3 } }});
  loadSprite("BrassToeBeans", "assets/images/animationSprites/BrassToeBeans2.PNG");
  loadSprite("rifle", "assets/images/animationSprites/PurrcisionRifle2.png");
  loadSprite("CrossBow", "assets/images/animationSprites/CatCrossBow2.png", { sliceX: 2, sliceY: 1, anims: { glitch: { from: 0, to: 1 } }});
// UNLOCK MOVE
  loadSprite("whip", "assets/images/animationSprites/whip2.png", { sliceX:5, sliceY:1, anims:{glitch:{from:0,to:4,speed:50}} });
//  ======================================== CHARACTER ANIMATION SPRITES ========================================
const characters = getCharacterList();
for (const char of characters) {
  const charName = char.name;
  loadSprite(`${charName}Sheet`, char.sprites.sheet, {
    sliceX: 28,
    sliceY: 1,
    anims: {
      walk: { 
        from: SPRITE_FRAMES.walk0, 
        to: SPRITE_FRAMES.walk7, 
        loop: true, 
        speed: 10 
      }
    }
  });
}

loadSprite("rainbowCatSheet", "assets/images/cats/RainbowCat.png", {
  sliceX: 12,
  sliceY: 1,
  anims: {
    walk: { 
      from: RAINBOW_CAT_FRAMES.walk0, 
      to: RAINBOW_CAT_FRAMES.walk7, 
      loop: true, 
      speed: 10 
    }
  }
});

  console.log('✅ Assets loaded!');
}



//======================================== REGISTER SCENES ========================================
function registerScenes() {
  console.log('🎬 Registering scenes...');
  scene("start", () => createStartScene());
  scene("menu", () => createMainMenuScene());
  scene("charSelect", () => createCharSelectScene());

  scene("level1", (data) => {
    createLevel1Scene(data); 
  });
  scene("level2", (data) => {
      createLevel2Scene(data);
    });
  scene("level3", (data) => {
      createLevel3Scene(data);
    });
  scene("level4", (data) => {
      createLevel4Scene(data);
    });
  scene("level5", (data) => {
      createLevel5Scene(data);
    });

  scene("challengeRoom", (data) => {
    createChallengeRoomScene(data);
  });

  scene("laserPointerBoss", (data) => {
    createLaserPointerBossScene(data);
  });
  scene("cupBoss", (data) => {
    createCupBossScene(data);
  });
  scene("cucumberBoss", (data) => {
    createCucumberBossScene(data);
  });
  scene("bossRatKing", (data) => {
    createRatKingBossScene(data);
  });
  scene("observerBoss", (data) => {
    createObserverBossScene(data);
  });
  
  scene("youDied", (data) => {
    createYouDiedScene(data);
  });
  scene("gameOver", (data) => {
    createGameOverScene(data);
  });
  scene("victory", (data) => {
    createVictoryScene(data);
  });
  scene("levelComplete", (data) => {
    createLevelCompleteScene(data);
  });
  scene("bossDefeated", (data) => {
    createBossDefeatedScene(data);
  });
  
  scene("transition", (transitionKey, character, startHP, lives, score) =>  
    createTransitionScene(transitionKey, character, startHP, lives, score)
  );

  console.log('✅ Scenes registered!');
}

async function startGame() {
  console.log('🚀 Starting CATastrophe 2...');
  await loadAssets();
  registerScenes();
  initializeAllUIHelpers();
  go("start");
  console.log('✅ Game started! Click to begin...');
}

startGame();