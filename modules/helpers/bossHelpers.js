// bossHelpers.js - BOSS BATTLE SETUP AND ANIMATIONS
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { createVolumeToggle, stopAllMusic, startBossMusic } from '../utils/audioControls.js';

export function setupBossMusic() {
  startBossMusic();
}



export function addBossBackground(bossConfig) {
  add([
    sprite(bossConfig.background),
    pos(0, 0),
    scale(SCREEN_W / 1000, SCREEN_H / 480),
    z(0)
  ]);
}

export function addBattleSprites(character, bossConfig) {
  const playerGlow = add([
    sprite("glow"),
    pos(260, 240),
    anchor("center"),
    scale(1.05),
    opacity(1),
    z(0),
    "playerGlow"
  ]);

  const playerSprite = add([
    sprite(character.sprites.battle),
    pos(260, 240),
    anchor("center"),
    scale(1),
    opacity(1),
    z(1),
    "playerSprite"
  ]);
  
  const bossGlow = add([
    sprite(bossConfig.glowSprite || "glow"),
    pos(740, 120),
    anchor("center"),
    scale(1.05),
    opacity(1),
    z(0),
    "bossGlow"
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

  return { playerSprite, playerGlow, bossSprite, bossGlow };
}

export function addPlayerHPPanel(player) {
  add([
    rect(480, 85, { radius: 50 }),
    pos(450, 250),
    color(rgb(144,144,192)),
    opacity(1),
    outline(4, rgb(42,52,57)),
    z(10)
  ]);

  add([
    rect(480, 85, { radius: 50 }),
    pos(450, 250),
    color(Color.fromHex(Colors.MintBlue)),
    opacity(1),
    outline(9, rgb(101,115,131)),
    z(9)
  ]);


  add([
      rect(452, 75, { radius: 50 }),
      pos(455, 251),
      color(rgb(219,226,233)),
      opacity(0.3),
      z(11)
    ]);

  add([
    text(player.name, { size: 23, font: "orbitronBold" }),
    pos(488, 271),
    anchor("left"),
    color(0, 0, 0),
    z(13)
  ]);

  add([
    text(player.name, { size: 23, font: "orbitronBold" }),
    pos(489, 272),
    anchor("left"),
    color(255, 255, 255),
    z(12)
  ]);

  add([
    text("HP:", { size: 20, font: "orbitronBold" }),
    pos(498, 287),
    color(Color.fromHex(Colors.Black)),
    z(13)
  ]);

  add([
    text("HP:", { size: 20, font: "orbitronBold" }),
    pos(499, 288),
    color(Color.fromHex('#FFFFFF')),
    z(12)
  ]);

  add([
    rect(350, 15, { radius: 8 }),
    pos(545, 288 ),
    color(0, 0, 0),
    opacity(1),
    outline(10, Color.fromHex(Colors.DarCoolGrey)),
    z(12)
  ]);

  const playerHPBar = add([
    rect(350, 15, { radius: 8 }),
    pos(545, 288),
    color(Color.fromHex(Colors.UraniumGreen)),
    z(13),
    "playerHPBar"
  ]);

  const playerHPText = add([
    text(`${player.hp} / ${player.maxHP}`, { size: 18, font: "orbitron" }),
    pos(890, 320),
    anchor("right"),
    color(0, 0, 0),
    z(13)
  ]);

  return { playerHPBar, playerHPText };
}

export function addBossHPPanel(boss) {
 add([
    rect(480, 85, { radius: 50 }),
    pos(70, 20),
    color(rgb(144,144,192)),
    opacity(1),
    outline(4, rgb(42,52,57)),
    z(10)
  ]);

  add([
    rect(480, 85, { radius: 50 }),
    pos(70, 20),
    color(Color.fromHex(Colors.MintBlue)),
    opacity(1),
    outline(9, rgb(101,115,131)),
    z(9)
  ]);


    add([
      rect(452, 75, { radius: 50 }),
      pos(75, 19),
      color(rgb(219,226,233)),
      opacity(0.3),
      z(11)
    ]);


  add([
    text(boss.name, { size: 22, font: "orbitronBold" }),
    pos(104, 42),
    anchor("left"),
    color(255, 255, 255),
    z(12)
  ]);

  add([
    text(boss.name, { size: 22, font: "orbitronBold" }),
    pos(103, 41),
    anchor("left"),
    color(0, 0, 0),
    z(13)
  ]);

  add([
    text("HP:", { size: 20, font: "orbitronBold" }),
    pos(116, 56),
    color(Color.fromHex(Colors.White)),
    z(12)
  ]);

  add([
    text("HP:", { size: 20, font: "orbitronBold" }),
    pos(115, 56),
    color(Color.fromHex('#000000')),
    z(13)
  ]);

  add([
    rect(350, 15, { radius: 8 }),
    pos(170, 58),
    color(0, 0, 0),
    opacity(1),
    outline(8, Color.fromHex(Colors.DarCoolGrey)),
    z(12)
  ]);



  const bossHPBar = add([
    rect(350, 15, { radius: 8 }),
    pos(170, 58),
    color(Color.fromHex(Colors.UraniumGreen)),
    z(13),
    "bossHPBar"
  ]);

  const bossHPText = add([
    text(`${boss.hp} / ${boss.maxHP}`, { size: 18, font: "orbitron" }),
    pos(500, 88),
    anchor("right"),
    color(0, 0, 0),
    z(14)

  ]);

  return { bossHPBar, bossHPText };
}

export function addBattleLogPanel(initialMessage) {

  add([
    rect(980, 125, { radius: 25 }),
    pos(10, 350),
    color(rgb(101,115,131)),
    opacity(1.0),
    z(8)
  ]);

  add([
    rect(570, 115, { radius: 30 }),
    pos(25, 355),
    color(rgb(144,144,192)),
    opacity(1),
    outline(1, rgb(42,52,57)),
    z(9)
  ]);

    add([
    rect(565, 110, { radius: 30 }),
    pos(25, 355),
    color(rgb(255,255,255)),
    opacity(0.3),
    z(10)
  ]);

  const logText = add([
    text(initialMessage, { size: 24, font: "narrow", width: 530 }),
    pos(47, 370),
    color(0, 0, 0),
    z(11),
    "logText"
  ]);

  return logText;
}

export function addMoveButtonsPanel() {
  add([
    rect(370, 115, { radius: 15 }),
    pos(605, 355),
    color(rgb(144,144,192)),
    opacity(1),
    outline(1, rgb(42,52,57)),
    z(9)
  ]);


  add([
    rect(365, 110, { radius: 15 }),
    pos(605, 355),
    color(255,255,255),
    opacity(0.3),
    z(10)
  ]);
}

export function createMoveButtons(player, onMoveClick, gameStateGetter) {
  const moveButtons = [];
  const moveNames = Object.keys(player.moves);

  moveNames.forEach((moveName, i) => {
    const moveData = player.moves[moveName];
    const x = i % 2 === 0 ? 607 : 791;
    const y = i < 2 ? 365 : 415;
    
    const btn = add([
      rect(182, 45, { radius: 15 }),
      pos(x, y),
      color(rgb(144,144,192)),
      area(),
      opacity(0),
      z(11),
      {
        moveName: moveName,
        moveData: moveData,
        enabled: moveData.uses > 0
      },
      "moveBtn"
    ]);

    const btnText = btn.add([
      text(`${moveName} (${moveData.uses})`, { size: 24, font: "narrowBold" }),
      pos(85, 25),
      anchor("center"),
      color(0, 0, 0),
      z(12)
    ]);

    btn.onClick(() => {
      if (gameStateGetter() && btn.enabled) {
        onMoveClick(moveName);
      }
    });

    btn.onHover(() => {
      if (btn.enabled) {
        btn.color = Color.fromHex(Colors.VortexViolet);
        btn.opacity = 1;
      }
    });

    btn.onHoverEnd(() => {
      btn.color = Color.fromHex(Colors.MutedGrey);
      btn.opacity = 0;
    });

    moveButtons.push({ btn, btnText, moveName });
  });

  return moveButtons;
}

export function updateHPBars(player, boss, playerHPBar, playerHPText, bossHPBar, bossHPText) {
  const currentHP = parseInt(player.hp) || 0;
  const maxHP = parseInt(player.maxHP) || 1;
  const hpPercent = currentHP / maxHP;
  
  playerHPBar.width = 350 * hpPercent;
  playerHPText.text = `${currentHP} / ${maxHP}`;
  
  const bossCurrentHP = parseInt(boss.hp) || 0;
  const bossMaxHP = parseInt(boss.maxHP) || 1;
  const bossHPPercent = bossCurrentHP / bossMaxHP;
  
  bossHPBar.width = 350 * bossHPPercent;
  bossHPText.text = `${bossCurrentHP} / ${bossMaxHP}`;
}

export function updateMoveButtons(moveButtons, player) {
  moveButtons.forEach(({ btn, btnText, moveName }) => {
    const move = player.moves[moveName];
    btn.enabled = move.uses > 0;
    btnText.text = `${moveName} (${move.uses})`;
    
    if (!btn.enabled) {
      btn.color = rgb(100, 100, 100);
      btn.opacity = 0.5;
    }
  });
}

// ================================================== ANIMATIONS ==================================================
export function animateAttack(sprite, glow, isPlayer) {
  const originalX = sprite.pos.x;
  const slideDistance = isPlayer ? 100 : -100;
  
  tween(
    sprite.pos.x,
    originalX + slideDistance,
    0.2,
    (val) => {
      sprite.pos.x = val;
      glow.pos.x = val;
    },
    easings.easeOutQuad
  ).then(() => {
    tween(
      sprite.pos.x,
      originalX,
      0.2,
      (val) => {
        sprite.pos.x = val;
        glow.pos.x = val;
      },
      easings.easeInQuad
    );
  });
}

export function animateHit(sprite, glow) {
  const originalX = sprite.pos.x;
  const shakeAmount = 10;
  const shakeDuration = 0.05;
  
  tween(sprite.pos.x, originalX - shakeAmount, shakeDuration, (val) => {
    sprite.pos.x = val;
    glow.pos.x = val;
  })
    .then(() => tween(sprite.pos.x, originalX + shakeAmount, shakeDuration, (val) => {
      sprite.pos.x = val;
      glow.pos.x = val;
    }))
    .then(() => tween(sprite.pos.x, originalX - shakeAmount, shakeDuration, (val) => {
      sprite.pos.x = val;
      glow.pos.x = val;
    }))
    .then(() => tween(sprite.pos.x, originalX + shakeAmount, shakeDuration, (val) => {
      sprite.pos.x = val;
      glow.pos.x = val;
    }))
    .then(() => tween(sprite.pos.x, originalX, shakeDuration, (val) => {
      sprite.pos.x = val;
      glow.pos.x = val;
    }));
}

export function animateHeal(sprite, glow) {
  tween(sprite.opacity, 0.3, 0.3, (val) => {
    sprite.opacity = val;
    glow.opacity = val;
  })
    .then(() => tween(sprite.opacity, 1, 0.3, (val) => {
      sprite.opacity = val;
      glow.opacity = val;
    }))
    .then(() => tween(sprite.opacity, 0.3, 0.3, (val) => {
      sprite.opacity = val;
      glow.opacity = val;
    }))
    .then(() => tween(sprite.opacity, 1, 0.3, (val) => {
      sprite.opacity = val;
      glow.opacity = val;
    }));
}

export function animateDefeat(sprite, glow, isPlayer) {
  const slideDirection = isPlayer ? -300 : 300;
  const targetX = sprite.pos.x + slideDirection;
  
  tween(
    sprite.opacity,
    0,
    1.0,
    (val) => {
      sprite.opacity = val;
      glow.opacity = val;
    },
    easings.easeInQuad
  );
  
  tween(
    sprite.pos.x,
    targetX,
    1.0,
    (val) => {
      sprite.pos.x = val;
      glow.pos.x = val;
    },
    easings.easeInQuad
  );
}

// ============================================================================
// FANCY  ANIMATIONS
// ============================================================================

// ========================= GENERAL =========================
export function animateKaBAM(target) {
  shake(20);
  const kabam = add([
    sprite("bam", { anim: "glitch" }),
    pos(target.pos),
    scale(6),
    anchor("center"),
    z(40),
    opacity(1)
  ]);

  wait(0.4, () => destroy(kabam))
}


export function animateGhostPoof(target) {
  const pooooof = add([
    sprite("poof", { anim: "burst" }),
    pos(target.pos),
    scale(2),
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
    sprite("poof", { anim: "burst" }),
    pos(target.pos),
    scale(3),
    opacity(1),
    z(12),
    anchor("center")
    ]);

  wait(0.3, () => {
    tween(pooooof.opacity, 0, 0.25, (o) => pooooof.opacity = o, easings.easeOutQuad)
      .then(() => destroy(pooooof));
    });
}

export function animateRedBoom(target) {
  shake(30);
  const boom = add([
    sprite("boom", { anim: "burst" }),
    pos(target.pos),
    scale(4),
    opacity(1),
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
  shake(30);
  const boom = add([
    sprite("explosion", { anim: "burst" }),
    pos(target.pos),
    scale(4),
    opacity(1),
    z(100),
    anchor("center")
  ]);
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
    scale(3),
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
    sprite("smoke", { anim: "puff" }),
    pos(target.pos.add(rand(-20, 20), rand(-20, 20))),
    scale(4),
    opacity(0),
    z(95),
    anchor("center")
  ]);
  tween(poof.opacity, 0.7, 0.5, (o) => poof.opacity = o, easings.easeOutQuad);
  tween(poof.pos.y, poof.pos.y - 50, 1.2, (y) => poof.pos.y = y, easings.easeOutQuad);
  wait(0.3, () => {
    tween(poof.opacity, 0, 0.9, (o) => poof.opacity = o, easings.easeOutQuad)
      .then(() => destroy(poof));
  });
}

export function animateSwirl(target) {
  const aura = add([
    sprite("swirl", { anim: "spin" }),
    pos(target.pos),
    scale(2.5),
    opacity(0),
    z(85),
    anchor("center")
  ]);
  tween(aura.opacity, 0.7, 0.3, (o) => aura.opacity = o, easings.easeOutQuad);
  aura.onUpdate(() => {
    aura.angle += 180 * dt();
    aura.pos = target.pos.add(0, -40); 
  });
  const startScale = 2.5;
  const endScale = 3.5;
  tween(startScale, endScale, 1.5, (s) => aura.scale = vec2(s), easings.easeInOutSine);
  wait(1.5, () => {
    tween(aura.opacity, 0, 0.5, (o) => aura.opacity = o, easings.easeInQuad)
      .then(() => destroy(aura));
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
        sprite("scratch", { anim: "glitch" }),
        pos(target.pos.add(offsets[i])),
        scale(10),
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

    wait(1.0, () => {
      tween(paws.opacity, 0, 1, (o) => paws.opacity = o)
        .then(() => destroy(paws));
    });
  }

export function animateClaw(attacker, target) {
  shake(20);
  const startX = target.pos.x-50;
  const endX = target.pos.x - 250;
  
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
    sprite("zap", { anim: "glitch" }),
    pos(target.pos),
    scale(8),
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
      shake(25);
      destroy(beam);
    });
  });
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
      shake(10);

      const shot = add([
        sprite("littleCucumber"),
        pos(attacker.pos),
        scale(1.5),
        anchor("center"),
        z(30)
      ]);

      tween(shot.pos, target.pos, 0.45, (p) => shot.pos = p, easings.easeOutQuad)
        .then(() => {
          animateExplosion(target);
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
    sprite("bam", { anim: "glitch" }),
    pos(attacker.pos.add(-40, 20)),
    scale(4),
    anchor("center"),
    z(40),
    opacity(1)
  ]);

  wait(0.25, () => destroy(flash));

  const count = randi(3, 5);

  for (let i = 0; i < count; i++) {
    wait(i * 0.12, () => {
      const ratProj = add([
        sprite("smallRat"),
        pos(attacker.pos.add(-30, 30)),
        scale(5),
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
                    animatePoooof(boss);
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
        play("cupFinishHim");
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
      play("laserFinishHim");

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
  export function animateFelineFission(boss) {
      shake(30);
      play("finalFinishHim");
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
              tween(flash2.opacity, 1, 0.3, (val) => flash2.opacity = val, easings.easeInQuad); // LINGERING FULL WHITE SCREEN 
              
             // wait(1.5, () => {
              //    for (let i = 0; i < 12; i++) { // FILL SCREEN WITH SMOKE
               //       const xPos = (i % 4) * (width() / 3) + rand(-50, 50);
             //         const yPos = Math.floor(i / 4) * (height() / 2) + rand(-50, 50);
              //        const poof = add([ // SMOKE
              //            sprite("smoke", { anim: "puff" }),
              //            pos(xPos, yPos),
              //            scale(6 + rand(-1, 1)),
              //            opacity(0),
              //            z(9999),
              //            anchor("center"),
              //            fixed(),
              //        ]);
              //        poof.play("puff", { loop: true });
                      
              //        wait(i * 0.03, () => { // FILL SCREEN WITH SMOKE
              //            tween(poof.opacity, 0.8, 0.3, (o) => poof.opacity = o);
              //            tween(poof.pos.y, poof.pos.y + rand(-30, 30), 2, (y) => poof.pos.y = y, easings.easeOutQuad); // DRIFT SMOKE
                          
             //             wait(1.5, () => { // FADE OUT SMOKE
              //                shake(10);
                //              tween(poof.opacity, 0, 1.0, (o) => poof.opacity = o, easings.easeOutQuad)
               //                   .then(() => destroy(poof));
               //           });
              //        });
               //   }
              //    wait(0.35, () => { // FADE WHITE OUT SLOWLY
              //        tween(flash2.opacity, 0, 1.2, (val) => flash2.opacity = val, easings.easeOutQuad);
              //        wait(1.2, () => destroy(flash2));
                      
              //    });
         //     });
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
      play("cucumberFinishHim"); 

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
              sprite("lock2", { anim: "glitch" }),
              pos(boss.pos.add(vec2(-90, -70))),
              scale(2),
              opacity(0),
              z(150),
          ]);
          
          wait(0.6, () => {
              tween(lock.opacity, 0.8, 0.2, (o) => lock.opacity = o);
              lock.play("glitch", { loop: false, speed: 30 });
          });
          play("ratFinishHim");
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
                  //const boom = add([ // PINK BOOM ON boss
                    //  sprite("pinkBoom", { anim: "burst" }),
                      //pos(boss.pos.add(vec2(-150, -190))),
                     // scale(0.6),
                      //z(50),
                  //]);
                  
                 // tween(boom.scale, vec2(8, 8), 0.4, (s) => boom.scale = s, easings.easeOutQuad); // GROW PINK BOOM
                 // boom.play("burst", { loop: false, speed: 12 });
                 animateKaBAM(boss);
                  shake(45);
                  wait(0.5, () => {
                      destroy(flash);
                     // destroy(boom);
                      
                      wait(0.2, () => {
                          tween(rifle.opacity, 0, 0.3, (o) => rifle.opacity = o);
                          wait(0.3, () => destroy(rifle));
                      });
                  });
              });
          });
      });
  }