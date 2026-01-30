// mainMenu.js
import { SCREEN_W, SCREEN_H, Colors, getCenterX, getCenterY, getScreenWidth, getScreenHeight } from '../config/gameConfig.js';
import { getCharacterList, SPRITE_FRAMES, SPRITE_SCALES } from '../config/characters.js';
import { stopAllMusic, startMenuMusic, openHowToPlayModal, openAboutCatsModal, stopAtmosphere } from '../helpers/kittyHelpers.js';
import { showMobileArrows, hideMobileArrows } from '../helpers/mobileControls.js';

// ==================== INITIALIZE GAME STATE ====================
if (!window.gameState) {
  window.gameState = {
    deviceType: null, 
    score: 0,
    currentLevel: 1
  };
}

export function createStartScene(){
  // ==================== HIDE MOBILE HUD ====================
  const mobileSetup = window.mobileSetup;
  const mobileHUD = window.mobileHUD;
  
  if (mobileSetup && mobileSetup.isMobile && mobileHUD) {
    mobileHUD.hide();
    hideMobileArrows(); 
  }
  
  // ==================== USE ACTUAL SCREEN DIMENSIONS ====================
  const screenW = getScreenWidth();
  const screenH = getScreenHeight();
  const centerX = getCenterX();
  const centerY = getCenterY();
  
  // ==================== BACKGROUND ====================
  add([
    sprite('startBG'),
    pos(0, 0),
    z(0)
  ]);

  // ==================== DEVICE SELECTION BUTTONS ====================
  const buttonWidth = 280;
  const buttonHeight = 70;
  const buttonSpacing = 100;
  const startY = centerY - 50; 

  
  const desktopBtnBG = add([
    rect(buttonWidth, buttonHeight, { radius: 8 }),
    pos(centerX, startY),
    anchor("center"),
    color(55, 2, 90), 
    outline(3, rgb(165, 90, 255)),
    area(),
    z(2),
    "desktop-btn"
  ]);

  const desktopBtnText = add([
    text("PLAY ON PC", { 
      size: 32, 
      font: "orbitronBold"
    }),
    pos(centerX, startY),
    anchor("center"),
    color(255, 199, 255), 
    z(3)
  ]);

  const desktopBtnShadow = add([
    text("PLAY ON PC", { 
      size: 32, 
      font: "orbitronBold"
    }),
    pos(centerX + 2, startY + 2),
    anchor("center"),
    color(0, 0, 0),
    z(1)
  ]);

  
  const mobileBtnBG = add([
    rect(buttonWidth, buttonHeight, { radius: 8 }),
    pos(centerX, startY + buttonSpacing),
    anchor("center"),
    color(55, 2, 90), 
    outline(3, rgb(165, 90, 255)), 
    area(),
    z(2),
    "mobile-btn"
  ]);

  const mobileBtnText = add([
    text("PLAY ON MOBILE", { 
      size: 32, 
      font: "orbitronBold"
    }),
    pos(centerX, startY + buttonSpacing),
    anchor("center"),
    color(255, 199, 255),
    z(3)
  ]);

  const mobileBtnShadow = add([
    text("PLAY ON MOBILE", { 
      size: 32, 
      font: "orbitronBold"
    }),
    pos(centerX + 2, startY + buttonSpacing + 2),
    anchor("center"),
    color(0, 0, 0),
    z(1)
  ]);

  // ==================== BUTTON INTERACTIONS ====================
  
  desktopBtnBG.onHoverUpdate(() => {
    desktopBtnBG.color = rgb(131, 12, 222);
    setCursor("pointer");
  });

  desktopBtnBG.onHoverEnd(() => {
    desktopBtnBG.color = rgb(55, 2, 90);
    setCursor("default");
  });

  desktopBtnBG.onClick(() => {
    window.gameState.deviceType = 'desktop';
    console.log('🖥️ Desktop mode selected');
    stopAtmosphere();
    startMenuMusic();
    go("menu");
  });

  mobileBtnBG.onHoverUpdate(() => {
    mobileBtnBG.color = rgb(131, 12, 222);
    setCursor("pointer");
  });

  mobileBtnBG.onHoverEnd(() => {
    mobileBtnBG.color = rgb(55, 2, 90);
    setCursor("default");
  });

  mobileBtnBG.onClick(() => {
    window.gameState.deviceType = 'mobile';
    console.log('📱 Mobile mode selected');
    stopAtmosphere();
    startMenuMusic();
    go("menu");
  });

  // ==================== KEYBOARD SHORTCUTS ====================
  onKeyPress("d", () => {
    window.gameState.deviceType = 'desktop';
    console.log('🖥️ Desktop mode selected (keyboard)');
    stopAtmosphere();
    startMenuMusic();
    go("menu");
  });

  onKeyPress("1", () => {
    window.gameState.deviceType = 'desktop';
    console.log('🖥️ Desktop mode selected (keyboard)');
    stopAtmosphere();
    startMenuMusic();
    go("menu");
  });

  onKeyPress("m", () => {
    window.gameState.deviceType = 'mobile';
    console.log('📱 Mobile mode selected (keyboard)');
    stopAtmosphere();
    startMenuMusic();
    go("menu");
  });

  onKeyPress("2", () => {
    window.gameState.deviceType = 'mobile';
    console.log('📱 Mobile mode selected (keyboard)');
    stopAtmosphere();
    startMenuMusic();
    go("menu");
  });

  // ==================== HELPER TEXT ====================
  const helperText = add([
    text("Keyboard: Press 1 for PC  |  Press 2 for Mobile", { 
      size: 18, 
      font: "orbitron"
    }),
    pos(centerX, screenH - 40),
    anchor("center"),
    color(200, 200, 200),
    opacity(0.7),
    z(3)
  ]);
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

  // ==================== USE ACTUAL SCREEN DIMENSIONS FOR OVERLAYS ====================
  const screenW = getScreenWidth();
  const screenH = getScreenHeight();
  const centerX = getCenterX();
  const centerY = getCenterY();

  // ==================== PHASE 1: DOOR ANIMATION ====================
  const blackOverlay = add([
    rect(screenW, screenH),
    pos(0, 0),
    color(0, 0, 0),
    opacity(1),
    z(10000),
    fixed(),
    "blackOverlay"
  ]);

  const whiteOverlay = add([
    rect(screenW, screenH),
    pos(0, 0),
    color(254, 228, 180),
    opacity(0),
    z(9999),
    fixed(),
    "whiteOverlay"
  ]);

  const cafeSprite = add([
    sprite("cafeDay", { frame: 0 }),
    pos(centerX, centerY),
    anchor("center"),
    scale(2, 2),
    z(9998),
    opacity(0),
    fixed(),
    "cafeSprite"
  ]);

  const doorX = centerX;
  const doorY = screenH * 0.7;

  const START_SCALE = 2.0;
  const MID_SCALE = 5.5;    
  const END_SCALE = 8.0;     
  
  const midOffsetX = (centerX - doorX) * (MID_SCALE - START_SCALE) / START_SCALE;
  const midOffsetY = (centerY - doorY) * (MID_SCALE - START_SCALE) / START_SCALE;
  const finalOffsetX = (centerX - doorX) * (END_SCALE - START_SCALE) / START_SCALE;
  const finalOffsetY = (centerY - doorY) * (END_SCALE - START_SCALE) / START_SCALE;

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
          cafeSprite.pos = vec2(centerX + offsetX, centerY + offsetY);
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
              cafeSprite.pos = vec2(centerX + offsetX, centerY + offsetY);
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
  
  if (!grid) return;
  
  grid.innerHTML = '';
  
  characters.forEach((char, index) => {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.dataset.index = index;
    
    const img = document.createElement('img');
    const spriteName = char.name.charAt(0).toUpperCase() + char.name.slice(1).toLowerCase();
    img.src = `./assets/images/portraits/${spriteName}.png`;
    img.className = 'char-select-img';
    img.alt = char.name;
    
    const nameLabel = document.createElement('div');
    nameLabel.className = 'char-card-name';
    nameLabel.textContent = char.name;
    
    card.appendChild(img);
    card.appendChild(nameLabel);
    
    card.onclick = () => {
      console.log('🎯 Card clicked!', { index, animationComplete });
      
      if (!animationComplete) return;
      
      selectedIndex = index;
      
      document.querySelectorAll('.character-card').forEach(c => {
        c.classList.remove('selected');
      });
      card.classList.add('selected');
      
      updateCharacterStats(char);
      
      const confirmBtn = document.getElementById('confirmCharBtn');
      console.log('📘 Button element found:', confirmBtn);
      console.log('📘 Button disabled before:', confirmBtn ? confirmBtn.disabled : 'N/A');
      
      if (confirmBtn) {
        confirmBtn.disabled = false;
        console.log('📘 Button disabled after:', confirmBtn.disabled);
      }
      
      if (window.play) play("happyMeow", { volume: 0.2 });
    };
    
    grid.appendChild(card);
  });
}


function updateCharacterStats(char) {
  document.getElementById('statHP').textContent = char.stats.maxHP;
  document.getElementById('statATK').textContent = char.stats.baseAtk;
  document.getElementById('statDEF').textContent = char.stats.baseDefense;
  document.getElementById('statSPD').textContent = char.stats.baseSpeed;
  
  document.getElementById('charName').textContent = char.name;
  
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

  const screenW = getScreenWidth();
  const screenH = getScreenHeight();
  const centerX = getCenterX();
  const centerY = getCenterY();

  const brownOverlay = add([
    rect(screenW, screenH),
    pos(0, 0),
    color(92, 64, 51),
    opacity(0),
    z(180),
    "pourBrownOverlay",
  ]);

  const blackOverlay = add([
    rect(screenW, screenH),
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
      const screenW = getScreenWidth();
      const screenH = getScreenHeight();
      const centerX = getCenterX();
      const centerY = getCenterY();
      
      const targetHeight = screenH * 1.1; 
      const spriteHeight = 48;
      const scaleAmount = targetHeight / spriteHeight;
      
      const pourSprite = add([
        sprite("pour", { frame: 0 }),
        pos(centerX, centerY),
        anchor("center"),
        scale(scaleAmount),
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