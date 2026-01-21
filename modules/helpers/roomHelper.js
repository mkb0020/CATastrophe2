// roomHelper.js
import { SCREEN_W, SCREEN_H } from '../config/gameConfig.js';
import { getRoom, ROOMS } from '../config/challengeRoom.js';
import { setupPauseSystem, stopAllMusic, startChallenegeMusic} from '../helpers/kittyHelpers.js';



// ==================== DOOR CREATION ====================
export function createDoor(x, y, roomId, doorType = 'in') {
  const door = add([
    sprite('window', { frame: 0 }), 
    pos(x, y),
    area({ width: 200, height: 150 }),
    anchor("center"),
    scale(1),
    z(-1),
    {
      roomId: roomId,
      doorType: doorType, // IN OR OUT
      playerNearby: false,
      promptShown: false
    },
    doorType === 'in' ? "doorIn" : "doorOut"
  ]);
  
  return door;
}

// ==================== DOOR INTERACTION DETECTION ====================
export function setupDoorInteraction(player, doors, levelConfig, levelId, getGameData) {
  console.log('🔧 Setting up door interactions for', doors.length, 'doors');
  
  doors.forEach((door, index) => {
    const doorConfig = door.doorConfig;
    const doorObj = door.doorObj;
    
    console.log(`🚪 Door ${index}:`, {
      doorConfig,
      doorObjExists: doorObj.exists(),
      doorPos: doorObj.pos
    });
    
    const prompt = add([
      text("Press UP to enter", { size: 20 }),
      pos(0, 0),
      anchor("center"),
      color(255, 255, 255),
      opacity(0),
      z(100),
      fixed(),
      `doorPrompt_${index}`
    ]);
    
    let playerNear = false;
    let windowOpen = false; 
    
    player.onUpdate(() => {
      if (!doorObj.exists()) return;
      
      const dist = player.pos.dist(doorObj.pos);
      const isNear = dist < 100;
      
      if (Math.floor(time()) % 2 === 0 && dist < 200) {
        console.log(`📏 Distance to door ${index}: ${dist.toFixed(0)}`);
      }
      
      if (isNear && !playerNear) {
        playerNear = true;
        console.log('✅ Player near door!');
        
        if (!windowOpen) {
          windowOpen = true;
          doorObj.use(sprite('window', { frame: 1 })); 
          console.log('🪟 Window opened!');
        }
        
        prompt.pos = vec2(doorObj.pos.x, doorObj.pos.y - 80);
        prompt.opacity = 1;
      } else if (!isNear && playerNear) {
        playerNear = false;
        console.log('❌ Player left door area');
        
        if (windowOpen) {
          windowOpen = false;
          doorObj.use(sprite('window', { frame: 0 })); 
          console.log('🪟 Window closed!');
        }
        
        prompt.opacity = 0;
      }
    });
    
    onKeyPress("up", () => {
      if (playerNear) {
        console.log('🚪 Entering door!');
        console.log('Door config:', doorConfig);
        console.log('Target room ID:', doorConfig.roomId);
        
        const gameData = getGameData();
        
        const roomConfig = ROOMS[doorConfig.roomId] || getRoom(doorConfig.roomId);
        
        console.log('Room config found:', roomConfig);
        
        if (!roomConfig) {
          console.error('❌ Room not found:', doorConfig.roomId);
          console.error('Available rooms:', Object.keys(ROOMS));
          return;
        }
        
        const returnData = {
          character: gameData.character,
          startHP: player.hp,
          lives: gameData.lives,
          score: gameData.score,
          timeLeft: gameData.timeLeft,
          returnX: doorConfig.returnX,  
          returnY: doorConfig.returnY   
        };
        
        console.log('📦 Return data:', returnData);
        
        go("challengeRoom", {
          roomConfig: roomConfig,
          returnScene: levelId,  
          returnData: returnData
        });
      }
    });
  });
}

// ==================== ROOM TRANSITION ====================
export function transitionToRoom(roomConfig, returnScene, returnData) {
  console.log(`🚪 Entering ${roomConfig.name}`);
  console.log('📦 Return data:', returnData);
  
  const transition = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0),
    z(200),
    fixed()
  ]);
  
  tween(transition.opacity, 1, 0.3, (val) => transition.opacity = val, easings.easeInQuad);
  
  wait(0.4, () => {
    go("challengeRoom", {
      roomConfig: roomConfig,
      returnScene: returnScene,
      returnData: returnData
    });
  });
}

// ==================== RETURN TO LEVEL ==================== 
export function returnToLevel(returnScene, returnData) {
  console.log('🔙 Returning to level:', returnScene);
  console.log('📦 Full return data:', returnData);
  
  const completeData = {
    character: returnData.character,
    startHP: returnData.startHP,
    lives: returnData.lives,
    score: returnData.score || 0,
    timeLeft: returnData.timeLeft, 
    returnX: returnData.returnX, 
    returnY: returnData.returnY   
  };
  
  console.log('✅ Complete data being passed:', completeData);
  
  go(returnScene, completeData);
}

// ==================== ADD DOORS TO LEVEL ====================
export function addDoorsToLevel(levelConfig) {
  const doorsIn = [];
  const doorsOut = [];
  
  if (levelConfig.challengeDoorIN) {
    levelConfig.challengeDoorIN.forEach(doorConfig => {
      const door = createDoor(
        doorConfig.x, 
        doorConfig.y, 
        doorConfig.roomId, 
        'in'
      );
      doorsIn.push(door);
    });
  }
  
 
  if (levelConfig.challengeDoorOUT) {
    levelConfig.challengeDoorOUT.forEach(doorConfig => {
      const door = add([
        sprite('window', { frame: 1 }), 
        pos(doorConfig.x, doorConfig.y),
        scale(1),
        z(-1),
        {
          roomId: doorConfig.roomId,
          doorType: 'out'
        },
        "doorOut"
      ]);
      doorsOut.push(door);
    });
  }
  
  return { doorsIn, doorsOut };
}