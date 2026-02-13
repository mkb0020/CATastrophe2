// enemies.js

// EXPORTS:
// setupCucumberSpawner() - Spawn falling cucumbers
// setupCucumberCollision() - Handle cucumber damage
// setupRatSpawner() - Spawn ground rats
// setupRatCollision() - Handle rat combat
// addLaserBeams() - Create laser obstacles
// setupLaserCollision() - Handle laser damage
// addMiniBoss() - Create mini-boss enemy
// setupMiniBossReflect() - Handle cucumber reflection mechanic

//==================================== IMPORTS ====================================
import { SCREEN_W, SCREEN_H, BUBBLE_FRAMES } from '../config/gameConfig.js';
import { animateGhostPoof } from '../helpers/bossHelpers.js';
import { playBloodDripAnimation } from './levelEnvironment.js';

//==================================== CUCUMBERS ====================================
export function setupCucumberSpawner(levelConfig, gameStateGetter) {
  if (!levelConfig.enemies.cucumbers.enabled) return;
  
  const zones = levelConfig.enemies.cucumbers.spawnZones || [];
  
  if (zones.length === 0) {
    zones.push({ start: 0, end: levelConfig.length });
  }
  
  const spawnedZones = new Set();
  
  onUpdate(() => {
    if (!gameStateGetter()) return;
    
    const camX = camPos().x;
    const camLeft = camX - SCREEN_W / 2;
    const camRight = camX + SCREEN_W / 2;
    
    zones.forEach((zone, index) => {
      if (zone.end > camLeft - 400 && 
          zone.start < camRight + 400 &&
          !spawnedZones.has(index)) {
        
        spawnedZones.add(index);
        
        const count = zone.count || levelConfig.enemies.cucumbers.count || 1;
        
        for (let i = 0; i < count; i++) {
          wait(i * 0.7, () => {
            if (!gameStateGetter()) return;
            
            const spawnX = rand(zone.start + 100, zone.end - 100);
            const spawnY = -5 - (i * 30); 
            
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
          });
        }
      }
    });
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
      
      play("takeHit", { volume: 0.3 });
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
  
  const spawnedZones = new Set();
  
  onUpdate(() => {
    if (!gameStateGetter()) return;
    
    const camX = camPos().x;
    const camLeft = camX - SCREEN_W / 2;
    const camRight = camX + SCREEN_W / 2;
    
    zones.forEach((zone, index) => {
      if (zone.end > camLeft - 500 && 
          zone.start < camRight + 500 &&
          !spawnedZones.has(index)) {
        
        spawnedZones.add(index);
        
        const count = zone.count || levelConfig.enemies.rats.count || 1;
        
        for (let i = 0; i < count; i++) {
          wait(i * 0.2, () => {
            if (!gameStateGetter()) return;
            
            let spawnX;
            const offScreenLeft = zone.start < camLeft - 100;
            const offScreenRight = zone.end > camRight + 100;

            if (offScreenLeft && Math.random() > 0.5) {
              spawnX = rand(
                Math.max(zone.start + 100, zone.start),
                Math.min(camLeft - 100, zone.end - 100)
              );
            } else if (offScreenRight) {
              spawnX = rand(
                Math.max(camRight + 100, zone.start + 100),
                Math.min(zone.end - 100, zone.end)
              );
            } else {
              spawnX = rand(zone.start + 100, zone.end - 100);
            }

            const spawnY = 390;
            
            const MIN_SPAWN_DISTANCE = 150; 
            const distanceToPlayer = Math.abs(spawnX - player.pos.x);
            
            if (distanceToPlayer < MIN_SPAWN_DISTANCE) {
              console.warn(`Rat spawn aborted at x:${spawnX} - too close to player!`);
              return;
            }
            
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
          });
        }
      }
    });
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
        
        play("takeHit", { volume: 0.3 });
        
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
      rect(3, 440),
      pos(x, 0),
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
      
      play("takeHit", { volume: 0.3 });
      
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

        play("meow02", { volume: 0.3 });
        
        wait(1.5, () => {
          tween(bossExclamation.opacity, 0, 0.3, (val) => bossExclamation.opacity = val);
          wait(0.3, () => {
            destroy(bossExclamation);
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
        
        
        wait(0.5, () => {
          animateGhostPoof(miniBoss);
          destroy(miniBoss);
          play("miniBossDie", { volume: 0.7 });
          if (onDefeatCallback) onDefeatCallback();
        });
      }
    }
  });
}