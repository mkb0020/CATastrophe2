// bosses.js - UPDATED BOSS NAMES AND ORDER
export const BOSSES = {
  BossCup: {
    name: "LARGE HADRON CUP (LHC)",  
    maxHP: 100,
    atk: 10,
    speed: 18,
    defense: 28,
    sprite: 'bossCup',
    glowSprite: 'CupGlow',
    background: 'battleBG1', 
    introMessage: ["A LARGE HADRON CUP WANTS TO FIGHT! CLICK ON A MOVE TO BEGIN."],
    nextState: 'Transition2',
    moves: {
      "STEAM BURN": { dmg: 20, uses: 99 },
      "REFILL": { heal: 30, uses: 3 },
      "ESPRESSO EMBER": { dmg: 25, speedBoost: true, uses: 3 }
    },
    finishHim: 'CatCrossbow',
  },

  BossCucumber: {
    name: "UNSTABLE CUCUMBER", 
    maxHP: 110,
    atk: 22,
    speed: 18,
    defense: 28,
    sprite: 'bossCucumber',
    glowSprite: 'CucumberGlow',
    background: 'battleBG1',
    introMessage: ["AN UNSTABLE CUCUMBER WANTS TO FIGHT! IT'S GETTING WEIRD IN HERE."],
    nextState: 'Transition3',
    moves: {
      "CUCUMBER CRUNCH": { dmg: 20, uses: 99 },
      "PICKLE": { heal: 20, uses: 3 },
      "GOURD GUARD": { heal: 25, uses: 2 },
      "CUCUMBER CANNON": { dmg: 25, uses: 3 }
    },
    finishHim: 'BrassToeBeans',
  },

  BossRatKing: {
      name: "RADIOACTIVE RAT KING", 
      maxHP: 120,
      atk: 22,
      speed: 18,
      defense: 28,
      sprite: 'bossRat',
      glowSprite: 'RatGlow',
      background: 'battleBG1', 
      introMessage: ["THE RADIOACTIVE RAT KING WANTS TO FIGHT! CLICK ON A MOVE TO BEGIN."],
      nextState: 'Transition4',
      moves: {
        "BITE": { dmg: 20, uses: 99 }, 
        "RODENT RAGE": { dmg: 20, uses: 99 },
        "MOUSE MISSILES": { dmg: 20, uses: 99 }, 
      },
      finishHim: 'PURRcisionRifle',
    },

  BossLaserPointer: {
      name: "GAMMA LASER POINTER", 
      maxHP: 120,
      atk: 22,
      speed: 18,
      defense: 28,
      sprite: 'bossLaserPointer',
      glowSprite: 'laserPointerGlow',
      background: 'battleBG1', 
      introMessage: ["FINALLY CAUGHT THE GAMMA LASER POINTER!! TIME TO FINISH HIM OFF!"],
      nextState: 'Transition5',
      moves: {
        "ZAP": { dmg: 20, uses: 99 }, 
        "LASER BEAM": { dmg: 20, uses: 99 }, 
      },
      finishHim: 'MeowlotovCocktail',
    },

  observerBoss: {
    name: "OBSERVER", 
    maxHP: 130,
    atk: 22,
    speed: 18,
    defense: 28,
    sprite: 'observer',
    glowSprite: 'ObserverGlow',
    background: 'battleBG1',
    introMessage: ["THE OBSERVER WANTS TO OPEN THE BOX!"],    
    nextState: 'Transition7',
    moves: {
      "POISON": { dmg: 20, uses: 99 },
      "HYDROGEN HAMMER": { dmg: 30, uses: 99 },
      "SUPERPOSITION SLAM": { dmg: 25, uses: 99 }
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