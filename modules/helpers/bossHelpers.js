// bossHelpers.js - BOSS BATTLE SETUP AND ANIMATIONS
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { stopAllMusic, startBossMusic, startAtmosphere } from '../helpers/kittyHelpers.js';
import { rainbowCat, SPRITE_FRAMES } from '../config/characters.js';


export function setupBossMusic() {
  startBossMusic();
}



export function addBossBackground(bossConfig) {
  add([
    sprite(bossConfig.background),
    pos(0, 0),
    scale(SCREEN_W / 1000, SCREEN_H / 480),
    opacity(1),
    z(0)
  ]);




}

export function addBattleSprites(character, bossConfig) {
  const prefix = character.name; 

  const playerSprite = add([
    sprite(`${prefix}Sheet`, { frame: SPRITE_FRAMES.battle }),
    pos(245, 265),
    anchor("center"),
    scale(1.1),
    opacity(1),
    z(1),
    "playerSprite"
  ]);
  
  const bossSprite = add([
    sprite(bossConfig.sprite),
    pos(740, 120),
    anchor("center"),
    scale(1),
    opacity(1),
    z(1),
    "bossSprite"
  ]);

  return { playerSprite, bossSprite };
}

export function addPlayerHPPanel(player) {
  const nameEl = document.getElementById('playerName');
  const hpText = document.getElementById('playerHPText');
  const hpBarFill = document.getElementById('playerHPBarFill');
  
  if (nameEl) nameEl.textContent = player.name;
  if (hpText) hpText.textContent = `${player.hp} / ${player.maxHP}`;
  if (hpBarFill) hpBarFill.style.width = '100%';
  
  console.log('✅ Player HP panel initialized in HTML');
  
  return { 
    playerHPBar: hpBarFill, 
    playerHPText: hpText 
  };
}

export function addBossHPPanel(boss) {
  const nameEl = document.getElementById('bossName');
  const hpText = document.getElementById('bossHPText');
  const hpBarFill = document.getElementById('bossHPBarFill');
  
  if (nameEl) nameEl.textContent = boss.name;
  if (hpText) hpText.textContent = `${boss.hp} / ${boss.maxHP}`;
  if (hpBarFill) hpBarFill.style.width = '100%';
  
  console.log('✅ Boss HP panel initialized in HTML');
  
  return { 
    bossHPBar: hpBarFill, 
    bossHPText: hpText 
  };
}

export function addBattleLogPanel(initialMessage) {
  const logText = document.getElementById('battleLogText');
  
  if (logText) {
    logText.textContent = initialMessage;
  }
  
  console.log('✅ Battle log initialized in HTML');
  
  return logText;
}

export function addMoveButtonsPanel() {
  add([
    rect(410, 115, { radius: 15 }),
    pos(570, 355),
    color(rgb(144,144,192)),
    opacity(0),
    outline(1, rgb(42,52,57)),
    z(9)
  ]);

  add([
    rect(405, 110, { radius: 15 }),
    pos(570, 355),
    color(255,255,255),
    opacity(0),
    z(10)
  ]);
}

export function createMoveButtons(player, onMoveClick, gameStateGetter) {
  const container = document.getElementById('moveButtonsPanel');
  if (!container) {
    console.error('❌ Move buttons container not found in HTML!');
    return [];
  }
  
  container.innerHTML = '';
   container.style.display = 'grid';

  
  const moveButtons = [];
  const moveNames = Object.keys(player.moves);
  
  moveNames.forEach((moveName, i) => {
    const moveData = player.moves[moveName];
    
    const btn = document.createElement('button');
    btn.className = 'battle-move-btn';
    btn.dataset.index = i;
    btn.dataset.moveName = moveName;
    
    btn.innerHTML = `
      <span class="move-name">${moveName}</span>
      <span class="move-uses">(${moveData.uses})</span>
    `;
    
    btn.disabled = moveData.uses <= 0;
    if (moveData.uses > 0) {
      btn.classList.add('ready');
    }
    
    btn.addEventListener('click', () => {
      if (gameStateGetter() && !btn.disabled) {
        console.log('🎯 Move clicked:', moveName);
        onMoveClick(moveName);
      }
    });
    
    container.appendChild(btn);
    
    moveButtons.push({
      btn: btn,
      moveName: moveName,
      moveData: moveData
    });
  });
  
  console.log('✅ Created', moveButtons.length, 'HTML move buttons');
  return moveButtons;
}

export function updateHPBars(player, boss, playerHPBar, playerHPText, bossHPBar, bossHPText) {
  const currentHP = parseInt(player.hp) || 0;
  const maxHP = parseInt(player.maxHP) || 1;
  const hpPercent = currentHP / maxHP;
  
  if (playerHPBar) playerHPBar.style.width = `${hpPercent * 100}%`;
  if (playerHPText) playerHPText.textContent = `${currentHP} / ${maxHP}`;
  
  const bossCurrentHP = parseInt(boss.hp) || 0;
  const bossMaxHP = parseInt(boss.maxHP) || 1;
  const bossHPPercent = bossCurrentHP / bossMaxHP;
  
  if (bossHPBar) bossHPBar.style.width = `${bossHPPercent * 100}%`;
  if (bossHPText) bossHPText.textContent = `${bossCurrentHP} / ${bossMaxHP}`;
}

export function updateMoveButtons(moveButtons, player) {
  moveButtons.forEach(({ btn, moveName }) => {
    const move = player.moves[moveName];
    
    const usesSpan = btn.querySelector('.move-uses');
    if (usesSpan) {
      usesSpan.textContent = `(${move.uses})`;
    }
    
    btn.disabled = move.uses <= 0;
    
    if (move.uses > 0) {
      btn.classList.add('ready');
    } else {
      btn.classList.remove('ready');
    }
  });
}


export function hideMoveButtons(moveButtons) {
  const container = document.getElementById('moveButtonsPanel');
  if (container) {
    container.style.display = 'none';
  }
  
  moveButtons.forEach(({ btn }) => {
    btn.style.display = 'none';
  });
}


export function showMoveButtons(moveButtons) {
  const container = document.getElementById('moveButtonsPanel');
  if (container) {
    container.style.display = 'grid';
  }
  
  moveButtons.forEach(({ btn }) => {
    btn.style.display = '';
  });
}


export function hideBattleUI(duration = 0.3) {
  const bossHPPanel = document.getElementById('bossHPPanel');
  const playerHPPanel = document.getElementById('playerHPPanel');
  const battleLogPanel = document.getElementById('battleLogPanel');
  
  [bossHPPanel, playerHPPanel, battleLogPanel].forEach(panel => {
    if (panel) {
      panel.style.transition = `opacity ${duration}s ease-out`;
      panel.style.opacity = '0';
      
      setTimeout(() => {
        panel.style.display = 'none';
      }, duration * 1000);
    }
  });
  
  console.log('👻 Battle UI fading out for FINISH HIM');
}

export function showBattleUI(duration = 0.3) {
  const bossHPPanel = document.getElementById('bossHPPanel');
  const playerHPPanel = document.getElementById('playerHPPanel');
  const battleLogPanel = document.getElementById('battleLogPanel');
  
  [bossHPPanel, playerHPPanel, battleLogPanel].forEach(panel => {
    if (panel) {
      panel.style.display = 'block';
      panel.style.opacity = '0';
      panel.style.transition = `opacity ${duration}s ease-in`;
      
      setTimeout(() => {
        panel.style.opacity = '1';
      }, 10);
    }
  });
  
  console.log('✅ Battle UI fading in');
}

// ================================================== ANIMATIONS ==================================================
export function animateAttack(sprite, isPlayer) {
  const originalX = sprite.pos.x;
  const slideDistance = isPlayer ? 100 : -100;
  
  tween(
    sprite.pos.x,
    originalX + slideDistance,
    0.2,
    (val) => {
      sprite.pos.x = val;
    },
    easings.easeOutQuad
  ).then(() => {
    tween(
      sprite.pos.x,
      originalX,
      0.2,
      (val) => {
        sprite.pos.x = val;
      },
      easings.easeInQuad
    );
  });
}

export function animateHit(sprite) {
  const originalX = sprite.pos.x;
  const shakeAmount = 10;
  const shakeDuration = 0.05;
  
  tween(sprite.pos.x, originalX - shakeAmount, shakeDuration, (val) => {
    sprite.pos.x = val;
  })
    .then(() => tween(sprite.pos.x, originalX + shakeAmount, shakeDuration, (val) => {
      sprite.pos.x = val;
    }))
    .then(() => tween(sprite.pos.x, originalX - shakeAmount, shakeDuration, (val) => {
      sprite.pos.x = val;
    }))
    .then(() => tween(sprite.pos.x, originalX + shakeAmount, shakeDuration, (val) => {
      sprite.pos.x = val;
    }))
    .then(() => tween(sprite.pos.x, originalX, shakeDuration, (val) => {
      sprite.pos.x = val;
    }));
}

export function animateHeal(sprite) {
  tween(sprite.opacity, 0.3, 0.3, (val) => {
    sprite.opacity = val;
  })
    .then(() => tween(sprite.opacity, 1, 0.3, (val) => {
      sprite.opacity = val;
    }))
    .then(() => tween(sprite.opacity, 0.3, 0.3, (val) => {
      sprite.opacity = val;
    }))
    .then(() => tween(sprite.opacity, 1, 0.3, (val) => {
      sprite.opacity = val;
    }));
}

export function animateDefeat(sprite, isPlayer) {
  const slideDirection = isPlayer ? -300 : 300;
  const targetX = sprite.pos.x + slideDirection;
  
  tween(
    sprite.opacity,
    0,
    1.0,
    (val) => {
      sprite.opacity = val;
    },
    easings.easeInQuad
  );
  
  tween(
    sprite.pos.x,
    targetX,
    1.0,
    (val) => {
      sprite.pos.x = val;
    },
    easings.easeInQuad
  );
}

// ================================= FANCY  ANIMATIONS ===========================================
// ========================= GENERAL =========================
export function animateKaBAM(target) {
  shake(40);
  const kabam = add([
    sprite("bam", { anim: "burst" }),
    pos(target.pos),
    scale(10),
    anchor("center"),
    z(40),
    opacity(0.5)
  ]);
  animateSmoke(target);
  wait(0.4, () => destroy(kabam))
}

export function animateBurn(target) {
  shake(30);
  
  const burn = add([
    sprite("Burn", { anim: "glitch" }),
    pos(target.pos.add(vec2(-15, 10))), 
    scale(6),
    anchor("center"),
    z(40),
    opacity(0)
  ]);
  
  const burn2 = add([
    sprite("Burn2", { anim: "glitch" }),
    pos(target.pos.add(vec2(20, -8))),
    scale(6),
    anchor("center"),
    z(39),
    opacity(0)
  ]);
  
  const burn3 = add([
    sprite("Burn", { anim: "glitch" }),
    pos(target.pos.add(vec2(8, -15))),
    scale(4),
    anchor("center"),
    z(44),
    opacity(0)
  ]);
  
  const burn4 = add([
    sprite("Burn2", { anim: "glitch" }),
    pos(target.pos.add(vec2(-12, 12))), 
    scale(4),
    anchor("center"),
    z(42),
    opacity(0)
  ]);
  
  const pooooof = add([
    sprite("poof", { anim: "puff" }),
    pos(target.pos),
    scale(5),
    opacity(0),
    z(12),
    anchor("center")
  ]);
  

  tween(0, 0.6, 0.15, (val) => burn.opacity = val, easings.easeOutQuad);
  wait(0.05, () => tween(0, 0.4, 0.15, (val) => burn2.opacity = val, easings.easeOutQuad));
  wait(0.1, () => tween(0, 0.7, 0.15, (val) => burn3.opacity = val, easings.easeOutQuad));
  wait(0.15, () => tween(0, 0.5, 0.15, (val) => burn4.opacity = val, easings.easeOutQuad));

  wait(0.3, () => {
    tween(0, 0.5, 0.2, (val) => pooooof.opacity = val, easings.easeOutQuad);
  });
  

  wait(0.3, () => {
    tween(burn4.opacity, 0, 0.2, (val) => burn4.opacity = val, easings.easeInQuad);
    wait(0.2, () => destroy(burn4));
  });
  
  wait(0.4, () => {
    tween(burn.opacity, 0, 0.2, (val) => burn.opacity = val, easings.easeInQuad);
    wait(0.2, () => destroy(burn));
  });
  
  wait(0.5, () => {
    tween(burn2.opacity, 0, 0.2, (val) => burn2.opacity = val, easings.easeInQuad);
    wait(0.2, () => destroy(burn2));
  });
  
  wait(0.6, () => {
    tween(burn3.opacity, 0, 0.2, (val) => burn3.opacity = val, easings.easeInQuad);
    wait(0.2, () => destroy(burn3));
  });
  
  wait(0.8, () => {
    tween(pooooof.opacity, 0, 0.4, (val) => pooooof.opacity = val, easings.easeInQuad);
    wait(0.4, () => destroy(pooooof));
  });
}

export function animateGhostPoof(target) {
  const pooooof = add([
    sprite("poof", { anim: "puff" }),
    pos(target.pos),
    scale(4),
    opacity(1),
    z(12),
    anchor("center")
    ]);

  wait(0.3, () => {
    tween(pooooof.opacity, 0, 0.25, (o) => pooooof.opacity = o, easings.easeOutQuad)
      .then(() => destroy(pooooof));
    });

  const ghost = add([
        sprite("ghostRat"),
        pos(target.pos),
        scale(1),
        opacity(0.8),
        z(100),
       anchor("center"),
        rotate(0)
      ]);
      
  tween(ghost.pos.y, 0, 1.5, (y) => ghost.pos.y = y, easings.easeOutQuad);
  tween(ghost.opacity, 0, 1.5, (o) => ghost.opacity = o, easings.easeOutQuad);
      
  wait(1.5, () => destroy(ghost));
}

export function animatePoooof(target) {
  const pooooof = add([
    sprite("smokeBlob", { anim: "puff" }),
    pos(target.pos),
    scale(6),
    opacity(0.6),
    z(12),
    anchor("center")
    ]);

  wait(0.3, () => {
    tween(pooooof.opacity, 0, 0.25, (o) => pooooof.opacity = o, easings.easeOutQuad)
      .then(() => destroy(pooooof));
    });
}

export function animateRedBoom(target) {
  shake(50);
  const boom = add([
    sprite("bam", { anim: "burst" }),
    pos(target.pos),
    scale(10),
    opacity(0.5),
    z(100),
    anchor("center")
  ]);
  animateSmoke(target);
  wait(0.5, () => {
    tween(boom.opacity, 0, 0.3, (o) => boom.opacity = o, easings.easeOutQuad)
      .then(() => destroy(boom));
  });
}


export function animateGreenBoom(target) {
  shake(50);
  const boom = add([
    sprite("bam", { anim: "burst" }),
    pos(target.pos),
    scale(10),
    opacity(0.5),
    z(100),
    anchor("center")
  ]);
  wait(0.5, () => {
    tween(boom.opacity, 0, 0.3, (o) => boom.opacity = o, easings.easeOutQuad)
      .then(() => destroy(boom));
  });
}

export function animateShock(target) {
  shake(20);

  const zap = add([
    sprite("shock", { anim: "burst" }),
    pos(target.pos),
    scale(4),
    opacity(1),
    z(12),
    anchor("center")
  ]);

  wait(0.3, () => {
    tween(zap.opacity, 0, 0.25, (o) => zap.opacity = o, easings.easeOutQuad)
      .then(() => destroy(zap));
  });
}

export function animateBigBoom(target) {
  shake(100);
  for (let i = 0; i < 3; i++) {
    wait(i * 0.1, () => {
      add([
        pos(target.pos.add(rand(-30, 30), rand(-30, 30))),
        particles({
          max: 120,
          speed: [100, 300],
          direction: 0,
          spread: 360,
          lifeTime: [0.5, 1.5],
        }, () => [
          circle(rand(2, 8)),
          color(choose([ORANGE, YELLOW, RED, MAGENTA, rgb(255, 100, 255)])),
          opacity(1),
          move(rand(0, 360), rand(100, 300)),
          lifespan(rand(0.5, 1.5)),
        ]),
        z(120)
      ]);
    });
  }
  const flash = add([
    circle(100),
    pos(target.pos),
    color(WHITE),
    opacity(0.8),
    z(125),
    anchor("center")
  ]);
  tween(flash.scale, 3, 0.3, (s) => flash.scale = vec2(s), easings.easeOutQuad);
  tween(flash.opacity, 0, 0.3, (o) => flash.opacity = o, easings.easeOutQuad)
    .then(() => destroy(flash));
}

export function animateExplosion(target) {
  shake(50);
  const boom = add([
    sprite("bam", { anim: "burst" }),
    pos(target.pos),
    scale(10),
    opacity(0.5),
    z(100),
    anchor("center")
  ]);
  animateSmoke(target);
  wait(0.5, () => {
    tween(boom.opacity, 0, 0.3, (o) => boom.opacity = o, easings.easeOutQuad)
      .then(() => destroy(boom));
  });
}

export function animateFireball(hero, target) {
  const start = attacker.pos.add(0, -20);
  const end = target.pos.add(0, -10);
  const mid = start.lerp(end, 0.5).add(rand(-60, 60), rand(-50, -20));

  const fireball = add([
    sprite("fire", { anim: "ball" }),
    pos(start),
    scale(4),
    z(90),
    anchor("center"),
    rotate(0)
  ]);

  tween(start, mid, 0.35, (p) => fireball.pos = p, easings.easeOutQuad)
    .then(() => tween(mid, end, 0.35, (p) => fireball.pos = p, easings.easeInQuad))
    .then(() => {
      shake(15);
      animateSmoke(target);
      animateExplosion(target);
      destroy(fireball);
    });
  
  fireball.onUpdate(() => {
    fireball.angle += 180 * dt();
  });
}

export function animateSmoke(target) {
  const poof = add([
    sprite("smokeBlob", { anim: "puff" }),
    pos(target.pos.add(rand(-20, 20), rand(-20, 20))),
    scale(8),
    opacity(0),
    z(95),
    anchor("center")
  ]);
  tween(poof.opacity, 0.6, 0.5, (o) => poof.opacity = o, easings.easeOutQuad);
  tween(poof.pos.y, poof.pos.y - 50, 1.2, (y) => poof.pos.y = y, easings.easeOutQuad);
  wait(0.3, () => {
    tween(poof.opacity, 0, 0.9, (o) => poof.opacity = o, easings.easeOutQuad)
      .then(() => destroy(poof));
  });
}



export function animatePowerup(target) {
  const startY = target.pos.y + 100;
  const endY = target.pos.y - 150;
  
  const beam = add([
    sprite("powerup", { anim: "beam" }),
    pos(target.pos.x, startY),
    scale(3),
    opacity(0),
    z(95),
    anchor("center")
  ]);
  
  tween(beam.opacity, 0.8, 0.7, (o) => beam.opacity = o, easings.easeOutQuad);
  tween(beam.pos.y, endY, 1.5, (y) => beam.pos.y = y, easings.easeOutQuad);
  wait(0.8, () => {
    tween(beam.opacity, 0, 0.5, (o) => beam.opacity = o, easings.easeInQuad)
      .then(() => destroy(beam));
  });
}

// ========================= CAT =========================
export function animateScratch(attacker, target) {
    shake(20);

    const angles = [30, 10, 0, 0];
    const offsets = [
      vec2(15, -20),
      vec2(0, 10),
      vec2(-20, 10),
      vec2(-40, 20)
    ];

    let i = 0;

   function slashNext() {
      if (i >= angles.length) return;

      const slash = add([
        sprite("scratch2", { anim: "glitch" }),
        pos(target.pos.add(offsets[i])),
        scale(4),
        anchor("center"),
        rotate(angles[i]),
        z(30),
        opacity(1)
      ]);



      tween(1, 0, 0.7, (o) => slash.opacity = o)
        .then(() => destroy(slash));

      i++;
      wait(0.05, slashNext);
    }

    slashNext();
  }

export function animateBiscuits(target) {
    const paws = add([
      sprite("biscuits", { anim: "glitch" }),
      pos(target.pos.add(100, -20)),
      scale(3),
      anchor("center"),
      z(30),
      opacity(0)
    ]);

    tween(paws.opacity, 1, 0.5, (o) => paws.opacity = o);

    let t = 0;
    paws.onUpdate(() => {
      t += dt();
      const squish = 1 + Math.sin(t * 8) * 0.01;
      paws.scale = vec2(3 * squish, 3 / squish);
      paws.pos = target.pos.add(100, -20);
    });

    wait(0.8, () => {
      tween(paws.opacity, 0, .5, (o) => paws.opacity = o)
        .then(() => destroy(paws));
    });
  }

export function animateClaw(attacker, target) {
  shake(20);
  const startX = target.pos.x - 150; //-50;
  const endX = target.pos.x - 150; // - 250;
  
  const slash = add([
    sprite("claw", { anim: "slash" }),
    pos(startX, attacker.pos.y - 100),
    scale(5),
    z(90),
    anchor("left")
  ]);
  
  tween(slash.pos.x, endX, 1, (x) => slash.pos.x = x, easings.easeInOutQuad)
    .then(() => {
      animateSmoke(target);
      destroy(slash);
    });
}

export function animateZoomies(attacker, target) {
  const glitchCat = add([
    sprite("zoomies", { anim: "glitch" }),
    pos(attacker.pos),
    scale(1.5),
    z(110),
    anchor("center"),
    opacity(1)
  ]);
  
  let colorUpdate = glitchCat.onUpdate(() => {
    const hue = (time() * 360) % 360;
    glitchCat.color = hsl2rgb(hue / 360, 1, 0.8);
  });
  
  const zips = [
    vec2(rand(100, 400), rand(150, 400)), 
    vec2(rand(600, 900), rand(100, 300)), 
    vec2(rand(500, 800), rand(300, 500)), 
    target.pos
  ];
  
  let i = 0;
  function zipNext() {
    if (i < zips.length) {
      tween(glitchCat.pos, zips[i], 0.12, (p) => glitchCat.pos = p, easings.linear)
        .then(() => {
          shake(10);
          i++;
          zipNext();
        });
    } else {
      shake(40);
      animateExplosion(target);
      const startScale = 1.5;
      const endScale = 3.5;
      tween(startScale, endScale, 0.25, (s) => glitchCat.scale = vec2(s), easings.easeOutQuad)
        .then(() => destroy(glitchCat));
    }
  }
  zipNext();
}

// SPECIAL UNLOCK MOVE
 export function animateWhiskerWhip(attacker, target) {
  const whipStart = attacker.pos.add(50, -60);
  
  const whip = add([
    sprite("whip", { anim: "glitch" }),
    pos(whipStart),
    scale(3),
    anchor("left"), 
    z(90),
    opacity(0)
  ]);
  
  tween(whip.opacity, 1, 0.1, (o) => whip.opacity = o);
  
  whip.play("glitch");
  
  wait(0.2, () => {
    shake(70);
    animateShock(target);
    
    wait(0.2, () => {
      tween(whip.opacity, 0, 0.2, (o) => whip.opacity = o)
        .then(() => destroy(whip));
    });
  });
}

// ========================= LASER POINTER =========================
export function animateZap(attacker, target) {
  shake(20);

  const zap = add([
    sprite("shock", { anim: "burst" }),
    pos(target.pos),
    scale(5),
    anchor("center"),
    opacity(1),
    z(20)
  ]);

  wait(0.25, () => {
    tween(zap.opacity, 0, 0.2, o => zap.opacity = o)
      .then(() => destroy(zap));
  });
}

export function animateLaserBeam(attacker, target) {
  const charge = add([
    sprite("laserCharge", { anim: "glitch" }),
    pos(attacker.pos.add(-70, 60)),
    scale(20),
    anchor("center"),
    opacity(0),
    z(50)
  ]);

  tween(charge.opacity, 1, 0.6, o => charge.opacity = o);
  tween(3, 4, 0.5, s => charge.scale = vec2(s));

  wait(0.45, () => {
    destroy(charge);
    shake(12);

    const beamStart = attacker.pos.add(-200, 100);
    const beamEnd = target.pos;

    const beam = add([
      sprite("laserBeam", { anim: "glitch" }),
      pos(beamStart),
      scale(vec2(5)),
      anchor("center"),
      rotate(15),
      z(60),
      opacity(1)
    ]);

    tween(
      beam.pos,
      beamEnd,
      0.4,
      (p) => beam.pos = p,
      easings.easeInQuad
    ).then(() => {
      animateRedBoom(target);
      animateSmoke(target);
      shake(25);
      destroy(beam);
    });
  });
}


export function animateFlash() {
  const flash = document.createElement('div');
  flash.style.position = 'fixed';
  flash.style.top = '0';
  flash.style.left = '0';
  flash.style.width = '100vw';
  flash.style.height = '100vh';
  flash.style.backgroundColor = 'white';
  flash.style.opacity = '0';
  flash.style.pointerEvents = 'none';
  flash.style.zIndex = '9999';
  document.body.appendChild(flash);
  
  gsap.timeline()
    .to(flash, { opacity: 0.9, duration: 0.1, ease: 'power2.out' })
    .to(flash, { opacity: 0, duration: 0.2, ease: 'power2.in' })
    .call(() => flash.remove());
}

// ========================= CUP =========================
export function animateEspressoFireball(attacker, target) {
    const start = attacker.pos.add(40, -30);
    const end = target.pos.add(-20, 0);

    const fb = add([
      sprite("fireball", { anim: "glitch" }),
      pos(start),
      scale(2),
      anchor("center"),
      z(40)
    ]);

    fb.onUpdate(() => fb.angle += 720 * dt());

    tween(start, end, 0.45, (p) => fb.pos = p, easings.easeInQuad)
      .then(() => {
        animateExplosion(target);
        animateSmoke(target);
        destroy(fb);
      });
  }



// ========================= CUCUMBER =========================
export function animateGreenBlast(attacker, target) {
    const charge = add([
      sprite("greenBlast", { anim: "glitch" }),
      pos(attacker.pos),
      scale(3),
      anchor("center"),
      z(20),
      opacity(0)
    ]);

    tween(charge.opacity, 1, 0.2, (o) => charge.opacity = o);
    tween(3, 4.2, 0.4, (s) => charge.scale = vec2(s));

    let t = 0;
    charge.onUpdate(() => {
      t += dt();
      charge.pos = attacker.pos.add(Math.sin(t * 40) * 6, Math.cos(t * 40) * 6);
    });

    wait(0.45, () => {
      destroy(charge);
      shake(40);

      const shot = add([
        sprite("littleCucumber"),
        pos(attacker.pos),
        scale(1.5),
        anchor("center"),
        z(30)
      ]);

      tween(shot.pos, target.pos, 0.45, (p) => shot.pos = p, easings.easeOutQuad)
        .then(() => {
          animateKaBAM(target);
          animateSmoke(target);
          destroy(shot);
        });
    });
  }



// ========================= RAT KING =========================
export function animateRodentRage(attacker, target) {
  const ragingRat = add([
    sprite("rage"),  
    pos(attacker.pos),
    scale(3),
    z(110),
    anchor("center"),
    opacity(1)
  ]);
  
  
  let colorUpdate = ragingRat.onUpdate(() => {
    const flash = Math.sin(time() * 20) > 0 ? rgb(255, 50, 50) : rgb(180, 30, 30);
    ragingRat.color = flash;
  });
  

  const positions = [
    target.pos.add(-100, -20),
    target.pos.add(100, -20),
    target.pos.add(-100, 20),
    target.pos.add(100, 20),
    target.pos
  ];
  
  let i = 0;
  function attackNext() {
    if (i < positions.length) {
      tween(ragingRat.pos, positions[i], 0.1, (p) => ragingRat.pos = p, easings.linear)
        .then(() => {
          shake(15);
          i++;
          attackNext();
        });
    } else {
      shake(40);
      destroy(ragingRat);
    }
  }
  attackNext();
}

export function animateMouseMissiles(attacker, target) {
  const flash = add([
    sprite("bam", { anim: "burst" }),
    pos(attacker.pos.add(-40, 20)),
    scale(8),
    anchor("center"),
    z(40),
    opacity(0.5)
  ]);

  wait(0.25, () => destroy(flash));

  const count = randi(3, 5);

  for (let i = 0; i < count; i++) {
    wait(i * 0.12, () => {
      const ratProj = add([
        sprite("smallRat"),
        pos(attacker.pos.add(-30, 30)),
        scale(0.7),
        anchor("center"),
        rotate(-15),
        z(40),
      ]);

      tween(
        ratProj.pos,
        target.pos.add(rand(-10, 10), rand(-10, 10)),
        0.45,
        (p) => ratProj.pos = p,
        easings.easeOutQuad
      ).then(() => {
        shake(12);
        animateRedBoom(target);
        destroy(ratProj);
      });
    });
  }
}

export function animateBite(attacker, target) {
  shake(25);

  const bite = add([
    sprite("bite", { anim: "glitch" }),
    pos(target.pos.add(0, 70)),
    scale(6),
    anchor("center"),
    z(50),
    opacity(1)
  ]);

  tween( bite.scale, vec2(5, 5), 0.3, s => bite.scale = s )
    .then(() => {
      tween( bite.scale, vec2(4, 4), 0.3, s => bite.scale = s )
      shake(20);
    });

  wait(0.5, () => {
    tween(bite.opacity, 0, 0.25, (o) => bite.opacity = o).then(() => destroy(bite));
  });
}

// ========================= OBSERVER =========================
export function animateSuperpositionSlam(boss, hero) {
  const makeCopy = () => add([
    sprite("superposition", { anim: "glitch" }),
    pos(boss.pos),
    scale(2),
    anchor("center"),
    z(20),
    opacity(0)
  ]);

  const copyA = makeCopy();
  const copyB = makeCopy();

  tween(copyA.opacity, 1, 0.2, (o) => copyA.opacity = o);
  tween(copyB.opacity, 1, 0.2, (o) => copyB.opacity = o);

  const makeWarpPath = () => [
    hero.pos.add(rand(-220, -120), rand(-140, 90)),
    hero.pos.add(rand(-100, 140), rand(-170, 150)),
    hero.pos.add(rand(80, 240), rand(-80, 120)),
    hero.pos, 
  ];

  const warpsA = makeWarpPath();
  const warpsB = makeWarpPath();

  function warpCopy(copy, path, onFinish) {
    let i = 0;

    function step() {
      if (i < path.length) {
        tween(copy.pos, path[i], 0.15, (p) => copy.pos = p, easings.easeInOutQuad)
          .then(() => {
            shake(5);
            i++;
            step();
          });
      } else {
        onFinish();
      }
    }
    step();
  }

  let finishedCount = 0;
  function notifyFinished() {
    finishedCount++;
    if (finishedCount === 2) {
      collapseAndHit();
    }
  }

  warpCopy(copyA, warpsA, notifyFinished);
  warpCopy(copyB, warpsB, notifyFinished);

  function collapseAndHit() {
    tween(copyA.scale, vec2(3, 3), 0.1, (s) => copyA.scale = s);
    tween(copyB.scale, vec2(3, 3), 0.1, (s) => copyB.scale = s);

    tween(copyA.pos, hero.pos, 0.1, (p) => copyA.pos = p);
    tween(copyB.pos, hero.pos, 0.1, (p) => copyB.pos = p);

    wait(0.1, () => {
      shake(40);
      animateShock(hero);

      tween(copyA.opacity, 0, 0.25, (o) => copyA.opacity = o)
        .then(() => destroy(copyA));

      tween(copyB.opacity, 0, 0.25, (o) => copyB.opacity = o)
        .then(() => destroy(copyB));
    });
  }
}

export function animateHydrogenHammer(boss, hero) {
  const hammer = add([
    sprite("hammer", { anim: "smash" }),
    pos(boss.pos.add(-200, 10)),
    scale(3.5),
    anchor("center"),
    z(25),
    opacity(1)
  ]);
  
  tween(hammer.pos, boss.pos.add(-200, -40), 0.6, (p) => hammer.pos = p, easings.easeOutQuad)
    .then(() => {
      tween(
        hammer.pos,
        hero.pos.add(20, -50),
        0.1,
        (p) => hammer.pos = p,
        easings.easeInCubic
      ).then(() => {
        shake(40);
        animateShock(hero);
        animateSmoke(hero);
        tween(hammer.opacity, 0, 0.8, (o) => hammer.opacity = o)
          .then(() => destroy(hammer));
      });
    });
}

export function animatePoisonAttack(boss, hero) {
  const box = add([
    sprite("box", { frame: 0 }), 
    pos(boss.pos.add(-40, 20)),
    scale(2),
    z(30),
    anchor("center"),
    opacity(0)
  ]);

  tween(box.opacity, 1, 0.25, (o) => box.opacity = o);
  tween(box.pos.y, box.pos.y - 20, 0.3, (p) => box.pos.y = p, easings.easeOutQuad);

  wait(0.4, () => {
    box.frame = 1; 
  });

  wait(0.5, () => {
    
    const bottle = add([
      sprite("bottle"),
      pos(box.pos.add(0, -20)),
      scale(2.2),
      anchor("center"),
      z(35),
      opacity(0)
    ]);

    tween(bottle.opacity, 1, 0.2, (o) => bottle.opacity = o);
    tween(bottle.pos.y, bottle.pos.y - 60, 0.6, (y) => bottle.pos.y = y, easings.easeOutQuad);
    
    tween(box.opacity, 0, 0.4, (o) => box.opacity = o)
      .then(() => destroy(box));

    wait(0.7, () => {
    
      const makeCopy = () => add([
        sprite("bottle"),
        pos(bottle.pos),
        scale(2.2),
        anchor("center"),
        z(40),
        opacity(0)
      ]);

      destroy(bottle);

      const A = makeCopy();
      const B = makeCopy();

      tween(A.opacity, 1, 0.15, (o) => A.opacity = o);
      tween(B.opacity, 1, 0.15, (o) => B.opacity = o);

      const makePath = () => [
        hero.pos.add(rand(-250, -150), rand(-120, 120)),
        hero.pos.add(rand(-150, 150), rand(-160, 160)),
        hero.pos.add(rand(100, 260), rand(-100, 140)),
        hero.pos.add(0, -120)
      ];

      const pathA = makePath();
      const pathB = makePath();

      let finished = 0;

      const warpCopy = (obj, path) => {
        let i = 0;
        function step() {
          if (i < path.length) {
            tween(obj.pos, path[i], 0.15, (p) => obj.pos = p, easings.easeInOutQuad)
              .then(() => {
                shake(5);
                i++;
                step();
              });
          } else {
            finished++;
            if (finished === 2) {
              
              const mergePoint = hero.pos.add(0, -120);
              tween(A.pos, mergePoint, 0.12, (p) => A.pos = p);
              tween(B.pos, mergePoint, 0.12, (p) => B.pos = p);

              tween(A.scale, vec2(2.8, 2.8), 0.1, (s) => A.scale = s);
              tween(B.scale, vec2(2.8, 2.8), 0.1, (s) => B.scale = s);

              wait(0.12, () => {
                shake(30);
                destroy(A);
                destroy(B);
                
                const shatter = add([
                  sprite("shatter", { anim: "glitch" }),
                  pos(mergePoint),
                  scale(3),
                  anchor("center"),
                  z(50)
                ]);
                
                wait(0.4, () => {
                  destroy(shatter);
                  
                  
                  const drip = add([
                    sprite("poison", { anim: "glitch" }), 
                    pos(hero.pos.add(0, -10)),
                    scale(3),
                    opacity(0),
                    anchor("center"),
                    z(60)
                  ]);

                  tween(drip.opacity, 1, 0.2, (o) => drip.opacity = o);
                  tween(drip.pos.y, hero.pos.y + 40, 0.6, (y) => drip.pos.y = y, easings.easeInQuad);

                  wait(0.5, () => {
                    tween(drip.opacity, 0, 0.3, (o) => drip.opacity = o)
                      .then(() => destroy(drip));
                  });
                });
              });
            }
          }
        }
        step();
      };

      warpCopy(A, pathA);
      warpCopy(B, pathB);
    });
  });
}


// ========================= FINISH HIM =========================
// =================== CAT ARROW ===================
  export function animateCatArrow(hero, boss) {
    const lock = add([ // LOCK ON
      sprite("lock", { anim: "glitch" }),
      pos(boss.pos),
      scale(2),
      anchor("center"),
      z(20),
      opacity(0),
    ]);

    tween(lock.opacity, 1, 0.4, (o) => lock.opacity = o);

    let t = 0;
    lock.onUpdate(() => {
      t += dt();
      lock.pos = boss.pos.add(Math.sin(t * 20) * 6, Math.cos(t * 10) * 8);
    });

    wait(7, () => {
      destroy(lock);
      shake(8);

      const arrow = add([
        sprite("catArrow"),         
        pos(boss.pos),
        scale(1),
        anchor("center"),
        rotate(0),
        z(30),
      ]);

      const dirToPlayer = hero.pos.sub(boss.pos).unit();
      arrow.angle = dirToPlayer.angle() + 180;

      
      tween( // PULL BACK
        arrow.pos,
        hero.pos.add(dirToPlayer.scale(40)), // BEHIND PLAYER
        0.2,
        (p) => arrow.pos = p,
        easings.easeInExpo
      ).then(() => { // STRETCH + WOBBLE
        arrow.scale = vec2(2, 2);
        shake(4);

      
        let vibe = 0;  // VIBRATION
        const vibeHandle = arrow.onUpdate(() => {
          vibe += dt();
          arrow.pos = arrow.pos.add(Math.sin(vibe * 50) * 2, Math.sin(vibe * 30) * 1);
        });

        wait(4, () => {                
          vibeHandle.cancel();    // PAUSE TO SEE ARROW        
          arrow.pos = hero.pos.add(dirToPlayer.scale(40))
          tween(arrow.scale, vec2(0, 0), 0.08, (s) => arrow.scale = s) // WIND UP SQUISH
            .then(() => {
              // FWSSSHHHHHH — RELEASE!!!
              tween(arrow.scale, vec2(1.5), 0.08, (s) => arrow.scale = s);

              tween(
                arrow.pos,
                boss.pos,
                0.15,    // FAST                               
                (p) => arrow.pos = p,
                easings.easeInCubic
              ).then(() => {
                tween(arrow.pos, boss.pos.add(dirToPlayer.scale(-15)), 0.06, (p) => arrow.pos = p, easings.easeOutCubic) // OVERSHOOT
                  .then(() => {
                    arrow.pos = boss.pos;
                    animateKaBAM(boss);
                    animateSmoke(boss);
                    shake(20);

                    destroy(arrow);
                  });
              });
            });
        });
      });
    });
  }


  export function animateCatCrossbow(hero, boss) {
      const crossbow = add([
        sprite("CrossBow"), 
        pos(hero.pos.add(130, 20)),
        scale(1.3),
        anchor("center"),
        z(25),
        rotate(-35),
        opacity(0),
      ]);
      crossbow.frame = 0;
      tween(crossbow.opacity, 1, 0.25, (o) => crossbow.opacity = o);
      wait(0.8, () => {
        play("cupFinishHim", { volume: 0.5 });
        const dirToTarget = boss.pos.sub(hero.pos).unit();
        
        const spriteWidth = crossbow.width * crossbow.scale.x; // CALCULATE OFFSET TO KEEP HANDLE IN SAME SPOT
        const spriteHeight = crossbow.height * crossbow.scale.y; // HANDLE MOVES FROM TOP-LEFT TO BOTTOM-LEFT
        
        const handleOffset = vec2(20, spriteHeight * -0.3); // THIS ADJUSTS VERTICALLY // OFFEST TO COMPENSATE FOR HANDLE PLACEMENT ON SPRITE SHEET
              crossbow.frame = 1; // FRAME 2 - TILT UP TO AIM
        crossbow.pos = crossbow.pos.add(handleOffset);
        crossbow.angle = dirToTarget.angle()+10;

        const lock = add([ // LOCK ON TARGET
          sprite("lock", { anim: "glitch" }),
          pos(boss.pos),
          scale(2),
          anchor("center"),
          z(20),
          opacity(0),
        ]);

        tween(lock.opacity, 1, 0.4, (o) => lock.opacity = o);

        let t = 0;
        lock.onUpdate(() => {
          t += dt();
          lock.pos = boss.pos.add(Math.sin(t * 20) * 6, Math.cos(t * 10) * 8);
        });

        wait(1, () => {
          const arrow = add([ // SPAWN ARROW ON THE BOW
            sprite("catArrow"),         
            pos(hero.pos.add(dirToTarget.scale(20))), // SLIGHTLY IN FRONT
            scale(1.1),
            anchor("center"),
            rotate(dirToTarget.angle()),
            z(30),
          ]);

          tween( // COCK IT BACK
            arrow.pos,
            hero.pos.add(dirToTarget.scale(-15)), // PULL BACK
            0.3,
            (p) => arrow.pos = p,
            easings.easeOutQuad
          ).then(() => {
            crossbow.scale = vec2(1.2, 1.3); // SLIGHT TENSION SQUISH
            
            let vibe = 0; // VIBRATION - HOLDING THAT TENSION
            const vibeHandle = arrow.onUpdate(() => {
              vibe += dt();
              arrow.pos = arrow.pos.add(Math.sin(vibe * 50) * 2, Math.sin(vibe * 30) * 1);
              arrow.scale = vec2(1.3, 1.4); // SLIGHT TENSION SQUISH

            });

            wait(1, () => {
              vibeHandle.cancel();
              destroy(lock);
              
              tween(arrow.scale, vec2(0.3, 0.8), 0.08, (s) => arrow.scale = s)  // WIND UP SQUISH
                .then(() => {
                  shake(20);
                  
                  tween(arrow.scale, vec2(1.5), 0.08, (s) => arrow.scale = s); // FIRE!!!
                  
                  const recoilDir = dirToTarget.scale(-5);  // CROSSBOW RECOIL
                  const originalPos = crossbow.pos;
                  tween(
                    crossbow.pos,
                    originalPos.add(recoilDir.scale(20)),
                    0.1,
                    (p) => crossbow.pos = p,
                    easings.easeOutQuad
                  ).then(() => {
                    tween(crossbow.pos, originalPos, 0.2, (p) => crossbow.pos = p, easings.easeInOutQuad);
                  });
                  
                  crossbow.scale = vec2(2, 2); // RECOIL STRETCH

                  tween( // ARROW FLIES
                    arrow.pos,
                    boss.pos,
                    0.15,
                    (p) => arrow.pos = p,
                    easings.easeInCubic
                  ).then(() => {
                    tween(arrow.pos, boss.pos.add(dirToTarget.scale(15)), 0.06, (p) => arrow.pos = p, easings.easeOutCubic)
                      .then(() => {
                        arrow.pos = boss.pos;
                        animateKaBAM(boss);
                        animateSmoke(boss);
                        shake(70);

                        destroy(arrow);
                        
                        tween(crossbow.opacity, 0, 0.5, (o) => crossbow.opacity = o) // FADE OUT CROSSBOW
                          .then(() => destroy(crossbow));
                      });
                  });
                });
            });
          });
        });
      });
    }

// =================== MEOWLOTOV COCKTAIL ===================
  export function animateMeowlotovCocktail(hero, boss) {
      const lightPos = hero.pos.add(vec2(30, -150));
      const cocktailLight = add([
          sprite("CocktailLight", { anim: "glitch" }),
          pos(lightPos),
          scale(5), 
          z(40),
      ]);
      cocktailLight.play("glitch", { loop: false });
      play("laserFinishHim", { volume: 0.5 });

      wait(0.6, () => { 
          destroy(cocktailLight);

          const startPos = lightPos;
          const endPos = boss.pos.add(vec2(-30, -30)); 
          const throwTime = 0.8;
          const spin = add([
              sprite("CocktailSpin", { anim: "glitch" }),
              pos(startPos),
              scale(3),
              z(40),
          ]);
          spin.play("glitch", { loop: true });
          const startY = startPos.y;
          const endY = endPos.y;
          const peakHeight = 150;
          
          tween(0, 1, throwTime, (t) => {
              spin.pos.x = startPos.x + (endPos.x - startPos.x) * t;
              const arcProgress = Math.sin(t * Math.PI);
              spin.pos.y = startY + (endY - startY) * t - (peakHeight * arcProgress);
          }, easings.easeInQuad);

          wait(throwTime, () => {
              destroy(spin);

              animateKaBAM(boss, hero);
              
              for (let i = 0; i < 12; i++) {
                  wait(i * 0.1, () => {
                      const burnOffset = vec2(rand(-130, 2), rand(-110, 2));
                      const burn = add([
                          sprite("Burn", { anim: "glitch" }),
                          pos(endPos.add(burnOffset)),
                          scale(5.5 + rand(-0.6, 0.6)),
                          opacity(0.7),
                          z(35),
                      ]);
                      burn.play("glitch", { loop: false });
                      wait(1, () => destroy(burn));
                  });
              }
            wait(0.7, () => {animateSmoke(boss); } )
          });
      });
  }

// =================== FELINE FISSION ===================

  function animateSuperSaiyan(){
     const battleUI = document.getElementById('battleUI');
      if (battleUI) {
        battleUI.classList.add('hidden');
        console.log('🧹 Battle UI hidden on scene leave');
      }

      
     const finalMoveBG = add([
      sprite("finalMoveBG", { anim: "fade" }),
      pos(SCREEN_W / 2, SCREEN_H / 2),
      scale(20),
      anchor("center"),
      z(1000),
      fixed(),
      opacity(0)
    ]);
  
    const finalMoveAnimation1 = add([
      sprite("finalMove1", { anim: "fade" }),
      pos(SCREEN_W / 2, SCREEN_H / 2),
      scale(10),
      anchor("center"),
      z(1002),
      fixed(),
      opacity(0)
    ]);

    const finalMoveAnimation2 = add([
      sprite("finalMove2", { anim: "fade" }),
      pos(SCREEN_W / 2, SCREEN_H / 2),
      scale(10),
      anchor("center"),
      z(1002),
      fixed(),
      opacity(0)
    ]);
    
    shake(50);
    tween(finalMoveBG.opacity, 1, 0.3, (val) => finalMoveBG.opacity = val);
    finalMoveBG.play("fade", { loop: false, speed: 10 }); // TOTAL TIME = 8s
    
    play("lightning", { volume: 0.4, speed: 0.8 });
    wait(0.2, () => { play("lightning", { volume: 0.2, speed: 0.8 }) });
    wait(0.4, () => { play("lightning", { volume: 0.4, speed: 0.8 }) });
    wait(1, () => { play("lightning", { volume: 0.3, speed: 0.8 }) });
    wait(5, () => { play("lightning", { volume: 0.3, speed: 0.8 }) });
    wait(7, () => { play("lightning", { volume: 0.5, speed: 0.8 }) });
    
    
    wait(1.3, () => { play("finalMovePowerUp", { volume: 0.4 }); });
    wait(3.2, () => {
      tween(finalMoveAnimation1.opacity, 1, 0.6, (val) => finalMoveAnimation1.opacity = val);
      finalMoveAnimation1.play("fade", { loop: false, speed: 10 }); // 12 FRAMES / 1.2s
      wait(1, () => {
          tween(finalMoveAnimation1.opacity, 0, 0.3, (val) => finalMoveAnimation1.opacity = val);
      });
    });
    wait(2.6, () => { play("finalMoveZap", { volume: 0.1 }); });
    wait(7.5, () => {
      play("finalMoveZap", { volume: 0.2 });
      tween(finalMoveAnimation2.opacity, 1, 0.5, (val) => finalMoveAnimation2.opacity = val);
      finalMoveAnimation2.play("fade", { loop: true, speed: 10 }); //1.3s
      wait(1.1, () => {
          tween(finalMoveAnimation2.opacity, 0, 0.2, (val) => finalMoveAnimation2.opacity = val);
      });
    });
    
  
    
    wait(8.3, () => {
      const whiteFlash = add([
        rect(SCREEN_W, SCREEN_H),
        pos(0, 0),
        color(255, 255, 255),
        opacity(0),
        z(1001),
        fixed()
      ]);
      
      tween(whiteFlash.opacity, 1, 0.1, (val) => whiteFlash.opacity = val, easings.easeInQuad);
      
      wait(0.2, () => {
            tween(finalMoveBG.opacity, 0, 0.3, (val) => finalMoveBG.opacity = val);

        wait(0.5, () => {
          tween(whiteFlash.opacity, 0, 0.5, (val) => whiteFlash.opacity = val, easings.easeOutQuad)
            .then(() => destroy(whiteFlash));
          shake(100)
          

        });
      });
    });
  }

  export function animateFelineFission(boss) {
      animateSuperSaiyan();
      wait(8.8, () => {
       
          shake(30);
          stopAllMusic();
          play("finalFinishHim");
          play("finalFinishHim2");
          startAtmosphere();
          const startPos = boss.pos.sub(vec2(250, -90));
          const mushroom = add([
              sprite("mushroom", { anim: "burst" }),
              pos(startPos), 
              scale(2),
              z(50),
              opacity(0.8),
          ]);
          
          const startScale = 3; // GROW CLOUD UP
          const endScale = 9;
          tween(0, 1, 1.5, (t) => {
              const currentScale = startScale + (endScale - startScale) * t;
              mushroom.scale = vec2(currentScale, currentScale);
              const scaleGrowth = currentScale - startScale; // KEEP BOTTOM ANCHORED
              mushroom.pos.y = startPos.y - (scaleGrowth * 50); //  HEIGHT MULTIPLIER
          }, easings.easeOutQuad);
          
          tween(mushroom.opacity, 0.7, 0.5, (o) => mushroom.opacity = o);
          mushroom.play("burst", { loop: false });

          wait(0.4, () => {
              shake(70); // SHAKE BUILD UP
              const flash1 = add([ // QUICK FLASH
                  rect(width(), height()),
                  pos(0, 0),
                  color(255, 255, 255), 
                  opacity(0),
                  fixed(),
                  z(10000),
              ]);
              
              tween(flash1.opacity, 1, 0.15, (val) => flash1.opacity = val, easings.easeInQuad);
              wait(0.15, () => {
                  tween(flash1.opacity, 0, 0.2, (val) => flash1.opacity = val, easings.easeOutQuad);
                  wait(0.2, () => destroy(flash1));
              });
              
              wait(1.5, () => destroy(mushroom)); // DESTROY MUSHROOM AFTER FIRST FLASH
              wait(0.6, () => { // CINEMATIC FLASH
                  shake(100);
                  const flash2 = add([
                      rect(width(), height()),
                      pos(0, 0),
                      color(255, 255, 255), 
                      opacity(0),
                      fixed(),
                      z(10000),
                  ]);
                  tween(flash2.opacity, 1, 0.6, (val) => flash2.opacity = val, easings.easeInQuad); // LINGERING FULL WHITE SCREEN 
                  
              
              });
          });
      });
  }

// =================== BRASS TOE BEANS ===================

  export function animateBrassToeBeans(hero, boss) {
      const startPos = hero.pos.add(vec2(100, -100));
      
      // SHOW OFF THE KNUCKLES
      const knuckles = add([
          sprite("BrassToeBeans"),
          pos(startPos),
          scale(1),
          rotate(0),
          z(45),
          opacity(0),
          anchor("center"),
      ]);
      
      tween(knuckles.opacity, 1, 0.2, (o) => knuckles.opacity = o);
      play("cucumberFinishHim", { volume: 0.5 }); 

      wait(0.2, () => {
          tween(knuckles.scale, vec2(2, 2), 0.3, (s) => knuckles.scale = s, easings.easeOutBack);
      });
      
      wait(0.7, () => {
          const windUpPos = startPos.add(vec2(-100, 0));
          tween(knuckles.pos, windUpPos, 0.25, (p) => knuckles.pos = p, easings.easeInQuad);
          tween(knuckles.angle, 110, 0.25, (a) => knuckles.angle = a);
          
          wait(0.2, () => {
              // EXPLOSIVE PUNCH
              const punchTime = 0.1;
              const endPos = boss.pos.add(vec2(50, 0));
              
              tween(knuckles.pos, endPos, punchTime, (p) => knuckles.pos = p, easings.easeInCubic);
              tween(knuckles.scale, vec2(1.8, 1.8), punchTime * 0.5, (s) => knuckles.scale = s, easings.easeInQuad);
              
              wait(punchTime, () => {
                  // IMPACT
                  shake(70);
                  
                  for (let i = 0; i < 4; i++) {
                      wait(i * 0.08, () => {
                          const angle = (i * 90) + rand(-20, 20);
                          const distance = rand(2, 2);
                          const splatOffset = vec2(
                              Math.cos(angle * Math.PI / 180) * distance,
                              Math.sin(angle * Math.PI / 180) * distance
                          );
                          
                          const splat = add([
                              sprite("splat", { anim: "glitch" }),
                              pos(boss.pos.add(splatOffset)),
                              scale(1.2 + rand(-0.2, 0.3)),
                              rotate(rand(0, 360)),
                              z(40),
                              opacity(0.6),
                          ]);
                          splat.play("glitch", { loop: false });
                          wait(0.5, () => destroy(splat));
                      });
                  }
                  
                  wait(0.1, () => shake(30));
                  
                  wait(0.01, () => {
                      const heroReturnPos = hero.pos.add(vec2(120, -20)); 
                      tween(knuckles.pos, heroReturnPos, 0.25, (p) => knuckles.pos = p, easings.easeOutQuad);
                      tween(knuckles.scale, vec2(1.5, 1.5), 0.25, (s) => knuckles.scale = s);
                      tween(knuckles.angle, 90, 0.1, (a) => knuckles.angle = a, easings.easeInQuad);
                      
                      wait(0.45, () => {
                          tween(knuckles.angle, 25, 0.1, (a) => knuckles.angle = a, easings.easeInQuad);
                          
                          wait(0.12, () => {
                              tween(knuckles.angle, 115, 0.1, (a) => knuckles.angle = a, easings.easeOutQuad);
                              
                              wait(0.1, () => {
                                  const flickAngle = 35; 
                                  const flickSplat = add([
                                      sprite("splat", { anim: "glitch" }),
                                      pos(knuckles.pos),
                                      scale(1.3),
                                      rotate(rand(0, 360)),
                                      z(46),
                                      opacity(1),
                                  ]);
                                  flickSplat.play("glitch", { loop: false });
                                  
                                  const flickTarget = knuckles.pos.add(vec2(
                                      Math.cos(flickAngle * Math.PI / 180) * 200,
                                      Math.sin(flickAngle * Math.PI / 180) * 200
                                  ));
                                  tween(flickSplat.pos, flickTarget, 0.4, (p) => flickSplat.pos = p, easings.easeOutQuad);
                                  tween(flickSplat.opacity, 0, 0.4, (o) => flickSplat.opacity = o);
                                  wait(0.5, () => destroy(flickSplat));
                              });
                              
                              wait(0.3, () => {
                                  tween(knuckles.opacity, 0, 0.3, (o) => knuckles.opacity = o);
                                  wait(0.3, () => destroy(knuckles));
                              });
                          });
                      });
                  });
              });
          });
      });
  }



// =================== PURRCISION RIFLE ===================
  export function animatePurrcisionRifle(hero, boss) {
      const startPos = hero.pos.add(vec2(-90, 50));
      const rifle = add([
          sprite("rifle"),
          pos(startPos),
          scale(2.3),
          rotate(-85), // START VERTICAL-ISH
          z(100),
          opacity(0),
      ]);
      tween(rifle.opacity, 1, 0.2, (o) => rifle.opacity = o);
          wait(0.6, () => { // PAUSE TO SHOW OFF RIFLE
          const aimingAngle = -15; // ROTATE TO AIMING POSITION
          const aimingPos = hero.pos.add(vec2(-110, -120));
          
          tween(rifle.angle, aimingAngle, 0.8, (a) => rifle.angle = a, easings.easeInOutQuad);
          tween(rifle.pos, aimingPos, 0.8, (p) => rifle.pos = p, easings.easeInOutQuad);
          
          const lock = add([ // LOCK ON TARGET
              sprite("lock", { anim: "glitch" }),
              pos(boss.pos.add(vec2(-90, -70))),
              scale(2),
              opacity(0),
              z(150),
          ]);
          
          wait(0.6, () => {
              tween(lock.opacity, 1, 0.2, (o) => lock.opacity = o);
              lock.play("glitch", { loop: false, speed: 30 });
          });
          play("ratFinishHim", { volume: 0.5 });
          wait(1.8, () => {
              destroy(lock);
              const flashPos = rifle.pos.add(vec2(340, -20)); // MUZZLE FLASH
              const flash = add([
                  sprite("MuzzleFlash", { anim: "burst" }),
                  pos(flashPos),
                  scale(3.5),
                  rotate(-15),
                  z(150),
              ]);
              flash.play("burst", { loop: false, speed: 20 });
              shake(50);
              
              tween(rifle.angle, -45, 0.08, (a) => rifle.angle = a, easings.easeOutQuad); // RECOIL
              tween(rifle.pos, aimingPos.add(vec2(-50, 15)), 0.08, (p) => rifle.pos = p, easings.easeOutQuad);
              
              wait(0.08, () => { // RETURN TO FIRING POSITION
                  tween(rifle.angle, aimingAngle, 0.15, (a) => rifle.angle = a, easings.easeOutQuad);
                  tween(rifle.pos, aimingPos, 0.15, (p) => rifle.pos = p, easings.easeOutQuad);
              });
              
              wait(0.07, () => {

                 animateKaBAM(boss);
                  shake(45);
                  wait(0.5, () => {
                      destroy(flash);
                      
                      wait(0.2, () => {
                          tween(rifle.opacity, 0, 0.3, (o) => rifle.opacity = o);
                          wait(0.3, () => destroy(rifle));
                      });
                  });
              });
          });
      });
  }




  // ================== UPDATED ANIMATION USING LESS SPRITES - NOT APPLIED TO FELINE FISSION YET 
  function whiteFlash(zIndex = 9999) {
    return add([
      rect(width(), height()),
      pos(0, 0),
      fixed(),
      color(255, 255, 255),
      opacity(0),
      z(zIndex),
    ]);
  }
  
  function animateSuperSaiyanRefactor() {
  
    shake(50);
  
    const flash = add([
      rect(SCREEN_W, SCREEN_H),
      pos(0, 0),
      fixed(),
      color(255, 255, 255),
      opacity(0),
      z(2000),
    ]);
  
    const bg1 = add([
      sprite("finalMoveBG"),
      pos(SCREEN_W / 2, SCREEN_H / 2),
      anchor("center"),
      scale(5),
      fixed(),
      z(1000),
      opacity(0),
    ]);
  
    const lightning = add([
      sprite("lightning", { anim: "glitch" }),
      pos(0, 0),
      scale(10),
      fixed(),
      z(1001),
      opacity(0),
    ]);
  
    const fm1 = add([
      sprite("finalMove1", { anim: "fade" }),
      pos(SCREEN_W / 2, SCREEN_H / 2),
      scale(10),
      anchor("center"),
      fixed(),
      z(2002),
      opacity(0),
    ]);
  
    const fm2 = add([
      sprite("finalMove2", { anim: "fade" }),
      pos(SCREEN_W / 2, SCREEN_H / 2),
      scale(10),
      anchor("center"),
      fixed(),
      z(2002),
      opacity(0),
    ]);
  
    tween(bg1.opacity, 1, 0.3, v => bg1.opacity = v);
  
    wait(0.2, () => {
      lightning.opacity = 1;
      lightning.play("glitch", { speed: 15 });
    });
  
    play("lightning", { volume: 0.4, speed: 0.8 });
    wait(0.2, () => play("lightning", { volume: 0.2, speed: 0.8 }));
    wait(0.4, () => play("lightning", { volume: 0.4, speed: 0.8 }));
    wait(1, () => play("lightning", { volume: 0.3, speed: 0.8 }));
  
    wait(0.5, () => {
      tween(fm1.opacity, 1, 0.6, v => fm1.opacity = v);
      fm1.play("fade", { speed: 10 });
  
      wait(1.2, () => {
        tween(fm1.opacity, 0, 0.6, v => fm1.opacity = v);
      });
    });
  
    wait(1, () => {
  
      tween(flash.opacity, 1, 0.2, v => flash.opacity = v);
  
      wait(1, () => {
        tween(bg1.opacity, 0, 0.3, v => bg1.opacity = v);
  
        destroy(lightning);
        destroy(bg1);
  
        const bg2 = add([
          sprite("finalMoveBG", { anim: "fade" }),
          pos(SCREEN_W / 2, SCREEN_H / 2),
          anchor("center"),
          scale(5),
          fixed(),
          z(1000),
        ]);
  
        bg2.play("fade", { speed: 8 }); 
  
      
        tween(flash.opacity, 0, 0.3, v => flash.opacity = v);
  
        // ---------- FINAL MOVE 2 (late beat) ----------
        wait(3, () => {
          play("finalMoveZap", { volume: 0.2 });
          tween(fm2.opacity, 1, 0.5, v => fm2.opacity = v);
          fm2.play("fade", { speed: 10 });
  
          wait(1.1, () => {
            tween(fm2.opacity, 0, 0.2, v => fm2.opacity = v);
          });
        });
  
        // ---------- END FLASH ----------
        wait(4.3, () => {
          tween(flash.opacity, 1, 0.1, v => flash.opacity = v);
  
          wait(0.2, () => {
            tween(flash.opacity, 0, 0.5, v => flash.opacity = v);
            shake(100);
            destroy(fm2);
            destroy(fm1);
            destroy(bg2);
           
          });
        });
      });
    });
  }