// KittyUtils.js
import { getCharacterList } from '../config/characters.js';
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';

// =================================== STARS BACKGROUND =========================================
export function initializeStars() {
    const starsDiv = document.getElementById('stars');
    if (!starsDiv) return;

    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = star.style.height = Math.random() * 2 + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 4 + 's';
        starsDiv.appendChild(star);
    }
    console.log('⭐ Stars background initialized');
}

// =============================== IMAGE LOADER =============================================
export class ImageLoader {
    constructor(baseUrl = '/static/') {
        this.baseUrl = baseUrl;
        this.cache = new Map();
        this.loadingPromises = new Map();
        this.loadedCount = 0;
        this.totalCount = 0;
    }

    async load(path) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        if (this.loadingPromises.has(path)) {
            return this.loadingPromises.get(path);
        }

        const loadPromise = new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.cache.set(path, img);
                this.loadingPromises.delete(path);
                this.loadedCount++;
                console.log(`✅ Loaded: ${path} (${this.loadedCount}/${this.totalCount})`);
                resolve(img);
            };

            img.onerror = () => {
                this.loadingPromises.delete(path);
                console.error(`❌ Failed to load: ${path}`);
                reject(new Error(`Failed to load image: ${path}`));
            };

            img.src = this.baseUrl + path;
        });

        this.loadingPromises.set(path, loadPromise);
        this.totalCount++;
        
        return loadPromise;
    }

    async loadBatch(paths) {
        console.log(`📦 Loading batch of ${paths.length} images...`);
        return Promise.all(paths.map(path => this.load(path)));
    }

    async loadBatchWithProgress(paths, onProgress) {
        const total = paths.length;
        let loaded = 0;

        const promises = paths.map(async (path) => {
            const img = await this.load(path);
            loaded++;
            if (onProgress) {
                onProgress(loaded, total);
            }
            return img;
        });

        return Promise.all(promises);
    }

    get(path) {
        return this.cache.get(path) || null;
    }

    isLoaded(path) {
        return this.cache.has(path);
    }

    isLoading(path) {
        return this.loadingPromises.has(path);
    }

    async loadCharacterSelectImages(characters) {
        console.log('🐱 Loading character selection images...');
        const paths = characters.map(char => char.sprites.small);
        await this.loadBatch(paths);
        console.log('✅ Character selection images loaded!');
    }

    async loadCharacterMenuPortraits() {
        console.log('🎨 Loading character portraits...');
        const characters = getCharacterList();
        const paths = [];
        
        characters.forEach(char => {
            if (char.sprites.menu) paths.push(char.sprites.menu);
            if (char.sprites.big) paths.push(char.sprites.big); 
        });
        
        await this.loadBatch(paths);
        console.log('✅ Character portraits loaded!');
    }

    async loadCharacterSprites(character) {
        console.log(`🐱 Loading sprites for ${character.name}...`);
        const paths = [
            character.sprites.menu,  
            character.sprites.big,   
            character.sprites.idle,
            character.sprites.battle,  
            character.sprites.walk,  
            character.sprites.jump,  
            character.sprites.stand  
        ].filter(Boolean); 
        
        await this.loadBatch(paths);
        console.log(`✅ ${character.name} sprites loaded!`);
    }

    async loadLevelImages(level) {
        console.log(`🎮 Loading Level ${level.id} images...`);
        const paths = [level.background];

        if (level.cups && level.cups.enabled) {
            paths.push('images/CATastrophe/Enemies/Cup.png');
        }

        if (level.enemies && level.enemies.type) {
            paths.push(level.enemies.sprite);
        }

        await this.loadBatch(paths);
        console.log(`✅ Level ${level.id} images loaded!`);
    }

    async loadBossImages(boss) {
        console.log(`👹 Loading boss images for ${boss.name}...`);
        const paths = [
            boss.sprite,
            boss.background
        ];
        await this.loadBatch(paths);
        console.log(`✅ Boss images loaded!`);
    }

    async loadMenuImages() {
        console.log('📋 Loading menu images...');
        const paths = [
            'images/CATastrophe/Backgrounds/MenuBG3.png',
            'images/CATastrophe/Backgrounds/BattleBG.png'
        ];
        await this.loadBatch(paths);
        console.log('✅ Menu images loaded!');
    }

    unload(paths) {
        paths.forEach(path => {
            if (this.cache.has(path)) {
                this.cache.delete(path);
                console.log(`🗑️ Unloaded: ${path}`);
            }
        });
    }

    clearCache() {
        console.log('🗑️ Clearing image cache...');
        this.cache.clear();
        this.loadingPromises.clear();
        this.loadedCount = 0;
        this.totalCount = 0;
    }

    getStats() {
        return {
            cached: this.cache.size,
            loading: this.loadingPromises.size,
            loaded: this.loadedCount,
            total: this.totalCount
        };
    }
}

export const imageLoader = new ImageLoader();

export function getCachedImage(path) {
    return imageLoader.get(path);
}

export async function preloadInitialAssets() {
    console.log('🚀 Preloading initial assets...');
    await imageLoader.loadMenuImages();
    await imageLoader.loadCharacterMenuPortraits();
    console.log('✅ Initial assets loaded!');
}

// =================================== AUDIO CONTROLS =========================================
export function fadeMusicOut(duration = 2) {
    if (window.levelMusic && !window.isMuted) {
        const currentVolume = window.levelMusic.volume;
        tween(currentVolume, 0, duration, (v) => {
            window.levelMusic.volume = v;
        }, easings.easeInQuad).then(() => {
            if (window.levelMusic) {
                window.levelMusic.stop();
                window.levelMusic = null;
            }
        });
    } else if (window.levelMusic) {
        window.levelMusic.stop();
        window.levelMusic = null;
    }
    console.log(`🎵 Music fading out over ${duration}s`);
}

export function stopAtmosphere() {
    if (window.atmosphere) {
        window.atmosphere.stop();
        window.atmosphere = null;
    }
}

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
    if (window.challengeRoom) {
        window.challengeRoom.stop();
        window.challengeRoom = null;
    }

    if (window.finalFinishHim2) {
        window.finalFinishHim2.stop();
        window.finalFinishHim2 = null;
    }
    console.log('🎵 All music stopped');
}

export function startMenuMusic() {
    stopAllMusic(); 
    
    if (!window.menuMusic || window.menuMusic.paused) {
        window.menuMusic = play("menuMusic", {
            volume: window.isMuted ? 0 : 0.7,
            loop: true
        });
        console.log('🎵 Menu music started');
    }
}

export function startLevelMusic(Track) {
    stopAllMusic(); 
    
    window.levelMusic = play(Track, { 
        volume: window.isMuted ? 0 : 0.7, 
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
        volume: window.isMuted ? 0 : 0.7, 
        loop: true 
    });
    console.log('🎵 Boss music started');
    
    onSceneLeave(() => { 
        if (window.bossMusic) {
            window.bossMusic.stop();
            window.bossMusic = null;
        }
    });
}

export function startFinalBossMusic() {
    stopAllMusic(); 
    
    window.finalBossMusic = play("finalBossMusic", { 
        volume: window.isMuted ? 0 : 0.7, 
        loop: true 
    });
    console.log('🎵 👁 FINAL BOSS MUSIC STARTED! 👁');

    onSceneLeave(() => { 
        if (window.finalBossMusic) {
            window.finalBossMusic.stop();
            window.finalBossMusic = null;
        }
    });
}

export function startChallenegeMusic() {
    stopAllMusic(); 
    
    window.challengeRoom = play("challengeRoom", { 
        volume: window.isMuted ? 0 : 0.8, 
        loop: true 
    });
    console.log('🎵 👁 CHALLENGE ROOM MUSIC STARTED! 👁');

    onSceneLeave(() => { 
        if (window.challengeRoom) {
            window.challengeRoom.stop();
            window.challengeRoom = null;
        }
    });
}

export function startGameOverMusic() {
    stopAllMusic(); 
    
    window.gameOverMusic = play("GameOverTrack", { 
        volume: window.isMuted ? 0 : 0.2, 
        loop: true 
    });
    console.log('🎵 Game Over music started');
    
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
        volume: window.isMuted ? 0 : 0.6, 
        loop: false 
    });
    console.log('🎵 Victory music started');
    
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
        volume: window.isMuted ? 0 : 0.8, 
        loop: false 
    });
    console.log('🎵 Final Victory music started');
    
    onSceneLeave(() => { 
        if (window.levelMusic) {
            window.levelMusic.stop();
            window.levelMusic = null;
        }
    });
}

export function startAtmosphere() {
    
    window.atmosphere = play("atmosphere", { 
        volume: window.isMuted ? 0 : 0.05, 
        loop: true 
    });
    console.log('🎵 ATMOSPHERE BG MUSIC STARTED! 👁');
}
// ============================== MUSIC CONTROLS (NOW IN HTML/CSS INSTEAD OF IN CANVAS) ==============================================
export function initializeMusicControls() {
    const volumeBtn = document.getElementById('muteBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    if (!volumeBtn || !pauseBtn) return;

    let isMuted = false;
    volumeBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        volumeBtn.textContent = isMuted ? '🔇' : '🔊';
        volumeBtn.classList.toggle('muted', isMuted);
        
        volume(isMuted ? 0 : 1);
        
        ['menuMusic', 'levelMusic', 'bossMusic', 'finalBossMusic', 'gameOverMusic', 'victoryMusic', 'atmosphere'].forEach(music => {
            if (window[music]) window[music].volume = isMuted ? 0 : 0.5;
        });
        
        window.isMuted = isMuted;
        console.log(`🔇 Volume ${isMuted ? 'MUTED (All Audio)' : 'UNMUTED'}`);
    });

    pauseBtn.addEventListener('click', () => {
        console.log('🎮 Desktop pause button clicked');
        if (window.gamePauseSystem) {
            if (window.gamePauseSystem.isPaused()) {
                window.gamePauseSystem.resume();
            } else {
                window.gamePauseSystem.pause();
            }
        } else {
            console.warn('⚠️ Pause system not initialized yet');
        }
    });

    window.isMuted = isMuted;
    window.toggleMute = () => volumeBtn.click();
    console.log('🎮 Music controls initialized');
}

// ============================== PAUSE SYSTEM ==============================================
export function setupPauseSystem(gameActiveGetter, gameActiveSetter, onQuitCallback = null) {
    let isPaused = false;
    const modal = document.getElementById('pauseModal');
    const resumeBtn = document.getElementById('pauseResumeModalBtn');
    const quitBtn = document.getElementById('pauseQuitModalBtn');

    const pause = () => {
        if (!gameActiveGetter() || isPaused) return;
        
        isPaused = true;
        debug.paused = true;
        
        if (modal) {
            modal.classList.add('show');
        }
        
        console.log('⏸️ Game paused');
    };

    const resume = () => {
        if (!isPaused) return;
        
        isPaused = false;
        debug.paused = false;
        
        if (modal) {
            modal.classList.remove('show');
        }
        
        setTimeout(() => {
            const canvas = document.getElementById('gameCanvas');
            if (canvas) {
                canvas.focus();
                console.log('✅ Canvas refocused after pause');
            }
        }, 100);
        
        console.log('▶️ Game resumed');
    };

    const quit = () => {
        isPaused = false;
        debug.paused = false;
        
        if (modal) {
            modal.classList.remove('show');
        }
        
        if (window.levelMusic) {
            window.levelMusic.stop();
            window.levelMusic = null;
        }
        
        if (onQuitCallback) {
            onQuitCallback();
        } else {
            startMenuMusic();
            go("menu");
        }
        
        console.log('🚪 Quit to menu from pause');
    };

    if (resumeBtn) {
        resumeBtn.onclick = resume;
    }

    if (quitBtn) {
        quitBtn.onclick = quit;
    }

    onKeyPress("escape", () => {
        if (isPaused) {
            resume();
        } else if (gameActiveGetter()) {
            pause();
        }
    });

    onKeyPress("p", () => {
        if (isPaused) {
            resume();
        } else if (gameActiveGetter()) {
            pause();
        }
    });

    window.gamePauseSystem = {
        pause,
        resume,
        isPaused: () => isPaused
    };

    return {
        pause,
        resume,
        isPaused: () => isPaused
    };
}

export function addPauseToLevel(gameActiveGetter, gameActiveSetter) {
    return setupPauseSystem(gameActiveGetter, gameActiveSetter);
}

// ================================== HUD ==========================================
export function initializeHUD() {
    window.gameState = { score: 0, hp: 120, maxHP: 120, lives: 3, timeLeft: 90, playerX: 0, playerY: 0 };
    
    window.updateHUD = (updates) => {
        if (updates.score !== undefined) {
            window.gameState.score = updates.score;
            const el = document.getElementById('score');
            if (el) el.textContent = `SCORE: ${updates.score}`;
            
            const mobileEl = document.getElementById('mobileScore');
            if (mobileEl) mobileEl.textContent = `SCORE: ${updates.score}`;
        }
        if (updates.hp !== undefined) {
            window.gameState.hp = updates.hp;
            const el = document.getElementById('hp');
            if (el) el.textContent = `HP: ${updates.hp}`;
            
            const mobileEl = document.getElementById('mobileHP');
            if (mobileEl) {
                mobileEl.textContent = `HP: ${updates.hp}`;
                if (updates.hp <= window.gameState.maxHP * 0.3) {
                    mobileEl.classList.add('low-hp');
                } else {
                    mobileEl.classList.remove('low-hp');
                }
            }
        }
        if (updates.lives !== undefined) {
            window.gameState.lives = updates.lives;
            const el = document.getElementById('lives');
            if (el) el.textContent = `LIVES: ${updates.lives}`;
            
            const mobileEl = document.getElementById('mobileLives');
            if (mobileEl) mobileEl.textContent = `LIVES: ${updates.lives}`;
        }
        if (updates.timeLeft !== undefined) {
            window.gameState.timeLeft = updates.timeLeft;
            
            if (updates.timeLeft === null) {
                const el = document.getElementById('time');
                if (el) el.textContent = 'TIME: --';
                
                const mobileEl = document.getElementById('mobileTime');
                if (mobileEl) {
                    mobileEl.textContent = 'TIME: --';
                    mobileEl.classList.remove('low-time');
                }
            } else {
                const mins = Math.floor(updates.timeLeft / 60);
                const secs = updates.timeLeft % 60;
                const timeStr = `TIME: ${mins}:${secs.toString().padStart(2, '0')}`;
                
                const el = document.getElementById('time');
                if (el) el.textContent = timeStr;
                
                const mobileEl = document.getElementById('mobileTime');
                if (mobileEl) {
                    mobileEl.textContent = `TIME: ${mins}:${secs.toString().padStart(2, '0')}`;
                    
                    if (updates.timeLeft <= 30) {
                        mobileEl.classList.add('low-time');
                    } else {
                        mobileEl.classList.remove('low-time');
                    }
                }
            }
        }
    };
    console.log('📊 HUD system initialized (desktop + mobile)');
}
// ================================== DEBUG TOGGLE ==========================================
export function initializeDebugToggle() {
    const debugToggle = document.getElementById('debugToggle');
    const debugInfo = document.getElementById('debugInfo');
    if (!debugToggle || !debugInfo) return;

    let debugVisible = false;
    debugToggle.addEventListener('click', () => {
        debugVisible = !debugVisible;
        debugInfo.style.display = debugVisible ? 'block' : 'none';
        debugToggle.style.background = debugVisible ? 'var(--AquaAura)' : 'rgba(0, 0, 0, 0.8)';
        debugToggle.style.boxShadow = debugVisible ? '0 0 20px var(--AquaAura)' : 'none';
    });

    window.updateDebugInfo = (x, y) => {
        if (debugVisible && debugInfo) {
            debugInfo.textContent = `X: ${Math.round(x)}  Y: ${Math.round(y)}`;
        }
    };
    console.log('🐛 Debug toggle initialized');
}


// ================================== DOM MODAL STUFF ==========================================
export function openHowToPlayModal() {
    const modal = document.getElementById('howToPlayModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

export function closeHowToPlayModal() {
    const modal = document.getElementById('howToPlayModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

export function openAboutCatsModal() {
    const modal = document.getElementById('aboutCatsModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

export function closeAboutCatsModal() {
    const modal = document.getElementById('aboutCatsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

export function initializeModals() {
    const helpBtn = document.getElementById('helpBtn');
    const dropdown = helpBtn?.parentElement;
    const dropdownMenu = document.getElementById('dropdownMenu');
    const modal = document.getElementById('helpModal');
    const guideModal = document.getElementById('guideModal');
    const closeModal = document.getElementById('closeModal');
    const closeGuide = document.getElementById('closeGuide');
    const closeGuideBottom = document.getElementById('closeGuideBottom');
    const openGuideBtn = document.getElementById('openGuideBtn');
    const floatingBackToTop = document.getElementById('floatingBackToTop');
    const howToPlayModal = document.getElementById('howToPlayModal');
    const closeHow = document.getElementById('closeHow');
    const aboutCatsModal = document.getElementById('aboutCatsModal');
    const closeCatsModal = document.getElementById('closeCatsModal');

    const showBackToTop = () => {
        if (floatingBackToTop) {
            floatingBackToTop.classList.add('visible');
        }
    };

    const hideBackToTop = () => {
        if (floatingBackToTop) {
            floatingBackToTop.classList.remove('visible');
        }
    };

    if (floatingBackToTop) {
        const modalContent = modal?.querySelector('.modal-content');
        const guideContent = guideModal?.querySelector('.modal-content');
        
        floatingBackToTop.onclick = () => {
            if (modal && modal.style.display === 'flex' && modalContent) {
                modalContent.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            if (guideModal && guideModal.style.display === 'flex' && guideContent) {
                guideContent.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        };

        if (modalContent) {
            modalContent.addEventListener('scroll', () => {
                if (modalContent.scrollTop > 150) {
                    showBackToTop();
                } else {
                    hideBackToTop();
                }
            });
        }

        if (guideContent) {
            guideContent.addEventListener('scroll', () => {
                if (guideContent.scrollTop > 150) {
                    showBackToTop();
                } else {
                    hideBackToTop();
                }
            });
        }
    }

    if (helpBtn && dropdown) {
        helpBtn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        };

        document.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });

        if (dropdownMenu) {
            dropdownMenu.onclick = (e) => e.stopPropagation();
        }
    }

    const openMainHelp = document.getElementById('openMainHelp');
    if (openMainHelp && modal) {
        openMainHelp.onclick = () => {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if (dropdown) dropdown.classList.remove('active');
        };
    }

    if (closeModal && modal) {
        closeModal.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            hideBackToTop();
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                hideBackToTop();
            }
        };
    }

    const openGuide = document.getElementById('openGuide');
    if (openGuide && guideModal) {
        openGuide.onclick = () => {
            guideModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if (dropdown) dropdown.classList.remove('active');
        };
    }

    if (openGuideBtn && modal && guideModal) {
        openGuideBtn.onclick = () => {
            modal.style.display = 'none';
            guideModal.style.display = 'flex';
        };
    }

    const closeGuideFn = () => {
        if (guideModal) {
            guideModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            hideBackToTop();
        }
    };

    if (closeGuide) closeGuide.onclick = closeGuideFn;
    if (closeGuideBottom) closeGuideBottom.onclick = closeGuideFn;

    if (guideModal) {
        guideModal.onclick = (e) => {
            if (e.target === guideModal) closeGuideFn();
        };
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal) modal.style.display = 'none';
            if (guideModal) guideModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            hideBackToTop();
        }
    });

    const menuTrigger = document.querySelector('.menu-trigger');
    const leftDropdown = document.querySelector('.left-dropdown');

    if (menuTrigger && leftDropdown) {
        menuTrigger.onclick = (e) => {
            e.stopPropagation();
            leftDropdown.classList.toggle('active');
        };

        document.addEventListener('click', () => {
            leftDropdown.classList.remove('active');
        });

        document.querySelector('.left-menu')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    if (closeHow) {
        closeHow.onclick = () => closeHowToPlayModal();
    }

    if (closeCatsModal) {
        closeCatsModal.onclick = () => closeAboutCatsModal();
    }

    if (howToPlayModal) {
        howToPlayModal.onclick = (e) => {
            if (e.target.id === 'howToPlayModal') closeHowToPlayModal();
        };
    }

    if (aboutCatsModal) {
        aboutCatsModal.onclick = (e) => {
            if (e.target.id === 'aboutCatsModal') closeAboutCatsModal();
        };
    }

    console.log('📋 Modals initialized');
}

// ================================== MOBILE ==========================================
export function updateControlsForMobile(isMobile) {
  const pauseBtn = document.getElementById('pause-btn');
  const volumeBtn = document.getElementById('volume-btn');
  
  if (isMobile && pauseBtn && volumeBtn) {
    pauseBtn.style.width = '45px';
    pauseBtn.style.height = '45px';
    volumeBtn.style.width = '45px';
    volumeBtn.style.height = '45px';
  }
}
// ================================== INITIALIZATION ==========================================
export function initializeAllUIHelpers() {
    initializeHUD();
    initializeDebugToggle();
    initializeMusicControls();
    initializeStars();
    initializeModals();
    console.log('✅ All UI helpers initialized!');
}