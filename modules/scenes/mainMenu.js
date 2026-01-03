// mainMenu.js
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { getCharacterList, SPRITE_FRAMES, SPRITE_SCALES } from '../config/characters.js';
import { createVolumeToggle, stopAllMusic, startMenuMusic } from '../helpers/kittyHelpers.js';


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
    startMenuMusic();
        go("menu");
  });

  onKeyPress("space", () => {
    startMenuMusic();
    go("menu");
  });

  onKeyPress("enter", () => {
    startMenuMusic();
    go("menu");
  });


}

export function createMainMenuScene() {
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

  const testPanel = add([
    rect(600, 150, { radius: 30 }),
    pos(center().x - 300, 150),
    color(17, 12, 30),
    outline(6),
    opacity(0.8),
    z(1)
  ]);

  add([
    text("TEST VERSION", { size: 60, font: "orbitronBold" }),
    pos(center().x, 230),
    anchor("center"),
    color(rgb(255,199,255)),
    z(5)
  ]);

  add([
    text("TEST VERSION", { size: 60, font: "orbitronBold" }),
    pos(center().x + 3, 233),
    anchor("center"),
    color(rgb(115,1,50)),
    z(4)
  ]);

  const playBtn = add([
    rect(300, 56, { radius: 53 }),
    pos(center().x, 360),              
    anchor("center"),                
    color(rgb(0,0,0)),
    outline(5, rgb(88,232,76)),
    opacity(1),
    area(),
    scale(1),
    z(5),
    "playBtn"
  ]);

    const playGlow = playBtn.add([
    rect(303, 60, { radius: 58 }),
    anchor("center"),                 
    color(rgb(88,232,76)),
    opacity(0.15),
    pos(0, 0),
    z(1),
    "playGlow"
  ]);

    const playShine = playBtn.add([
      rect(290, 45, { radius: 58 }),
      anchor("center"),                 
      color(rgb(158,255,158)),
      opacity(0.2),
      pos(-5, -5),
      z(2),
      "playShine"
    ]);

  playBtn.add([
    text("PLAY", { size: 36, font: "science" }),
    pos(0, 0),                        
    anchor("center"),
    color(rgb(255, 255, 255)),
    z(3)
  ]);

  playBtn.add([
    text("PLAY", { size: 36, font: "science" }),
    pos(2, 2),
    anchor("center"),
    color(rgb(0, 0, 0)),
    z(2)
  ]);


  playBtn.onHoverUpdate(() => {
    playBtn.scale = vec2(1.1);
    playBtn.color = rgb(88,232,76);
    playGlow.scale = vec2(1.05);
    playShine.scale = vec2(1.05);
    playShine.color = rgb(14, 170, 0);
    playGlow.opacity = 1;
    playShine.opacity = 0.7;
  });

  playBtn.onHoverEnd(() => {
    playBtn.scale = vec2(1);
    playBtn.color = rgb(0, 0, 0);
    playGlow.scale = vec2(1);
    playShine.scale = vec2(1);
    playShine.color = rgb(88,232,76);
    playGlow.opacity = 0.2;
    playShine.opacity = 0.2;
  });

  playBtn.onClick(() => go("charSelect"));

 
  const backBtn = add([
    rect(300, 56, { radius: 30 }),
    pos(center().x, 430),
    anchor("center"),                  
    color(rgb(0, 0, 0)),
    outline(5, rgb(144,144,192)),
    area(),
    scale(1),
    z(1),
    "backBtn"
  ]);

    const backGlow = backBtn.add([
    rect(302, 58, { radius: 58 }),
    anchor("center"),                  
    color(rgb(101,115,131)),
    opacity(0.3),
    pos(0, 0),
    z(1),
    "playGlow"
  ]);

    const backShine = backBtn.add([
      rect(290, 45, { radius: 58 }),
      anchor("center"),                 
      color(rgb(219,226,233)),
      opacity(0.3),
      pos(-5, -5),
      z(2),
      "playShine"
    ]);

  backBtn.add([
    text("<- BACK", { size: 34, font: "science" }),
    pos(0, 0),
    anchor("center"),
    color(rgb(255, 255, 255)),
    z(3)
  ]);

  backBtn.add([
    text("<- BACK", { size: 34, font: "science" }),
    pos(2, 2),
    anchor("center"),
    color(rgb(0,0,0)),
    z(2)
  ]);

  backBtn.onHoverUpdate(() => {
    backBtn.scale = vec2(1.1);
    backBtn.color = rgb(144,144,192);
    backGlow.scale = vec2(1.05);
    backShine.scale = vec2(1.05);
    backGlow.opacity = 1;
    backShine.opacity = 0.4;
  });

  backBtn.onHoverEnd(() => {
    backBtn.scale = vec2(1);
    backBtn.color = rgb(0, 0, 0);
    backGlow.scale = vec2(1);
    backShine.scale = vec2(1);
    backGlow.opacity = 0.3;
    backShine.opacity = 0.3;
  });

  backBtn.onClick(() => {
    window.location.href = '/';
  });

  createVolumeToggle();
}



export function createCharSelectScene() {
  let selectedIndex = null;
  let animationComplete = false; 
  let shopMusic = null; 

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
        cafeSprite.frame = 1; // DOOR OPENS
        play("door", { volume: 0.8 });
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
          shopMusic = play("shop", { volume: 0.4, loop: true });
          
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
  
  // CHARACTER "MENU" BOARD
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
      pos(25, 28),
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


  // STATS BOARD
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
    pos(500, 340),
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
    pos(500, 455),
    anchor("center"),
    color(rgb(0, 255, 255)),
    z(11),
    opacity(0),
    "charNameDisplay"
  ]);

  const characterNameShadow = add([
    text("", { 
      size: 45, 
      font: "science",
      weight: "bold"
    }),
    pos(503, 458),
    anchor("center"),
    color(rgb(0, 0, 0)),
    z(10),
    opacity(0),
    "characterNameShadow"
  ]);

  function updatePreview(index) {
    const char = characters[index];
    
    previewSprite.use(sprite(`${char.name}Sheet`, { frame: SPRITE_FRAMES.select }));
    previewSprite.scale = vec2(SPRITE_SCALES.select, SPRITE_SCALES.select);
    previewSprite.opacity = 1;
    
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
    
    tween(backBtn.opacity, 1, 0.8, (val) => backBtn.opacity = val);
    tween(confirmBtn.opacity, 0.4, 0.8, (val) => confirmBtn.opacity = val);
  }

  const confirmBtn = add([
    rect(200, 40, { radius: 20 }),
    pos(750, 430),
    color(rgb(0, 0, 0)),
    outline(4, rgb(88,232,76)),
    opacity(0),  
    area(),
    scale(1),
    z(5),
    "confirmBtn"
  ]);

  const confirmGlow = confirmBtn.add([
    rect(202, 45, { radius: 20 }),
    anchor("left"),                 
    color(rgb(88,232,76)),
    opacity(0.15),
    pos(0, 20),
    z(1),
    "confirmGlow"
  ]);

  const confirmShine = confirmBtn.add([
    rect(192, 37, { radius: 30 }),
    anchor("left"),                 
    color(rgb(158,255,158)),
    opacity(0.2),
    pos(0, 18),
    z(2),
    "confirmShine"
  ]);

  confirmBtn.add([
    text("PLACE ORDER", { size: 20, font: "science", weight: "bold" }),
    pos(100, 23),
    anchor("center"),
    color(255, 255, 255),
    z(6)
  ]);

  confirmBtn.onClick(() => {
    if (selectedIndex === null || !animationComplete) return;
    if (shopMusic) shopMusic.stop();
    playPourAnimation(() => {
      const char = characters[selectedIndex];
      go("transition", "Transition1", char);
    });
  });

  confirmBtn.onHoverUpdate(() => {
    if (selectedIndex !== null && animationComplete) {
      confirmBtn.scale = vec2(1.01);
      confirmBtn.color = rgb(88,232,76);
      confirmGlow.scale = vec2(1.01);
      confirmShine.scale = vec2(1.01);
      confirmShine.color = rgb(14, 170, 0);
      confirmGlow.opacity = 1;
      confirmShine.opacity = 0.7;
    }
  });

  confirmBtn.onHoverEnd(() => {
    confirmBtn.scale = vec2(1);
    confirmBtn.color = rgb(0, 0, 0);
    confirmGlow.scale = vec2(1);
    confirmShine.scale = vec2(1);
    confirmShine.color = rgb(88,232,76);
    confirmGlow.opacity = 0.2;
    confirmShine.opacity = 0.2;
  });

  const backBtn = add([
    rect(120, 40, { radius: 20 }),
    pos(50, 430),
    color(rgb(0, 0, 0)),
    outline(4, rgb(144,144,192)),
    area(),
    opacity(0),  
    scale(1),
    z(5),
    "backBtn"
  ]);

  const backGlow = backBtn.add([
    rect(122, 45, { radius: 20 }),
    anchor("left"),                  
    color(rgb(101,115,131)),
    opacity(0.3),
    pos(0, 20),
    z(1),
    "backGlow"
  ]);

  const backShine = backBtn.add([
    rect(110, 37, { radius: 30 }),
    anchor("left"),                 
    color(rgb(219,226,233)),
    opacity(0.1),
    pos(0, 20),
    z(2),
    "backShine"
  ]);

  backBtn.add([
    text("BACK", { size: 20, font: "science", weight: "bold" }),
    pos(60, 23),
    anchor("center"),
    color(255, 255, 255),
    z(5)
  ]);

  backBtn.onClick(() => {
    if (!animationComplete) return;
    if (shopMusic) shopMusic.stop()
    go("menu");
  });

  backBtn.onHoverUpdate(() => {
    if (!animationComplete) return;
    backBtn.scale = vec2(1.01);
    backBtn.color = rgb(0, 0, 0);
    backGlow.scale = vec2(1.01);
    backShine.scale = vec2(1.01);
    backGlow.opacity = 1;
    backShine.opacity = 0.4;
  });

  backBtn.onHoverEnd(() => {
    backBtn.scale = vec2(1);
    backBtn.color = rgb(0, 0, 0);
    backGlow.scale = vec2(1);
    backShine.scale = vec2(1);
    backGlow.opacity = 0.1;
    backShine.opacity = 0.3;
  });

  onUpdate(() => {
    if (animationComplete && selectedIndex !== null) {
      if (confirmBtn.opacity < 1) {
        confirmBtn.opacity = 1;
      }
    }
  });
  
  createVolumeToggle();
}

function playPourAnimation(onComplete) {
  const music = get("shop")[0];
  if (music) music.stop();
  const blackOverlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0),
    z(200),
    "pourBlackOverlay"
  ]);

  const pourSprite = add([
    sprite("pour", { frame: 0 }),
    pos(SCREEN_W / 2, SCREEN_H / 2),
    anchor("center"),
    scale(10, 10),
    opacity(0),
    z(199),
    "pourSprite"
  ]);

  tween(pourSprite.opacity, 1, 0.3, (val) => pourSprite.opacity = val, easings.easeOutQuad);
  play("pour", { volume: 0.8 });
  wait(0.3, () => {
    let frameTime = 0;
    const FRAME_DURATION = 1.2 / 18; 
    
    const frameUpdate = onUpdate(() => {
      frameTime += dt();
      const frame = Math.floor(frameTime / FRAME_DURATION);
      
      if (frame >= 18) {
        frameUpdate.cancel();
        
        tween(blackOverlay.opacity, 1, 0.5, (val) => blackOverlay.opacity = val, easings.easeInQuad);
        
        wait(0.5, () => {
          destroy(pourSprite);
          destroy(blackOverlay);
          onComplete();
        });
      } else {
        pourSprite.frame = frame;
      }
    });
  });
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}