// mobileControls.js
import { SPRITE_FRAMES, SPRITE_SCALES, RAINBOW_CAT_FRAMES } from '../config/characters.js';
import { ROOMS } from '../config/challengeRoom.js';
import { getRoom } from '../config/challengeRoom.js';

// ==================== MOBILE DETECTION ====================
export function detectMobile() {
  const isMobileTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;
  
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const isMobile = isMobileTouch || isMobileUA;
  
  console.log('📱 Mobile Detection:', {
    isMobileTouch,
    isMobileUA,
    isMobile,
    screenWidth: window.innerWidth,
    touchPoints: navigator.maxTouchPoints
  });
  
  return isMobile;
}

// ==================== ORIENTATION CHECK ====================
export function checkOrientation() {
  return window.innerWidth > window.innerHeight;
}

// ==================== ORIENTATION PROMPT ====================
export function createOrientationPrompt() {
  const prompt = document.createElement('div');
  prompt.id = 'orientationPrompt';
  prompt.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      color: white;
      font-family: Arial, sans-serif;
    ">
      <div style="font-size: 70px; margin-bottom: 20px;">𖦹</div>
      <div style="color: #FFC7FF; font-size: 30px; font-family: 'GothNerd'; text-align: center; padding: 0 20px;">
        <strong> Put that thang down flip it and reverse it! </strong>
        <br> ...
        <br>(rotate your phone)
      </div>
    </div>
  `;
  
  document.body.appendChild(prompt);
  return prompt;
}

// ==================== TOUCH CONTROLS ====================
export function createTouchControls() {
  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'touchControls';
  controlsContainer.innerHTML = `
    <style>
      #touchControls {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 120px;
        pointer-events: none;
        z-index: 1000;
      }
      
      .touch-arrow {
        position: absolute;
        bottom: 20px;
        width: 80px;
        height: 80px;
        background: rgba(2, 144, 83, 0.5);
        border: 3px solid rgba(103,254,189, 0.8);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36px;
        color: rgb(103,254,189);
        pointer-events: all;
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
        transition: background 0.1s;
      }
      
      .touch-arrow:active {
        background: rgba(103,254,189, 0.5);
        transform: scale(0.95);
      }
      
      #leftArrow {
        left: 20px;
      }
      
      #rightArrow {
        right: 20px;
      }
    </style>
    
    <div id="leftArrow" class="touch-arrow">◀</div>
    <div id="rightArrow" class="touch-arrow">▶</div>
  `;
  
  document.body.appendChild(controlsContainer);
  
  return {
    leftArrow: document.getElementById('leftArrow'),
    rightArrow: document.getElementById('rightArrow'),
    container: controlsContainer
  };
}

// ==================== MOBILE CONTROL STATE ====================
export class MobileControlState {
  constructor() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this.jumpJustPressed = false;
  }
  
  reset() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this.jumpJustPressed = false;
  }
}

// ==================== SETUP MOBILE PLAYER CONTROLS ====================
export function setupMobilePlayerControls(player, gameStateGetter, mobileState) {
  const hitboxWidth = 90;
  const hitboxHeight = 90;
  const baseOffsetX = 5;
  const offsetY = 0;
  
  player.onUpdate(() => {
    if (!gameStateGetter()) return;
    
    const controlMultiplier = player.isGrounded() 
      ? player.groundControl 
      : player.airControl;
    
    if (mobileState.left) {
      const moveSpeed = player.speed * controlMultiplier;
      player.move(-moveSpeed, 0);
      player.isMoving = true;
      player.facingRight = false;
      player.flipX = true;
      player.area.offset = vec2(-baseOffsetX, offsetY);
    } 
    else if (mobileState.right) {
      const moveSpeed = player.speed * controlMultiplier;
      player.move(moveSpeed, 0);
      player.isMoving = true;
      player.facingRight = true;
      player.flipX = false;
      player.area.offset = vec2(baseOffsetX, offsetY);
    } 
    else {
      player.isMoving = false;
    }
    
    if (mobileState.jumpJustPressed && player.isGrounded()) {
      const spriteSheet = player.rainbowActive ? "rainbowCatSheet" : `${player.characterName}Sheet`;
      const frames = player.rainbowActive ? RAINBOW_CAT_FRAMES : SPRITE_FRAMES;
      
      player.use(sprite(spriteSheet, { frame: frames.jumpStart }));
      player.curState = 'jumpStart';
      const currentScale = player.scale.x > 0 ? SPRITE_SCALES.jump : -SPRITE_SCALES.jump;
      player.scale = vec2(currentScale, SPRITE_SCALES.jump);
      
      player.jump(player.playerJumpForce);
      mobileState.jumpJustPressed = false; 
    }
    
    if (player.vel.y > player.maxFallSpeed) {
      player.vel.y = player.maxFallSpeed;
    }
  });
}

// ==================== SETUP TOUCH EVENTS ====================
export function setupTouchEvents(controls, mobileState, canvas) {
  const { leftArrow, rightArrow } = controls;
  
  const preventDefault = (e) => {
    e.preventDefault();
  };
  
  leftArrow.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mobileState.left = true;
    console.log('⬅️ Left pressed');
  });
  
  leftArrow.addEventListener('touchend', (e) => {
    e.preventDefault();
    mobileState.left = false;
    console.log('⬅️ Left released');
  });
  
  leftArrow.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    mobileState.left = false;
  });
  
  rightArrow.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mobileState.right = true;
    console.log('➡️ Right pressed');
  });
  
  rightArrow.addEventListener('touchend', (e) => {
    e.preventDefault();
    mobileState.right = false;
    console.log('➡️ Right released');
  });
  
  rightArrow.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    mobileState.right = false;
  });
  
  canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      mobileState.jumpJustPressed = true;
      console.log('⬆️ Jump!');
    }
  });
  
  document.body.addEventListener('touchmove', preventDefault, { passive: false });
}

// ==================== SETUP MOBILE DOOR INTERACTION ====================
export function setupMobileDoorInteraction(player, doors, levelConfig, levelId, getGameData, canvas) {
  console.log('🔧 Setting up MOBILE door interactions for', doors.length, 'doors');
  
  doors.forEach((door, index) => {
    const doorConfig = door.doorConfig;
    const doorObj = door.doorObj;
    
    let playerNear = false;
    let windowOpen = false;
    
    player.onUpdate(() => {
      if (!doorObj.exists()) return;
      
      const dist = player.pos.dist(doorObj.pos);
      const isNear = dist < 100;
      
      if (isNear && !playerNear) {
        playerNear = true;
        
        if (!windowOpen) {
          windowOpen = true;
          doorObj.use(sprite('window', { frame: 1 }));
          console.log('🪟 Window opened!');
        }
      } else if (!isNear && playerNear) {
        playerNear = false;
        
        if (windowOpen) {
          windowOpen = false;
          doorObj.use(sprite('window', { frame: 0 }));
          console.log('🪟 Window closed!');
        }
      }
    });
    
    canvas.addEventListener('touchstart', (e) => {
      if (!playerNear) return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      
      const scaleX = 1000 / rect.width;
      const scaleY = 480 / rect.height;
      
      const canvasX = (touch.clientX - rect.left) * scaleX;
      const canvasY = (touch.clientY - rect.top) * scaleY;
      
      const camX = camPos().x;
      const camY = camPos().y;
      const worldX = canvasX + camX - 500; 
      const worldY = canvasY + camY - 240; 
      
      const doorDist = Math.sqrt(
        Math.pow(worldX - doorObj.pos.x, 2) + 
        Math.pow(worldY - doorObj.pos.y, 2)
      );
      
      if (doorDist < 100) {
        console.log('🚪 Door tapped! Entering...');
        
        const gameData = getGameData();
        const roomConfig = ROOMS[doorConfig.roomId] || getRoom(doorConfig.roomId);
        
        if (!roomConfig) {
          console.error('❌ Room not found:', doorConfig.roomId);
          return;
        }
        
        const returnData = {
          character: gameData.character,
          startHP: player.hp,
          lives: gameData.lives,
          score: gameData.score,
          timeLeft: gameData.timeLeft,
          returnX: doorConfig.returnX,
          returnY: doorConfig.returnY
        };
        
        go("challengeRoom", {
          roomConfig: roomConfig,
          returnScene: levelId,
          returnData: returnData
        });
      }
    });
  });
}

// ==================== SETUP MOBILE EXIT WINDOW ====================
export function setupMobileExitWindow(player, exitWindow, canvas, returnScene, returnData, scoreGetter, livesGetter) {
  let playerNear = false;
  
  player.onUpdate(() => {
    if (!exitWindow.exists()) return;
    
    const dist = player.pos.dist(exitWindow.pos);
    const isNear = dist < 120;
    
    playerNear = isNear;
  });
  
  canvas.addEventListener('touchstart', (e) => {
    if (!playerNear || !exitWindow.isOpen) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = 1000 / rect.width;
    const scaleY = 480 / rect.height;
    
    const canvasX = (touch.clientX - rect.left) * scaleX;
    const canvasY = (touch.clientY - rect.top) * scaleY;
    
    const camX = camPos().x;
    const camY = camPos().y;
    const worldX = canvasX + camX - 500;
    const worldY = canvasY + camY - 240;
    
    const windowDist = Math.sqrt(
      Math.pow(worldX - exitWindow.pos.x, 2) + 
      Math.pow(worldY - exitWindow.pos.y, 2)
    );
    
    if (windowDist < 120) {
      console.log('🚪 Exit window tapped! Leaving...');
      
      returnData.startHP = player.hp;
      returnData.lives = livesGetter();
      returnData.score = scoreGetter();
      
      go(returnScene, returnData);
    }
  });
}

// ==================== MAIN INITIALIZATION ====================
export function initializeMobileControls(canvasElement) {
  const isMobile = detectMobile();
  
  if (!isMobile) {
    console.log('💻 Desktop detected - skipping mobile controls');
    return { isMobile: false };
  }
  
  console.log('📱 Mobile detected - initializing touch controls');
  
  const orientationPrompt = createOrientationPrompt();
  
  const resizeCanvas = setupResponsiveCanvas(canvasElement);
  
  const controls = createTouchControls();
  
  const mobileState = new MobileControlState();
  
  function checkAndUpdateOrientation() {
    const isLandscape = checkOrientation();
    orientationPrompt.style.display = isLandscape ? 'none' : 'flex';
    
    if (isLandscape) {
      console.log('📱 Landscape mode - game ready!');
    } else {
      console.log('📱 Portrait mode - showing rotation prompt');
    }
  }
  
  checkAndUpdateOrientation();
  window.addEventListener('resize', checkAndUpdateOrientation);
  window.addEventListener('orientationchange', () => {
    setTimeout(checkAndUpdateOrientation, 100);
  });
  
  return {
    isMobile: true,
    controls,
    mobileState,
    resizeCanvas,
    orientationPrompt
  };
}

// ==================== CLEANUP ====================
export function cleanupMobileControls() {
  const controls = document.getElementById('touchControls');
  if (controls) {
    controls.remove();
  }
  
  const prompt = document.getElementById('orientationPrompt');
  if (prompt) {
    prompt.remove();
  }
  
  console.log('🧹 Mobile controls cleaned up');
}

// ==================== MOBILE HUD CONTROLLER ====================
export class MobileHUDController {
  constructor() {
    this.isMobile = detectMobile();
    
    if (!this.isMobile) return;
    
    this.scoreEl = document.getElementById('mobileScore');
    this.hpEl = document.getElementById('mobileHP');
    this.livesEl = document.getElementById('mobileLives');
    this.timeEl = document.getElementById('mobileTime');
    this.volumeBtn = document.getElementById('mobileVolumeBtn');
    this.pauseBtn = document.getElementById('mobilePauseBtn');
    
    console.log('📱 Mobile HUD Controller initialized');
  }
  
  updateScore(score) {
    if (this.scoreEl) {
      this.scoreEl.textContent = `Score: ${score}`;
    }
  }
  
  updateHP(hp, maxHP) {
    if (this.hpEl) {
      this.hpEl.textContent = `HP: ${hp}`;
      
      if (hp <= maxHP * 0.3) {
        this.hpEl.classList.add('low-hp');
      } else {
        this.hpEl.classList.remove('low-hp');
      }
    }
  }
  
  updateLives(lives) {
    if (this.livesEl) {
      this.livesEl.textContent = `Lives: ${lives}`;
    }
  }
  
  updateTime(seconds) {
    if (this.timeEl) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      this.timeEl.textContent = `Time: ${mins}:${secs.toString().padStart(2, '0')}`;
      
      if (seconds <= 30) {
        this.timeEl.classList.add('low-time');
      } else {
        this.timeEl.classList.remove('low-time');
      }
    }
  }
  
  setupVolumeButton(onToggle) {
    if (this.volumeBtn) {
      this.volumeBtn.addEventListener('click', () => {
        const isMuted = onToggle();
        this.volumeBtn.textContent = isMuted ? '🔇' : '🔊';
      });
    }
  }
  
setupPauseButton(onPause) {
  if (this.pauseBtn) {
    this.pauseBtn.addEventListener('click', () => {
      if (window.gamePauseSystem) {
        if (window.gamePauseSystem.isPaused()) {
          window.gamePauseSystem.resume();
        } else {
          window.gamePauseSystem.pause();
        }
      }
    });
  }
}
  
  hide() {
    const overlay = document.querySelector('.mobile-hud-overlay');
    if (overlay) {
      overlay.classList.remove('show');
      console.log('📱 Mobile HUD hidden');
    }
  }
  
  show() {
    const overlay = document.querySelector('.mobile-hud-overlay');
    if (overlay) {
      overlay.classList.add('show');
      console.log('📱 Mobile HUD shown');
    }
  }
}

// ==================== MOBILE ARROW CONTROLS ====================
export function showMobileArrows() {
  const controls = document.getElementById('touchControls');
  if (controls) {
    controls.style.display = 'block';
    console.log('➡️ Mobile arrows shown');
  }
}

export function hideMobileArrows() {
  const controls = document.getElementById('touchControls');
  if (controls) {
    controls.style.display = 'none';
    console.log('⬅️ Mobile arrows hidden');
  }
}

// ==================== UPDATE CANVAS SCALING FOR MOBILE ====================
export function setupResponsiveCanvas(canvasElement, targetWidth = 1000, targetHeight = 480) {
  function resizeCanvas() {
    const isMobile = window.innerWidth <= 1024;
    
    if (isMobile) {
      canvasElement.style.width = '100vw';
      canvasElement.style.height = '100vh';
      canvasElement.style.position = 'fixed';
      canvasElement.style.top = '0';
      canvasElement.style.left = '0';
      
      console.log('📱 Mobile canvas: Full screen', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    } else {
      const targetRatio = targetWidth / targetHeight;
      const windowRatio = window.innerWidth / window.innerHeight;
      
      let newWidth, newHeight;
      
      if (windowRatio > targetRatio) {
        newHeight = Math.min(window.innerHeight - 200, targetHeight);
        newWidth = newHeight * targetRatio;
      } else {
        newWidth = Math.min(window.innerWidth - 40, targetWidth);
        newHeight = newWidth / targetRatio;
      }
      
      canvasElement.style.width = `${newWidth}px`;
      canvasElement.style.height = `${newHeight}px`;
      canvasElement.style.position = 'relative';
      
      console.log('🖥️ Desktop canvas:', { newWidth, newHeight });
    }
  }
  
  resizeCanvas();
  
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 100);
  });
  
  return resizeCanvas;
}

