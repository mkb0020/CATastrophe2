// bossScene.js
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { getBoss, initializeBoss, chooseBossMove } from '../config/bosses.js';
import { calculateDamage } from '../systems/battleSystem.js';
import { createVolumeToggle, stopAllMusic, startBossMusic, startFinalBossMusic } from '../utils/audioControls.js';
import {
  addBossBackground,
  addBattleSprites,
  addPlayerHPPanel,
  addBossHPPanel,
  addBattleLogPanel,
  addMoveButtonsPanel,
  createMoveButtons,
  updateHPBars,
  updateMoveButtons,
  animateAttack,
  animateHit,
  animateHeal,
  animateDefeat,
  animateExplosion,
  animateFireball,
  animateSmoke,
  animateSwirl,
  animatePowerup,
  animateClaw,
  animateZoomies,
  animateBigBoom,
  animateGreenBlast,
  animateBiscuits,
  animateEspressoFireball,
  animateScratch,
  animateSuperpositionSlam,
  animateHydrogenHammer,
  animatePoisonAttack,
  animateRodentRage,
  animateBite,
  animateMouseMissiles,
  animateLaserBeam,
  animateZap,
  animateWhiskerWhip,
  // 💥 FINISH HIM ANIMATIONS
  animateCatArrow,
  animateCatCrossbow,
  animateBrassToeBeans,
  animatePurrcisionRifle,
  animateMeowlotovCocktail,
  animateFelineFission,
  animatePoooof,
  animateKaBAM,
  setupBossMusic
} from '../helpers/bossHelpers.js';

export function createBossBattleScene(bossId, character, playerHP) {
  // Play SECOND HALF of transition for all bosses EXCEPT Observer
  if (bossId !== 'observerBoss' && bossId !== 'observer') {
    stopAllMusic();
    startBossMusic();
    
    const levelShift = add([
      sprite('levelShiftEnd'),
      pos(0,0),
      scale(10,10),
      opacity(1),
      fixed(),
      z(100),
      "transition"
    ]);
    
    levelShift.play('glitch');
      
 
    const animDuration = 3; 

        wait(animDuration - 0.3, () => {
          tween(
            levelShift.opacity,
            0,
            0.3,
            (val) => levelShift.opacity = val,
            easings.easeOutQuad
          );
        });
          wait(animDuration + 0.1, () => {
      destroy(levelShift);
    });
  } else {
  
    stopAllMusic();
    startFinalBossMusic();
  }




  const bossConfig = getBoss(bossId);
  const boss = initializeBoss(bossId);
  
  // PLAYER STATS
  const player = {
    name: character.name,
    hp: parseInt(playerHP) || character.stats.maxHP,
    maxHP: parseInt(character.stats.maxHP),
    atk: parseInt(character.stats.baseAtk),
    speed: parseInt(character.stats.baseSpeed),
    defense: parseInt(character.stats.baseDefense),
    moves: JSON.parse(JSON.stringify(character.moves)),
    speedBuffTurns: 0,
    defenseBuffTurns: 0
  };

  // BATTLE STATE
  let battleLog = bossConfig.introMessage[0];
  let waitingForPlayer = true;
  let battleActive = true;

  // VISUAL ELEMENTS
  addBossBackground(bossConfig);
  const { playerSprite, playerGlow, bossSprite, bossGlow } = addBattleSprites(character, bossConfig);
  const { playerHPBar, playerHPText } = addPlayerHPPanel(player);
  const { bossHPBar, bossHPText } = addBossHPPanel(boss);
  const logText = addBattleLogPanel(battleLog);
  addMoveButtonsPanel();

  // GETTERS FOR GAME STATES
  const getGameActive = () => battleActive && waitingForPlayer;

  // CREATE MOVE BUTTONS
  const moveButtons = createMoveButtons(player, executeTurn, getGameActive);

  // UPDATE BATTLE LOG
  function updateLog(message) {
    battleLog = message;
    logText.text = message;
  }

  // 🎮 ANIMATIONS
  function playAttackAnimation(moveName, attackerSprite, targetSprite, attackerGlow, isHeal) {
    console.log('🎮 Playing animation for:', moveName, 'uppercase:', moveName.toUpperCase());

    const isPlayer = attackerSprite === playerSprite;
    
    // MAP MOVES TO ANIMATIONS
    switch(moveName.toUpperCase()) {
     
      // PLAYER MOVES
      case "ZOOMIES":
        animateZoomies(attackerSprite, targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
        
      case "CATNIP CLAW":
        animateClaw(attackerSprite, targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
        
      case "SCRATCH":
        animateScratch(attackerSprite, targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
        
      case "MAKE BISCUITS":
        animateBiscuits(attackerSprite);
        animateHeal(attackerSprite, attackerGlow);
        break;
      
      // LASER POINTER BOSS MOVES
      case "ZAP":
        animateZap(attackerSprite, targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
        
      case "LASER BEAM":
        animateLaserBeam(attackerSprite, targetSprite);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
      
      // BOSS CUP MOVES
      case "ESPRESSO EMBER":
        animateEspressoFireball(attackerSprite, targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
        
      case "STEAM BURN":
        animateSmoke(targetSprite);
        animateExplosion(targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
        
      case "REFILL":
        animatePowerup(attackerSprite);
        animateHeal(attackerSprite, attackerGlow);
        break;
      
      // BOSS CUCUMBER MOVES
      case "CUCUMBER CRUNCH":
        animateExplosion(targetSprite);
        shake(20);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
        
      case "CUCUMBER CANNON":
        animateGreenBlast(attackerSprite, targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
        
      case "PICKLE":
        animatePowerup(attackerSprite);
        animateHeal(attackerSprite, attackerGlow);
        break;
        
      case "GOURD GUARD":
        animateSwirl(attackerSprite);
        animateHeal(attackerSprite, attackerGlow);
        break;
      
      // RAT KING
      case "BITE":
        animateBite(attackerSprite, targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
    
      case "RODENT RAGE":
        animateRodentRage(attackerSprite, targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
        
      case "MOUSE MISSILES":
        animateMouseMissiles(attackerSprite, targetSprite);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;

      // OBSERVER MOVES 
      case "POISON":
        animatePoisonAttack(attackerSprite, targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
          
      case "HYDROGEN HAMMER":
        animateHydrogenHammer(attackerSprite, targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
          
      case "SUPERPOSITION SLAM":
        animateSuperpositionSlam(attackerSprite, targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
        
      // DEFAULT: SIMPLE EXPLOSION
      default:
        animateExplosion(targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
    }
  }

  function executeTurn(playerMoveName) {
    waitingForPlayer = false;
    
    const playerMove = player.moves[playerMoveName];
    const bossMoveName = chooseBossMove(boss, null);
    const bossMove = boss.moves[bossMoveName];
    
    // DECREMENT USES
    playerMove.uses--;
    bossMove.uses--;
    
    // DETERMINE ORDER BASED ON SPEED
    let firstAttacker, secondAttacker;
    let firstMove, secondMove;
    let firstMoveName, secondMoveName;
    let firstSprite, secondSprite, firstGlow, secondGlow;
    
    if (player.speed >= boss.speed) {
      firstAttacker = player;
      secondAttacker = boss;
      firstMove = playerMove;
      secondMove = bossMove;
      firstMoveName = playerMoveName;
      secondMoveName = bossMoveName;
      firstSprite = playerSprite;
      secondSprite = bossSprite;
      firstGlow = playerGlow;
      secondGlow = bossGlow;
    } else {
      firstAttacker = boss;
      secondAttacker = player;
      firstMove = bossMove;
      secondMove = playerMove;
      firstMoveName = bossMoveName;
      secondMoveName = playerMoveName;
      firstSprite = bossSprite;
      secondSprite = playerSprite;
      firstGlow = bossGlow;
      secondGlow = playerGlow;
    }
    
    wait(0.5, () => {
      let logMessage = "";
      
      playAttackAnimation(firstMoveName, firstSprite, secondSprite, firstGlow, firstMove.heal);
      
      if (firstAttacker === player) {
        logMessage = executeMove(player, boss, firstMoveName, firstMove);
      } else {
        logMessage = executeMove(boss, player, firstMoveName, firstMove);
      }
      
      updateLog(logMessage);
      updateHPBars(player, boss, playerHPBar, playerHPText, bossHPBar, bossHPText);
      
      if (checkBattleEnd()) {
        return;
      }

      wait(3, () => {
        let secondLogMessage = "";
        
        playAttackAnimation(secondMoveName, secondSprite, firstSprite, secondGlow, secondMove.heal);
        
        if (secondAttacker === player) {
          secondLogMessage = executeMove(player, boss, secondMoveName, secondMove);
        } else {
          secondLogMessage = executeMove(boss, player, secondMoveName, secondMove);
        }
          
        updateLog(secondLogMessage);
        updateHPBars(player, boss, playerHPBar, playerHPText, bossHPBar, bossHPText);
        
        if (checkBattleEnd()) {
          return;
        }
        
        if (player.speedBuffTurns > 0) player.speedBuffTurns--;
        if (player.defenseBuffTurns > 0) player.defenseBuffTurns--;
        if (boss.speedBuffTurns > 0) boss.speedBuffTurns--;
        if (boss.defenseBuffTurns > 0) boss.defenseBuffTurns--;
        
        wait(1, () => {
          updateMoveButtons(moveButtons, player);
          waitingForPlayer = true;
          updateLog("Choose your move!");
        });
      });
    });
  }

  function executeMove(attacker, defender, moveName, move) {
    let message = "";
    
    if (move.heal) {
      const healAmount = Math.min(move.heal, attacker.maxHP - attacker.hp);
      attacker.hp += healAmount;
      message = `${attacker.name} used ${moveName} and restored ${healAmount} HP!`;
    } else if (move.dmg) {
      const damageResult = calculateDamage(attacker, defender, move.dmg);
      defender.hp = Math.max(0, defender.hp - damageResult.damage);
      message = `${attacker.name} used ${moveName} and dealt ${damageResult.damage} damage!`;
      
      if (damageResult.crit) {
        message += " CRITICAL HIT!";
      }
      
      if (move.speedBoost) {
        attacker.speedBuffTurns = 2;
        message += ` ${attacker.name}'s speed increased!`;
      }
      if (move.defenseBoost) {
        attacker.defenseBuffTurns = 2;
        message += ` ${attacker.name}'s defense increased!`;
      }
    }
    
    return message;
  }

  // 💥 FINISH HIM ANIMATION DISPATCHER
  function playFinishHimMove(finishHimName) {
    console.log('💥 FINISH HIM:', finishHimName);
    
    switch(finishHimName) {
      case 'CatCrossbow':
        animateCatCrossbow(playerSprite, bossSprite);
        break;
        
      case 'BrassToeBeans':
        animateBrassToeBeans(playerSprite, bossSprite);
        break;
        
      case 'PURRcisionRifle':
        animatePurrcisionRifle(playerSprite, bossSprite);
        break;
        
      case 'MeowlotovCocktail':
        animateMeowlotovCocktail(playerSprite, bossSprite);
        break;
        
      case 'FelineFission':
        animateFelineFission(bossSprite);
        break;
        
      default:
        console.log('⚠️ Unknown finish move:', finishHimName);
        animatePoooof(bossSprite);
        break;
    }
  }

function checkBattleEnd() {
    const bossHP = parseInt(boss.hp) || 0;
    const currentPlayerHP = parseInt(player.hp) || 0;
    console.log('🔍 Checking battle end | Boss HP:', bossHP, 'Player HP:', currentPlayerHP);
    
    if (bossHP <= 0) {
      console.log('🎉 BOSS DEFEATED! TIME FOR FINISH HIM!');
      battleActive = false;
      waitingForPlayer = false;
      const finishHimMove = bossConfig.finishHim;
      
      moveButtons.forEach(({ btn }) => {
        btn.hidden = true;
      });
      
      const finishText = add([
        text("FINISH HIM!", { size: 100, font: "orbitronBold" }),
        pos(SCREEN_W / 2, SCREEN_H / 2 - 50),
        anchor("center"),
        color(rgb(157, 1, 40)), 
        z(200),
        opacity(0),
        "finishText"
      ]);

      const finishTextShadow = add([
        text("FINISH HIM!", { size: 100, font: "orbitronBold" }),
        pos(SCREEN_W / 2 + 4, SCREEN_H / 2 - 46),
        anchor("center"),
        color(0, 0, 0),
        z(199),
        opacity(0),
        "finishTextShadow"
      ]);

      const finishTextShadow2 = add([
        text("FINISH HIM!", { size: 100, font: "orbitronBold" }),
        pos(SCREEN_W / 2 - 4, SCREEN_H / 2 - 50),
        anchor("center"),
        color(255, 255, 255),
        z(198),
        opacity(0),
        "finishTextShadow2"
      ]);

      tween(0, 1, 0.5, (o) => {
        finishText.opacity = o;
        finishTextShadow.opacity = o * 0.8; 
        finishTextShadow2.opacity = o * 0.7; 
      }, easings.easeOutQuad);

      let pulseTime = 0;

      finishText.onUpdate(() => {
        pulseTime += dt();

        const pulseScale = 1 + Math.sin(pulseTime * 6) * 0.03; 
        finishText.scale = vec2(pulseScale);
        finishTextShadow.scale = vec2(pulseScale);
        finishTextShadow2.scale = vec2(pulseScale);

        const cycleTime = pulseTime % 4; 
        let r, g, b;

        if (cycleTime < 1.33) {  // COLOR HUE SHIFT RED - ORANGE - PINK
          const t = cycleTime / 1.33;
          r = lerp(157, 184, t);  
          g = lerp(1, 59, t);     
          b = lerp(40, 0, t);    
        } else if (cycleTime < 2.66) {
          const t = (cycleTime - 1.33) / 1.33;
          r = lerp(184, 192, t);  
          g = lerp(59, 57, t);   
          b = lerp(0, 200, t);  
        } else {
          const t = (cycleTime - 2.66) / 1.34;
          r = lerp(192, 157, t); 
          g = lerp(57, 1, t);     
          b = lerp(200, 40, t);   
        }
        finishText.color = rgb(r, g, b);
      });
      
      wait(1, () => {
        const buttonWidth = 600;
        const buttonHeight = 70;
        const buttonX = SCREEN_W / 2;
        const buttonY = SCREEN_H / 2 + 60;
        
        const btnBase = add([
          rect(buttonWidth-5, buttonHeight-5, { radius: 35 }),
          pos(buttonX+1.5, buttonY+1.5),
          anchor("center"),
          color(rgb(1,15,31)),
          z(203),
          opacity(0),
        ]);

        const btnInner = add([
          rect(buttonWidth, buttonHeight, { radius: 50 }),
          pos(buttonX, buttonY),
          anchor("center"),
          color(rgb(101,115,131)),
          opacity(0.05),
          z(200),
          opacity(0),
        ]);

        const btnOutline = add([
          rect(buttonWidth + 5, buttonHeight + 5, { radius: 38 }),
          pos(buttonX, buttonY),
          anchor("center"),
          color(rgb(144,144,192)),
          outline(1, rgb(0,0,0)),
          z(199),
          opacity(0),
        ]);

        const btnHighlight = add([
          rect(buttonWidth - 200, buttonHeight, { radius: 50 }),
          pos(buttonX-102, buttonY-2),
          anchor("center"),
          color(rgb(196,195,208)),
          z(202),
          opacity(0),
        ]);

        const highlightLeftX = buttonX - 102;  
        const highlightRightX = buttonX + 102; 
        let currentHighlightTween = null;  
        
        const specialBtn = add([
          rect(buttonWidth, buttonHeight, { radius: 35 }),
          pos(buttonX, buttonY),
          anchor("center"),
          area(),
          z(205),
          opacity(0),
        ]);

        const formattedMoveName = finishHimMove
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .toUpperCase();

        const specialBtnText = add([
          text(`USE ${formattedMoveName}`, { size: 32, font: "orbitronBold" }),
          pos(buttonX, buttonY),
          anchor("center"),
          color(255, 255, 255),
          outline(1, rgb(0, 0, 0)), 
          z(210),
          opacity(0),
        ]);
        
        tween(0, 1, 0.4, (o) => {
          btnBase.opacity = o * 0.8;
          btnInner.opacity = o * 0.8;
          btnOutline.opacity = o;
          btnHighlight.opacity = o * 0.5;
          specialBtnText.opacity = o;
          btnInner.opacity = o;        
        });

        specialBtn.onHover(() => {
          [btnBase, btnInner, btnOutline, btnHighlight, specialBtnText].forEach(obj => obj.scale = vec2(1.08));
          btnBase.color = rgb(0,0,0);
          btnInner.color = rgb(101,115,131);
          btnOutline.outline.width = 2;
          btnOutline.outline.color = rgb(101,115,131);
          btnOutline.color = rgb(144,144,192);

          currentHighlightTween = tween(
            btnHighlight.pos.x,
            highlightRightX,
            0.15,  
            (x) => btnHighlight.pos.x = x,
            easings.easeOutQuad  
          );
        });

        specialBtn.onHoverEnd(() => {
          if (currentHighlightTween) currentHighlightTween.cancel();
          [btnBase, btnInner, btnOutline, btnHighlight, specialBtnText].forEach(obj => obj.scale = vec2(1));
          btnBase.color = rgb(1,15,31);
          btnInner.color = rgb(42,52,57); 
          btnOutline.outline.width = 2;
          btnOutline.outline.color = rgb(144,144,192);

          currentHighlightTween = tween(
            btnHighlight.pos.x,
            highlightLeftX,
            0.15,
            (x) => btnHighlight.pos.x = x,
            easings.easeOutQuad
          );
        });
      
        specialBtn.onClick(() => {
          console.log('💥 SPECIAL ATTACK INITIATED!');
          tween(1, 0, 0.3, (o) => {
            finishText.opacity = o;
            finishTextShadow.opacity = o;
            finishTextShadow2.opacity = o;                 
            btnBase.opacity = o;
            btnOutline.opacity = o;
            specialBtnText.opacity = o;
            btnHighlight.opacity = o;
            btnInner.opacity = o;
          }).then(() => {
            destroy(finishText);
            destroy(finishTextShadow);
            destroy(finishTextShadow2);
            destroy(btnBase);
            destroy(btnOutline);
            destroy(specialBtn);
            destroy(specialBtnText);
            destroy(btnHighlight);
          });
          
          wait(0.5, () => {
            playFinishHimMove(finishHimMove);
            
            let victoryDelay = 3;               
            if (finishHimMove === 'FelineFission') {
              victoryDelay = 6; 
            } 
            
            wait(victoryDelay, () => {
              if (bossId === 'observerBoss') {
                console.log('🎬 Final boss defeated! Transitioning to white screen then Transition7...');
                go("transition", "Transition7", character, player.hp);
              } else {
                animateDefeat(bossSprite, bossGlow, false);
                updateLog(`FLAWLESS VICTORY! THE ${boss.name} HAS BEEN DEFEATED!`);
                
                wait(3, () => {
                  if (bossId === 'BossLaserPointer') {
                    go("bossDefeated", {
                      level: "laserPointerBoss",
                      score: 0,
                      nextLevel: "Transition5",
                      character: character,
                      playerHP: player.hp
                    });
                  } else if (bossId === 'BossCup') {
                    go("bossDefeated", {
                      level: "cupBoss",
                      score: 0,
                      nextLevel: "Transition2",
                      character: character,
                      playerHP: player.hp
                    });
                  } else if (bossId === 'BossCucumber') {
                    go("bossDefeated", {
                      level: "cucumberBoss",
                      score: 0,
                      nextLevel: "Transition3",
                      character: character,
                      playerHP: player.hp
                    });
                  } else if (bossId === 'BossRatKing') {
                    go("bossDefeated", {
                      level: "ratKingBoss",
                      score: 0,
                      nextLevel: "Transition4",
                      character: character,
                      playerHP: player.hp
                    });
                  }
                });
              }
            });
          });
        });
      });
      
      return true;
      
    } else if (currentPlayerHP <= 0) {
      console.log('💀 PLAYER DEFEATED IN BOSS BATTLE!');
      battleActive = false;
      waitingForPlayer = false;
      updateLog(`${player.name} has been defeated...`);
      
      animateDefeat(playerSprite, playerGlow, true);
      wait(1, () => {
        const currentLives = player.lives || 0;
        if (currentLives > 0) {
          console.log(`💚 Player has ${currentLives} lives remaining - going to You Died screen`);
          
          let restartLevel = "level1";
          if (bossId === 'BossLaserPointer') {
            restartLevel = "level4";
          } else if (bossId === 'BossCup') {
            restartLevel = "level1";
          } else if (bossId === 'BossCucumber') {
            restartLevel = "level2";
          } else if (bossId === 'BossRatKing') {
            restartLevel = "level3";
          } else if (bossId === 'observerBoss') {
            restartLevel = "level5";
          }
          
          go("youDied", { 
            score: 0,
            level: restartLevel,
            hp: 0,
            lives: currentLives - 1, 
            character: character,
            reason: `Defeated by ${boss.name}`
          });
        } else {
          console.log('☠️ No lives remaining - GAME OVER');
          wait(1.5, () => {
            console.log('☠️ Playing blood drip animation...');
            stopAllMusic();
            
            const bloodDrip = add([
              sprite('drip', { anim: 'drip' }),
              pos(0, 0),
              scale(10, 10),
              z(1000),
              fixed(),
              opacity(1)
            ]);
    
            bloodDrip.play('drip');
            go("gameOver", { 
              score: 0,
              level: "boss",
              hp: 0,
              lives: 0,
              character: character,
              fromBloodDrip: true
            });
          });
        }
      });
      
      return true;
    }
    
    return false;
}
  
  // INITIALIZE
  updateHPBars(player, boss, playerHPBar, playerHPText, bossHPBar, bossHPText);
  updateMoveButtons(moveButtons, player);
  createVolumeToggle();
}

export function createLaserPointerBossScene(character, playerHP) {
  createBossBattleScene('BossLaserPointer', character, playerHP);
}

export function createCupBossScene(character, playerHP) {
  createBossBattleScene('BossCup', character, playerHP);
}

export function createCucumberBossScene(character, playerHP) {
  createBossBattleScene('BossCucumber', character, playerHP);
}

export function createRatKingBossScene(character, playerHP) {
  createBossBattleScene('BossRatKing', character, playerHP);
}

export function createObserverBossScene(character, playerHP) {
  createBossBattleScene('observerBoss', character, playerHP);
}