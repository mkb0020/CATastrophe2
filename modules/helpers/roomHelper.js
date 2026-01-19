// roomHelper.js
import { SCREEN_W, SCREEN_H } from '../config/gameConfig.js';
import { getRoom } from '../config/challengeRoom.js';
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
export function setupDoorInteraction(player, doorsIn, levelConfig, levelName, currentData) {
  const promptText = add([
    text("Press UP to enter", { size: 20 }),
    pos(0, 0),
    anchor("center"),
    color(255, 255, 255),
    opacity(0),
    z(100),
    fixed(),
    "doorPrompt"
  ]);
  
  player.onUpdate(() => {
    let nearAnyDoor = false;
    
    doorsIn.forEach(door => {
      const dist = player.pos.dist(door.pos);
      const isNearby = dist < 120;
      
      if (isNearby && !door.playerNearby) {
        door.playerNearby = true;
        door.use(sprite('window', { frame: 1 })); 
        
        promptText.pos = vec2(SCREEN_W / 2, SCREEN_H - 100);
        promptText.opacity = 1;
        nearAnyDoor = true;
        
      } else if (!isNearby && door.playerNearby) {
        door.playerNearby = false;
        door.use(sprite('window', { frame: 0 })); 
      }
      
      if (isNearby) nearAnyDoor = true;
    });
    
    if (!nearAnyDoor) {
      promptText.opacity = 0;
    }
  });
  
  onKeyPress("up", () => {
    doorsIn.forEach(door => {
      if (door.playerNearby) {
        const roomConfig = getRoom(door.roomId);
        
        const returnData = {
          character: currentData.character,
          startHP: player.hp,
          lives: currentData.lives,
          score: currentData.score,
          returnX: levelConfig.challengeDoorOUT.find(d => d.roomId === door.roomId)?.x || levelConfig.playerSpawn.x,
          returnY: levelConfig.challengeDoorOUT.find(d => d.roomId === door.roomId)?.y || levelConfig.playerSpawn.y
        };
        
        transitionToRoom(roomConfig, levelName, returnData);
      }
    });
  });
  
  return promptText;
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
  console.log(`🚪 Returning to ${returnScene}`);
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
    go(returnScene, returnData);
  });
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