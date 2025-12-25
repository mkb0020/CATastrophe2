// pauseSystem.js - Pause functionality for platformer levels
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';

/**
 * PAUSE BUTTON
 */
export function createPauseButton(onPauseCallback) {

  const pauseBtn = add([
    rect(30, 30, { radius: 10 }),
    pos(65,25),
    color(Color.fromHex(Colors.MutedGrey)),
    outline(3, Color.fromHex(Colors.VortexViolet)),
    area(),
    fixed(),
    z(100),
    "pauseButton"
  ]);


  pauseBtn.add([
    rect(5, 20),
    pos(7, 5),
    color(Color.fromHex(Colors.NuclearFuscia)),
    z(101)
  ]);

  pauseBtn.add([
    rect(5, 20),
    pos(17, 5),
    color(Color.fromHex(Colors.NuclearFuscia)),
    z(101)
  ]);


  pauseBtn.onClick(() => {
    onPauseCallback();
  });


  pauseBtn.onHover(() => {
    pauseBtn.color = Color.fromHex(Colors.VortexViolet);
  });

  pauseBtn.onHoverEnd(() => {
    pauseBtn.color = Color.fromHex(Colors.MutedGrey);
  });

  return pauseBtn;
}

/**
 * OVERLAY
 */
export function createPauseOverlay(onResumeCallback, onQuitCallback) {

  const overlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.7),
    fixed(),
    z(200),
    "pauseOverlay"
  ]);

  const menuPanel = add([
    rect(600, 400, { radius: 30 }),
    pos(200, 50),
    color(rgb(101,115,131)),
    outline(5, Color.fromHex(Colors.VortexViolet)),
    opacity(0.4),
    fixed(),
    z(201),
    "pauseMenu"
  ]);

  const menuPanelPop = add([
    rect(590, 390, { radius: 30 }),
    pos(205, 55),
    color(rgb(144,144,192)),
    opacity(0.3),
    fixed(),
    z(201),
    "pauseMenuPop"
  ]);


  menuPanel.add([
    text("PAWSed", { size: 70, font: "orbitronBold" }),
    pos(120, 25),
    color(Color.fromHex(Colors.NuclearFuscia)),
    z(204)
  ]);

  menuPanel.add([
    text("PAWSed", { size: 70, font: "orbitronBold" }),
    pos(122, 27),
    color(Color.fromHex(Colors.Black)),
    z(203)
  ]);

  const pawsed = menuPanel.add([
    sprite('pawsed'),
    pos(200, 100),
    fixed(),
    scale(2),
    opacity(1),
    z(202),
    "pawsed"
  ]);


  const resumeBtn = add([
    rect(200, 50, { radius: 40 }),
    pos(525, 350),
    color(Color.fromHex(Colors.Black)),
    outline(3, Color.fromHex(Colors.RadioactiveGreen)),
    area(),
    fixed(),
    z(203),
    "resumeBtn"
  ]);

  resumeBtn.add([
    text("RESUME", { size: 28, font: "orbitronBold" }),
    pos(100, 25),
    anchor("center"),
    color(255, 255, 255),
    z(204)
  ]);

  resumeBtn.onClick(() => {
    onResumeCallback();
  });

  resumeBtn.onHover(() => {
    resumeBtn.color = Color.fromHex(Colors.RadioactiveGreen);
  });

  resumeBtn.onHoverEnd(() => {
    resumeBtn.color = Color.fromHex(Colors.Black);
  });

 
  const quitBtn = add([
    rect(200, 50, { radius: 40 }),
    pos(275, 350),
    color(Color.fromHex(Colors.Black)),
    outline(3, Color.fromHex(Colors.VortexViolet)),
    area(),
    fixed(),
    z(203),
    "quitBtn"
  ]);

  quitBtn.add([
    text("QUIT", { size: 28, font: "orbitronBold" }),
    pos(100, 25),
    anchor("center"),
    color(255, 255, 255),
    z(204)
  ]);

  quitBtn.onClick(() => {
    onQuitCallback();
  });

  quitBtn.onHover(() => {
    quitBtn.color = Color.fromHex(Colors.NuclearFuscia);
  });

  quitBtn.onHoverEnd(() => {
    quitBtn.color = Color.fromHex(Colors.Black);
  });

 
  menuPanel.add([
    text("Press ESC or P to resume", { size: 18, font: "orbitron" }),
    pos(300, 375),
    anchor("center"),
    color(Color.fromHex(Colors.MintGlow)),
    z(202)
  ]);

  return { overlay, menuPanel, menuPanelPop, resumeBtn, quitBtn };
}

/**
 * PAUSE SYSTEM
 * @param {Function} gameActiveGetter 
 * @param {Function} gameActiveSetter 
 * @param {Function} onQuitCallback 
 */
export function setupPauseSystem(gameActiveGetter, gameActiveSetter, onQuitCallback = null) {
  let isPaused = false;
  let pauseOverlay = null;
  let pauseMenu = null;
  let pauseMenuPop = null;
  let resumeBtn = null;
  let quitBtn = null;

  const pause = () => {
    if (!gameActiveGetter() || isPaused) return;
    
    isPaused = true;
    debug.paused = true;
    
    
    const overlay = createPauseOverlay(resume, quit);
    pauseOverlay = overlay.overlay;
    pauseMenu = overlay.menuPanel;
    pauseMenuPop = overlay.menuPanelPop;
    resumeBtn = overlay.resumeBtn;
    quitBtn = overlay.quitBtn;
  };

  const resume = () => {
    if (!isPaused) return;
    
    isPaused = false;
    debug.paused = false;
    
    
    if (pauseOverlay) {
      destroy(pauseOverlay);
      pauseOverlay = null;
    }
    if (pauseMenu) {
      destroy(pauseMenu);
      pauseMenu = null;
    }
    if (pauseMenuPop) {
      destroy(pauseMenuPop);
      pauseMenuPop = null;
    }
    if (resumeBtn) {
      destroy(resumeBtn);
      resumeBtn = null;
    }
    if (quitBtn) {
      destroy(quitBtn);
      quitBtn = null;
    }
  };

  const quit = () => {
    
    isPaused = false;
    debug.paused = false;
    
  
    if (pauseOverlay) {
      destroy(pauseOverlay);
      pauseOverlay = null;
    }
    if (pauseMenu) {
      destroy(pauseMenu);
      pauseMenu = null;
    }
    if (pauseMenuPop) {
      destroy(pauseMenuPop);
      pauseMenuPop = null;
    }
    if (resumeBtn) {
      destroy(resumeBtn);
      resumeBtn = null;
    }
    if (quitBtn) {
      destroy(quitBtn);
      quitBtn = null;
    }
    
   
    if (window.levelMusic) {
      window.levelMusic.stop();
      window.levelMusic = null;
    }
    
   
    if (onQuitCallback) {
      onQuitCallback();
    } else {
      go("menu");
    }
  };


  createPauseButton(pause);


  onKeyPress("escape", () => {
    if (isPaused) {
      resume();
    } else if (gameActiveGetter()) {
      pause();
    }
  });

  onKeyPress("p", () => {
    if (isPaused) {
      resume();
    } else if (gameActiveGetter()) {
      pause();
    }
  });

  
  return {
    pause,
    resume,
    isPaused: () => isPaused
  };
}

/**
 * HELPER
 */
export function addPauseToLevel(gameActiveGetter, gameActiveSetter) {
  return setupPauseSystem(gameActiveGetter, gameActiveSetter);
}