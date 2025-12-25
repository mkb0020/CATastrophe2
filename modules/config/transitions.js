export const TRANSITIONS = {
  Transition1: { // AFTER CHARACTER SELECT, BEFORE LEVEL 1
    Text1: ["Another purrfect morning at Schrödinger's Cat Café!"],
    Text2: ["Huh? Where did all these cups come from?"],
    Text3: ["Someone must REALLY want me to knock them over!"],
    sprites: ['sleep', 'wakeUp', 'stretch'], 
    background: 'transitionBG', 
    nextState: 'level1',
  },

  Transition2: { // AFTER CUP  BOSS, BEFORE LEVEL 2
    Text1: ["For the last time! No cups on the tables!"],
    Text2: ["Wait...are those..."],
    Text3: ["CUCUMBERS??"],
    sprites: ['cup00', 'cup01', 'cup02'], 
    background: 'transitionBG2', 
    nextState: 'level2',
  },

  Transition3: { // AFTER CUCUMBER BOSS / BEFORE LEVEL 3
    Text1: ["Gross!"],
    Text2: ["What is going on in the Café? And why do I feel like I'm being watched?..."],
    Text3: ["No time for an existential crisis now! Someone forgot to call pest control!"], 
    sprites: ['standMad', 'sitLookBackRegular', 'sitLookForwardMad'], 
    background: 'transitionBG3', 
    nextState: 'level3',
  },

  Transition4: { // AFTER RAT KING / BEFORE LEVEL 4 
    Text1: ["Who would want to be king of the rats anyway?"],
    Text2: ["What is that fast red dot?"],
    Text3: ["MUST. CATCH."], 
    sprites: ['king00', 'king01', 'king02'], 
    background: 'transitionBG4', 
    nextState: 'level4',
  },

  Transition5: { // AFTER LASER POINTER BOSS / BEFORE LEVEL 5
    Text1: ["Got em!"],
    Text2: ["Hold up! Why is everything GLOWING now?"],
    Text3: ["Someone must be really messing with me right meow!"], 
    sprites: ['catch', 'standRegular', 'sitLookBackMad'], 
    background: 'transitionBG5', 
    nextState: 'level5',
  },

  Transition6: { // AFTER LEVEL 5 / BEFORE OBSERVER BOSS
    Text1: ["It was you the whole time! I guess we're about to open the box to see ..."],
    Text2: ["...who's alive..."],
    Text3: ["AND WHO'S DEAD!"],
    sprites: ['sitLookForwardMad', 'standMad', 'pounce'], 
    background: 'transitionBG6', 
    nextState: 'observerBoss',
  },

  Transition7: { // AFTER OBSERVER BOSS / BEFORE CREDITS
    Text1: ["Quantum Bliss restored!"],
    Text2: ["Time for me to take a catnap"],
    Text3: ["zzzZZZzzzZZZzzz"],
    sprites: ['sitLookForwardRegular', 'stretch', 'sleep'], 
    background: 'transitionBG7', 
    nextState: 'credits',
  },
};

export function getTransition(transitionKey) {
  return TRANSITIONS[transitionKey];
}