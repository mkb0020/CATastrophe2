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

export const LEVELS = {  // TESTING NEW LEVEL LENGTHS
  level1: { 
    id: 'level1',
    name: 'Level 1',
    timeLimit: 9000,
    length:  21000, 
    playerSpawn: { x: 300, y: 200 }, 
    GroundSegments: [
      { x: -1000, y: 440, width: 3000, height: 50 },
      { x: 3200, y: 440, width: 2000, height: 50 },
      { x: 7000, y: 440, width: 2000, height: 50 },
      { x: 10700, y: 440, width: 1500, height: 50 },
      { x: 14200, y: 440, width: 2000, height: 50 },
      { x: 17500, y: 440, width: 3000, height: 50 }
    ],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 }, // NOT IN USE CURRENTLY - CAN I REMOVE THIS WITHOUT BREAKING ANYTHING?
    platforms: [
        { x: 1500, y: 310, width: 225, height: 20 }, // GAUNTLET 1
        { x: 2050, y: 270, width: 225, height: 20 },
        { x: 2600, y: 340, width: 225, height: 20 },
        { x: 3150, y: 260, width: 225, height: 20 },
        { x: 3700, y: 300, width: 225, height: 20 },

        { x: 5000, y: 280, width: 225, height: 20 }, // GAUNTLET 2
        { x: 5550, y: 330, width: 225, height: 20 },
        { x: 6100, y: 260, width: 225, height: 20 },
        { x: 6650, y: 340, width: 225, height: 20 },
        { x: 7200, y: 300, width: 225, height: 20 },

        { x: 8500, y: 320, width: 225, height: 20 }, // GAUNTLET 3
        { x: 9050, y: 260, width: 225, height: 20 },
        { x: 9600, y: 350, width: 225, height: 20 },
        { x: 10150, y: 260, width: 225, height: 20 },
        { x: 10700, y: 300, width: 225, height: 20 },

        { x: 12000, y: 290, width: 225, height: 20 }, // GAUNTLET 4
        { x: 12550, y: 340, width: 225, height: 20 },
        { x: 13100, y: 270, width: 225, height: 20 },
        { x: 13650, y: 350, width: 225, height: 20 },
        { x: 14200, y: 310, width: 225, height: 20 },

        { x: 15500, y: 330, width: 225, height: 20 },   // GAUNTLET 5
        { x: 16050, y: 280, width: 225, height: 20 },
        { x: 16600, y: 350, width: 225, height: 20 },
        { x: 17150, y: 260, width: 225, height: 20 },
        { x: 17700, y: 290, width: 225, height: 20 },

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
    length:  21000,    
    playerSpawn: { x: 20300, y: 200 },
    GroundSegments: [
      { x: -1000, y: 440, width: 3000, height: 50 },
      { x: 3200, y: 440, width: 2000, height: 50 },
      { x: 7000, y: 440, width: 2000, height: 50 },
      { x: 10700, y: 440, width: 1500, height: 50 },
      { x: 14200, y: 440, width: 2000, height: 50 },
      { x: 17500, y: 440, width: 3000, height: 50 }

    ],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 }, // NOT IN USE CURRENTLY - CAN I REMOVE THIS WITHOUT BREAKING ANYTHING?
    hintPlatforms: [18], // NO LONGER IN USE - CAN I REMOVE THIS
    platforms: [
          { x: 1500, y: 370, width: 200, height: 20 }, // GAUNTLET 1
          { x: 2050, y: 330, width: 200, height: 20 },
          { x: 2600, y: 300, width: 200, height: 20 },
          { x: 3150, y: 270, width: 200, height: 20 },
          { x: 3700, y: 350, width: 200, height: 20 },
          { x: 5000, y: 360, width: 200, height: 20 }, // GAUNTLET 2
          { x: 5550, y: 330, width: 200, height: 20 },
          { x: 6100, y: 290, width: 200, height: 20 },
          { x: 6650, y: 260, width: 200, height: 20 },
          { x: 7200, y: 350, width: 200, height: 20 },
          { x: 8500, y: 330, width: 200, height: 20 }, // GAUNTLET 3
          { x: 9050, y: 310, width: 200, height: 20 },
          { x: 9600, y: 280, width: 200, height: 20 },
          { x: 10150, y: 240, width: 200, height: 20 },
          { x: 10700, y: 350, width: 200, height: 20 },
          { x: 12000, y: 320, width: 200, height: 20 }, // GAUNTLET 4
          { x: 12550, y: 280, width: 200, height: 20 },
          { x: 13100, y: 260, width: 200, height: 20 },
          { x: 13650, y: 230, width: 200, height: 20 }, // EGG
          { x: 14200, y: 340, width: 200, height: 20 },
          { x: 15500, y: 300, width: 200, height: 20 }, // GAUNTLET 5
          { x: 16050, y: 280, width: 200, height: 20 },
          { x: 16600, y: 250, width: 200, height: 20 },
          { x: 17150, y: 220, width: 200, height: 20 }, // MILK
          { x: 17700, y: 360, width: 200, height: 20 }
        ],
    noStuffZones: [{ start: 13550, end: 13950 }, { start: 17100, end: 17400 }], // BONUS HP AND MILK BOTTLE
    cups: { enabled: true, count: 15 },
    enemies: {
    cucumbers: { 
          enabled: true,
          spawnRate: 2500,
          damage: 5,
          spawnZones: [
            { start: 4300, end: 4700  },  
            { start: 7800, end: 8200  },
            { start: 11300, end: 11700  },
            { start: 14800, end: 15200  }
             ]
        },
      rats: { enabled: false },

      lasers: { enabled: false }
    },
    bonusHPZone: [
      { x: 13740, y: 170 }, 
    ],
    milkBottlePosition: { x: 17250, y: 160 },
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 1 },
      milkBottle: { enabled: true, count: 1 },
      catnip: { enabled: false },
      bonusHP: { enabled: true, count: 1 } // EASY
    },
    background: 'levelBG', // CAN I REMOVE THIS SINCE THE BG IS NOW IN CSS?
    levelMusic: 'PlatformerTrack2',
    nextBoss: 'cucumberBoss',
    bossSprite: "bossCucumber", 

  },

  level3: { 
    id: 'level3',
    name: 'Level 3',
    timeLimit: 90,
    length:  21000,  
    playerSpawn: { x: 300, y: 200 },
    GroundSegments: [
      { x: -1100, y: 440, width: 2500, height: 50 },
      { x: 3600, y: 440, width: 1500, height: 50 },
      { x: 7100, y: 440, width: 2000, height: 50 },
      { x: 10600, y: 440, width: 1500, height: 50 },
      { x: 14300, y: 440, width: 2500, height: 50 },
      { x: 18000, y: 440, width: 3000, height: 50 }
],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 }, // NOT IN USE CURRENTLY - CAN I REMOVE THIS WITHOUT BREAKING ANYTHING?
    hintPlatforms: [23, 24, 25, 26], // NO LONGER IN USE - CAN I REMOVE THIS
    platforms: [
        { x: 1500, y: 380, width: 190, height: 20 },  // GAUNTLET 1
        { x: 2050, y: 300, width: 190, height: 20 },
        { x: 2600, y: 250, width: 190, height: 20 },
        { x: 3150, y: 300, width: 190, height: 20 },
        { x: 3700, y: 200, width: 190, height: 20 }, // CATNIP
        { x: 5000, y: 300, width: 190, height: 20 }, // GAUNTLET 2
        { x: 5550, y: 350, width: 190, height: 20 },
        { x: 6100, y: 270, width: 190, height: 20 },
        { x: 6650, y: 210, width: 190, height: 20 },
        { x: 7200, y: 350, width: 190, height: 20 },
        { x: 8500, y: 320, width: 190, height: 20 }, // GAUNTLET 3
        { x: 9050, y: 380, width: 190, height: 20 },
        { x: 9600, y: 290, width: 190, height: 20 },
        { x: 10150, y: 220, width: 190, height: 20 },
        { x: 10700, y: 350, width: 190, height: 20 },
        { x: 12000, y: 280, width: 190, height: 20 }, // GAUNTLET 4
        { x: 12550, y: 420, width: 190, height: 20 },
        { x: 13100, y: 380, width: 190, height: 20 },
        { x: 13650, y: 310, width: 190, height: 20 },
        { x: 14200, y: 280, width: 190, height: 20 },
        { x: 15500, y: 350, width: 190, height: 20 },  // GAUNTLET 5
        { x: 17150, y: 450, width: 190, height: 20 }, // LOWER LEVEL = NO EGG
        { x: 17700, y: 440, width: 190, height: 20 }, // LOWER LEVEL = NO EGG
        { x: 16050, y: 210, width: 190, height: 20 }, // STAIRWAY
        { x: 16600, y: 140, width: 190, height: 20 }, // STAIRWAY
        { x: 16900, y: -10, width: 610, height: 20 }, // SECRET PLATFORM
        { x: 17650, y: 110, width: 100, height: 20 } // EGG
      ],
    noStuffZones: [{ start: 3650, end: 3900 }, { start: 15400, end: 18000 },], 
    cups: { enabled: true, count: 15 },
    enemies: {
      cucumbers: { 
        enabled: true,
        spawnRate: 2200,
        damage: 5,
        spawnZones: [
          { start: 7800, end: 8200  },   
          { start: 11300, end: 11700  }
        ]
      },
    rats: { 
      enabled: true,
      spawnRate: 8000,
      spawnZones: [
        { start: 800, end: 1300  },   
        { start: 4200, end: 4800  },  
        { start: 9900, end: 10400 }, 
        { start: 10800, end: 11800  },
        { start: 18200, end: 18600  },

      ]
    },
      lasers: { enabled: false }
    },  
    bonusHPZone: [
      { x: 17700, y: 50 }, 
    ],
    catnipZones: [
      { x: 3770, y: 95 },
    ],
    items: {
      fishBones: { enabled: true, count: 1 },
      tunaCan: { enabled: true, count: 1 },
      milkBottle: { enabled: false },
      catnip: { enabled: true, count: 1 },
      bonusHP: { enabled: true, count: 1 }
    },
    background: 'levelBG', // CAN I REMOVE THIS SINCE THE BG IS NOW IN CSS?
    levelMusic: 'PlatformerTrack3', 
    nextBoss: 'bossRatKing',
    bossSprite: "bossRat", 
  },

  level4: {
    id: 'level4',
    name: 'Level 4',
    timeLimit: 90,
    length:  21000,  
    playerSpawn: { x: 300, y: 200 },
    GroundSegments: [
        { x: -1000, y: 440, width: 2500, height: 50 },
        { x: 3600, y: 440, width: 1500, height: 50 },
        { x: 7100, y: 440, width: 1500, height: 50 },
        { x: 10950, y: 440, width: 1000, height: 50 },
        { x: 14600, y: 440, width: 1000, height: 50 },
        { x: 18000, y: 440, width: 3000, height: 50 }
    ],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 }, // NOT IN USE CURRENTLY BUT KEEPING TO PREVENT BREAKING SOMETHING ELSE
    hintPlatforms: [20, 21, 22, 23],  // NO LONGER IN USE - CAN I REMOVE THIS
    sequentialPlatforms: {
      enabled: true,
      platformIds: [20, 21, 22, 23]  // NOT WORKING
    },
    platforms: [
      { x: 1500, y: 380, width: 180, height: 20 }, // GAUNTLET 1
      { x: 2050, y: 350, width: 180, height: 20 },
      { x: 2600, y: 390, width: 180, height: 20 },
      { x: 3150, y: 350, width: 180, height: 20 },
      { x: 3700, y: 380, width: 180, height: 20 },
      { x: 5000, y: 360, width: 180, height: 20 }, // GAUNTLET 2
      { x: 5550, y: 250, width: 180, height: 20 },
      { x: 6100, y: 190, width: 180, height: 20 }, // CATNIP
      { x: 6650, y: 350, width: 180, height: 20 },
      { x: 7200, y: 270, width: 180, height: 20 },
      { x: 8500, y: 280, width: 180, height: 20 }, // GAUNTLET 3
      { x: 9050, y: 410, width: 180, height: 20 },
      { x: 9600, y: 380, width: 180, height: 20 },
      { x: 10150, y: 290, width: 180, height: 20 },
      { x: 10700, y: 350, width: 180, height: 20 }, // GAUNTLET 4
      { x: 12000, y: 300, width: 180, height: 20 }, // STAIRS UP TO EASY PLATFORMS
      { x: 12550, y: 180, width: 180, height: 20 }, // STAIRS UP TO EASY PLATFORMS
      { x: 13100, y: 90, width: 180, height: 20 }, // EASY = NO EGG
      { x: 13650, y: 80, width: 180, height: 20 },  // EASY = NO EGG
      { x: 14200, y: 90, width: 180, height: 20 },  // EASY = NO EGG
      { x: 12400, y: 440, width: 150, height: 20 }, // SEQUENTIAL PLATFORM
      { x: 13100, y: 430, width: 150, height: 20 }, // SEQUENTIAL PLATFORM
      { x: 13650, y: 460, width: 150, height: 20 }, // SEQUENTIAL PLATFORM
      { x: 14200, y: 450, width: 150, height: 20 }, // EGG
      { x: 15500, y: 370, width: 180, height: 20 }, // GAUNTLET 5
      { x: 16050, y: 250, width: 180, height: 20 },
      { x: 16600, y: 200, width: 180, height: 20 },
      { x: 17150, y: 260, width: 180, height: 20 },
      { x: 17700, y: 370, width: 180, height: 20 }
    ],
    noStuffZones: [  { start: 6000, end: 6300  },{ start: 12000, end: 14500  }], // CATNIP AND EGG
    cups: { enabled: true, count: 15 },
    enemies: {
      cucumbers: { 
        enabled: true,
        spawnRate: 2100,
        damage: 5,
        spawnZones: [
          { start: 4300, end: 4700 },
          { start: 14800, end: 15200 }
        ]
      },
    rats: { 
      enabled: true,
      spawnRate: 3500,
      spawnZones: [
        { start: 800, end: 1300  },
        { start: 7700, end: 8200  },
        { start: 11100, end: 11800  }
      ]
    },
    lasers: { 
      enabled: true,
      positions: [1800, 7900, 11300, 18100]}
    },
    bonusHPZone: [
      { x: 14200, y: 320 }, 
    ],  
    catnipZones: [
      { x: 6150, y: 100 }, 
    ],
    items: {
      fishBones: { enabled: true, count: 1 },
      tunaCan: { enabled: true, count: 2 },
      milkBottle: { enabled: false },
      catnip: { enabled: true, count: 1 },
      bonusHP: { enabled: true, count: 1 }
    },
    background: 'levelBG', // CAN I REMOVE THIS SINCE THE BG IS NOW IN CSS?
    levelMusic: 'PlatformerTrack4',
    nextBoss: 'laserPointerBoss',
    bossSprite: 'bossLaserPointer'
  },

  level5: {
    id: 'level5',
    name: 'Level 5',
    timeLimit: 90,
    length:  21000,   
    playerSpawn: { x: 300, y: 200 },
    GroundSegments: [
      { x: -1000, y: 440, width: 500, height: 50 },
      { x: -800, y: 440, width: 2000, height: 50 }, // INTENTIONALLY OVELAPPING
      { x: 4150, y: 440, width: 500, height: 50 },
      { x: 7650, y: 440, width: 500, height: 50 },
      { x: 10890, y: 440, width: 1000, height: 50 },
      { x: 14650, y: 440, width: 1500, height: 50 },
      { x: 16150, y: 460, width: 1500, height: 50 },
      { x: 17680, y: 440, width: 3000, height: 50 }

],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 }, // NOT IN USE
    hintPlatforms: [20],  // NO LONGER IN USE - CAN I REMOVE THIS
    solidPlatforms: [20],
    platforms: [
      { x: 1500, y: 380, width: 175, height: 20 }, // GAUNTLET 1
      { x: 2050, y: 320, width: 175, height: 20 },
      { x: 2600, y: 250, width: 175, height: 20 },
      { x: 3150, y: 210, width: 175, height: 20 },
      { x: 3700, y: 150, width: 175, height: 20 },
      { x: 5000, y: 350, width: 175, height: 20 }, // GAUNTLET 2
      { x: 5550, y: 390, width: 175, height: 20 },
      { x: 6100, y: 430, width: 175, height: 20 },
      { x: 6650, y: 450, width: 175, height: 20 },
      { x: 7200, y: 370, width: 175, height: 20 },
      { x: 8500, y: 360, width: 175, height: 20 }, // GAUNTLET 3
      { x: 9050, y: 310, width: 175, height: 20 },
      { x: 9600, y: 260, width: 175, height: 20 },
      { x: 10150, y: 190, width: 175, height: 20 },
      { x: 10700, y: 370, width: 175, height: 20 },
      { x: 12000, y: 300, width: 175, height: 20 },  // GAUNTLET 4
      { x: 12550, y: 430, width: 175, height: 20 },
      { x: 13100, y: 360, width: 175, height: 20 },
      { x: 13650, y: 280, width: 175, height: 20 },
      { x: 14200, y: 460, width: 175, height: 20 },
      { x: 16400, y: 330, width: 1000, height: 20 } // LONG PLATFORM THAT LEADS UP TO MINI BOSS
        ],
    noStuffZones: [  
      { start: 16100, end: 17900  },
    ], 
    cups: { enabled: true, count: 15 },
    enemies: {
        cucumbers: { 
          enabled: true,
          spawnRate: 2000,
          damage: 5,
          spawnZones: [
            { start: 7850, end: 8860  }, 
            { start: 8820, end: 4600  }
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
    miniBoss: {
      enabled: true,
      x: 16900, 
      y: 270,
      hp: 3,
      throwInterval: 2.5,
      cucumberSpeed: 200
    },

    rewardItems: [
      { type: 'egg', x: 17000, y: 260 },
      { type: 'milk', x: 17050, y: 260 }
    ],
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 3 },
      milkBottle: { enabled: true, count: 1 },
      catnip: { enabled: false },
      bonusHP: { enabled: true, count: 1 }
    },
    background: 'l5BG', // CAN I REMOVE THIS SINCE THE BG IS NOW IN CSS?
    levelMusic: 'PlatformerTrack5',
    nextBoss: 'observerBoss',
    bossSprite: 'observer'

  }
};

export function getLevel(levelId) {
  return LEVELS[levelId];
}