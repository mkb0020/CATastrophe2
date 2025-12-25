/// levels.js - Clean, organized level configurations
export const LEVELS = {
  level1: { 
    id: 'level1',
    name: 'Level 1',
    timeLimit: 90,
    length: 12000,
    playerSpawn: { x: 1000, y: 300 },
    GroundSegments: [
      {x: -1000, y: 440, width: 5000, height: 50}, 
      {x: 4250, y: 440, width: 2600, height: 50}, 
      {x: 7100, y: 440, width: 2150, height: 50}, 
      {x: 9500, y: 440, width: 6000, height: 50}, 
    ],
    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 },
    platforms: [
    {x: 1300, y: 330, width: 250, height: 12},  
    {x: 1720, y: 300, width: 245, height: 12}, 
    {x: 2145, y: 270, width: 240, height: 12}, 
    {x: 2565, y: 305, width: 235, height: 12}, 
    {x: 2985, y: 280, width: 240, height: 12}, 
    
    {x: 3900, y: 285, width: 240, height: 12}, 
    {x: 4325, y: 315, width: 235, height: 12},
    {x: 4750, y: 345, width: 230, height: 12}, 
    {x: 5180, y: 310, width: 225, height: 12},  
    {x: 5615, y: 275, width: 240, height: 12}, 
    
    {x: 6380, y: 360, width: 245, height: 12},  
    {x: 6815, y: 295, width: 240, height: 12},  
    {x: 7250, y: 325, width: 235, height: 12},  
    {x: 7700, y: 280, width: 230, height: 12}, 
    {x: 8130, y: 310, width: 240, height: 12}, 
    
    {x: 8875, y: 340, width: 235, height: 12},  
    {x: 9310, y: 305, width: 230, height: 12},  
    {x: 9740, y: 270, width: 225, height: 12},  
    {x: 10175, y: 290, width: 240, height: 12}, 
    {x: 10625, y: 220, width: 220, height: 12},
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
    playerHP: { start: 120, max: 120 },
    background: 'level1BG',
    levelMusic: 'PlatformerTrack1',
    nextBoss: 'cupBoss',
    bossSprite: "bossCup", 
  },

  level2: { 
    id: 'level2',
    name: 'Level 2',
    timeLimit: 90,
    length: 12000,
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
    {x: 1300, y: 320, width: 250, height: 12},  
    {x: 1725, y: 285, width: 245, height: 12}, 
    {x: 2150, y: 310, width: 240, height: 12},  
    {x: 2575, y: 270, width: 235, height: 12},  
    {x: 3005, y: 300, width: 240, height: 12}, 

    {x: 3890, y: 280, width: 240, height: 12},  
    {x: 4320, y: 310, width: 235, height: 12},  
    {x: 4755, y: 265, width: 230, height: 12},  
    {x: 5195, y: 290, width: 225, height: 12},  
    {x: 5635, y: 260, width: 240, height: 12}, 

    {x: 6380, y: 340, width: 245, height: 12}, 
    {x: 6825, y: 280, width: 240, height: 12},  
    {x: 7270, y: 305, width: 235, height: 12},  
    {x: 7725, y: 270, width: 230, height: 12}, 
    {x: 8165, y: 295, width: 240, height: 12}, 

    {x: 8880, y: 325, width: 235, height: 12},  
    {x: 9320, y: 285, width: 230, height: 12},  
    {x: 9755, y: 260, width: 225, height: 12},  
    {x: 10195, y: 275, width: 240, height: 12}, 
    {x: 10655, y: 200, width: 220, height: 12}
  ],

    cups: { enabled: true, count: 15 },
    enemies: {
    cucumbers: { 
          enabled: true,
          spawnRate: 2500,
          damage: 5,
          spawnZones: [
            { start: 3190, end: 4200 },  
            { start: 6000, end: 6800 }
          ]
        },
      rats: { enabled: false },

      lasers: { enabled: false }
    },


    milkBottlePosition: { x: 10765, y: 130 },
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 1 },
      milkBottle: { enabled: true, count: 1 },
      catnip: { enabled: false }
    },
    playerHP: { start: 120, max: 120 },
    background: 'l2BG',
    levelMusic: 'PlatformerTrack2',
    nextBoss: 'cucumberBoss',
    bossSprite: "bossCucumber", 

  },

  level3: { 
    id: 'level3',
    name: 'Level 3',
    timeLimit: 90,
    length: 12000,
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
    {x: 1300, y: 340, width: 250, height: 12}, 
    {x: 1715, y: 300, width: 245, height: 12},  
    {x: 2125, y: 355, width: 240, height: 12},  
    {x: 2530, y: 290, width: 235, height: 12},  
    {x: 2945, y: 340, width: 240, height: 12},  
    {x: 3900, y: 320, width: 240, height: 12},  
    {x: 4310, y: 355, width: 235, height: 12},  
    {x: 4715, y: 270, width: 230, height: 12},
    {x: 5135, y: 245, width: 225, height: 12},  
    {x: 5530, y: 315, width: 240, height: 12},  
    {x: 6400, y: 300, width: 245, height: 12},  
    {x: 6820, y: 360, width: 240, height: 12}, 
    {x: 7235, y: 340, width: 235, height: 12},  
    {x: 7670, y: 295, width: 230, height: 12}, 
    {x: 8075, y: 325, width: 240, height: 12},  
    {x: 8900, y: 375, width: 235, height: 12}, 
    {x: 9315, y: 295, width: 230, height: 12},
    {x: 9725, y: 315, width: 225, height: 12}, 
    {x: 10157, y: 278, width: 240, height: 12},
    {x: 10680, y: 180, width: 220, height: 12}, 
    ],
    cups: { enabled: true, count: 15 },



    enemies: {
      cucumbers: { 
        enabled: true,
        spawnRate: 2000,
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
        { x: 4600, y: 270 }, 
        { x: 6900, y: 270 }, 
        { x: 9000, y: 270 } ],
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 2 },
      milkBottle: { enabled: false },
      catnip: { enabled: true, count: 1 }
    },
    playerHP: { start: 120, max: 120 },
    background: 'l3BG',
    levelMusic: 'PlatformerTrack3',
    nextBoss: 'bossRatKing',
    bossSprite: "bossRat", 
  },

  level4: {
    id: 'level4',
    name: 'Level 4',
    timeLimit: 90,
    length: 12000,
    playerSpawn: { x: 1000, y: 300 },
    GroundSegments: [
      { x: -1000, y: 440, width: 3000, height: 50 },
      { x: 3000, y: 440, width: 1650, height: 50 },
      { x: 4550, y: 440, width: 1990, height: 50 },
      { x: 6700, y: 440, width: 2000, height: 50 },
      { x: 8950, y: 440, width: 2150, height: 50 },
      { x: 11350, y: 440, width: 3000, height: 50 }
],

    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 },
    platforms: [
    {x: 1300, y: 360, width: 220, height: 12},  
    {x: 1750, y: 280, width: 210, height: 12},  
    {x: 2195, y: 315, width: 230, height: 12}, 
    {x: 2635, y: 265, width: 200, height: 12}, 
    {x: 3100, y: 330, width: 230, height: 12},  
    {x: 4200, y: 265, width: 190, height: 12}, 
    {x: 4645, y: 290, width: 225, height: 12},  
    {x: 5105, y: 320, width: 220, height: 12}, 
    {x: 5550, y: 375, width: 215, height: 12}, 
    {x: 6005, y: 255, width: 200, height: 12}, 
    {x: 6900, y: 300, width: 190, height: 12}, 
    {x: 7355, y: 325, width: 230, height: 12}, 
    {x: 7830, y: 255, width: 200, height: 12},   
    {x: 8275, y: 290, width: 210, height: 12}, 
    {x: 8745, y: 320, width: 220, height: 12},
    {x: 9600, y: 345, width: 220, height: 12},  
    {x: 10032, y: 300, width: 200, height: 12},
    {x: 10465, y: 248, width: 200, height: 12}, 
    {x: 10928, y: 205, width: 160, height: 12}, 
  ],
    cups: { enabled: true, count: 15 },


    enemies: {
      cucumbers: { 
        enabled: true,
        spawnRate: 1800,
        damage: 5,
        spawnZones: [
          { start: 3300, end: 4000 },
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
        { start: 8950, end: 11350 }
      ]
    },

    lasers: { 
      enabled: true,
      positions: [3800, 6400, 9500]
    }
    },


  catnipZones: [
    { x: 4300, y: 270 }, 
    { x: 6500, y: 270 }, 
    { x: 8800, y: 270 }  
  ],
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 2 },
      milkBottle: { enabled: false },
      catnip: { enabled: true, count: 1 }
    },
    playerHP: { start: 120, max: 120 },
    background: 'l4BG',
    levelMusic: 'PlatformerTrack4',
    nextBoss: 'laserPointerBoss',
    bossSprite: 'bossLaserPointer'
  },

  level5: {
    id: 'level5',
    name: 'Level 5',
    timeLimit: 90,
    length: 12000,
    playerSpawn: { x: 1000, y: 300 },
    GroundSegments: [
      { x: -1000, y: 440, width: 2600, height: 50 },
      { x: 2600, y: 440, width: 1450, height: 50 },
      { x: 4050, y: 440, width: 450, height: 50 },
      { x: 4500, y: 440, width: 1600, height: 50 },
      { x: 6100, y: 440, width: 1730, height: 50 },
      { x: 8100, y: 440, width: 1500, height: 50 },
      { x: 10000, y: 440, width: 2200, height: 50 },
      { x: 12000, y: 440, width: 3500, height: 50 }
],

    groundPlatform: { x: -1000, y: 440, width: 13000, height: 50 },
    platforms: [
    {x: 1300, y: 350, width: 200, height: 12},  
    {x: 1730, y: 270, width: 200, height: 12},  
    {x: 2165, y: 300, width: 190, height: 12},  
    {x: 2610, y: 252, width: 170, height: 12},  
    {x: 3060, y: 285, width: 185, height: 12}, 

    {x: 4200, y: 258, width: 175, height: 12},  
    {x: 4625, y: 285, width: 180, height: 12},  
    {x: 5070, y: 310, width: 190, height: 12},  
    {x: 5525, y: 365, width: 200, height: 12}, 
    {x: 5895, y: 250, width: 165, height: 12}, 

    {x: 6900, y: 295, width: 185, height: 12},  
    {x: 7345, y: 320, width: 195, height: 12},  
    {x: 7810, y: 248, width: 170, height: 12},  
    {x: 8265, y: 280, width: 180, height: 12},  
    {x: 8745, y: 310, width: 190, height: 12}, 

    {x: 9600, y: 340, width: 195, height: 12},  
    {x: 10035, y: 290, width: 175, height: 12}, 
    {x: 10475, y: 242, width: 160, height: 12}, 
    {x: 10905, y: 170, width: 150, height: 12}, 

    //{x:1717,y:324,width:228,height:12},
   // {x:2117,y:210,width:203,height:12},
    //{x:2606,y:282,width:247,height:12},
   // {x:3053,y:308,width:247,height:12},
   // {x:3594,y:359,width:259,height:12},
   // {x:4076,y:240,width:235,height:12},
   // {x:4640,y:300,width:298,height:12},
   // {x:5131,y:311,width:308,height:12},
   // {x:5666,y:339,width:246,height:12},
   // {x:6551,y:321,width:230,height:12},
  //  {x:6975,y:385,width:324,height:12},
   // {x:7484,y:277,width:248,height:12},
  //  {x:7931,y:206,width:256,height:12},
   // {x:8364,y:279,width:246,height:12},
  //  {x:9082,y:322,width:225,height:12},
   // {x:9485,y:194,width:248,height:12},
   // {x:9929,y:221,width:317,height:12},
   // {x:10450,y:304,width:279,height:12}
    ],
    cups: { enabled: true, count: 15 },


    enemies: {
        cucumbers: { 
          enabled: true,
          spawnRate: 1500,
          damage: 5,
          spawnZones: [
            { start: 2900, end: 3800 },  
            { start: 5100, end: 5400 },  
            { start: 6200, end: 7800 },   
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
        { start: 10000, end: 11900 },  
        { start: 12000, end: 14000 }   
      ]
    },
        lasers: { 
          enabled: true,
          
          positions: [
            3800,   
            5200,  
            7100,  
            9300,   
            10600   
          ]
        }
    },

    catnipZones: [
      { x: 3900, y: 270 }, 
      { x: 5950, y: 270 }, 
      { x: 9850, y: 270 } ],
    milkBottlePosition: { x: 10980, y: 100 },
    items: {
      fishBones: { enabled: true, count: 2 },
      tunaCan: { enabled: true, count: 3 },
      milkBottle: { enabled: true, count: 1 },
      catnip: { enabled: true, count: 1 }
    },
    playerHP: { start: 120, max: 120 },
    background: 'l5BG',
    levelMusic: 'PlatformerTrack5',
    nextBoss: 'observerBoss',
    bossSprite: 'observer'

  }
};

export function getLevel(levelId) {
  return LEVELS[levelId];
}