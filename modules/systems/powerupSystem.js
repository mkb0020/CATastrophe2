// powerupSystem.js - Power-up spawning and effects
import { SCREEN_W, SCREEN_H } from '../config/gameConfig.js';


export const POWERUPS = {
  catnip: {
    sprite: 'catnip',
    effect: 'invincible',
    duration: 8000, 
    speedBoost: 1.5,
    spawnWeight: 3, 
    scale: 0.8
  },
  fish: {
    sprite: 'fish',
    effect: 'heal',
    healAmount: 20,
    spawnWeight: 8, 
    scale: 0.7
  },
  can: {
    sprite: 'can',
    effect: 'heal',
    healAmount: 40,
    spawnWeight: 5, 
    scale: 0.8
  },
  milk: {
    sprite: 'milk',
    effect: 'extraLife',
    spawnWeight: 2, 
    scale: 0.8
  },
  mouse: {
    sprite: 'mouse',
    effect: 'bonus',
    bonusPoints: 50,
    spawnWeight: 4, 
    scale: 0.6,
    moveSpeed: 150 
  }
};


function selectRandomPowerup() {
  const powerupTypes = Object.keys(POWERUPS);
  const totalWeight = powerupTypes.reduce((sum, type) => sum + POWERUPS[type].spawnWeight, 0);
  
  let random = Math.random() * totalWeight;
  
  for (const type of powerupTypes) {
    random -= POWERUPS[type].spawnWeight;
    if (random <= 0) {
      return type;
    }
  }
  
  return powerupTypes[0]; 
}


export function spawnPowerup(platform, isAutoscroll = false) {
  const powerupType = selectRandomPowerup();
  const config = POWERUPS[powerupType];
  
  try {
    getSprite(config.sprite);
  } catch (e) {
    console.warn(`Sprite "${config.sprite}" not loaded yet, skipping powerup spawn`);
    return null;
  }
  
  const x = platform.x + rand(50, platform.width - 50);
  const y = platform.y - 60;
  
  const powerup = add([
    sprite(config.sprite),
    pos(x, y),
    area({ width: 40, height: 40 }),
    anchor("center"),
    scale(config.scale),
    z(5),
    {
      powerupType: powerupType,
      config: config
    },
    "powerup"
  ]);
  
  if (powerupType === 'mouse') {
    let direction = choose([-1, 1]);
    let moveTimer = 0;
    
    powerup.onUpdate(() => {
      moveTimer += dt();
      
      powerup.move(direction * config.moveSpeed, 0);
      
      if (moveTimer > rand(1, 2)) {
        direction *= -1;
        moveTimer = 0;
        powerup.flipX = direction < 0;
      }
      
   
      if (powerup.pos.x < platform.x + 20) {
        powerup.pos.x = platform.x + 20;
        direction = 1;
      } else if (powerup.pos.x > platform.x + platform.width - 20) {
        powerup.pos.x = platform.x + platform.width - 20;
        direction = -1;
      }
      
      if (isAutoscroll) {
        const cameraX = camPos().x - SCREEN_W / 2;
        if (powerup.pos.x < cameraX - 200) {
          destroy(powerup);
        }
      }
    });
  } else {
    let floatOffset = 0;
    powerup.onUpdate(() => {
      floatOffset += dt() * 2;
      powerup.pos.y = y + Math.sin(floatOffset) * 5;
      
      if (isAutoscroll) {
        const cameraX = camPos().x - SCREEN_W / 2;
        if (powerup.pos.x < cameraX - 200) {
          destroy(powerup);
        }
      }
    });
  }
  
  return powerup;
}


export function spawnPowerupsOnPlatforms(platforms, spawnChance = 0.15, isAutoscroll = false) {
  const powerups = [];
  
  platforms.forEach(platform => {
    if (Math.random() < spawnChance) {
      const powerup = spawnPowerup(platform, isAutoscroll);
      powerups.push(powerup);
    }
  });
  
  return powerups;
}


export function applyCatnipEffect(player, duration, speedMultiplier) {
  const originalSpeed = player.speed;
  const originalInvulnerable = player.invulnerable;
  

  player.speed = originalSpeed * speedMultiplier;
  player.invulnerable = true;
  player.catnipActive = true;
  
 
  const flashLoop = loop(0.1, () => {
    const colors = [
      rgb(255, 100, 255), 
      rgb(100, 255, 255), 
      rgb(255, 255, 100), 
      rgb(100, 255, 100), 
    ];
    player.color = choose(colors);
  });
  

  wait(duration / 1000, () => {
    player.speed = originalSpeed;
    player.invulnerable = originalInvulnerable;
    player.catnipActive = false;
    player.color = rgb(255, 255, 255);
    flashLoop.cancel();
  });
}


export function applyHealEffect(player, healAmount) {
  const oldHP = player.hp;
  player.hp = Math.min(player.hp + healAmount, player.maxHP);
  const actualHeal = player.hp - oldHP;
  
 
  const originalColor = player.color || rgb(255, 255, 255);
  player.color = rgb(100, 255, 100);
  wait(0.3, () => {
    player.color = originalColor;
  });
  
  return actualHeal;
}


export function applyExtraLifeEffect(livesGetter, livesSetter) {
  const currentLives = livesGetter();
  livesSetter(currentLives + 1);
  

  return currentLives + 1;
}


export function applyBonusEffect(scoreGetter, scoreSetter, bonusAmount) {
  const currentScore = scoreGetter();
  scoreSetter(currentScore + bonusAmount);
  return bonusAmount;
}


export function handlePowerupCollision(player, powerup, scoreGetter, scoreSetter, livesGetter, livesSetter) {
  const config = powerup.config;
  let message = "";
  
  switch (powerup.powerupType) {
    case 'catnip':
      applyCatnipEffect(player, config.duration, config.speedBoost);
      message = "🌿 CATNIP! Speed boost + Invincible!";
      break;
      
    case 'fish':
      const fishHeal = applyHealEffect(player, config.healAmount);
      message = `🐟 Fish bones! +${fishHeal} HP`;
      break;
      
    case 'can':
      const canHeal = applyHealEffect(player, config.healAmount);
      message = `🥫 Tuna can! +${canHeal} HP`;
      break;
      
    case 'milk':
      const newLives = applyExtraLifeEffect(livesGetter, livesSetter);
      message = `🥛 Milk! Extra life! (${newLives} lives)`;
      break;
      
    case 'mouse':
      applyBonusEffect(scoreGetter, scoreSetter, config.bonusPoints);
      message = `🐭 Caught the mouse! +${config.bonusPoints} points!`;
      break;
  }
  

  destroy(powerup);
  
  return message;
}



export function setupPowerupCollision(player, scoreGetter, scoreSetter, livesGetter, livesSetter, messageCallback = null) {
  player.onCollide("powerup", (powerup) => {
    const message = handlePowerupCollision(player, powerup, scoreGetter, scoreSetter, livesGetter, livesSetter);
    
    if (messageCallback) {
      messageCallback(message);
    } else {
      console.log(message);
    }
  });
}


export function spawnAutoscrollPowerup(cameraX, spawnChance = 0.02) {
  if (Math.random() > spawnChance) return null;
  
  const powerupType = selectRandomPowerup();
  const config = POWERUPS[powerupType];
  

  const x = cameraX + SCREEN_W + rand(0, 100);
  const y = rand(150, 350); 
  
  const powerup = add([
    sprite(config.sprite),
    pos(x, y),
    area({ width: 40, height: 40 }),
    anchor("center"),
    scale(config.scale),
    z(5),
    {
      powerupType: powerupType,
      config: config
    },
    "powerup"
  ]);
  

  if (powerupType === 'mouse') {
    let direction = choose([-1, 1]);
    let moveTimer = 0;
    
    powerup.onUpdate(() => {
      moveTimer += dt();
      powerup.move(direction * config.moveSpeed, 0);
      
      if (moveTimer > rand(1, 2)) {
        direction *= -1;
        moveTimer = 0;
        powerup.flipX = direction < 0;
      }
      
 
      const currentCameraX = camPos().x - SCREEN_W / 2;
      if (powerup.pos.x < currentCameraX - 200) {
        destroy(powerup);
      }
    });
  } else {
 
    let floatOffset = 0;
    const baseY = y;
    powerup.onUpdate(() => {
      floatOffset += dt() * 2;
      powerup.pos.y = baseY + Math.sin(floatOffset) * 5;
      
   
      const currentCameraX = camPos().x - SCREEN_W / 2;
      if (powerup.pos.x < currentCameraX - 200) {
        destroy(powerup);
      }
    });
  }
  
  return powerup;
}