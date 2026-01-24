// gameOver.js 
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { stopAllMusic, startMenuMusic, startGameOverMusic, startVictoryMusic } from '../helpers/kittyHelpers.js';
import { getCharacterStats } from '../config/characters.js'; 
import { showMobileArrows, hideMobileArrows } from '../helpers/mobileControls.js';

export function createGameOverScene(data) {
  console.log('☠️ GAME OVER SCENE (NO LIVES LEFT)');
  console.log('📦 Data received:', data);
  
  const { score, level, character, reason } = data;
  
  const mobileSetup = window.mobileSetup;
  const mobileHUD = window.mobileHUD;
  
  if (mobileSetup && mobileSetup.isMobile && mobileHUD) {
    mobileHUD.hide();
    hideMobileArrows();
  }
  
  stopAllMusic(); 
  startGameOverMusic();
  
  const modal = document.getElementById('gameOverModal');
  const scoreText = document.getElementById('gameOverScoreText');
  
  if (scoreText) {
    scoreText.textContent = `Final Score: ${score}`;
  }
  
  if (modal) {
    modal.classList.add('show');
  }
  
  const backBtn = document.getElementById('gameOverBackBtn');
  if (backBtn) {
    backBtn.onclick = () => {
      modal.classList.remove('show');
      stopAllMusic();
      startMenuMusic();
      go("menu");
    };
  }
  
  onSceneLeave(() => {
    if (modal) modal.classList.remove('show');
  });
}

function restartLevel(levelName, character, remainingLives) {
  console.log(`🔄 Restarting ${levelName} with ${remainingLives - 1} lives`);
  
  if (levelName === "level1") {
    go("level1", character);
  } else if (levelName === "level2") {
    go("level2", character, character.stats.maxHP); 
  } else if (levelName === "level3") {
    go("level3", character, character.stats.maxHP);
  } else if (levelName === "boss") {
    go("menu"); 
  }
}

function returnToMenu() {
  stopAllMusic(); 
  startMenuMusic();
  go("menu");
}
  

export function createYouDiedScene(data) {
  console.log('💀 YOU DIED SCENE');
  console.log('📦 Data received:', data);
  
  const { score, level, lives, character, reason, startingScore = 0 } = data;
  
  if (!character) {
    console.error('❌ ERROR: No character data received!');
    go("menu");
    return;
  }
  
  const mobileSetup = window.mobileSetup;
  const mobileHUD = window.mobileHUD;
  
  if (mobileSetup && mobileSetup.isMobile && mobileHUD) {
    mobileHUD.hide();
    hideMobileArrows();
  }
  
  stopAllMusic();
  play("gameOverSound", { volume: 0.1 });
  
  const modal = document.getElementById('youDiedModal');
  const scoreText = document.getElementById('youDiedScoreText');
  const livesText = document.getElementById('youDiedLivesText');
  
  if (scoreText) scoreText.textContent = `Score: ${score}`;
  if (livesText) livesText.textContent = `Lives Left: ${lives}`;
  
  if (modal) modal.classList.add('show');
  
  const useLifeBtn = document.getElementById('useLifeModalBtn');
  const quitBtn = document.getElementById('quitToMenuModalBtn');
  
if (useLifeBtn) {
  useLifeBtn.onclick = () => {
    const newLives = lives - 1;
    const maxHP = character.stats?.maxHP || 100;
    const restoredHP = Math.floor(maxHP * 0.5);
    
    console.log(`🎮 Continuing ${level} with ${newLives} lives`);
    console.log(`❤️ Restoring HP to ${restoredHP}`);
    console.log(`💰 Restoring score to ${startingScore}`);
    
    modal.classList.remove('show');
    
    setTimeout(() => {
      const canvas = document.getElementById('gameCanvas');
      if (canvas) {
        canvas.focus();
        console.log('✅ Canvas refocused - ready to play!');
      }
    }, 100);
    
    go(level, {
      character,
      startHP: restoredHP,
      lives: newLives,
      score: startingScore 
      });
    };
  }
  
  if (quitBtn) {
    quitBtn.onclick = () => {
      modal.classList.remove('show');
      stopAllMusic();
      startMenuMusic();
      go("menu");
    };
  }
  
  onSceneLeave(() => {
    if (modal) modal.classList.remove('show');
  });
}

export function createVictoryScene(data) {
  const { character } = data || {};
  
  stopAllMusic(); 
  play("VictorySound", { volume: 0.6 }); 

  add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(102, 126, 234),
    z(0)
  ]);

  add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(118, 75, 162),
    opacity(0.6),
    z(0)
  ]);

  add([
    rect(700, 280, { radius: 10 }),
    pos(150, 100),
    color(42, 26, 74),
    outline(3, Color.fromHex(Colors.Highlight)),
    z(1)
  ]);

  add([
    text("FLAWLESS VICTORY!", { 
      size: 56, 
      font: "science",
      weight: "bold"
    }),
    pos(SCREEN_W / 2, 180),
    anchor("center"),
    color(38, 243, 130),
    z(2)
  ]);

  add([
    text("You did it!", { 
      size: 32, 
      font: "science",
      weight: "bold"
    }),
    pos(SCREEN_W / 2, 240),
    anchor("center"),
    color(255, 255, 255),
    z(2)
  ]);

  const charName = character ? character.name : "Hero";
  add([
    text(`${charName} saved Schrödinger's Cat Café!`, { 
      size: 24, 
      font: "science"
    }),
    pos(SCREEN_W / 2, 285),
    anchor("center"),
    color(217, 189, 248),
    z(2)
  ]);

  add([
    text("Quantum bliss has been restored!", { 
      size: 18, 
      font: "science",
      style: "italic"
    }),
    pos(SCREEN_W / 2, 320),
    anchor("center"),
    color(176, 180, 255),
    z(2)
  ]);

  add([
    text("Click anywhere to return to menu", { 
      size: 18, 
      font: "science",
      style: "italic"
    }),
    pos(SCREEN_W / 2, 355),
    anchor("center"),
    color(176, 180, 255),
    z(2)
  ]);

  // CONFETTI
  const confettiColors = [
    rgb(255, 107, 157),
    rgb(157, 78, 221),
    rgb(145, 139, 252),
    rgb(181, 255, 168),
    rgb(255, 140, 171)
  ];

  loop(0.1, () => {
    const confetti = add([
      rect(8, 8),
      pos(rand(0, SCREEN_W), -20),
      color(choose(confettiColors)),
      rotate(rand(0, 360)),
      z(5),
      {
        vel: rand(50, 150),
        rotSpeed: rand(-5, 5)
      }
    ]);

    confetti.onUpdate(() => {
      confetti.move(0, confetti.vel);
      confetti.angle += confetti.rotSpeed;
      
      if (confetti.pos.y > SCREEN_H + 20) {
        destroy(confetti);
      }
    });
  });

  onClick(() => {
    returnToMenu();
  });

  onKeyPress("escape", () => {
    returnToMenu();
  });
}

export function createLevelCompleteScene(data) {
  console.log('🎊 LEVEL COMPLETE SCENE');
  console.log('📦 Data received:', data);
  
  const { level, score, nextLevel, character, startHP } = data;
  play("VictorySound", { volume: 0.5 });

  const levelCompleteButton = document.getElementById('levelCompleteButton');
  if (levelCompleteButton) levelCompleteButton.classList.remove('hidden');

  add([
    sprite('menuBG'),
    pos(0, 0),
    scale(SCREEN_W / 1000, SCREEN_H / 480),
    z(1)
  ]);

  const panel = add([
    rect(800, 400, { radius: 50 }),
    pos(100,60),
    color(17, 12, 30),
    outline(6, rgb(144,144,192)),
    opacity(0.95),
    z(2)
  ]);

  const titleShadow = add([
    text("LEVEL COMPLETE!", { size: 64, font: "orbitronBold" }),
    pos(center().x, 120),
    anchor("center"),
    color(0, 255, 255),
    opacity(0.6),
    z(4)
  ]);

  const title = add([
    text("LEVEL COMPLETE!", { size: 64, font: "orbitronBold" }),
    pos(center().x, 119),
    anchor("center"),
    color(255, 255, 255),
    z(5)
  ]);

  function spawnConfetti() {
    const colors = ["#4dff4d"];
    for (let i = 0; i < 100; i++) {
      const p = add([
        circle(6),
        pos(center()),
        color(rgb(88,232,76)), 
        lifespan(2 + rand(1)),
        move(rand(0, 360), rand(300, 600)),
        opacity(1),
        scale(rand(0.8, 1.4)),
        z(100),
      ]);
      
      tween(1, 0, 1.5, (o) => p.opacity = o, easings.easeOutQuad);
    }
  }
  wait(0.3, spawnConfetti);

  const scoreText = add([
    text(`Score: ${score}`, { size: 40, font: "science" }),
    pos(center().x, 220),
    anchor("center"),
    color(255, 255, 255),
    opacity(0),
    z(5)
  ]);

  const hpText = add([
    text(`HP Remaining: ${startHP}`, { size: 40, font: "science" }),
    pos(center().x, 280),
    anchor("center"),
    color(200, 255, 200),
    opacity(0),
    z(5)
  ]);

  wait(0.8, () => tween(0, 1, 0.6, (o) => scoreText.opacity = o));
  wait(1.2, () => tween(0, 1, 0.6, (o) => hpText.opacity = o));

  const continueBtn = document.getElementById('levelContinueBtn');
  if (continueBtn) {
    continueBtn.onclick = () => {
      levelCompleteButton.classList.add('hidden');
      go(nextLevel, { 
        character: character,
        startHP: startHP
      });
    };
  }

  onSceneLeave(() => {
    if (levelCompleteButton) levelCompleteButton.classList.add('hidden');
  });
}

export function createBossDefeatedScene(data) {
  console.log('🏆 Boss Defeated Scene received:', data);

  const { 
    level = "cupBoss", 
    score = 0, 
    nextLevel = "level2", 
    character, 
    playerHP, 
    lives = 3 
  } = data || {};  
  console.log('📊 Extracted values:', { score, playerHP, lives });
  console.log('📊 Character.lives:', character.lives);  
  console.log('📊 Data.lives:', data.lives);  

  stopAllMusic();
  play("VictorySound", { volume: 0.6 }); 
  
  add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(11, 11, 27),
    opacity(0.8),
    z(0)
  ]);

  add([
    pos(0, 0),
    z(0),
    {
      draw() {
        const gridSize = 40;
        const lineColor = rgb(140, 82, 255);

        for (let x = 0; x <= SCREEN_W; x += gridSize) {
          drawLine({
            p1: vec2(x, 0),
            p2: vec2(x, SCREEN_H),
            color: lineColor,
            opacity: 0.3,
            width: 2,
          });
        }

        for (let y = 0; y <= SCREEN_H; y += gridSize) {
          drawLine({
            p1: vec2(0, y),
            p2: vec2(SCREEN_W, y),
            color: lineColor,
            opacity: 0.3,
            width: 2,
          });
        }
      }
    }
  ]);

  add([
    rect(700, 240, { radius: 30 }),
    pos(150, 140),
    color(42, 26, 74),
    opacity(0.9),
    outline(3, Color.fromHex("#ff6bff")),
    z(1)
  ]);

  let titleText = "THE LARGE HADRON CUP";
  if (level === "cucumberBoss") titleText = "THE UNSTABLE CUCUMBER";
  else if (level === "ratKingBoss") titleText = "THE RADIOACTIVE RAT KING";
  else if (level === "laserPointerBoss") titleText = "THE GAMMA LASER POINTER";
  else if (level === "observerBoss") titleText = "THE OBSERVER";

  add([
    text(titleText, { 
      size: 38, 
      font: "science",
      weight: "bold"
    }),
    pos(SCREEN_W / 2, 180),
    anchor("center"),
    color(255, 107, 255),
    z(2)
  ]);

  add([
    text("WAS DEFEATED!", { 
      size: 40, 
      font: "science",
      weight: "bold"
    }),
    pos(SCREEN_W / 2, 230),
    anchor("center"),
    color(255, 107, 255),
    z(2)
  ]);

  add([
    text("Click anywhere to continue", { 
      size: 24, 
      font: "science"
    }),
    pos(SCREEN_W / 2, 350),
    anchor("center"),
    color(160, 210, 219),
    z(2)
  ]);

  onClick(() => {
    console.log('🚀 BEFORE go() - values are:', { nextLevel, playerHP, lives, score });

    if (nextLevel.startsWith("Transition")) {
      console.log('🚀 Calling go with these exact params:', nextLevel, character.name, playerHP, lives, score);
      go("transition", nextLevel, character, playerHP, lives, score);  
    }
    else if (nextLevel === "level2") {
      go("level2", { character, startHP: playerHP, lives, score });  
    } else if (nextLevel === "level3") {
      go("level3", { character, startHP: playerHP, lives, score });  
    } else if (nextLevel === "level4") {
      go("level4", { character, startHP: playerHP, lives, score });  
    } else if (nextLevel === "level5") {
      go("level5", { character, startHP: playerHP, lives, score });  
    } else {
      go("menu");
    }
  });
}