/// challengeRoom.js 
export const ROOMS = {  
  room1: { 
    id: 'room1',
    name: 'Room 1',
    length:  7000, 
    playerSpawn: { x: 150, y: 150 }, // WHERE PLAYER HOPS OUT OF THE WINDOW
    playerExit: { x: 6800, y: 250 }, // WHERE THE EXIT WINDOW IS - MAY NEED TO ADJUST
    GroundSegments: [
        { x: 0, y: 350, width: 500, height: 50 },  // HIGHER GROUND SO PLAYER HAS TO DROP INTO THE CHALLENGE!
        { x: 6150, y: 350, width: 1000, height: 50 },
    ],
    platforms: [
            { x: 800, y: 410, width: 200, height: 20 },
            { x: 1350, y: 380, width: 200, height: 20 },
            { x: 1900, y: 370, width: 200, height: 20 },
            { x: 2450, y: 400, width: 200, height: 20 },
            { x: 3000, y: 380, width: 200, height: 20 },
            { x: 3550, y: 390, width: 200, height: 20 },
            { x: 4100, y: 410, width: 200, height: 20 },
            { x: 4650, y: 380, width: 200, height: 20 },
            { x: 5200, y: 390, width: 200, height: 20 },
            { x: 5700, y: 360, width: 200, height: 20 },

            { x: 6800, y: 250, width: 1000, height: 50 } // WINDOW SILL TO EXIT BACK TO THE LEVEL - NOT CRUMBLING PLATFORM  - MAY NEED TO ADJUST

  ],
    itemLocation: { x: 6500, y: 300 }, // MAY NEED TO ADJUST
    items: {
      newMove: { enabled: true, count: 1 }, // YOU HAVE TO COLLECT 3 OF THESE TO UNLOCK THE NEW MOVE - THEY'RE IN LEVELS 1, 3, AND 5
      statsUpgrade: { enabled: false },
    },
    roomMusic: play("menuMusic", {  // PLACEHOLDER
                volume: window.isMuted ? 0 : 0.7, 
                loop: true 
                }), 
    nextState: 'level1',
  },

  room2: { 
    id: 'room2',
    name: 'Room 2',
    length:  7000, 
    playerSpawn: { x: 150, y: 150 }, // WHERE PLAYER HOPS OUT OF THE WINDOW
    playerExit: { x: 6800, y: 250 }, // WHERE THE EXIT WINDOW IS - MAY NEED TO ADJUST
    GroundSegments: [
        { x: 0, y: 350, width: 500, height: 50 },  // HIGHER GROUND SO PLAYER HAS TO DROP INTO THE CHALLENGE!
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

        { x: 6800, y: 250, width: 1000, height: 50 } // WINDOW SILL TO EXIT BACK TO THE LEVEL - NOT CRUMBLING PLATFORM  - MAY NEED TO ADJUST


  ],
    itemLocation: { x: 6500, y: 300 }, // MAY NEED TO ADJUST
    items: {
      newMove: { enabled: false },
      statsUpgrade: { enabled: true, count: 1 },
    },
    roomMusic: play("menuMusic", {  // PLACEHOLDER
                volume: window.isMuted ? 0 : 0.7, 
                loop: true 
                }), 
    nextState: 'level2',
  },

  room3: { 
    id: 'room3',
    name: 'room 3',
    length:  7000, 
    playerSpawn: { x: 150, y: 150 }, // WHERE PLAYER HOPS OUT OF THE WINDOW
    playerExit: { x: 6800, y: 250 }, // WHERE THE EXIT WINDOW IS - MAY NEED TO ADJUST
    GroundSegments: [
        { x: 0, y: 350, width: 500, height: 50 },  // HIGHER GROUND SO PLAYER HAS TO DROP INTO THE CHALLENGE!
        { x: 6150, y: 350, width: 1000, height: 50 },
    ],
    platforms: [
        { x: 800, y: 420, width: 165, height: 20 },
        { x: 1350, y: 460, width: 165, height: 20 },
        { x: 1900, y: 400, width: 165, height: 20 },
        { x: 2450, y: 370, width: 165, height: 20 },
        { x: 3000, y: 410, width: 165, height: 20 },
        { x: 3550, y: 440, width: 165, height: 20 },
        { x: 4100, y: 410, width: 165, height: 20 },
        { x: 4650, y: 370, width: 165, height: 20 },
        { x: 5200, y: 450, width: 165, height: 20 },
        { x: 5700, y: 400, width: 165, height: 20 },
        
        { x: 6800, y: 250, width: 1000, height: 50 } // WINDOW SILL TO EXIT BACK TO THE LEVEL - NOT CRUMBLING PLATFORM  - MAY NEED TO ADJUST


  ],
    itemLocation: { x: 6500, y: 300 }, // MAY NEED TO ADJUST
    items: {
      newMove: { enabled: true, count: 1 }, // YOU HAVE TO COLLECT 3 OF THESE TO UNLOCK THE NEW MOVE - THEY'RE IN LEVELS 1, 3, AND 5
      statsUpgrade: { enabled: false },
    },
    roomMusic: play("menuMusic", {  // PLACEHOLDER
                volume: window.isMuted ? 0 : 0.7, 
                loop: true 
                }), 
    nextState: 'level3',
  },

  room4: {
    id: 'room4',
    name: 'room 4',
    length:  7000, 
    playerSpawn: { x: 150, y: 150 }, // WHERE PLAYER HOPS OUT OF THE WINDOW
    playerExit: { x: 6800, y: 250 }, // WHERE THE EXIT WINDOW IS - MAY NEED TO ADJUST
    GroundSegments: [
        { x: 0, y: 350, width: 500, height: 50 },  // HIGHER GROUND SO PLAYER HAS TO DROP INTO THE CHALLENGE!
        { x: 6150, y: 350, width: 1000, height: 50 },
    ],
    platforms: [
            { x: 800, y: 440, width: 135, height: 20 },
            { x: 1350, y: 400, width: 135, height: 20 },
            { x: 1900, y: 410, width: 135, height: 20 },
            { x: 2450, y: 460, width: 135, height: 20 },
            { x: 3000, y: 430, width: 135, height: 20 },
            { x: 3550, y: 450, width: 135, height: 20 },
            { x: 4100, y: 420, width: 135, height: 20 },
            { x: 4650, y: 470, width: 135, height: 20 },
            { x: 5200, y: 450, width: 135, height: 20 },
            { x: 5700, y: 400, width: 135, height: 20 },


            { x: 6800, y: 250, width: 1000, height: 50 } // WINDOW SILL TO EXIT BACK TO THE LEVEL - NOT CRUMBLING PLATFORM  - MAY NEED TO ADJUST

  ],
    itemLocation: { x: 6500, y: 300 }, // MAY NEED TO ADJUST
    items: {
      newMove: { enabled: false },
      statsUpgrade: { enabled: true, count: 1 },
    },
    roomMusic: play("menuMusic", {  // PLACEHOLDER
                volume: window.isMuted ? 0 : 0.7, 
                loop: true 
                }), 
    nextState: 'level4',
  },

  room5: {
    id: 'room5',
    name: 'room 5',
    length:  7000, 
    playerSpawn: { x: 150, y: 150 }, // WHERE PLAYER HOPS OUT OF THE WINDOW
    playerExit: { x: 6800, y: 250 }, // WHERE THE EXIT WINDOW IS - MAY NEED TO ADJUST
    GroundSegments: [
        { x: 0, y: 350, width: 500, height: 50 },  // HIGHER GROUND SO PLAYER HAS TO DROP INTO THE CHALLENGE!
        { x: 6150, y: 350, width: 1000, height: 50 },
    ],
    platforms: [
        { x: 800, y: 460, width: 120, height: 20 },
        { x: 1350, y: 440, width: 120, height: 20 },
        { x: 1900, y: 470, width: 120, height: 20 },
        { x: 2450, y: 440, width: 120, height: 20 },
        { x: 3000, y: 460, width: 120, height: 20 },
        { x: 3550, y: 430, width: 120, height: 20 },
        { x: 4100, y: 470, width: 120, height: 20 },
        { x: 4650, y: 450, width: 120, height: 20 },
        { x: 5200, y: 470, width: 120, height: 20 },
        { x: 5700, y: 440, width: 120, height: 20 },

        { x: 6800, y: 250, width: 1000, height: 50 } // WINDOW SILL TO EXIT BACK TO THE LEVEL - NOT CRUMBLING PLATFORM  - MAY NEED TO ADJUST


  ],
    itemLocation: { x: 6500, y: 300 }, // MAY NEED TO ADJUST
    items: {
      newMove: { enabled: true, count: 1 }, // YOU HAVE TO COLLECT 3 OF THESE TO UNLOCK THE NEW MOVE - THEY'RE IN LEVELS 1, 3, AND 5
      statsUpgrade: { enabled: false },
    },
    roomMusic: play("menuMusic", {  // PLACEHOLDER
                volume: window.isMuted ? 0 : 0.7, 
                loop: true 
                }), 
    nextState: 'level5',

  }
};

export function getRoom(roomID) {
  return ROOMS[roomID];
}