// mainMenu.js
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { getCharacterList, SPRITE_FRAMES, SPRITE_SCALES } from '../config/characters.js';
import { stopAllMusic, startMenuMusic, openHowToPlayModal, openAboutCatsModal, stopAtmosphere } from '../helpers/kittyHelpers.js';


export function createStartScene(){
  add([
    sprite('startBG'),
    pos(0, 0),
    z(0)
  ]);

  const clickText = add([
    text("CLICK TO START", { 
      size: 70, 
      font: "orbitronBold"
    }),
    pos(SCREEN_W / 2, 400),
    anchor("center"),
    color(255, 255, 255),
    z(3),
    opacity(1)
  ]);

  const clickText2 = add([
    text("CLICK TO START", { 
      size: 70, 
      font: "orbitronBold"
    }),
    pos(SCREEN_W / 2 +2, 402),
    anchor("center"),
    color(0, 0, 0),
    z(2),
    opacity(1)
  ]);

  let pulseDirection = -1;
  clickText.onUpdate(() => {
    clickText.opacity += pulseDirection * 2 * dt();
    if (clickText.opacity <= 0.3) {
      pulseDirection = 1;
    } else if (clickText.opacity >= 1) {
      pulseDirection = -1;
    }
  });

  onClick(() => {
    stopAtmosphere();
    startMenuMusic();
    go("menu");
  });

  onKeyPress("space", () => {
    stopAtmosphere();
    startMenuMusic();
    go("menu");
  });

  onKeyPress("enter", () => {
    stopAtmosphere();
    startMenuMusic();
    go("menu");
  });
}

export function createMainMenuScene() {
  const mainMenuButtons = document.getElementById('mainMenuButtons');
  if (mainMenuButtons) mainMenuButtons.classList.remove('hidden');

  const menuBG = add([
    sprite('menuBG'),
    pos(0, 0),
    scale(SCREEN_W / 1000, SCREEN_H / 480),
    z(0)
  ]);

  const titlePanel = add([
    rect(800, 100, { radius: 30 }),
    pos(center().x - 400, 30),
    color(17, 12, 30),
    outline(6),
    z(1)
  ]);
  
  titlePanel.onUpdate(() => {
    const h = (time() * 30) % 360 / 360;  
    titlePanel.outline.color = hsl2rgb(h, 0.9, 0.6);
  });

  add([
    text("CATastrophe 2", { size: 80, font: "orbitronBold" }),
    pos(center().x, 80),
    anchor("center"),
    color(rgb(255, 255, 255)),
    z(5)
  ]);

  add([
    text("CATastrophe 2", { size: 80, font: "orbitronBold" }),
    pos(center().x + 2, 82),
    anchor("center"),
    color(rgb(115,1,50)),
    z(4)
  ]);

  add([
    text("CATastrophe 2", { size: 80, font: "orbitronBold" }),
    pos(center().x + 4, 84),
    anchor("center"),
    color(rgb(0, 255, 255)),
    opacity(0.8),
    z(3)
  ]);

  add([
    text("CATastrophe 2", { size: 80, font: "orbitronBold" }),
    pos(center().x + 8, 88),
    anchor("center"),
    color(rgb(220, 76, 232)),
    opacity(0.5),
    z(2)
  ]);

  const playBtn = document.getElementById('playBtn');
  const howToPlayBtn = document.getElementById('howToPlayBtn');
  const meetCatsBtn = document.getElementById('meetCatsBtn');

  if (playBtn) {
    playBtn.onclick = () => {
      mainMenuButtons.classList.add('hidden');
      go("charSelect");
    };
  }

  if (howToPlayBtn) {
    howToPlayBtn.onclick = () => openHowToPlayModal();
  }

  if (meetCatsBtn) {
    meetCatsBtn.onclick = () => openAboutCatsModal();
  }

  onSceneLeave(() => {
    if (mainMenuButtons) mainMenuButtons.classList.add('hidden');
  });
}

export function createCharSelectScene() {
  let selectedIndex = null;
  let animationComplete = false; 
  let shopMusic = null;

  const charSelectButtons = document.getElementById('charSelectButtons');
  if (charSelectButtons) charSelectButtons.classList.remove('hidden');

  const blackOverlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(1),
    z(100),
    "blackOverlay"
  ]);

  const whiteOverlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(254, 228, 180),  
    opacity(0),
    z(99),
    "whiteOverlay"
  ]);

  const cafeSprite = add([
    sprite("cafeDay", { frame: 0 }),
    pos(SCREEN_W / 2, SCREEN_H / 2),
    anchor("center"),
    scale(2, 2), 
    z(98),
    opacity(0),
    "cafeSprite"
  ]);

  const doorX = SCREEN_W / 2;
  const doorY = SCREEN_H * 0.7;

  const START_SCALE = 2.0;
  const MID_SCALE = 5.5;    
  const END_SCALE = 8.0;     
  
  const midOffsetX = (SCREEN_W / 2 - doorX) * (MID_SCALE - START_SCALE) / START_SCALE;
  const midOffsetY = (SCREEN_H / 2 - doorY) * (MID_SCALE - START_SCALE) / START_SCALE;
  const finalOffsetX = (SCREEN_W / 2 - doorX) * (END_SCALE - START_SCALE) / START_SCALE;
  const finalOffsetY = (SCREEN_H / 2 - doorY) * (END_SCALE - START_SCALE) / START_SCALE;

  wait(0, () => {
    tween(blackOverlay.opacity, 0, 1.0, (val) => blackOverlay.opacity = val, easings.easeOutQuad);
    tween(cafeSprite.opacity, 1, 1.0, (val) => cafeSprite.opacity = val, easings.easeOutQuad);
    
    wait(1.7, () => {
      tween(
        START_SCALE, 
        MID_SCALE, 
        2.5, 
        (val) => {
          cafeSprite.scale = vec2(val, val);
          const progress = (val - START_SCALE) / (MID_SCALE - START_SCALE);
          const offsetX = midOffsetX * progress;
          const offsetY = midOffsetY * progress;
          cafeSprite.pos = vec2(SCREEN_W / 2 + offsetX, SCREEN_H / 2 + offsetY);
        },
        easings.easeInOutQuad
      );
      
      wait(2.2, () => {
        cafeSprite.frame = 1;
        play("door", { volume: 0.5 });
        wait(0.3, () => {
          tween(
            MID_SCALE,
            END_SCALE,
            1.0,
            (val) => {
              cafeSprite.scale = vec2(val, val);
              const progress = (val - START_SCALE) / (END_SCALE - START_SCALE);
              const offsetX = finalOffsetX * progress;
              const offsetY = finalOffsetY * progress;
              cafeSprite.pos = vec2(SCREEN_W / 2 + offsetX, SCREEN_H / 2 + offsetY);
            },
            easings.easeInQuad  
          );
        });
      });
      
      wait(3.5, () => {
        tween(whiteOverlay.opacity, 1, 0.8, (val) => whiteOverlay.opacity = val, easings.easeInQuad);
        
        wait(0.8, () => {
          tween(whiteOverlay.opacity, 0, 0.8, (val) => whiteOverlay.opacity = val, easings.easeOutQuad);
          cafeSprite.opacity = 0;
          
          fadeInUI();
          shopMusic = play("shop", { volume: 0.3, loop: true });
          
          wait(0.8, () => {
            animationComplete = true;
            destroy(blackOverlay);
            destroy(whiteOverlay);
            destroy(cafeSprite);
          });
        });
      });
    });
  });

  const regularBG = add([
    sprite("SelectBG"), 
    pos(0, 0),
    scale(SCREEN_W/500, SCREEN_H/240), 
    opacity(0),
    z(0),
    "regularBG"
  ]);
  
  const menuBoard = add([
    rect(450, 240, { radius: 8 }),
    pos(30, 15),
    color(rgb(0, 0, 0)),
    outline(5, rgb(139, 69, 19)),
    opacity(0), 
    z(3)
  ]);

  const menuBoard0 = add([
    rect(453, 243, { radius: 8 }),
    pos(30, 15),
    color(rgb(81, 40, 11)),
    outline(5, rgb(81, 40, 11)),
    opacity(0), 
    z(2)
  ]);

  const menuBoard00 = add([
    rect(453, 243, { radius: 8 }),
    pos(32, 18),
    color(rgb(0, 0, 0)),
    outline(5, rgb(0, 0, 0)),
    opacity(0),  
    z(1)
  ]);

  const menuBoard2 = add([
    rect(440, 230, { radius: 8 }),
    pos(37, 22),
    color(rgb(255, 255, 255)),
    opacity(0),  
    z(4)
  ]);

  const menuTitle1 = add([
    text("SPECIALS", { 
      size: 28, 
      font: "science",
      weight: "bold"
    }),
    pos(260, 44),
    anchor("center"),
    color(255, 255, 255),
    opacity(0),  
    z(4)
  ]);

  const menuTitle2 = add([
    text("SPECIALS", { 
      size: 28, 
      font: "science",
      weight: "bold"
    }),
    pos(262, 46),
    anchor("center"),
    color(rgb(115, 1, 50)),
    opacity(0),  
    z(3)
  ]);

  const characters = getCharacterList();
  
  const catPositions = [
    [65, 68], [205, 68], [345, 68],
    [65, 160], [205, 160], [345, 160]
  ];

  const characterCards = [];
  const charSprites = [];
  const charMenuNames = [];

  catPositions.forEach((position, i) => {
    const [x, y] = position;
    const char = characters[i];
    const charName = char.name;
    
    const card = add([
      rect(115, 80, { radius: 5 }),
      pos(x, y),
      color(rgb(40, 40, 40)),
      outline(2, rgb(200, 200, 200)),
      area(),
      opacity(0),  
      z(6),
      { index: i }
    ]);

    const charSprite = card.add([
      sprite(`${charName}Sheet`, { frame: SPRITE_FRAMES.menu }),
      pos(25, 35),
      anchor("center"),
      scale(0.6),
      opacity(0),
      z(8),
    ]);

    const charMenuName = card.add([
      text(char.name, { 
        size: 12, 
        font: "science",
        weight: "bold"
      }),
      pos(65, 40),
      anchor("left"),
      color(255, 255, 255),
      opacity(0),
      z(8),
    ]);

    card.onClick(() => {
      if (!animationComplete) return;
      
      selectedIndex = i;
      
      characterCards.forEach((c, idx) => {
        if (idx === i) {
          c.outline.width = 3;
          c.outline.color = rgb(88, 232, 76);
          c.color = rgb(20, 20, 20);
        } else {
          c.outline.width = 2;
          c.outline.color = rgb(200, 200, 200);
          c.color = rgb(40, 40, 40);
        }
      });

      updatePreview(i);
      
      const confirmBtn = document.getElementById('confirmCharBtn');
      if (confirmBtn) confirmBtn.classList.remove('disabled');
    });

    card.onHover(() => {
      if (!animationComplete) return;
      if (card.index !== selectedIndex) {
        card.outline.color = rgb(255, 200, 100);
        card.color = rgb(60, 50, 40);
      }
    });

    card.onHoverEnd(() => {
      if (card.index !== selectedIndex) {
        card.outline.color = rgb(200, 200, 200);
        card.color = rgb(40, 40, 40);
      }
    });

    characterCards.push(card);
    charSprites.push(charSprite);
    charMenuNames.push(charMenuName);
  });

  const statsBoard = add([
    rect(280, 240, { radius: 8 }),
    pos(687, 15),
    color(rgb(10, 10, 10)),
    outline(5, rgb(107, 54, 17)),
    opacity(0),  
    z(4)
  ]);

  const statsBoard0 = add([
    rect(283, 243, { radius: 8 }),
    pos(687, 15),
    color(rgb(81, 40, 11)),
    outline(5, rgb(81, 40, 11)),
    opacity(0),  
    z(2)
  ]);

  const statsBoard00 = add([
    rect(283, 243, { radius: 8 }),
    pos(689, 18),
    color(rgb(0, 0, 0)),
    outline(5, rgb(0, 0, 0)),
    opacity(0),  
    z(1)
  ]);

  const statsBoard2 = add([
    rect(267, 228, { radius: 8 }),
    pos(695, 23),
    color(rgb(255, 255, 255)),
    opacity(0),  
    z(4)
  ]);

  const statsTitle1 = add([
    text("STATS", { 
      size: 28, 
      font: "science",
      weight: "bold"
    }),
    pos(830, 50),
    anchor("center"),
    color(255, 255, 255),
    opacity(0),  
    z(6)
  ]);

  const statsTitle2 = add([
    text("STATS", { 
      size: 28, 
      font: "science",
      weight: "bold"
    }),
    pos(832, 52),
    anchor("center"),
    color(rgb(115, 1, 50)),
    opacity(0),  
    z(5)
  ]);

  const statLabels = {
    hp: add([
      text("HP", { size: 18, font: "science" }),
      pos(710, 95),
      color(255, 255, 255),
      z(5),
      opacity(0)
    ]),
    atk: add([
      text("ATK", { size: 18, font: "science" }),
      pos(710, 130),
      color(255, 255, 255),
      z(5),
      opacity(0)
    ]),
    def: add([
      text("DEF", { size: 18, font: "science" }),
      pos(710, 165),
      color(255, 255, 255),
      z(5),
      opacity(0)
    ]),
    spd: add([
      text("SPD", { size: 18, font: "science" }),
      pos(710, 200),
      color(255, 255, 255),
      z(5),
      opacity(0)
    ])
  };

  const statDots = {
    hp: add([
      text(".......................", { size: 16, font: "science" }),
      pos(770, 95),
      color(rgb(100, 100, 100)),
      z(5),
      opacity(0)
    ]),
    atk: add([
      text(".......................", { size: 16, font: "science" }),
      pos(770, 130),
      color(rgb(100, 100, 100)),
      z(5),
      opacity(0)
    ]),
    def: add([
      text(".......................", { size: 16, font: "science" }),
      pos(770, 165),
      color(rgb(100, 100, 100)),
      z(5),
      opacity(0)
    ]),
    spd: add([
      text(".......................", { size: 16, font: "science" }),
      pos(770, 200),
      color(rgb(100, 100, 100)),
      z(5),
      opacity(0)
    ])
  };

  const statValues = {
    hp: add([
      text("120", { size: 20, font: "science", weight: "bold" }),
      pos(950, 95),
      anchor("right"),
      color(rgb(103, 254, 189)),
      z(5),
      opacity(0)
    ]),
    atk: add([
      text("37", { size: 20, font: "science", weight: "bold" }),
      pos(950, 130),
      anchor("right"),
      color(rgb(255, 199, 255)),
      z(5),
      opacity(0)
    ]),
    def: add([
      text("30", { size: 20, font: "science", weight: "bold" }),
      pos(950, 165),
      anchor("right"),
      color(rgb(0, 255, 255)),
      z(5),
      opacity(0)
    ]),
    spd: add([
      text("38", { size: 20, font: "science", weight: "bold" }),
      pos(950, 200),
      anchor("right"),
      color(rgb(165, 90, 255)),
      z(5),
      opacity(0)
    ])
  };

  add([
    text("...", { 
      size: 24, 
      font: "science",
      weight: "bold"
    }),
    pos(500, 240),
    anchor("center"),
    color(255, 255, 255),
    z(10),
    opacity(0),
    "orderTitle"
  ]);

  add([
    text("...", { 
      size: 24, 
      font: "science",
      weight: "bold"
    }),
    pos(502, 242),
    anchor("center"),
    color(rgb(0, 0, 0)),
    z(9),
    opacity(0),
    "orderTitleShadow"
  ]);

  const previewSprite = add([
    sprite(`${characters[0].name}Sheet`, { frame: SPRITE_FRAMES.select }),
    pos(500, 370),
    anchor("center"),
    scale(SPRITE_SCALES.select),
    z(10),
    opacity(0),
    "preview"
  ]);





  
  const characterNameDisplay = add([
    text("", { 
      size: 45, 
      font: "science",
      weight: "bold"
    }),
    pos(500, 453),
    anchor("center"),
    color(rgb(103, 254, 189)),
    z(14),
    opacity(0),
    "charNameDisplay"
  ]);

  const characterNameShadow = add([
    text("", { 
      size: 45, 
      font: "science",
      weight: "bold"
    }),
    pos(503, 456),
    anchor("center"),
    color(rgb(0, 0, 0)),
    z(13),
    opacity(0),
    "characterNameShadow"
  ]);


  const previewBG = add([
    rect(250, 55, { radius: 10 }),
    pos(375, 420),
    color(rgb(0, 0, 0)),
    outline(3, rgb(103, 254, 189)),
    opacity(0),  
    z(11),
    "previewBG"
  ]);

    const previewBG2 = add([
      rect(248, 52, { radius: 10 }),
      pos(376, 421),
      color(rgb(103, 254, 189)),
      opacity(0),  
      z(12),
    "previewBG2"
  ]);



  function updatePreview(index) {
    const char = characters[index];
    
    previewSprite.use(sprite(`${char.name}Sheet`, { frame: SPRITE_FRAMES.select }));
    previewSprite.scale = vec2(SPRITE_SCALES.select, SPRITE_SCALES.select);
    previewSprite.opacity = 1;

    previewBG.opacity = 0.9;
    previewBG2.opacity = 0.2;
    
    characterNameDisplay.text = char.name;
    characterNameDisplay.opacity = 1;
    characterNameShadow.text = char.name;
    characterNameShadow.opacity = 1;
    
    get("orderTitle").forEach(t => t.opacity = 0);
    get("orderTitleShadow").forEach(t => t.opacity = 0);

    statValues.hp.text = char.stats.maxHP.toString();
    statValues.atk.text = char.stats.baseAtk.toString();
    statValues.def.text = char.stats.baseDefense.toString();
    statValues.spd.text = char.stats.baseSpeed.toString();

    Object.values(statLabels).forEach(label => label.opacity = 1);
    Object.values(statValues).forEach(value => value.opacity = 1);
    Object.values(statDots).forEach(dot => dot.opacity = 1);
  }

  function fadeInUI() {
    tween(regularBG.opacity, 1, 0.8, (val) => regularBG.opacity = val);
    
    tween(menuBoard.opacity, 0.95, 0.8, (val) => menuBoard.opacity = val);
    tween(menuBoard0.opacity, 0.95, 0.8, (val) => menuBoard0.opacity = val);
    tween(menuBoard00.opacity, 0.55, 0.8, (val) => menuBoard00.opacity = val);
    tween(menuBoard2.opacity, 0.2, 0.8, (val) => menuBoard2.opacity = val);
    
    tween(statsBoard.opacity, 0.9, 0.8, (val) => statsBoard.opacity = val);
    tween(statsBoard0.opacity, 0.95, 0.8, (val) => statsBoard0.opacity = val);
    tween(statsBoard00.opacity, 0.55, 0.8, (val) => statsBoard00.opacity = val);
    tween(statsBoard2.opacity, 0.2, 0.8, (val) => statsBoard2.opacity = val);
    
    tween(menuTitle1.opacity, 1, 0.8, (val) => menuTitle1.opacity = val);
    tween(menuTitle2.opacity, 1, 0.8, (val) => menuTitle2.opacity = val);
    tween(statsTitle1.opacity, 1, 0.8, (val) => statsTitle1.opacity = val);
    tween(statsTitle2.opacity, 1, 0.8, (val) => statsTitle2.opacity = val);
    
    characterCards.forEach(card => {
      tween(card.opacity, 1, 0.8, (val) => card.opacity = val);
    });

    charSprites.forEach(charSprite => {
      tween(charSprite.opacity, 1, 0.8, (val) => charSprite.opacity = val);
    });

    charMenuNames.forEach(charMenuName => {
      tween(charMenuName.opacity, 1, 0.8, (val) => charMenuName.opacity = val);
    });
  }

  const backBtn = document.getElementById('charSelectBackBtn');
  const confirmBtn = document.getElementById('confirmCharBtn');

  if (backBtn) {
    backBtn.onclick = () => {
      if (!animationComplete) return;
      if (shopMusic) shopMusic.stop();
      charSelectButtons.classList.add('hidden');
      go("menu");
    };
  }

  if (confirmBtn) {
    confirmBtn.onclick = () => {
      if (selectedIndex === null || !animationComplete) return;
      if (shopMusic) shopMusic.stop();
      playPourAnimation(() => {
        const char = characters[selectedIndex];
        charSelectButtons.classList.add('hidden');
        go("transition", "Transition1", char);
      });
    };
  }

  onSceneLeave(() => {
    if (charSelectButtons) charSelectButtons.classList.add('hidden');
  });
}

function playPourAnimation(onComplete) {
  const music = get("shop")[0];
  if (music) music.stop();

  const brownOverlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(92, 64, 51),
    opacity(0),
    z(180),
    "pourBrownOverlay",
  ]);

  const blackOverlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0),
    z(200),
    "pourBlackOverlay",
  ]);

  play("pour", { volume: 0.3 });

  const POUR_COUNT = 3;
  const STAGGER = 0.1;
  const POUR_OPACITY = 0.7;

  let finishedSprites = 0;
  let brownFadeStarted = false;
  let blackFadeStarted = false;

  function spawnPourSprite(delay) {
    wait(delay, () => {
      const pourSprite = add([
        sprite("pour", { frame: 0 }),
        pos(SCREEN_W / 2, SCREEN_H / 2),
        anchor("center"),
        scale(10),
        opacity(0),
        z(190),
        "pourSprite",
      ]);

      tween(
        pourSprite.opacity,
        POUR_OPACITY,
        0.3,
        (v) => (pourSprite.opacity = v),
        easings.easeOutQuad
      );

      let frameTime = 0;
      const FRAME_DURATION = 1.2 / 18;

      const frameUpdate = onUpdate(() => {
        frameTime += dt();
        const frame = Math.floor(frameTime / FRAME_DURATION);

        if (frame >= 12 && !blackFadeStarted) {
          blackFadeStarted = true;
          tween(
            blackOverlay.opacity,
            1,
            0.6,
            (v) => (blackOverlay.opacity = v),
            easings.easeInQuad
          );
        }

        if (frame >= 15 && !brownFadeStarted) {
          brownFadeStarted = true;
          tween(
            brownOverlay.opacity,
            1,
            0.4,
            (v) => (brownOverlay.opacity = v),
            easings.easeOutQuad
          );
        }

        if (frame >= 18) {
          frameUpdate.cancel();
          destroy(pourSprite);
          finishedSprites++;


        if (finishedSprites === POUR_COUNT) {
          blackOverlay.opacity = 1;
          destroy(brownOverlay);

          onComplete(); 
        }



        } else {
          pourSprite.frame = frame;
        }
      });
    });
  }

  for (let i = 0; i < POUR_COUNT; i++) {
    spawnPourSprite(i * STAGGER);
  }
}



function lerp(start, end, t) {
  return start + (end - start) * t;
}