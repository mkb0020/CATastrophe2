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
  plusTen: 9
};

export const LEVELS = {
  level1: { 
    id: 'level1',
    name: 'Level 1',
    timeLimit: 90,
    length:  12000,
    playerSpawn: { x: 1000, y: 300 },
    GroundSegments: [
      {x: -1000, y: 440, width: 5000, height: 50}, 
      {x: 4250, y: 440, width: 2600, height: 50}, 
      {x: 7100, y: 440, width: 2150, height: 50}, 
      {x: 9500, y: 440, width: 6000, height: 50}, 
    ],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 },
    platforms: [
    {x: 1300, y: 330, width: 250, height: 20},  
    {x: 1720, y: 300, width: 245, height: 20}, 
    {x: 2145, y: 270, width: 240, height: 20}, 
    {x: 2565, y: 305, width: 235, height: 20}, 
    {x: 2985, y: 280, width: 240, height: 20}, 
    
    {x: 3900, y: 285, width: 240, height: 20}, 
    {x: 4325, y: 315, width: 235, height: 20},
    {x: 4750, y: 345, width: 230, height: 20}, 
    {x: 5180, y: 310, width: 225, height: 20},  
    {x: 5615, y: 275, width: 240, height: 20}, 
    
    {x: 6380, y: 360, width: 245, height: 20},  
    {x: 6815, y: 295, width: 240, height: 20},  
    {x: 7250, y: 325, width: 235, height: 20},  
    {x: 7700, y: 280, width: 230, height: 20}, 
    {x: 8130, y: 310, width: 240, height: 20}, 
    
    {x: 8875, y: 340, width: 235, height: 20},  
    {x: 9310, y: 305, width: 230, height: 20},  
    {x: 9740, y: 270, width: 225, height: 20},  
    {x: 10175, y: 290, width: 240, height: 20}, 
    {x: 10625, y: 220, width: 220, height: 20},
  ],

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
    length:  12000, 
    playerSpawn: { x: 1000, y: 300 },
    GroundSegments: [
  { x: -1000, y: 440, width: 3600, height: 50 },
  { x: 3000, y: 440, width: 1800, height: 50 },
  { x: 5100, y: 440, width: 2300, height: 50 },
  { x: 7400, y: 440, width: 2300, height: 50 },
  { x: 9900, y: 440, width: 2500, height: 50 },
  { x: 11900, y: 440, width: 4000, height: 50 }
],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 },  
    platforms: [
    {x: 1300, y: 320, width: 250, height: 20},  
    {x: 1725, y: 285, width: 245, height: 20}, 
    {x: 2150, y: 310, width: 240, height: 20},  
    {x: 2575, y: 270, width: 235, height: 20},  
    {x: 3005, y: 300, width: 240, height: 20}, 

    {x: 3890, y: 280, width: 240, height: 20},  
    {x: 4320, y: 310, width: 235, height: 20},  
    {x: 4755, y: 265, width: 230, height: 20},  
    {x: 5195, y: 290, width: 225, height: 20},  
    {x: 5635, y: 260, width: 240, height: 20}, 

    {x: 6380, y: 340, width: 245, height: 20}, 
    {x: 6825, y: 280, width: 240, height: 20},  
    {x: 7270, y: 305, width: 235, height: 20},  
    {x: 7725, y: 270, width: 230, height: 20}, 
    {x: 8165, y: 295, width: 240, height: 20}, 

    {x: 8880, y: 325, width: 235, height: 20},  
    {x: 9320, y: 285, width: 230, height: 20},  
    {x: 9755, y: 260, width: 225, height: 20},  
    {x: 10195, y: 275, width: 240, height: 20}, 
    {x: 10655, y: 200, width: 220, height: 20}
  ],

    cups: { enabled: true, count: 15 },
    enemies: {
    cucumbers: { 
          enabled: true,
          spawnRate: 2500,
          damage: 5,
          spawnZones: [
            { start: 3190, end: 4200 },  
            { start: 6200, end: 6800 }
          ]
        },
      rats: { enabled: false },

      lasers: { enabled: false }
    },


    milkBottlePosition: { x: 10765, y: 130 },
    items: {
      fishBones: { enabled: true, count: 1 },
      tunaCan: { enabled: true, count: 1 },
      milkBottle: { enabled: true, count: 1 },
      catnip: { enabled: false }
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
    length:  12000,
    playerSpawn: { x: 1000, y: 300 },
    GroundSegments: [
  { x: -1000, y: 440, width: 3200, height: 50 },
  { x: 3200, y: 440, width: 1400, height: 50 },
  { x: 4900, y: 440, width: 1800, height: 50 },
  { x: 7200, y: 440, width: 2100, height: 50 },
  { x: 9050, y: 440, width: 2300, height: 50 },
  { x: 11050, y: 440, width: 3200, height: 50 }
],

    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 },
    
    platforms: [
    {x: 1300, y: 340, width: 250, height: 20}, 
    {x: 1715, y: 300, width: 245, height: 20},  
    {x: 2125, y: 355, width: 240, height: 20},  
    {x: 2530, y: 290, width: 235, height: 20},  
    {x: 2945, y: 340, width: 240, height: 20},  
    {x: 3900, y: 320, width: 240, height: 20},  
    {x: 4310, y: 355, width: 235, height: 20},  
    {x: 4715, y: 270, width: 230, height: 20},
    {x: 5135, y: 245, width: 225, height: 20},  
    {x: 5530, y: 340, width: 240, height: 20},  
    {x: 5870, y: 180, width: 150, height: 20}, // CAT NIP PLATFORM

    {x: 6400, y: 300, width: 245, height: 20}, 
    {x: 6820, y: 370, width: 200, height: 20}, 
    {x: 7235, y: 340, width: 235, height: 20},  
    {x: 7670, y: 295, width: 230, height: 20}, 
    {x: 8075, y: 325, width: 240, height: 20},  
    {x: 8900, y: 375, width: 235, height: 20}, 
    {x: 9315, y: 295, width: 230, height: 20},
    {x: 9725, y: 315, width: 225, height: 20}, 
    {x: 10157, y: 278, width: 240, height: 20},
    {x: 10680, y: 210, width: 220, height: 20}, 
    ],
    cups: { enabled: true, count: 15 },



    enemies: {
      cucumbers: { 
        enabled: true,
        spawnRate: 2200,
        damage: 5,
        spawnZones: [
          { start: 3600, end: 4300 },   
          { start: 6000, end: 6500 },   
          { start: 9000, end: 9700 }   
        ]
      },
    rats: { 
      enabled: true,
      spawnRate: 8000,
      
      spawnZones: [
        { start: 3200, end: 4600 },   
        { start: 4900, end: 6700 },   
        { start: 7200, end: 9050 }
      ]
    },
      lasers: { enabled: false }
    },  
    
    
    catnipZones: [
        { x: 5940, y: 80 }],
    items: {
      fishBones: { enabled: true, count: 1 },
      tunaCan: { enabled: true, count: 1 },
      milkBottle: { enabled: false },
      catnip: { enabled: true, count: 1 }
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
    length:  12000,
    playerSpawn: { x: 1000, y: 300 },
    GroundSegments: [
      { x: -1000, y: 440, width: 3000, height: 50 }, 
      { x: 3000, y: 440, width: 1650, height: 50 }, 
      { x: 4550, y: 440, width: 1750, height: 50 }, 
      { x: 6600, y: 440, width: 2100, height: 50 }, 
      { x: 8950, y: 440, width: 2150, height: 50 }, 
      { x: 11350, y: 440, width: 3000, height: 50 } 
],

    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 },
    platforms: [
    {x: 1300, y: 360, width: 220, height: 20},  
    {x: 1750, y: 280, width: 210, height: 20},  
    {x: 2195, y: 315, width: 230, height: 20}, 
    {x: 2635, y: 265, width: 200, height: 20}, 
    {x: 3100, y: 325, width: 230, height: 20}, 
    {x: 3500, y: 170, width: 100, height: 20}, // CATNIP


    {x: 4200, y: 265, width: 190, height: 20}, 
    {x: 4645, y: 290, width: 225, height: 20},  
    {x: 5105, y: 320, width: 220, height: 20}, 
    {x: 5550, y: 375, width: 215, height: 20}, 
    {x: 6005, y: 255, width: 200, height: 20}, 
    {x: 6300, y: 140, width: 150, height: 20}, 
    {x: 6900, y: 300, width: 190, height: 20}, 
    {x: 7355, y: 325, width: 230, height: 20}, 
    {x: 7830, y: 255, width: 200, height: 20},   
    {x: 8275, y: 290, width: 210, height: 20}, 

    {x: 8745, y: 320, width: 150, height: 20},
    
    {x: 9600, y: 345, width: 220, height: 20},  
    {x: 10032, y: 300, width: 200, height: 20},
    {x: 10465, y: 248, width: 200, height: 20}, 
    {x: 10928, y: 205, width: 160, height: 20}, 
  ],
    cups: { enabled: true, count: 15 },


    enemies: {
      cucumbers: { 
        enabled: true,
        spawnRate: 2100,
        damage: 5,
        spawnZones: [
          { start: 3800, end: 4000 },
          { start: 5800, end: 6300 },
          { start: 9200, end: 10800 }
        ]
      },
    rats: { 
      enabled: true,
      spawnRate: 3500,
      spawnZones: [
        { start: 3000, end: 4550 },
        { start: 4550, end: 6700 },
        { start: 6700, end: 8500 },
        { start: 8950, end: 9200 }
      ]
    },

    lasers: { 
      enabled: true,
      positions: [3800, 6400, 9500]
    }
    },


  catnipZones: [
    { x: 3555, y: 125 }, 

  ],
    items: {
      fishBones: { enabled: true, count: 1 },
      tunaCan: { enabled: true, count: 2 },
      milkBottle: { enabled: false },
      catnip: { enabled: true, count: 1 }
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
    length:  12000, 
    playerSpawn: { x: 1000, y: 300 },
    GroundSegments: [
      { x: -1000, y: 440, width: 2600, height: 50 },
      { x: 2600, y: 440, width: 1450, height: 50 },
      { x: 4050, y: 440, width: 450, height: 50 },
      { x: 4500, y: 440, width: 1600, height: 50 },
      { x: 6100, y: 440, width: 1730, height: 50 },
      { x: 8150, y: 440, width: 1500, height: 50 },
      { x: 10000, y: 440, width: 2200, height: 50 },
      { x: 12000, y: 440, width: 3500, height: 50 }
],

    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 },
    platforms: [
    {x: 1300, y: 350, width: 200, height: 20},  
    {x: 1730, y: 270, width: 200, height: 20},  
    {x: 2165, y: 300, width: 190, height: 20},  
    {x: 2590, y: 252, width: 170, height: 20},  
    {x: 3000, y: 320, width: 170, height: 20}, 

    {x: 4200, y: 258, width: 175, height: 20},  
    {x: 4625, y: 285, width: 180, height: 20},  
    {x: 5070, y: 310, width: 190, height: 20},  
    {x: 5525, y: 365, width: 200, height: 20}, 
    {x: 5895, y: 250, width: 165, height: 20}, 
    {x: 6250, y: 165, width: 100, height: 20}, 
    {x: 6550, y: 140, width: 100, height: 20},


    {x: 6900, y: 295, width: 185, height: 20},  
    {x: 7500, y: 320, width: 195, height: 20},  
    {x: 7810, y: 220, width: 170, height: 20},  
    {x: 8265, y: 280, width: 180, height: 20},  
    {x: 8745, y: 310, width: 190, height: 20}, 

    {x: 9600, y: 340, width: 195, height: 20},  
    {x: 10035, y: 290, width: 175, height: 20}, 
    {x: 10475, y: 242, width: 160, height: 20}, 
    {x: 10905, y: 170, width: 150, height: 20}, 

    ],
    cups: { enabled: true, count: 15 },


    enemies: {
        cucumbers: { 
          enabled: true,
          spawnRate: 2000,
          damage: 5,
          spawnZones: [
            { start: 3200, end: 3800 },  
            { start: 5100, end: 5400 },  
            { start: 8900, end: 9200 },   
          ]
        },
    rats: { 
      enabled: true,
      spawnRate: 6000, 
  
      spawnZones: [
        { start: 2600, end: 3950 },    
        { start: 4500, end: 6000 },   
        { start: 6100, end: 7930 },    
        { start: 8100, end: 9500 },    
        { start: 12000, end: 14000 }   
      ]
    },
        lasers: { 
          enabled: true,
          
          positions: [
            3800,   
            5200,  
            7100,  
            10600   
          ]
        }
    },

    catnipZones: [
      { x: 7890, y: 415 }, 
],
    milkBottlePosition: { x: 10980, y: 100 },
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 3 },
      milkBottle: { enabled: true, count: 1 },
      catnip: { enabled: true, count: 1 }
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