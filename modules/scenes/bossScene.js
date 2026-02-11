// bossScene.js
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { getBoss, initializeBoss, chooseBossMove } from '../config/bosses.js';
import { calculateDamage } from '../systems/battleSystem.js';
import { stopAllMusic, startBossMusic, startFinalBossMusic, ensureMusicLoaded } from '../helpers/kittyHelpers.js';
import {
  addBossBackground,
  addBattleSprites,
  addPlayerHPPanel,
  addBossHPPanel,
  addBattleLogPanel,
  addMoveButtonsPanel,
  hideMoveButtons,
  showMoveButtons,
  createMoveButtons,
  updateHPBars,
  updateMoveButtons,
  hideBattleUI,  
  showBattleUI,
  animateAttack,
  animateHit,
  animateHeal,
  animateDefeat,
  animateExplosion,
  animateFireball,
  animateSmoke,
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
  // FINISH HIM ANIMATIONS
  animateCatArrow,
  animateCatCrossbow,
  animateBrassToeBeans,
  animatePurrcisionRifle,
  animateMeowlotovCocktail,
  animateFelineFission,
  animatePoooof,
  animateKaBAM,
  setupBossMusic,
  animateGreenBoom,
  animateBurn,
  animateFlash
} from '../helpers/bossHelpers.js';
import { applyUpgradesToBossPlayer } from '../helpers/upgradeHelper.js';
import { showMobileArrows, hideMobileArrows, hideJoystickControls } from '../helpers/mobileControls.js';
import { hideHUD } from '../helpers/levelHelpers.js';



export function createBossBattleScene(bossId, character, startHP, startScore = 0) {
    hideHUD();
    hideJoystickControls();
    console.log('ðŸŽ® Boss Battle Starting:', {
      bossId,
      character: character.name,
      startHP,
      startScore
    });


  // ==================== LETTERBOX FOR BOSS BATTLES ====================
  const canvas = document.getElementById('gameCanvas');
  const originalCanvasStyles = {
    maxWidth: canvas.style.maxWidth,
    maxHeight: canvas.style.maxHeight,
    aspectRatio: canvas.style.aspectRatio,
    margin: canvas.style.margin
  };
  
  canvas.style.maxWidth = '1000px';
  canvas.style.maxHeight = '480px';
  canvas.style.aspectRatio = '1000 / 480';
  canvas.style.margin = 'auto'; 
  
  console.log('📦 Boss battle letterboxing applied');

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
      
 
    const animDuration = 1; 

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
  hp: parseInt(startHP) || character.stats.maxHP,
  maxHP: parseInt(character.stats.maxHP),
  atk: parseInt(character.stats.baseAtk),
  speed: parseInt(character.stats.baseSpeed),
  defense: parseInt(character.stats.baseDefense),
  moves: JSON.parse(JSON.stringify(character.moves)),
  speedBuffTurns: 0,
  defenseBuffTurns: 0,
  lives: character.lives !== undefined ? character.lives : 3 
};

applyUpgradesToBossPlayer(player);

  // BATTLE STATE
  let battleLog = bossConfig.introMessage[0];
  let waitingForPlayer = true;
  let battleActive = true;


  const battleUI = document.getElementById('battleUI');
  if (battleUI) {
    battleUI.classList.remove('hidden');
    battleUI.style.display = ''; 
    battleUI.style.visibility = ''; 
    console.log('✅ Battle UI shown, classes:', battleUI.className);
  } else {
    console.error('❌ battleUI element not found in DOM!');
  }
  
  const battleBottomBar = document.getElementById('battleBottomBar');
  if (battleBottomBar) {
    battleBottomBar.classList.remove('hidden');
  }
  
  const finishHimTextElement = document.getElementById('finishHimText');
  if (finishHimTextElement) {
    finishHimTextElement.classList.add('hidden');
  }

  // VISUAL ELEMENTS
  addBossBackground(bossConfig);
  const { playerSprite, bossSprite } = addBattleSprites(character, bossConfig);
  const { playerHPBar, playerHPText } = addPlayerHPPanel(player);
  const { bossHPBar, bossHPText } = addBossHPPanel(boss);
  const logText = addBattleLogPanel(battleLog);
  addMoveButtonsPanel();
  showBattleUI(0);
  // GETTERS FOR GAME STATES
  const getGameActive = () => battleActive && waitingForPlayer;

  // CREATE MOVE BUTTONS
  const moveButtons = createMoveButtons(player, executeTurn, getGameActive);
  showMoveButtons(moveButtons);


function updateLog(message) {
  battleLog = message;
  const logText = document.getElementById('battleLogText');
  if (logText) {
    logText.textContent = message;
  }
}

  // ANIMATIONS
  function playAttackAnimation(moveName, attackerSprite, targetSprite, isHeal) {
    console.log('ðŸŽ® Playing animation for:', moveName, 'uppercase:', moveName.toUpperCase());

    const isPlayer = attackerSprite === playerSprite;
    
    // MAP MOVES TO ANIMATIONS
    switch(moveName.toUpperCase()) {
     
      // PLAYER MOVES
      case "ZOOMIES":
        animateZoomies(attackerSprite, targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
        
      case "CATNIP CLAW":
        animateClaw(attackerSprite, targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
        
      case "SCRATCH":
        animateScratch(attackerSprite, targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
        
      case "MAKE BISCUITS":
        animateBiscuits(attackerSprite);
        animateHeal(attackerSprite);
        break;

      case "WHISKER WHIP":
        animateWhiskerWhip(attackerSprite, targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
      
      // LASER POINTER BOSS MOVES

      case "PHOTON FLASH":
        animateFlash();
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;

      case "ZAP":
        animateZap(attackerSprite, targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
        
      case "LASER BEAM":
        animateLaserBeam(attackerSprite, targetSprite);
        wait(0.2, () => animateHit(targetSprite));
        break;
      
      // BOSS CUP MOVES
      case "ESPRESSO EMBER":
        animateEspressoFireball(attackerSprite, targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
        
      case "STEAM BURN":
        animatePoooof(targetSprite);
        animateBurn(targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
        
      case "REFILL":
        animatePowerup(attackerSprite);
        animateHeal(attackerSprite);
        break;
      
      // BOSS CUCUMBER MOVES
      case "CUCUMBER CRUNCH":
        animateGreenBoom(targetSprite);
        shake(20);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
        
      case "CUCUMBER CANNON":
        animateGreenBlast(attackerSprite, targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
        
      case "PICKLE":
        animatePowerup(attackerSprite);
        animateHeal(attackerSprite);
        break;
        
      case "GOURD GUARD":
        animatePowerup(attackerSprite);
        animateHeal(attackerSprite);
        break;
      
      // RAT KING
      case "BITE":
        animateBite(attackerSprite, targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
    
      case "RODENT RAGE":
        animateRodentRage(attackerSprite, targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
        
      case "MOUSE MISSILES":
        animateMouseMissiles(attackerSprite, targetSprite);
        wait(0.2, () => animateHit(targetSprite));
        break;

      case "SCURRY":
          animatePowerup(attackerSprite);
          animateHeal(attackerSprite);
          break;

      // OBSERVER MOVES 
      case "POISON":
        animatePoisonAttack(attackerSprite, targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
          
      case "HYDROGEN HAMMER":
        animateHydrogenHammer(attackerSprite, targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;
          
      case "SUPERPOSITION SLAM":
        animateSuperpositionSlam(attackerSprite, targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
        break;

      case "QUANTUM RECOVER":
        animatePowerup(attackerSprite);
        animateHeal(attackerSprite);
        break;

        
      // DEFAULT: SIMPLE EXPLOSION
      default:
        animateExplosion(targetSprite);
        animateAttack(attackerSprite, isPlayer);
        wait(0.2, () => animateHit(targetSprite));
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
    let firstSprite, secondSprite;
    
    if (player.speed >= boss.speed) {
      firstAttacker = player;
      secondAttacker = boss;
      firstMove = playerMove;
      secondMove = bossMove;
      firstMoveName = playerMoveName;
      secondMoveName = bossMoveName;
      firstSprite = playerSprite;
      secondSprite = bossSprite;
    } else {
      firstAttacker = boss;
      secondAttacker = player;
      firstMove = bossMove;
      secondMove = playerMove;
      firstMoveName = bossMoveName;
      secondMoveName = playerMoveName;
      firstSprite = bossSprite;
      secondSprite = playerSprite;
    }
    
    wait(0.5, () => {
      let logMessage = "";
      
      playAttackAnimation(firstMoveName, firstSprite, secondSprite, firstMove.heal);
      
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
        
        playAttackAnimation(secondMoveName, secondSprite, firstSprite, secondMove.heal);
        
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

  // FINISH HIM ANIMATION DISPATCHER
  function playFinishHimMove(finishHimName) {
    console.log('ðŸ’¥ FINISH HIM:', finishHimName);
    
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
        console.log('âš ï¸ Unknown finish move:', finishHimName);
        animatePoooof(bossSprite);
        break;
    }
  }

function checkBattleEnd() {
    const bossHP = parseInt(boss.hp) || 0;
    const currentPlayerHP = parseInt(player.hp) || 0;
    
    if (bossHP <= 0) {
      console.log('ðŸŽ‰ BOSS DEFEATED! TIME FOR FINISH HIM!');
      battleActive = false;
      waitingForPlayer = false;
      hideMoveButtons(moveButtons);
      hideBattleUI();
      const finishHimMove = bossConfig.finishHim;
      
      moveButtons.forEach(({ btn }) => {
        btn.hidden = true;
      });
      
      const finishHimButton = document.getElementById('finishHimButton');
      const finishHimBtn = document.getElementById('finishHimBtn');
      const finishHimBtnText = document.getElementById('finishHimBtnText');
      
      if (finishHimButton && finishHimBtn && finishHimBtnText) {
        const formattedMoveName = finishHimMove
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .toUpperCase();
        finishHimBtnText.textContent = `USE ${formattedMoveName}`;
        
        finishHimButton.classList.remove('hidden');
        finishHimButton.classList.remove('hidden');
      }
      
      const finishHimTextElement = document.getElementById('finishHimText');
      const battleBottomBar = document.getElementById('battleBottomBar');
      
      if (finishHimTextElement) {
        finishHimTextElement.classList.remove('hidden');
      }
      
      if (battleBottomBar) {
        battleBottomBar.classList.add('hidden');
      }
      
      if (finishHimBtn) {
        finishHimBtn.onclick = () => {
          console.log('💥 SPECIAL ATTACK INITIATED!');
          
          finishHimButton.classList.add('hidden');
          
          if (finishHimTextElement) {
            finishHimTextElement.style.transition = 'opacity 0.3s ease';
            finishHimTextElement.style.opacity = '0';
            setTimeout(() => {
              finishHimTextElement.classList.add('hidden');
              finishHimTextElement.style.opacity = '';
            }, 300);
          }
          
          wait(0.5, () => {
            playFinishHimMove(finishHimMove);
            
            let victoryDelay = 1.2;
            if (finishHimMove === 'CatCrossbow') victoryDelay = 3.2;
            if (finishHimMove === 'PURRcisionRifle') victoryDelay = 2.8;
            if (finishHimMove === 'MeowlotovCocktail') victoryDelay = 2.2;
            if (finishHimMove === 'FelineFission') victoryDelay = 14.8;
            
            wait(victoryDelay, () => {
              if (bossId === 'observerBoss') {
                go("transition", "Transition7", character, player.hp, player.lives, startScore);

              } else {
                animateDefeat(bossSprite, false);
                updateLog(`PURRRRRFECT VICTORY! THE ${boss.name} HAS BEEN DEFEATED!`);
                
                wait(1.5, () => {
                  if (bossId === 'BossLaserPointer') {
                    go("bossDefeated", {
                      level: "laserPointerBoss",
                      score: startScore,
                      nextLevel: "Transition5",
                      character: character,
                      playerHP: player.hp,
                      lives: player.lives
                    });
                  } else if (bossId === 'BossCup') {
                    go("bossDefeated", {
                      level: "cupBoss",
                      score: startScore,
                      nextLevel: "Transition2",
                      character: character,
                      playerHP: player.hp,
                      lives: player.lives
                    });
                  } else if (bossId === 'BossCucumber') {
                    go("bossDefeated", {
                      level: "cucumberBoss",
                      score: startScore,
                      nextLevel: "Transition3",
                      character: character,
                      playerHP: player.hp,
                      lives: player.lives
                    });
                  } else if (bossId === 'BossRatKing') {
                    go("bossDefeated", {
                      level: "ratKingBoss",
                      score: startScore,
                      nextLevel: "Transition4",
                      character: character,
                      playerHP: player.hp,
                      lives: player.lives
                    });
                  }
                });
              }
            });
          });
        };
      }
      
      return true;
    }  else if (currentPlayerHP <= 0) {
      console.log('ðŸ’€ PLAYER DEFEATED IN BOSS BATTLE!');
      battleActive = false;
      waitingForPlayer = false;
      updateLog(`${player.name} has been defeated...`);
      
      animateDefeat(playerSprite, true);
      wait(1, () => {
        const currentLives = character.lives !== undefined ? character.lives : (player.lives || 0);
        if (currentLives > 0) {
          console.log(`ðŸ’š Player has ${currentLives} lives remaining - going to You Died screen`);
          
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
          lives: currentLives,  
          character: character,
          reason: `Defeated by ${boss.name}`
        });

        } else {
          console.log('â˜ ï¸ No lives remaining - GAME OVER');
          stopAllMusic();
          
          const bloodDrip = add([
            sprite('drip2', { anim: 'drip' }),
            pos(0, 0),
            scale(10, 10),
            z(1000),
            fixed(),
            opacity(1)
          ]);

          bloodDrip.play('drip');
          
          const bloodDrip2 = add([
            sprite('drip3', { anim: 'drip' }),
            pos(0, 0),
            scale(10, 10), 
            z(999),
            fixed(),
            opacity(1)
          ]);
          
          bloodDrip2.play('drip');
          
          wait(1, () => {
            tween(bloodDrip.opacity, 0, 1.0, (val) => bloodDrip.opacity = val, k.easings.easeOutQuad);
            destroy(bloodDrip);
          });
          
          wait(1.5, () => {
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
  
  
  onSceneLeave(() => {
      const battleUI = document.getElementById('battleUI');
      if (battleUI) {
        battleUI.classList.add('hidden');
        console.log('🧹 Battle UI hidden on scene leave');
      }

      const backgroundEl = document.getElementById('bossBackground');
      if (backgroundEl) {
        backgroundEl.classList.remove('visible');
        console.log('🧹 Boss background hidden on scene leave');
      }
    });
  
  // ==================== RESTORE CANVAS ON SCENE LEAVE ====================
  onSceneLeave(() => {
    canvas.style.maxWidth = originalCanvasStyles.maxWidth;
    canvas.style.maxHeight = originalCanvasStyles.maxHeight;
    canvas.style.aspectRatio = originalCanvasStyles.aspectRatio;
    canvas.style.margin = originalCanvasStyles.margin;
    console.log('🔄 Canvas restored to responsive mode');
  });
  // ===================================================================
}

export async function createLaserPointerBossScene(data) {
  const character = data?.character || data;
  const startHP = data?.startHP;
  const startScore = data?.score || 0;  
  createBossBattleScene('BossLaserPointer', character, startHP, startScore);
}

export async function createCupBossScene(data) {
  //await ensureMusicLoaded("bossMusic", "assets/sounds/tracks/bossBattles.m4a");
  const character = data?.character || data;
  const startHP = data?.startHP;
  const startScore = data?.score || 0;
  createBossBattleScene('BossCup', character, startHP, startScore);
}

export async function createCucumberBossScene(data) {
  //await ensureMusicLoaded("bossMusic", "assets/sounds/tracks/bossBattles.m4a");
  const character = data?.character || data;
  const startHP = data?.startHP;
  const startScore = data?.score || 0;
  createBossBattleScene('BossCucumber', character, startHP, startScore);
}

export async function createRatKingBossScene(data) {
  //await ensureMusicLoaded("bossMusic", "assets/sounds/tracks/bossBattles.m4a");
  const character = data?.character || data;
  const startHP = data?.startHP;
  const startScore = data?.score || 0;
  createBossBattleScene('BossRatKing', character, startHP, startScore);
}

export async function createObserverBossScene(data) {
  //await ensureMusicLoaded("finalBossMusic", "assets/sounds/tracks/finalBoss.m4a");
  const character = data?.character || data;
  const startHP = data?.startHP;
  const startScore = data?.score || 0;
  createBossBattleScene('observerBoss', character, startHP, startScore);
}