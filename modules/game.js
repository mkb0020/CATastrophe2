import kaplay from "kaplay";
import { SCREEN_W, SCREEN_H, Colors } from './config/gameConfig.js';
import { getCharacterList } from './config/characters.js';
import { getLevel } from './config/levels.js';
import { getBoss } from './config/bosses.js';
import { createVolumeToggle, stopAllMusic, startMenuMusic } from './utils/audioControls.js';
// IMPORT SCENES
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
  //createCreditsScene  
} from './scenes/gameOver.js';

console.log('🎮 CATastrophe 2 - Kaplay Edition Loading...');

// INITIALIZE KAPLAY
const k = kaplay({
  width: SCREEN_W,
  height: SCREEN_H,
  letterbox: true,
  background: [11, 11, 27],
  global: false, 
  canvas: document.getElementById("gameCanvas"),
  debug: true, 
});

window.k = k;
Object.assign(window, k);

console.log('✅ Kaplay initialized!');

loadFont("narrow", "assets/fonts/PTSansNarrow-Regular.ttf");
loadFont("narrowBold", "assets/fonts/PTSansNarrow-Bold.ttf");
loadFont("orbitron", "assets/fonts/Orbitron-Regular.ttf");
loadFont("orbitronBold", "assets/fonts/Orbitron-Bold.ttf");
loadFont("silkscreen", "assets/fonts/Silkscreen-Regular.ttf");
loadFont("science", "assets/fonts/ScienceGothic.ttf");

/**
 * LOAD ALL GAME ASSETS
 */
async function loadAssets() {
  console.log('📦 Loading game assets...');
  //MUSIC
  loadSound("menuMusic", "assets/sounds/tracks/MenuTrack.mp3"); 
  loadSound("finalBossMusic", "assets/sounds/tracks/FnalBossTrack.mp3");
  loadSound("GameOverTrack", "assets/sounds/tracks/GameOverTrack.mp3")
  loadSound("VictoryTrack", "assets/sounds/tracks/VictoryTrack.mp3");
  loadSound("catnipTrack", "assets/sounds/tracks/CatnipTrack.mp3");
  loadSound("finalVictory", "assets/sounds/tracks/FinalVictory.mp3");
  loadSound("levelMusic", "assets/sounds/tracks/PlatformerTrack.mp3");
  loadSound("bossMusic", "assets/sounds/tracks/BossTrack.mp3");
  loadSound("PlatformerTrack1", "assets/sounds/tracks/PlatformerTrack1.mp3");
  loadSound("PlatformerTrack2", "assets/sounds/tracks/PlatformerTrack2.mp3");
  loadSound("PlatformerTrack3", "assets/sounds/tracks/PlatformerTrack3.mp3");
  loadSound("PlatformerTrack4", "assets/sounds/tracks/PlatformerTrack4.mp3");
  loadSound("PlatformerTrack5", "assets/sounds/tracks/PlatformerTrack5.mp3");
  //SOUNDS
  loadSound("collectCup", "assets/sounds/fx/cup.mp3");
  loadSound("powerUp", "assets/sounds/fx/getPoints.mp3");
  loadSound("extraLife", "assets/sounds/fx/exrtraLife.mp3");
  loadSound("flip", "assets/sounds/fx/flip.mp3");
  loadSound("ratKill", "assets/sounds/fx/rat.mp3");
  loadSound("takeHit", "assets/sounds/fx/takehit.mp3");
  loadSound("laserHit", "assets/sounds/fx/laserHit.mp3");
  loadSound("gameOverSound", "assets/sounds/fx/gameOverSound.mp3");
  loadSound("VictorySound", "assets/sounds/fx/VictorySound.mp3");
  loadSound("lightning", "assets/sounds/fx/Lightning.mp3");
  loadSound("bossLand", "assets/sounds/fx/bossLand.mp3");
// MEOWS
  loadSound("happyMeow", "assets/sounds/fx/meow06.mp3");
  loadSound("meow00", "assets/sounds/fx/meow00.mp3");
  loadSound("meow01", "assets/sounds/fx/meow01.mp3");
  loadSound("meow02", "assets/sounds/fx/meow05.mp3"); 
// SPECIAL MOVE SOUNDS
  loadSound("cupFinishHim", "assets/sounds/fx/cup.mp3");
  loadSound("cucumberFinishHim", "assets/sounds/fx/cucumber.mp3");
  loadSound("ratFinishHim", "assets/sounds/fx/rat.mp3");
  loadSound("laserFinishHim", "assets/sounds/fx/laser.mp3");
  loadSound("finalFinishHim", "assets/sounds/fx/finalBoom.mp3");


  loadSprite("questionBubble", "assets/images/items/question.png");
  loadSprite("purrBubble", "assets/images/items/purr.png");
  loadSprite("meowBubble", "assets/images/items/meow.png");
  loadSprite("heartBubble", "assets/images/items/heart.png");
  loadSprite("plusHeartBubble", "assets/images/items/plusHeart.png");
  loadSprite("starBubble", "assets/images/items/star.png");
  loadSprite("plusTenBubble", "assets/images/items/ten.png");
  loadSprite("plusHPBubble", "assets/images/items/HP.png");
  loadSprite("exclamationBubble", "assets/images/items/exclamation.png");
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
  loadSprite("transitionBG7", "assets/images/backgrounds/transitionBG7.png");
  loadSprite("observerIntro", "assets/images/backgrounds/ObserverIntro.png");
  loadSprite("battleBG1", "assets/images/backgrounds/BattleBG1.png");
  loadSprite("gameOverBG", "assets/images/backgrounds/GameOverBG.png"); // FOR LOSING ALL LIVES
  loadSprite("VictoryBG", "assets/images/backgrounds/VictoryBG.png"); // FOR FINAL VICTORY
  loadSprite("creditsBG", "assets/images/backgrounds/creditsBG.png"); // FOR FINAL VICTORY
  loadSprite("cafe", "assets/images/backgrounds/Cafe.png"); // FOR FINAL VICTORY
  loadSprite("darkCafe", "assets/images/backgrounds/DarkCafe.png"); // FOR FINAL VICTORY

  loadSprite("level1BG", "assets/images/backgrounds/level1BG.png", {
    sliceX: 1,  
    sliceY: 1,   
    anims: {
      idle: { from: 0, to: 0} 
    }
  });

    loadSprite("l2BG", "assets/images/backgrounds/Level2BG.png", {
    sliceX: 1,  
    sliceY: 1,   
    anims: {
      idle: { from: 0, to: 0} 
    }
  });

    loadSprite("l3BG", "assets/images/backgrounds/Level3BG.png", {
    sliceX: 1,  
    sliceY: 1,  
    anims: {
      idle: { from: 0, to: 0} 
    }
  });

    loadSprite("l4BG", "assets/images/backgrounds/Level4BG.png", {
    sliceX: 1,  
    sliceY: 1,   
    anims: {
      idle: { from: 0, to: 0} 
    }
  });

    loadSprite("l5BG", "assets/images/backgrounds/Level5BG.png", {
    sliceX: 1,  
    sliceY: 1,   
    anims: {
      idle: { from: 0, to: 0} 
    }
  });
  
  // ENEMIES
  loadSprite("glow", "assets/images/cats/battle/Glow.png");
  loadSprite("cup", "assets/images/enemies/Cup.png");
  loadSprite("littleCucumber", "assets/images/animationSprites/LittleCucumber.png");
  loadSprite("smallRat", "assets/images/animationSprites/SmallRat.png");
  loadSprite("smallRat2", "assets/images/enemies/SmallRat2.png");
  loadSprite("ghostRat", "assets/images/animationSprites/GhostRat.png");
  loadSprite("bigRat", "assets/images/enemies/BigRat.png");

  loadSprite("bossLaserPointer", "assets/images/enemies/BossLaserPointer.png");
  loadSprite("laserPointerGlow", "assets/images/enemies/LaserGlow.png");
  loadSprite("bossCup", "assets/images/enemies/BossCup.png");
  loadSprite("CupGlow", "assets/images/enemies/CupGlow.png");
  loadSprite("bossRat", "assets/images/enemies/BossRatKing.png");
  loadSprite("RatGlow", "assets/images/enemies/RatGlow.png");
  loadSprite("bossCucumber", "assets/images/enemies/BossCucumber.png");
  loadSprite("CucumberGlow", "assets/images/enemies/CucumberGlow.png");
  loadSprite("bossRat", "assets/images/enemies/BossRatKing.png");
  loadSprite("observer", "assets/images/enemies/Observer.png");
  loadSprite("ObserverGlow", "assets/images/enemies/ObserverGlow.png");
  // ITEMS
  loadSprite("catTower", "assets/images/items/CatTower.png");
  loadSprite("arrow", "assets/images/items/Arrow.png");
  loadSprite("catnip", "assets/images/items/Catnip.png");
  loadSprite("fish", "assets/images/items/FishBones.png");
  loadSprite("tunaCan", "assets/images/items/TunaCan.png");
  loadSprite("milkBottle", "assets/images/items/MilkBottle.png");
  loadSprite("clock", "assets/images/items/clock.png");
  loadSprite("catnip", "assets/images/items/Catnip.png");
  loadSprite("yeet", "assets/images/CATastrophe/yeet.png");
  loadSprite("pawsed", "assets/images/CATastrophe/pawsed.png");
  loadSprite("nekoState", "assets/images/animationSprites/nekoState.png", { sliceX:8, sliceY:1, anims:{pulse:{from:0,to:7, loop: false, speed:7}} });
  loadSprite("nekoNA", "assets/images/animationSprites/nekoNA.png", { sliceX:33, sliceY:1, anims:{pulse:{from:0,to:32, loop: false, speed:7}} });
  // SCENES
  loadSprite("drip", "assets/images/animationSprites/BloodDrip.png", { sliceX:10, sliceY:1, anims:{drip:{from:0,to:9, loop: false, speed:7}} });
  loadSprite("drip2", "assets/images/animationSprites/Drip2.png", { 
    sliceX: 17, 
    sliceY: 1, 
    anims: { drip: { from: 0, to: 16 } } 
});
  loadSprite("drip3", "assets/images/animationSprites/Drip3.png", { 
    sliceX: 12, 
    sliceY: 1, 
    anims: { drip: { from: 0, to: 11 } } 
});
  loadSprite("lightning", "assets/images/animationSprites/Lightning.png", { sliceX:6, sliceY:1, anims:{glitch:{from:0,to:5}} });
  loadSprite("smokeReveal1", "assets/images/animationSprites/smokeReveal1.png", { sliceX:21, sliceY:1, anims:{puff:{from:0,to:20, loop: false, speed:15}} });
  loadSprite("smoke2", "assets/images/animationSprites/smokeReveal2.png", { sliceX:14, sliceY:1, anims:{puff:{from:0,to:13, loop: false, speed:10}} });
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

  // BATTLE ANIMATIONS
  loadSprite("explosion", "assets/images/animationSprites/Explosion.png", { sliceX:6, sliceY:1, anims:{burst:{from:0,to:5}} });
  loadSprite("fire", "assets/images/animationSprites/Fire.png", { sliceX:9, sliceY:1, anims:{ball:{from:0,to:8}} });
  loadSprite("smoke", "assets/images/animationSprites/Smoke.png", { sliceX:9, sliceY:1, anims:{puff:{from:0,to:8}} });
  loadSprite("swirl", "assets/images/animationSprites/Swirl.png", { sliceX:12, sliceY:1, anims:{spin:{from:0,to:11}} });
  loadSprite("powerup", "assets/images/animationSprites/Powerup.png", { sliceX:9, sliceY:1, anims:{beam:{from:0,to:8}} });
  loadSprite("zoomies", "assets/images/animationSprites/Zoomies.png", { sliceX:3, sliceY:3, anims:{glitch:{from:0,to:8}} });
  loadSprite("claw", "assets/images/animationSprites/CatnipClaw.png", { sliceX:32, sliceY:1, anims:{slash:{from:0,to:31,speed:30}} }); 
  loadSprite("greenBlast", "assets/images/animationSprites/GreenBlast.png", { sliceX:12, sliceY:1, anims:{glitch:{from:0,to:11}} });
  loadSprite("biscuits", "assets/images/animationSprites/Biscuits.png", { sliceX:8, sliceY:3, anims:{glitch:{from:0,to:23}} });
  loadSprite("fireball", "assets/images/animationSprites/Fireball.png", { sliceX:4, sliceY:1, anims:{glitch:{from:0,to:3}} });
  loadSprite("scratch", "assets/images/animationSprites/Scratch.png", { sliceX:4, sliceY:1, anims:{glitch:{from:0,to:3}} });
  loadSprite("superposition", "assets/images/animationSprites/Superposition.png", { sliceX: 4,   sliceY: 1,   anims: { glitch: { from: 0, to: 3 } }});
  loadSprite("shock", "assets/images/animationSprites/Shock.png", {   sliceX: 4, sliceY: 1,   anims: { burst: { from: 0, to: 3 } }});
  loadSprite("hammer", "assets/images/animationSprites/HydrogenHammer.png", { sliceX: 10, sliceY: 1, anims: { smash: { from: 0, to: 9 } }});
  loadSprite("box", "assets/images/animationSprites/box.png", { sliceX: 2, sliceY: 1, anims: { glitch: { from: 0, to: 1 } }});
  loadSprite("bottle", "assets/images/animationSprites/PoisonBottle.png", { sliceX: 1, sliceY: 1, anims: { glitch: { from: 0, to: 0 } }});
  loadSprite("shatter", "assets/images/animationSprites/Shatter.png", { sliceX: 6, sliceY: 1, anims: { glitch: { from: 0, to: 5 } }});
  loadSprite("poison", "assets/images/animationSprites/Poison.png", { sliceX: 4, sliceY: 1, anims: { glitch: { from: 0, to: 3 } }});
  loadSprite("bam", "assets/images/animationSprites/Bam.png", { sliceX: 8, sliceY: 1, anims: { glitch: { from: 0, to: 7 } }});
  loadSprite("bite", "assets/images/animationSprites/Bite.png", { sliceX: 4, sliceY: 1, anims: { glitch: { from: 0, to: 3 } }});
  loadSprite("laserCharge", "assets/images/animationSprites/LaserCharge.png", { sliceX: 6, sliceY: 1, anims: { glitch: { from: 0, to: 5 } }});
  loadSprite("laserBeam", "assets/images/animationSprites/LaserBeam.png", { sliceX: 4, sliceY: 1, anims: { glitch: { from: 0, to: 3 } }});
  loadSprite("zap", "assets/images/animationSprites/Zap.png", { sliceX: 4, sliceY: 1, anims: { glitch: { from: 0, to: 3 } }});
  loadSprite("rage", "assets/images/animationSprites/RodentRage.png", { sliceX:3, sliceY:3, anims:{glitch:{from:0,to:8}} });
  loadSprite("boom", "assets/images/animationSprites/RedBoom.png", { sliceX:6, sliceY:1, anims:{burst:{from:0,to:5}} });
  loadSprite("poof", "assets/images/animationSprites/Poof.png", { sliceX:8, sliceY:1, anims:{burst:{from:0,to:7}} });
  //FINISH HIM MOVES
  loadSprite("lock", "assets/images/animationSprites/LockOn.png", { sliceX:22, sliceY:1, anims:{glitch:{from:0,to:21,speed:15}} });
  loadSprite("catArrow", "assets/images/animationSprites/CatArrow2.png");
  loadSprite("CocktailLight", "assets/images/animationSprites/MeowlotovCocktailLight2.png", { sliceX:3, sliceY:1, anims:{glitch:{from:0,to:2}} });
  loadSprite("CocktailSpin", "assets/images/animationSprites/MeowlotovCocktailSpin2.png", { sliceX:4, sliceY:1, anims:{glitch:{from:0,to:3}} });
  loadSprite("lock2", "assets/images/animationSprites/LockOn2.png", { sliceX:22, sliceY:1, anims:{glitch:{from:0,to:21,speed:30}} });
  loadSprite("Burn", "assets/images/animationSprites/Burn.png", { sliceX:4, sliceY:1, anims:{glitch:{from:0,to:3}} });
  loadSprite("MuzzleFlash", "assets/images/animationSprites/MuzzleFlash.png", { sliceX:6, sliceY:1, anims:{burst:{from:0,to:5}} });
  loadSprite("pinkBoom", "assets/images/animationSprites/PinkBoom.png", { sliceX:6, sliceY:1, anims:{burst:{from:0,to:5}} });
  loadSprite("mushroom", "assets/images/animationSprites/MushroomCloud2.png", { sliceX:4, sliceY:2, anims:{burst:{from:0,to:7}} });
  loadSprite("splat", "assets/images/animationSprites/Splat.png", { sliceX: 4, sliceY: 1, anims: { glitch: { from: 0, to: 3 } }});
  loadSprite("BrassToeBeans", "assets/images/animationSprites/BrassToeBeans2.png");
  loadSprite("rifle", "assets/images/animationSprites/PurrcisionRifle2.png");
  loadSprite("CrossBow", "assets/images/animationSprites/CatCrossBow2.png", { sliceX: 2, sliceY: 1, anims: { glitch: { from: 0, to: 1 } }});
// SPECIAL MOVE
  loadSprite("whip", "assets/images/animationSprites/whip2.png", { sliceX:5, sliceY:1, anims:{glitch:{from:0,to:4,speed:50}} });

  const characters = getCharacterList();
  
  for (const char of characters) {
    loadSprite(char.sprites.glitchBlue, `${char.sprites.glitchBlue}`);
    loadSprite(char.sprites.glitchRed, `${char.sprites.glitchRed}`);
    loadSprite(char.sprites.glow, `${char.sprites.glow}`);
    loadSprite(char.sprites.battle, `${char.sprites.battle}`);
    loadSprite(char.sprites.catch, `${char.sprites.catch}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.cup00, `${char.sprites.cup00}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.cup01, `${char.sprites.cup01}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.cup02, `${char.sprites.cup02}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.jump, `${char.sprites.jump}`);
    loadSprite(char.sprites.king00, `${char.sprites.king00}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.king01, `${char.sprites.king01}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.king02, `${char.sprites.king02}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.menu, `${char.sprites.menu}`);
    loadSprite(char.sprites.sitSmall, `${char.sprites.sitSmall}`);
    loadSprite(char.sprites.sitLookForwardRegular, `${char.sprites.sitLookForwardRegular}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.sitLookForwardMad, `${char.sprites.sitLookForwardMad}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.sitLookBackRegular, `${char.sprites.sitLookBackRegular}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.sitLookBackMad, `${char.sprites.sitLookBackMad}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.idle, `${char.sprites.idle}`);
    loadSprite(char.sprites.standRegular, `${char.sprites.standRegular}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.standMad, `${char.sprites.standMad}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.standSmall, `${char.sprites.standSmall}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.pounce, `${char.sprites.pounce}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.select, `${char.sprites.select}`);
    loadSprite(char.sprites.sleep, `${char.sprites.sleep}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.stretch, `${char.sprites.stretch}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.wakeUp, `${char.sprites.wakeUp}`); // FOR TRANSITION SCENE
    loadSprite(char.sprites.walk, `${char.sprites.walk}`, {
      sliceX: 8,  
      sliceY: 1,
      anims: {
        walk: { from: 0, to: 7, loop: true, speed: 10 }
      }});

 
    loadSprite("rainbowIdle", "assets/images/cats/catnip/stand.png");
    loadSprite("rainbowJump", "assets/images/cats/catnip/jump.png");
    loadSprite("rainbowWalk", "assets/images/cats/catnip/walk.png", {
      sliceX: 8,
      sliceY: 1,
      anims: {
        walk: { from: 0, to: 7, loop: true, speed: 10 }
      }
    });

   
  }
  
  console.log('✅ Assets loaded!');
}

/**
 * REGISTER ALL GAME SCENES
 */
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

  // BOSS BATTLES
  scene("laserPointerBoss", (data) => createLaserPointerBossScene(data.character, data.playerHP));
  scene("cupBoss", (data) => createCupBossScene(data.character, data.playerHP));
  scene("cucumberBoss", (data) => createCucumberBossScene(data.character, data.playerHP));
  scene("bossRatKing", (data) => createRatKingBossScene(data.character, data.playerHP));
  scene("observerBoss", (data) => createObserverBossScene(data.character, data.playerHP));
  
  // GAME OVER AND VICTORY
  scene("youDied", (data) => createYouDiedScene(data));
  scene("gameOver", (data) => createGameOverScene(data));
  scene("victory", (data) => createVictoryScene(data));
  scene("levelComplete", (data) => createLevelCompleteScene(data));
  scene("bossDefeated", (data) => createBossDefeatedScene(data));
  
  scene("transition", (transitionKey, character, playerHP) => 
    createTransitionScene(transitionKey, character, playerHP)
    );



  console.log('✅ Scenes registered!');
}


async function startGame() {
  console.log('🚀 Starting CATastrophe 2...');
  
  await loadAssets();
  
  registerScenes();
  
  // START AT MENU
  go("start");
  console.log('✅ Game started! Click to begin...');
}


startGame();