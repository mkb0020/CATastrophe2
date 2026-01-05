// levelHelpers.js
import { SCREEN_W, SCREEN_H, Colors, BUBBLE_FRAMES } from '../config/gameConfig.js';
import { spawnEnemy, handlePlayerEnemyCollision, updateEnemies } from '../systems/levelSystem.js';
import { setupPauseSystem,createVolumeToggle, stopAllMusic, startLevelMusic, startBossMusic, startFinalBossMusic} from '../helpers/kittyHelpers.js';
import { animateGhostPoof } from '../helpers/bossHelpers.js';
import { rainbowCat, SPRITE_FRAMES } from '../config/characters.js';

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

export function updatePlayerAnim(player, character) {
  let newState;
  const grounded = player.isGrounded();

  if (!grounded) {
    newState = 'jump';
  } else if (player.isMoving) {
    newState = 'walk';
  } else {
    newState = 'idle';
  }

  if (newState !== player.curState) {
    player.curState = newState;
    
    const activePrefix = player.rainbowActive ? "rainbowCat" : character.name;
    
    if (newState === 'walk') {
      player.use(sprite(`${activePrefix}Walk`));
      player.play("walk");
    } else if (newState === 'jump') {
      player.use(sprite(`${activePrefix}Platformer`, { frame: SPRITE_FRAMES.jump }));
    } else {
      player.use(sprite(`${activePrefix}Platformer`, { frame: SPRITE_FRAMES.idle }));
      if (player.curAnim()) player.stop();
    }
  }
}

export function setupLevelMusic(levelConfig) {
  startLevelMusic(levelConfig.levelMusic);
}

export function addLevelEnvironment(levelConfig) {
  const bg = add([
    sprite(levelConfig.background, { anim: "idle" }),
    pos(0, 0),
    scale(2, 2),
    z(-1),
    "background"
  ]);

  const yeet = add([
    sprite('yeet'),
    pos(-960, 265),
    scale(1.9),
    z(2),
  ]);

  levelConfig.platforms.forEach((platform, index) => {
    const isHintPlatform = levelConfig.hintPlatforms?.includes(index);
    
   
    const baseLayer = add([
      rect(platform.width, platform.height, { radius: 5 }),
      pos(platform.x, platform.y),
      color(isHintPlatform ? rgb(120, 80, 180) : rgb(97, 9, 165)), 
      opacity(0.7),
      z(0),
      isHintPlatform ? "hintPlatformBase" : "platformBase"
    ]);

    const topHeight = platform.height * 0.45;
    
    
    const topLayer = add([
      rect(platform.width, topHeight, { radius: [5, 5, 0, 0] }), 
      pos(platform.x, platform.y),
      color(isHintPlatform ? rgb(100, 255, 255) : rgb(0, 255, 255)), 
      z(1),
      isHintPlatform ? "hintPlatformTop" : "platformTop"
    ]);

  
    const collisionLayer = add([
      rect(platform.width, platform.height, { radius: 5 }),
      pos(platform.x, platform.y),
      area(),
      opacity(0),
      "platform",
      "oneWayPlatform",
      z(2)
    ]);
    
   
    if (isHintPlatform) {
      collisionLayer.baseLayer = baseLayer;
      collisionLayer.topLayer = topLayer;
    }
  });


  levelConfig.GroundSegments.forEach(GroundSegment => {
    add([
      rect(GroundSegment.width, GroundSegment.height, { radius: 0 }),
      pos(GroundSegment.x, GroundSegment.y),
      color(rgb(43, 4, 73)),
      outline(2, rgb(43, 4, 73)),
      z(0)
    ]);

    const topHeight = GroundSegment.height * 0.4;
    add([
      rect(GroundSegment.width, topHeight),
      pos(GroundSegment.x, GroundSegment.y),
      color(rgb(57, 5, 97)),
      z(1)
    ]);

    add([
      rect(GroundSegment.width, GroundSegment.height, { radius: 0 }),
      pos(GroundSegment.x, GroundSegment.y),
      area(),
      body({ isStatic: true }),
      opacity(0),
      "ground",
      z(2)
    ]);
  });


  add([
    rect(15000, 480),
    pos(-1000, 0),
    color(0, 0, 0),
    opacity(0.1),
    z(0)
  ]);

  return { bg };
}


export function setupHintPlatforms(player) {
  const activatedPlatforms = new Set();
  
  player.onGround((platform) => {
    if (platform.is("oneWayPlatform") && platform.baseLayer && !activatedPlatforms.has(platform)) {
      activatedPlatforms.add(platform);
      
     
      tween(
        platform.baseLayer.color, 
        rgb(218, 165, 32), 
        0.3, 
        (val) => platform.baseLayer.color = val,
        easings.easeOutQuad
      );
      
     
      tween(
        platform.topLayer.color, 
        rgb(255, 215, 0),
        0.3, 
        (val) => platform.topLayer.color = val,
        easings.easeOutQuad
      ).then(() => {
        platform.baseLayer.glowing = true;
        platform.topLayer.glowing = true;
      });
      
      
      play("powerUp", { volume: 0.3, speed: 1.5 }); // PLACEHOLDER
    }
  });
  
  
  onUpdate(() => {
    get("hintPlatformBase").forEach(base => {
      if (base.glowing) {
        const pulse = Math.sin(time() * 3) * 0.1 + 0.9;
        base.color = rgb(218 * pulse, 165 * pulse, 32 * pulse);
      }
    });
    
    get("hintPlatformTop").forEach(top => {
      if (top.glowing) {
        const pulse = Math.sin(time() * 3) * 0.1 + 0.9;
        top.color = rgb(255 * pulse, 215 * pulse, 0);
      }
    });
  });
}

export function setupOneWayPlatforms(player) {
  player.onCollide("oneWayPlatform", (platform) => {

    const playerBottom = player.pos.y + player.height / 2;
    const platformTop = platform.pos.y - platform.height / 2;
    
    if (player.vel.y > 0 && playerBottom < platformTop + 10) {
      player.pos.y = platformTop - player.height / 2;
      player.vel.y = 0;
      
      if (!platform.has("body")) {
        platform.use(body({ isStatic: true }));
      }
    }
  });
    player.onUpdate(() => {
    get("oneWayPlatform").forEach(platform => {
      const playerBottom = player.pos.y + player.height / 2;
      const platformTop = platform.pos.y - platform.height / 2;
      
      if (player.vel.y < 0 || playerBottom > platformTop + 20) {
        if (platform.has("body")) {
          platform.unuse("body");
        }
      }
    });
  });
}

export function addUIBackgrounds() {
  add([
    rect(200, 36, { radius: 50 }),
    pos(130, 15),
    fixed(),
    color(Color.fromHex("#000000")),
    opacity(1),
    outline(2, Color.fromHex(Colors.NuclearFuscia)),
    z(99)
  ]);

  add([
    rect(200, 36, { radius: 50 }),
    pos(350, 15),
    fixed(),
    color(Color.fromHex("#000000")),
    opacity(1),
    outline(2, Color.fromHex(Colors.PlasmaPurple)),
    z(99)
  ]);

  add([
    rect(200, 36, { radius: 50 }),
    pos(570, 15),
    fixed(),
    color(Color.fromHex("#000000")),
    opacity(1),
    outline(2, Color.fromHex(Colors.MintBlue)),
    z(99)
  ]);

  add([
    rect(200, 36, { radius: 50 }),
    pos(790, 15),
    fixed(),
    color(Color.fromHex("#000000")),
    opacity(1),
    outline(2, Color.fromHex(Colors.RadioactiveGreen)),
    z(99)
  ]);

  add([
    rect(100, 36, { radius: 50 }),
    pos(10, 15),
    fixed(),
    color(Color.fromHex("#000000")),
    opacity(1),
    outline(2, Color.fromHex(Colors.LightGray)),
    z(99)
  ]);
}

export function addVictoryArea(levelConfig) {
  const catTower = add([
    sprite('catTower'),
    pos(levelConfig.length - 750, 150),
    scale(1),
    z(1),
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

  let pulseTime = 0;

      arrow.onUpdate(() => {
        pulseTime += dt();

        const pulseScale = 0.7 + Math.sin(pulseTime * 6) * 0.04; 
        arrow.scale = vec2(pulseScale);
        });

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




export function addCups(levelConfig) {
  if (!levelConfig.cups.enabled) return new Set();
  
  const totalCups = levelConfig.cups.count;
  const platforms = levelConfig.platforms;
  
  const isInNoStuffZone = (platform) => { // noStuffZone CHECKER
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
  

  for (let idx of shuffledIndices) {
    if (cupsPlaced >= totalCups) break;
    
    const platform = platforms[idx];
    
    const x = platform.x + (platform.width / 2);
    const y = platform.y - 61;
    
    add([
      sprite('cup'),
      pos(x, y),
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
    
    cupsPlaced++;
    platformsWithCups.add(idx);
  }
  
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
      platform.width >= 200 && 
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
    player.speed = player.baseSpeed * 1.5;
    
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
    play("powerUp", { volume: 0.5 });
    showBubble(BUBBLE_FRAMES.bonusHP); 
  });
}



export function createPlayer(levelConfig, character, startHP) {
  const prefix = character.name;

  const player = add([
    sprite(`${prefix}Platformer`, { frame: SPRITE_FRAMES.idle }),
    pos(levelConfig.playerSpawn.x, levelConfig.playerSpawn.y - 50),
    area(),
    body(),
    scale(1.0),
    {
      speed: character.platformerStats.speed * 50,
      baseSpeed: character.platformerStats.speed * 50,
      playerJumpForce: Math.abs(character.platformerStats.jumpPower) * 65,
      hp: startHP || character.stats.maxHP,
      maxHP: character.stats.maxHP,
      isMoving: false,
      facingRight: true,
      invulnerable: false,
      invulnerableTime: 0,
      catnipActive: false,
      rainbowActive: false,
      curState: 'idle'
    },
    "player"
  ]);

  return player;
}

export function setupPlayerControls(player, gameStateGetter) {
  onKeyDown("left", () => {
    if (gameStateGetter()) {
      player.move(-player.speed, 0);
      player.isMoving = true;
      player.facingRight = false;
      player.flipX = true;
    }
  });

  onKeyDown("right", () => {
    if (gameStateGetter()) {
      player.move(player.speed, 0);
      player.isMoving = true;
      player.facingRight = true;
      player.flipX = false;
    }
  });

  onKeyRelease(["left", "right"], () => { 
    player.isMoving = false; 
  });

  onKeyPress("space", () => {
    if (gameStateGetter() && player.isGrounded()) {
      player.jump(player.playerJumpForce);
    }
  });
}

export function createUnifiedHUD(player, showDebug = true) {

  const scoreText = add([
    text(`Score: 0`, { size: 22, font: "science" }),
    pos(230, 35),
    anchor("center"),
    fixed(),
    z(100),
    color(Color.fromHex(Colors.White)),
    "scoreText"
  ]);

  const hpText = add([
    text(`HP: ${player.hp}/${player.maxHP}`, { size: 22, font: "science" }),
    pos(450, 35),
    anchor("center"),
    fixed(),
    z(100),
    color(Color.fromHex(Colors.White)),
    "hpText"
  ]);

  const livesText = add([
    text(`Lives: 3`, { size: 22, font: "science" }),
    pos(670, 35),
    anchor("center"),
    fixed(),
    z(100),
    color(Color.fromHex(Colors.White)),
    "livesText"
  ]);

  const clock = add([
    sprite('clock'),
    pos(840, 32),
    anchor("center"),
    fixed(),
    scale(0.24),
    z(101),
    "clock"
  ]);

  const timerText = add([
    text(`: 0s`, { size: 22, font: "science" }),
    pos(905, 35),
    anchor("center"),
    fixed(),
    z(100),
    color(Color.fromHex(Colors.White)),
    "timerText"
  ]);

  let debugText = null;
    if (showDebug) {
      debugText = add([
        text(`X: 0  Y: 0`, { size: 30, font: "monospace" }),
        pos(10, 80),
        fixed(),
        z(100),
        color(Color.fromHex("#00FFFF")),
        "debugText"
      ]);
    }

  return { scoreText, hpText, livesText, timerText, clock, debugText };
}

export function updateUnifiedHUD(hudElements, score, timeLeft, player, lives) {
  hudElements.scoreText.text = `Score: ${score}`;
  hudElements.hpText.text = `HP: ${player.hp}/${player.maxHP}`;
  hudElements.livesText.text = `Lives: ${lives}`;
  hudElements.timerText.text = `: ${timeLeft}s`;
  
  if (timeLeft < 10) {
    hudElements.timerText.color = Color.fromHex(Colors.RadiationRed);
  }

  if (hudElements.debugText) {
    hudElements.debugText.text = `X: ${Math.round(player.pos.x)}  Y: ${Math.round(player.pos.y)}`;
  }
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
      player.use(sprite(`${prefix}Platformer`, { frame: SPRITE_FRAMES.idle })); 
      
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
      play('bossLand');
      
      await wait(0.2);
      
  const exclamationBubble = add([
    sprite('bubbles', { frame: BUBBLE_FRAMES.exclamation }),
    pos(bossX - 45, 65),
    scale(1.8),
    z(15),
    "bubble"
  ]);
      
      await wait(0.7);
      
  play('meow02');
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



export function setupTimer(levelConfig, gameStateGetter, gameStateSetter, timeLeftGetter, timeLeftSetter, levelName, scoreGetter, livesGetter, livesSetter, characterGetter) {
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
            reason: "Time ran out!"
          });
        } else {
          playBloodDripAnimation(gameStateSetter, scoreGetter, levelName, character);
        }

      }
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
  characterGetter
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
          reason: "Fell into the abyss"
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
      
      const activeZones = zones.filter(zone => 
        zone.end > camX - SCREEN_W/2 && 
        zone.start < camX + SCREEN_W
      );
      
      if (activeZones.length === 0) return; 
      
      const zone = choose(activeZones);
      
      const spawnX = Math.max(
        camX - SCREEN_W/2,
        Math.min(
          camX + SCREEN_W/2,
          rand(zone.start, zone.end)
        )
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
          damage: levelConfig.enemies.cucumbers.damage
        },
        z(3),
        "cucumber"
      ]);
      
      cucumber.onUpdate(() => {
        cucumber.pos.y += cucumber.fallSpeed;
        cucumber.angle += cucumber.rotationSpeed;
        
        if (cucumber.pos.y > SCREEN_H + 100) {
          destroy(cucumber);
        }
      });
    }
  });
}

export function setupCucumberCollision(player, levelConfig, gameStateGetter, gameStateSetter, levelName, scoreGetter, livesGetter, livesSetter, characterGetter) {
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
            reason: "Hit by cucumber"
          });
        } else {
          playBloodDripAnimation(gameStateSetter, scoreGetter, levelName, character);
        }

      }
    }
  });
}

export function setupRatSpawner(levelConfig, gameStateGetter, player) {
  if (!levelConfig.enemies.rats.enabled) return;
  
  const spawnRate = levelConfig.enemies.rats.spawnRate / 1000;
  const zones = levelConfig.enemies.rats.spawnZones || [];
  
  if (zones.length === 0) {
    zones.push({ start: 0, end: levelConfig.length });
  }
  
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
      
      const hasGroundAtSpawn = levelConfig.GroundSegments.some(segment => 
        spawnX >= segment.x && 
        spawnX <= segment.x + segment.width &&
        segment.y >= spawnY - 10 && 
        segment.y <= spawnY + 60
      );
      
      if (!hasGroundAtSpawn) {
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
          bobTimer: 0,
          bobSpeed: rand(8, 12),
          bobAmount: rand(2, 4)
        },
        z(3),
        "rat"
      ]);
      
      rat.onUpdate(() => {
        rat.move(rat.speed * rat.direction, 0);
        
        rat.flipX = rat.direction === 1;
        
        rat.bobTimer += dt() * rat.bobSpeed;
        const bobOffset = Math.sin(rat.bobTimer) * rat.bobAmount;
        
        if (rat.pos.y < rat.baseY) {
          rat.yVelocity += 1600 * dt();
          rat.pos.y += rat.yVelocity * dt();
        } else {
          rat.baseY = 390;
          rat.pos.y = rat.baseY + bobOffset;
          rat.yVelocity = 0;
        }
        
        if (rat.direction === -1 && rat.pos.x <= rat.patrolZone.start + 50) {
          rat.direction = 1;
        }
        if (rat.direction === 1 && rat.pos.x >= rat.patrolZone.end - 50) {
          rat.direction = -1;
        }
        
        const checkX = rat.pos.x + (rat.direction * rat.groundCheckDistance);
        const hasGroundAhead = levelConfig.GroundSegments.some(segment => 
          checkX >= segment.x && 
          checkX <= segment.x + segment.width &&
          segment.y >= rat.baseY - 10 && 
          segment.y <= rat.baseY + 60
        );
        
        if (!hasGroundAhead && rat.pos.y >= 380) {
          rat.direction *= -1;
        }
        
        if (rat.pos.x < camPos().x - SCREEN_W - 200 || 
            rat.pos.x > camPos().x + SCREEN_W + 200) {
          destroy(rat);
        }
      });
    }
  });
}

export function setupRatCollision(player, levelConfig, gameStateGetter, gameStateSetter, levelName, scoreGetter, scoreSetter, livesGetter, livesSetter, characterGetter) {
  player.onCollide("rat", (rat) => {
    const playerBottom = player.pos.y + 40;
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
              reason: "RABIES!"
            });
          } else {
            playBloodDripAnimation(gameStateSetter, scoreGetter, levelName, character);
          }
        }
      }
    }
  });
}

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
        cycleDuration: 4
      },
      "laser"
    ]);
    
    laser.onUpdate(() => {
      laser.cycleTimer += dt();
      
      if (laser.cycleTimer < 2) {
        laser.isActive = true;
        laser.opacity = 0.7;
        
        laser.scanPos += laser.scanSpeed * laser.scanDirection * dt();
        if (laser.scanPos > 100 || laser.scanPos < -100) {
          laser.scanDirection *= -1;
        }
        laser.pos.x = x + laser.scanPos;
        
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

export function setupLaserCollision(player, levelConfig, gameStateGetter, gameStateSetter, levelName, scoreGetter, livesGetter, livesSetter, characterGetter) {
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
            reason: "Lasered 😵"
          });
        } else {
          playBloodDripAnimation(gameStateSetter, scoreGetter, levelName, character);
        }
      }
    }
  });
}

export function setupLevelPause(gameActiveGetter, gameActiveSetter, onQuitCallback = null) {
  return setupPauseSystem(gameActiveGetter, gameActiveSetter, onQuitCallback);
}

export function setupPlayerCamera(player, character, bg, gameStateGetter) {
  player.onUpdate(() => {
    if (gameStateGetter()) {
      setCamPos(player.pos.x, SCREEN_H / 2);
      
      if (bg) {
        bg.pos.x = -500 + (player.pos.x * 0.5);
      }
      
      updatePlayerAnim(player, character);
    }
  });
}