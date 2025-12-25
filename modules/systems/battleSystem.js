// battleSystem.js - Universal boss battle system
import { getBoss, chooseBossMove, initializeBoss } from '../config/bosses.js';
export class BattleSystem {
    constructor(ctx) {
        this.ctx = ctx;
        this.bossConfig = null;
        this.player = null;
        this.enemy = null;
        this.log = "";
        this.waitingForPlayer = true;
    }

    /**
     * INITIALIZE
     * @param {string} bossId 
     * @param {Object} character 
     * @param {number} currentHP 
     */
    async init(bossId, character, currentHP = null) {
        console.log(`⚔️ Initializing boss battle: ${bossId}`);
        
        this.bossConfig = getBoss(bossId);
        
        await imageLoader.loadBossImages(this.bossConfig);
        

        this.player = {
            name: character.name,
            maxHP: character.stats.maxHP,
            hp: currentHP !== null ? Math.min(currentHP + (this.bossConfig.playerHPRestore || 0), character.stats.maxHP) : character.stats.maxHP,
            atk: character.stats.baseAtk,         
            defense: character.stats.baseDefense,  
            speed: character.stats.baseSpeed,      
            baseSpeed: character.stats.baseSpeed,
            speedBuffTurns: 0,
            defenseBuffTurns: 0,
            moves: JSON.parse(JSON.stringify(character.moves)),
            sprite: character.sprites.big
        };
        
        this.enemy = initializeBoss(bossId);
        
        this.log = this.bossConfig.introMessage;
        this.waitingForPlayer = true;
        
        console.log(`✅ Boss battle initialized: ${this.enemy.name} vs ${this.player.name}`);
    }

    /**
     * EXECUTE BATTLE TURN
     * @param {string} playerMoveName 
     * @returns {string|null} 
     */
    executeTurn(playerMoveName) {
        const playerMove = this.player.moves[playerMoveName];
        
   
        if (!playerMove || playerMove.uses <= 0) {
            this.log = "That move has no uses left!";
            return null;
        }
        
    
        playerMove.uses--;
        
       
        const enemyMoveName = chooseBossMove(this.enemy, this);
        const enemyMove = this.enemy.moves[enemyMoveName];
        
        
        if (enemyMove.uses > 0) {
            enemyMove.uses--;
        }
        
       
        const playerSpeed = this.getEffectiveSpeed(this.player);
        const enemySpeed = this.getEffectiveSpeed(this.enemy);
        const playerGoesFirst = playerSpeed >= enemySpeed;
        
        let log = "";
        
        if (playerGoesFirst) {
           
            const playerResult = this.executeMove(this.player, this.enemy, playerMove, playerMoveName);
            log += playerResult;
            
            
            if (this.enemy.hp <= 0) {
                this.log = log;
                return 'victory';
            }
            
            log += "\n";
            
            
            const enemyResult = this.executeMove(this.enemy, this.player, enemyMove, enemyMoveName);
            log += enemyResult;
            
           
            if (this.player.hp <= 0) {
                this.log = log;
                return 'defeat';
            }
        } else {
            
            const enemyResult = this.executeMove(this.enemy, this.player, enemyMove, enemyMoveName);
            log += enemyResult;
            
            
            if (this.player.hp <= 0) {
                this.log = log;
                return 'defeat';
            }
            
            log += "\n";
            
           
            const playerResult = this.executeMove(this.player, this.enemy, playerMove, playerMoveName);
            log += playerResult;
            
         
            if (this.enemy.hp <= 0) {
                this.log = log;
                return 'victory';
            }
        }
        
   
        this.tickBuffs(this.player);
        this.tickBuffs(this.enemy);
        
        this.log = log;
        return null;
    }

    /**
     * EXECUTE SINGLE MOVE
     * @param {Object} attacker
     * @param {Object} target 
     * @param {Object} move 
     * @param {string} moveName 
     * @returns {string}
     */
    executeMove(attacker, target, move, moveName) {
        let log = "";
        const isPlayer = attacker === this.player;
        const attackerName = isPlayer ? attacker.name : `${attacker.name}`;
        
      
        if (move.dmg) {
            const result = this.calculateDamage(attacker, target, move.dmg, move.critChance || 0.12);
            target.hp = Math.max(0, target.hp - result.damage);
            log += `${attackerName} used ${moveName}! Dealt ${result.damage} damage!`;
            if (result.crit) {
                log += " CRITICAL HIT!";
            }
        }
       
        else if (move.heal) {
            const healed = Math.min(move.heal, attacker.maxHP - attacker.hp);
            attacker.hp += healed;
            log += `${attackerName} used ${moveName}! Restored ${healed} HP!`;
        }
        
        else if (move.defenseBoost) {
            attacker.defenseBuffTurns = move.duration || 2;
            log += `${attackerName} used ${moveName}! Defense increased for ${attacker.defenseBuffTurns} turns!`;
        }
        
        
        if (move.speedBoost) {
            attacker.speedBuffTurns = 1;
            log += " Speed increased!";
        }
        
        return log;
    }

    /**
     * CALCULATE DAMAGE
     * @param {Object} attacker
     * @param {Object} defender
     * @param {number} power 
     * @param {number} critChance 
     * @returns {Object} 
     */
    calculateDamage(attacker, defender, power, critChance = 0.12) {

        const randomFactor = 0.92 + Math.random() * 0.16;
        
        
        const isCrit = Math.random() < critChance;
        const critMult = isCrit ? 1.6 : 1.0;
        
     
        const defenderDefense = this.getEffectiveDefense(defender);
        const defFactor = defenderDefense / (defenderDefense + 100);
        
        
        const base = (attacker.atk / (1 + defFactor)) * (power / 20) * randomFactor * critMult;
        
        return {
            damage: Math.max(1, Math.floor(base)),
            crit: isCrit
        };
    }

    /**
     * GET EFFECTIVE SPEED INCLUDING BUFFS
     * @param {Object} entity
     * @returns {number}
     */
    getEffectiveSpeed(entity) {
        const buffMultiplier = entity.speedBuffTurns > 0 ? 1.35 : 1.0;
        return Math.floor(entity.speed * buffMultiplier);
    }

    /**
     * GET EFFECTIVE DEFENSE
     * @param {Object} entity
     * @returns {number}
     */
    getEffectiveDefense(entity) {
        const buffMultiplier = entity.defenseBuffTurns > 0 ? 1.4 : 1.0;
        return entity.defense * buffMultiplier;
    }

    /**
     * TICK DOWN BUFF DURATION
     * @param {Object} entity
     */
    tickBuffs(entity) {
        if (entity.speedBuffTurns > 0) {
            entity.speedBuffTurns--;
        }
        if (entity.defenseBuffTurns > 0) {
            entity.defenseBuffTurns--;
        }
    }

    /**
     * GET NEXT GAME STATE
     * @param {boolean} victory 
     * @returns {string} 
     */
    getNextState(victory) {
        if (victory) {
            return this.bossConfig.victoryState;
        } else {
            return this.bossConfig.defeatState;
        }
    }

    /**
     * GET STATE TO TRANSITIONS
     * @returns {string}
     */
    getPostVictoryState() {
        return this.bossConfig.nextState;
    }

    /**
     * CHECK IF MOVE IS AVAILABLE
     * @param {string} moveName
     * @returns {boolean}
     */
    isMoveAvailable(moveName) {
        const move = this.player.moves[moveName];
        return move && move.uses > 0;
    }

    /**
     * GET ALL AVAILABLE MOVES
     * @returns {Object} 
     */
    getAvailableMoves() {
        const available = {};
        for (const [name, move] of Object.entries(this.player.moves)) {
            if (move.uses > 0) {
                available[name] = move;
            }
        }
        return available;
    }

    getMoveList() {
        return this.player.moves; 
    }

    /**
     * GET CCURRENT BATTLE LOG
     * @returns {string}
     */
    getLog() {
        return this.log;
    }

    /**
     * GET PLAYER DATA
     * @returns {Object}
     */
    getPlayer() {
        return this.player;
    }

    /**
     * GET ENEMY DATA
     * @returns {Object}
     */
    getEnemy() {
        return this.enemy;
    }

    /**
     * GET BOSS CONFIG
     * @returns {Object}
     */
    getBossConfig() {
        return this.bossConfig;
    }

    /**
     * RESET BATTLE
     * @param {Object} character 
     */
    async reset(character) {
        await this.init(this.bossConfig.id, character);
    }
}

/**
 * CALC HP BAR PERCENTS
 * @param {Object} entity
 * @returns {number} 
 */
export function getHPPercentage(entity) {
    return entity.hp / entity.maxHP;
}

/**
 * HP BAR COLOR
 * @param {number} percentage 
 * @returns {string} 
 */
export function getHPBarColor(percentage) {
    if (percentage > 0.5) return "#66FF99"; 
    if (percentage > 0.25) return "#FFD700"; 
    return "#FF6666"; 
}


/**
 * CALCULATE DAMAGE FOR OUTSIDE OF BATTLE SYSTEM
 */
export function calculateDamage(attacker, defender, power, critChance = 0.12) {
  const randomFactor = 0.92 + Math.random() * 0.16;
  
  const isCrit = Math.random() < critChance;
  const critMult = isCrit ? 1.6 : 1.0;
  
  const defenderDefense = defender.defense * (defender.defenseBuffTurns > 0 ? 1.4 : 1.0);
  const defFactor = defenderDefense / (defenderDefense + 100);
  
  const base = (attacker.atk / (1 + defFactor)) * (power / 20) * randomFactor * critMult;
  
  return {
    damage: Math.max(1, Math.floor(base)),
    crit: isCrit
  };
}

/**
 * EXECUTE MOVE
 */

export function executeMove(attacker, defender, moveName, move) {
  let log = "";
  
  if (move.heal) {
  
    const healAmount = Math.min(parseInt(move.heal), attacker.maxHP - attacker.hp);
    attacker.hp = parseInt(attacker.hp) + healAmount;  // ← Force to number!
    log = `${attacker.name} used ${moveName} and restored ${healAmount} HP!`;
  } else if (move.dmg) {
 
    const damage = calculateDamage(attacker, defender, parseInt(move.dmg));
    defender.hp = Math.max(0, parseInt(defender.hp) - damage);  // ← Force to number!
    log = `${attacker.name} used ${moveName} and dealt ${damage} damage!`;
    
  
    if (move.speedBoost) {
      attacker.speedBuffTurns = 2;
      log += ` ${attacker.name}'s speed increased!`;
    }
  }
  
  return log;
}