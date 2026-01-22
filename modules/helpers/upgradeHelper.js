// upgradeHelper.js - Updated to use HTML/CSS modals
import { SCREEN_W, SCREEN_H } from '../config/gameConfig.js';
import { startChallenegeMusic, stopAllMusic } from '../helpers/kittyHelpers.js';

// ==================== UPGRADE STATE MANAGEMENT ====================
let upgradeState = {
  stats: {
    attack: 0,
    defense: 0,
    speed: 0
  },
  moves: [], 
  completedRooms: [], 
  newMoveFragments: 0, 
  statsPoints: 0 
};

export function getUpgrades() {
  return { ...upgradeState };
}

export function setUpgrades(newState) {
  upgradeState = { ...upgradeState, ...newState };
  console.log('📊 Upgrades updated:', upgradeState);
}

export function isRoomCompleted(roomId) {
  return upgradeState.completedRooms.includes(roomId);
}

export function markRoomCompleted(roomId) {
  if (!upgradeState.completedRooms.includes(roomId)) {
    upgradeState.completedRooms.push(roomId);
    console.log(`✅ Room ${roomId} marked as completed`);
  }
}

export function resetUpgrades() {
  upgradeState = {
    stats: { attack: 0, defense: 0, speed: 0 },
    moves: [],
    completedRooms: [],
    newMoveFragments: 0,
    statsPoints: 0
  };
  console.log('🔄 Upgrades reset');
}

// ==================== STAT UPGRADE MODAL (HTML VERSION) ====================
export function openStatUpgradeModal(statPoints, character, onComplete) {
  console.log(`📈 Opening stat upgrade modal with ${statPoints} points`);
  console.log('Current upgrade state:', upgradeState);
  console.log('Character:', character);
  
  if (!window.openStatsUpgradeModal) {
    console.error('❌ HTML modal controller not found! Falling back to Kaboom UI...');
    openStatUpgradeModalKaboom(statPoints, onComplete);
    return;
  }
  
  
  const currentStats = {
    attack: character.stats.baseAtk + (upgradeState.stats.attack * 1),
    defense: character.stats.baseDefense + (upgradeState.stats.defense * 1),
    speed: character.stats.baseSpeed + (upgradeState.stats.speed * 1)
  };
  
  console.log('📊 Current stats being displayed:', currentStats);
  
  window.openStatsUpgradeModal(statPoints, currentStats, (tempStats) => {
    applyStatUpgrade('attack', tempStats.attack);
    applyStatUpgrade('defense', tempStats.defense);
    applyStatUpgrade('speed', tempStats.speed);
    
    
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.focus();
      console.log('✅ Canvas refocused');
    }
    
    if (onComplete) onComplete();
  });
}

// ==================== MOVE SELECTION MODAL (HTML VERSION) ====================
export function openMoveSelectionModal(character, onComplete) {
  console.log('🎯 Opening new move selection modal');
  console.log(`📊 Current fragments: ${upgradeState.newMoveFragments}/3`);
  
  const fragmentsAfterCollection = upgradeState.newMoveFragments + 1;
  
  if (fragmentsAfterCollection >= 3) {
    // 🌈 TRANSFORMATION ANIMATION SEQUENCE! 🌈
    playTransformationAnimation(() => {
      showMoveSwapUI(character, fragmentsAfterCollection, onComplete);
    });
  } else {
    showFragmentCollectionUI(fragmentsAfterCollection, onComplete);
  }
}

// ==================== TRANSFORMATION ANIMATION ====================
function playTransformationAnimation(onComplete) {
  stopAllMusic();
  if (window.challengeRoom) {
    window.challengeRoom.stop();
    window.challengeRoom = null;
  }
  
  const transformationBg = add([
    sprite("transformRainbow", { anim: "fade" }),
    pos(SCREEN_W / 2, SCREEN_H / 2),
    scale(20),
    anchor("center"),
    z(1000),
    fixed(),
    opacity(0)
  ]);

  const transformationBubbles = add([
    sprite("transformBubbles", { anim: "fade" }),
    pos(SCREEN_W / 2, SCREEN_H / 2),
    scale(20),
    anchor("center"),
    z(1001),
    fixed(),
    opacity(0)
  ]);

  const transformationAnimation = add([
    sprite("newMove", { anim: "fade" }),
    pos(SCREEN_W / 2, SCREEN_H / 2),
    scale(10),
    anchor("center"),
    z(1002),
    fixed(),
    opacity(0)
  ]);
  
  shake(50);
  tween(transformationBg.opacity, 1, 0.3, (val) => transformationBg.opacity = val);
  transformationBg.play("fade", { loop: true, speed: 15 });
  
  wait(0.2, () => play("newMove", { volume: 0.9 }));
  
  wait(0.3, () => {
    tween(transformationBubbles.opacity, 0.3, 0.3, (val) => transformationBubbles.opacity = val);
    transformationBubbles.play("fade", { loop: true, speed: 8 });
  });
  
  wait(0.5, () => {
    tween(transformationAnimation.opacity, 1, 0.3, (val) => transformationAnimation.opacity = val);
    transformationAnimation.play("fade", { loop: false, speed: 10 });
  });
  
  wait(1.0, () => shake(50));
  wait(3.0, () => shake(50));
  wait(5.0, () => shake(50));
  wait(7.0, () => shake(90));
  
  wait(7.5, () => {
    const whiteFlash = add([
      rect(SCREEN_W, SCREEN_H),
      pos(0, 0),
      color(255, 255, 255),
      opacity(0),
      z(1001),
      fixed()
    ]);
    
    tween(whiteFlash.opacity, 1, 0.2, (val) => whiteFlash.opacity = val, easings.easeInQuad);
    
    wait(0.2, () => {
      destroy(transformationBg);
      destroy(transformationBubbles);
      destroy(transformationAnimation);
      
      wait(0.5, () => {
        tween(whiteFlash.opacity, 0, 0.5, (val) => whiteFlash.opacity = val, easings.easeOutQuad)
          .then(() => destroy(whiteFlash));
        
        wait(0.05, () => {
          startChallenegeMusic();
          if (onComplete) onComplete();
        });
      });
    });
  });
}

// ==================== MOVE SWAP UI (HTML VERSION) ====================
function showMoveSwapUI(character, fragmentsAfterCollection, onComplete) {
  if (!window.openMoveSelectionModal) {
    console.error('❌ HTML modal controller not found!');
    return;
  }
  
  
  const moveName = "WHISKER WHIP!";
  const moveStats = "(DMG: 40, Uses: 2)";
  const moveImage = "assets/images/items/whiskerWhip.PNG";
  
  window.openMoveSelectionModal(moveName, moveStats, moveImage, character.moves, (selectedMove) => {
    upgradeState.moves.push('WHISKER WHIP');
    upgradeState.replacedMove = selectedMove;
    upgradeState.newMoveFragments = fragmentsAfterCollection;
    
    console.log(`✅ Replaced ${selectedMove} with WHISKER WHIP`);
    
    
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.focus();
      console.log('✅ Canvas refocused');
    }
    
    if (onComplete) onComplete();
  });
}

// ==================== FRAGMENT COLLECTION UI (HTML VERSION) ====================
function showFragmentCollectionUI(fragmentsAfterCollection, onComplete) {
  if (!window.openFragmentCollectionModal) {
    console.error('❌ HTML modal controller not found!');
    return;
  }
  
  upgradeState.newMoveFragments = fragmentsAfterCollection;
  
  
  window.openFragmentCollectionModal(fragmentsAfterCollection, () => {
    
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.focus();
      console.log('✅ Canvas refocused');
    }
    
    if (onComplete) onComplete();
  });
}

// ==================== FALLBACK: KABOOM UI STAT UPGRADE ====================
function openStatUpgradeModalKaboom(statPoints, onComplete) {
  console.log('⚠️ Using Kaboom fallback UI for stats upgrade');
  
  const overlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0),
    z(500),
    fixed()
  ]);
  
  tween(overlay.opacity, 0.7, 0.3, (val) => overlay.opacity = val);
  
  const panel = add([
    rect(700, 400, { radius: 20 }),
    pos(SCREEN_W / 2, SCREEN_H / 2),
    anchor("center"),
    color(17, 12, 30),
    outline(4, rgb(0, 255, 255)),
    z(501),
    fixed()
  ]);
  
  add([
    text("THAT WAS SUPURRRRR!!", { size: 40, font: "science" }),
    pos(SCREEN_W / 2, SCREEN_H / 2 - 150),
    anchor("center"),
    color(103, 254, 189),
    z(502),
    fixed(),
    "modalElement"
  ]);
  
  add([
    text(`You can meow select a stat to increase by ${statPoints} point${statPoints > 1 ? 's' : ''}`, { size: 20, font: "science" }),
    pos(SCREEN_W / 2, SCREEN_H / 2 - 100),
    anchor("center"),
    color(219, 226, 233),
    z(502),
    fixed(),
    "modalElement"
  ]);
  
  let remainingPoints = statPoints;
  let tempStats = { attack: 0, defense: 0, speed: 0 };
  
  const attackBtn = add([
    rect(180, 65, { radius: 20 }),
    pos(SCREEN_W / 2 - 200, SCREEN_H / 2 - 20),
    anchor("center"),
    color(42, 52, 57),
    outline(2, rgb(144, 144, 192)),
    area(),
    z(502),
    fixed(),
    "statBtn"
  ]);
  
  const attackText = add([
    text(`ATTACK\n+${tempStats.attack}`, { size: 24, font: "science", align: "center" }),
    pos(SCREEN_W / 2 - 200, SCREEN_H / 2 - 17),
    anchor("center"),
    color(255, 255, 255),
    z(503),
    fixed(),
    "modalElement"
  ]);
  
  const defenseBtn = add([
    rect(180, 65, { radius: 20 }),
    pos(SCREEN_W / 2, SCREEN_H / 2 - 20),
    anchor("center"),
    color(42, 52, 57),
    outline(2, rgb(144, 144, 192)),
    area(),
    z(502),
    fixed(),
    "statBtn"
  ]);
  
  const defenseText = add([
    text(`DEFENSE\n+${tempStats.defense}`, { size: 24, font: "science", align: "center" }),
    pos(SCREEN_W / 2, SCREEN_H / 2 - 17),
    anchor("center"),
    color(255, 255, 255),
    z(503),
    fixed(),
    "modalElement"
  ]);
  
  const speedBtn = add([
    rect(180, 65, { radius: 20 }),
    pos(SCREEN_W / 2 + 200, SCREEN_H / 2 - 20),
    anchor("center"),
    color(42, 52, 57),
    outline(2, rgb(144, 144, 192)),
    area(),
    z(502),
    fixed(),
    "statBtn"
  ]);
  
  const speedText = add([
    text(`SPEED\n+${tempStats.speed}`, { size: 24, font: "science", align: "center" }),
    pos(SCREEN_W / 2 + 200, SCREEN_H / 2 - 17),
    anchor("center"),
    color(255, 255, 255),
    z(503),
    fixed(),
    "modalElement"
  ]);
  
  const pointsText = add([
    text(`Points Remaining: ${remainingPoints}`, { size: 22, font: "science" }),
    pos(SCREEN_W / 2, SCREEN_H / 2 + 60),
    anchor("center"),
    color(219, 226, 233),
    z(502),
    fixed(),
    "modalElement"
  ]);
  
  const confirmBtn = add([
    rect(200, 50, { radius: 10 }),
    pos(SCREEN_W / 2, SCREEN_H / 2 + 130),
    anchor("center"),
    color(17, 12, 30),
    outline(3, rgb(88, 232, 76)),
    area(),
    z(502),
    fixed(),
    opacity(0.5),
    "confirmBtn"
  ]);
  
  const confirmText = add([
    text("CONFIRM", { size: 26, font: "science" }),
    pos(SCREEN_W / 2, SCREEN_H / 2 + 130),
    anchor("center"),
    color(255, 255, 255),
    z(503),
    fixed(),
    "modalElement"
  ]);
  
  attackBtn.onClick(() => {
    if (remainingPoints > 0) {
      tempStats.attack++;
      remainingPoints--;
      attackText.text = `ATTACK\n+${tempStats.attack}`;
      pointsText.text = `Points Remaining: ${remainingPoints}`;
      play("happyMeow", { volume: 0.2 });
      
      if (remainingPoints === 0) {
        confirmBtn.opacity = 1;
      }
    }
  });
  
  defenseBtn.onClick(() => {
    if (remainingPoints > 0) {
      tempStats.defense++;
      remainingPoints--;
      defenseText.text = `DEFENSE\n+${tempStats.defense}`;
      pointsText.text = `Points Remaining: ${remainingPoints}`;
      play("happyMeow", { volume: 0.2 });
      
      if (remainingPoints === 0) {
        confirmBtn.opacity = 1;
      }
    }
  });
  
  speedBtn.onClick(() => {
    if (remainingPoints > 0) {
      tempStats.speed++;
      remainingPoints--;
      speedText.text = `SPEED\n+${tempStats.speed}`;
      pointsText.text = `Points Remaining: ${remainingPoints}`;
      play("happyMeow", { volume: 0.2 });
      
      if (remainingPoints === 0) {
        confirmBtn.opacity = 1;
      }
    }
  });
  
  confirmBtn.onClick(() => {
    if (remainingPoints === 0) {
      applyStatUpgrade('attack', tempStats.attack);
      applyStatUpgrade('defense', tempStats.defense);
      applyStatUpgrade('speed', tempStats.speed);
      
      play("powerUp", { volume: 0.4 });
      
      destroy(overlay);
      destroy(panel);
      get("modalElement").forEach(el => destroy(el));
      get("statBtn").forEach(btn => destroy(btn));
      destroy(confirmBtn);
      
      if (onComplete) onComplete();
    }
  });
}

// ==================== APPLY STAT UPGRADES ====================
export function applyStatUpgrade(stat, points) {
  if (upgradeState.stats[stat] !== undefined) {
    upgradeState.stats[stat] += points;
    console.log(`📈 ${stat.toUpperCase()} increased by ${points}! Total: ${upgradeState.stats[stat]}`);
  }
}

// ==================== APPLY UPGRADES TO PLAYER ====================
export function applyUpgradesToPlayer(player) {
  const upgrades = getUpgrades();
  
  if (upgrades.stats.attack > 0) {
    player.attackBonus = upgrades.stats.attack * 5; 
    console.log(`⚔️ Attack bonus applied: +${player.attackBonus}`);
  }
  
  if (upgrades.stats.defense > 0) {
    player.defenseBonus = upgrades.stats.defense * 5; 
    console.log(`🛡️ Defense bonus applied: +${player.defenseBonus}`);
  }
  
  if (upgrades.stats.speed > 0) {
    const speedMultiplier = 1 + (upgrades.stats.speed * 0.1); 
    player.speed = player.baseSpeed * speedMultiplier;
    console.log(`⚡ Speed bonus applied: x${speedMultiplier.toFixed(1)}`);
  }
  
  applyMoveUpgradesToPlayer(player);

  return player;
}

export function applyUpgradesToBossPlayer(player) {
  const upgrades = getUpgrades();
  
  if (upgrades.stats.attack > 0) {
    player.atk += upgrades.stats.attack * 5;
    console.log(`⚔️ Boss battle attack bonus: +${upgrades.stats.attack * 5}`);
  }
  
  if (upgrades.stats.defense > 0) {
    player.defense += upgrades.stats.defense * 5;
    console.log(`🛡️ Boss battle defense bonus: +${upgrades.stats.defense * 5}`);
  }
  
  if (upgrades.stats.speed > 0) {
    player.speed += upgrades.stats.speed * 10;
    console.log(`⚡ Boss battle speed bonus: +${upgrades.stats.speed * 10}`);
  }
  
  if (upgrades.moves.includes('WHISKER WHIP') && upgrades.replacedMove) {
    delete player.moves[upgrades.replacedMove];
    player.moves['WHISKER WHIP'] = { dmg: 40, uses: 2 };
    console.log(`🎯 Boss battle: Swapped ${upgrades.replacedMove} for WHISKER WHIP`);
  }
  
  return player;
}

export function applyMoveUpgradesToPlayer(player) {
  const upgrades = getUpgrades();
  
  if (!player || !player.moves) {
    console.warn('⚠️ Player or player.moves is undefined, skipping move upgrades');
    return player;
  }
  
  if (upgrades.moves.includes('WHISKER WHIP') && upgrades.replacedMove) {
    delete player.moves[upgrades.replacedMove];
    player.moves['WHISKER WHIP'] = { dmg: 40, uses: 2 };
    console.log(`🎯 Swapped ${upgrades.replacedMove} for WHISKER WHIP`);
  }
  
  return player;
}