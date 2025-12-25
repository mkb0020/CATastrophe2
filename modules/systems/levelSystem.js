import { SCREEN_W, SCREEN_H } from '../config/gameConfig.js';


/**
 * CUCUMBER SPAWN
 * @param {number} spawnX 
 * @param {Object} enemyConfig 
 * @returns {Object} 
 */
export function spawnEnemy(spawnX, enemyConfig) {
  const fallSpeed = rand(
    enemyConfig.fallSpeed.min, 
    enemyConfig.fallSpeed.max
  );
  
  const rotationSpeed = rand(
    enemyConfig.rotationSpeed.min, 
    enemyConfig.rotationSpeed.max
  );

  const enemy = add([
    sprite(enemyConfig.sprite),
    pos(spawnX, -enemyConfig.height),
    area({ 
      width: enemyConfig.width, 
      height: enemyConfig.height 
    }),
    anchor("center"),
    rotate(0),
    z(5),
    {
      fallSpeed: fallSpeed,
      rotationSpeed: rotationSpeed,
      damage: enemyConfig.damage
    },
    "enemy"
  ]);

  
  enemy.onUpdate(() => {
    enemy.move(0, enemy.fallSpeed * 60); 
    enemy.angle += enemy.rotationSpeed;
    

    if (enemy.pos.y > SCREEN_H + 100) {
      destroy(enemy);
    }
  });

  return enemy;
}


/**
 * ENEMY COLLISION
 * @param {Object} player 
 * @param {Object} enemy 
 * @param {number} invulnerabilityTime 
 * @returns {boolean} 
 */
export function handlePlayerEnemyCollision(player, enemy, invulnerabilityTime = 1) {
  if (player.invulnerable) {
    return false;
  }


  player.hp -= enemy.damage;
  player.invulnerable = true;
  

  const flashLoop = loop(0.1, () => {
    player.opacity = player.opacity === 1 ? 0.5 : 1;
  });
  
  wait(invulnerabilityTime, () => {
    player.invulnerable = false;
    player.opacity = 1;
    flashLoop.cancel();
  });

  destroy(enemy);
  
  return true;
}


/**
 * SPAWN CUPS
 * @param {Array} platforms 
 * @param {number} totalCups 
 * @returns {Array} 
 */
export function spawnCups(platforms, totalCups) {
  const cups = [];
  const cupsPerPlatform = Math.floor(totalCups / platforms.length);
  
  platforms.forEach(platform => {
    for (let i = 0; i < cupsPerPlatform; i++) {
      const x = platform.x + (platform.width / (cupsPerPlatform + 1)) * (i + 1);
      const y = platform.y - 50;
      
      const cup = add([
        sprite('cup'),
        pos(x, y),
        area({ width: 40, height: 60 }),
        anchor("center"),
        scale(0.8),
        z(3),
        "cup"
      ]);
      
      cups.push(cup);
    }
  });
  
  return cups;
}


/**
 * PLATFORMS
 * @param {Array} platformConfigs 
 * @param {string} color
 */
export function createPlatforms(platformConfigs, color = "#C89EFF") {
  platformConfigs.forEach(platform => {
    add([
      rect(platform.width, platform.height),
      pos(platform.x, platform.y),
      area(),
      body({ isStatic: true }),
      color(Color.fromHex(color)),
      outline(2, Color.fromHex("#C89EFF")),
      z(2),
      "platform"
    ]);
  });
}


/**
 * GROUND
 * @param {Object} groundConfig 
 * @param {string} color 
 */
export function createGround(groundConfig, color = "#9953ef") {
  if (!groundConfig) return;
  
  add([
    rect(groundConfig.width, groundConfig.height),
    pos(groundConfig.x, groundConfig.y),
    area(),
    body({ isStatic: true }),
    color(Color.fromHex(color)),
    z(1),
    "ground"
  ]);
}


/**
 * ENEMY SPAWN
 * @param {number} cameraX 
 * @param {number} levelLength
 * @param {Object} enemyConfig 
 * @returns {number|null} 
 */
export function getEnemySpawnPosition(cameraX, levelLength, enemyConfig) {
  
  if (cameraX >= levelLength - 1000) {
    return null;
  }
  
  
  const spawnX = cameraX + SCREEN_W + rand(0, 200);
  return spawnX;
}


/**
 * DAMAGE
 * @param {Object} player 
 * @returns {boolean} 
 */
export function checkPlayerFall(player) {
  return player.pos.y > SCREEN_H + 100;
}


/**
 * UPDATE HP BAR
 * @param {Object} hpBar 
 * @param {number} currentHP 
 * @param {number} maxHP 
 * @param {number} maxWidth 
 */
export function updateHPBar(hpBar, currentHP, maxHP, maxWidth = 180) {
  const hpPercent = currentHP / maxHP;
  hpBar.width = maxWidth * hpPercent;
  

  if (hpPercent > 0.5) {
    hpBar.color = rgb(102, 255, 153); 
  } else if (hpPercent > 0.25) {
    hpBar.color = rgb(255, 215, 0); w
  } else {
    hpBar.color = rgb(255, 102, 102); 
  }
}


/**
 * BOUNDARIES
 * @param {Object} player 
 * @param {number} cameraX 
 * @param {Object} boundaries 
 */
export function enforcePlayerBoundaries(player, cameraX, boundaries) {
  const minX = cameraX + boundaries.left;
  const maxX = cameraX + SCREEN_W - boundaries.right;
  
  if (player.pos.x < minX) {
    player.pos.x = minX;
  }
  if (player.pos.x > maxX) {
    player.pos.x = maxX;
  }
}


/**
 * CHECK LEVEL COMPLETE
 * @param {Object} player 
 * @param {number} levelLength 
 * @param {number} requiredScore 
 * @param {number} currentScore 
 * @returns {boolean} 
 */
export function checkLevelComplete(player, levelLength, requiredScore = null, currentScore = null) {
  const reachedEnd = player.pos.x >= levelLength - 100;
  
  if (requiredScore !== null) {
    return reachedEnd && currentScore >= requiredScore;
  }
  
  return reachedEnd;
}


/**
 * CHECK GAME OVER
 * @param {Object} player 
 * @param {number} timeLeft
 * @param {boolean} hasHP 
 * @returns {string|null} 
 */
export function checkGameOver(player, timeLeft, hasHP = false) {

  if (timeLeft <= 0) {
    return 'time';
  }
  

  if (player.pos.y > SCREEN_H + 100) {
    return 'fall';
  }
  

  if (hasHP && player.hp <= 0) {
    return 'hp';
  }
  
  return null;
}


/**
 * REMAINING TIME
 * @param {number} startTime 
 * @param {number} timeLimit 
 * @returns {number} 
 */
export function getTimeRemaining(startTime, timeLimit) {
  const elapsed = (time() - startTime);
  return Math.max(0, Math.ceil(timeLimit - elapsed));
}


/**
 * FINISH LINE - NOT USED ANYMORE
 * @param {number} x 
 * @param {string} color 
 */
export function createFinishLine(x, color = "#26F382") {
  add([
    rect(50, SCREEN_H),
    pos(x, 0),
    area(),
    color(Color.fromHex(color)),
    opacity(0.5),
    z(10),
    "finish"
  ]);
}


/**
 * UPDATE ENEMIES
 * REMOVE OFF SCREEN
 * @param {number} cameraX 
 * @returns {number} 
 */
export function updateEnemies(cameraX) {
  const enemies = get("enemy");
  
  enemies.forEach(enemy => {
 
    if (enemy.pos.y > SCREEN_H + 100) {
      destroy(enemy);
    }
    

    if (enemy.pos.x < cameraX - 200) {
      destroy(enemy);
    }
  });
  
  return get("enemy").length;
}


/**
 * CLEANUP
 */
export function cleanupLevel() {
  destroyAll("platform");
  destroyAll("ground");
  destroyAll("cup");
  destroyAll("enemy");
  destroyAll("finish");
  destroyAll("background");
}