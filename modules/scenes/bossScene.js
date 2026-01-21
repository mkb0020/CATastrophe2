// bossScene.js
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { getBoss, initializeBoss, chooseBossMove } from '../config/bosses.js';
import { calculateDamage } from '../systems/battleSystem.js';
import { stopAllMusic, startBossMusic, startFinalBossMusic } from '../helpers/kittyHelpers.js';
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
  setupBossMusic,
  animateGreenBoom,
  animateBurn,
  animateFlash
} from '../helpers/bossHelpers.js';
import { applyUpgradesToBossPlayer } from '../helpers/upgradeHelper.js';


export function createBossBattleScene(bossId, character, startHP, startScore = 0) {
    console.log('🎮 Boss Battle Starting:', {
      bossId,
      character: character.name,
      startHP,
      startScore
    });

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

      case "WHISKER WHIP":
        animateWhiskerWhip(attackerSprite, targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
      
      // LASER POINTER BOSS MOVES

      case "PHOTON FLASH":
        animateFlash();
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;

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
        animatePoooof(targetSprite);
        animateBurn(targetSprite);
        animateAttack(attackerSprite, attackerGlow, isPlayer);
        wait(0.2, () => animateHit(targetSprite, isPlayer ? bossGlow : playerGlow));
        break;
        
      case "REFILL":
        animatePowerup(attackerSprite);
        animateHeal(attackerSprite, attackerGlow);
        break;
      
      // BOSS CUCUMBER MOVES
      case "CUCUMBER CRUNCH":
        animateGreenBoom(targetSprite);
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

      case "SCURRY":
          animatePowerup(attackerSprite);
          animateHeal(attackerSprite, attackerGlow);
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

      case "QUANTUM RECOVER":
        animatePowerup(attackerSprite);
        animateHeal(attackerSprite, attackerGlow);
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
    
    if (bossHP <= 0) {
      console.log('🎉 BOSS DEFEATED! TIME FOR FINISH HIM!');
      battleActive = false;
      waitingForPlayer = false;
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
      }
      
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

        if (cycleTime < 1.33) {
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
      
      if (finishHimBtn) {
        finishHimBtn.onclick = () => {
          console.log('💥 SPECIAL ATTACK INITIATED!');
          
          finishHimButton.classList.add('hidden');
          
          tween(1, 0, 0.3, (o) => {
            finishText.opacity = o;
            finishTextShadow.opacity = o;
            finishTextShadow2.opacity = o;
          }).then(() => {
            destroy(finishText);
            destroy(finishTextShadow);
            destroy(finishTextShadow2);
          });
          
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
                animateDefeat(bossSprite, bossGlow, false);
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
      console.log('💀 PLAYER DEFEATED IN BOSS BATTLE!');
      battleActive = false;
      waitingForPlayer = false;
      updateLog(`${player.name} has been defeated...`);
      
      animateDefeat(playerSprite, playerGlow, true);
      wait(1, () => {
        const currentLives = character.lives !== undefined ? character.lives : (player.lives || 0);
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
          lives: currentLives,  
          character: character,
          reason: `Defeated by ${boss.name}`
        });

        } else {
          console.log('☠️ No lives remaining - GAME OVER');
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
}

export function createLaserPointerBossScene(data) {
  const character = data?.character || data;
  const startHP = data?.startHP;
  const startScore = data?.score || 0;  
  createBossBattleScene('BossLaserPointer', character, startHP, startScore);
}

export function createCupBossScene(data) {
  const character = data?.character || data;
  const startHP = data?.startHP;
  const startScore = data?.score || 0;
  createBossBattleScene('BossCup', character, startHP, startScore);
}

export function createCucumberBossScene(data) {
  const character = data?.character || data;
  const startHP = data?.startHP;
  const startScore = data?.score || 0;
  createBossBattleScene('BossCucumber', character, startHP, startScore);
}

export function createRatKingBossScene(data) {
  const character = data?.character || data;
  const startHP = data?.startHP;
  const startScore = data?.score || 0;
  createBossBattleScene('BossRatKing', character, startHP, startScore);
}

export function createObserverBossScene(data) {
  const character = data?.character || data;
  const startHP = data?.startHP;
  const startScore = data?.score || 0;
  createBossBattleScene('observerBoss', character, startHP, startScore);
}