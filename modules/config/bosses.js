// bosses.js
export const BOSSES = {
  BossCup: { 
    name: "LARGE HADRON CUP (LHC)",  
    maxHP: 120,
    atk: 29,
    speed: 29,
    defense: 29,
    sprite: 'bossCup',
    //glowSprite: 'CupGlow',
    background: 'battleBG1', 
    introMessage: ["A LARGE HADRON CUP WANTS TO FIGHT! CLICK ON A MOVE TO BEGIN."],
    nextState: 'Transition2',
    moves: {
      "STEAM BURN": { dmg: 24, uses: 99 },
      "ESPRESSO EMBER": { dmg: 26, speedBoost: true, uses: 3 },
      "REFILL": { heal: 25, uses: 2 }
    },
    finishHim: 'CatCrossbow',
  },

  BossCucumber: { 
    name: "UNSTABLE CUCUMBER", 
    maxHP: 125,
    atk: 30,
    speed: 29,
    defense: 35,
    sprite: 'bossCucumber',
    //glowSprite: 'CucumberGlow',
    background: 'battleBG1',
    introMessage: ["AN UNSTABLE CUCUMBER WANTS TO FIGHT! IT'S GETTING WEIRD IN HERE."],
    nextState: 'Transition3',
    moves: {
      "CUCUMBER CRUNCH": { dmg: 28, uses: 99 },
      "CUCUMBER CANNON": { dmg: 29, uses: 3 },
      "GOURD GUARD": { defenseBoost: true, duration: 2, uses: 1 },
      "PICKLE": { heal: 30, uses: 2 }
    },
    finishHim: 'BrassToeBeans',
  },

  BossRatKing: { 
    name: "RADIOACTIVE RAT KING", 
    maxHP: 120,
    atk: 31,
    speed: 26,
    defense: 26,
    sprite: 'bossRat',
    //glowSprite: 'RatGlow',
    background: 'battleBG1', 
    introMessage: ["THE RADIOACTIVE RAT KING WANTS TO FIGHT! CLICK ON A MOVE TO BEGIN."],
    nextState: 'Transition4',
    moves: {
      "BITE": { dmg: 25, uses: 99 }, 
      "RODENT RAGE": { dmg: 25, speedBoost: true, uses: 3 },
      "MOUSE MISSILES": { dmg: 26, uses: 3 }, 
      "SCURRY": { heal: 26, uses: 1 }
    },
    finishHim: 'PURRcisionRifle',
  },

  BossLaserPointer: { 
    name: "GAMMA LASER POINTER", 
    maxHP: 125,
    atk: 29,
    speed: 31, 
    defense: 32,
    sprite: 'bossLaserPointer',
    //glowSprite: 'laserPointerGlow',
    background: 'battleBG1', 
    introMessage: ["FINALLY CAUGHT THE GAMMA LASER POINTER!! TIME TO FINISH HIM OFF!"],
    nextState: 'Transition5',
    moves: {
      "ZAP": { dmg: 24, speedBoost: true, uses: 99 }, 
      "FLASH": { dmg: 23, speedBoost: true, uses: 4 },
      "LASER BEAM": { dmg: 26, uses: 3 }
    },
    finishHim: 'MeowlotovCocktail',
  },

  observerBoss: { 
    name: "OBSERVER", 
    maxHP: 130,
    atk: 33,
    speed: 31,
    defense: 31, 
    sprite: 'observer',
    //glowSprite: 'ObserverGlow',
    background: 'battleBG1',
    introMessage: ["THE OBSERVER WANTS TO OPEN THE BOX!"],    
    nextState: 'Transition7',
    moves: {
      "SUPERPOSITION SLAM": { dmg: 25, uses: 99 },
      "POISON": { dmg: 26, speedBoost: true, uses: 4 },
      "HYDROGEN HAMMER": { dmg: 27, uses: 3 }, 
      "QUANTUM RECOVER": { heal: 26, uses: 3 }
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