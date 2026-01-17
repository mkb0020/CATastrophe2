// upgradeHelper.js
import { SCREEN_W, SCREEN_H } from '../config/gameConfig.js';

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

// ==================== STAT UPGRADE MODAL ====================
export function openStatUpgradeModal(statPoints, onComplete) {
  console.log(`📈 Opening stat upgrade modal with ${statPoints} points`);
  
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
    rect(600, 400, { radius: 20 }),
    pos(SCREEN_W / 2, SCREEN_H / 2),
    anchor("center"),
    color(17, 12, 30),
    outline(4, rgb(144, 144, 192)),
    z(501),
    fixed()
  ]);
  
  add([
    text("STAT UPGRADE!", { size: 40, font: "science" }),
    pos(SCREEN_W / 2, SCREEN_H / 2 - 150),
    anchor("center"),
    color(88, 232, 76),
    z(502),
    fixed(),
    "modalElement"
  ]);
  
  add([
    text(`Choose where to allocate ${statPoints} stat point${statPoints > 1 ? 's' : ''}`, { size: 20, font: "science" }),
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
    rect(180, 60, { radius: 10 }),
    pos(SCREEN_W / 2 - 200, SCREEN_H / 2 - 20),
    anchor("center"),
    color(101, 115, 131),
    outline(3, rgb(255, 100, 100)),
    area(),
    z(502),
    fixed(),
    "statBtn"
  ]);
  
  const attackText = add([
    text(`ATTACK\n+${tempStats.attack}`, { size: 24, font: "science", align: "center" }),
    pos(SCREEN_W / 2 - 200, SCREEN_H / 2 - 20),
    anchor("center"),
    color(255, 255, 255),
    z(503),
    fixed(),
    "modalElement"
  ]);
  
  const defenseBtn = add([
    rect(180, 60, { radius: 10 }),
    pos(SCREEN_W / 2, SCREEN_H / 2 - 20),
    anchor("center"),
    color(101, 115, 131),
    outline(3, rgb(100, 100, 255)),
    area(),
    z(502),
    fixed(),
    "statBtn"
  ]);
  
  const defenseText = add([
    text(`DEFENSE\n+${tempStats.defense}`, { size: 24, font: "science", align: "center" }),
    pos(SCREEN_W / 2, SCREEN_H / 2 - 20),
    anchor("center"),
    color(255, 255, 255),
    z(503),
    fixed(),
    "modalElement"
  ]);
  
  const speedBtn = add([
    rect(180, 60, { radius: 10 }),
    pos(SCREEN_W / 2 + 200, SCREEN_H / 2 - 20),
    anchor("center"),
    color(101, 115, 131),
    outline(3, rgb(255, 255, 100)),
    area(),
    z(502),
    fixed(),
    "statBtn"
  ]);
  
  const speedText = add([
    text(`SPEED\n+${tempStats.speed}`, { size: 24, font: "science", align: "center" }),
    pos(SCREEN_W / 2 + 200, SCREEN_H / 2 - 20),
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
    color(144, 144, 192),
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
      play("collectCup", { volume: 0.2 });
      
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
      play("collectCup", { volume: 0.2 });
      
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
      play("collectCup", { volume: 0.2 });
      
      if (remainingPoints === 0) {
        confirmBtn.opacity = 1;
      }
    }
  });
  
  attackBtn.onHover(() => {
    if (remainingPoints > 0) attackBtn.color = rgb(144, 144, 192);
  });
  
  attackBtn.onHoverEnd(() => {
    attackBtn.color = rgb(101, 115, 131);
  });
  
  defenseBtn.onHover(() => {
    if (remainingPoints > 0) defenseBtn.color = rgb(144, 144, 192);
  });
  
  defenseBtn.onHoverEnd(() => {
    defenseBtn.color = rgb(101, 115, 131);
  });
  
  speedBtn.onHover(() => {
    if (remainingPoints > 0) speedBtn.color = rgb(144, 144, 192);
  });
  
  speedBtn.onHoverEnd(() => {
    speedBtn.color = rgb(101, 115, 131);
  });
  
  confirmBtn.onHover(() => {
    if (remainingPoints === 0) confirmBtn.color = rgb(144, 144, 192);
  });
  
  confirmBtn.onHoverEnd(() => {
    confirmBtn.color = rgb(17, 12, 30);
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

// ==================== NEW MOVE MODAL ====================
export function openMoveSelectionModal(onComplete) {
  console.log('🎯 Opening new move selection modal');
  console.log(`📊 Current fragments: ${upgradeState.newMoveFragments}/3`);
  
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
    outline(4, rgb(144, 144, 192)),
    z(501),
    fixed()
  ]);
  
  const fragmentsAfterCollection = upgradeState.newMoveFragments + 1;
  
  if (fragmentsAfterCollection >= 3) {
    add([
      text("NEW MOVE UNLOCKED!", { size: 44, font: "science" }),
      pos(SCREEN_W / 2, SCREEN_H / 2 - 150),
      anchor("center"),
      color(255, 215, 0),
      z(502),
      fixed(),
      "modalElement"
    ]);
    
    add([
      text("You've collected all 3 fragments!", { size: 22, font: "science" }),
      pos(SCREEN_W / 2, SCREEN_H / 2 - 100),
      anchor("center"),
      color(219, 226, 233),
      z(502),
      fixed(),
      "modalElement"
    ]);
    
    add([
      text("MEGA POUNCE", { size: 36, font: "science" }),
      pos(SCREEN_W / 2, SCREEN_H / 2 - 30),
      anchor("center"),
      color(255, 107, 255),
      z(502),
      fixed(),
      "modalElement"
    ]);
    
    add([
      text("A devastating aerial attack that deals massive damage!", { 
        size: 18, 
        font: "science",
        width: 600,
        align: "center"
      }),
      pos(SCREEN_W / 2, SCREEN_H / 2 + 20),
      anchor("center"),
      color(176, 180, 255),
      z(502),
      fixed(),
      "modalElement"
    ]);
    
    upgradeState.moves.push('whiskerWhip');
    upgradeState.newMoveFragments = fragmentsAfterCollection;
    
  } else {
    add([
      text("PURRRRRfect!", { size: 50, font: "science" }),
      pos(SCREEN_W / 2, SCREEN_H / 2 - 90),
      anchor("center"),
      color(88, 232, 76),
      z(502),
      fixed(),
      "modalElement"
    ]);
    
    add([
      text(`${fragmentsAfterCollection}/3 fragments obtained`, { size: 28, font: "science" }),
      pos(SCREEN_W / 2, SCREEN_H / 2 - 30),
      anchor("center"),
      color(219, 226, 233),
      z(502),
      fixed(),
      "modalElement"
    ]);
    
    //add([
      //text("Collect all 3 to unlock a new move!", { size: 22, font: "science" }),
     // pos(SCREEN_W / 2, SCREEN_H / 2 + 10),
    //  anchor("center"),
     // color(144, 144, 192),
    //  z(502),
    //  fixed(),
    //  "modalElement"
    //]);
    
    upgradeState.newMoveFragments = fragmentsAfterCollection;
  }
  
  const continueBtn = add([
    rect(200, 50, { radius: 10 }),
    pos(SCREEN_W / 2, SCREEN_H / 2 + 100),
    anchor("center"),
    color(17, 12, 30),
    outline(3, rgb(88, 232, 76)),
    area(),
    z(502),
    fixed(),
    "continueBtn"
  ]);
  
  const continueText = add([
    text("CONTINUE", { size: 26, font: "science" }),
    pos(SCREEN_W / 2, SCREEN_H / 2 + 100),
    anchor("center"),
    color(255, 255, 255),
    z(503),
    fixed(),
    "modalElement"
  ]);
  
  continueBtn.onHover(() => {
    continueBtn.color = rgb(144, 144, 192);
  });
  
  continueBtn.onHoverEnd(() => {
    continueBtn.color = rgb(17, 12, 30);
  });
  
  continueBtn.onClick(() => {
    play("powerUp", { volume: 0.4 });
    
    destroy(overlay);
    destroy(panel);
    get("modalElement").forEach(el => destroy(el));
    destroy(continueBtn);
    
    if (onComplete) onComplete();
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
  
  if (upgrades.moves.includes('whiskerWhip')) { // PLACEHOLDER
    player.haswhiskerWhip = true;
    console.log('🎯 Mega Pounce unlocked!');
  }
  
  return player;
}