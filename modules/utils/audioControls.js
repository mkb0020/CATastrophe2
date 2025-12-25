import { SCREEN_W } from '../config/gameConfig.js';

// ============================================================================
// MUSIC MANAGEMENT
// ============================================================================
export function stopAllMusic() {

  if (window.menuMusic) {
    window.menuMusic.stop();
    window.menuMusic = null;
  }
  

  if (window.levelMusic) {
    window.levelMusic.stop();
    window.levelMusic = null;
  }
  

  if (window.bossMusic) {
    window.bossMusic.stop();
    window.bossMusic = null;
  }
  

  if (window.finalBossMusic) {
    window.finalBossMusic.stop();
    window.finalBossMusic = null;
  }
  

  if (window.gameOverMusic) {
    window.gameOverMusic.stop();
    window.gameOverMusic = null;
  }
  

  if (window.victoryMusic) {
    window.victoryMusic.stop();
    window.victoryMusic = null;
  }

    if (window.CatnipMusic) {
    window.CatnipMusic.stop();
    window.CatnipMusic = null;
  }
  
  console.log('ðŸŽµ All music stopped');
}


export function startMenuMusic() {
  stopAllMusic(); 
  
  if (!window.menuMusic || window.menuMusic.paused) {
    window.menuMusic = play("menuMusic", {
      volume: window.isMuted ? 0 : 0.5,
      loop: true
    });
    console.log('ðŸŽµ Menu music started');
  }
}


//export function startLevelMusic() {
//  stopAllMusic(); 
  
//  window.levelMusic = play("levelMusic", { 
//    volume: window.isMuted ? 0 : 0.4, 
//    loop: true 
//  });
//  console.log('ðŸŽµ Level music started');
  

//  onSceneLeave(() => { 
//    if (window.levelMusic) {
//      window.levelMusic.stop();
//      window.levelMusic = null;
//    }
//  });
//}


export function startLevelMusic(Track) {
  stopAllMusic(); 
  

  window.levelMusic = play(Track, { 
    volume: window.isMuted ? 0 : 0.4, 
    loop: true 
  });
  console.log(`🎵 Level music started: ${Track}`);
  

  onSceneLeave(() => { 
    if (window.levelMusic) {
      window.levelMusic.stop();
      window.levelMusic = null;
    }
  });
}



export function startBossMusic() {
  stopAllMusic();
  
  window.bossMusic = play("bossMusic", { 
    volume: window.isMuted ? 0 : 0.4, 
    loop: true 
  });
  console.log(' Boss music started');
  
  onSceneLeave(() => { 
    if (window.bossMusic) {
      window.bossMusic.stop();
      window.bossMusic = null;
    }
  });
}

/**
 * OBSERVER BOSS MUSIC

 */
export function startFinalBossMusic() {
  stopAllMusic(); 
  
  window.finalBossMusic = play("finalBossMusic", { 
    volume: window.isMuted ? 0 : 0.5, 
    loop: true 
  });
  console.log('ðŸŽµ ðŸ’€ FINAL BOSS MUSIC STARTED! ðŸ’€');

  onSceneLeave(() => { 
    if (window.finalBossMusic) {
      window.finalBossMusic.stop();
      window.finalBossMusic = null;
    }
  });
}


export function startGameOverMusic() {
  stopAllMusic(); 
  
  window.gameOverMusic = play("GameOverTrack", { 
    volume: window.isMuted ? 0 : 0.4, 
    loop: true 
  });
  console.log('ðŸŽµ Game Over music started');
  

  onSceneLeave(() => { 
    if (window.gameOverMusic) {
      window.gameOverMusic.stop();
      window.gameOverMusic = null;
    }
  });
}


export function startVictoryMusic() {
  stopAllMusic(); 
  
  window.victoryMusic = play("VictoryTrack", { 
    volume: window.isMuted ? 0 : 0.5, 
    loop: false 
  });
  console.log(' Victory music started');
  

  onSceneLeave(() => { 
    if (window.victoryMusic) {
      window.victoryMusic.stop();
      window.victoryMusic = null;
    }
  });
}



export function startFinalVictoryMusic() {
  stopAllMusic();
  
  window.levelMusic = play("finalVictory", { 
    volume: window.isMuted ? 0 : 0.4, 
    loop: true 
  });
  console.log('ðŸŽµ Final Victory music started');
  
 
  onSceneLeave(() => { 
    if (window.levelMusic) {
      window.levelMusic.stop();
      window.levelMusic = null;
    }
  });
}

// ============================================================================
// VOLUME TOGGLE UI
// ============================================================================


export function createVolumeToggle() {
  if (window.isMuted === undefined) {
    window.isMuted = false;
  }


  const volumeBtn = add([
    rect(30, 30, { radius: 8 }),
    pos(25, 25),
    color(42, 26, 74),
    opacity(0.8),
    outline(2, rgb(255, 255, 255)),
    area(),
    fixed(),
    z(150),
    "volumeBtn"
  ]);


  const volumeIcon = volumeBtn.add([
    text(window.isMuted ? "X" : "🎶", { size: 20 }),
    pos(15, 17),
    anchor("center"),
    "volumeIcon"
  ]);

 
  volumeBtn.onClick(() => {
    window.isMuted = !window.isMuted;
    

    volumeIcon.text = window.isMuted ? "X" : "🎶";
    
  
    if (window.menuMusic) {
      window.menuMusic.volume = window.isMuted ? 0 : 0.5;
    }
    if (window.levelMusic) {
      window.levelMusic.volume = window.isMuted ? 0 : 0.4;
    }
    if (window.bossMusic) {
      window.bossMusic.volume = window.isMuted ? 0 : 0.4;
    }

    if (window.finalBossMusic) {
      window.finalBossMusic.volume = window.isMuted ? 0 : 0.5;
    }
    if (window.gameOverMusic) {
      window.gameOverMusic.volume = window.isMuted ? 0 : 0.4;
    }
    if (window.victoryMusic) {
      window.victoryMusic.volume = window.isMuted ? 0 : 0.5;
    }
    
    console.log(`ðŸ”Š Volume ${window.isMuted ? 'MUTED' : 'UNMUTED'}`);
  });


  volumeBtn.onHover(() => {
    volumeBtn.color = rgb(100, 80, 150);
  });

  volumeBtn.onHoverEnd(() => {
    volumeBtn.color = rgb(42, 26, 74);
  });

  return { volumeBtn, volumeIcon };
}