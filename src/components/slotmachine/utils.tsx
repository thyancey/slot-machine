import { checkForWildCards, checkSameStrings, checkUniqueStrings, clamp, getEasing } from '../../utils';
import {
  Tile,
  ReelCombo,
  ReelComboResult,
  BonusGroup,
  DeckIdxCollection,
  PlayerInfo,
  EffectType,
  AttackDelta,
} from '../../store/data';

export type ReelTarget = [tileIdx: number, spinCount: number];

// later on, some factors should weight the "random"
export const getRandomIdx = (array: unknown[]) => Math.floor(Math.random() * array.length);
export const getRandom2dIdxs = (arrayOfArrays: unknown[][]) => {
  return arrayOfArrays.map((array) => getRandomIdx(array));
};

export const pickRandomsFromArray = (numChoices: number, array: unknown[]) => {
  const idxs = Array.from(Array(array.length).keys());
  const shuffledIdxs = idxs.sort(() => Math.random() - 0.5);

  return shuffledIdxs.slice(0, numChoices).map((i) => array[i]) as unknown[];
};

export const pickRandomFromArray = (array: unknown[]) => {
  return array[getRandomIdx(array)];
};

// what the hell is this, redo this
export const getFirstMatchingBonus = (bonuses: BonusGroup[], tiles: Tile[]) => {
  const wildcard = bonuses.find((b) => b.bonusType === '*');
  if (wildcard) {
    if (checkForWildCards(bonuses, tiles)) {
      return wildcard;
    }
  }
  const same = bonuses.find((b) => b.bonusType === 'same');
  if (same) {
    if (checkSameStrings(tiles.map((rI) => rI.label))) {
      return same;
    }
  }
  const unique = bonuses.find((b) => b.bonusType === 'unique');
  if (unique) {
    if (checkUniqueStrings(tiles.map((rI) => rI.label))) {
      return unique;
    }
  }

  return bonuses[0] ? bonuses[0] : null;
};

export const compareAttributes = (tiles: Tile[], comboAttribute: string) => {
  return (
    tiles.filter((tile) => {
      return comboAttribute === '*' || tile.attributes.includes('*') || tile.attributes.indexOf(comboAttribute) > -1;
    }).length === tiles.length
  );
};

export const getActiveCombos = (tiles: Tile[], reelCombos: ReelCombo[]) => {
  // loop each combo
  const activeCombos = reelCombos.reduce((combos, rC) => {
    for (let a = 0; a < rC.attributes.length; a++) {
      // if every tile has a matching attribute
      if (compareAttributes(tiles, rC.attributes[a])) {
        // you found one, this combo is validated
        combos.push({
          label: rC.label,
          attribute: rC.attributes[a],
          bonus: getFirstMatchingBonus(rC.bonuses, tiles),
        });

        return combos;
      }
    }

    return combos;
  }, [] as ReelComboResult[]);
  // gather groups of matching attributes
  // check labels for same or unique bonus
  // rank combos
  // console.log('gac', tiles, reelCombos, activeCombos);

  return activeCombos;
};

export const getComboScore = (tiles: Tile[], activeCombos: ReelComboResult[]) =>
  activeCombos.reduce((totScore, aC) => {
    const baseScore = tiles.reduce((totScore, tile) => (totScore += tile.score || 0), 0);

    if (aC.bonus?.multiplier) {
      totScore += aC.bonus.multiplier * baseScore;
    }
    if (aC.bonus?.value) {
      totScore += aC.bonus.value;
    }

    return totScore;
  }, 0);

export const getBasicScore = (tiles: Tile[]) => tiles.reduce((totScore, tile) => totScore + (tile.score || 0), 0);

// add redudant tiles to top and bottom of reel to make it seem continuous
export const getLoopedReel = (deckIdxs: DeckIdxCollection, reelOverlap: number) => {
  // starting with [ 0, 1, 2 ]

  // [ +1, +2, 0, 1, 2 ]
  const loopBefore = [];
  // the +1 here attached the last to the top, regardless of overlap value
  for (let i = 0; i < reelOverlap; i++) {
    const offset = deckIdxs.length - (i % deckIdxs.length) - 1;
    loopBefore.push(deckIdxs[offset]);
  }

  // [ 0, 1, 2 ] -> [ 0, 1, 2, +0, +1 ]
  const loopAfter = [];
  for (let i = 0; i < reelOverlap; i++) {
    loopAfter.push(deckIdxs[i % deckIdxs.length]);
  }

  return ([] as DeckIdxCollection).concat(loopBefore.reverse()).concat(deckIdxs).concat(loopAfter);
};

export const getProgressiveSpinAngle = (
  perc: number,
  targetLoopedIdx: number,
  curLoopedIdx: number,
  reelHeight: number
) => {
  const targetAngle = targetLoopedIdx * reelHeight;
  const lastAngle = curLoopedIdx * reelHeight;

  return lastAngle + getEasing(perc, 'easeInOutQuad') * (targetAngle - lastAngle);
};

/**
 * from a known starting position, move at least X positions, and whatever more needed to land on the desired idx
 * ]
 * @param curLoopedIdx the idx (spin position) of the reel
 * @param targSlotIdx the idx (of slots in a reel) you want to land on
 * @param reelLength # of slots in the reel
 * @param minSlots how many slots to rotate past before landing on the target
 * @returns positionIndex of where the reel needs to go
 */
export const getSpinTarget = (curLoopedIdx: number, targSlotIdx: number, reelLength: number, minSlots: number) => {
  const minLoopedIdx = curLoopedIdx + minSlots;

  const minSlotIdx = minLoopedIdx % reelLength; // what position the min value is at

  if (minSlotIdx === targSlotIdx) {
    // youre on the spot you wanted to go to!
    return minLoopedIdx;
  } else if (minSlotIdx < targSlotIdx) {
    // ex, at idx 1, need to go to idx 2
    // rotate a few more places to end up on your desired targSlotIdx
    return minLoopedIdx + targSlotIdx - minSlotIdx;
  } else {
    // ex, at idx 2, need to go to idx 0
    // rotate a few more places (loop around) to end up on your desired targSlotIdx
    return minLoopedIdx + (reelLength + targSlotIdx - minSlotIdx);
  }
};

export const getEffectDelta = (effectType: EffectType, activeTiles: Tile[], activeCombos: ReelComboResult[]) =>
  activeTiles.reduce((val, rS) => {
    if (activeCombos.length === 0) return 0;
    const atk = rS?.effects.find((ef) => ef.type === effectType);
    if (atk) {
      return val + atk.value;
    }
    return val;
  }, 0);

export const getPlayerAttackDelta = (
  playerInfo: PlayerInfo,
  enemyInfo: PlayerInfo,
  activeCombos: ReelComboResult[],
  activeTiles: Tile[]
) => {
  console.log('getPlayerAttackDelta', playerInfo, enemyInfo, activeCombos, activeTiles);

  const attackPower = getEffectDelta('attack', activeTiles, activeCombos);
  console.log('player ATTACK POWER', attackPower);
  const nextDefense = enemyInfo.defense - attackPower;
  
  const damage = nextDefense < 0 ? nextDefense : 0;

  const enemyResult = {
    // do other wacky checking here in the future about flame/poison weakness, etc
    hp: damage,
    attack: enemyInfo.attack, // todo - enemy stun?
    defense: 0 - attackPower, // todo - break enemy block?
  };

  return {
    player: {
      // check for heal or hurt modifiers
      hp: getEffectDelta('health', activeTiles, activeCombos),
      attack: attackPower,
      // apply block for enemy attack
      defense: getEffectDelta('defense', activeTiles, activeCombos),
    },
    enemy: enemyResult,
  } as AttackDelta;
};

export const getEnemyAttackDelta = (
  playerInfo: PlayerInfo,
  enemyInfo: PlayerInfo,
  activeCombos: ReelComboResult[],
  activeTiles: Tile[]
) => {
  console.log('getEnemyAttackDelta', playerInfo, enemyInfo, activeCombos, activeTiles);
  const attackPower = enemyInfo.attack;
  console.log('enemy ATTACK POWER', attackPower);

  const damage = attackPower - playerInfo.defense;

  const playerResult = {
    // do other wacky checking here in the future about flame/poison weakness, etc
    hp: damage > 0 ? 0 - damage : 0,
    attack: playerInfo.attack, // todo - stun player?
    defense: 0 - attackPower, // todo - break player block?
  };

  return {
    enemy: {
      hp: 0, // todo, apply thorns to enemy
      attack: attackPower,
      defense: 0, // todo, apply thorns to enemy
    },
    player: playerResult,
  };
};

export const computeRound = (
  playerInfo: PlayerInfo,
  enemyInfo: PlayerInfo,
  activeTiles: Tile[],
  activeCombos: ReelComboResult[]
) => {
  const curPlayer = { ...playerInfo };
  const curEnemy = { ...enemyInfo };

  // 1. player attempt to attack enemy
  const playerAttack = getPlayerAttackDelta(
    playerInfo as PlayerInfo,
    enemyInfo as PlayerInfo,
    activeCombos,
    activeTiles
  );
  console.log('playerAttack response:', playerAttack);
  
  // knock off any block
  curEnemy.defense += playerAttack.enemy.defense;
  if(curEnemy.defense < 0) curEnemy.defense = 0;
  curPlayer.defense += playerAttack.player.defense;
  if(curPlayer.defense < 0) curPlayer.defense = 0;

  // player check for thorns, burning, poison
  curPlayer.hp[0] += playerAttack.player.hp;
  curPlayer.hp[0] = clamp(curPlayer.hp[0], 0, curPlayer.hp[1]);
  if (curPlayer.hp[0] <= 0) {
    // 1a. player dead
    return {
      player: { hp: curPlayer.hp[0], defense: curPlayer.defense },
      enemy: { hp: curEnemy.hp[0], defense: curEnemy.defense }
    }
  }

  // 2. apply attack to enemy
  // buff, heal or hurt enemy
  curEnemy.hp[0] += playerAttack.enemy.hp;
  curEnemy.hp[0] = clamp(curEnemy.hp[0], 0, curEnemy.hp[1]);
  if (curEnemy.hp[0] <= 0) {
    // 2b. enemy dead
    return {
      player: { hp: curPlayer.hp[0], defense: curPlayer.defense },
      enemy: { hp: curEnemy.hp[0], defense: curEnemy.defense }
    }
  }



  // 3. enemy attempt to attack player
  const enemyAttack = getEnemyAttackDelta(curPlayer as PlayerInfo, curEnemy as PlayerInfo, activeCombos, activeTiles);
  // enemy check for thorns, burning, poison
  console.log('enemyAttack response:', enemyAttack);
  
  // knock off any block
  curEnemy.defense += enemyAttack.enemy.defense;
  if(curEnemy.defense < 0) curEnemy.defense = 0;
  curPlayer.defense += enemyAttack.player.defense;
  if(curPlayer.defense < 0) curPlayer.defense = 0;

  curEnemy.hp[0] += enemyAttack.enemy.hp;
  // buff, heal or hurt enemy
  curEnemy.hp[0] = clamp(curEnemy.hp[0], 0, curEnemy.hp[1]);
  if (curEnemy.hp[0] <= 0) {
    // 3a. enemy dead
    return {
      player: { hp: curPlayer.hp[0], defense: curPlayer.defense },
      enemy: { hp: curEnemy.hp[0], defense: curEnemy.defense }
    }
  }

  // 4. apply healing/hurt to player
  curPlayer.hp[0] += enemyAttack.player.hp;
  // buff, heal or hurt enemy
  curPlayer.hp[0] = clamp(curPlayer.hp[0], 0, curPlayer.hp[1]);
  if (curPlayer.hp[0] <= 0) {
    // 4b. enemy dead
    return {
      player: { hp: curPlayer.hp[0], defense: curPlayer.defense },
      enemy: { hp: curEnemy.hp[0], defense: curEnemy.defense }
    }
  }

  return {
    player: { hp: curPlayer.hp[0], defense: curPlayer.defense },
    enemy: { hp: curEnemy.hp[0], defense: curEnemy.defense }
  }
};
