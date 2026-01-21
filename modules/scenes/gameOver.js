// gameOver.js 
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { stopAllMusic, startMenuMusic, startGameOverMusic, startVictoryMusic } from '../helpers/kittyHelpers.js';
import { getCharacterStats } from '../config/characters.js'; 

export function createGameOverScene(data) { // GAME OVER SCREEN - NO LIVES LEFT
  console.log('☠️ GAME OVER SCENE (NO LIVES LEFT)');
  console.log('📦 Data received:', data);
  
  const { score, level, character, reason } = data;
  stopAllMusic(); 
  startGameOverMusic();
  
  const gameOverButtons = document.getElementById('gameOverButtons');
  if (gameOverButtons) gameOverButtons.classList.remove('hidden');
 
  const darkRedOverlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    z(1000),
    opacity(1),
    fixed()
  ]);

  tween(1, 0, 3, (o) => {
    darkRedOverlay.opacity = o;
  }, easings.easeInOutQuad).then(() => {
    destroy(darkRedOverlay);
  });

  const bg = add([ 
    sprite('menuBG'),
    pos(0, 0),
    scale(SCREEN_W / 1000, SCREEN_H / 480),
    z(0),
    opacity(0)
  ]);

  const darkOverlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0),
    z(1)
  ]);

  const textPanel = add([ // TEXT PANEL
    rect(750, 405, { radius: 40 }),
    pos(125, 40),
    color(17, 12, 30),
    outline(4, rgb(144,144,192)),
    z(2),
    opacity(0)
  ]);

  // "GAME OVER" 
  const gameOverTitle = add([
    text("GAME OVER", { 
      size: 80, 
      font: "science" 
    }),
    pos(SCREEN_W / 2, 125),
    anchor("center"),
    color(173,8,5),
    z(3),
    opacity(0)
  ]);

  const gameOverTitleShadow = add([
    text("GAME OVER", { 
      size: 80, 
      font: "science" 
    }),
    pos(SCREEN_W / 2 + 2, 127),
    anchor("center"),
    color(Color.fromHex(Colors.White)),
    z(2),
    opacity(0)
  ]);

  const disappointText = add([
    text("YOU'VE DISAPPOINTED EVERYONE", { 
      size: 33, 
      font: "science" 
    }),
    pos(SCREEN_W / 2, 230),
    anchor("center"),
    color(rgb(255,255,255)),
    z(3),
    opacity(0)
  ]);

  const disappointText2 = add([
    text("YOU'VE DISAPPOINTED EVERYONE", { 
      size: 35, 
      font: "science" 
    }),
    pos(SCREEN_W / 2 + 1, 232),
    anchor("center"),
    color(Color.fromHex(Colors.Black)),
    z(2),
    opacity(0)
  ]);

  let reasonText = null;
  if (reason) {
    reasonText = add([
      text(reason, { 
        size: 22, 
        font: "science" 
      }),
      pos(SCREEN_W / 2, 240),
      anchor("center"),
      color(200, 200, 200),
      z(3),
      opacity(0)
    ]);
  }

  const scoreText = add([
    text(`Final Score: ${score}`, { size: 34, font: "science" }),
    pos(SCREEN_W / 2, 305),
    anchor("center"),
    color(219, 226, 233),
    z(3),
    opacity(0)
  ]);

  const scoreText2 = add([
    text(`Final Score: ${score}`, { size: 34, font: "science" }),
    pos(SCREEN_W / 2 + 1, 306),
    anchor("center"),
    color(0, 0, 0),
    z(2),
    opacity(0)
  ]);

  const menuBtn = document.getElementById('gameOverMenuBtn');
  if (menuBtn) {
    menuBtn.onclick = () => {
      gameOverButtons.classList.add('hidden');
      stopAllMusic();
      startMenuMusic();
      go("menu");
    };
  }
  
wait(0.5, () => {
  tween(0, 1, 1.2, (o) => {
    bg.opacity = o;
  }, easings.easeOutQuad);
  
  tween(0, 0.6, 1.2, (o) => {
    darkOverlay.opacity = o;
  }, easings.easeOutQuad);
  
  tween(0, 1, 1.5, (o) => {
    textPanel.opacity = o;
    gameOverTitle.opacity = o;
    gameOverTitleShadow.opacity = o;
    disappointText.opacity = o;
    disappointText2.opacity = o;
    if (reasonText) reasonText.opacity = o;
    scoreText.opacity = o;
    scoreText2.opacity = o;
  }, easings.easeOutQuad);
  
  const buttonContainer = document.querySelector('.gameover-btn-container');
  if (buttonContainer) {
    buttonContainer.classList.add('show');
  }
});

  onSceneLeave(() => {
    if (gameOverButtons) gameOverButtons.classList.add('hidden');
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
  console.log('💤 Character:', data.character);
  
  const { score, level, lives, character, reason, startingScore = 0 } = data;
  
  console.log('💰 Current Score (for display):', score);
  console.log('💰 Starting Score (will restore to):', startingScore);
  
  if (!character) {
    console.error('❌ ERROR: No character data received!');
    console.log('Redirecting to menu...');
    go("menu");
    return;
  }
  
  stopAllMusic();
  play("gameOverSound", { volume: 0.1 });
  
  const youDiedButtons = document.getElementById('youDiedButtons');
  if (youDiedButtons) youDiedButtons.classList.remove('hidden');
  
  add([
    sprite('menuBG'),
    pos(0, 0),
    scale(SCREEN_W / 1000, SCREEN_H / 480),
    z(0)
  ]);

  add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(65, 3, 2),
    opacity(0.6),
    z(1)
  ]);

  add([
    rect(700, 415, { radius: 40 }),
    pos(150, 45),
    color(0, 0, 0),
    outline(4, rgb(196,195,208)),
    z(1)
  ]);

  add([
    text("YOU DIED", { 
      size: 70, 
      font: "orbitronBold",
      weight: "bold"
    }),
    pos(SCREEN_W / 2, 100),
    anchor("center"),
    color(255, 255, 255),
    z(3)
  ]);

  add([
    text("YOU DIED", { 
      size: 70, 
      font: "orbitronBold",
      weight: "bold"
    }),
    pos(SCREEN_W / 2 + 2, 102),
    anchor("center"),
    color(201, 0, 0),
    z(2)
  ]);

  add([
    text("Sharpen those claws and get back out there!", { 
      size: 24, 
      font: "science" 
    }),
    pos(SCREEN_W / 2, 180),
    anchor("center"),
    color(rgb(219,226,233)),
    z(2)
  ]);

  add([
    text(`Score: ${score}`, { size: 30, font: "science" }),
    pos(SCREEN_W / 2, 230),
    anchor("center"),
    color(rgb(144,144,192)),
    z(2)
  ]);

  add([
    text(`Lives Left: ${lives}`, { 
      size: 30, 
      font: "science" 
    }),
    pos(SCREEN_W / 2, 280),
    anchor("center"),
    color(Color.fromHex(Colors.MintBlue)),
    z(2)
  ]);

  const useLifeBtn = document.getElementById('useLifeBtn');
  const quitBtn = document.getElementById('quitToMenuBtn');

  if (useLifeBtn) {
    useLifeBtn.onclick = () => {
      console.log(`🎮 You had: ${lives} lives`);
      const newLives = lives - 1;
      character.lives = newLives; 
      console.log(`🎮 Continuing ${level} with ${newLives} lives`);
      console.log(`💤 Character:`, character);
      
      const maxHP = character.stats?.maxHP || 100;
      const restoredHP = Math.floor(maxHP * 0.5);
      
      console.log(`❤️ Restoring HP to ${restoredHP} (50% of ${maxHP})`);
      console.log(`💰 Restoring score to ${startingScore} (from before level started)`);
      
      youDiedButtons.classList.add('hidden');
      
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
      youDiedButtons.classList.add('hidden');
      stopAllMusic();
      startMenuMusic();
      go("menu");
    };
  }

  onSceneLeave(() => {
    if (youDiedButtons) youDiedButtons.classList.add('hidden');
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