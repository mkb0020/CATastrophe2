// KittyUtils.js - Combined utility module for CATastrophe2
import { getCharacterList } from '../config/characters.js';
import { SCREEN_W, SCREEN_H, Colors } from '../config/gameConfig.js';

// ============================================================================
// IMAGE LOADER
// ============================================================================
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

// ============================================================================
// AUDIO CONTROLS
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

export function createVolumeToggle() {
    if (window.isMuted === undefined) {
        window.isMuted = false;
    }

    const volumeBtn = add([
        rect(24, 24, { radius: 8 }),
        pos(25, 20),
        color(42, 26, 74),
        opacity(0.8),
        outline(1, rgb(255, 255, 255)),
        area(),
        fixed(),
        z(150),
        "volumeBtn"
    ]);

    const volumeIcon = volumeBtn.add([
        text(window.isMuted ? "X" : "🎶", { size: 18 }),
        pos(12, 13),
        anchor("center"),
        "volumeIcon"
    ]);

    volumeBtn.onClick(() => {
        window.isMuted = !window.isMuted;
        volumeIcon.text = window.isMuted ? "X" : "🎶";
        
        if (window.menuMusic) window.menuMusic.volume = window.isMuted ? 0 : 0.5;
        if (window.levelMusic) window.levelMusic.volume = window.isMuted ? 0 : 0.4;
        if (window.bossMusic) window.bossMusic.volume = window.isMuted ? 0 : 0.4;
        if (window.finalBossMusic) window.finalBossMusic.volume = window.isMuted ? 0 : 0.5;
        if (window.gameOverMusic) window.gameOverMusic.volume = window.isMuted ? 0 : 0.4;
        if (window.victoryMusic) window.victoryMusic.volume = window.isMuted ? 0 : 0.5;
        
        console.log(`🔇 Volume ${window.isMuted ? 'MUTED' : 'UNMUTED'}`);
    });

    volumeBtn.onHover(() => {
        volumeBtn.color = rgb(100, 80, 150);
    });

    volumeBtn.onHoverEnd(() => {
        volumeBtn.color = rgb(42, 26, 74);
    });

    return { volumeBtn, volumeIcon };
}

// ============================================================================
// PAUSE SYSTEM
// ============================================================================
export function createPauseButton(onPauseCallback) {
    const pauseBtn = add([
        rect(24, 24, { radius: 10 }),
        pos(65,20),
        color(Color.fromHex(Colors.MutedGrey)),
        outline(1, Color.fromHex(Colors.VortexViolet)),
        area(),
        fixed(),
        z(100),
        "pauseButton"
    ]);

    pauseBtn.add([
        rect(5, 16),
        pos(6, 4),
        color(Color.fromHex(Colors.NuclearFuscia)),
        z(101)
    ]);

    pauseBtn.add([
        rect(5, 16),
        pos(13, 4),
        color(Color.fromHex(Colors.NuclearFuscia)),
        z(101)
    ]);

    pauseBtn.onClick(() => {
        onPauseCallback();
    });

    pauseBtn.onHover(() => {
        pauseBtn.color = Color.fromHex(Colors.VortexViolet);
    });

    pauseBtn.onHoverEnd(() => {
        pauseBtn.color = Color.fromHex(Colors.MutedGrey);
    });

    return pauseBtn;
}

export function createPauseOverlay(onResumeCallback, onQuitCallback) {
    const overlay = add([
        rect(SCREEN_W, SCREEN_H),
        pos(0, 0),
        color(0, 0, 0),
        opacity(0.7),
        fixed(),
        z(200),
        "pauseOverlay"
    ]);

    const menuPanel = add([
        rect(600, 400, { radius: 30 }),
        pos(200, 50),
        color(rgb(101,115,131)),
        outline(5, Color.fromHex(Colors.VortexViolet)),
        opacity(0.4),
        fixed(),
        z(201),
        "pauseMenu"
    ]);

    const menuPanelPop = add([
        rect(590, 390, { radius: 30 }),
        pos(205, 55),
        color(rgb(144,144,192)),
        opacity(0.3),
        fixed(),
        z(201),
        "pauseMenuPop"
    ]);

    menuPanel.add([
        text("PAWSed", { size: 70, font: "orbitronBold" }),
        pos(120, 25),
        color(Color.fromHex(Colors.NuclearFuscia)),
        z(204)
    ]);

    menuPanel.add([
        text("PAWSed", { size: 70, font: "orbitronBold" }),
        pos(122, 27),
        color(Color.fromHex(Colors.Black)),
        z(203)
    ]);

    const pawsed = menuPanel.add([
        sprite('pawsed'),
        pos(200, 100),
        fixed(),
        scale(2),
        opacity(1),
        z(202),
        "pawsed"
    ]);

    const resumeBtn = add([
        rect(200, 50, { radius: 40 }),
        pos(525, 350),
        color(Color.fromHex(Colors.Black)),
        outline(3, Color.fromHex(Colors.RadioactiveGreen)),
        area(),
        fixed(),
        z(203),
        "resumeBtn"
    ]);

    resumeBtn.add([
        text("RESUME", { size: 28, font: "orbitronBold" }),
        pos(100, 25),
        anchor("center"),
        color(255, 255, 255),
        z(204)
    ]);

    resumeBtn.onClick(() => {
        onResumeCallback();
    });

    resumeBtn.onHover(() => {
        resumeBtn.color = Color.fromHex(Colors.RadioactiveGreen);
    });

    resumeBtn.onHoverEnd(() => {
        resumeBtn.color = Color.fromHex(Colors.Black);
    });

    const quitBtn = add([
        rect(200, 50, { radius: 40 }),
        pos(275, 350),
        color(Color.fromHex(Colors.Black)),
        outline(3, Color.fromHex(Colors.VortexViolet)),
        area(),
        fixed(),
        z(203),
        "quitBtn"
    ]);

    quitBtn.add([
        text("QUIT", { size: 28, font: "orbitronBold" }),
        pos(100, 25),
        anchor("center"),
        color(255, 255, 255),
        z(204)
    ]);

    quitBtn.onClick(() => {
        onQuitCallback();
    });

    quitBtn.onHover(() => {
        quitBtn.color = Color.fromHex(Colors.NuclearFuscia);
    });

    quitBtn.onHoverEnd(() => {
        quitBtn.color = Color.fromHex(Colors.Black);
    });

    menuPanel.add([
        text("Press ESC or P to resume", { size: 18, font: "orbitron" }),
        pos(300, 375),
        anchor("center"),
        color(Color.fromHex(Colors.MintGlow)),
        z(202)
    ]);

    return { overlay, menuPanel, menuPanelPop, resumeBtn, quitBtn };
}

export function setupPauseSystem(gameActiveGetter, gameActiveSetter, onQuitCallback = null) {
    let isPaused = false;
    let pauseOverlay = null;
    let pauseMenu = null;
    let pauseMenuPop = null;
    let resumeBtn = null;
    let quitBtn = null;

    const pause = () => {
        if (!gameActiveGetter() || isPaused) return;
        
        isPaused = true;
        debug.paused = true;
        
        const overlay = createPauseOverlay(resume, quit);
        pauseOverlay = overlay.overlay;
        pauseMenu = overlay.menuPanel;
        pauseMenuPop = overlay.menuPanelPop;
        resumeBtn = overlay.resumeBtn;
        quitBtn = overlay.quitBtn;
    };

    const resume = () => {
        if (!isPaused) return;
        
        isPaused = false;
        debug.paused = false;
        
        if (pauseOverlay) {
            destroy(pauseOverlay);
            pauseOverlay = null;
        }
        if (pauseMenu) {
            destroy(pauseMenu);
            pauseMenu = null;
        }
        if (pauseMenuPop) {
            destroy(pauseMenuPop);
            pauseMenuPop = null;
        }
        if (resumeBtn) {
            destroy(resumeBtn);
            resumeBtn = null;
        }
        if (quitBtn) {
            destroy(quitBtn);
            quitBtn = null;
        }
    };

    const quit = () => {
        isPaused = false;
        debug.paused = false;
        
        if (pauseOverlay) {
            destroy(pauseOverlay);
            pauseOverlay = null;
        }
        if (pauseMenu) {
            destroy(pauseMenu);
            pauseMenu = null;
        }
        if (pauseMenuPop) {
            destroy(pauseMenuPop);
            pauseMenuPop = null;
        }
        if (resumeBtn) {
            destroy(resumeBtn);
            resumeBtn = null;
        }
        if (quitBtn) {
            destroy(quitBtn);
            quitBtn = null;
        }
        
        if (window.levelMusic) {
            window.levelMusic.stop();
            window.levelMusic = null;
        }
        
        if (onQuitCallback) {
            onQuitCallback();
        } else {
            go("menu");
        }
    };

    createPauseButton(pause);

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

    return {
        pause,
        resume,
        isPaused: () => isPaused
    };
}

export function addPauseToLevel(gameActiveGetter, gameActiveSetter) {
    return setupPauseSystem(gameActiveGetter, gameActiveSetter);
}

// ============================================================================
// DOM MODAL STUFF
// ============================================================================
export function initializeModals() {
    document.addEventListener('DOMContentLoaded', () => {
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
    });
}