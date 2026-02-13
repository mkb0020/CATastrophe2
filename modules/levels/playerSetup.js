// playerSetup.js

// EXPORTS:
// createPlayer() - Initialize the player character
// setupPlayerControls() - Configure keyboard input
// setupParticleSystem() - Handle particle effects
// updatePlayerAnim() - Manage character animations
// setupPlayerCamera() - Configure camera following
// createUnifiedHUD() - Initialize HUD elements
// updateUnifiedHUD() - Update HUD display
// showHUD() / hideHUD() - Toggle HUD visibility

//==================================== IMPORTS ====================================
import { SCREEN_H } from '../config/gameConfig.js';
import { SPRITE_FRAMES, SPRITE_SCALES, RAINBOW_CAT_FRAMES } from '../config/characters.js';

//==================================== PLAYER CREATION ====================================
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

//==================================== PLAYER CONTROLS ====================================
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

//==================================== PARTICLE SYSTEM ====================================
export function setupParticleSystem(player) {
  player.particleTimer = 0;
  player.particleSpawnRate = 0.03; 
  player.wasGrounded = true; 
  
  player.onUpdate(() => {
    const isGroundedNow = player.isGrounded();
    if (isGroundedNow && !player.wasGrounded && player.vel.y > 100) {
      createLandingPoof(player);
    }
    player.wasGrounded = isGroundedNow;
    
    if (player.isMoving || !player.isGrounded()) {
      player.particleTimer += dt();
      
      if (player.particleTimer >= player.particleSpawnRate) {
        player.particleTimer = 0;
        createCatParticle(player);
      }
    }
  });
}

function createLandingPoof(player) {
  const particleCount = rand(15, 20);
  
  for (let i = 0; i < particleCount; i++) {
    let particleColor;
    if (player.rainbowActive || player.catnipActive) {
      const colors = [
        rgb(255, 100, 200), rgb(100, 200, 255), rgb(255, 255, 100),
        rgb(150, 255, 150), rgb(200, 150, 255)
      ];
      particleColor = choose(colors);
    } else {
      const colors = [
        rgb(255, 200, 220), rgb(200, 220, 255), rgb(255, 240, 200)
      ];
      particleColor = choose(colors);
    }
    
    const angle = (i / particleCount) * Math.PI * 2;
    const spread = rand(30, 60);
    const offsetX = Math.cos(angle) * spread;
    const offsetY = 35; 
    
    const particle = add([
      rect(rand(4, 8), rand(4, 8)),
      pos(player.pos.x + offsetX, player.pos.y + offsetY),
      color(particleColor),
      opacity(0.9),
      scale(1.2),
      z(2),
      {
        vel: vec2(Math.cos(angle) * rand(50, 100), rand(-120, -80)),
        life: 1,
        decay: rand(0.025, 0.045),
        gravity: -120
      },
      "particle"
    ]);
    
    particle.onUpdate(() => {
      particle.pos.x += particle.vel.x * dt();
      particle.pos.y += particle.vel.y * dt();
      particle.vel.y += particle.gravity * dt();
      particle.vel.x *= 0.95; 
      
      particle.life -= particle.decay;
      particle.opacity = particle.life;
      particle.scale = vec2(particle.life * 1.2, particle.life * 1.2);
      
      if (particle.life <= 0) {
        destroy(particle);
      }
    });
  }
}

function createCatParticle(player) {
  let particleColor;
  if (player.rainbowActive || player.catnipActive) {
    const colors = [
      rgb(255, 100, 200), 
      rgb(100, 200, 255), 
      rgb(255, 255, 100), 
      rgb(150, 255, 150), 
      rgb(200, 150, 255)  
    ];
    particleColor = choose(colors);
  } else {

    const colors = [
      rgb(255, 199, 255),
      rgb(165, 90, 255), 
      rgb(0, 255, 255) 
    ];
    particleColor = choose(colors);
  }
  
  
  const spawnPoints = [
    { x: -10, y: 40 },  
    { x: 10, y: 40 },  
    { x: -15, y: 40 },   
    { x: 20, y: 40 },     
    { x: 30, y: 40 },
    { x: 40, y: 40 },
    { x: 50, y: 40 }     
  ];
  
  const spawnPoint = choose(spawnPoints);
  const offsetX = player.facingRight ? spawnPoint.x : -spawnPoint.x;
  const offsetY = spawnPoint.y + rand(-3, 3);
  
  const particle = add([
    rect(rand(3, 6), rand(3, 6)),
    pos(player.pos.x + offsetX, player.pos.y + offsetY),
    color(particleColor),
    opacity(0.8),
    scale(1),
    z(2),
    {
      vel: vec2(rand(-30, 30), rand(-80, -40)), 
      life: 1,
      decay: rand(0.02, 0.04),
      gravity: -200  // NEGATIVE GRAVITY TO FLOAT UP
    },
    "particle"
  ]);
  
  particle.onUpdate(() => {
    particle.pos.x += particle.vel.x * dt();
    particle.pos.y += particle.vel.y * dt();
    particle.vel.y += particle.gravity * dt(); 
    
    particle.life -= particle.decay;
    particle.opacity = particle.life;
    
    particle.scale = vec2(particle.life, particle.life);
    
    if (particle.life <= 0) {
      destroy(particle);
    }
  });
}

//==================================== ANIMATIONS ====================================
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
  
 // if (showDebug) {
//    const debugElement = document.getElementById('debugInfo');
 //   if (debugElement) {
 //     debugElement.style.display = 'block';
//    }
//  }
  
  return {};
}

export function updateUnifiedHUD(hudElements, score, timeLeft, player, lives) {
  if (window.updateHUD) {
    window.updateHUD({
      score: score,
      hp: player.hp,
      lives: lives,
      timeLeft: timeLeft
    });
  }
  
  const debugInfo = document.getElementById('debugInfo');
  if (debugInfo && debugInfo.style.display !== 'none') {
    debugInfo.textContent = `X: ${Math.round(player.pos.x)}  Y: ${Math.round(player.pos.y)}`;
  }
}

export function showHUD() {
  const hudOverlay = document.querySelector('.mobile-hud-overlay');
  if (hudOverlay) {
    hudOverlay.classList.add('show');
  }
  
  console.log('👁️ HUD shown');
}

export function hideHUD() {
  const hudOverlay = document.querySelector('.mobile-hud-overlay');
  if (hudOverlay) {
    hudOverlay.classList.remove('show');
  }
  
  console.log('🙈 HUD hidden');
    //debugElement.style.display = 'none';
}