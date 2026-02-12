import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';
import { getTransition } from '../config/transitions.js';
import { SPRITE_FRAMES, SPRITE_SCALES } from '../config/characters.js';
import { stopAllMusic, startMenuMusic, startFinalVictoryMusic, stopAtmosphere, fadeMusicOut, showTransitionBackground, hideAllTransitionBackgrounds } from '../helpers/kittyHelpers.js';
import { showMobileArrows, hideMobileArrows, hideJoystickControls } from '../helpers/mobileControls.js';
import { hideHUD } from '../helpers/levelHelpers.js';


export function createTransitionScene(transitionKey, character, startHP, lives = 3, score = 0) {
    console.log('🎬 RAW PARAMS:', { transitionKey, character, startHP, lives, score });
  console.log('🎬 lives type:', typeof lives, 'value:', lives);
    console.log('🎬 Transition Scene received:', {
    transitionKey,
    character: character?.name,
    startHP,
    lives,
    score
  });
  hideHUD();
  hideJoystickControls(); 

  //  OBSERVER REVEAL
  if (transitionKey === 'Transition6') {
    createTransition6ObserverIntro(character, startHP, lives, score);
    return;
  }
  
  // POST-NUCLEAR
  if (transitionKey === 'Transition7') {
    createTransition7Cinematic(character, startHP);
    return;
  }
  
  // STANDARD TRANSITION 
  renderStandardTransition(transitionKey, character, startHP, false, lives, score);
}

// CORE TRANSITION 
function renderStandardTransition(transitionKey, character, startHP, skipFlipSound = false, lives = 3, score = 0){
  const transition = getTransition(transitionKey);
  
  if (!transition) {
    console.error(`Transition ${transitionKey} not found!`);
    go("menu");
    return;
  }

  console.log(`🎬 Playing transition: ${transitionKey}`);
  console.log(`🐱 Character: ${character.name}`);
  console.log(`🖼️ Transition sprites:`, transition.sprites);

  // GET ACTUAL SCREEN DIMENSIONS
  const centerX = SCREEN_W / 2;
  const centerY = SCREEN_H / 2;

  let textIndex = 0;
  const textKeys = ['Text1', 'Text2', 'Text3'];

  // MAP BACKGROUND TO TRANSITION NUMBER
  const bgMap = {
    'transitionBG': 1,
    'transitionBG2': 2,
    'transitionBG3': 3,
    'transitionBG4': 4,
    'transitionBG5': 5,
  };
  
  const transitionNumber = bgMap[transition.background];
  
  // SHOW HTML BACKGROUND FOR TRANSITIONS 1-5
  if (transitionNumber) {
    showTransitionBackground(transitionNumber);
    console.log(`✨ Showing HTML background for transition ${transitionNumber}`);
  } else {
    add([
      sprite(transition.background),
      pos(0, 0),
      scale(SCREEN_W / 1000, SCREEN_H / 480),
      z(0),
    ]);
  }

  // DARK OVERLAY - FULL SCREEN
  add([  
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.4),
    z(1)
  ]);

  const initialSpriteKey = transition.sprites[0];
  const initialFrame = SPRITE_FRAMES[initialSpriteKey] || SPRITE_FRAMES.menu;
  const initialScale = SPRITE_SCALES[initialSpriteKey] || 1.0;

  console.log(`🎭 Initial sprite: ${initialSpriteKey} -> frame ${initialFrame}`);

  // CAT SPRITE - CENTERED
  const catSprite = add([
    sprite(`${character.name}Sheet`, { frame: initialFrame }),
    pos(centerX, centerY - 5),
    anchor('center'),
    scale(initialScale * 1.2),
    z(2),
    opacity(1)
  ]);

  // TEXT BACKGROUND - CENTERED AT BOTTOM
  add([
    rect(SCREEN_W - 100, 100, { radius: 20 }),
    pos(centerX, SCREEN_H - 80),
    anchor('center'),
    color(0, 0, 0),
    opacity(0.8),
    outline(4, Color.fromHex(Colors.Highlight)),
    z(2)
  ]);

  // TEXT - CENTERED
  const textDisplay = add([
    text(transition[textKeys[0]][0], {
      size: 25,
      width: SCREEN_W - 150,
      align: 'center',
      font: 'science'
    }),
    pos(centerX, SCREEN_H - 85),
    anchor('center'),
    color(255, 255, 255),
    z(3)
  ]);

  // PROGRESS DOTS - CENTERED
  const dots = [];

  for (let i = 0; i < 3; i++) {
    const dot = add([
      circle(i === 0 ? 7 : 4),
      pos(centerX - 30 + i * 30, SCREEN_H - 45),
      anchor('center'),
      color(i === 0 ? Color.fromHex(Colors.Highlight) : rgb(100, 100, 100)),
      z(3)
    ]);
    dots.push(dot);
  }

  // PROMPT - CENTERED
  const prompt = add([
    text('Press SPACE or ENTER to continue', { 
      size: 18, 
      font: 'science'
    }),
    pos(centerX, SCREEN_H - 15),
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
    
    const newSpriteKey = transition.sprites[textIndex];
    const newFrame = SPRITE_FRAMES[newSpriteKey];
    const newScale = SPRITE_SCALES[newSpriteKey] || 1.0;
    
    console.log(`🔄 Updating to sprite: ${newSpriteKey} -> frame ${newFrame} (textIndex: ${textIndex})`);
    
    const frameToUse = newFrame !== undefined ? newFrame : SPRITE_FRAMES.menu;
    
    if (newFrame === undefined) {
      console.warn(`⚠️ Frame not found for sprite key "${newSpriteKey}", using menu frame ${SPRITE_FRAMES.menu}`);
    }
    
    catSprite.use(sprite(`${character.name}Sheet`, { frame: frameToUse }));
    catSprite.scale = vec2(newScale * 1.2, newScale * 1.2);
    
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
      if (!skipFlipSound) {
        play("flip", { volume: 0.3 });
      }
    } else {
      const nextState = transition.nextState;
      console.log('🎬 Transition going to next state:', nextState, 'with HP:', startHP, 'lives:', lives, 'score:', score);

      // HIDE HTML BACKGROUND BEFORE TRANSITIONING
      if (transitionNumber) {
        hideAllTransitionBackgrounds();
        console.log('🎬 Hiding HTML backgrounds');
      }

      if (nextState === 'level1') {
        go('level1', { character, startHP, lives, score });
      } else if (nextState === 'level2') {
        go('level2', { character, startHP, lives, score });
      } else if (nextState === 'level3') {
        go('level3', { character, startHP, lives, score });
      } else if (nextState === 'level4') {
        go('level4', { character, startHP, lives, score });
      } else if (nextState === 'level5') {
        go('level5', { character, startHP, lives, score });
      } else if (nextState === 'observerBoss') {
        go('observerBoss', { character, startHP, lives });
      } else {
        go(nextState, { character, startHP, lives, score });
      }
    }
  }

  // INPUT HANDLING
  onKeyPress('space', handleNext);
  onKeyPress('enter', handleNext);
  onClick(handleNext);

}

// TRANSITION 6: OBSERVER REVEAL
function createTransition6ObserverIntro(character, startHP, lives = 3, score = 0) {
  console.log('Ã¢Å¡Â¡ Starting Transition6 - Observer Reveal Cinematic');
  hideJoystickControls(); 
  
  
  const blackScreen = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    opacity(1),
    z(10000),
  ]);
  
  wait(0.8, () => {
    const whiteFlash = add([
      rect(SCREEN_W, SCREEN_H),
      pos(0, 0),
      color(255, 255, 255),
      opacity(0),
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
          rect(SCREEN_W, SCREEN_H),
          pos(0, 0),
          color(255, 255, 255),
          opacity(0.4),
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
            rect(SCREEN_W, SCREEN_H),
            pos(0, 0),
            color(0, 0, 0),
            opacity(0),
            z(98),
          ]);
          
          tween(blackFade.opacity, 1, 1.2, (o) => blackFade.opacity = o, easings.easeInQuad);
          
          wait(1.5, () => {
            destroy(blackFade);
            destroy(blackScreen);
            renderStandardTransition('Transition6', character, startHP, true, lives, score);
          });
        });
      });
    });
  });
}

// TRANSITION 7: POST-NUCLEAR VICTORY + CREDITS
function createTransition7Cinematic(character, startHP) {
  console.log('🎬 Starting Transition7 - Post Nuclear Cinematic + Credits');
  console.log('🎵 Starting FinalVictoryTrack (50 seconds)');
  

  
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

  wait(0.6, () => {
    tween(whiteScreen.opacity, 0, 1, (val) => whiteScreen.opacity = val, easings.easeOutQuad);
    animateSmokeTransition();
    wait(0.1, () => {
      for (let i = 0; i < 12; i++) {
        const xPos = (i % 4) * (width() / 3) + rand(-50, 50);
        const yPos = Math.floor(i / 4) * (height() / 2) + rand(-50, 50);

        const poof = add([
          sprite("smokeBlob", { anim: "puff" }),
          pos(xPos, yPos),
          scale(6 + rand(-1, 1)),
          opacity(0),
          z(9998),
          anchor("center"),
          fixed(),
        ]);
        poof.play("puff", { loop: true });

        tween(poof.pos.y, poof.pos.y + rand(-30, 30), 2, (y) => poof.pos.y = y, easings.easeOutQuad);

        wait(1.0 + (i * 0.03), () => {
          tween(poof.opacity, 0, 1.7, (o) => poof.opacity = o, easings.easeOutQuad)
            .then(() => destroy(poof));
        });
      }

      wait(1.1, () => {
        destroy(whiteScreen);
        tween(bg.opacity, 0.7, 2.0, (o) => bg.opacity = o, easings.easeOutQuad);

        wait(7.1, () => {  
          tween(bg.opacity, 0, 1.5, (o) => bg.opacity = o)
            .then(() => destroy(bg));
        });
      });
    });
  });

  const charSprite = add([
    sprite(`${character.name}Sheet`, { frame: SPRITE_FRAMES.sitLookForwardRegular }),
    pos(330, 260),
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
    pos(width() / 2 + 1, height() / 2 - 129),
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

  const spriteFrames = [
    SPRITE_FRAMES.sitLookForwardRegular,
    SPRITE_FRAMES.stretch,
    SPRITE_FRAMES.sleep
  ];

  let msgIdx = 0;

  wait(3, () => {
    tween(charSprite.opacity, 1, 0.7, (o) => charSprite.opacity = o);
    wait(0.9, () => {
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
      charSprite.use(sprite(`${character.name}Sheet`, { frame: spriteFrames[1] }));
      transitionText.opacity = shadowText.opacity = shadowText2.opacity = charSprite.opacity = 0;
      tween(charSprite.opacity, 1, 0.5, (o) => charSprite.opacity = o);
      tween(transitionText.opacity, 1, 0.8, (o) => { 
        transitionText.opacity = o; 
        shadowText.opacity = o; 
        shadowText2.opacity = o; 
      });

      wait(2.5, () => {
        msgIdx = 2;
        transitionText.text = messages[2];
        shadowText.text = messages[2];
        shadowText2.text = messages[2];
        charSprite.use(sprite(`${character.name}Sheet`, { frame: spriteFrames[2] }));
        transitionText.opacity = shadowText.opacity = shadowText2.opacity = charSprite.opacity = 0;
        tween(charSprite.opacity, 1, 0.5, (o) => charSprite.opacity = o);
        tween(transitionText.opacity, 1, 0.8, (o) => { 
          transitionText.opacity = o; 
          shadowText.opacity = o; 
          shadowText2.opacity = o; 
        });

        wait(2.7, () => {
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

          wait(1, () => {
            startCreditsSequence(character);
          });
        });
      });
    });
  });

  wait(16, () => {
    const confettiColors = [
      rgb(144,144,192),
      rgb(219,226,233),
      rgb(101,115,131),
      rgb(158,255,158),
      rgb(255,199,255)
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
}

function startCreditsSequence(character) {
  console.log('🎬 Starting credits sequence');
  hideJoystickControls(); 
  // GET ACTUAL SCREEN DIMENSIONS
  const centerX = SCREEN_W / 2;
  const centerY = SCREEN_H / 2;

  stopAllMusic();
  wait(0.6, () => {startFinalVictoryMusic();});
  

  const cafeBG = add([
    sprite("cafe"),
    pos(0, 0),
    scale(SCREEN_W / 1000, SCREEN_H / 480),
    z(1),
    opacity(0)
  ]);
  tween(cafeBG.opacity, 1, 2, (o) => cafeBG.opacity = o);

  const darkOverlay = add([
    rect(SCREEN_W, SCREEN_H),
    pos(0, 0),
    color(0, 0, 0),
    z(2),
    opacity(0)
  ]);

  const panel = add([
    rect(800, 400, { radius: 20 }),
    pos(centerX - 400, 30),
    color(0, 0, 0),
    outline(4, rgb(144,144,192)),
    opacity(0),
    z(7)
  ]);
  wait(2.5, () => {tween(panel.opacity, 0.9, 1.5, (o) => panel.opacity = o);});

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
        pos(centerX, y),
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

  // "YOU DID IT!" 
  wait(3.5, () => {
    const youDidIt = add([
      text("YOU DID IT!", { size: 65, font: "science", }),
      pos(centerX, centerY - 50),
      anchor("center"),
      color(rgb(255,199,255)),
      opacity(0),
      z(8)
    ]);
    allCreditObjects.push(youDidIt);

    tween(youDidIt.opacity, 1, 2.5, (o) => youDidIt.opacity = o, easings.easeOutQuad);
  });

  wait(8, () => {
    const youDidIt = allCreditObjects.find(obj => obj.text === "YOU DID IT!");
    if (youDidIt) {
      tween(youDidIt.opacity, 0, 1.5, (o) => youDidIt.opacity = o).then(() => {
        destroy(youDidIt);
        allCreditObjects = allCreditObjects.filter(obj => obj !== youDidIt);
      });
    }

    fadeInLines([
      "CATastrophe2",
      `Starring: ${character.name}`,
      "Special thanks:",
      "The cats at Schrödinger's Cat Café"
    ], 120, 80, 1.2);

    // 20s INTO CREDITS
    wait(12, () => {
      allCreditObjects.forEach(obj => tween(obj.opacity, 0, 1.2, (o) => obj.opacity = o));

      wait(1.5, () => {
        clearCredits();

        fadeInLines([
          "Code, concept, story",
          "character-design, music:",
          "By MK"
        ], 150, 70, 1.4);

        // 32s INTO CREDITS
        wait(12, () => {
          allCreditObjects.forEach(obj => tween(obj.opacity, 0, 1.2, (o) => obj.opacity = o));

          wait(1.5, () => {
            clearCredits();
            fadeInLines([
              "Chief Debugging Officer:",
              "Claude",
              "Emotional Support LLM:",
              "ChatGPT",
              "Director of Chaos Department:",
              "GROK"
            ], 90, 55, 1.2);

            // 45s INTO CREDITS
            wait(13, () => {
              allCreditObjects.forEach(obj => tween(obj.opacity, 0, 1.2, (o) => obj.opacity = o));

              wait(1.5, () => {
                clearCredits();
                fadeInLines([
                  "Dedicated to:",
                  "Nona"
                ], 100, 50, 1.3);

                const nonaImage = add([
                  sprite("realNona"),
                  pos(centerX, 285),
                  anchor("center"),
                  opacity(0),
                  scale(0.9),
                  z(8)
                ]);
                allCreditObjects.push(nonaImage);

                wait(2.5, () => {
                  tween(nonaImage.opacity, 1, 1.5, (o) => nonaImage.opacity = o, easings.easeOutQuad);
                });

                // FADE OUT STARTS AT  ~62s, ENDS AT ~79s (1:19)
                wait(15, () => {
                  fadeMusicOut(6); // TAKES 6s TO FADE OUT
                  allCreditObjects.forEach(obj => {
                    tween(obj.opacity, 0, 4.5, (o) => obj.opacity = o);
                  });

                  tween(panel.opacity, 0, 5, (o) => panel.opacity = o);
                  tween(cafeBG.opacity, 0, 6, (o) => cafeBG.opacity = o, easings.easeInQuad);
                  tween(darkOverlay.opacity, 0.9, 6.5, (o) => darkOverlay.opacity = o, easings.easeInQuad);
     
                  wait(8, () => {
                    stopAtmosphere();
                    startMenuMusic();
                    go("menu");
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

function animateSmokeTransition(){
  // GET ACTUAL SCREEN DIMENSIONS
  
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 6)
  }

  function spawnSmokeLayer({
    count,
    scaleMin,
    scaleMax,
    opacityMin,
    opacityMax,
    fadeOutMultiplier,
    driftStrength,
    zIndex,
    duration,
  }) {
    for (let i = 0; i < count; i++) {
      wait(i * 0.04, () => {  
        const maxOpacity = rand(opacityMin, opacityMax)
        let time = 0

        const blob = add([
          sprite("smokeBlob"),
          pos(rand(0, SCREEN_W), rand(0, SCREEN_H)),
          scale(rand(scaleMin, scaleMax)),
          opacity(0),
          rotate(rand(0, 360)),
          z(zIndex),
          lifespan(duration),
        ])

        blob.play("puff")

        const drift = vec2(
          rand(-driftStrength, driftStrength),
          rand(-driftStrength, driftStrength)
        )

        const fadeInTime = duration * 0.25   
        const holdTime   = duration * 0.15  
        const fadeOutTime = duration * fadeOutMultiplier

        blob.onUpdate(() => {
          time += dt()
          blob.move(drift)

  
          if (time < fadeInTime) {
            const t = time / fadeInTime
            blob.opacity = easeOutCubic(t) * maxOpacity
          }

          else if (time < fadeInTime + holdTime) {
            blob.opacity = maxOpacity
          }
          else {
            const t = Math.min(
              (time - fadeInTime - holdTime) / fadeOutTime,
              1
            )
            blob.opacity = maxOpacity * (1 - easeOutCubic(t))
          }
        })
      })
    }
  }

  function smokeSceneReveal({ duration = 7 } = {}) {
    const overlay = add([
      rect(SCREEN_W, SCREEN_H),
      color(101, 115, 131),
      opacity(1),
      z(1002),
    ])

    let overlayTime = 0
    const overlayFadeDuration = duration * 9

    overlay.onUpdate(() => {
      overlayTime += dt()
      const t = Math.min(overlayTime / overlayFadeDuration, 1)
      overlay.opacity = 1 - easeOutCubic(t)
    })

  spawnSmokeLayer({
    count: 30,
    scaleMin: 8,
    scaleMax: 10,
    opacityMin: 0.1,
    opacityMax: 0.2,
    fadeOutMultiplier: 3,
    driftStrength: 70,
    zIndex: 1001,
    duration,
  })

  wait(0.05, () => {
    spawnSmokeLayer({
      count: 30,
      scaleMin: 5,
      scaleMax: 8,
      opacityMin: 0.3,
      opacityMax: 0.5,
      fadeOutMultiplier: 2,
      driftStrength: 90,
      zIndex: 999,
      duration,
    })
  })

  }
  smokeSceneReveal({ duration: 6 })
}