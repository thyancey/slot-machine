import { checkSameStrings, checkUniqueStrings, clamp, getEasing } from '../../utils';
import {
  Tile,
  ReelCombo,
  ReelComboResult,
  BonusGroup,
  DeckIdxCollection,
  PlayerInfo,
  EffectType,
  DeckState,
  AttackDef,
  EMPTY_ATTACK,
} from '../../store/data';

export type ReelTarget = [tileIdx: number, spinCount: number];

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

export const calcAttackAndBlock = (
  defender: PlayerInfo,
  attackDef: AttackDef
) => {
  if (attackDef.attack >= defender.defense) {
    // busted through shield
    return {
      defense: 0 - defender.defense,
      hp: 0 - (attackDef.attack - defender.defense)
    }
  } else {
    // blocked!
    return {
      defense: 0 - attackDef.attack,
      hp: 0
    }
  }
}

// eventually, thorns, poison, flame stuff
export const computeAttack = (
  defender: PlayerInfo,
  attackDef: AttackDef = EMPTY_ATTACK
) => {
  const deltas = calcAttackAndBlock(defender, attackDef);

  return {
    attacker: {
      hpDelta: 0,
      defenseDelta: attackDef.defense
    },
    defender: {
      hp: clamp(defender.hp + deltas.hp, 0, defender.hpMax),
      defense: clamp(defender.defense + deltas.defense, 0, 1000),
      hpDelta: deltas.hp,
      defenseDelta: deltas.defense
    }
  }
};

// if a tile has a wildcard AND a bonus accepts wildcards, then you can allow it
export const checkForWildCards = (bonuses: BonusGroup[], tiles: Tile[]) => {
  return !!tiles.find(t => t.attributes.includes('*')) && !!bonuses.find(b => b.bonusType === '*');
}


/**
 * Pull cards from the top of the deck. If there is no more draw pile, refill it from the discard. Do not
 */
export const drawTile = (deckState: DeckState, noRefill?: boolean) => {
  if (deckState.draw.length === 0) {
    if (noRefill || deckState.discard.length === 0) {
      console.log('!! no more cards!');
      // well apparently theres no cards left, so just give back what you had
      return deckState;
    }

    // refill / shuffle the deck
    const shuffledDraw = deckState.discard.sort(() => Math.random() - 0.5);
    deckState.draw = shuffledDraw;
    deckState.discard = [];
  }

  return {
    drawn: [...deckState.drawn, deckState.draw[deckState.draw.length - 1]],
    draw: deckState.draw.slice(0, -1),
    discard: deckState.discard,
  };
};

export const drawTiles = (numToDraw: number, deckState: DeckState) => {
  const availableToDraw = clamp(numToDraw, 1, deckState.draw.length + deckState.discard.length);
  const operations = Array.from(Array(availableToDraw).keys());

  return operations.reduce((acc) => {
    return drawTile(acc);
  }, deckState);
};

export const discardTiles = (discardIdxs: number[], deckState: DeckState) => {
  return {
    drawn: deckState.drawn.filter((tileIdx) => !discardIdxs.includes(tileIdx)),
    draw: deckState.draw,
    discard: [...deckState.discard, ...discardIdxs],
  };
};