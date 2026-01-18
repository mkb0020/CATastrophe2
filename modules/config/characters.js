function getCharacterSpritePaths(catName) {
  const base = 'assets/images/cats';
  return {
    sheet: `${base}/${catName}.png`,  
    glow: `${base}/Glow.png`,
    glitchBlue: `${base}/GlitchCatBlue.png`,
  };
}

export const SPRITE_FRAMES = {
  select: 0,
  walk0: 1,
  walk1: 2,
  walk2: 3,
  walk3: 4,
  walk4: 5,
  walk5: 6,
  walk6: 7,
  walk7: 8,
  jumpStart: 9,
  jumpRising: 10,
  jumpFalling: 11,
  idle: 12,
  standRegular: 12,
  standMad: 13,
  standSmall: 12,
  menu: 14,  
  sitLookForwardRegular: 14,
  sitLookForwardMad: 15,
  sitLookBackRegular: 16,
  sitLookBackMad: 17,
  sitSmall: 14,
  battle: 18,
  pounce: 18,
  sleep: 19,
  wakeUp: 20,
  stretch: 21,
  catch: 21,
  cup00: 22,
  cup01: 23,
  cup02: 24,
  king00: 25,
  king01: 26,
  king02: 27
};


export const SPRITE_SCALES = {
  select: 1.1,
  walk: 0.65,
  jump: 0.65,
  idle: 0.65,
  standRegular: 1.0,
  standMad: 1.0,
  menu: 0.5,
  sitLookForwardRegular: 1.0,
  sitLookForwardMad: 1.0,
  sitLookBackRegular: 1.0,
  sitLookBackMad: 1.0,
  battle: 1.0,
  pounce: 1.0,
  sleep: 1.0,
  wakeUp: 1.0,
  stretch: 1.0,
  catch: 1.0,
  cup00: 1.0,
  cup01: 1.0,
  cup02: 1.0,
  king00: 1.0,
  king01: 1.0,
  king02: 1.0
};

export const CHARACTERS = {
  NONA: {
    name: 'NONA',
    stats: {
      maxHP: 1200, //FOR TESTING
      baseHP: 1200,
      baseAtk: 3000,
      baseSpeed: 3000,
      baseDefense: 3000,
    },
    platformerStats: { 
      speed: 8,
      jumpPower: -12,            
      maxFallSpeed: 600,           
      airControlMultiplier: 0.95,  
      groundControlMultiplier: 1.0
    },
    moves: {
      "SCRATCH": { dmg: 22, uses: 99 },
      "ZOOMIES": { dmg: 26, speedBoost: true, uses: 3 },
      "CATNIP CLAW": { dmg: 32, uses: 2 },
      "MAKE BISCUITS": { heal: 30, uses: 99 } // FOR TESTING
    },
    sprites: getCharacterSpritePaths('Nona')   
  },

  GATO: {
    name: 'GATO',
    stats: {
      maxHP: 125,
      baseHP: 125,
      baseAtk: 29,
      baseSpeed: 29,
      baseDefense: 31,
    },
    platformerStats: { 
      speed: 8,
      jumpPower: -11,            
      maxFallSpeed: 500,           
      airControlMultiplier: 0.95,  
      groundControlMultiplier: 1.0
    },
    moves: {
      "SCRATCH": { dmg: 22, uses: 99 },
      "ZOOMIES": { dmg: 26, speedBoost: true, uses: 3 },
      "CATNIP CLAW": { dmg: 32, uses: 2 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Gato')
  },
  
  NIELS: {
    name: 'NIELS',
    stats: {
      maxHP: 115,
      baseHP: 115,
      baseAtk: 31,
      baseSpeed: 31,
      baseDefense: 29,
    },
    platformerStats: { 
      speed: 8,
      jumpPower: -11,            
      maxFallSpeed: 500,           
      airControlMultiplier: 0.95,  
      groundControlMultiplier: 1.0
    },
    moves: {
      "SCRATCH": { dmg: 22, uses: 99 },
      "ZOOMIES": { dmg: 26, speedBoost: true, uses: 3 },
      "CATNIP CLAW": { dmg: 32, uses: 2 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Niels')
  },

  NOVA: {
    name: 'NOVA',
    stats: {
      maxHP: 120,
      baseHP: 120, 
      baseAtk: 30,
      baseSpeed: 31,
      baseDefense: 29,
    },
    platformerStats: { 
      speed: 8,
      jumpPower: -11,            
      maxFallSpeed: 500,           
      airControlMultiplier: 0.95,  
      groundControlMultiplier: 1.0
    },
    moves: {
      "SCRATCH": { dmg: 22, uses: 99 },
      "ZOOMIES": { dmg: 26, speedBoost: true, uses: 3 },
      "CATNIP CLAW": { dmg: 32, uses: 2 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Nova')
  },

  AUBIE: {
    name: 'AUBIE',
    stats: {
      maxHP: 125,
      baseHP: 125,
      baseAtk: 29,
      baseSpeed: 29,
      baseDefense: 31,
    },
    platformerStats: { 
      speed: 8,
      jumpPower: -11,            
      maxFallSpeed: 500,           
      airControlMultiplier: 0.95,  
      groundControlMultiplier: 1.0
    },
    moves: {
      "SCRATCH": { dmg: 22, uses: 99 },
      "ZOOMIES": { dmg: 26, speedBoost: true, uses: 3 },
      "CATNIP CLAW": { dmg: 32, uses: 2 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Aubie')
  },

  DOUG: {
    name: 'DOUG',
    stats: {
      maxHP: 115,
      baseHP: 115,
      baseAtk: 31,
      baseSpeed: 29,
      baseDefense: 31,
    },
    platformerStats: { 
      speed: 8,
      jumpPower: -11,            
      maxFallSpeed: 500,           
      airControlMultiplier: 0.95,  
      groundControlMultiplier: 1.0
    },
    moves: {
      "SCRATCH": { dmg: 22, uses: 99 },
      "ZOOMIES": { dmg: 26, speedBoost: true, uses: 3 },
      "CATNIP CLAW": { dmg: 32, uses: 2 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Doug')
  }
};

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
    sheet: "rainbowCat"
  }
};

// RAINBOW CAT / CATNIP FRAME MAPPING (1x12 grid)
// 1-8: WALK
// 9-11: JUMP
// 12: IDLE
export const RAINBOW_CAT_FRAMES = {
  walk0: 0,
  walk1: 1,
  walk2: 2,
  walk3: 3,
  walk4: 4,
  walk5: 5,
  walk6: 6,
  walk7: 7,
  jumpStart: 8,
  jumpRising: 9,
  jumpFalling: 10,
  idle: 11
};
