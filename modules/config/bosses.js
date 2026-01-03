// bosses.js - UPDATED BOSS NAMES AND ORDER
export const BOSSES = {
  BossCup: { // BOSS 1
    name: "LARGE HADRON CUP (LHC)",  
    maxHP: 85,
    atk: 12,
    speed: 15,
    defense: 22,
    sprite: 'bossCup',
    glowSprite: 'CupGlow',
    background: 'battleBG1', 
    introMessage: ["A LARGE HADRON CUP WANTS TO FIGHT! CLICK ON A MOVE TO BEGIN."],
    nextState: 'Transition2',
    moves: {
      "STEAM BURN": { dmg: 18, uses: 99 },
      "REFILL": { heal: 25, uses: 3 },
      "ESPRESSO EMBER": { dmg: 22, speedBoost: true, uses: 3 }
    },
    finishHim: 'CatCrossbow',
  },

  BossCucumber: { // BOSS 2 
    name: "UNSTABLE CUCUMBER", 
    maxHP: 110,
    atk: 16,
    speed: 18,
    defense: 26,
    sprite: 'bossCucumber',
    glowSprite: 'CucumberGlow',
    background: 'battleBG1',
    introMessage: ["AN UNSTABLE CUCUMBER WANTS TO FIGHT! IT'S GETTING WEIRD IN HERE."],
    nextState: 'Transition3',
    moves: {
      "CUCUMBER CRUNCH": { dmg: 20, uses: 99 },
      "PICKLE": { heal: 30, uses: 3 },
      "GOURD GUARD": { defenseBoost: true, duration: 2, uses: 2 }, 
      "CUCUMBER CANNON": { dmg: 28, uses: 3 }
    },
    finishHim: 'BrassToeBeans',
  },

  BossRatKing: { // BOSS 3 -BIG ATTACKS
    name: "RADIOACTIVE RAT KING", 
    maxHP: 135,
    atk: 25,
    speed: 22,
    defense: 28,
    sprite: 'bossRat',
    glowSprite: 'RatGlow',
    background: 'battleBG1', 
    introMessage: ["THE RADIOACTIVE RAT KING WANTS TO FIGHT! CLICK ON A MOVE TO BEGIN."],
    nextState: 'Transition4',
    moves: {
      "BITE": { dmg: 22, uses: 99 }, 
      "RODENT RAGE": { dmg: 25, speedBoost: true, uses: 5 },
      "MOUSE MISSILES": { dmg: 30, uses: 3 }, 
    },
    finishHim: 'PURRcisionRifle',
  },

  BossLaserPointer: { // BOSS 4 - FAST
    name: "GAMMA LASER POINTER", 
    maxHP: 100,
    atk: 18,
    speed: 30, 
    defense: 24,
    sprite: 'bossLaserPointer',
    glowSprite: 'laserPointerGlow',
    background: 'battleBG1', 
    introMessage: ["FINALLY CAUGHT THE GAMMA LASER POINTER!! TIME TO FINISH HIM OFF!"],
    nextState: 'Transition5',
    moves: {
      "ZAP": { dmg: 20, speedBoost: true, uses: 99 }, 
      "LASER BEAM": { dmg: 32, uses: 4 },
    },
    finishHim: 'MeowlotovCocktail',
  },

  observerBoss: { // BOSS 5 - FINAL BOSS, TANKIEST
    name: "OBSERVER", 
    maxHP: 160,
    atk: 24,
    speed: 20,
    defense: 35, 
    sprite: 'observer',
    glowSprite: 'ObserverGlow',
    background: 'battleBG1',
    introMessage: ["THE OBSERVER WANTS TO OPEN THE BOX!"],    
    nextState: 'Transition7',
    moves: {
      "POISON": { dmg: 24, uses: 99 },
      "HYDROGEN HAMMER": { dmg: 35, uses: 5 }, 
      "SUPERPOSITION SLAM": { dmg: 28, speedBoost: true, uses: 4 }
    },
    finishHim: 'FelineFission',
  }
};


export function getBoss(bossId) {
  return BOSSES[bossId];
}

export function initializeBoss(bossId) {
  const config = BOSSES[bossId];
  return {
    name: config.name,
    maxHP: config.maxHP,
    hp: config.maxHP,
    atk: config.atk,
    speed: config.speed,
    defense: config.defense,
    sprite: config.sprite,
    moves: JSON.parse(JSON.stringify(config.moves)), 
    speedBuffTurns: 0,
    defenseBuffTurns: 0
  };
}

export function chooseBossMove(enemy, battleSystem) {
  const availableMoves = [];
  
  for (const [name, move] of Object.entries(enemy.moves)) {
    if (move.uses > 0) {
      availableMoves.push(name);
    }
  }
  
  if (availableMoves.length === 0) {
    return Object.keys(enemy.moves)[0]; 
  }
  
  const hpPercent = enemy.hp / enemy.maxHP;
  
  if (hpPercent < 0.3) {
    const healMoves = availableMoves.filter(name => enemy.moves[name].heal);
    if (healMoves.length > 0) {
      return healMoves[0];
    }
  }
  
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}