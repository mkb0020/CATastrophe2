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
  
  applyMoveUpgradesToPlayer(player);


  return player;
}



// ========================= MOVE SELECTION MODAL =========================

export function openMoveSelectionModal(character, onComplete) {
  console.log('🎯 Opening new move selection modal');
  console.log(`📊 Current fragments: ${upgradeState.newMoveFragments}/3`);
  
  const fragmentsAfterCollection = upgradeState.newMoveFragments + 1;
  
  if (fragmentsAfterCollection >= 3) {
    // 🌈 TRANSFORMATION ANIMATION SEQUENCE! 🌈
    
    get("music").forEach(m => m.paused = true);
    
    const transformSound = play("transformation", { volume: 0.6 }); // PLACEHOLDER
    
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
    
    shake(15);
    tween(transformationBg.opacity, 1, 0.3, (val) => transformationBg.opacity = val);
    transformationBg.play("fade", { loop: true, speed: 5 });
    tween(transformationBubbles.opacity, 0.8, 0.3, (val) => transformationBubbles.opacity = val);
    transformationBubbles.play("fade", { loop: true, speed: 7 });
    tween(transformationAnimation.opacity, 1, 0.3, (val) => transformationAnimation.opacity = val);
    transformationAnimation.play("fade", { loop: false, speed: 9 });
    
    wait(1.0, () => shake(20));
    wait(3.0, () => shake(25));
    
    wait(7, () => {
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
          createMoveSwapUI(character, onComplete);
          
          tween(whiteFlash.opacity, 0, 0.4, (val) => whiteFlash.opacity = val, easings.easeOutQuad)
            .then(() => destroy(whiteFlash));
        });
      });
    });
    
  } else {
    // LESS THAN 3 FRAGMENTS
    createFragmentCollectionUI(fragmentsAfterCollection, onComplete);
  }
}

// HELPER FUNCTION: MOVE SWAP PANEL
function createMoveSwapUI(character, onComplete) {
  const overlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.7),
    z(500),
    fixed()
  ]);
  
  const panel = add([
    rect(800, 420, { radius: 20 }),
    pos(SCREEN_W / 2, SCREEN_H / 2),
    anchor("center"),
    color(17, 12, 30),
    outline(4, rgb(144, 144, 192)),
    z(501),
    fixed()
  ]);
  

    add([
      text("NEW MOVE UNLOCKED!", { size: 44, font: "science" }),
      pos(SCREEN_W / 2, SCREEN_H / 2 - 150),
      anchor("center"),
      color(103, 254, 189),
      z(502),
      fixed(),
      "modalElement"
    ]);
    
    add([
      text("WHISKER WHIP", { size: 36, font: "science" }),
      pos(SCREEN_W / 2, SCREEN_H / 2 - 100),
      anchor("center"),
      color(255, 107, 255),
      z(502),
      fixed(),
      "modalElement"
    ]);
    
    add([
      text( "(DMG: 40, Uses: 2)", { 
        size: 22, 
        font: "science",
        width: 600,
        align: "center"
      }),
      pos(SCREEN_W / 2, SCREEN_H / 2 - 70),
      anchor("center"),
      color(176, 180, 255),
      z(502),
      fixed(),
      "modalElement"
    ]);
    
    add([
      text("Choose a move to replace:", { size: 25, font: "science" }),
      pos(SCREEN_W / 2, SCREEN_H / 2 - 30),
      anchor("center"),
      color(219, 226, 233),
      z(502),
      fixed(),
      "modalElement"
    ]);
    
    // CREATE BUTTONS FOR EACH CURRENT MOVE
    const moveNames = Object.keys(character.moves);
    const buttonY = SCREEN_H / 2 + 20;
    let selectedMove = null;
    const moveButtons = [];
    
    moveNames.forEach((moveName, i) => {
      const move = character.moves[moveName];
      const xPos = (SCREEN_W / 2 - 200) + (i * 170);
      
      const btn = add([
        rect(160, 70, { radius: 10 }),
        pos(xPos, buttonY),
        anchor("center"),
        color(101, 115, 131),
        outline(3, rgb(144, 144, 192)),
        area(),
        z(502),
        fixed(),
        { moveName: moveName, selected: false },
        "moveSwapBtn"
      ]);
      
      const btnText = add([
        text(moveName, { 
          size: 18, 
          font: "science",
          align: "center"
        }),
        pos(xPos, buttonY - 10),
        anchor("center"),
        color(255, 255, 255),
        z(503),
        fixed(),
        "modalElement"
      ]);
      
      const statsText = add([
        text(move.dmg ? `DMG: ${move.dmg}` : `HEAL: ${move.heal}`, { 
          size: 16, 
          font: "science"
        }),
        pos(xPos, buttonY + 10),
        anchor("center"),
        color(176, 180, 255),
        z(503),
        fixed(),
        "modalElement"
      ]);
      
      btn.onClick(() => {
        moveButtons.forEach(b => {
          b.btn.selected = false;
          b.btn.color = rgb(101, 115, 131);
        });
        
        btn.selected = true;
        btn.color = rgb(255, 107, 255);
        selectedMove = moveName;
        
        confirmBtn.opacity = 1;
        
        play("collectCup", { volume: 0.2 }); // PLACEHOLDER - CHANGE THIS
      });
      
      btn.onHover(() => {
        if (!btn.selected) btn.color = rgb(144, 144, 192);
      });
      
      btn.onHoverEnd(() => {
        if (!btn.selected) btn.color = rgb(101, 115, 131);
      });
      
      moveButtons.push({ btn, btnText, statsText });
    });
    
    const confirmBtn = add([
      rect(200, 50, { radius: 10 }),
      pos(SCREEN_W / 2, SCREEN_H / 2 + 120),
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
      pos(SCREEN_W / 2, SCREEN_H / 2 + 120),
      anchor("center"),
      color(255, 255, 255),
      z(503),
      fixed(),
      "modalElement"
    ]);
    
    confirmBtn.onHover(() => {
      if (selectedMove) confirmBtn.color = rgb(144, 144, 192);
    });
    
    confirmBtn.onHoverEnd(() => {
      confirmBtn.color = rgb(17, 12, 30);
    });
    
    confirmBtn.onClick(() => {
      if (selectedMove) {
        // APPLY THE MOVE SWAP
        upgradeState.moves.push('WHISKER WHIP');
        upgradeState.replacedMove = selectedMove; // TRACK WHAT WAS REPLACED
        upgradeState.newMoveFragments = fragmentsAfterCollection;
        
        console.log(`✅ Replaced ${selectedMove} with WHISKER WHIP`);
        play("powerUp", { volume: 0.4 });
        
        // CLEANUP
        destroy(overlay);
        destroy(panel);
        get("modalElement").forEach(el => destroy(el));
        get("moveSwapBtn").forEach(btn => destroy(btn));
        destroy(confirmBtn);
        
        get("music").forEach(m => m.paused = false);
        if (onComplete) onComplete();
      }
    });
    
}

// HELPER FUNCTION: LESS THAN 3 FRAGMENTS
function createFragmentCollectionUI(fragmentsAfterCollection, onComplete) {
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
    
    upgradeState.newMoveFragments = fragmentsAfterCollection;
    
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




export function applyMoveUpgradesToPlayer(player) {
  const upgrades = getUpgrades();
  
  if (upgrades.moves.includes('WHISKER WHIP') && upgrades.replacedMove) {
    delete player.moves[upgrades.replacedMove];
    
    player.moves['WHISKER WHIP'] = { dmg: 40, uses: 2 };
    
    console.log(`🎯 Swapped ${upgrades.replacedMove} for WHISKER WHIP`);
  }
  
  return player;
}