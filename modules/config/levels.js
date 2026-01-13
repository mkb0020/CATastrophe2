/// levels.js 
// BUBBLES
export const BUBBLE_FRAMES = {
  beep: 0,
  exclamation: 1,
  heart: 2,
  plusHP: 3,
  ko: 4,
  hit: 5,
  hit2: 6,
  question: 7,
  star: 8,
  plusTen: 9,
  bonusHP: 10, 
};

export const LEVELS = {
  level1: { 
    id: 'level1',
    name: 'Level 1',
    timeLimit: 90,
    length:  17000, 
    playerSpawn: { x: 200, y: 200 },  
    GroundSegments: [
      { x: -1000, y: 440, width: 6000, height: 50 },
      { x: 6300, y: 440, width: 1300, height: 50 },
      { x: 9000, y: 440, width: 2000, height: 50 },
      { x: 12000, y: 440, width: 5000, height: 50 },
    ],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 }, // NOT IN USE CURRENTLY BUT KEEPING TO PREVENT BREAKING SOMETHING ELSE
    platforms: [
        { x: 1500, y: 310, width: 200, height: 20 },
        { x: 1950, y: 270, width: 200, height: 20 },
        { x: 2400, y: 340, width: 200, height: 20 },
        { x: 2850, y: 260, width: 200, height: 20 },
        { x: 3300, y: 300, width: 200, height: 20 },

        { x: 4500, y: 280, width: 200, height: 20 },
        { x: 4950, y: 330, width: 200, height: 20 },
        { x: 5400, y: 260, width: 200, height: 20 },
        { x: 5850, y: 340, width: 200, height: 20 },
        { x: 6300, y: 300, width: 200, height: 20 },

        { x: 7500, y: 320, width: 200, height: 20 },
        { x: 7950, y: 260, width: 200, height: 20 },
        { x: 8400, y: 350, width: 200, height: 20 },
        { x: 8850, y: 260, width: 200, height: 20 },
        { x: 9300, y: 300, width: 200, height: 20 },

        { x: 10500, y: 290, width: 200, height: 20 },
        { x: 10950, y: 340, width: 200, height: 20 },
        { x: 11400, y: 270, width: 200, height: 20 },
        { x: 11850, y: 350, width: 200, height: 20 },
        { x: 12300, y: 310, width: 200, height: 20 },

        { x: 13500, y: 330, width: 200, height: 20 },
        { x: 13950, y: 280, width: 200, height: 20 },
        { x: 14400, y: 350, width: 200, height: 20 },
        { x: 14850, y: 260, width: 200, height: 20 },
        { x: 15300, y: 290, width: 200, height: 20 },

  ],
    noStuffZones: [{ start: 16000, end: 17000},], 
    cups: { enabled: true, count: 15 },
    enemies: {
      cucumbers: { enabled: false },
      rats: { enabled: false },
      lasers: { enabled: false }
    },
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: false },
      milkBottle: { enabled: false },
      catnip: { enabled: false },
      bonusHP: { enabled: false }
    },
    background: 'levelBG',
    levelMusic: 'PlatformerTrack1',
    nextBoss: 'cupBoss',
    bossSprite: "bossCup", 
  },

  level2: { 
    id: 'level2',
    name: 'Level 2',
    timeLimit: 90,
    length:  17000,  
    playerSpawn: { x: 200, y: 200 },
    GroundSegments: [
        { x: -1000, y: 440, width: 3300, height: 50 },
        { x: 3200, y: 440, width: 1600, height: 50 },
        { x: 6300, y: 440, width: 2000, height: 50 },
        { x: 9000, y: 440, width: 2000, height: 50 },
        { x: 12000, y: 440, width: 5000, height: 50 },
    ],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 }, // NOT IN USE CURRENTLY BUT KEEPING TO PREVENT BREAKING SOMETHING ELSE
    hintPlatforms: [18],
    platforms: [
        { x: 1500, y: 370, width: 175, height: 20 },
        { x: 1956.25, y: 330, width: 175, height: 20 },
        { x: 2412.5, y: 300, width: 175, height: 20 },
        { x: 2868.75, y: 270, width: 175, height: 20 },
        { x: 3325, y: 350, width: 175, height: 20 },

        { x: 4500, y: 360, width: 175, height: 20 },
        { x: 4956.25, y: 330, width: 175, height: 20 },
        { x: 5412.5, y: 290, width: 175, height: 20 },
        { x: 5868.75, y: 260, width: 175, height: 20 },
        { x: 6325, y: 350, width: 175, height: 20 },

        { x: 7500, y: 330, width: 175, height: 20 },
        { x: 7956.25, y: 310, width: 175, height: 20 },
        { x: 8412.5, y: 280, width: 175, height: 20 },
        { x: 8868.75, y: 240, width: 175, height: 20 },
        { x: 9325, y: 350, width: 175, height: 20 },

        { x: 10500, y: 320, width: 175, height: 20 },
        { x: 10956.25, y: 280, width: 175, height: 20 },
        { x: 11412.5, y: 260, width: 175, height: 20 },
        { x: 11868.75, y: 230, width: 175, height: 20 }, // EGG
        { x: 12325, y: 340, width: 175, height: 20 },

        { x: 13500, y: 300, width: 175, height: 20 },
        { x: 13956.25, y: 280, width: 175, height: 20 },
        { x: 14412.5, y: 250, width: 175, height: 20 },
        { x: 14868.75, y: 220, width: 175, height: 20 }, // MILK
        { x: 15325, y: 360, width: 175, height: 20 },



  ],
    noStuffZones: [{ start: 11800, end: 12200}, { start: 14800, end: 15200}], // BONUS HP AND MILK BOTTLE
    cups: { enabled: true, count: 15 },
    enemies: {
    cucumbers: { 
          enabled: true,
          spawnRate: 2500,
          damage: 5,
          spawnZones: [
            { start: 3900, end: 4000 },  
            { start: 6900, end: 7000 },
            { start: 9900, end: 10000 },
            { start: 12900, end: 13000 },
            { start: 15800, end: 15900 },
          ]
        },
      rats: { enabled: false },

      lasers: { enabled: false }
    },
    bonusHPZone: [
      { x: 11900, y: 150 }, 
    ],
    milkBottlePosition: { x: 14900, y: 150 },
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 1 },
      milkBottle: { enabled: true, count: 1 },
      catnip: { enabled: false },
      bonusHP: { enabled: true, count: 1 } // EASY
    },
    background: 'levelBG',
    levelMusic: 'PlatformerTrack2',
    nextBoss: 'cucumberBoss',
    bossSprite: "bossCucumber", 

  },

  level3: { 
    id: 'level3',
    name: 'Level 3',
    timeLimit: 90,
    length:  17000,
    playerSpawn: { x: 200, y: 200 },
    GroundSegments: [
      {x: -1000, y: 440, width: 3000, height: 50},
      {x: 3200, y: 440, width: 1600, height: 50},
      {x: 6300, y: 440, width: 2000, height: 50},
      {x: 9700, y: 440, width: 700, height: 50},
      {x: 12700, y: 440, width: 1200, height: 50},
      {x: 15400, y: 440, width: 5000, height: 50}

],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 }, // NOT IN USE CURRENTLY BUT KEEPING TO PREVENT BREAKING SOMETHING ELSE
    hintPlatforms: [23, 24, 25, 26],
    platforms: [
        {x: 1500, y: 380, width: 175, height: 20}, // G1
        {x: 1956.25, y: 300, width: 175, height: 20},
        {x: 2412.5, y: 250, width: 175, height: 20},
        {x: 2868.75, y: 300, width: 175, height: 20},
        {x: 3325, y: 180, width: 175, height: 20}, // CATNIP

        {x: 4500, y: 300, width: 175, height: 20}, // G2
        {x: 4956.25, y: 400, width: 175, height: 20},
        {x: 5412.5, y: 250, width: 175, height: 20},
        {x: 5868.75, y: 210, width: 175, height: 20},
        {x: 6325, y: 350, width: 175, height: 20},

        {x: 7500, y: 320, width: 175, height: 20}, // G3
        {x: 7956.25, y: 380, width: 175, height: 20},
        {x: 8412.5, y: 290, width: 175, height: 20},
        {x: 8868.75, y: 220, width: 175, height: 20},
        {x: 9325, y: 350, width: 175, height: 20},

        {x: 10500, y: 280, width: 175, height: 20}, // G4
        {x: 10956.25, y: 420, width: 175, height: 20},
        {x: 11412.5, y: 260, width: 175, height: 20},
        {x: 11868.75, y: 170, width: 175, height: 20},
        {x: 12325, y: 280, width: 175, height: 20},

        {x: 13500, y: 350, width: 175, height: 20}, // G5
        {x: 14600, y: 450, width: 175, height: 20}, // LOWER-LEVEL
        {x: 15050, y: 440, width: 175, height: 20}, // LOWER-LEVEL

        {x: 13800, y: 210, width: 175, height: 20}, // STAIRS
        {x: 14212, y: 140, width: 175, height: 20}, // STAIRS
        {x: 14570, y: -10, width: 610, height: 20}, // SECRET
        {x: 15400, y: 120, width: 100, height: 20} // EGG
    ],
    noStuffZones: [{ start: 3200, end: 3800}, { start: 14000, end: 15600},], 
    cups: { enabled: true, count: 15 },
    enemies: {
      cucumbers: { 
        enabled: true,
        spawnRate: 2200,
        damage: 5,
        spawnZones: [
          { start: 4000, end: 4050 },   
          { start: 6900, end: 7000 }, 
          { start: 9900, end: 10000 }
        ]
      },
    rats: { 
      enabled: true,
      spawnRate: 8000,
      spawnZones: [
        { start: 700, end: 1500 },   
        { start: 6800, end: 8300 },  
        { start: 9900, end: 10400 }, 
        { start: 13000, end: 13700 },
        { start: 15700, end: 16000 },

      ]
    },
      lasers: { enabled: false }
    },  
    bonusHPZone: [
      { x: 15465, y: 50 }, 
    ],
    catnipZones: [
      { x: 3400, y: 95 },
    ],
    items: {
      fishBones: { enabled: true, count: 1 },
      tunaCan: { enabled: true, count: 1 },
      milkBottle: { enabled: false },
      catnip: { enabled: true, count: 1 },
      bonusHP: { enabled: true, count: 1 }
    },
    background: 'levelBG',
    levelMusic: 'PlatformerTrack3',
    nextBoss: 'bossRatKing',
    bossSprite: "bossRat", 
  },

  level4: {
    id: 'level4',
    name: 'Level 4',
    timeLimit: 90,
    length:  17000,
    playerSpawn: { x: 200, y: 200 },
    GroundSegments: [
      {x: 0, y: 440, width: 1300, height: 50},
      {x: 3700, y: 440, width: 700, height: 50},
      {x: 6200, y: 440, width: 1100, height: 50},
      {x: 8500, y: 440, width: 500, height: 50},
      {x: 9800, y: 440, width: 900, height: 50},
      {x: 12750, y: 440, width: 800, height: 50},
      {x: 15800, y: 440, width: 2000, height: 50},

    ],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 }, // NOT IN USE CURRENTLY BUT KEEPING TO PREVENT BREAKING SOMETHING ELSE
    hintPlatforms: [20, 21, 22, 23], 
    platforms: [
      {x: 1500, y: 380, width: 150, height: 20}, // GAUNTLET 1
      {x: 1962, y: 350, width: 150, height: 20},
      {x: 2424, y: 390, width: 150, height: 20},
      {x: 2886, y: 350, width: 150, height: 20},
      {x: 3348, y: 380, width: 150, height: 20},

      {x: 4500, y: 360, width: 150, height: 20}, // GAUNTLET 2
      {x: 4962, y: 250, width: 150, height: 20},
      {x: 5424, y: 190, width: 150, height: 20}, // CATNIP
      {x: 5886, y: 350, width: 150, height: 20},
      {x: 6348, y: 270, width: 150, height: 20},

      {x: 7500, y: 280, width: 150, height: 20}, // GAUNTLET 3
      {x: 7962, y: 410, width: 150, height: 20},
      {x: 8424, y: 380, width: 150, height: 20},
      {x: 8886, y: 290, width: 150, height: 20},
      {x: 9348, y: 350, width: 150, height: 20},

      {x: 10500, y: 300, width: 175, height: 20}, // GAUNTLET 4
      {x: 10962, y: 180, width: 175, height: 20},
      {x: 11424, y: 90, width: 175, height: 20},
      {x: 11886, y: 80, width: 175, height: 20},
      {x: 12348, y: 90, width: 175, height: 20},

      {x: 10962, y: 440, width: 100, height: 20}, // SPECIAL PATH
      {x: 11424, y: 430, width: 100, height: 20}, // SPECIAL PATH
      {x: 11886, y: 460, width: 100, height: 20}, // SPECIAL PATH
      {x: 12348, y: 450, width: 100, height: 20}, // EGG

      {x: 13500, y: 370, width: 150, height: 20}, // GAUNTLET 5
      {x: 13962, y: 250, width: 150, height: 20},
      {x: 14424, y: 200, width: 150, height: 20},
      {x: 14886, y: 260, width: 150, height: 20},
      {x: 15348, y: 370, width: 150, height: 20}
    ],
    noStuffZones: [  { start: 5300, end: 5600 },{ start: 10962, end: 12600 }], // CATNIP AND EGG
    cups: { enabled: true, count: 15 },
    enemies: {
      cucumbers: { 
        enabled: true,
        spawnRate: 2100,
        damage: 5,
        spawnZones: [
          { start: 4000, end: 4100 },
          { start: 10050, end: 10100 }
        ]
      },
    rats: { 
      enabled: true,
      spawnRate: 3500,
      spawnZones: [
        { start: 8600, end: 9000 },
        { start: 10000, end: 10700 },
        { start: 12900, end: 13500 }
      ]
    },
    lasers: { 
      enabled: true,
      positions: [2650, 7000, 15800]}
    },
    bonusHPZone: [
      { x: 12375, y: 320 }, 
    ],  
    catnipZones: [
      { x: 5450, y: 100 }, 
    ],
    items: {
      fishBones: { enabled: true, count: 1 },
      tunaCan: { enabled: true, count: 2 },
      milkBottle: { enabled: false },
      catnip: { enabled: true, count: 1 },
      bonusHP: { enabled: true, count: 1 }
    },
    background: 'levelBG',
    levelMusic: 'PlatformerTrack4',
    nextBoss: 'laserPointerBoss',
    bossSprite: 'bossLaserPointer'
  },

  level5: {
    id: 'level5',
    name: 'Level 5',
    timeLimit: 90,
    length:  17000, 
    playerSpawn: { x: 200, y: 200 },
    GroundSegments: [
      {x: 0, y: 440, width: 1200, height: 50},
      {x: 2650, y: 440, width: 1300, height: 50},
      {x: 4225, y: 440, width: 500, height: 50},
      {x: 6500, y: 440, width: 1000, height: 50},
      {x: 9700, y: 440, width: 600, height: 50},
      {x: 12700, y: 440, width: 600, height: 50},
      {x: 13310, y: 460, width: 2400, height: 50},
      {x: 15720, y: 440, width: 1000, height: 50}
],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 }, // NOT IN USE
    hintPlatforms: [20, 21, 22, 23], 
    platforms: [
      {x: 1500, y: 380, width: 125, height: 20}, // GAUNTLET 1
      {x: 1962, y: 320, width: 125, height: 20},
      {x: 2424, y: 250, width: 125, height: 20},
      {x: 2886, y: 210, width: 125, height: 20},
      {x: 3348, y: 150, width: 125, height: 20},

      {x: 4500, y: 350, width: 125, height: 20}, // GAUNTLET 2
      {x: 4962, y: 390, width: 125, height: 20},
      {x: 5424, y: 430, width: 125, height: 20},
      {x: 5886, y: 450, width: 125, height: 20},
      {x: 6348, y: 370, width: 125, height: 20},

      {x: 7500, y: 360, width: 125, height: 20}, // GAUNTLET 3
      {x: 7962, y: 310, width: 125, height: 20},
      {x: 8424, y: 260, width: 125, height: 20},
      {x: 8886, y: 190, width: 125, height: 20},
      {x: 9348, y: 370, width: 125, height: 20},

      {x: 10500, y: 300, width: 125, height: 20}, // GAUNTLET 4
      {x: 10962, y: 430, width: 125, height: 20},
      {x: 11424, y: 360, width: 125, height: 20},
      {x: 11886, y: 280, width: 125, height: 20},
      {x: 12348, y: 460, width: 125, height: 20},

      {x: 13500, y: 320, width: 1000, height: 20}, // SPECIAL PATH
      {x: 14424, y: 220, width: 300, height: 20}, // MINI BOSS
      {x: 14886, y: 150, width: 75, height: 20}, // EGG
      {x: 15248, y: 150, width: 75, height: 20} // MILK
    ],
    noStuffZones: [  
      { start: 3250, end: 3548 }, 
      { start: 13500, end: 16000 }
    ], 
    cups: { enabled: true, count: 15 },
    enemies: {
        cucumbers: { 
          enabled: true,
          spawnRate: 2000,
          damage: 5,
          spawnZones: [
            { start: 7000, end: 7100 }, 
            { start: 9900, end: 10600 }
          ]
        },
    rats: { 
      enabled: true,
      spawnRate: 6000, 
      spawnZones: [
        { start: 600, end: 1000 }, 
        { start: 3100, end: 3800 }, 
        { start: 9800, end: 10300 }]
    },
    lasers: { 
          enabled: true,
          positions: [
            4450,   
            5750,
            12950,   
          ]
        }
    },
    bonusHPZone: [{ x: 14950, y: 70 }], 
    catnipZones: [{ x: 3400, y: 100 }],
    milkBottlePosition: { x: 15350, y: 70 },
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 3 },
      milkBottle: { enabled: true, count: 1 },
      catnip: { enabled: true, count: 1 },
      bonusHP: { enabled: true, count: 1 }
    },
    background: 'l5BG',
    levelMusic: 'PlatformerTrack5',
    nextBoss: 'observerBoss',
    bossSprite: 'observer'

  }
};

export function getLevel(levelId) {
  return LEVELS[levelId];
}