// characterSpriteLoader.js
import { getCharacterList, SPRITE_FRAMES, RAINBOW_CAT_FRAMES } from '../config/characters.js';


export class CharacterSpriteLoader {
  constructor() {
    this.loadedCharacters = new Set();
    this.loadingPromises = new Map();
  }

  async loadCharacterPortraits() {
    console.log('🎨 Loading character portraits for selection...');
    
    const characters = getCharacterList();
    const loadPromises = characters.map(char => {
      const portraitName = `${char.name}Portrait`;
      const portraitPath = `assets/images/portraits/${char.name}.png`;
      
      return new Promise((resolve, reject) => {
        try {
          window.loadSprite(portraitName, portraitPath);
          console.log(`✅ Loaded portrait: ${char.name}`);
          resolve();
        } catch (error) {
          console.error(`❌ Failed to load portrait for ${char.name}:`, error);
          reject(error);
        }
      });
    });

    await Promise.all(loadPromises);
    console.log('✅ All character portraits loaded!');
  }

  /**
   * Lazy load a specific character's sprite sheet
   * Only loads if not already loaded
   * @param {Object} character - Character object from characters.js
   * @returns {Promise<void>}
   */
  async loadCharacterSprite(character) {
    const charName = character.name;
    
    if (this.loadedCharacters.has(charName)) {
      console.log(`✅ ${charName} sprite sheet already loaded`);
      return Promise.resolve();
    }

    if (this.loadingPromises.has(charName)) {
      console.log(`⏳ ${charName} sprite sheet already loading, waiting...`);
      return this.loadingPromises.get(charName);
    }

    console.log(`🐱 Lazy loading sprite sheet for: ${charName}...`);
    
    const loadPromise = new Promise((resolve, reject) => {
      try {
        window.loadSprite(`${charName}Sheet`, character.sprites.sheet, {
          sliceX: 28,
          sliceY: 1,
          anims: {
            walk: { 
              from: SPRITE_FRAMES.walk0, 
              to: SPRITE_FRAMES.walk7, 
              loop: true, 
              speed: 10 
            }
          }
        });

        this.loadedCharacters.add(charName);
        this.loadingPromises.delete(charName);
        console.log(`✅ ${charName} sprite sheet loaded!`);
        resolve();
      } catch (error) {
        console.error(`❌ Failed to load sprite sheet for ${charName}:`, error);
        this.loadingPromises.delete(charName);
        reject(error);
      }
    });

    this.loadingPromises.set(charName, loadPromise);
    return loadPromise;
  }

  /**
   * Load Rainbow Cat sprite (used for special levels/items)
   */
  async loadRainbowCat() {
    if (this.loadedCharacters.has('RainbowCat')) {
      console.log('✅ Rainbow Cat sprite already loaded');
      return Promise.resolve();
    }

    console.log('🌈 Loading Rainbow Cat sprite...');
    
    return new Promise((resolve, reject) => {
      try {
        window.loadSprite("rainbowCatSheet", "assets/images/cats/RainbowCat.png", {
          sliceX: 12,
          sliceY: 1,
          anims: {
            walk: { 
              from: RAINBOW_CAT_FRAMES.walk0, 
              to: RAINBOW_CAT_FRAMES.walk7, 
              loop: true, 
              speed: 10 
            }
          }
        });

        this.loadedCharacters.add('RainbowCat');
        console.log('✅ Rainbow Cat sprite loaded!');
        resolve();
      } catch (error) {
        console.error('❌ Failed to load Rainbow Cat sprite:', error);
        reject(error);
      }
    });
  }

  /**
   * Check if a character's sprite is loaded
   */
  isLoaded(characterName) {
    return this.loadedCharacters.has(characterName);
  }

  /**
   * Preload multiple character sprites
   * Useful if you want to load a few characters ahead of time
   */
  async preloadCharacters(characterNames) {
    const characters = getCharacterList();
    const loadPromises = characterNames.map(name => {
      const char = characters.find(c => c.name === name);
      if (char) {
        return this.loadCharacterSprite(char);
      }
      console.warn(`⚠️ Character ${name} not found`);
      return Promise.resolve();
    });

    return Promise.all(loadPromises);
  }

  /**
   * Get loading statistics
   */
  getStats() {
    return {
      loadedCount: this.loadedCharacters.size,
      loadingCount: this.loadingPromises.size,
      loadedCharacters: Array.from(this.loadedCharacters)
    };
  }
}

export const characterSpriteLoader = new CharacterSpriteLoader();