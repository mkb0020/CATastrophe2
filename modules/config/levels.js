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
  level1: { // PLATFORM AND GROUND LOCATIONS ARE GOOD
    id: 'level1',
    name: 'Level 1',
    timeLimit: 90,
    length:  18500, 
    playerSpawn: { x: 12210, y: 200 },  
GroundSegments: [
      { x: -1000, y: 440, width: 2500, height: 50 }, // -1000 - 1500
      { x: 3700, y: 440, width: 1000, height: 50 }, // 3700 - 4700
      { x: 6900, y: 440, width: 1000, height: 50 }, // 6900 - 7900
      { x: 10100, y: 440, width: 1000, height: 50 }, // 10100 - 11100
      { x: 13300, y: 440, width: 1000, height: 50 }, // 13300 - 14300
      { x: 16500, y: 440, width: 2000, height: 50 }, // 16500 - 17500

  ],
    platforms: [
    { x: 1375, y: 310, width: 250, height: 20 }, // GAUNTLET: 1 1375 - 3825
    { x: 1925, y: 270, width: 250, height: 20 },
    { x: 2475, y: 340, width: 250, height: 20 },
    { x: 3025, y: 260, width: 250, height: 20 },
    { x: 3575, y: 300, width: 250, height: 20 }, // END: 3825

    { x: 4575, y: 280, width: 250, height: 20 }, // GAUNTLET 2: 4575 - 7025
    { x: 5125, y: 330, width: 250, height: 20 },
    { x: 5675, y: 260, width: 250, height: 20 },
    { x: 6225, y: 340, width: 250, height: 20 },
    { x: 6775, y: 300, width: 250, height: 20 }, // END 7025

    { x: 7775, y: 320, width: 250, height: 20 }, // GAUNTLET 3: 7775 - 10225
    { x: 8325, y: 260, width: 250, height: 20 },
    { x: 8875, y: 350, width: 250, height: 20 },
    { x: 9425, y: 260, width: 250, height: 20 },
    { x: 9975, y: 300, width: 250, height: 20 }, // END 10225

    { x: 10975, y: 290, width: 250, height: 20 }, // GAUNTLET 4 10975 - 13425
    { x: 11525, y: 340, width: 250, height: 20 },
    { x: 12075, y: 270, width: 250, height: 20 }, // CHALLENGE ROOM IN
    { x: 12625, y: 350, width: 250, height: 20 },
    { x: 13175, y: 310, width: 250, height: 20 }, // END 13425

    { x: 14175, y: 330, width: 250, height: 20 }, // GAUNTLET 5 14175 - 16625
    { x: 14725, y: 280, width: 250, height: 20 },
    { x: 15275, y: 350, width: 250, height: 20 },
    { x: 15825, y: 260, width: 250, height: 20 },
    { x: 16375, y: 290, width: 250, height: 20 }, // END 16625

  ],
    noStuffZones: [{ start: 19000, end: 20000},], 
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
    challengeDoorIN: [ 
    { x: 12210, y: 150, roomId: 'room1' }
    ],
    challengeDoorOUT: [  
    { x: 13700, y: 100, roomId: 'room1' }
    ],
    levelMusic: 'PlatformerTrack1',
    nextBoss: 'cupBoss',
    bossSprite: "bossCup", 
  },

  level2: {  // PLATFORM AND GROUND LOCATIONS ARE GOOD - WINDOWS NEED TO BE TWEAKED - NEED TO ADJUST ENEMY SPAWN POINTS
    id: 'level2',
    name: 'Level 2',
    timeLimit: 90,
    length:  20300,    
    playerSpawn: { x: 8200, y: 200 },
    GroundSegments: [
      { x: -1000, y: 440, width: 2500, height: 50 }, // -1000 - 1500
      { x: 3725, y: 440, width: 1500, height: 50 }, // 3725 - 5225
      { x: 7450, y: 440, width: 1500, height: 50 }, // 7450 - 8950
      { x: 11175, y: 440, width: 1500, height: 50 },
      { x: 14900, y: 440, width: 1500, height: 50 },
      { x: 18625, y: 440, width: 2500, height: 50 }

    ],
    platforms: [
          { x: 1400, y: 330, width: 225, height: 20 }, // GAUNTLET: 1 1400 - 3825 (2425)
          { x: 1950, y: 300, width: 225, height: 20 },
          { x: 2500, y: 270, width: 225, height: 20 },
          { x: 3050, y: 310, width: 225, height: 20 },
          { x: 3600, y: 350, width: 225, height: 20 },


          { x: 5125, y: 360, width: 225, height: 20 }, // GAUNTLET 2: 5125 - 7550
          { x: 5675, y: 330, width: 225, height: 20 },
          { x: 6225, y: 290, width: 225, height: 20 },
          { x: 6775, y: 260, width: 225, height: 20 },
          { x: 7325, y: 350, width: 225, height: 20 },

          { x: 8850, y: 330, width: 225, height: 20 }, // GAUNTLET 3: 8850 - 11275
          { x: 9400, y: 310, width: 225, height: 20 },
          { x: 9950, y: 280, width: 225, height: 20 },
          { x: 10500, y: 240, width: 225, height: 20 },
          { x: 11050, y: 350, width: 225, height: 20 },

          { x: 12575, y: 320, width: 225, height: 20 }, // GAUNTLET 4: 12575 - 15000
          { x: 13125, y: 280, width: 225, height: 20 },
          { x: 13675, y: 260, width: 225, height: 20 },
          { x: 14225, y: 230, width: 225, height: 20 }, // EGG
          { x: 14775, y: 340, width: 225, height: 20 },

          { x: 16300, y: 300, width: 225, height: 20 }, // GAUNTLET 5: 16300 - 18725
          { x: 16850, y: 280, width: 225, height: 20 },
          { x: 17400, y: 250, width: 225, height: 20 },
          { x: 17950, y: 220, width: 225, height: 20 }, // MILK
          { x: 18500, y: 360, width: 225, height: 20 }
        ],
    noStuffZones: [{ start: 14125, end: 14550 }, { start: 17850, end: 18275 }], // BONUS HP AND MILK BOTTLE
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
      { x: 14345, y: 170 }, 
    ],
    milkBottlePosition: { x: 18050, y: 140 },
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 1 },
      milkBottle: { enabled: true, count: 1 },
      catnip: { enabled: false },
      bonusHP: { enabled: true, count: 1 } // EASY
    },
    challengeDoorIN: [ // TESTING LOCATION
    { x: 8200, y: 300, roomId: 'room2' } // BETWEEN G2 and G3
    ],
    challengeDoorOUT: [ // TESTING LOCATION
    { x: 10500, y: 60, roomId: 'room2' }
    ],
    background: 'levelBG', // NEED TO FIGURE OUT IF I CAN REMOVE THIS WITHOUT BREAKING ANYTHING ELSE
    levelMusic: 'PlatformerTrack2',
    nextBoss: 'cucumberBoss',
    bossSprite: "bossCucumber", 

  },

  level3: {  // ONLY THE FIRST GROUND SEGMENT SHOWS UP - NO PLATFORMS RENDER - NEED TO ADJUST ENEMY SPAWN POINTS
    id: 'level3',
    name: 'Level 3',
    timeLimit: 90,
    length:  21000,  
    playerSpawn: { x: 14975, y: 200 },
    GroundSegments: [
      { x: -1000, y: 440, width: 1500, height: 50 },
      { x: 3725, y: 440, width: 1500, height: 50 },
      { x: 7450, y: 440, width: 1500, height: 50 },
      { x: 11175, y: 440, width: 1500, height: 50 },
      { x: 14900, y: 440, width: 1500, height: 50 },
      { x: 18800, y: 440, width: 2500, height: 50 }
],
    platforms: [
        { x: 1600, y: 380, width: 200, height: 20 },  // GAUNTLET 1
        { x: 2150, y: 300, width: 200, height: 20 },
        { x: 2700, y: 250, width: 200, height: 20 },
        { x: 3250, y: 300, width: 200, height: 20 },
        { x: 3800, y: 200, width: 200, height: 20 }, // CATNIP

        { x: 5325, y: 250, width: 200, height: 20 }, // GAUNTLET 2
        { x: 5875, y: 350, width: 200, height: 20 },
        { x: 6425, y: 270, width: 200, height: 20 },
        { x: 6975, y: 210, width: 200, height: 20 },
        { x: 7525, y: 350, width: 200, height: 20 },

        { x: 9050, y: 320, width: 200, height: 20 }, // GAUNTLET 3
        { x: 9600, y: 380, width: 200, height: 20 },
        { x: 10150, y: 290, width: 200, height: 20 },
        { x: 10700, y: 220, width: 200, height: 20 },
        { x: 11250, y: 350, width: 200, height: 20 },

        { x: 12775, y: 280, width: 200, height: 20 }, // GAUNTLET 4
        { x: 13325, y: 420, width: 200, height: 20 },
        { x: 13875, y: 380, width: 200, height: 20 },
        { x: 14425, y: 310, width: 200, height: 20 },
        { x: 14975, y: 280, width: 200, height: 20 }, // CHALLENGE DOOR IN

        { x: 16500, y: 350, width: 200, height: 20 },  // GAUNTLET 5 // CHALLENGE DOOR OUT
        { x: 18150, y: 390, width: 200, height: 20 }, // LOWER LEVEL = NO EGG
        { x: 18700, y: 400, width: 200, height: 20 }, // LOWER LEVEL = NO EGG
        { x: 17050, y: 220, width: 200, height: 20 }, // STAIRWAY
        { x: 17600, y: 150, width: 200, height: 20 }, // STAIRWAY
        { x: 18000, y: -15, width: 700, height: 20, isRect: true } , // SECRET PLATFORM
        { x: 18900, y: 100, width: 100, height: 20 } // EGG
      ],
    noStuffZones: [{ start: 3700, end: 4100 }, { start: 17700, end: 19100 },], 
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
      { x: 18975, y: 50 }, 
    ],
    catnipZones: [
      { x: 3875, y: 80 },
    ],
    items: {
      fishBones: { enabled: true, count: 1 },
      tunaCan: { enabled: true, count: 1 },
      milkBottle: { enabled: false },
      catnip: { enabled: true, count: 1 },
      bonusHP: { enabled: true, count: 1 }
    },
    challengeDoorIN: [ // NEED TO ADJUST
    { x: 14975, y: 120, roomId: 'room3' }
    ],
    challengeDoorOUT: [ // NEED TO ADJUST
    { x: 16420, y: 70, roomId: 'room3' }
    ],
    levelMusic: 'PlatformerTrack3', 
    nextBoss: 'bossRatKing',
    bossSprite: "bossRat", 
  },

  level4: { // PLATFORM AND GROUND LOCATIONS ARE GOOD - NEED TO FIX SEQUENTIAL PLATFORMS
    id: 'level4',
    name: 'Level 4',
    timeLimit: 90,
    length:  23000,  
    playerSpawn: { x: 17500, y: 200 },
    GroundSegments: [
        { x: -1000, y: 440, width: 2500, height: 50 },
        { x: 4310, y: 440, width: 1500, height: 50 },
        { x: 8620, y: 440, width: 1500, height: 50 },
        { x: 12930, y: 440, width: 1500, height: 50 },
        { x: 17240, y: 440, width: 1500, height: 50 },
        { x: 21540, y: 440, width: 2500, height: 50 }
    ],
   
    sequentialPlatforms: {
      enabled: true,
      platformIds: [20, 21, 22, 23]  // FIX NEEDED - NOT WORKING
    },
    platforms: [
      { x: 1680, y: 380, width: 200, height: 20 }, // GAUNTLET 1
      { x: 2240, y: 350, width: 200, height: 20 },
      { x: 2800, y: 300, width: 200, height: 20 },
      { x: 3360, y: 340, width: 200, height: 20 },
      { x: 3920, y: 270, width: 200, height: 20 },

      { x: 5990, y: 360, width: 200, height: 20 }, // GAUNTLET 2
      { x: 6550, y: 250, width: 200, height: 20 },
      { x: 7110, y: 190, width: 200, height: 20 }, // CATNIP
      { x: 7670, y: 350, width: 200, height: 20 },
      { x: 8230, y: 270, width: 200, height: 20 },

      { x: 10300, y: 280, width: 200, height: 20 }, // GAUNTLET 3
      { x: 10860, y: 410, width: 200, height: 20 },
      { x: 11420, y: 380, width: 200, height: 20 },
      { x: 11980, y: 290, width: 200, height: 20 },
      { x: 12540, y: 290, width: 200, height: 20 },

      { x: 14610, y: 280, width: 200, height: 20 }, // GAUNTLET 4 - STAIRS UP TO EASY PLATFORMS
      { x: 15170, y: 140, width: 200, height: 20 }, // STAIRS UP TO EASY PLATFORMS
      { x: 15730, y: 90, width: 225, height: 20 }, // EASY = NO EGG
      { x: 16290, y: 80, width: 225, height: 20 },  // EASY = NO EGG
      { x: 16850, y: 90, width: 225, height: 20 },  // EASY = NO EGG
      { x: 15070, y: 460, width: 150, height: 20 }, // SEQUENTIAL PLATFORM
      { x: 15610, y: 430, width: 150, height: 20 }, // SEQUENTIAL PLATFORM
      { x: 16150, y: 460, width: 150, height: 20 }, // SEQUENTIAL PLATFORM
      { x: 16690, y: 450, width: 150, height: 20 }, // EGG

      { x: 18900, y: 370, width: 200, height: 20 }, // GAUNTLET 5
      { x: 19460, y: 250, width: 200, height: 20 },
      { x: 20020, y: 200, width: 200, height: 20 },
      { x: 20580, y: 260, width: 200, height: 20 },
      { x: 21140, y: 370, width: 200, height: 20 }
    ],
    noStuffZones: [  { start: 7000, end: 7500  },{ start: 15170, end: 17200 }], // CATNIP AND EGG
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
      { x: 16750, y: 320 }, 
    ],  
    catnipZones: [
      { x: 7210, y: 80 }, 
    ],
    items: {
      fishBones: { enabled: true, count: 1 },
      tunaCan: { enabled: true, count: 2 },
      milkBottle: { enabled: false },
      catnip: { enabled: true, count: 1 },
      bonusHP: { enabled: true, count: 1 }
    },
    challengeDoorIN: [  // TESTING
    { x: 17500, y: 300, roomId: 'room4' }
    ],
    challengeDoorOUT: [  // TESTING LOCATION
    { x: 19460, y: 20, roomId: 'room4' }
    ],
    levelMusic: 'PlatformerTrack4',
    nextBoss: 'laserPointerBoss',
    bossSprite: 'bossLaserPointer'
  },

  level5: {  // PLATFORM AND GROUND LOCATIONS ARE GOOD
    id: 'level5',
    name: 'Level 5',
    timeLimit: 90,
    length:  21000,   
    playerSpawn: { x: 4865, y: 200 },
    GroundSegments: [
      { x: -1000, y: 440, width: 2500, height: 50 },
      { x: 4215, y: 440, width: 1500, height: 50 },
      { x: 8430, y: 440, width: 1500, height: 50 },
      { x: 12645, y: 440, width: 1500, height: 50 },
      { x: 16860, y: 440, width: 1500, height: 50 },
      { x: 18360, y: 460, width: 1500, height: 50 },
      { x: 19860, y: 440, width: 2000, height: 50 }

],

    solidPlatforms: [20],
    platforms: [
      { x: 1690, y: 380, width: 175, height: 20 }, // GAUNTLET 1
      { x: 2230, y: 320, width: 175, height: 20 },
      { x: 2770, y: 250, width: 175, height: 20 },
      { x: 3310, y: 210, width: 175, height: 20 },
      { x: 3850, y: 150, width: 175, height: 20 }, 

      { x: 5905, y: 350, width: 175, height: 20 }, // GAUNTLET 2
      { x: 6445, y: 390, width: 175, height: 20 },
      { x: 6985, y: 450, width: 175, height: 20 }, // DOOR OUT
      { x: 7525, y: 430, width: 175, height: 20 },
      { x: 8065, y: 370, width: 175, height: 20 },

      { x: 10120, y: 360, width: 175, height: 20 }, // GAUNTLET 3
      { x: 10660, y: 310, width: 175, height: 20 },
      { x: 11200, y: 260, width: 175, height: 20 },
      { x: 11740, y: 190, width: 175, height: 20 },
      { x: 12280, y: 370, width: 175, height: 20 },

      { x: 14335, y: 280, width: 175, height: 20 },  // GAUNTLET 4
      { x: 14875, y: 430, width: 175, height: 20 },
      { x: 15415, y: 360, width: 175, height: 20 },
      { x: 15955, y: 280, width: 175, height: 20 },
      { x: 16495, y: 460, width: 175, height: 20 },

      { x: 18550, y: 330, width: 1100, height: 20 } // LONG PLATFORM THAT LEADS UP TO MINI BOSS
        ],
    noStuffZones: [  
      { start: 18300, end: 19900  },
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
      x: 19300, 
      y: 270,
      hp: 3,
      throwInterval: 2.5,
      cucumberSpeed: 200
    },

    rewardItems: [
      { type: 'egg', x: 19200, y: 250 },
      { type: 'milk', x: 19300, y: 230 },
      { type: 'egg', x: 19400, y: 240 },
    ],
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 2 },
      milkBottle: { enabled: true, count: 1 },
      catnip: { enabled: false },
      bonusHP: { enabled: true, count: 2 }
    },
    challengeDoorIN: [  // NEED TO ADJUST
    { x: 4865, y: 300, roomId: 'room5' }
    ],
    challengeDoorOUT: [  // NEED TO ADJUST
    { x: 6985, y: 80, roomId: 'room5' }
    ],
    levelMusic: 'PlatformerTrack5',
    nextBoss: 'observerBoss',
    bossSprite: 'observer'

  }
};

export function getLevel(levelId) {
  return LEVELS[levelId];
}