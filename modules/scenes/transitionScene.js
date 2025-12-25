import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { getTransition } from '../config/transitions.js';
import { createVolumeToggle, stopAllMusic, startMenuMusic, startFinalVictoryMusic } from '../utils/audioControls.js';

export function createTransitionScene(transitionKey, character, playerHP) {
  
  // ⚡ SPECIAL CINEMATIC HANDLING FOR TRANSITION6 (OBSERVER REVEAL)
  if (transitionKey === 'Transition6') {
    createTransition6ObserverIntro(character, playerHP);
    return;
  }
  
  // 🎬 SPECIAL CINEMATIC HANDLING FOR TRANSITION7 (POST-NUCLEAR)
  if (transitionKey === 'Transition7') {
    createTransition7Cinematic(character, playerHP);
    return;
  }
  
  // STANDARD TRANSITION LOGIC FOR ALL OTHER TRANSITIONS
  const transition = getTransition(transitionKey);
  
  if (!transition) {
    console.error(`Transition ${transitionKey} not found!`);
    go("menu");
    return;
  }

  console.log(`🎬 Playing transition: ${transitionKey}`);

  let textIndex = 0;
  const textKeys = ['Text1', 'Text2', 'Text3'];
  
  // BG
  add([
    sprite(transition.background),
    pos(0, 0),
    scale(SCREEN_W / 1000, SCREEN_H / 480),
    z(0),
  ]);

  add([   // DARK OVERLAY TO DIM BG
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.4),
    z(1)
  ]);

  const catSprite = add([
    sprite(character.sprites[transition.sprites[0]] || character.sprites.idle),
    pos(SCREEN_W / 2, SCREEN_H / 2 - 35),
    anchor('center'),
    scale(1.2),
    z(2),
    opacity(1)
  ]);

  add([ // TEXT BG
    rect(SCREEN_W - 100, 100, { radius: 20 }),
    pos(SCREEN_W / 2, SCREEN_H - 80),
    anchor('center'),
    color(0, 0, 0),
    opacity(0.8),
    outline(4, Color.fromHex(Colors.Highlight)),
    z(2)
  ]);

  const textDisplay = add([   // TEXT
    text(transition[textKeys[0]][0], {
      size: 25,
      width: SCREEN_W - 150,
      align: 'center',
      font: 'science'
    }),
    pos(SCREEN_W / 2, SCREEN_H - 85),
    anchor('center'),
    color(255, 255, 255),
    z(3)
  ]);

  const dots = [];   // DOTS

  for (let i = 0; i < 3; i++) {
    const dot = add([
      circle(i === 0 ? 7 : 4),
      pos(SCREEN_W / 2 - 30 + i * 30, SCREEN_H - 45),
      anchor('center'),
      color(i === 0 ? Color.fromHex(Colors.Highlight) : rgb(100, 100, 100)),
      z(3)
    ]);
    dots.push(dot);
  }

  const prompt = add([   // PROMPT - PRESS SPACE

    text('Press SPACE or ENTER to continue', { 
      size: 18, 
      font: 'science'
    }),
    pos(SCREEN_W / 2, SCREEN_H - 15),
    anchor('center'),
    color(200, 200, 200),
    opacity(0.8),
    z(3)
  ]);

  let blinkTime = 0;   // BLINKING PROMPT
  prompt.onUpdate(() => {
    blinkTime += dt();
    prompt.opacity = Math.sin(blinkTime * 3) * 0.3 + 0.6;
  });

  function updateText() {   // UPDATE TEXT AND DOTS
    textDisplay.text = transition[textKeys[textIndex]][0];
    
    const newSprite = transition.sprites[textIndex];     // SWAP THE CAT SPRITE!
    catSprite.use(sprite(character.sprites[newSprite] || character.sprites.idle));
    
    // FADE-IN
    catSprite.opacity = 0;
    tween(
      0,
      1,
      0.3,
      (val) => catSprite.opacity = val,
      easings.easeOutCubic
    );
    
    // PROGRESS DOTS
    dots.forEach((dot, i) => {
      if (i === textIndex) {
        dot.radius = 10;
        dot.color = Color.fromHex(Colors.Highlight);
      } else if (i < textIndex) {
        dot.radius = 6;
        dot.color = Color.fromHex(Colors.Green);
      } else {
        dot.radius = 6;
        dot.color = rgb(100, 100, 100);
      }
    });
  }

  function handleNext() {
    if (textIndex < textKeys.length - 1) {
      textIndex++;
      updateText();
      play("flip", { volume: 0.3 });
    } else {
      const nextState = transition.nextState;
      
      if (nextState === 'level1') {
        go('level1', { character });
      } else if (nextState === 'level2') {
        go('level2', { character, playerHP });
      } else if (nextState === 'level3') {
        go('level3', { character, playerHP });
      } else if (nextState === 'level4') {
        go('level4', { character, playerHP });
      } else if (nextState === 'level5') {
        go('level5', { character, playerHP });
      } else if (nextState === 'observerBoss') {
        go('observerBoss', { character, playerHP });
      } else if (nextState === 'credits') { 
        go('credits', { character });
      } else {
        go(nextState, { character, playerHP });
      }
    }
  }

  // INPUT HANDLING
  onKeyPress('space', handleNext);
  onKeyPress('enter', handleNext);
  onClick(handleNext);

  createVolumeToggle();
}

function createTransition6ObserverIntro(character, playerHP) {
  console.log('⚡ Starting Transition6 - Observer Reveal Cinematic');
    const blackScreen = add([
    rect(width(), height()),
    pos(0, 0),
    color(0, 0, 0),
    opacity(1),
    fixed(),
    z(10000),
  ]);
  
  wait(0.8, () => {
    const whiteFlash = add([
      rect(width(), height()),
      pos(0, 0),
      color(255, 255, 255),
      opacity(0),
      fixed(),
      z(10001),
    ]);
    
    tween(whiteFlash.opacity, 1, 0.15, (o) => whiteFlash.opacity = o, easings.easeOutQuad).then(() => {
      wait(0.15, () => {
        tween(whiteFlash.opacity, 0, 0.3, (o) => whiteFlash.opacity = o, easings.easeOutQuad).then(() => {
          destroy(whiteFlash);
        });
        play("lightning", { volume: 0.4, speed: 0.8 });
        shake(50);
        tween(blackScreen.opacity, 0, 0.3, (o) => blackScreen.opacity = o, easings.easeOutQuad);
        
        add([
          sprite("observerIntro"),
          pos(0, 0),
          scale(SCREEN_W / 1000, SCREEN_H / 480),
          z(0),
        ]);
        
        const lightning = add([
          sprite("lightning", { anim: "glitch" }),
          pos(0, 0),
          scale(SCREEN_W / 100, SCREEN_H / 48),
          opacity(0.8),
          z(100),
        ]);
        
        lightning.play("glitch");
        
        const flashOverlay = add([
          rect(width(), height()),
          pos(0, 0),
          color(255, 255, 255),
          opacity(0.4),
          fixed(),
          z(99),
        ]);
        
        tween(flashOverlay.opacity, 0, 0.3, (o) => flashOverlay.opacity = o).then(() => {
          destroy(flashOverlay);
        });
        
        wait(0.5, () => {
          destroy(lightning);
        });
        
        wait(0.4, () => {
          const blackFade = add([
            rect(width(), height()),
            pos(0, 0),
            color(0, 0, 0),
            opacity(0),
            fixed(),
            z(10002),
          ]);
          
          tween(blackFade.opacity, 1, 0.4, (o) => blackFade.opacity = o, easings.easeInQuad).then(() => {
            wait(0.3, () => {
              const finalFlash = add([
                rect(width(), height()),
                pos(0, 0),
                color(255, 255, 255),
                opacity(0),
                fixed(),
                z(10003),
              ]);
              
              tween(finalFlash.opacity, 1, 0.1, (o) => finalFlash.opacity = o).then(() => {
                wait(0.1, () => {
                  destroyAll();
                  createStandardTransition('Transition6', character, playerHP);
                });
              });
            });
          });
        });
      });
    });
  });
  
  createVolumeToggle();
}

function createStandardTransition(transitionKey, character, playerHP) {
  const transition = getTransition(transitionKey);
  
  if (!transition) {
    console.error(`Transition ${transitionKey} not found!`);
    go("menu");
    return;
  }

  console.log(`🎬 Playing transition: ${transitionKey}`);

  let textIndex = 0;
  const textKeys = ['Text1', 'Text2', 'Text3'];
  
  // BG
  add([
    sprite(transition.background),
    pos(0, 0),
    scale(SCREEN_W / 1000, SCREEN_H / 480),
    z(0),
  ]);

  add([   // DARK OVERLAY TO DIM BG
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.4),
    z(1)
  ]);

  const catSprite = add([
    sprite(character.sprites[transition.sprites[0]] || character.sprites.idle),
    pos(SCREEN_W / 2, SCREEN_H / 2 - 35),
    anchor('center'),
    scale(1.2),
    z(2),
    opacity(1)
  ]);

  add([ // TEXT BG
    rect(SCREEN_W - 100, 100, { radius: 20 }),
    pos(SCREEN_W / 2, SCREEN_H - 80),
    anchor('center'),
    color(0, 0, 0),
    opacity(0.8),
    outline(4, Color.fromHex(Colors.Highlight)),
    z(2)
  ]);

  const textDisplay = add([   // TEXT
    text(transition[textKeys[0]][0], {
      size: 25,
      width: SCREEN_W - 150,
      align: 'center',
      font: 'science'
    }),
    pos(SCREEN_W / 2, SCREEN_H - 85),
    anchor('center'),
    color(255, 255, 255),
    z(3)
  ]);

  const dots = [];   // DOTS

  for (let i = 0; i < 3; i++) {
    const dot = add([
      circle(i === 0 ? 7 : 4),
      pos(SCREEN_W / 2 - 30 + i * 30, SCREEN_H - 45),
      anchor('center'),
      color(i === 0 ? Color.fromHex(Colors.Highlight) : rgb(100, 100, 100)),
      z(3)
    ]);
    dots.push(dot);
  }

  const prompt = add([   // PROMPT - PRESS SPACE

    text('Press SPACE or ENTER to continue', { 
      size: 18, 
      font: 'science'
    }),
    pos(SCREEN_W / 2, SCREEN_H - 15),
    anchor('center'),
    color(200, 200, 200),
    opacity(0.8),
    z(3)
  ]);

  let blinkTime = 0;   // BLINKING PROMPT
  prompt.onUpdate(() => {
    blinkTime += dt();
    prompt.opacity = Math.sin(blinkTime * 3) * 0.3 + 0.6;
  });

  function updateText() {   // UPDATE TEXT AND DOTS
    textDisplay.text = transition[textKeys[textIndex]][0];
    
    const newSprite = transition.sprites[textIndex];     // SWAP THE CAT SPRITE!
    catSprite.use(sprite(character.sprites[newSprite] || character.sprites.idle));
    
    // FADE-IN
    catSprite.opacity = 0;
    tween(
      0,
      1,
      0.3,
      (val) => catSprite.opacity = val,
      easings.easeOutCubic
    );
    
    // PROGRESS DOTS
    dots.forEach((dot, i) => {
      if (i === textIndex) {
        dot.radius = 10;
        dot.color = Color.fromHex(Colors.Highlight);
      } else if (i < textIndex) {
        dot.radius = 6;
        dot.color = Color.fromHex(Colors.Green);
      } else {
        dot.radius = 6;
        dot.color = rgb(100, 100, 100);
      }
    });
  }

  function handleNext() {
    if (textIndex < textKeys.length - 1) {
      textIndex++;
      updateText();
      if (transitionKey !== 'Transition6') {
        play("flip", { volume: 0.3 });
      }
    } else {
      const nextState = transition.nextState;
      
      if (nextState === 'level1') {
        go('level1', { character });
      } else if (nextState === 'level2') {
        go('level2', { character, playerHP });
      } else if (nextState === 'level3') {
        go('level3', { character, playerHP });
      } else if (nextState === 'level4') {
        go('level4', { character, playerHP });
      } else if (nextState === 'level5') {
        go('level5', { character, playerHP });
      } else if (nextState === 'observerBoss') {
        go('observerBoss', { character, playerHP });
      } else if (nextState === 'credits') { 
        go('credits', { character });
      } else {
        go(nextState, { character, playerHP });
      }
    }
  }

  // INPUT HANDLING
  onKeyPress('space', handleNext);
  onKeyPress('enter', handleNext);
  onClick(handleNext);

  createVolumeToggle();
}

function createTransition7Cinematic(character, playerHP) {
  console.log('🎬 Starting Transition7 - Post Nuclear Cinematic + Credits');
  console.log('🎵 Starting FinalVictoryTrack (50 seconds)');
  stopAllMusic();
  startFinalVictoryMusic();
  // ===== PHASE 1: POST-NUCLEAR BLAST  =====
  const bg = add([
    sprite("transitionBG7"),
    pos(0, 0),
    scale(SCREEN_W / 1000, SCREEN_H / 480),
    opacity(0),  
    z(0)
  ]);

 
  const whiteScreen = add([
    rect(width(), height()),
    pos(0, 0),
    color(255, 255, 255),
    opacity(1),
    fixed(),
    z(10000),
    "whiteScreen"
  ]);

  wait(0.3, () => {
    tween(whiteScreen.opacity, 0, 0.8, (val) => whiteScreen.opacity = val, easings.easeOutQuad);

    wait(0.3, () => {
      for (let i = 0; i < 12; i++) {
        const xPos = (i % 4) * (width() / 3) + rand(-50, 50);
        const yPos = Math.floor(i / 4) * (height() / 2) + rand(-50, 50);

        const poof = add([
          sprite("smoke", { anim: "puff" }),
          pos(xPos, yPos),
          scale(6 + rand(-1, 1)),
          opacity(0.3),
          z(9998),
          anchor("center"),
          fixed(),
        ]);
        poof.play("puff", { loop: true });

        tween(poof.pos.y, poof.pos.y + rand(-30, 30), 2, (y) => poof.pos.y = y, easings.easeOutQuad);

        const smokeClear = add([
          sprite('smokeClear', { anim: 'puff' }),
            pos(0, 0),
            scale(10, 10), 
            z(9999),
            fixed(),
            opacity(0.7)
            ]);
            
        smokeClear.play("puff", { loop: false });
        wait(0.8, () => destroy(smokeClear));

        wait(1.0 + (i * 0.03), () => {
          tween(poof.opacity, 0, 1.5, (o) => poof.opacity = o, easings.easeOutQuad)
            .then(() => destroy(poof));
        });
      }

      wait(1.0, () => {
        destroy(whiteScreen);
        tween(bg.opacity, 0.7, 2.0, (o) => bg.opacity = o, easings.easeOutQuad);

        wait(11, () => {  
          tween(bg.opacity, 0, 1.5, (o) => bg.opacity = o)
            .then(() => destroy(bg));
        });
      });
    });
  });

  const charSprite = add([
    sprite(character.sprites.sitLookForwardRegular),
    pos(330, 215),
    scale(1),
    z(10),
    opacity(0)
  ]);

  const transitionText = add([
    text("QUANTUM BLISS RESTORED!", {
      size: 50,
      font: "science",
      width: 800,
      align: "center"
    }),
    pos(SCREEN_W / 2, SCREEN_H / 2 - 130),
    anchor("center"),
    color(255, 255, 255),
    z(11),
    opacity(0)
  ]);

  const shadowText = add([
    text("QUANTUM BLISS RESTORED!", {
      size: 50,
      font: "science",
      width: 800,
      align: "center"
    }),
    pos(SCREEN_W / 2 + 3, SCREEN_H / 2 - 128),
    anchor("center"),
    color(144, 144, 192),
    z(9),
    opacity(0)
  ]);

  const shadowText2 = add([
        text("QUANTUM BLISS RESTORED!", {
            size: 50,
            width: 800,
            align: "center",
            font: "science" 
        }),
        pos(k.width() / 2 + 1, k.height() / 2 - 129),
        anchor("center"),
        color(0, 0, 0),
        z(10),
        opacity(0)
    ]);

  const messages = [
    "QUANTUM BLISS RESTORED!",
    "TIME FOR ME TO TAKE A CATNAP",
    "zzzZZZzzzZZZzzz"
  ];

  const sprites = [
    character.sprites.sitLookForwardRegular,
    character.sprites.stretch,
    character.sprites.sleep
  ];

  let msgIdx = 0;

    wait(2, () => {
        tween(charSprite.opacity, 1, 0.5, (o) => charSprite.opacity = o);
        wait(0.7, () => {
            tween(transitionText.opacity, 1, 0.8, (o) => {
                transitionText.opacity = o;
                shadowText.opacity = o;
                shadowText2.opacity = o;

            });
        });

    wait(2.8, () => {
              msgIdx = 1;
              transitionText.text = messages[1];
              shadowText.text = messages[1];
              shadowText2.text = messages[1];
              charSprite.use(k.sprite(sprites[1]));
              transitionText.opacity = shadowText.opacity = shadowText2.opacity = charSprite.opacity = 0;
              tween(charSprite.opacity, 1, 0.5, (o) => charSprite.opacity = o);
              tween(transitionText.opacity, 1, 0.8, (o) => { 
                  transitionText.opacity = o; 
                  shadowText.opacity = o; 
                  shadowText2.opacity = o; 
              });

              wait(2.8, () => {
                  msgIdx = 2;
                  transitionText.text = messages[2];
                  shadowText.text = messages[2];
                  shadowText2.text = messages[2];
                  charSprite.use(k.sprite(sprites[2]));
                  transitionText.opacity = shadowText.opacity = shadowText2.opacity = charSprite.opacity = 0;
                  tween(charSprite.opacity, 1, 0.5, (o) => charSprite.opacity = o);
                  tween(transitionText.opacity, 1, 0.8, (o) => { 
                      transitionText.opacity = o; 
                      shadowText.opacity = o; 
                      shadowText2.opacity = o; 
                  });

                  wait(2.8, () => {
                      tween(charSprite.opacity, 0, 1.0, (o) => charSprite.opacity = o);
                      tween(transitionText.opacity, 0, 1.0, (o) => {
                          transitionText.opacity = o;
                          shadowText.opacity = o;
                          shadowText2.opacity = o;
                      }).then(() => {
                          destroy(charSprite);
                          destroy(transitionText);
                          destroy(shadowText);
                          destroy(shadowText2);
                      });

                      wait(0.9, () => startCreditsSequence(character));
                  });
              });
          });
      });

  wait(16, () => {
        const confettiColors = [
            k.rgb(144,144,192),
            k.rgb(219,226,233),
            k.rgb(101,115,131),
            k.rgb(158,255,158),
            k.rgb(255,199,255)
        ];
    loop(0.1, () => {
      const c = add([
        rect(8, 8),
        pos(rand(0, SCREEN_W), -20),
        color(choose(confettiColors)),
        rotate(rand(0, 360)),
        opacity(0.6),
        z(15),
        { vel: rand(30, 100), rotSpeed: rand(-5, 5) }
      ]);
      c.onUpdate(() => {
        c.move(0, c.vel);
        c.angle += c.rotSpeed;
        if (c.pos.y > SCREEN_H + 20) destroy(c);
      });
    });
  });

  createVolumeToggle();
}

function startCreditsSequence(character) {
    const cafeBG = add([
        sprite("cafe"),
        pos(0, 0),
        scale(k.width() / 1000, height() / 480),
        z(1),
        opacity(0)
    ]);
    tween(cafeBG.opacity, 1, 2, (o) => cafeBG.opacity = o);

    const darkCafeBG = add([
        sprite("darkCafe"),
        pos(0, 0),
        scale(width() / 1000, height() / 480),
        z(2),
        opacity(0)
    ]);

    const panel = add([
        rect(800, 400, { radius: 20 }),
        pos(100, 30),
        color(0, 0, 0),
        outline(4, k.rgb(144,144,192)),
        opacity(0),
        z(7)
    ]);
    wait(3, () => {tween(panel.opacity, 0.9, 2, (o) => panel.opacity = o);});

    let allCreditObjects = [];


  function clearCredits() {
    allCreditObjects.forEach(obj => destroy(obj));
    allCreditObjects = [];
  }

  function fadeInLines(lines, baseY = 150, lineHeight = 50, delayBetween = 1.2, font = 'science') {
        let y = baseY;
        lines.forEach((line, i) => {
            const size = line.includes("CATastrophe2") ? 60 : 38;
            const color = line === "By MK" ? rgb(255,199,255) : rgb(243,255,229);

            const lineObj = add([
                text(line, { size, font }),
                pos(width() / 2, y),
                anchor("center"),
                color,
                opacity(0),
                z(8)
            ]);
            allCreditObjects.push(lineObj);
            wait(0.8 + i * delayBetween, () => {
                tween(lineObj.opacity, 1, 0.8, (o) => lineObj.opacity = o, easings.easeOutQuad);
            });
            y += lineHeight;
        });
    }

  wait(3.5, () => {
        const youDidIt = add([
            text("YOU DID IT!", { size: 65, font: "science", }),
            pos(width() / 2, height() / 2 - 50),
            anchor("center"),
            color(rgb(255,199,255)),
            opacity(0),
            z(8)
        ]);
        allCreditObjects.push(youDidIt);

        tween(youDidIt.opacity, 1, 3.5, (o) => youDidIt.opacity = o, easings.easeOutQuad);
    });


  wait(6, () => {
        const youDidIt = allCreditObjects.find(obj => obj.text === "YOU DID IT!");
        if (youDidIt) {
            tween(youDidIt.opacity, 0, 2, (o) => youDidIt.opacity = o).then(() => {
                destroy(youDidIt);
                allCreditObjects = allCreditObjects.filter(obj => obj !== youDidIt);
            });
        }

    fadeInLines([
            "CATastrophe2",
            `Starring: ${character.name}`,
            "Special thanks:",
            "The cats at Schrödinger's Cat Café"
        ], 120, 80, 1.6);

    wait(8, () => {
            allCreditObjects.forEach(obj => tween(obj.opacity, 0, 1.0, (o) => obj.opacity = o));



      wait(1, () => {
        clearCredits();

        fadeInLines([
                    "Code, concept, story",
                    "character-design, music:",
                    "By MK"
                ], 150, 70, 1.6);

        wait(8, () => {
          allCreditObjects.forEach(obj => tween(obj.opacity, 0, 1.0, (o) => obj.opacity = o));

          wait(1.2, () => {
            clearCredits();
            fadeInLines([
                            "Chief Debugging Officer:",
                            "Claude",
                            "Emotional Support LLM:",
                            "ChatGPT",
                            "Director of Chaos Department:",
                            "GROK"
                        ], 90, 55, 1.5);

          wait(10, () => {
            allCreditObjects.forEach(obj => {
                                tween(obj.opacity, 0, 2.0, (o) => obj.opacity = o);
                            });

            tween(panel.opacity, 0, 2.5, (o) => panel.opacity = o);
            tween(cafeBG.opacity, 0, 4.0, (o) => cafeBG.opacity = o, easings.easeInQuad);
            tween(darkCafeBG.opacity, 1, 4.0, (o) => darkCafeBG.opacity = o, easings.easeInQuad);
 
            wait(5, () => {
                stopAllMusic();
                startMenuMusic();
                go("menu");
              });
            });
          });
        });
      });
    });
  });
}