// levelEnvironment.js

// EXPORTS:
    // setupLevelMusic() - Start background music
    // createSpriteGround() - Create ground segments
    // addLevelEnvironment() - Set up platforms, background, overlays
    // setupOneWayPlatforms() - Configure jump-through platforms
    // setupSequentialPlatforms() - Set up appearing platforms
    // setupSequentialPlatformActivation() - Handle platform activation
    // addVictoryArea() - Create end-of-level cat tower and victory zone
    // setupVictoryCollision() - Handle level completion
    // setupFallDetection() - Detect when player falls off level
    // setupTimer() - Handle time limit countdown
    // setupLevelPause() - Configure pause functionality
    
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ IMPORTS  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { SCREEN_W, SCREEN_H, Colors, BUBBLE_FRAMES } from '../config/gameConfig.js';
import { setupPauseSystem, stopAllMusic, startLevelMusic } from '../helpers/kittyHelpers.js';
import { SPRITE_FRAMES } from '../config/characters.js';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FUNCTIONS  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//==================================== TRANSITION ANIMATION - TO GAME OVER ====================================
export function playBloodDripAnimation(gameStateSetter, scoreGetter, levelName, character) {
  console.log('☠️ No lives remaining - GAME OVER');
  stopAllMusic();

  const darkOverlay = add([
    rect(width(), height()),
    pos(0, 0),
    fixed(),
    color(0, 0, 0),
    opacity(0),
    z(4000),
  ]);

  const bloodDrip = add([
    sprite('drip', { anim: 'drip' }),
    pos(0, 0),
    scale(10),
    fixed(),
    z(5000),
    opacity(1),
  ]);

  bloodDrip.play('drip', { speed: 7 });
  

  wait(1.8, () => {
    tween(
      darkOverlay.opacity,
      1,
      0.5,
      (val) => darkOverlay.opacity = val,
      k.easings.easeOutQuad
    );
  });

  wait(2, () => {
    tween(
      bloodDrip.opacity,
      0,
      0.6,
      (val) => bloodDrip.opacity = val,
      k.easings.easeOutQuad
    );
  });

  wait(2.1, () => {
    gameStateSetter(false);
    go("gameOver", {
      score: scoreGetter(),
      level: levelName,
      hp: 0,
      lives: 0,
      character,
      fromBloodDrip: true,
    });
  });
}

//==================================== LEVEL SETUP ====================================
export function setupLevelMusic(levelConfig) {
  startLevelMusic(levelConfig.levelMusic);
}

function createSpritePlatform(x, y, width, height, isHintPlatform = false, isSolidPlatform = false) {
  const spriteWidth = 250;
  const scaleX = width / spriteWidth;
  const scaleY = 0.9; 
  
  const spriteLayer = add([
    sprite('platform'),
    pos(x, y),
    scale(vec2(scaleX, scaleY)), 
    z(-2),
    "platformSprite"
  ]);
  
  const collisionLayer = add([
    rect(width, height),
    pos(x, y),
    area(),
    body({ isStatic: true }),
    opacity(0),
    isSolidPlatform ? "platform" : "oneWayPlatform",
    z(-1)
  ]);
  
  collisionLayer.spriteLayer = spriteLayer;
  
  return collisionLayer;
}

export function createSpriteGround(x, y, width, height) {
  const segmentWidth = 500; 
  const numSegments = Math.floor(width / segmentWidth);
  
  for (let i = 0; i < numSegments; i++) {
    add([
      sprite('groundPlatform'),
      pos(x + (i * segmentWidth), y),
      scale(vec2(2, 2)), 
      z(-2),
      "groundSprite"
    ]);
  }
  
 
  add([
    rect(width, height),
    pos(x, y),
    area(),
    body({ isStatic: true }),
    opacity(0),
    "ground",
    z(2)
  ]);
}

export function addLevelEnvironment(levelConfig) {
  const bg = null;

 const darkOverlay = add([ //  DARK OVERLAY OVER BG SO WINDOWS DON'T LOOK WEIRD 
    rect(width(), height()),
    pos(0, 0),
    fixed(),
    color(0, 0, 0),
    opacity(0.1),
    z(-1),
  ]);


  const yeet = add([
    sprite('yeet'),
    pos(-960, 270),
    scale(1.9),
    z(0),
  ]);

  
levelConfig.platforms.forEach((platform, index) => {
    const isSolidPlatform = levelConfig.solidPlatforms?.includes(index);
    
    if (platform.isRect) {
      add([
        rect(platform.width, platform.height),
        pos(platform.x, platform.y),
        area(),
        body({ isStatic: true }),
        color(131, 12, 222), 
        "oneWayPlatform",
        z(-1)
      ]);
    } else {
      createSpritePlatform(
        platform.x, 
        platform.y, 
        platform.width, 
        platform.height,
        false,
        isSolidPlatform
      );
    } 
  });

 
  levelConfig.GroundSegments.forEach(segment => {
    createSpriteGround(segment.x, segment.y, segment.width, segment.height);
  });



  return { bg };
}

export function setupOneWayPlatforms(player) {
  const hitboxHeight = player.area.height || 60;
  const hitboxOffsetY = player.area.offset?.y || 0;
  const hitboxWidth = player.area.width || 80;
  
  player.onCollide("oneWayPlatform", (platform) => {
    const playerBottom = player.pos.y + (hitboxHeight / 2) + hitboxOffsetY;
    const platformTop = platform.pos.y - platform.height / 2;
    const offsetX = player.facingRight ? 1 : -1;
    const playerLeft = player.pos.x + offsetX - (hitboxWidth / 2);
    const playerRight = player.pos.x + offsetX + (hitboxWidth / 2);
    const platformLeft = platform.pos.x;
    const platformRight = platform.pos.x + platform.width;
    const horizontalOverlap = playerRight > platformLeft && playerLeft < platformRight;
        if (player.vel.y > 0 && playerBottom < platformTop + 10 && horizontalOverlap) {
      player.pos.y = platformTop - (hitboxHeight / 2) - hitboxOffsetY;
      player.vel.y = 0;
      
      if (!platform.has("body")) {
        platform.use(body({ isStatic: true }));
      }
    } else if (player.vel.y < 0 || !horizontalOverlap) {
      if (platform.has("body")) {
        platform.unuse("body");
      }
    }
  });
}

export function setupSequentialPlatforms(levelConfig) {
  if (!levelConfig.sequentialPlatforms?.enabled) return;
  
  const platformIds = levelConfig.sequentialPlatforms.platformIds;
  
  const sequentialPlatforms = [];
  
  const allPlatforms = [...get("platform"), ...get("oneWayPlatform")];
  
  allPlatforms.forEach(platform => {
    const platformIndex = levelConfig.platforms.findIndex(p => 
      p.x === platform.pos.x && p.y === platform.pos.y
    );
    
    const sequenceIndex = platformIds.indexOf(platformIndex);
    
    if (sequenceIndex !== -1) {
      platform.sequenceId = sequenceIndex;
      platform.visible = sequenceIndex === 0; 
      platform.nextInSequence = sequenceIndex < platformIds.length - 1 ? sequenceIndex + 1 : null;
      platform.opacity = platform.visible ? 0 : 0; 
      
      if (platform.spriteLayer) {
        platform.spriteLayer.opacity = platform.visible ? 1 : 0;
      }
      
      sequentialPlatforms.push(platform);
    }
  });
  
  return sequentialPlatforms;
}

export function setupSequentialPlatformActivation(player, sequentialPlatforms) {
  if (!sequentialPlatforms || sequentialPlatforms.length === 0) return;
  
  player.onGround((platform) => {
    if (platform.sequenceId !== undefined && platform.visible && platform.nextInSequence !== null) {
      const nextPlatform = sequentialPlatforms.find(p => p.sequenceId === platform.nextInSequence);
      
      if (nextPlatform && !nextPlatform.visible) {
        nextPlatform.visible = true;
        
      tween(
        0,
        1,
        0.5,
        (val) => {
          if (nextPlatform.spriteLayer) {
            nextPlatform.spriteLayer.opacity = val;
          }
        },
        easings.easeOutQuad
      );
        
        play("powerUp", { volume: 0.3, speed: 2 });
      }
    }
  });
}

export function addVictoryArea(levelConfig) {
  const catTower = add([
    sprite('catTower'),
    pos(levelConfig.length - 750, 150),
    scale(1),
    z(0),
    "catTower"
  ]);

    const arrow = add([
      sprite('arrow'),
      pos(levelConfig.length - 660, 375),
      anchor("center"),
      scale(0.7),
      rotate(25),
      z(13),
      "arrow"
    ]);

  const victoryPlatform = add([
    rect(5, 5),
    pos(levelConfig.length - 530, 295),
    area(),
    body({ isStatic: true }),
    color(Color.fromHex(Colors.DarkDarkGray)),
    z(13),
    "victoryPlatform"
  ]);

  const helperPlatform = add([
    rect(130, 5),
    pos(levelConfig.length - 640, 295),
    area(),
    body({ isStatic: true }),
    color(Colors.DarkDarkGray),
    opacity(1),
    z(12),
    "helperPlatform"
  ]);

  return { catTower, arrow, victoryPlatform, helperPlatform };
}

export function setupVictoryCollision(player, levelName, nextBoss, character, gameStateGetter, gameStateSetter, scoreGetter, levelConfig, bossSpriteName, livesGetter) {  
  player.onCollide("victoryPlatform", async (platform) => {
    if (player.vel.y >= 0 && gameStateGetter()) {
      console.log('🏆 VICTORY!');
      console.log('🏆 Calling boss with data:', {
          level: levelName,
          score: scoreGetter(),
          character: character.name,
          startHP: player.hp,
        });
      gameStateSetter(false);
      stopAllMusic();
      if (nextBoss === "observerBoss" || nextBoss === "observer") {
        wait(0.5, () => {
          go("levelComplete", {
            level: levelName,
            score: scoreGetter(), 
            nextLevel: nextBoss,
            character: character, 
            startHP: player.hp  
          });
        });
        return;
      }
      
      const music = get("music");
      music.forEach(m => m.paused = true);
      
      player.vel.x = 0;
      player.vel.y = 0;
      const prefix = character.name;
      player.use(sprite(`${prefix}Sheet`, { frame: SPRITE_FRAMES.idle })); 
  
      
      const arrows = get("arrow");
      arrows.forEach(a => destroy(a));
      
      await wait(0.3);
      
      const bossStartY = -200; 
      const bossEndY = 110; 
      const bossX = levelConfig.length - 380;
      
      const boss = add([
        sprite(bossSpriteName),
        pos(bossX, bossStartY),
        scale(0.8),
        z(11),
        "bossIntro"
      ]);
      
      const dropDuration = 0.6;
      const startTime = time();
      
      boss.onUpdate(() => {
        const elapsed = time() - startTime;
        const t = Math.min(elapsed / dropDuration, 1);
        
        const eased = t * t;
        boss.pos.y = bossStartY + (bossEndY - bossStartY) * eased;
      });
      
      await wait(dropDuration);
      
      shake(30);
      play('bossLand', { volume: 0.3 });
      
      await wait(0.2);
      
  const exclamationBubble = add([
    sprite('bubbles', { frame: BUBBLE_FRAMES.exclamation }),
    pos(bossX - 45, 65),
    scale(1.8),
    z(15),
    "bubble"
  ]);
      
      await wait(0.7);
      
  play('meow02', { volume: 0.3 });
  const questionBubble = add([
    sprite('bubbles', { frame: BUBBLE_FRAMES.question }),
    pos(levelConfig.length - 540, 130),
    scale(1.8),
    z(12),
    "bubble"
  ]);
      
      await wait(1.0);
      
      const levelShift = add([
          sprite('levelShiftStart'),
          pos(0,0), 
          scale(10,10), 
          opacity(1),
          fixed(), 
          z(100),
          "transition"
        ]);
        
      levelShift.play("glitch");
      
      await wait(2);
      
        go(nextBoss, {
        level: levelName,
        score: scoreGetter(),
        character: { ...character, lives: livesGetter() },  
        startHP: player.hp, 
      });
    }
  });
}

export function setupFallDetection(
  player,
  gameStateGetter,
  gameStateSetter,
  levelName,
  scoreGetter,
  livesGetter,
  livesSetter,
  characterGetter,
  startingScore = 0  
) {
  player.onUpdate(() => {
    if (player.pos.y > SCREEN_H + 100 && gameStateGetter()) {
      gameStateSetter(false);

      const currentLives = livesGetter();
      const character = characterGetter?.();

      if (currentLives > 0) {
        go("youDied", {
          score: scoreGetter(),
          level: levelName,
          lives: currentLives,
          character,
          reason: "Fell into the abyss",
          startingScore  
        });
      } else {
        playBloodDripAnimation(
          gameStateSetter,
          scoreGetter,
          levelName,
          character
        );
      }
    }
  });
}

export function setupTimer(
  levelConfig, 
  gameStateGetter, 
  gameStateSetter, 
  timeLeftGetter, 
  timeLeftSetter, 
  levelName, 
  scoreGetter, 
  livesGetter, 
  livesSetter, 
  characterGetter,
  startingScore = 0  
) {
  loop(1, () => {
    if (gameStateGetter()) {
      const newTime = timeLeftGetter() - 1;
      timeLeftSetter(newTime);
      
      if (newTime <= 0) {
        gameStateSetter(false);
        
        const currentLives = livesGetter();
        const character = characterGetter ? characterGetter() : null;

        if (currentLives > 0) {
          go("youDied", {
            score: scoreGetter(),
            level: levelName,
            lives: currentLives,
            character,
            reason: "Time ran out!",
            startingScore  
          });
        } else {
          playBloodDripAnimation(gameStateSetter, scoreGetter, levelName, character);
        }
      }
    }
  });
}

//==================================== PAUSE ====================================
export function setupLevelPause(gameActiveGetter, gameActiveSetter, onQuitCallback = null) {
  return setupPauseSystem(gameActiveGetter, gameActiveSetter, onQuitCallback);
}