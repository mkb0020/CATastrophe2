// characters.js
function getCharacterSpritePaths(catName) {
  const base = 'assets/images/cats';
  return {
    sheet: `${base}/${catName}.png`,
    sheet2: `${base}/${catName}2.png`,
    walk: `${base}/${catName}3.png`,
    glow: `${base}/Glow.png`,
    glitchBlue: `${base}/GlitchCatBlue.png`,
  };
}

// FRAME MAPPING (6x3 grid = 18 frames)
// Row 1: [0]battle [1]catch [2]cup00 [3]cup01 [4]cup02 [5]king00
// Row 2: [6]king01 [7]king02 [8]wakeUp [9]menu [10]sitLookBackMad [11]sitLookBackRegular
// Row 3: [12]sitLookForwardMad [13]sitLookForwardRegular [14]sitSmall [15]sleep [16]standMad [17]standRegular

export const SPRITE_FRAMES = {
  battle: 0,
  pounce: 0,        
  catch: 1,
  stretch: 1,       
  cup00: 2,
  cup01: 3,
  cup02: 4,
  king00: 5,
  king01: 6,
  king02: 7,
  wakeUp: 8,
  menu: 14,
  select: 9,        
  sitLookBackMad: 10,
  sitLookBackRegular: 11,
  sitLookForwardMad: 12,
  sitLookForwardRegular: 13,
  sitSmall: 14,
  sleep: 15,
  standMad: 16,
  standRegular: 17,
 // 2 FRAME PLATFORMER SHEET
  idle: 0,
  standSmall: 0,    
  jump: 1
};

export const SPRITE_SCALES = {
  battle: 1.0,      
  pounce: 1.0,    
  catch: 1.0,      
  stretch: 1.0,    
  menu: 0.6,        
  select: 1.2       
};


export const CHARACTERS = {
  NONA: {
    name: 'NONA',
    stats: {
      maxHP: 1000, // FOR TESTING
      baseHP: 1000, // FOR TESTING
      baseAtk: 1000, // FOR TESTING
      baseSpeed: 1000, // FOR TESTING
      baseDefense: 1000, // FOR TESTING
    },
    platformerStats: { 
      speed: 5,
      jumpPower: -12,
      gravity: 0.6
    },
    moves: {
      "SCRATCH": { dmg: 22, uses: 99 },
      "ZOOMIES": { dmg: 26, speedBoost: true, uses: 3 },
      "CATNIP CLAW": { dmg: 30, uses: 2 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Nona')   
  },

  GATO: {
    name: 'GATO',
    stats: {
      maxHP: 130,
      baseHP: 130,
      baseAtk: 26,
      baseSpeed: 20,
      baseDefense: 29,
      },
    platformerStats: {  
      speed: 5,
      jumpPower: -12,
      gravity: 0.6
    },
    moves: {
      "SCRATCH": { dmg: 22, uses: 99 },
      "ZOOMIES": { dmg: 26, speedBoost: true, uses: 3 },
      "CATNIP CLAW": { dmg: 30, uses: 2 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Gato')
  },
  
  NIELS: {
    name: 'NIELS',
    stats: {
      maxHP: 120,
      baseHP: 120,
      baseAtk: 28,
      baseSpeed: 23,
      baseDefense: 23,
    },
    platformerStats: {  
      speed: 5,
      jumpPower: -12,
      gravity: 0.6
    },
    moves: {
      "SCRATCH": { dmg: 22, uses: 99 },
      "ZOOMIES": { dmg: 26, speedBoost: true, uses: 3 },
      "CATNIP CLAW": { dmg: 30, uses: 2 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Niels')
  },

  NOVA: {
    name: 'NOVA',
  stats: {
      maxHP: 125,
      baseHP: 125, 
      baseAtk: 27,
      baseSpeed: 24,
      baseDefense:23,
    },
    platformerStats: {  
      speed: 5,
      jumpPower: -12,
      gravity: 0.6
    },
    moves: {
      "SCRATCH": { dmg: 22, uses: 99 },
      "ZOOMIES": { dmg: 26, speedBoost: true, uses: 3 },
      "CATNIP CLAW": { dmg: 30, uses: 2 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Nova')
  },

  AUBIE: {
    name: 'AUBIE',
    stats: {
      maxHP: 130,
      baseHP: 130,
      baseAtk: 27,
      baseSpeed: 20,
      baseDefense: 28,
    },
    platformerStats: {  
      speed: 5,
      jumpPower: -12,
      gravity: 0.6
    },
    moves: {
      "SCRATCH": { dmg: 22, uses: 99 },
      "ZOOMIES": { dmg: 26, speedBoost: true, uses: 3 },
      "CATNIP CLAW": { dmg: 30, uses: 2 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Aubie')
  },

  DOUG: {
    name: 'DOUG',
    stats: {
      maxHP: 120,
      baseHP: 120,
      baseAtk: 25,
      baseSpeed: 27,
      baseDefense: 27,
    },
    platformerStats: {  
      speed: 5,
      jumpPower: -12,
      gravity: 0.6
    },
    moves: {
      "SCRATCH": { dmg: 22, uses: 99 },
      "ZOOMIES": { dmg: 26, speedBoost: true, uses: 3 },
      "CATNIP CLAW": { dmg: 30, uses: 2 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Doug')
  }
}


export function getCharacter(characterName) {
  return CHARACTERS[characterName];
}

export function getCharacterList() {
  return Object.values(CHARACTERS);
}

export function getCharacterStats(characterName) {
  const char = CHARACTERS[characterName];
  return {
    name: char.name,
    stats: {
      maxHP: char.stats.maxHP,
      atk: char.stats.baseAtk,
      speed: char.stats.baseSpeed,
      defense: char.stats.baseDefense
    },
    moves: JSON.parse(JSON.stringify(char.moves)), 
    sprites: char.sprites
  };
}

export const rainbowCat = {
  name: "Rainbow Cat",
  sprites: {
    idle: "rainbowCatPlatformer",
    jump: "rainbowCatPlatformer", 
    walk: "rainbowCatWalk"
  }
};