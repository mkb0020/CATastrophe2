// specialItems.js

// EXPORTS: 
// addCups() - Spawn collectible cups
// setupCupCollection() - Handle cup collection
// addSpecialItems() - Spawn fish, tuna, milk, catnip, eggs
// setupSpecialItemCollection() - Handle item pickups
// spawnRewardItems() - Spawn reward drops (after boss defeat)

//==================================== IMPORTS ====================================
import { SCREEN_W, BUBBLE_FRAMES } from '../config/gameConfig.js';

//==================================== CUPS ====================================
export function addCups(levelConfig) {
  if (!levelConfig.cups.enabled) return new Set();
  
  const totalCups = levelConfig.cups.count;
  const platforms = levelConfig.platforms;
  
  const isInNoStuffZone = (platform) => {
    if (!levelConfig.noStuffZones) return false;
    const platformCenter = platform.x + (platform.width / 2);
    return levelConfig.noStuffZones.some(zone => 
      platformCenter >= zone.start && platformCenter <= zone.end
    );
  };
  
  const platformsWithCups = new Set();
  const eligibleIndices = platforms
    .map((platform, i) => ({ platform, index: i }))
    .filter(({ platform }) => !isInNoStuffZone(platform))
    .map(({ index }) => index);
  
  const shuffledIndices = eligibleIndices.sort(() => Math.random() - 0.5);
  let cupsPlaced = 0;
  
  const cupData = [];
  
  for (let idx of shuffledIndices) {
    if (cupsPlaced >= totalCups) break;
    
    const platform = platforms[idx];
    const x = platform.x + (platform.width / 2);
    const y = platform.y - 44;
    
    cupData.push({ x, y, spawned: false });
    cupsPlaced++;
    platformsWithCups.add(idx);
  }
  
  onUpdate(() => {
    const camX = camPos().x;
    const spawnDistance = SCREEN_W * 1.5; 
    
    cupData.forEach(cup => {
      const distFromCam = Math.abs(cup.x - camX);
      
      if (!cup.spawned && distFromCam < spawnDistance) {
        cup.spawned = true;
        add([
          sprite('cup'),
          pos(cup.x, cup.y),
          area({ width: 40, height: 50 }),
          anchor("center"),
          scale(1.2),
          rotate(0),
          {
            hasBeenKnocked: false,
            rotationSpeed: 0,
            fallSpeed: 0,
            points: 10
          },
          "cup"
        ]);
      }
    });
  });
  
  return platformsWithCups;
}

export function setupCupCollection(player, scoreGetter, scoreSetter) {
  player.onCollide("cup", (cup) => {
    if (!cup.hasBeenKnocked) {
      cup.hasBeenKnocked = true;
      cup.rotationSpeed = rand(-360, 360);
      cup.fallSpeed = 200;
      cup.z = 3;
      
      scoreSetter(scoreGetter() + cup.points);
      play("collectCup", { volume: 0.2 });
      
      cup.onUpdate(() => {
         //if (window.debugCounts) window.debugCounts.cups++; 

        cup.fallSpeed += 600 * dt();
        cup.pos.y += cup.fallSpeed * dt();
        cup.angle += cup.rotationSpeed * dt();
        
        if (cup.pos.y > 600) {
          destroy(cup);
        }
      });
    }
  });
}

//==================================== SPECIAL ITEMS ====================================
export function addSpecialItems(levelConfig, platformsWithCups = new Set()) {
  const isInNoStuffZone = (platform) => { // noStuffZone CHECKER
    if (!levelConfig.noStuffZones) return false;
    const platformCenter = platform.x + (platform.width / 2);
    return levelConfig.noStuffZones.some(zone => 
      platformCenter >= zone.start && platformCenter <= zone.end
    );
  };


  const eligiblePlatforms = levelConfig.platforms  // PLATFORM FILTER - WIDE ENOUGH, NO CUPS, NOT IN noStuffZone
    .map((p, index) => ({ platform: p, index }))
    .filter(({ platform, index }) => 
      platform.width >= 150 && 
      !platformsWithCups.has(index) &&
      !isInNoStuffZone(platform)
    );
  
  if (eligiblePlatforms.length === 0) {
    console.warn("No eligible platforms for special items!");
    return;
  }
  
  const usedPlatforms = new Set(); // TRACK USED PLATFORMS
  
 
  if (levelConfig.items.fishBones.enabled) { // FISHBONES
    const count = levelConfig.items.fishBones.count;
    
    for (let i = 0; i < Math.min(count, eligiblePlatforms.length); i++) {
      let platformObj;
      let attempts = 0;
      do {
        platformObj = choose(eligiblePlatforms);
        attempts++;
      } while (usedPlatforms.has(platformObj) && attempts < 50);
      
      if (attempts >= 50) break; // FALLBACK
      
      usedPlatforms.add(platformObj);
      
      const x = platformObj.platform.x + rand(50, platformObj.platform.width - 50);
      const y = platformObj.platform.y - 70;
      
      add([
        sprite('fish'),
        pos(x, y),
        area({ width: 50, height: 50 }),
        anchor("center"),
        scale(1),
        "fishBones"
      ]);
    }
  }
  

  if (levelConfig.items.tunaCan.enabled) { // TUNA
    const count = levelConfig.items.tunaCan.count;
    
    for (let i = 0; i < Math.min(count, eligiblePlatforms.length); i++) {
      let platformObj;
      let attempts = 0;
      do {
        platformObj = choose(eligiblePlatforms);
        attempts++;
      } while (usedPlatforms.has(platformObj) && attempts < 50);
      
      if (attempts >= 50) break;
      
      usedPlatforms.add(platformObj);
      
      const x = platformObj.platform.x + rand(50, platformObj.platform.width - 50);
      const y = platformObj.platform.y - 70;
      
      add([
        sprite('tunaCan'),
        pos(x, y),
        area({ width: 50, height: 50 }),
        anchor("center"),
        scale(0.6),
        "tunaCan"
      ]);
    }
  }
  
 
  if (levelConfig.items.milkBottle.enabled && levelConfig.milkBottlePosition) { // MILK
    add([
      sprite('milkBottle'),
      pos(levelConfig.milkBottlePosition.x, levelConfig.milkBottlePosition.y),
      area({ width: 50, height: 50 }),
      anchor("center"),
      scale(0.6),
      "milkBottle"
    ]);
  }
  

  if (levelConfig.items.catnip.enabled && levelConfig.catnipZones) { // CATNIP
    const zone = choose(levelConfig.catnipZones); 
    add([
      sprite('catnip'),
      pos(zone.x, zone.y),
      area({ width: 50, height: 50 }),
      anchor("center"),
      scale(0.6),
      "catnip"
    ]);
  }
  
 
  if (levelConfig.items.bonusHP.enabled && levelConfig.bonusHPZone) { // EGG
    const zone = choose(levelConfig.bonusHPZone);
    add([
      sprite('egg'),
      pos(zone.x, zone.y),
      area({ width: 50, height: 50 }),
      anchor("center"),
      scale(0.8),
      "bonusHP"
    ]);
  }
}

export function setupSpecialItemCollection(player, livesGetter, livesSetter, scoreGetter, scoreSetter) {
 
  function showBubble(bubbleFrame) {
    const bubble = add([
      sprite('bubbles', { frame: bubbleFrame }),
      pos(player.pos.x + 160, player.pos.y - 20), 
      anchor("center"),
      z(100), 
      opacity(0),
      scale(3),
      "bubble"
    ]);
    
    tween(bubble.opacity, 1, 0.2, (val) => bubble.opacity = val);
    tween(bubble.scale.x, 1, 0.3, (val) => { bubble.scale.x = val; bubble.scale.y = val; });
    
    tween(bubble.pos.y, bubble.pos.y - 20, 1, (val) => bubble.pos.y = val);
    
    wait(1, () => {
      tween(bubble.opacity, 0, 0.3, (val) => bubble.opacity = val, easings.easeInQuad);
      wait(0.3, () => destroy(bubble));
    });
  }

  player.onCollide("fishBones", (item) => { // FISH BONES
    destroy(item);
    scoreSetter(scoreGetter() + 25); 
    play("happyMeow", { volume: 0.3 });
    showBubble(BUBBLE_FRAMES.heart);
  });
  
  player.onCollide("tunaCan", (item) => {
    console.log("🥫 TUNA COLLECTED - HP before:", player.hp, "Max:", player.maxHP);
    destroy(item);
    const healAmount = 25;
    player.hp = Math.min(player.hp + healAmount, player.maxHP);
    console.log("🥫 HP after:", player.hp);
    play("powerUp", { volume: 0.3 });
    showBubble(BUBBLE_FRAMES.plusHP);
  });
  
  player.onCollide("milkBottle", (item) => {
    destroy(item);
    livesSetter(livesGetter() + 1);
    play("extraLife", { volume: 0.4 });
    showBubble(BUBBLE_FRAMES.heart);
  });
  
  player.onCollide("catnip", (item) => {
    destroy(item);
    player.catnipActive = true;
    player.invulnerable = true;
    player.speed = player.baseSpeed * 1.2;
    
    player.rainbowActive = true;
    showBubble(BUBBLE_FRAMES.heart);

    wait(15, () => {
      player.catnipActive = false;
      player.invulnerable = false;
      player.speed = player.baseSpeed;
      player.rainbowActive = false;

      player.curState = null;
    });
  });
  

  player.onCollide("bonusHP", (item) => { // EGG
    console.log("🥚 BONUS HP COLLECTED - HP before:", player.hp, "Max:", player.maxHP);
    destroy(item);
    const healAmount = 50;
    player.hp = Math.min(player.hp + healAmount, player.maxHP);
    console.log("🥚 HP after:", player.hp);
    play("egg", { volume: 0.5 });
    showBubble(BUBBLE_FRAMES.plusHP); 
  });
}

//==================================== REWARD ITEMS ====================================
export function spawnRewardItems(positions) {
  positions.forEach(position => {
    if (position.type === 'egg') {
      add([
        sprite('egg'),
        pos(position.x, position.y),
        area({ width: 50, height: 50 }),
        anchor("center"),
        scale(0),
        z(15),
        "bonusHP"
      ]);
      
      const egg = get("bonusHP")[get("bonusHP").length - 1];
      tween(0, 0.8, 0.5, (val) => {
        egg.scale = vec2(val, val);
      }, easings.easeOutBack);
      
    } else if (position.type === 'milk') {
      add([
        sprite('milkBottle'),
        pos(position.x, position.y),
        area({ width: 50, height: 50 }),
        anchor("center"),
        scale(0),
        z(15),
        "milkBottle"
      ]);
      
      const milk = get("milkBottle")[get("milkBottle").length - 1];
      wait(0.2, () => {
        tween(0, 0.6, 0.5, (val) => {
          milk.scale = vec2(val, val);
        }, easings.easeOutBack);
      });
    }
  });
}