// levelHelpers.js
import { SCREEN_W, SCREEN_H, Colors, BUBBLE_FRAMES } from '../config/gameConfig.js';
import { setupPauseSystem, stopAllMusic, startLevelMusic, startBossMusic, startFinalBossMusic} from '../helpers/kittyHelpers.js';
import { animateGhostPoof } from '../helpers/bossHelpers.js';
import { rainbowCat, SPRITE_FRAMES, SPRITE_SCALES, RAINBOW_CAT_FRAMES } from '../config/characters.js';


//==================================== PERFORMANCE ANALYSIS ====================================
//if (typeof window !== 'undefined') {
//  window.debugCounts = {
 //   rats: 0,
 //   cucumbers: 0,
 //   lasers: 0,
 //   player: 0,
 //   cups: 0
//  };
  
//  if (!window.debugLoopStarted) {
//    window.debugLoopStarted = true;
//    setInterval(() => {
 //     console.log('=== Updates in last 3 seconds ===', window.debugCounts);
 //     console.log('Objects:', {
 //       rats: get("rat")?.length || 0,
 //       cucumbers: get("cucumber")?.length || 0,
 //       lasers: get("laser")?.length || 0
 //     });
 //     window.debugCounts = { rats: 0, cucumbers: 0, lasers: 0, player: 0, cups: 0 };
 //   }, 3000);
 // }
//}

//==================================== TRANSITION ANIMATION - TO GAME OVER ====================================
function playBloodDripAnimation(gameStateSetter, scoreGetter, levelName, character) {
  console.log('☠️ No lives remaining - GAME OVER');
  console.log('☠️ Playing blood drip animation...');
  stopAllMusic();
  
  const bloodDrip = add([
    sprite('drip3', { anim: 'drip' }),
    pos(0, 0),
    scale(10, 10),
    z(1000),
    fixed(),
    opacity(1)
  ]);
  
  bloodDrip.play('drip');

  const bloodDrip2 = add([
                      sprite('drip2', { anim: 'drip' }),
                      pos(0, 0),
                      scale(10, 10), 
                      z(999),
                      fixed(),
                      opacity(1)
                    ]);
            
  bloodDrip2.play('drip');  

  wait(1, () => {
        tween(bloodDrip.opacity, 0, 1.0, (val) => bloodDrip.opacity = val, k.easings.easeOutQuad);
        destroy(bloodDrip);
        });  
  
  wait(1.5, () => {
    gameStateSetter(false);
    go("gameOver", { 
      score: scoreGetter(),
      level: levelName,
      hp: 0,
      lives: 0,
      character: character,
      fromBloodDrip: true
    });
  });
}



//==================================== LEVEL SETUP ====================================
export function setupLevelMusic(levelConfig) {
  startLevelMusic(levelConfig.levelMusic);
}

function createSpritePlatform(x, y, width, height, isHintPlatform = false, isSolidPlatform = false) {
  const spriteWidth = 70;
  const scaleX = width / spriteWidth;
  const scaleY = 2; 
  add([
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

  const yeet = add([
    sprite('yeet'),
    pos(-960, 265),
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


  add([
    rect(25000, 480),
    pos(-1500, 0),
    color(0, 0, 0),
    opacity(0.2),
    z(-3)
  ]);

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
  
  get("platform").forEach(platform => {
    const platformIndex = levelConfig.platforms.findIndex(p => 
      p.x === platform.pos.x && p.y === platform.pos.y
    );
    
    const sequenceIndex = platformIds.indexOf(platformIndex);
    
    if (sequenceIndex !== -1) {
      platform.sequenceId = sequenceIndex;
      platform.visible = sequenceIndex === 0; 
      platform.nextInSequence = sequenceIndex < platformIds.length - 1 ? sequenceIndex + 1 : null;
      platform.opacity = platform.visible ? 1 : 0;
      sequentialPlatforms.push(platform);
      
      if (platform.baseLayer) platform.baseLayer.opacity = platform.visible ? 0.7 : 0;
      if (platform.topLayer) platform.topLayer.opacity = platform.visible ? 1 : 0;
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
            nextPlatform.opacity = val;
            if (nextPlatform.baseLayer) nextPlatform.baseLayer.opacity = val * 0.7;
            if (nextPlatform.topLayer) nextPlatform.topLayer.opacity = val;
          },
          easings.easeOutQuad
        );
        
        play("powerUp", { volume: 0.2, speed: 2 });
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

export function setupVictoryCollision(player, levelName, nextBoss, character, gameStateGetter, gameStateSetter, scoreGetter, levelConfig, bossSpriteName) {
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
        character: character,
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
//==================================== CUPS ====================================
export function addCups(levelConfig) {
  if (!levelConfig.cups.enabled) return new Set();
  
  const totalCups = levelConfig.cups.count;
  const platforms = levelConfig.platforms;
  
  const isInNoStuffZone = (platform) => {
    if (!levelConfig.noStuffZones) return false;
    const platformCenter = platform.x + (platform.width / 2);
    return levelConfig.noStuffZones.some(zone => 
      platformCenter >= zone.start && platformCenter <= zone.end
    );
  };
  
  const platformsWithCups = new Set();
  const eligibleIndices = platforms
    .map((platform, i) => ({ platform, index: i }))
    .filter(({ platform }) => !isInNoStuffZone(platform))
    .map(({ index }) => index);
  
  const shuffledIndices = eligibleIndices.sort(() => Math.random() - 0.5);
  let cupsPlaced = 0;
  
  const cupData = [];
  
  for (let idx of shuffledIndices) {
    if (cupsPlaced >= totalCups) break;
    
    const platform = platforms[idx];
    const x = platform.x + (platform.width / 2);
    const y = platform.y - 61;
    
    cupData.push({ x, y, spawned: false });
    cupsPlaced++;
    platformsWithCups.add(idx);
  }
  
  onUpdate(() => {
    const camX = camPos().x;
    const spawnDistance = SCREEN_W * 1.5; 
    
    cupData.forEach(cup => {
      const distFromCam = Math.abs(cup.x - camX);
      
      if (!cup.spawned && distFromCam < spawnDistance) {
        cup.spawned = true;
        add([
          sprite('cup'),
          pos(cup.x, cup.y),
          area({ width: 40, height: 60 }),
          anchor("center"),
          scale(0.8),
          rotate(0),
          {
            hasBeenKnocked: false,
            rotationSpeed: 0,
            fallSpeed: 0,
            points: 10
          },
          "cup"
        ]);
      }
    });
  });
  
  return platformsWithCups;
}

export function setupCupCollection(player, scoreGetter, scoreSetter) {
  player.onCollide("cup", (cup) => {
    if (!cup.hasBeenKnocked) {
      cup.hasBeenKnocked = true;
      cup.rotationSpeed = rand(-360, 360);
      cup.fallSpeed = 200;
      cup.z = 3;
      
      scoreSetter(scoreGetter() + cup.points);
      play("collectCup", { volume: 0.3 });
      
      cup.onUpdate(() => {
         //if (window.debugCounts) window.debugCounts.cups++; 

        cup.fallSpeed += 600 * dt();
        cup.pos.y += cup.fallSpeed * dt();
        cup.angle += cup.rotationSpeed * dt();
        
        if (cup.pos.y > 600) {
          destroy(cup);
        }
      });
    }
  });
}

//==================================== SPECIAL ITEMS ====================================
export function addSpecialItems(levelConfig, platformsWithCups = new Set()) {
  const isInNoStuffZone = (platform) => { // noStuffZone CHECKER
    if (!levelConfig.noStuffZones) return false;
    const platformCenter = platform.x + (platform.width / 2);
    return levelConfig.noStuffZones.some(zone => 
      platformCenter >= zone.start && platformCenter <= zone.end
    );
  };


  const eligiblePlatforms = levelConfig.platforms  // PLATFORM FILTER - WIDE ENOUGH, NO CUPS, NOT IN noStuffZone
    .map((p, index) => ({ platform: p, index }))
    .filter(({ platform, index }) => 
      platform.width >= 150 && 
      !platformsWithCups.has(index) &&
      !isInNoStuffZone(platform)
    );
  
  if (eligiblePlatforms.length === 0) {
    console.warn("No eligible platforms for special items!");
    return;
  }
  
  const usedPlatforms = new Set(); // TRACK USED PLATFORMS
  
 
  if (levelConfig.items.fishBones.enabled) { // FISHBONES
    const count = levelConfig.items.fishBones.count;
    
    for (let i = 0; i < Math.min(count, eligiblePlatforms.length); i++) {
      let platformObj;
      let attempts = 0;
      do {
        platformObj = choose(eligiblePlatforms);
        attempts++;
      } while (usedPlatforms.has(platformObj) && attempts < 50);
      
      if (attempts >= 50) break; // FALLBACK
      
      usedPlatforms.add(platformObj);
      
      const x = platformObj.platform.x + rand(50, platformObj.platform.width - 50);
      const y = platformObj.platform.y - 70;
      
      add([
        sprite('fish'),
        pos(x, y),
        area({ width: 50, height: 50 }),
        anchor("center"),
        scale(0.6),
        "fishBones"
      ]);
    }
  }
  

  if (levelConfig.items.tunaCan.enabled) { // TUNA
    const count = levelConfig.items.tunaCan.count;
    
    for (let i = 0; i < Math.min(count, eligiblePlatforms.length); i++) {
      let platformObj;
      let attempts = 0;
      do {
        platformObj = choose(eligiblePlatforms);
        attempts++;
      } while (usedPlatforms.has(platformObj) && attempts < 50);
      
      if (attempts >= 50) break;
      
      usedPlatforms.add(platformObj);
      
      const x = platformObj.platform.x + rand(50, platformObj.platform.width - 50);
      const y = platformObj.platform.y - 70;
      
      add([
        sprite('tunaCan'),
        pos(x, y),
        area({ width: 50, height: 50 }),
        anchor("center"),
        scale(0.6),
        "tunaCan"
      ]);
    }
  }
  
 
  if (levelConfig.items.milkBottle.enabled && levelConfig.milkBottlePosition) { // MILK
    add([
      sprite('milkBottle'),
      pos(levelConfig.milkBottlePosition.x, levelConfig.milkBottlePosition.y),
      area({ width: 50, height: 50 }),
      anchor("center"),
      scale(0.6),
      "milkBottle"
    ]);
  }
  

  if (levelConfig.items.catnip.enabled && levelConfig.catnipZones) { // CATNIP
    const zone = choose(levelConfig.catnipZones); 
    add([
      sprite('catnip'),
      pos(zone.x, zone.y),
      area({ width: 50, height: 50 }),
      anchor("center"),
      scale(0.6),
      "catnip"
    ]);
  }
  
 
  if (levelConfig.items.bonusHP.enabled && levelConfig.bonusHPZone) { // EGG
    const zone = choose(levelConfig.bonusHPZone);
    add([
      sprite('egg'),
      pos(zone.x, zone.y),
      area({ width: 50, height: 50 }),
      anchor("center"),
      scale(0.8),
      "bonusHP"
    ]);
  }
}

export function setupSpecialItemCollection(player, livesGetter, livesSetter, scoreGetter, scoreSetter) {
 
  function showBubble(bubbleFrame) {
    const bubble = add([
      sprite('bubbles', { frame: bubbleFrame }),
      pos(player.pos.x + 160, player.pos.y - 20), 
      anchor("center"),
      z(100), 
      opacity(0),
      scale(3),
      "bubble"
    ]);
    
    tween(bubble.opacity, 1, 0.2, (val) => bubble.opacity = val);
    tween(bubble.scale.x, 1, 0.3, (val) => { bubble.scale.x = val; bubble.scale.y = val; });
    
    tween(bubble.pos.y, bubble.pos.y - 20, 1, (val) => bubble.pos.y = val);
    
    wait(1, () => {
      tween(bubble.opacity, 0, 0.3, (val) => bubble.opacity = val, easings.easeInQuad);
      wait(0.3, () => destroy(bubble));
    });
  }

  player.onCollide("fishBones", (item) => { // FISH BONES
    destroy(item);
    scoreSetter(scoreGetter() + 25); 
    play("happyMeow", { volume: 0.4 });
    showBubble(BUBBLE_FRAMES.plusTen);
  });
  
  player.onCollide("tunaCan", (item) => {
    console.log("🥫 TUNA COLLECTED - HP before:", player.hp, "Max:", player.maxHP);
    destroy(item);
    const healAmount = 25;
    player.hp = Math.min(player.hp + healAmount, player.maxHP);
    console.log("🥫 HP after:", player.hp);
    play("powerUp", { volume: 0.4 });
    showBubble(BUBBLE_FRAMES.plusHP);
  });
  
  player.onCollide("milkBottle", (item) => {
    destroy(item);
    livesSetter(livesGetter() + 1);
    play("extraLife", { volume: 0.5 });
    showBubble(BUBBLE_FRAMES.heart);
  });
  
  player.onCollide("catnip", (item) => {
    destroy(item);
    player.catnipActive = true;
    player.invulnerable = true;
    player.speed = player.baseSpeed * 1.2;
    
    player.rainbowActive = true;
    showBubble(BUBBLE_FRAMES.star);

    wait(15, () => {
      player.catnipActive = false;
      player.invulnerable = false;
      player.speed = player.baseSpeed;
      player.rainbowActive = false;

      player.curState = null;
    });
  });
  

  player.onCollide("bonusHP", (item) => { // EGG
    console.log("🥚 BONUS HP COLLECTED - HP before:", player.hp, "Max:", player.maxHP);
    destroy(item);
    const healAmount = 50;
    player.hp = Math.min(player.hp + healAmount, player.maxHP);
    console.log("🥚 HP after:", player.hp);
    play("egg", { volume: 0.5 });
    showBubble(BUBBLE_FRAMES.bonusHP); 
  });
}

//==================================== PLAYER  ====================================
export function createPlayer(levelConfig, character, startHP) {
  const prefix = character.name;
  
  const targetWidth = 128;
  const targetHeight = 92;
  const hitboxWidth = 90;
  const hitboxHeight = 90;
  const offsetX = 5;
  const offsetY = 0;

  const player = add([
    sprite(`${prefix}Sheet`, { frame: SPRITE_FRAMES.idle }),
    pos(levelConfig.playerSpawn.x, levelConfig.playerSpawn.y - 50),
    area({ 
      width: hitboxWidth,
      height: hitboxHeight,
      offset: vec2(offsetX, offsetY)
    }),
    body({
      gravityScale: 1
    }),
    scale(SPRITE_SCALES.idle), 
    anchor("center"),
    {
      speed: character.platformerStats.speed * 50,
      baseSpeed: character.platformerStats.speed * 50,
      playerJumpForce: Math.abs(character.platformerStats.jumpPower) * 65,
      maxFallSpeed: character.platformerStats.maxFallSpeed || 400,
      airControl: character.platformerStats.airControlMultiplier || 0.7,
      groundControl: character.platformerStats.groundControlMultiplier || 1.0,
      hp: startHP || character.stats.maxHP,
      maxHP: character.stats.maxHP,
      isMoving: false,
      facingRight: true,
      invulnerable: false,
      invulnerableTime: 0,
      catnipActive: false,
      rainbowActive: false,
      characterName: character.name,
      curState: 'idle'
    },
    "player"
  ]);

// DEBUG: HITBOX VISUALIZER
//   const debugHitbox = add([
//   rect(hitboxWidth, hitboxHeight),
//   pos(0, 0),
 //  color(255, 0, 0),
//  opacity(0.5), 
//   outline(2, rgb(255, 0, 0)),
//   anchor("center"),
//   z(1000),
//  "debugHitbox"
//  ]);

//   player.onUpdate(() => {
 //  const currentOffsetX = player.facingRight ? offsetX : -offsetX;
//   debugHitbox.pos = vec2(
 //   player.pos.x + currentOffsetX,
//   player.pos.y + offsetY
//    );
 //   });
  return player;
}

export function setupPlayerControls(player, gameStateGetter) {
  const hitboxWidth = 90;
  const hitboxHeight = 90;
  const baseOffsetX = 5;
  const offsetY = 0;
  
  let jumpPressed = false;

  onKeyPress("space", () => {
    jumpPressed = true;
  });
  
  onKeyRelease("space", () => {
    jumpPressed = false;
  });

player.onUpdate(() => {
  if (!gameStateGetter()) return;
  
  const controlMultiplier = player.isGrounded() 
    ? player.groundControl 
    : player.airControl;
  
  if (isKeyDown("left")) {
    const moveSpeed = player.speed * controlMultiplier;
    player.move(-moveSpeed, 0);
    player.isMoving = true;
    player.facingRight = false;
    player.flipX = true;
    player.area.offset = vec2(-baseOffsetX, offsetY);
  } else if (isKeyDown("right")) {
    const moveSpeed = player.speed * controlMultiplier;
    player.move(moveSpeed, 0);
    player.isMoving = true;
    player.facingRight = true;
    player.flipX = false;
    player.area.offset = vec2(baseOffsetX, offsetY);
  } else {
    player.isMoving = false;
  }
  
  if (isKeyDown("space") && player.isGrounded()) {
    const spriteSheet = player.rainbowActive ? "rainbowCatSheet" : `${player.characterName}Sheet`;
    const frames = player.rainbowActive ? RAINBOW_CAT_FRAMES : SPRITE_FRAMES;
    
    player.use(sprite(spriteSheet, { frame: frames.jumpStart }));
    player.curState = 'jumpStart';
    const currentScale = player.scale.x > 0 ? SPRITE_SCALES.jump : -SPRITE_SCALES.jump;
    player.scale = vec2(currentScale, SPRITE_SCALES.jump);
    
    player.jump(player.playerJumpForce); 
  }
  
  if (player.vel.y > player.maxFallSpeed) {
    player.vel.y = player.maxFallSpeed;
  }
});
}

export function updatePlayerAnim(player, character) {
  let newState;
  const grounded = player.isGrounded();

  if (!grounded) {
    if (player.vel.y < -100) {
      newState = 'jumpRising';
    } else if (player.vel.y > 100) {
      newState = 'jumpFalling';
    } else {
      newState = 'jumpRising';
    }
  } else if (player.isMoving) {
    newState = 'walk';
  } else {
    newState = 'idle';
  }

  if (newState !== player.curState) {
    player.curState = newState;
    
    const spriteSheet = player.rainbowActive ? "rainbowCatSheet" : `${character.name}Sheet`;
    const frames = player.rainbowActive ? RAINBOW_CAT_FRAMES : SPRITE_FRAMES;
    
    if (newState === 'walk') {
      player.use(sprite(spriteSheet));
      player.play("walk");
      const currentScale = player.scale.x > 0 ? SPRITE_SCALES.walk : -SPRITE_SCALES.walk;
      player.scale = vec2(currentScale, SPRITE_SCALES.walk);
    } else if (newState === 'jumpRising') {
      player.use(sprite(spriteSheet, { frame: frames.jumpRising }));
      const currentScale = player.scale.x > 0 ? SPRITE_SCALES.jump : -SPRITE_SCALES.jump;
      player.scale = vec2(currentScale, SPRITE_SCALES.jump);
    } else if (newState === 'jumpFalling') {
      player.use(sprite(spriteSheet, { frame: frames.jumpFalling }));
      const currentScale = player.scale.x > 0 ? SPRITE_SCALES.jump : -SPRITE_SCALES.jump;
      player.scale = vec2(currentScale, SPRITE_SCALES.jump);
    } else {
      player.use(sprite(spriteSheet, { frame: frames.idle }));
      const currentScale = player.scale.x > 0 ? SPRITE_SCALES.idle : -SPRITE_SCALES.idle;
      player.scale = vec2(currentScale, SPRITE_SCALES.idle);
      if (player.curAnim()) player.stop();
    }
  }
  
  player.flipX = !player.facingRight;
}
//==================================== PAUSE ====================================
export function setupLevelPause(gameActiveGetter, gameActiveSetter, onQuitCallback = null) {
  return setupPauseSystem(gameActiveGetter, gameActiveSetter, onQuitCallback);
}
//==================================== CAMERA ====================================
export function setupPlayerCamera(player, character, bg, gameStateGetter) {
  const bgElement = document.querySelector('.parallax-bg');

  player.onUpdate(() => {
  //if (window.debugCounts) window.debugCounts.player++; 
    if (gameStateGetter()) {
      setCamPos(player.pos.x, SCREEN_H / 2);
      
      if (bgElement) {
        bgElement.style.transform = `translateX(${-player.pos.x * 0.5}px)`;
      }
      
      updatePlayerAnim(player, character);
    }
  });
  }

//==================================== HUD ====================================
export function createUnifiedHUD(player, showDebug = true) {
  const hudElement = document.getElementById('hudStats');
  if (hudElement) {
    hudElement.classList.add('active');
  }
  
  if (showDebug) {
    const debugElement = document.getElementById('debugInfo');
    if (debugElement) {
      debugElement.style.display = 'block';
    }
  }
  
  return {};
}

export function updateUnifiedHUD(hudElements, score, timeLeft, player, lives) {
  const scoreText = document.getElementById('scoreText');
  if (scoreText) {
    scoreText.textContent = `Score: ${score}`;
  }
  
  const hpText = document.getElementById('hpText');
  const hpStat = document.getElementById('hpStat');
  if (hpText) {
    hpText.textContent = `HP: ${player.hp}/${player.maxHP}`;
  }
  
  if (hpStat) {
    if (player.hp <= player.maxHP * 0.25) {
      hpStat.classList.add('low-hp');
    } else {
      hpStat.classList.remove('low-hp');
    }
  }
  
  const livesText = document.getElementById('livesText');
  if (livesText) {
    livesText.textContent = `Lives: ${lives}`;
  }
  
  const timeText = document.getElementById('timeText');
  const timeStat = document.getElementById('timeStat');
  if (timeText) {
    timeText.textContent = `Time: ${timeLeft}`;
  }
  
  if (timeStat) {
    if (timeLeft <= 10) {
      timeStat.classList.add('low-time');
    } else {
      timeStat.classList.remove('low-time');
    }
  }
  
  const debugInfo = document.getElementById('debugInfo');
  if (debugInfo && debugInfo.style.display !== 'none') {
    debugInfo.textContent = `X: ${Math.round(player.pos.x)}  Y: ${Math.round(player.pos.y)}`;
  }
}

export function hideHUD() {
  const hudElement = document.getElementById('hudStats');
  if (hudElement) {
    hudElement.classList.remove('active');
  }
  
  const debugElement = document.getElementById('debugInfo');
  if (debugElement) {
    debugElement.style.display = 'none';
  }
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

//==================================== CUCS ====================================
export function setupCucumberSpawner(levelConfig, gameStateGetter) {
  if (!levelConfig.enemies.cucumbers.enabled) return;
  
  const spawnRate = levelConfig.enemies.cucumbers.spawnRate / 1000;
  const zones = levelConfig.enemies.cucumbers.spawnZones || [];
  
  if (zones.length === 0) {
    zones.push({ start: 0, end: levelConfig.length });
  }
  
  loop(spawnRate, () => {
    if (gameStateGetter()) {
      const camX = camPos().x;
      const camLeft = camX - SCREEN_W / 2;
      const camRight = camX + SCREEN_W / 2;
      
      const activeZones = zones.filter(zone => 
        zone.end > camLeft - 100 && 
        zone.start < camRight + 100
      );
      
      if (activeZones.length === 0) return;
      
      const zone = choose(activeZones);
      
      const spawnX = rand(
        Math.max(zone.start, camLeft),
        Math.min(zone.end, camRight)
      );
      
      const spawnY = -50;
      
      const cucumber = add([
        sprite('littleCucumber'),
        pos(spawnX, spawnY),
        area({ width: 40, height: 60 }),
        anchor("center"),
        scale(0.8),
        rotate(0),
        {
          fallSpeed: rand(3, 6),
          rotationSpeed: rand(2, 5),
          damage: levelConfig.enemies.cucumbers.damage,
          isActive: true
        },
        z(3),
        "cucumber"
      ]);
      
      cucumber.onUpdate(() => {
        const distFromCam = Math.abs(cucumber.pos.x - camPos().x);
        
        if (distFromCam > SCREEN_W * 0.75) {
          cucumber.isActive = false;
          return;
        }
        
        cucumber.isActive = true;
        cucumber.pos.y += cucumber.fallSpeed;
        cucumber.angle += cucumber.rotationSpeed;
        
        if (cucumber.pos.y > SCREEN_H + 100) {
          destroy(cucumber);
        }
      });
    }
  });
}

export function setupCucumberCollision(
  player, 
  levelConfig, 
  gameStateGetter, 
  gameStateSetter, 
  levelName, 
  scoreGetter, 
  livesGetter, 
  livesSetter, 
  characterGetter,
  startingScore = 0  
) {
  player.onCollide("cucumber", (cucumber) => {
    if (!player.invulnerable && !player.catnipActive) {
      player.hp -= cucumber.damage;
      player.invulnerable = true;
      
      play("takeHit", { volume: 0.4 });
      destroy(cucumber);
      
      const flashInterval = setInterval(() => {
        player.opacity = player.opacity === 1 ? 0.3 : 1;
      }, 100);
      
      wait(1, () => {
        clearInterval(flashInterval);
        player.opacity = 1;
        player.invulnerable = false;
      });
      
      if (player.hp <= 0) {
        gameStateSetter(false);
        const currentLives = livesGetter();
        const character = characterGetter ? characterGetter() : null;
        
        if (currentLives > 0) {
          go("youDied", {
            score: scoreGetter(),
            level: levelName,
            lives: currentLives,
            character,
            reason: "Hit by cucumber",
            startingScore  
          });
        } else {
          playBloodDripAnimation(gameStateSetter, scoreGetter, levelName, character);
        }
      }
    }
  });
}

//==================================== RATS ====================================
export function setupRatSpawner(levelConfig, gameStateGetter, player) {
  if (!levelConfig.enemies.rats.enabled) return;
  
  const spawnRate = levelConfig.enemies.rats.spawnRate / 1000;
  const zones = levelConfig.enemies.rats.spawnZones || [];
  
  if (zones.length === 0) {
    zones.push({ start: 0, end: levelConfig.length });
  }
  
  const groundMap = new Map();
  const gridSize = 50; 
  
  for (let x = 0; x < levelConfig.length; x += gridSize) {
    const hasGround = levelConfig.GroundSegments.some(segment => 
      x >= segment.x && 
      x <= segment.x + segment.width &&
      segment.y >= 380 && 
      segment.y <= 450
    );
    groundMap.set(Math.floor(x / gridSize), hasGround);
  }
  
  const hasGroundAt = (x) => {
    const gridX = Math.floor(x / gridSize);
    return groundMap.get(gridX) || false;
  };
  
  loop(spawnRate, () => {
    if (gameStateGetter()) {
      const camX = camPos().x;
      const camLeft = camX - SCREEN_W / 2;
      const camRight = camX + SCREEN_W / 2;
      
      const activeZones = zones.filter(zone => 
        zone.end > camLeft - 200 && 
        zone.start < camRight + 200
      );
      
      if (activeZones.length === 0) return;
      
      const zone = choose(activeZones);
      
      const offScreenAreas = [];
      
      if (zone.start < camLeft - 100) {
        offScreenAreas.push({
          start: Math.max(zone.start + 100, zone.start),
          end: Math.min(camLeft - 100, zone.end - 100)
        });
      }
      
      if (zone.end > camRight + 100) {
        offScreenAreas.push({
          start: Math.max(camRight + 100, zone.start + 100),
          end: Math.min(zone.end - 100, zone.end)
        });
      }
      
      if (offScreenAreas.length === 0) return;
      
      const spawnArea = choose(offScreenAreas);
      const spawnX = rand(spawnArea.start, spawnArea.end);
      const spawnY = 390;
      
      if (!hasGroundAt(spawnX)) {
        console.warn(`Rat spawn aborted at x:${spawnX} - no ground detected!`);
        return;
      }
      
      const rat = add([
        sprite('smallRat2'),
        pos(spawnX, spawnY),
        area({ width: 40, height: 30 }),
        anchor("center"),
        scale(1),
        {
          speed: rand(60, 100),
          direction: -1,
          hp: 1,
          yVelocity: 0,
          patrolZone: zone,
          groundCheckDistance: 50,
          baseY: spawnY,
          bobTimer: rand(0, 100), 
          bobSpeed: rand(8, 12),
          bobAmount: rand(2, 4),
          leftBoundary: zone.start + 50,
          rightBoundary: zone.end - 50,
          hasGroundAt: hasGroundAt 
        },
        z(3),
        "rat"
      ]);
      
      rat.onUpdate(() => {
          //if (window.debugCounts) window.debugCounts.rats++; 

        const distFromCam = Math.abs(rat.pos.x - camPos().x);
        if (distFromCam > SCREEN_W * 1.2) {
          return;
        }
     
        rat.move(rat.speed * rat.direction, 0);
        rat.flipX = rat.direction === 1;
        
        rat.bobTimer += dt() * rat.bobSpeed;
        const bobOffset = Math.sin(rat.bobTimer) * rat.bobAmount;
        
        if (rat.pos.y < rat.baseY) {
          rat.yVelocity += 1600 * dt();
          rat.pos.y += rat.yVelocity * dt();
        } else {
          rat.pos.y = rat.baseY + bobOffset;
          rat.yVelocity = 0;
        }
        
        if (rat.direction === -1 && rat.pos.x <= rat.leftBoundary) {
          rat.direction = 1;
        } else if (rat.direction === 1 && rat.pos.x >= rat.rightBoundary) {
          rat.direction = -1;
        }
        
        const distFromLeft = rat.pos.x - rat.leftBoundary;
        const distFromRight = rat.rightBoundary - rat.pos.x;
        const nearEdge = Math.min(distFromLeft, distFromRight) < 100;
        
        if (nearEdge) {
          const checkX = rat.pos.x + (rat.direction * rat.groundCheckDistance);
          if (!rat.hasGroundAt(checkX)) {
            rat.direction *= -1;
          }
        }
        
        if (rat.pos.x < camPos().x - SCREEN_W - 200 || 
            rat.pos.x > camPos().x + SCREEN_W + 200) {
          destroy(rat);
        }
      });
    }
  });
}

export function setupRatCollision(
  player, 
  levelConfig, 
  gameStateGetter, 
  gameStateSetter, 
  levelName, 
  scoreGetter, 
  scoreSetter, 
  livesGetter, 
  livesSetter, 
  characterGetter,
  startingScore = 0  
) {
  const hitboxHeight = player.area.height || 60;
  const hitboxOffsetY = player.area.offset?.y || 0;
  
  player.onCollide("rat", (rat) => {
    const playerBottom = player.pos.y + (hitboxHeight / 2) + hitboxOffsetY;
    const ratTop = rat.baseY - 15;
    rat.z = 3;
    
    if (player.vel.y > 100 && playerBottom < ratTop) {
      destroy(rat);
      animateGhostPoof(rat);
      
      scoreSetter(scoreGetter() + 5);
      player.jump(400);
      play("ratKill", { volume: 0.4 });
      
    } else {
      if (!player.invulnerable && !player.catnipActive) {
        player.hp -= 10;
        player.invulnerable = true;
        
        play("takeHit", { volume: 0.4 });
        
        const flashInterval = setInterval(() => {
          player.opacity = player.opacity === 1 ? 0.3 : 1;
        }, 100);
        
        wait(1, () => {
          clearInterval(flashInterval);
          player.opacity = 1;
          player.invulnerable = false;
        });
        
        if (player.hp <= 0) {
          gameStateSetter(false);
          const currentLives = livesGetter();
          const character = characterGetter ? characterGetter() : null;
          
          if (currentLives > 0) {
            go("youDied", {
              score: scoreGetter(),
              level: levelName,
              lives: currentLives,
              character,
              reason: "RABIES!",
              startingScore  
            });
          } else {
            playBloodDripAnimation(gameStateSetter, scoreGetter, levelName, character);
          }
        }
      }
    }
  });
}

//==================================== LASERS ====================================
export function addLaserBeams(levelConfig) {
  if (!levelConfig.enemies.lasers.enabled) return;
  
  const positions = levelConfig.enemies.lasers.positions || [];
  
  if (positions.length === 0) {
    const count = levelConfig.enemies.lasers.count || 3;
    const spacing = levelConfig.length / (count + 1);
    for (let i = 1; i <= count; i++) {
      positions.push(spacing * i);
    }
  }
  
  positions.forEach(x => {
    const laser = add([
      rect(3, 390),
      pos(x, 50),
      area(),
      color(255, 0, 0),
      opacity(0.7),
      z(5),
      {
        isActive: true,
        scanPos: 0,
        scanDirection: 1,
        scanSpeed: 100,
        cycleTimer: 0,
        cycleDuration: 4,
        baseX: x, 
        nearCamera: false
      },
      "laser"
    ]);
    
    laser.onUpdate(() => {
       // if (window.debugCounts) window.debugCounts.lasers++; 

      const camX = camPos().x;
      const distFromCam = Math.abs(laser.baseX - camX);
      laser.nearCamera = distFromCam < SCREEN_W;
      
      if (!laser.nearCamera) {
        laser.isActive = false;
        laser.opacity = 0;
        return;
      }
      
      laser.cycleTimer += dt();
      
      if (laser.cycleTimer < 2) {
        laser.isActive = true;
        laser.opacity = 0.7;
        
        laser.scanPos += laser.scanSpeed * laser.scanDirection * dt();
        if (laser.scanPos > 50 || laser.scanPos < -50) {
          laser.scanDirection *= -1;
        }
        laser.pos.x = laser.baseX + laser.scanPos;
        
      } else {
        laser.isActive = false;
        laser.opacity = 0;
      }
      
      if (laser.cycleTimer >= laser.cycleDuration) {
        laser.cycleTimer = 0;
        laser.scanPos = 0;
      }
    });
  });
}

export function setupLaserCollision(
  player, 
  levelConfig, 
  gameStateGetter, 
  gameStateSetter, 
  levelName, 
  scoreGetter, 
  livesGetter, 
  livesSetter, 
  characterGetter,
  startingScore = 0  
) {
  player.onCollide("laser", (laser) => {
    if (laser.isActive && !player.invulnerable && !player.catnipActive) {
      player.hp -= 5;
      player.invulnerable = true;
      
      play("takeHit", { volume: 0.4 });
      
      const flashInterval = setInterval(() => {
        player.opacity = player.opacity === 1 ? 0.3 : 1;
      }, 100);
      
      wait(1, () => {
        clearInterval(flashInterval);
        player.opacity = 1;
        player.invulnerable = false;
      });
      
      if (player.hp <= 0) {
        gameStateSetter(false);
        const currentLives = livesGetter();
        const character = characterGetter ? characterGetter() : null;

        if (currentLives > 0) {
          go("youDied", {
            score: scoreGetter(),
            level: levelName,
            lives: currentLives,
            character,
            reason: "Lasered 😵",
            startingScore  
          });
        } else {
          playBloodDripAnimation(gameStateSetter, scoreGetter, levelName, character);
        }
      }
    }
  });
}
// ==================================== MINI BOSS ====================================
export function addMiniBoss(levelConfig, gameStateGetter, player) {
  if (!levelConfig.miniBoss?.enabled) return null;
  
  const boss = levelConfig.miniBoss;
  
  const miniBoss = add([
    sprite('miniBossRat', { frame: 0 }),
    pos(boss.x, boss.y),
    area({ width: 100, height: 100 }),
    anchor("center"),
    scale(1.6),
    {
      hp: boss.hp || 3,
      maxHP: boss.hp || 3,
      throwTimer: 0,
      throwInterval: boss.throwInterval || 2,
      cucumberSpeed: boss.cucumberSpeed || 200,
      defeated: false,
      introPlayed: false,
      // MOVEMENT
      moveTimer: 0,
      moveInterval: 1.5,
      moveDirection: 1,
      moveSpeed: 100,
      originalX: boss.x,
      moveRange: 400,
      // ANIMATION
      currentState: 'walking',
      walkTimer: 0,
      throwingCucumber: false
    },
    z(10),
    "miniBoss"
  ]);
  
  // MINI BOSS INTRO
  miniBoss.onUpdate(() => {
    const distFromCam = Math.abs(miniBoss.pos.x - camPos().x);
    if (distFromCam > SCREEN_W * 1.5) {
      return; 
    }
    const onPlatform = player.pos.y < 400;
    
    if (!miniBoss.introPlayed && player.pos.x > boss.x - 800 && onPlatform) {
      miniBoss.introPlayed = true;
      
      const bossExclamation = add([
        sprite('bubbles', { frame: BUBBLE_FRAMES.exclamation }),
        pos(miniBoss.pos.x, miniBoss.pos.y - 80),
        anchor("center"),
        scale(1.5),
        z(100),
        opacity(0),
        "bubble"
      ]);
      
      tween(bossExclamation.opacity, 1, 0.2, (val) => bossExclamation.opacity = val);
      tween(bossExclamation.scale.x, 1.8, 0.3, (val) => {
        bossExclamation.scale.x = val;
        bossExclamation.scale.y = val;
      });
      
      play("meow01", { volume: 0.4 });
      
      wait(0.5, () => {
        const catBeep = add([
          sprite('bubbles', { frame: BUBBLE_FRAMES.beep }),
          pos(player.pos.x, player.pos.y - 70),
          anchor("center"),
          scale(1.3),
          z(100),
          opacity(0),
          "bubble"
        ]);
        
        tween(catBeep.opacity, 1, 0.2, (val) => catBeep.opacity = val);
        tween(catBeep.scale.x, 1.6, 0.3, (val) => {
          catBeep.scale.x = val;
          catBeep.scale.y = val;
        });
        
        play("meow02", { volume: 0.3 });
        
        wait(1.5, () => {
          tween(bossExclamation.opacity, 0, 0.3, (val) => bossExclamation.opacity = val);
          tween(catBeep.opacity, 0, 0.3, (val) => catBeep.opacity = val);
          wait(0.3, () => {
            destroy(bossExclamation);
            destroy(catBeep);
          });
        });
      });
    }
    
    if (miniBoss.defeated || !gameStateGetter() || !miniBoss.introPlayed) return;
    
    const playerOnPlatform = player.pos.y < 400;
    if (!playerOnPlatform) return;
    
    
    // STATE: WALKING
    if (miniBoss.currentState === 'walking') {
      // MOVEMENT
      miniBoss.moveTimer += dt();
      if (miniBoss.moveTimer >= miniBoss.moveInterval) {
        miniBoss.moveTimer = 0;
        miniBoss.moveDirection *= -1;
      }
      
      const targetX = miniBoss.originalX + (miniBoss.moveDirection * miniBoss.moveRange / 2);
      const moveTowards = targetX - miniBoss.pos.x;
      
      if (Math.abs(moveTowards) > 10) {
        miniBoss.pos.x += Math.sign(moveTowards) * miniBoss.moveSpeed * dt();
      }
      
      miniBoss.walkTimer += dt();
      if (miniBoss.walkTimer > 0.25) {
        miniBoss.walkTimer = 0;
        const newFrame = miniBoss.frame === 0 ? 1 : 0;
        miniBoss.use(sprite('miniBossRat', { frame: newFrame }));
      }
      
      miniBoss.throwTimer += dt();
      if (miniBoss.throwTimer >= miniBoss.throwInterval && !miniBoss.throwingCucumber) {
        miniBoss.throwTimer = 0;
        miniBoss.throwingCucumber = true;
        miniBoss.currentState = 'throwing';
        playThrowSequence(miniBoss);
      }
    }
  });
  
  async function playThrowSequence(miniBoss) {
    miniBoss.use(sprite('miniBossRat', { frame: 2 }));
    await wait(0.2);
        miniBoss.use(sprite('miniBossRat', { frame: 3 }));
    await wait(0.15);
        miniBoss.use(sprite('miniBossRat', { frame: 4 }));
    await wait(0.1);
    miniBoss.use(sprite('miniBossRat', { frame: 5 }));
    await wait(0.1);
    miniBoss.use(sprite('miniBossRat', { frame: 6 }));
    const cucumber = add([
      sprite('littleCucumber'),
      pos(miniBoss.pos.x - 40, miniBoss.pos.y),
      area({ width: 30, height: 40 }),
      anchor("center"),
      scale(0.9),
      {
        vel: vec2(-miniBoss.cucumberSpeed, -550),
        rotationSpeed: 360,
        gravity: 500,
        reflected: false,
        damage: 15
      },
      z(9),
      "miniBossCucumber"
    ]);
    
    play("throw", { volume: 0.7 });
    
    cucumber.onUpdate(() => {
       // if (window.debugCounts) window.debugCounts.cucumbers++; 

      cucumber.vel.y += cucumber.gravity * dt();
      cucumber.pos = cucumber.pos.add(cucumber.vel.x * dt(), cucumber.vel.y * dt());
      cucumber.angle += cucumber.rotationSpeed * dt();
      
      if (cucumber.pos.y > 500 || cucumber.pos.x < camPos().x - 500) {
        destroy(cucumber);
      }
    });
    
    await wait(0.2);
    
    miniBoss.currentState = 'walking';
    miniBoss.throwingCucumber = false;
    miniBoss.walkTimer = 0;
  }
  
  return miniBoss;
}

export function setupMiniBossReflect(player, miniBoss, onDefeatCallback) {
  if (!miniBoss) return;
  
  player.onCollide("miniBossCucumber", (cucumber) => {
    const hitboxHeight = player.area.height || 60;
    const hitboxOffsetY = player.area.offset?.y || 0;
    const playerTop = player.pos.y - (hitboxHeight / 2) + hitboxOffsetY;
    const playerBottom = player.pos.y + (hitboxHeight / 2) + hitboxOffsetY;
    const cucumberBottom = cucumber.pos.y + 20;
    const cucumberTop = cucumber.pos.y - 20;
    
    console.log("🥒 Cucumber collision!");
    console.log("Player vel.y:", player.vel.y);
    console.log("Player top:", playerTop, "Cucumber bottom:", cucumberBottom);
    console.log("Already reflected?", cucumber.reflected);

    const verticalOverlap = Math.min(playerBottom, cucumberBottom) - Math.max(playerTop, cucumberTop);
    const isMovingUp = player.vel.y < 100; // IF NEEDS TO BE MORE FORGIVING ALLOW REFLECTION WHEN MOVING SLOWILY UP - INCREASE THIS: (player.vel.y < 100 )
    const isInReflectZone = playerTop < cucumberBottom + 50; // IF NEEDS TO BE MORE FORGIVING, INCREASE THE 50
    const hasVerticalOverlap = verticalOverlap > 0; // ANY OVERLAP COUNTS

    if (!cucumber.reflected && isMovingUp && (isInReflectZone || hasVerticalOverlap)) { 
      cucumber.reflected = true;
      cucumber.vel.x = Math.abs(cucumber.vel.x) * 1.5;
      cucumber.vel.y = -300;
      cucumber.rotationSpeed = -720;
      
      play("reflect", { volume: 0.7});
      
      cucumber.color = rgb(255, 255, 100);
      
    } else if (!cucumber.reflected && !player.invulnerable) {
      player.hp -= cucumber.damage;
      player.invulnerable = true;
      
      play("takeHit", { volume: 0.4 });
      destroy(cucumber);
      console.log("💔 Hit by cucumber!");

      const flashInterval = setInterval(() => {
        player.opacity = player.opacity === 1 ? 0.3 : 1;
      }, 100);
      
      wait(1, () => {
        clearInterval(flashInterval);
        player.opacity = 1;
        player.invulnerable = false;
      });
    }
  });
  
  miniBoss.onCollide("miniBossCucumber", (cucumber) => {
    if (cucumber.reflected) {
      miniBoss.hp -= 1;
      destroy(cucumber);
      
      shake(10);
      play("ratKill", { volume: 0.6 });
      console.log("🎯 Boss hit! HP:", miniBoss.hp);

      const originalColor = miniBoss.color || rgb(255, 255, 255);
      miniBoss.color = rgb(255, 100, 100);
      wait(0.2, () => miniBoss.color = originalColor);
      
      if (miniBoss.hp <= 0 && !miniBoss.defeated) {
        miniBoss.defeated = true;
        
        const defeatBubble = add([
          sprite('bubbles', { frame: BUBBLE_FRAMES.hit2 }),
          pos(miniBoss.pos.x, miniBoss.pos.y - 60),
          anchor("center"),
          scale(0),
          z(100),
          "bubble"
        ]);
        
        tween(defeatBubble.scale.x, 2, 0.3, (val) => {
          defeatBubble.scale.x = val;
          defeatBubble.scale.y = val;
        }, easings.easeOutBack);
        
        wait(0.5, () => {
          destroy(defeatBubble);
          animateGhostPoof(miniBoss);
          destroy(miniBoss);
          play("miniBossDie", { volume: 0.7 });
          if (onDefeatCallback) onDefeatCallback();
        });
      }
    }
  });
}

export function spawnRewardItems(positions) {
  positions.forEach(position => {
    if (position.type === 'egg') {
      add([
        sprite('egg'),
        pos(position.x, position.y),
        area({ width: 50, height: 50 }),
        anchor("center"),
        scale(0),
        z(15),
        "bonusHP"
      ]);
      
      const egg = get("bonusHP")[get("bonusHP").length - 1];
      tween(0, 0.8, 0.5, (val) => {
        egg.scale = vec2(val, val);
      }, easings.easeOutBack);
      
    } else if (position.type === 'milk') {
      add([
        sprite('milkBottle'),
        pos(position.x, position.y),
        area({ width: 50, height: 50 }),
        anchor("center"),
        scale(0),
        z(15),
        "milkBottle"
      ]);
      
      const milk = get("milkBottle")[get("milkBottle").length - 1];
      wait(0.2, () => {
        tween(0, 0.6, 0.5, (val) => {
          milk.scale = vec2(val, val);
        }, easings.easeOutBack);
      });
    }
  });
}