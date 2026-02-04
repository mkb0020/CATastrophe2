// challengeRoomScene.js
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { 
  createPlayer, 
  setupPlayerControls, 
  updatePlayerAnim,
  createUnifiedHUD,
  updateUnifiedHUD,
  hideHUD,
  showHUD,
  setupPlayerCamera,
  setupFallDetection,
  createSpriteGround
} from '../helpers/levelHelpers.js';
import { 
  openStatUpgradeModal, 
  openMoveSelectionModal, 
  markRoomCompleted, 
  isRoomCompleted,
  getUpgrades,
  applyUpgradesToPlayer
} from '../helpers/upgradeHelper.js';
import { returnToLevel } from '../helpers/roomHelper.js';
import { startChallenegeMusic, stopAllMusic } from '../helpers/kittyHelpers.js';
import { setupMobilePlayerControls, setupTouchEvents, setupMobileExitWindow, showMobileArrows, hideMobileArrows, showJoystickControls, hideJoystickControls } from '../helpers/mobileControls.js';


export function createChallengeRoomScene(data) {
  console.log('ðŸŽ® CHALLENGE ROOM SCENE');
  console.log('ðŸ“¦ Data received:', data);
  
  const { roomConfig, returnScene, returnData } = data;
  
  if (!roomConfig) {
    console.error('âŒ No room config provided!');
    go("menu");
    return;
  }
  
  const bgElement = document.querySelector('.parallax-bg');
  if (bgElement) {
    bgElement.style.display = 'none';
    console.log('ðŸŽ¨ Parallax background hidden');
  }
  
  console.log(`ðŸšª Entering ${roomConfig.name}`);
  console.log(`ðŸ”™ Will return to: ${returnScene}`);
  
  const character = returnData.character;
  const startHP = returnData.startHP;
  const startLives = returnData.lives;
  const startScore = returnData.score || 0; 
  
  console.log(`ðŸ“Š Starting score: ${startScore}`);
  
  // ==================== SHOW MOBILE HUD ====================
  const mobileSetup = window.mobileSetup;
  const mobileHUD = window.mobileHUD;
  
  if (mobileSetup && mobileSetup.isMobile && mobileHUD) {
    mobileHUD.show();
    console.log('ðŸ“± Mobile HUD shown for challenge room');
  }
  // ================================================================
  
  if (isRoomCompleted(roomConfig.id)) {
    console.log('âœ… Room already completed! Returning to level...');
    wait(0.5, () => returnToLevel(returnScene, returnData));
    return;
  }
  
  setGravity(1500);
  stopAllMusic();
  startChallenegeMusic();


// ==================== DARKK OVERLAY OVER BG SO WINDOWS DON'T LOOK WEIRD ====================
 const darkOverlay = add([
    rect(width(), height()),
    pos(0, 0),
    fixed(),
    color(0, 0, 0),
    opacity(0.1),
    z(-1),
  ]);
  
  // ==================== GROUND SEGMENTS ====================
  roomConfig.GroundSegments.forEach(segment => {
    createSpriteGround(segment.x, segment.y, segment.width, segment.height);
  });
  
  // ==================== CRUMBLING PLATFORMS ====================
  const crumblingPlatforms = [];
  
  roomConfig.platforms.forEach((platform, index) => {
    const isExitPlatform = index === roomConfig.platforms.length - 1;
    
    if (isExitPlatform) {
      createSolidPlatform(platform.x, platform.y, platform.width, platform.height);
    } else {
      const crumblingPlatform = createCrumblingPlatform(
        platform.x, 
        platform.y, 
        platform.width, 
        platform.height
      );
      crumblingPlatforms.push(crumblingPlatform);
    }
  });
  
 add([
    rect(7200, 480),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.1),
    z(-2)
  ]);

// ==================== ENTRANCE WINDOW ====================
  add([
    sprite('window', { frame: 1 }), 
    pos(roomConfig.playerSpawn.x-10, roomConfig.playerSpawn.y - 50),
    scale(1.1),
    z(-1),
    "entranceWindow"
  ]);
  
// ==================== EXIT WINDOW ====================
  const exitWindow = add([
    sprite('window', { frame: 0 }),
    pos(roomConfig.playerExit.x, roomConfig.playerExit.y - 50),
    area({ width: 200, height: 150 }),
    anchor("center"),
    scale(1.1),
    z(-1),
    {
      isOpen: false,
      playerNearby: false
    },
    "exitWindow"
  ]);
  
// ==================== SPECIAL ITEM ====================
  let itemCollected = false;
    let itemSprite, maxFrame;
  
  if (roomConfig.items.newMove.enabled) {
    const currentFragments = getUpgrades().newMoveFragments;
    itemSprite = 'moveUpgrade';
        if (currentFragments === 0) {
      maxFrame = 12;
    } else if (currentFragments === 1) {
      maxFrame = 23;
    } else {
      maxFrame = 32;
    }
    
    console.log(`âœ¨ Move fragment ${currentFragments + 1} - animating frames 0-${maxFrame}`);
    
  } else if (roomConfig.items.statsUpgrade.enabled) {
    itemSprite = 'statsUpgrade';
    maxFrame = 7;
    
    console.log('âœ¨ Stat upgrade - animating frames 0-7');
  }
  
  const specialItem = add([
    sprite(itemSprite, { frame: 0 }), 
    pos(roomConfig.itemLocation.x, roomConfig.itemLocation.y),
    area({ width: 80, height: 80 }),
    anchor("center"),
    scale(0),
    z(10),
    {
      currentFrame: 0,
      maxFrame: maxFrame,
      frameTimer: 0
    },
    "specialItem"
  ]);
  
  specialItem.onUpdate(() => {
    specialItem.frameTimer += dt();
    const frameDelay = 1 / 7; // 7 fps
    
    if (specialItem.frameTimer >= frameDelay) {
      specialItem.frameTimer = 0;
      specialItem.currentFrame++;
      
      if (specialItem.currentFrame > specialItem.maxFrame) {
        specialItem.currentFrame = 0; 
      }
      
      specialItem.frame = specialItem.currentFrame;
    }
  });
  
  tween(0, 1.5, 0.5, (val) => {
    specialItem.scale = vec2(val, val);
  }, easings.easeOutBack);
  
  const glow = add([
    circle(60),
    pos(roomConfig.itemLocation.x, roomConfig.itemLocation.y),
    color(255, 215, 0),
    opacity(0),
    anchor("center"),
    z(9),
    "itemGlow"
  ]);
  
  let glowDirection = 1;
  glow.onUpdate(() => {
    glow.opacity += glowDirection * dt() * 0.5;
    if (glow.opacity >= 0.3) glowDirection = -1;
    if (glow.opacity <= 0.1) glowDirection = 1;
    
    glow.scale = vec2(1 + Math.sin(time() * 2) * 0.1);
  });
  
 const player = createPlayer(roomConfig, character, startHP);
  player.pos = vec2(roomConfig.playerSpawn.x, roomConfig.playerSpawn.y);
  applyUpgradesToPlayer(player);
  
  let score = startScore;
  let lives = startLives;
  let gameActive = true;
  
  const getGameActive = () => gameActive;
  const setGameActive = (val) => { gameActive = val; };
  const getScore = () => score;
  const setScore = (val) => { score = val; };
  const getLives = () => lives;
  const setLives = (val) => { lives = val; };
  const getCharacter = () => character;
  
  if (mobileSetup && mobileSetup.isMobile) {
    setupMobilePlayerControls(player, getGameActive, mobileSetup.mobileState);
    setupTouchEvents(mobileSetup.controls, mobileSetup.mobileState, document.getElementById("gameCanvas"));
    setTimeout(() => showJoystickControls(), 100); 
    
    setupMobileExitWindow(player, exitWindow, document.getElementById("gameCanvas"), returnScene, returnData, getScore, getLives);
  } else {
    setupPlayerControls(player, getGameActive);
  }
  
// ==================== CRUMBLING PLATFORM LOGIC ====================
  setupCrumblingPlatformCollisions(player, crumblingPlatforms);
  
// ==================== ITEM COLLECTION ====================
player.onCollide("specialItem", (item) => {
  if (!itemCollected) {
    itemCollected = true;
    destroy(item);
    
    if (glow && glow.exists()) {
      destroy(glow);
    }
    
    play("upgrade", { volume: 0.3 });
    
    if (roomConfig.items.newMove.enabled) {
      openMoveSelectionModal(character, () => {
        openExitWindow();
      });
    } else if (roomConfig.items.statsUpgrade.enabled) {
      const pointsToAllocate = roomConfig.items.statsUpgrade.count || 1;
      
      openStatUpgradeModal(pointsToAllocate, character, () => {
        openExitWindow();
      });
    }
    markRoomCompleted(roomConfig.id);
  }
});
function openExitWindow() {
    exitWindow.isOpen = true;
    exitWindow.use(sprite('window', { frame: 1 }));
    
    console.log('ðŸšª Exit window opened!');
    
    const exitPrompt = add([
      text("Press UP to exit", { size: 20 }),
      pos(0, 0),
      anchor("center"),
      color(255, 255, 255),
      opacity(0),
      z(100),
      fixed(),
      "exitPrompt"
    ]);
    
    player.onUpdate(() => {
      if (!exitWindow.exists()) return;
      
      const dist = player.pos.dist(exitWindow.pos);
      const isNearby = dist < 120;
      
      if (isNearby && !exitWindow.playerNearby) {
        exitWindow.playerNearby = true;
        exitPrompt.pos = vec2(SCREEN_W / 2, SCREEN_H - 100);
        exitPrompt.opacity = 1;
      } else if (!isNearby && exitWindow.playerNearby) {
        exitWindow.playerNearby = false;
        exitPrompt.opacity = 0;
      }
    });
    
    onKeyPress("up", () => {
      if (exitWindow.playerNearby && exitWindow.isOpen) {
        console.log('ðŸšª Exiting challenge room...');
        console.log(`ðŸ“Š Returning with score: ${score}`);
        
        returnData.startHP = player.hp;
        returnData.lives = lives;
        returnData.score = score;
        
        returnToLevel(returnScene, returnData);
      }
    });
  }

  // ==================== FALL DETECTION ====================
  setupFallDetection(
    player,
    getGameActive,
    setGameActive,
    returnScene, 
    getScore,
    getLives,
    setLives,
    getCharacter,
    startScore
  );
  
   const hudElements = createUnifiedHUD(player);

  let hudUpdateCounter = 0;
  onUpdate(() => {
    if (gameActive) {
      hudUpdateCounter++;
      if (hudUpdateCounter % 5 === 0) {
       
        updateUnifiedHUD(hudElements, score, null, player, lives);
        
        // ====================  UPDATE MOBILE HUD ====================
        if (mobileSetup && mobileSetup.isMobile && mobileHUD) {
          mobileHUD.updateScore(score);
          mobileHUD.updateHP(player.hp, player.maxHP);
          mobileHUD.updateLives(lives);
          mobileHUD.updateTime(0); 
        }
        // ===================================================================
      }
    }
  });
  
  // ==================== CAMERA ====================
  setupChallengeRoomCamera(player, roomConfig, getGameActive, character);
  // ==================== CLEANUP ====================
  onSceneLeave(() => {
    hideHUD();
    showHUD();
    
    // ==================== HIDE MOBILE HUD ====================
    if (mobileSetup && mobileSetup.isMobile && mobileHUD) {
      mobileHUD.hide();
      console.log('ðŸ“± Mobile HUD hidden on challenge room exit');
    }
    // =================================================================
    
    get("music").forEach(m => m.paused = true);
    const bgElement = document.querySelector('.parallax-bg');
    if (bgElement) {
      bgElement.style.display = 'block';
      console.log('ðŸŽ¨ Parallax background restored');
    }
  });
}
// ==================== HELPER FUNCTIONS ====================
function createCrumblingPlatform(x, y, width, height) {
  const spriteWidth = 70;
  const scaleX = width / spriteWidth;
  const scaleY = 2;
  
  const platformSprite = add([
    sprite('platform'),
    pos(x, y),
    scale(vec2(scaleX, scaleY)),
    z(-2),
    {
      originalColor: rgb(255, 255, 255)
    },
    "crumblingPlatformSprite"
  ]);
  
  const collisionBox = add([
    rect(width, height),
    pos(x, y),
    area(),
    body({ isStatic: true }),
    opacity(0),
    {
      hasCrumbled: false,
      isBeingSteppedOn: false,  
      crumbleTimer: 0,
      crumbleDelay: 0.5,
      linkedSprite: platformSprite
    },
    "crumblingPlatform",
    z(-1)
  ]);
  
  return collisionBox;
}

function setupCrumblingPlatformCollisions(player, platforms) {
  console.log(`ðŸ”§ Setting up crumbling collisions for ${platforms.length} platforms`);
  
  const hitboxHeight = player.area.height || 60;
  const hitboxOffsetY = player.area.offset?.y || 0;
  const hitboxWidth = player.area.width || 80;
  
  player.onCollide("crumblingPlatform", (platform) => {
    console.log('ðŸŽ¯ Collision detected with crumbling platform!');
    
    const playerBottom = player.pos.y + (hitboxHeight / 2) + hitboxOffsetY;
    const platformTop = platform.pos.y - platform.height / 2;
    const offsetX = player.facingRight ? 1 : -1;
    const playerLeft = player.pos.x + offsetX - (hitboxWidth / 2);
    const playerRight = player.pos.x + offsetX + (hitboxWidth / 2);
    const platformLeft = platform.pos.x;
    const platformRight = platform.pos.x + platform.width;
    const horizontalOverlap = playerRight > platformLeft && playerLeft < platformRight;
    
    console.log('ðŸ“Š Collision data:', {
      playerBottom,
      platformTop,
      playerVelY: player.vel.y,
      horizontalOverlap,
      difference: playerBottom - platformTop
    });
    
    if (player.vel.y > 0 && playerBottom < platformTop + 10 && horizontalOverlap) {
      console.log('âœ… Landing on platform!');
      player.pos.y = platformTop - (hitboxHeight / 2) - hitboxOffsetY;
      player.vel.y = 0;
      
      if (!platform.has("body")) {
        platform.use(body({ isStatic: true }));
      }
      
      if (!platform.isBeingSteppedOn) {
        console.log('ðŸ’£ Starting crumble timer!');
        platform.isBeingSteppedOn = true;
        play("crumble", { volume: 0.3 }); 
        startCrumble(platform);
      }
    } else if (player.vel.y < 0 || !horizontalOverlap) {
      if (platform.has("body")) {
        platform.unuse("body");
      }
    }
  });
  
  function startCrumble(platform) {
    platform.onUpdate(() => {
      if (platform.hasCrumbled) return;
      
      platform.crumbleTimer += dt();
      
      console.log(`â±ï¸ Crumble timer: ${platform.crumbleTimer.toFixed(2)}/${platform.crumbleDelay}`);
      
      if (platform.linkedSprite && platform.linkedSprite.exists()) {
        const shakeAmount = platform.crumbleTimer / platform.crumbleDelay;
        const shakeIntensity = Math.min(shakeAmount * 3, 3);
        
        platform.linkedSprite.pos.x = platform.pos.x + rand(-shakeIntensity, shakeIntensity);
        platform.linkedSprite.pos.y = platform.pos.y + rand(-shakeIntensity, shakeIntensity);
        
        const fadeProgress = Math.min(platform.crumbleTimer / platform.crumbleDelay, 1);
        platform.linkedSprite.color = rgb(
          255,
          Math.floor(255 * (1 - fadeProgress * 0.7)),
          Math.floor(255 * (1 - fadeProgress * 0.7))
        );
      }
      
      if (platform.crumbleTimer >= platform.crumbleDelay) {
        console.log('ðŸ’¥ðŸ’¥ðŸ’¥ PLATFORM CRUMBLING NOW! ðŸ’¥ðŸ’¥ðŸ’¥');
        platform.hasCrumbled = true;
        
        if (platform.linkedSprite && platform.linkedSprite.exists()) {
          
          
          const fallSpeed = 200;
          const rotateSpeed = 360;
          
          platform.linkedSprite.onUpdate(() => {
            platform.linkedSprite.pos.y += fallSpeed * dt();
            platform.linkedSprite.angle += rotateSpeed * dt();
            platform.linkedSprite.opacity -= 2 * dt();
            
            if (platform.linkedSprite.opacity <= 0 || platform.linkedSprite.pos.y > SCREEN_H + 100) {
              destroy(platform.linkedSprite);
            }
          });
        }
        
        wait(0.1, () => {
          if (platform.exists()) {
            destroy(platform);
          }
        });
      }
    });
  }
}

function createSolidPlatform(x, y, width, height) {
  const spriteWidth = 70;
  const scaleX = width / spriteWidth;
  const scaleY = 2;
  
  add([
    sprite('platform'),
    pos(x, y),
    scale(vec2(scaleX, scaleY/2)),
    opacity(0.5),
    z(-2),
    "platformSprite"
  ]);
  
  add([
    rect(width, height),
    pos(x, y),
    area(),
    body({ isStatic: true }),
    opacity(0),
    "platform",
    z(-1)
  ]);
}

function setupChallengeRoomCamera(player, roomConfig, gameStateGetter, character) {
  const bgElement = document.querySelector('.parallax-bg');
  
  player.onUpdate(() => {
    if (gameStateGetter()) {
      const camX = Math.max(SCREEN_W / 2, Math.min(player.pos.x, roomConfig.length - SCREEN_W / 2));
      setCamPos(camX, SCREEN_H / 2);
      
      if (bgElement) {
        bgElement.style.transform = `translateX(${-player.pos.x * 0.5}px)`;
      }
      
      updatePlayerAnim(player, character);
    }
  });
}