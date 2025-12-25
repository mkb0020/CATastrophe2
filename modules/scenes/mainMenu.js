// mainMenu.js
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { getCharacterList } from '../config/characters.js';
import { createVolumeToggle, stopAllMusic, startMenuMusic } from '../utils/audioControls.js';


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

 // onClick(() => {
//  audioCtx.resume();
//  go("menu");
//});

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


  //showMenuUI({
  //  onPlay: () => go("charSelect"),
  //  onBack: () => window.location.href = "/",
 // });

  createVolumeToggle();
}

export function createCharSelectScene() {

  //onSceneLeave("mainMenu", () => {
  //  hideMenuUI();
 // });


  let selectedIndex = null;

  add([ // BACKGROUND
    sprite("SelectBG"), 
    pos(0, 0),
    scale(SCREEN_W/500, SCREEN_H/240), 
    z(0)
  ]);
  
  add([ //  TITLE PANEL
    rect(900, 60, { radius: 30 }),
    pos(50, 15),
    color(17, 12, 30),
    outline(4, Color.fromHex("#dc4ce8")),
    z(1)
  ]);

  add([
    text("Choose Your Feline Fighter!", { 
      size: 32, 
      font: "orbitronBold",
      weight: "bold"
    }),
    pos(SCREEN_W / 2, 45),
    anchor("center"),
    color(255, 255, 255),
    z(3)
  ]);

    add([
    text("Choose Your Feline Fighter!", { 
      size: 32, 
      font: "orbitronBold",
      weight: "bold"
    }),
    pos(SCREEN_W / 2 + 1, 46),
    anchor("center"),
    color(rgb(144,144,192)),
    z(2)
  ]);


  add([ // LEFT PANEL - CHARACTER SELECTIONS
    rect(560, 385, { radius: 40 }),
    pos(20, 85),
    color(rgb(42,52,57)),
    outline(5, rgb(144,144,192)),
    z(1)
  ]);

    add([ // LEFT PANEL - CHARACTER SELECTIONS
    rect(553, 377, { radius: 40 }),
    pos(20, 85),
    color(rgb(0,0,0)),
    opacity(1),
    z(2)
  ]);

  const characters = getCharacterList();
  const catPositions = [
    [60, 108], [240, 108], [420, 108],
    [60, 298], [240, 298], [420, 298]
  ];

  const characterCards = [];

  catPositions.forEach((position, i) => {
    const [x, y] = position;
    
    const card = add([
      rect(160, 170, { radius: 40 }),
      pos(x - 20, y - 10),
      color(rgb(219,226,233)),
      outline(4, rgb(196,195,208)),
      area(),
      z(3),
      { index: i }
    ]);

    const cardPop = add([
      rect(155, 165, { radius: 40 }),
      pos(x - 15, y - 5),
      color(rgb(42,52,57)),
      opacity(0.7),
      area(),
      z(4),
      { index: i }
    ]);


    

    
    const charSprite = cardPop.add([
      sprite(characters[i].sprites.menu),
      pos(74, 80),
      anchor("center"),
      scale(1.1),
      z(7)
    ]);

    const glitchBlue = cardPop.add([
      sprite(characters[i].sprites.glitchBlue),
      pos(69, 84),
      anchor("center"),
      scale(1),
      opacity(0.5),
      z(6)
    ]);

    const glitchRed = cardPop.add([
      sprite(characters[i].sprites.glitchRed),
      pos(75, 80),
      anchor("center"),
      scale(1.1),
      opacity(0),
      z(5)
    ]);

  
    cardPop.add([
      text(characters[i].name, { 
        size: 25, 
        font: "science",
        weight: "bold"
      }),
      pos(80, 30),
      anchor("center"),
      color(255, 255, 255),
      z(7)
    ]);

        card.add([
      text(characters[i].name, { 
        size: 25, 
        font: "science",
        weight: "bold"
      }),
      pos(81, 31),
      anchor("center"),
      color(0, 0, 0),
      z(6)
    ]);

    card.onClick(() => {
      selectedIndex = i;
      
      characterCards.forEach((c, idx) => {
        if (idx === i) {
          c.outline.width = 6;
          c.outline.color = rgb(88,232,76);
        } else {
          c.outline.width = 3;
          c.outline.color = rgb(196,195,208);
        }
      });

    
      updatePreview(i);
    });

    card.onHover(() => {
      if (card.index !== selectedIndex) {
        card.outline.color = rgb(131,12,222);
      }
    });

    card.onHoverEnd(() => {
      if (card.index !== selectedIndex) {
        card.outline.color = rgb(196,195,208);
      }
    });

    characterCards.push(card);
  });

  const previewSprite = add([ // RIGHT PANEL - PREVIEW
    sprite(characters[0].sprites.select),
    pos(750, 290),
    anchor("center"),
    scale(1.2),
    z(4),
    opacity(0),
    "preview"
  ]);






//  const previewName = add([
//    text("", { 
//        size: 48, 
//        font: "science",
//        weight: "bold"
//      }),
//      pos(789, 140),
//      anchor("center"),
//      color(0, 0, 0),
//      z(4),
//      "previewName"
//    ]);

//  const previewName2 = add([
//    text("", { 
//      size: 48, 
//      font: "science",
//      weight: "bold"
//    }),
//    pos(787, 130),
//    anchor("center"),
//    color(255, 255, 255),
//    z(5),
//    "previewName2",
//    ]);

  function updatePreview(index) {
    const char = characters[index];
    
    previewSprite.use(sprite(char.sprites.select));
    previewSprite.scale = vec2(1.1,1.1);
    previewSprite.opacity = 1;
    
//    previewName.text = char.name;
//    previewName2.text = char.name;  }
  }
 const confirmBtn = add([
    rect(150, 40, { radius: 30 }),
    pos(625, 425),
    color(Color.fromHex(Colors.Highlight)), 
    outline(3, Color.fromHex(Colors.Highlight)),
    area(),
    z(1),
    opacity(0.4),
    "confirmBtn"
  ]);

  confirmBtn.add([
    text("CONFIRM", { size: 22, font: "science", weight: "bold" }),
    pos(75, 20),
    anchor("center"),
    color(255, 255, 255),
    z(3)
  ]);

    confirmBtn.add([
    text("CONFIRM", { size: 22, font: "science", weight: "bold" }),
    pos(76, 21),
    anchor("center"),
    color(0, 255, 255),
    z(2)
  ]);

  confirmBtn.onClick(() => {
    if (selectedIndex !== null) {
      const selectedChar = characters[selectedIndex];
      go("transition", "Transition1", selectedChar);
    }
  });

  const backBtn = add([
    rect(150, 40, { radius: 30 }),
    pos(810, 425),
    color(0,0,0), 
    outline(3, Color.fromHex('#730132')),
    area(),
    z(1),
    "backBtn"
  ]);

  backBtn.add([
    text("BACK", { size: 22, font: "science", weight: "bold" }),
    pos(75, 20),
    anchor("center"),
    color(255, 255, 255),
    z(3)
  ]);

    backBtn.add([
    text("BACK", { size: 22, font: "science", weight: "bold" }),
    pos(76, 21),
    anchor("center"),
    color(0, 255, 255),
    z(2)
  ]);

  backBtn.onClick(() => {
    go("menu");
  });

  onUpdate(() => {
    if (selectedIndex !== null) {
      confirmBtn.opacity = 1;
    } else {
      confirmBtn.opacity = 0.4;
    }
  });
  
  createVolumeToggle();
}