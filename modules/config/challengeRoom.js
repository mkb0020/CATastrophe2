/// challengeRoom.js 
export const ROOMS = {  
  room1: { 
    id: 'room1',
    name: 'Room 1',
    length:  7100, 
    playerSpawn: { x: 100, y: 100 }, // WHERE PLAYER HOPS OUT OF THE WINDOW
    playerExit: { x: 6700, y: 220 }, // WHERE THE EXIT WINDOW IS 
    GroundSegments: [
        { x: 0, y: 350, width: 500, height: 50 },  // HIGHER GROUND SO PLAYER HAS TO DROP INTO THE CHALLENGE!
        { x: 6150, y: 350, width: 1000, height: 50 },
    ],
    platforms: [
            { x: 800, y: 410, width: 185, height: 20 },
            { x: 1350, y: 380, width: 185, height: 20 },
            { x: 1900, y: 370, width: 185, height: 20 },
            { x: 2450, y: 400, width: 185, height: 20 },
            { x: 3000, y: 380, width: 185, height: 20 },
            { x: 3550, y: 390, width: 185, height: 20 },
            { x: 4100, y: 410, width: 185, height: 20 },
            { x: 4650, y: 380, width: 185, height: 20 },
            { x: 5200, y: 390, width: 185, height: 20 },
            { x: 5700, y: 360, width: 185, height: 20 },

            { x: 6645, y: 220, width: 100, height: 20 } // WINDOW SILL TO EXIT BACK TO THE LEVEL - NOT CRUMBLING PLATFORM 

  ],
    itemLocation: { x: 6325, y: 250 }, 
    items: {
      newMove: { enabled: true, count: 1 }, // FRAGMENT 1/3
      statsUpgrade: { enabled: false },
    },
    nextState: 'level1',
  },

  room2: { 
    id: 'room2',
    name: 'Room 2',
    length:  7100, 
    playerSpawn: { x: 100, y: 100 }, // WHERE PLAYER HOPS OUT OF THE WINDOW
    playerExit: { x: 6700, y: 220 }, // WHERE THE EXIT WINDOW IS 
    GroundSegments: [
        { x: 0, y: 350, width: 500, height: 50 }, 
        { x: 6150, y: 350, width: 1000, height: 50 },
    ],
    platforms: [
        { x: 800, y: 430, width: 185, height: 20 },
        { x: 1350, y: 400, width: 185, height: 20 },
        { x: 1900, y: 390, width: 185, height: 20 },
        { x: 2450, y: 440, width: 185, height: 20 },
        { x: 3000, y: 400, width: 185, height: 20 },
        { x: 3550, y: 390, width: 185, height: 20 },
        { x: 4100, y: 420, width: 185, height: 20 },
        { x: 4650, y: 390, width: 185, height: 20 },
        { x: 5200, y: 370, width: 185, height: 20 },
        { x: 5700, y: 380, width: 185, height: 20 },

        { x: 6645, y: 220, width: 100, height: 20 } // WINDOW SILL TO EXIT BACK TO THE LEVEL - NOT CRUMBLING PLATFORM 
  ],
    itemLocation: { x: 6325, y: 250 },
    items: {
      newMove: { enabled: false },
      statsUpgrade: { enabled: true, count: 1 },
    },
    nextState: 'level2',
  },

  room3: { 
    id: 'room3',
    name: 'room 3',
    length:  7100, 
    playerSpawn: { x: 100, y: 100 }, // WHERE PLAYER HOPS OUT OF THE WINDOW
    playerExit: { x: 6700, y: 220 }, // WHERE THE EXIT WINDOW IS 
    GroundSegments: [
        { x: 0, y: 350, width: 500, height: 50 },  // HIGHER GROUND SO PLAYER HAS TO DROP INTO THE CHALLENGE!
        { x: 6150, y: 350, width: 1000, height: 50 },
    ],
    platforms: [
        { x: 800, y: 420, width: 185, height: 20 },
        { x: 1350, y: 460, width: 185, height: 20 },
        { x: 1900, y: 400, width: 185, height: 20 },
        { x: 2450, y: 370, width: 185, height: 20 },
        { x: 3000, y: 410, width: 185, height: 20 },
        { x: 3550, y: 440, width: 185, height: 20 },
        { x: 4100, y: 410, width: 185, height: 20 },
        { x: 4650, y: 370, width: 185, height: 20 },
        { x: 5200, y: 450, width: 185, height: 20 },
        { x: 5700, y: 400, width: 185, height: 20 },
        
        { x: 6645, y: 220, width: 100, height: 20 } // WINDOW SILL TO EXIT BACK TO THE LEVEL - NOT CRUMBLING PLATFORM 
  ],
    itemLocation: { x: 6325, y: 250 },
    items: {
      newMove: { enabled: true, count: 1 }, // FRAGMENT 2/3
      statsUpgrade: { enabled: false },
    },
    nextState: 'level3',
  },

  room4: {
    id: 'room4',
    name: 'room 4',
    length:  7100, 
    playerSpawn: { x: 100, y: 100 }, // WHERE PLAYER HOPS OUT OF THE WINDOW
    playerExit: { x: 6700, y: 220 }, // WHERE THE EXIT WINDOW IS 
    GroundSegments: [
        { x: 0, y: 350, width: 500, height: 50 },  // HIGHER GROUND SO PLAYER HAS TO DROP INTO THE CHALLENGE!
        { x: 6150, y: 350, width: 1000, height: 50 },
    ],
    platforms: [
            { x: 800, y: 440, width: 185, height: 20 },
            { x: 1350, y: 400, width: 185, height: 20 },
            { x: 1900, y: 410, width: 185, height: 20 },
            { x: 2450, y: 460, width: 185, height: 20 },
            { x: 3000, y: 430, width: 185, height: 20 },
            { x: 3550, y: 450, width: 185, height: 20 },
            { x: 4100, y: 420, width: 185, height: 20 },
            { x: 4650, y: 470, width: 185, height: 20 },
            { x: 5200, y: 450, width: 185, height: 20 },
            { x: 5700, y: 400, width: 185, height: 20 },

            { x: 6645, y: 220, width: 100, height: 20 } // WINDOW SILL TO EXIT BACK TO THE LEVEL - NOT CRUMBLING PLATFORM 
  ],
    itemLocation: { x: 6325, y: 250 },
    items: {
      newMove: { enabled: false },
      statsUpgrade: { enabled: true, count: 1 },
    },
    nextState: 'level4',
  },

  room5: {
    id: 'room5',
    name: 'room 5',
    length:  7100, 
    playerSpawn: { x: 100, y: 100 }, // WHERE PLAYER HOPS OUT OF THE WINDOW
    playerExit: { x: 6700, y: 220 }, // WHERE THE EXIT WINDOW IS 
    GroundSegments: [
        { x: 0, y: 350, width: 500, height: 50 },  
        { x: 6150, y: 350, width: 1000, height: 50 },
    ],
    platforms: [
        { x: 800, y: 460, width: 185, height: 20 },
        { x: 1350, y: 440, width: 185, height: 20 },
        { x: 1900, y: 470, width: 185, height: 20 },
        { x: 2450, y: 440, width: 185, height: 20 },
        { x: 3000, y: 460, width: 185, height: 20 },
        { x: 3550, y: 430, width: 185, height: 20 },
        { x: 4100, y: 470, width: 185, height: 20 },
        { x: 4650, y: 450, width: 185, height: 20 },
        { x: 5200, y: 470, width: 185, height: 20 },
        { x: 5700, y: 440, width: 185, height: 20 },

        { x: 6645, y: 220, width: 100, height: 20 } // WINDOW SILL TO EXIT BACK TO THE LEVEL - NOT CRUMBLING PLATFORM 


  ],
    itemLocation: { x: 6325, y: 250 },
    items: {
      newMove: { enabled: true, count: 1 }, // FRAGMENT 3/3 
      statsUpgrade: { enabled: false },
    },
    nextState: 'level5',

  }
};

export function getRoom(roomID) {
  return ROOMS[roomID];
}