/// levels.js 
import { SCREEN_W, SCREEN_H } from '../config/gameConfig.js';

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
    length:  25500, 
    playerSpawn: { x: 300, y: 200 }, // NORMAL
    //playerSpawn: { x: 15300, y: 200 }, // FOR TESTING CHALLENGE ROOMS
    //playerSpawn: { x: 24950, y: 200 },   // FOR TESTING BOSS BATTLES
    GroundSegments: [
    { x: -1000, y: 440, width: 3000, height: 50 },
    { x: 4800, y: 440, width: 2000, height: 50 },
    { x: 9600, y: 440, width: 2000, height: 50 },
    { x: 14400, y: 440, width: 2000, height: 50 },
    { x: 19200, y: 440, width: 2000, height: 50 },
    { x: 24000, y: 440, width: 2000, height: 50 }

  ],
 platforms: [
  { x: 1875, y: 310, width: 260, height: 20 },
  { x: 2575, y: 270, width: 260, height: 20 },
  { x: 3275, y: 340, width: 260, height: 20 },
  { x: 3975, y: 260, width: 260, height: 20 },
  { x: 4675, y: 300, width: 260, height: 20 },

  { x: 6675, y: 280, width: 260, height: 20 },
  { x: 7375, y: 330, width: 260, height: 20 },
  { x: 8075, y: 260, width: 260, height: 20 },
  { x: 8775, y: 340, width: 260, height: 20 },
  { x: 9475, y: 300, width: 260, height: 20 },

  { x: 11475, y: 320, width: 260, height: 20 },
  { x: 12175, y: 260, width: 260, height: 20 },
  { x: 12875, y: 350, width: 260, height: 20 },
  { x: 13575, y: 260, width: 260, height: 20 },
  { x: 14275, y: 300, width: 260, height: 20 },

  { x: 16275, y: 290, width: 260, height: 20 },
  { x: 16975, y: 340, width: 260, height: 20 },
  { x: 17675, y: 270, width: 260, height: 20 },
  { x: 18375, y: 350, width: 260, height: 20 },
  { x: 19075, y: 310, width: 260, height: 20 },

  { x: 21075, y: 330, width: 260, height: 20 },
  { x: 21775, y: 280, width: 260, height: 20 },
  { x: 22475, y: 350, width: 260, height: 20 },
  { x: 23175, y: 260, width: 260, height: 20 },
  { x: 23875, y: 290, width: 260, height: 20 }
 

  ],
    noStuffZones: [{ start: 24000, end: 25000},], 
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
    { x: 15300, 
      y: 300, 
      roomId: 'room1',
      returnX: 20100,  
      returnY: 100    
    }
    ],
    challengeDoorOUT: [  
    { x: 20100, y: 100, roomId: 'room1' }
    ],
    levelMusic: 'PlatformerTrack1',
    nextBoss: 'cupBoss',
    bossSprite: "bossCup", 
  },

  level2: {  
    id: 'level2',
    name: 'Level 2',
    timeLimit: 90,
    length:  25825,   
    playerSpawn: { x: 300, y: 200 }, // NORMAL
    //playerSpawn: { x: 8200, y: 200 }, // FOR TESTING CHALLENGE ROOMS
    //playerSpawn: { x: 25225, y: 200 },   // FOR TESTING BOSS BATTLES 
    GroundSegments: [
      { x: -1000, y: 440, width: 3000, height: 50 },
      { x: 4865, y: 440, width: 2000, height: 50 },
      { x: 9730, y: 440, width: 2000, height: 50 },
      { x: 14595, y: 440, width: 2000, height: 50 },
      { x: 19460, y: 440, width: 2000, height: 50 },
      { x: 24325, y: 440, width: 2000, height: 50 }


    ],
    platforms: [
      { x: 1950, y: 330, width: 235, height: 20 },
      { x: 2635, y: 300, width: 235, height: 20 },
      { x: 3320, y: 270, width: 235, height: 20 },
      { x: 4005, y: 310, width: 235, height: 20 },
      { x: 4690, y: 350, width: 235, height: 20 },

      { x: 6815, y: 360, width: 235, height: 20 },
      { x: 7500, y: 330, width: 235, height: 20 },
      { x: 8185, y: 290, width: 235, height: 20 },
      { x: 8870, y: 260, width: 235, height: 20 },
      { x: 9555, y: 350, width: 235, height: 20 },

      { x: 11680, y: 330, width: 235, height: 20 },
      { x: 12365, y: 310, width: 235, height: 20 },
      { x: 13050, y: 280, width: 235, height: 20 },
      { x: 13735, y: 240, width: 235, height: 20 },
      { x: 14420, y: 350, width: 235, height: 20 },

      { x: 16545, y: 320, width: 235, height: 20 },
      { x: 17230, y: 280, width: 235, height: 20 },
      { x: 17915, y: 260, width: 235, height: 20 },
      { x: 18600, y: 230, width: 235, height: 20 }, // EGG
      { x: 19285, y: 340, width: 235, height: 20 },

      { x: 21410, y: 300, width: 235, height: 20 },
      { x: 22095, y: 280, width: 235, height: 20 },
      { x: 22780, y: 250, width: 235, height: 20 },
      { x: 23465, y: 220, width: 235, height: 20 }, // MILK
      { x: 24150, y: 360, width: 235, height: 20 }
        ],
    noStuffZones: [{ start: 24100, end: 24450 }, { start: 8100, end: 8500 }, { start: 10412, end: 10912 }, { start: 18500, end: 18920 }], // BONUS HP AND MILK BOTTLE
    cups: { enabled: true, count: 15 },
    enemies: {
    cucumbers: { 
          enabled: true,
          spawnRate: 2500,
          damage: 5,
          spawnZones: [
            { start: 1400, end: 1500  }, 
            { start: 5400, end: 6300  }, 
            { start: 11200, end: 11400  },  
            { start: 15100, end: 16000  },
            { start: 19900, end: 21000  },
            { start: 24800, end: 24900  }
             ]
        },
      rats: { enabled: false },

      lasers: { enabled: false }
    },
    bonusHPZone: [
      { x: 18750, y: 170 }, 
    ],
    milkBottlePosition: { x: 24250, y: 220 },
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 1 },
      milkBottle: { enabled: true, count: 1 },
      catnip: { enabled: false },
      bonusHP: { enabled: true, count: 1 } // EASY
    },
    challengeDoorIN: [ 
    { x: 8250,
      y: 140, 
      roomId: 'room2',
      returnX: 10512,  
      returnY: 60    
    }
    ],
    challengeDoorOUT: [ 
    { x: 10512, y: 60, roomId: 'room2' }
    ],
    levelMusic: 'PlatformerTrack2',
    nextBoss: 'cucumberBoss',
    bossSprite: "bossCucumber", 

  },

  level3: {  
    id: 'level3',
    name: 'Level 3',
    timeLimit: 90,
    length:  27900,  
    playerSpawn: { x: 300, y: 200 }, // NORMAL
    //playerSpawn: { x: 20770, y: 200 }, // FOR TESTING CHALLENGE ROOMS
    //playerSpawn: { x: 27350, y: 200 },   // FOR TESTING BOSS BATTLES 
    GroundSegments: [
      { x: -1000, y: 440, width: 3000, height: 50 },
      { x: 5280, y: 440, width: 2000, height: 50 },
      { x: 10560, y: 440, width: 2000, height: 50 },
      { x: 15840, y: 440, width: 2000, height: 50 },
      { x: 21120, y: 440, width: 2000, height: 50 },
      { x: 26400, y: 440, width: 2000, height: 50 }
],
    platforms: [
      { x: 2200, y: 380, width: 220, height: 20 },
      { x: 2870, y: 300, width: 220, height: 20 },
      { x: 3540, y: 250, width: 220, height: 20 },
      { x: 4210, y: 300, width: 220, height: 20 },
      { x: 4880, y: 200, width: 220, height: 20 }, // CATNIP

      { x: 7480, y: 250, width: 220, height: 20 },
      { x: 8150, y: 350, width: 220, height: 20 },
      { x: 8820, y: 270, width: 220, height: 20 },
      { x: 9490, y: 210, width: 220, height: 20 },
      { x: 10160, y: 350, width: 220, height: 20 },

      { x: 12760, y: 320, width: 220, height: 20 },
      { x: 13430, y: 380, width: 220, height: 20 },
      { x: 14100, y: 290, width: 220, height: 20 },
      { x: 14770, y: 220, width: 220, height: 20 },
      { x: 15440, y: 350, width: 220, height: 20 },

      { x: 18040, y: 280, width: 220, height: 20 },
      { x: 18710, y: 420, width: 220, height: 20 },
      { x: 19380, y: 380, width: 220, height: 20 },
      { x: 20050, y: 310, width: 220, height: 20 },
      { x: 20720, y: 280, width: 220, height: 20 }, // CHALLENGE DOOR IN


      { x: 23320, y: 340, width: 220, height: 20 }, // CHALLENGE DOOR OUT
      { x: 23990, y: 220, width: 220, height: 20 }, // STAIRWAY
      { x: 24660, y: 150, width: 220, height: 20 }, // STAIRWAY
      { x: 25330, y: 390, width: 220, height: 20 }, // LOWER LEVEL = NO EGG
      { x: 26000, y: 400, width: 220, height: 20 }, // LOWER LEVEL = NO EGG

      { x: 25160, y: -15, width: 600, height: 20, isRect: true } , // SECRET PLATFORM
      { x: 26200, y: 100, width: 100, height: 20 } // EGG


      ],
    noStuffZones: [{ start: 4680, end: 5080 }, { start: 20620, end: 21020 }, { start: 23220, end: 23620 }, { start: 23320, end: 26500 },], 
    cups: { enabled: true, count: 15 },
    enemies: {
      cucumbers: { 
        enabled: true,
        spawnRate: 2200,
        damage: 5,
        spawnZones: [
          { start: 6300, end: 6800 },  
          { start: 16800, end: 17200 }
        ]
      },
    rats: { 
      enabled: true,
      spawnRate: 2500,
      spawnZones: [
        { start: 1300, end: 1800 },   
        { start: 5800, end: 6300 },
        { start: 6200, end: 7000 }, 
        { start: 10900, end: 12300 }, 
        { start: 16200, end: 17600 },
        { start: 21600, end: 22800 },
        { start: 26700, end: 27000 }
      ]
    },
      lasers: { enabled: false }
    },  
    bonusHPZone: [
      { x: 26250, y: 50 }, 
    ],
    catnipZones: [
      { x: 4900, y: 80 },
    ],
    items: {
      fishBones: { enabled: true, count: 1 },
      tunaCan: { enabled: true, count: 1 },
      milkBottle: { enabled: false },
      catnip: { enabled: true, count: 1 },
      bonusHP: { enabled: true, count: 1 }
    },
    challengeDoorIN: [ 
    { x: 20770, 
      y: 110, 
      roomId: 'room3',
      returnX: 22620,  
      returnY: 20
    }    
    ],
    challengeDoorOUT: [  // TESTING NEW LOCATION
    { x: 22620, y: 20, roomId: 'room3' }
    ],
    levelMusic: 'PlatformerTrack3', 
    nextBoss: 'bossRatKing',
    bossSprite: "bossRat", 
  },

  level4: { 
    id: 'level4',
    name: 'Level 4',
    timeLimit: 90,
    length:  28850,  
    playerSpawn: { x: 300, y: 200 }, // NORMAL
    //playerSpawn: { x: 16710, y: 200 }, // FOR TESTING CHALLENGE ROOMS
    //playerSpawn: { x: 28350, y: 200 },   // FOR TESTING BOSS BATTLES 
    GroundSegments: [
      { x: -1000, y: 440, width: 3000, height: 50 },
      { x: 5470, y: 440, width: 2000, height: 50 }, // 5470 - 7470
      { x: 10940, y: 440, width: 2000, height: 50 }, // 10940 - 12940
      { x: 16410, y: 440, width: 2000, height: 50 }, // 16410-18410
      { x: 21880, y: 440, width: 2000, height: 50 }, // 21880 - 23880
      { x: 27350, y: 440, width: 2000, height: 50 }

    ],
    sequentialPlatforms: {
      enabled: true,
      platformIds: [20, 21, 22, 23] 
    },
    platforms: [
    { x: 2300, y: 380, width: 220, height: 20 },
    { x: 2970, y: 350, width: 220, height: 20 },
    { x: 3640, y: 300, width: 220, height: 20 },
    { x: 4310, y: 340, width: 220, height: 20 },
    { x: 4980, y: 270, width: 220, height: 20 },

    { x: 7770, y: 360, width: 220, height: 20 },
    { x: 8440, y: 250, width: 220, height: 20 },
    { x: 9110, y: 190, width: 220, height: 20 },  // CATNIP
    { x: 9780, y: 350, width: 220, height: 20 },
    { x: 10450, y: 270, width: 220, height: 20 },

    { x: 13240, y: 280, width: 220, height: 20 }, //10
    { x: 13910, y: 410, width: 220, height: 20 },
    { x: 14580, y: 380, width: 220, height: 20 },
    { x: 15250, y: 290, width: 220, height: 20 },
    { x: 15920, y: 290, width: 220, height: 20 },


      { x: 18710, y: 280, width: 220, height: 20 }, // GAUNTLET 4: 14610 ~ 16900 - STAIRS UP TO EASY PLATFORMS
      { x: 19380, y: 140, width: 220, height: 20 }, // STAIRS UP TO EASY PLATFORMS
      { x: 20050, y: 90, width: 250, height: 20 }, // EASY = NO EGG
      { x: 20720, y: 80, width: 250, height: 20 },  // EASY = NO EGG
      { x: 21390, y: 90, width: 250, height: 20 },  // EASY = NO EGG

      { x: 19480, y: 460, width: 185, height: 20 }, // SEQUENTIAL PLATFORM
      { x: 20150, y: 430, width: 185, height: 20 }, // SEQUENTIAL PLATFORM
      { x: 20820, y: 460, width: 185, height: 20 }, // SEQUENTIAL PLATFORM
      { x: 21490, y: 450, width: 185, height: 20 }, // EGG

      { x: 24180, y: 370, width: 220, height: 20 },
      { x: 24850, y: 250, width: 220, height: 20 },
      { x: 25520, y: 200, width: 220, height: 20 },
      { x: 26190, y: 260, width: 220, height: 20 },
      { x: 26860, y: 370, width: 220, height: 20 }

    ],
    noStuffZones: [  { start: 4900, end: 5300  }, { start: 16510, end: 17010  }, { start: 17810, end: 18220 }, { start: 18510, end: 21590 }], // CATNIP AND EGG
    cups: { enabled: true, count: 15 },
    enemies: {
      cucumbers: { 
        enabled: true,
        spawnRate: 2100,
        damage: 5,
        spawnZones: [
          { start: 6100, end: 7100 },
          { start: 12200, end: 12800 },
          { start: 17000, end: 18000 }
        ]
      },
    rats: { 
      enabled: true,
      spawnRate: 2500,
      spawnZones: [
        { start: 1100, end: 1700 },
        { start: 5900, end: 6700 },
        { start: 6600, end: 7000 },
        { start: 11200, end: 12000 },
        { start: 11800, end: 12500 },
        { start: 22000, end: 23000 },
        { start: 22800, end: 23500 }
      ]
    },
    lasers: { 
      enabled: true,
      positions: [
        2110, 
        17450, 
        10200, 
        11800, 
        22800, 
        27700]}
    },
    bonusHPZone: [
      { x: 21560, y: 320 }, 
    ],  
    catnipZones: [
      { x: 5100, y: 120 }, 
    ],
    items: {
      fishBones: { enabled: true, count: 1 },
      tunaCan: { enabled: true, count: 2 },
      milkBottle: { enabled: false },
      catnip: { enabled: true, count: 1 },
      bonusHP: { enabled: true, count: 1 }
    },
    challengeDoorIN: [  
    { x: 16710, 
      y: 290, 
      roomId: 'room4',
      returnX: 17910,
      returnY: 20
     }
    ],
    challengeDoorOUT: [
    { x: 17910, y: 30, roomId: 'room4' }
    ],
    levelMusic: 'PlatformerTrack4',
    nextBoss: 'laserPointerBoss',
    bossSprite: 'bossLaserPointer'
  },

  
  level5: {  
    id: 'level5',
    name: 'Level 5',
    timeLimit: 90,
    length:  27800,   
    playerSpawn: { x: 300, y: 200 }, // NORMAL
    //playerSpawn: { x: 5100, y: 100 }, // FOR TESTING CHALLENGE ROOMS
    //playerSpawn: { x: 27350, y: 200 },   // FOR TESTING BOSS BATTLES 
    GroundSegments: [
      { x: -1000, y: 440, width: 3000, height: 50 },
      { x: 5660, y: 440, width: 2000, height: 50 }, // 5660 - 7660
      { x: 11320, y: 440, width: 2000, height: 50 }, // 11320 - 13320
      { x: 16980, y: 440, width: 2000, height: 50 }, // 16980 - 18980
      { x: 22640, y: 440, width: 2000, height: 50 }, // 22640 - 24640
      { x: 24640, y: 460, width: 2000, height: 50 }, // 24640 - 26640
      { x: 26300, y: 440, width: 2000, height: 50 }
],
    solidPlatforms: [20],
    platforms: [
        { x: 2400,    y: 380, width: 220, height: 20 },
        { x: 3065,    y: 320, width: 220, height: 20 },
        { x: 3730,    y: 250, width: 220, height: 20 },
        { x: 4395,    y: 210, width: 220, height: 20 },
        { x: 5060,    y: 150, width: 220, height: 20 },

        { x: 7995,    y: 350, width: 220, height: 20 },
        { x: 8660,    y: 390, width: 220, height: 20 },
        { x: 9325,    y: 450, width: 220, height: 20 },
        { x: 9990,    y: 430, width: 220, height: 20 },
        { x: 10655,   y: 370, width: 220, height: 20 },

        { x: 13590,   y: 360, width: 220, height: 20 },
        { x: 14255,   y: 310, width: 220, height: 20 },
        { x: 14920,   y: 260, width: 220, height: 20 },
        { x: 15585,   y: 190, width: 220, height: 20 },
        { x: 16250,   y: 370, width: 220, height: 20 },

        { x: 19185,   y: 280, width: 220, height: 20 },
        { x: 19850,   y: 430, width: 220, height: 20 },
        { x: 20515,   y: 360, width: 220, height: 20 },
        { x: 21180,   y: 280, width: 220, height: 20 },
        { x: 21845,   y: 460, width: 220, height: 20 },
        { x: 24780, y: 330, width: 1200, height: 20 }
        ],
    noStuffZones: [  
      { start: 4940, end: 5340  },
      { start: 6460, end: 6860  },
      { start: 24600, end: 26300  },
    ], 
    cups: { enabled: true, count: 15 },
    enemies: {
        cucumbers: { 
          enabled: true,
          spawnRate: 2000,
          damage: 5,
          spawnZones: [
            { start: 5850, end: 5950  },
            { start: 6050, end: 6150  },
            { start: 7160, end: 7260  }, 
            { start: 7460, end: 7560  },
            { start: 17280, end: 17480  },
            { start: 17680, end: 17880  },
            { start: 18080, end: 18280  },
            { start: 18480, end: 18680  }
            ]
        },
    rats: { 
      enabled: true,
      spawnRate: 2500, 
      spawnZones: [
        { start: 11550, end: 12700 }, 
        { start: 17300, end: 18000 }, 
        { start: 17800, end: 18600 },
        { start: 12400, end: 13200 },
        { start: 22840, end: 23500 },
        { start: 23300, end: 23900 },
        { start: 23700, end: 24000 },
        { start: 23900, end: 24400 } 
        ]
    },
    lasers: { 
          enabled: true,
          positions: [
            2100,   
            26500,
            11920, 
            12710,  
            9700, 
            22500,
          ]
        }
    },
    miniBoss: {
      enabled: true,
      x: 25700, 
      y: 270,
      hp: 3,
      throwInterval: 2.5,
      cucumberSpeed: 200
    },

    rewardItems: [
      { type: 'egg', x: 25700, y: 250 },
      { type: 'milk', x: 25800, y: 230 },
      { type: 'egg', x: 25900, y: 240 },
    ],
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 2 },
      milkBottle: { enabled: true, count: 1 },
      catnip: { enabled: false },
      bonusHP: { enabled: true, count: 2 }
    },
    challengeDoorIN: [  
    { x: 5175, 
      y: 30, 
      roomId: 'room5',
      returnX: 6560,
      returnY: 70
     }
    ],
    challengeDoorOUT: [  
    { x: 6560, y: 80, roomId: 'room5' }
    ],
    levelMusic: 'PlatformerTrack5',
    nextBoss: 'observerBoss',
    bossSprite: 'observer'

  }
};

export function getLevel(levelId) {
  return LEVELS[levelId];
}