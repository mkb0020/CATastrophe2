// characters.js
function getCharacterSpritePaths(catName) { // HELPER TO GET IMAGE PATHS
  const base = 'assets/images/cats';
  return {
    battle: `${base}/battle/${catName}.png`,
    catch: `${base}/catch/${catName}.png`,
    cup00: `${base}/cup/00/${catName}.png`,
    cup01: `${base}/cup/01/${catName}.png`,
    cup02: `${base}/cup/02/${catName}.png`,
    jump: `${base}/jump/${catName}.png`,
    king00: `${base}/king/00/${catName}.png`,
    king01: `${base}/king/01/${catName}.png`,
    king02: `${base}/king/02/${catName}.png`,
    menu: `${base}/sit/img/${catName}.png`,
    sitSmall: `${base}/sit/small/${catName}.png`,
    sitLookForwardRegular: `${base}/sit/forward/regular/${catName}.png`,
    sitLookForwardMad: `${base}/sit/forward/mad/${catName}.png`,
    sitLookBackRegular: `${base}/sit/back/regular/${catName}.png`,
    sitLookBackMad: `${base}/sit/back/mad/${catName}.png`,
    idle: `${base}/stand/idle/${catName}.png`,
    standRegular: `${base}/stand/regular/${catName}.png`,
    standMad: `${base}/stand/mad/${catName}.png`,
    standSmall: `${base}/stand/small/${catName}.png`,
    pounce: `${base}/pounce/${catName}.png`,
    select: `${base}/select/${catName}.png`,
    sleep: `${base}/sleep/${catName}.png`,
    stretch: `${base}/stretch/${catName}.png`,
    wakeUp: `${base}/wakeUp/${catName}.png`,
    walk: `${base}/walk/${catName}.png`,
    glow: `${base}/battle/Glow.png`,
    glitchBlue: `${base}/sit/GlitchCatBlue.png`,
    glitchRed: `${base}/sit/GlitchCatRed.png`

  };
}

export const CHARACTERS = {
  NONA: {
    name: 'NONA',
    stats: {
      maxHP: 120,
      baseHP: 120,
      baseAtk: 37,
      baseSpeed: 38,
      baseDefense: 30,
    },
    platformerStats: { 
      speed: 5,
      jumpPower: -12,
      gravity: 0.6
    },
    moves: {
      "SCRATCH": { dmg: 24, uses: 5 },
      "CATNIP CLAW": { dmg: 42, uses: 2 },
      "ZOOMIES": { dmg: 25, speedBoost: true, uses: 3 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Nona')   
  },

  GATO: {
    name: 'GATO',
    stats: {
      maxHP: 120,
      baseHP: 120,
      baseAtk: 37,
      baseSpeed: 38,
      baseDefense: 30,
      },
    platformerStats: {  
      speed: 5,
      jumpPower: -12,
      gravity: 0.6
    },
    moves: {
      "SCRATCH": { dmg: 24, uses: 5 },
      "CATNIP CLAW": { dmg: 42, uses: 2 },
      "ZOOMIES": { dmg: 25, speedBoost: true, uses: 3 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Gato')
  },
  
  NIELS: {
    name: 'NIELS',
    stats: {
      maxHP: 120,
      baseHP: 120,
      baseAtk: 37,
      baseSpeed: 38,
      baseDefense: 30,
    },
    platformerStats: {  
      speed: 5,
      jumpPower: -12,
      gravity: 0.6
    },
    moves: {
      "SCRATCH": { dmg: 24, uses: 5 },
      "CATNIP CLAW": { dmg: 42, uses: 2 },
      "ZOOMIES": { dmg: 25, speedBoost: true, uses: 3 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Niels')
  },

  NOVA: {
    name: 'NOVA',
  stats: {
      maxHP: 120,
      baseHP: 120,
      baseAtk: 37,
      baseSpeed: 38,
      baseDefense: 30,
    },
    platformerStats: {  
      speed: 5,
      jumpPower: -12,
      gravity: 0.6
    },
    moves: {
      "SCRATCH": { dmg: 24, uses: 5 },
      "CATNIP CLAW": { dmg: 42, uses: 2 },
      "ZOOMIES": { dmg: 25, speedBoost: true, uses: 3 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Nova')
  },

  AUBIE: {
    name: 'AUBIE',
    stats: {
      maxHP: 120,
      baseHP: 120,
      baseAtk: 37,
      baseSpeed: 38,
      baseDefense: 30,
    },
    platformerStats: {  
      speed: 5,
      jumpPower: -12,
      gravity: 0.6
    },
    moves: {
      "SCRATCH": { dmg: 24, uses: 5 },
      "CATNIP CLAW": { dmg: 42, uses: 2 },
      "ZOOMIES": { dmg: 25, speedBoost: true, uses: 3 },
      "MAKE BISCUITS": { heal: 30, uses: 3 }
    },
    sprites: getCharacterSpritePaths('Aubie')
  },

  DOUG: {
    name: 'DOUG',
    stats: {
      maxHP: 120,
      baseHP: 120,
      baseAtk: 37,
      baseSpeed: 38,
      baseDefense: 30,
    },
    platformerStats: {  
      speed: 5,
      jumpPower: -12,
      gravity: 0.6
    },
    moves: {
      "SCRATCH": { dmg: 24, uses: 5 },
      "CATNIP CLAW": { dmg: 42, uses: 2 },
      "ZOOMIES": { dmg: 25, speedBoost: true, uses: 3 },
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
      maxHP: char.baseHP,
      atk: char.baseAtk,
      speed: char.baseSpeed,
      defense: char.baseDefense
    },
    moves: JSON.parse(JSON.stringify(char.moves)), 
    sprites: char.sprites
  };
}

export const rainbowCat = {
  name: "Rainbow Cat",
  sprites: {
    idle: "rainbowIdle",
    jump: "rainbowJump", 
    walk: "rainbowWalk"
  }
};