// mobileControls.js
import { SCREEN_W, SCREEN_H, Colors, ACTUAL_H, ACTUAL_W } from '../config/gameConfig.js';
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
export function createJoystickControls() {
  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'touchControls';
  controlsContainer.innerHTML = `
    <div class="joystick-container">
      <div class="joystick-base" id="joystickBase">
        <div class="joystick-stick" id="joystickStick"></div>
      </div>
    </div>
    
    <div class="jump-button" id="jumpButton">
      JUMP
    </div>
  `;
  
  document.body.appendChild(controlsContainer);
  
  return {
    container: controlsContainer,
    joystickBase: document.getElementById('joystickBase'),
    joystickStick: document.getElementById('joystickStick'),
    jumpButton: document.getElementById('jumpButton')
  };
}

// ==================== SETUP JOYSTICK CONTROLS  ====================
export function setupJoystickControls(controls, mobileState) {
  const { joystickBase, joystickStick, jumpButton } = controls;
  
  let joystickActive = false;
  let joystickX = 0;
  
  function handleJoystickMove(clientX, clientY) {
    const rect = joystickBase.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const maxDistance = 35;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > maxDistance) {
      deltaX = (deltaX / distance) * maxDistance;
    }

    joystickStick.style.transform = `translate(calc(-50% + ${deltaX}px), -50%)`;
    joystickX = deltaX / maxDistance;
    
    if (joystickX < -0.3) {
      mobileState.left = true;
      mobileState.right = false;
    } else if (joystickX > 0.3) {
      mobileState.right = true;
      mobileState.left = false;
    } else {
      mobileState.left = false;
      mobileState.right = false;
    }
  }

  function resetJoystick() {
    joystickStick.style.transform = 'translate(-50%, -50%)';
    joystickX = 0;
    joystickActive = false;
    joystickBase.classList.remove('active');
    mobileState.left = false;
    mobileState.right = false;
    console.log('🕹️ Joystick reset to center');
  }

  const joystickTouchStart = (e) => {
    e.preventDefault();
    joystickActive = true;
    joystickBase.classList.add('active');
    const touch = e.touches[0];
    handleJoystickMove(touch.clientX, touch.clientY);
    console.log('🕹️ Joystick activated (touch)');
  };

  const joystickTouchMove = (e) => {
    e.preventDefault();
    if (joystickActive) {
      const touch = e.touches[0];
      handleJoystickMove(touch.clientX, touch.clientY);
    }
  };

  const joystickTouchEnd = (e) => {
    e.preventDefault();
    resetJoystick();
  };

  const joystickMouseDown = (e) => {
    joystickActive = true;
    joystickBase.classList.add('active');
    handleJoystickMove(e.clientX, e.clientY);
    console.log('🕹️ Joystick activated (mouse)');
  };

  const documentMouseMove = (e) => {
    if (joystickActive) {
      handleJoystickMove(e.clientX, e.clientY);
    }
  };

  const documentMouseUp = () => {
    if (joystickActive) {
      resetJoystick();
    }
  };

  joystickBase.addEventListener('touchstart', joystickTouchStart);
  joystickBase.addEventListener('touchmove', joystickTouchMove);
  joystickBase.addEventListener('touchend', joystickTouchEnd);
  joystickBase.addEventListener('touchcancel', joystickTouchEnd);
  joystickBase.addEventListener('mousedown', joystickMouseDown);
  document.addEventListener('mousemove', documentMouseMove);
  document.addEventListener('mouseup', documentMouseUp);
  jumpButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mobileState.jumpJustPressed = true;
    console.log('⬆️ Jump pressed!');
  });
  
  jumpButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    mobileState.jumpJustPressed = false;
  });
  
  jumpButton.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    mobileState.jumpJustPressed = false;
  });
  
  console.log('🎮 Simplified joystick controls initialized');
}

// ==================== SHOW/HIDE CONTROLS ====================
export function showJoystickControls() {
  const controls = document.getElementById('touchControls');
  if (controls) {
    controls.classList.add('active');
    console.log('🎮 Joystick controls shown');
  }
}

export function hideJoystickControls() {
  const controls = document.getElementById('touchControls');
  if (controls) {
    controls.classList.remove('active');
    console.log('🎮 Joystick controls hidden');
  }
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
  const preventDefault = (e) => {
    e.preventDefault();
  };
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
  
  const controls = createJoystickControls();
  
  const mobileState = new MobileControlState();
  
  setupJoystickControls(controls, mobileState);
  
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
export function setupResponsiveCanvas(canvasElement, targetWidth =  ACTUAL_W, targetHeight = ACTUAL_H) {
  function resizeCanvas() {
    const isMobile = window.innerWidth <= 1024;
    
    if (isMobile) {
      canvasElement.style.width = '';
      canvasElement.style.height = '';
      
      requestAnimationFrame(() => {
        canvasElement.style.width = '100vw';
        canvasElement.style.height = '100vh';
        canvasElement.style.position = 'fixed';
        canvasElement.style.top = '0';
        canvasElement.style.left = '0';
        
        console.log('📱 Mobile canvas resized:', {
          width: window.innerWidth,
          height: window.innerHeight
        });
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
  
  window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(resizeCanvas, 100);
  });
  
  window.addEventListener('orientationchange', () => {
    console.log('🔄 Orientation changed - resizing canvas');
    setTimeout(() => {
      resizeCanvas();
      setTimeout(resizeCanvas, 200);
    }, 100);
  });
  
  return resizeCanvas;
}