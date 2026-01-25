// mainMenu.js
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { getCharacterList, SPRITE_FRAMES, SPRITE_SCALES } from '../config/characters.js';
import { stopAllMusic, startMenuMusic, openHowToPlayModal, openAboutCatsModal, stopAtmosphere } from '../helpers/kittyHelpers.js';
import { showMobileArrows, hideMobileArrows } from '../helpers/mobileControls.js';



export function createStartScene(){
    // ==================== HIDE MOBILE HUD ====================
  const mobileSetup = window.mobileSetup;
  const mobileHUD = window.mobileHUD;
  
  if (mobileSetup && mobileSetup.isMobile && mobileHUD) {
    mobileHUD.hide();
    hideMobileArrows(); 
  }
  // =========================================================
  add([
    sprite('startBG'),
    pos(0, 0),
    z(0)
  ]);

  const clickText = add([
    text("CLICK TO START", { 
      size: 70, 
      font: "orbitronBold"
    }),
    pos(SCREEN_W / 2, 400),
    anchor("center"),
    color(255, 255, 255),
    z(3),
    opacity(1)
  ]);

  const clickText2 = add([
    text("CLICK TO START", { 
      size: 70, 
      font: "orbitronBold"
    }),
    pos(SCREEN_W / 2 +2, 402),
    anchor("center"),
    color(0, 0, 0),
    z(2),
    opacity(1)
  ]);

  let pulseDirection = -1;
  clickText.onUpdate(() => {
    clickText.opacity += pulseDirection * 2 * dt();
    if (clickText.opacity <= 0.3) {
      pulseDirection = 1;
    } else if (clickText.opacity >= 1) {
      pulseDirection = -1;
    }
  });

  onClick(() => {
    stopAtmosphere();
    startMenuMusic();
    go("menu");
  });

  onKeyPress("space", () => {
    stopAtmosphere();
    startMenuMusic();
    go("menu");
  });

  onKeyPress("enter", () => {
    stopAtmosphere();
    startMenuMusic();
    go("menu");
  });
}



export function createMainMenuScene() {
  const mobileSetup = window.mobileSetup;
  const mobileHUD = window.mobileHUD;
  
  if (mobileSetup && mobileSetup.isMobile && mobileHUD) {
    mobileHUD.hide();
    hideMobileArrows(); 
  }
  
  const modal = document.getElementById('mainMenuModal');
  if (modal) {
    modal.classList.add('show');
  }
  
  const playBtn = document.getElementById('playModalBtn');
  const howToPlayBtn = document.getElementById('howToPlayModalBtn');
  const meetCatsBtn = document.getElementById('meetCatsModalBtn');

  if (playBtn) {
    playBtn.onclick = () => {
      modal.classList.remove('show');
      go("charSelect");
    };
  }

  if (howToPlayBtn) {
    howToPlayBtn.onclick = () => openHowToPlayModal();
  }

  if (meetCatsBtn) {
    meetCatsBtn.onclick = () => openAboutCatsModal();
  }

  onSceneLeave(() => {
    if (modal) modal.classList.remove('show');
  });
}



export function createCharSelectScene() {
  const mobileSetup = window.mobileSetup;
  const mobileHUD = window.mobileHUD;
  
  if (mobileSetup?.isMobile && mobileHUD) {
    mobileHUD.hide();
    hideMobileArrows(); 
  }

  let selectedIndex = null;
  let animationComplete = false;
  let shopMusic = null;

  // ==================== PHASE 1: DOOR ANIMATION ====================
  const blackOverlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(1),
    z(10000),
    fixed(),
    "blackOverlay"
  ]);

  const whiteOverlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(254, 228, 180),
    opacity(0),
    z(9999),
    fixed(),
    "whiteOverlay"
  ]);

  const cafeSprite = add([
    sprite("cafeDay", { frame: 0 }),
    pos(SCREEN_W / 2, SCREEN_H / 2),
    anchor("center"),
    scale(2, 2),
    z(9998),
    opacity(0),
    fixed(),
    "cafeSprite"
  ]);

  const doorX = SCREEN_W / 2;
  const doorY = SCREEN_H * 0.7;

  const START_SCALE = 2.0;
  const MID_SCALE = 5.5;    
  const END_SCALE = 8.0;     
  
  const midOffsetX = (SCREEN_W / 2 - doorX) * (MID_SCALE - START_SCALE) / START_SCALE;
  const midOffsetY = (SCREEN_H / 2 - doorY) * (MID_SCALE - START_SCALE) / START_SCALE;
  const finalOffsetX = (SCREEN_W / 2 - doorX) * (END_SCALE - START_SCALE) / START_SCALE;
  const finalOffsetY = (SCREEN_H / 2 - doorY) * (END_SCALE - START_SCALE) / START_SCALE;

  wait(0, () => {
    tween(blackOverlay.opacity, 0, 1.0, (val) => blackOverlay.opacity = val, easings.easeOutQuad);
    tween(cafeSprite.opacity, 1, 1.0, (val) => cafeSprite.opacity = val, easings.easeOutQuad);
    
    wait(1.7, () => {
      tween(
        START_SCALE, 
        MID_SCALE, 
        2.5, 
        (val) => {
          cafeSprite.scale = vec2(val, val);
          const progress = (val - START_SCALE) / (MID_SCALE - START_SCALE);
          const offsetX = midOffsetX * progress;
          const offsetY = midOffsetY * progress;
          cafeSprite.pos = vec2(SCREEN_W / 2 + offsetX, SCREEN_H / 2 + offsetY);
        },
        easings.easeInOutQuad
      );
      
      wait(2.2, () => {
        cafeSprite.frame = 1;
        play("door", { volume: 0.5 });
        wait(0.3, () => {
          tween(
            MID_SCALE,
            END_SCALE,
            1.0,
            (val) => {
              cafeSprite.scale = vec2(val, val);
              const progress = (val - START_SCALE) / (END_SCALE - START_SCALE);
              const offsetX = finalOffsetX * progress;
              const offsetY = finalOffsetY * progress;
              cafeSprite.pos = vec2(SCREEN_W / 2 + offsetX, SCREEN_H / 2 + offsetY);
            },
            easings.easeInQuad  
          );
        });
      });
      
      wait(3.5, () => {
        tween(whiteOverlay.opacity, 1, 0.8, (val) => whiteOverlay.opacity = val, easings.easeInQuad);
        
        wait(0.8, () => {
          tween(whiteOverlay.opacity, 0, 0.8, (val) => whiteOverlay.opacity = val, easings.easeOutQuad);
          cafeSprite.opacity = 0;
          
          showCharSelectModal();
          shopMusic = play("shop", { volume: 0.3, loop: true });
          
          wait(0.8, () => {
            animationComplete = true;
            destroy(blackOverlay);
            destroy(whiteOverlay);
            destroy(cafeSprite);
          });
        });
      });
    });
  });

  const regularBG = add([
    sprite("SelectBG"),
    pos(0, 0),
    scale(SCREEN_W/500, SCREEN_H/240),
    opacity(0),
    z(0)
  ]);
  
  tween(regularBG.opacity, 1, 0.8, (val) => regularBG.opacity = val);

  // ==================== PHASE 2: MODAL ====================
function showCharSelectModal() {
  const modal = document.getElementById('charSelectModal');
  if (modal) modal.classList.add('show');
  
  buildCharacterCards();
  
  setTimeout(() => {
    setupCharSelectButtons();
  }, 100);
}

function buildCharacterCards() {
  const characters = getCharacterList();
  const grid = document.getElementById('characterGrid');
  
  if (!grid) {
    console.error('Character grid element not found!');
    return;
  }
  
  console.log('Building character cards...', characters); 
  
  grid.innerHTML = '';
  
  characters.forEach((char, index) => {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.dataset.index = index;
    
    const canvas = document.createElement('canvas');
canvas.width = 95;  
canvas.height = 68; 
canvas.className = 'char-sprite-canvas';

const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const img = new Image();
const spriteName = char.name.charAt(0).toUpperCase() + char.name.slice(1).toLowerCase();
img.src = `./assets/images/cats/${spriteName}.png`; 

img.onload = () => {
  const frameIndex = SPRITE_FRAMES.menu;
  const frameWidth = 210;
  const frameHeight = 150;
  const cols = 28;
  
  const sx = (frameIndex % cols) * frameWidth;
  const sy = Math.floor(frameIndex / cols) * frameHeight;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const scale = Math.min(canvas.width / frameWidth, canvas.height / frameHeight) * 0.9;
  const drawWidth = frameWidth * scale;
  const drawHeight = frameHeight * scale;
  const drawX = (canvas.width - drawWidth) / 2;
  const drawY = (canvas.height - drawHeight) / 2;
  
  ctx.drawImage(img, sx, sy, frameWidth, frameHeight, drawX, drawY, drawWidth, drawHeight);
  console.log(`Successfully loaded sprite for ${char.name}`, { drawX, drawY, drawWidth, drawHeight });
};
    
    const name = document.createElement('div');
    name.className = 'char-name';
    name.textContent = char.name;
    
    card.appendChild(canvas);
    card.appendChild(name);
    
card.onclick = () => {
  console.log('🎯 Card clicked!', { animationComplete, index, charName: char.name });
  
  if (!animationComplete) {
    console.log('⏳ Animation not complete yet, ignoring click');
    return;
  }
  
  selectedIndex = index;
  console.log('✅ Selected index set to:', selectedIndex);
  
  document.querySelectorAll('.character-card').forEach(c => {
    c.classList.remove('selected');
  });
  card.classList.add('selected');
  console.log('🎨 Card marked as selected');
  
  updateCharacterPreview(char);
  
  const confirmBtnContainer = document.querySelector('.confirm-btn-container');
  const confirmBtn = document.getElementById('confirmCharBtn');
  console.log('🔧 Testing button click detection');
confirmBtn?.addEventListener('click', () => {
  console.log('👆 RAW CLICK DETECTED ON BUTTON!');
});
  
  console.log('🔍 Found button elements:', {
    container: !!confirmBtnContainer,
    button: !!confirmBtn,
    containerClasses: confirmBtnContainer?.className,
    buttonDisabled: confirmBtn?.disabled
  });
  
  if (confirmBtnContainer) {
    confirmBtnContainer.classList.remove('disabled');
    console.log('✨ Removed disabled class from container. New classes:', confirmBtnContainer.className);
  }

  
  
  if (confirmBtn) {
    confirmBtn.disabled = false;
    console.log('✨ Set button disabled = false');
  }
  
  console.log('🎵 Playing meow sound');
  if (window.play) play("happyMeow", { volume: 0.2 });
};
    
    grid.appendChild(card);
  });
  
  
}


function updateCharacterPreview(char) {
  document.getElementById('statHP').textContent = char.stats.maxHP;
  document.getElementById('statATK').textContent = char.stats.baseAtk;
  document.getElementById('statDEF').textContent = char.stats.baseDefense;
  document.getElementById('statSPD').textContent = char.stats.baseSpeed;
  
  document.getElementById('charName').textContent = char.name;
  
  const previewCanvas = document.getElementById('previewCanvas');
  if (previewCanvas) {
    const ctx = previewCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    const img = new Image();
    const spriteName = char.name.charAt(0).toUpperCase() + char.name.slice(1).toLowerCase();
    img.src = `./assets/images/cats/${spriteName}.png`; 
    
    img.onerror = () => {
      console.error(`Failed to load preview sprite: ./assets/images/cats/${spriteName}.png`);
    };
    
    img.onload = () => {
      const frameIndex = SPRITE_FRAMES.select;
      const frameWidth = 210;
      const frameHeight = 150;
      const cols = 28;
      
      const sx = (frameIndex % cols) * frameWidth;
      const sy = Math.floor(frameIndex / cols) * frameHeight;
      
      const scale = 1;
      const drawWidth = frameWidth * scale;
      const drawHeight = frameHeight * scale;
      const drawX = (previewCanvas.width - drawWidth) / 2;
      const drawY = (previewCanvas.height - drawHeight) / 2;
      
      ctx.drawImage(img, sx, sy, frameWidth, frameHeight, drawX, drawY, drawWidth, drawHeight);
    };
  }
}

  function setupCharSelectButtons() {
    const backBtn = document.getElementById('backToMenuBtn');
    const confirmBtn = document.getElementById('confirmCharBtn');
    
    if (backBtn) {
      backBtn.onclick = () => {
        if (!animationComplete) return;
        if (shopMusic) shopMusic.stop();
        
        const modal = document.getElementById('charSelectModal');
        if (modal) modal.classList.remove('show');
        
        go("menu");
      };
    }
    
if (confirmBtn) {
  confirmBtn.onclick = () => {
    console.log('🚀 Confirm button clicked!', {
      selectedIndex,
      animationComplete,
      shopMusicExists: !!shopMusic
    });
    
    if (selectedIndex === null || !animationComplete) {
      console.log('❌ Cannot proceed:', { selectedIndex, animationComplete });
      return;
    }
        if (shopMusic) shopMusic.stop();
        
        const modal = document.getElementById('charSelectModal');
        if (modal) modal.classList.remove('show');
        
        playPourAnimation(() => {
          const characters = getCharacterList();
          const char = characters[selectedIndex];
          go("transition", "Transition1", char);
        });
      };
    }
  }
  
  onSceneLeave(() => {
    const modal = document.getElementById('charSelectModal');
    if (modal) modal.classList.remove('show');
  });
}




function playPourAnimation(onComplete) {
  const music = get("shop")[0];
  if (music) music.stop();

  const brownOverlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(92, 64, 51),
    opacity(0),
    z(180),
    "pourBrownOverlay",
  ]);

  const blackOverlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0),
    z(200),
    "pourBlackOverlay",
  ]);

  play("pour", { volume: 0.3 });

  const POUR_COUNT = 3;
  const STAGGER = 0.1;
  const POUR_OPACITY = 0.7;

  let finishedSprites = 0;
  let brownFadeStarted = false;
  let blackFadeStarted = false;

  function spawnPourSprite(delay) {
    wait(delay, () => {
      const pourSprite = add([
        sprite("pour", { frame: 0 }),
        pos(SCREEN_W / 2, SCREEN_H / 2),
        anchor("center"),
        scale(10),
        opacity(0),
        z(190),
        "pourSprite",
      ]);

      tween(
        pourSprite.opacity,
        POUR_OPACITY,
        0.3,
        (v) => (pourSprite.opacity = v),
        easings.easeOutQuad
      );

      let frameTime = 0;
      const FRAME_DURATION = 1.2 / 18;

      const frameUpdate = onUpdate(() => {
        frameTime += dt();
        const frame = Math.floor(frameTime / FRAME_DURATION);

        if (frame >= 12 && !blackFadeStarted) {
          blackFadeStarted = true;
          tween(
            blackOverlay.opacity,
            1,
            0.6,
            (v) => (blackOverlay.opacity = v),
            easings.easeInQuad
          );
        }

        if (frame >= 15 && !brownFadeStarted) {
          brownFadeStarted = true;
          tween(
            brownOverlay.opacity,
            1,
            0.4,
            (v) => (brownOverlay.opacity = v),
            easings.easeOutQuad
          );
        }

        if (frame >= 18) {
          frameUpdate.cancel();
          destroy(pourSprite);
          finishedSprites++;


        if (finishedSprites === POUR_COUNT) {
          blackOverlay.opacity = 1;
          destroy(brownOverlay);

          onComplete(); 
        }



        } else {
          pourSprite.frame = frame;
        }
      });
    });
  }

  for (let i = 0; i < POUR_COUNT; i++) {
    spawnPourSprite(i * STAGGER);
  }
}







function lerp(start, end, t) {
  return start + (end - start) * t;
}