// gameConfig.js
export const SCREEN_W = 1000;
export const SCREEN_H = 480;
export const FPS = 60;

export const Colors = {
    BG: '#FFC7FF',
    FedBlue: '#2A3439',          
    FedBlue2: '#2A3439',
    ElectricLilac: '#A55AFF',
    SoftPeriwinkle: '#9090C0',
    Mauve: '#A55AFF',
    LightMauve: '#A55AFF',
    Black: '#000000',
    White: '#FFFFFF',
    ButtonColor: '#2A3439',
    Grey: '#6c757d',
    Highlight: '#75FB1E',
    CatCardBG: '#657383',
    CatCardBorder: '#A55AFF',
    Green: '#58e84c',
    BrightLilac: '#dc4ce8',
    Claret: '#730132',
    Amethyst: '#830cde',
    Periwinkle: '#9090C0',
    MintGlow: '#67FEBD',
    DustyPeriwinkle: '#2A3439',
    TropicalIndigo: '#9090C0',
    GhostLilac: '#f3ffe5',
    VioletRose: '#A55AFF',
    CoolGray: '#9090C0',
    MintBlue: '#00ffff',
    SlateBlue: '#00ffff',
    MidnightPurple: '#37025a',


    MutedGrey: '#C4C3D0',
    DarCoolGrey: '#657383',
    GrayGrayGrey: '#8391A1',
    DarkDarkGray: '#2A3439',
    NewCoolGrey: '#9090C0',
    LightGray: '#DBE2E9',
    PlasmaPurple: '#830cde',
    RadiationRed: '#730132',
    NuclearFuscia: '#dc4ce8',
    VortexViolet: '#A55AFF',
    ParticlePink: '#FFC7FF',
    RadioactiveGreen: '#58e84c',
    HalflifeLime: '#f3ffe5',
    AlphaAqua: '#67FEBD',
    BosonBlue: '#29005c',
    UraniumGreen: '#75FB1E',
};

export const ASSET_PATHS = {
    backgrounds: {
        menu: 'assets/images/CATastrophe/MenuBG3.png',
        select: 'assets/images/CATastrophe/Select.png',
        battle: 'assets/images/CATastrophe/BattleBG.png',
        game: 'assets/images/CATastrophe/GameBackground.png'
    },
    enemies: {
        cucumber: 'assets/images/CATastrophe/BossCucumber.png',
        littleCucumber: 'assets/images/CATastrophe/LittleCucumber.png',
        cup: 'assets/images/CATastrophe/Cup.png',
        bossCup: 'assets/images/CATastrophe/BossCup.png',
        observer: 'assets/images/CATastrophe/Observer.png'
    }
};

export const GAME_STATES = {
    MENU: 'MENU',
    INSTRUCTIONS: 'INSTRUCTIONS',
    CAT_SELECT: 'CAT_SELECT',
    PLATFORMER: 'PLATFORMER',
    LEVEL_COMPLETE: 'LEVEL_COMPLETE',
    GAME_OVER: 'GAME_OVER',
    CUP_BOSS_BATTLE: 'CUP_BOSS_BATTLE',
    CUP_BOSS_WIN: 'CUP_BOSS_WIN',
    CUP_BOSS_LOSE: 'CUP_BOSS_LOSE',
    LEVEL_2: 'LEVEL_2',
    LEVEL2_COMPLETE: 'LEVEL2_COMPLETE',
    LEVEL2_GAME_OVER: 'LEVEL2_GAME_OVER',
    CUCUMBER_BOSS_BATTLE: 'CUCUMBER_BOSS_BATTLE',
    CUCUMBER_BOSS_WIN: 'CUCUMBER_BOSS_WIN',
    CUCUMBER_BOSS_LOSE: 'CUCUMBER_BOSS_LOSE',
    LEVEL_3: 'LEVEL_3',
    LEVEL3_COMPLETE: 'LEVEL3_COMPLETE',
    LEVEL3_GAME_OVER: 'LEVEL3_GAME_OVER',
    OBSERVER_BOSS_BATTLE: 'OBSERVER_BOSS_BATTLE',
    OBSERVER_BOSS_WIN: 'OBSERVER_BOSS_WIN',
    OBSERVER_BOSS_LOSE: 'OBSERVER_BOSS_LOSE',
    CREDIS: 'CREDITS'
};