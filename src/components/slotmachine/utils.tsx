import { checkSameStrings, checkUniqueStrings, getEasing } from '../../utils';
import { ReelDef, Tile, ReelCombo, REEL_HEIGHT, ReelComboResult, BonusGroup } from './data';

export type ReelTarget = [tileIdx: number, spinCount: number];

// later on, some factors should weight the "random"
export const getRandomIdx = (array: any[]) => Math.floor(Math.random() * array.length);
export const getRandom2dIdxs = (arrayOfArrays: any[][]) => {
  return arrayOfArrays.map((array) => getRandomIdx(array));
};

export const getRandomReelTargets = (reelSet: ReelDef[], spinCount: number) => {
  return reelSet.map((reelDef) => [getRandomIdx(reelDef.tiles), spinCount] as ReelTarget);
};

export const getFirstMatchingBonus = (bonuses: BonusGroup[], tiles: Tile[]) => {
  for (var i = 0; i < bonuses.length; i++) {
    switch (bonuses[i].bonusType) {
      case 'same':
        if (checkSameStrings(tiles.map((rI) => rI.label))) {
          return bonuses[i];
        }
        break;
      case 'unique':
        if (checkUniqueStrings(tiles.map((rI) => rI.label))) {
          return bonuses[i];
        }
        break;
      default:
        return bonuses[i]; //any
    }
  }

  return null;
};

export const getActiveCombos = (tiles: Tile[], reelCombos: ReelCombo[]) => {
  // loop each combo
  let activeCombos = reelCombos.reduce((combos, rC) => {
    for (var a = 0; a < rC.attributes.length; a++) {
      // if every tile has a matching attribute
      if (
        tiles.filter((rI) => {
          return rI.attributes && rI.attributes?.indexOf(rC.attributes[a]) > -1;
        }).length === tiles.length
      ) {
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
    let baseScore = tiles.reduce((acc, tile) => (acc += (tile.score || 0)), 0);

    if (aC.bonus?.multiplier) {
      totScore += aC.bonus.multiplier * baseScore;
    }
    if (aC.bonus?.value) {
      totScore += aC.bonus.value;
    }

    return totScore;
  }, 0);

// add redudant tiles to top and bottom of reel to make it seem continuous
export const buildReel = (tiles: any[], reelOverlap: number) => {
  // starting with [ 0, 1, 2 ]

  // [ +1, +2, 0, 1, 2 ]
  const loopBefore = [];
  // the +1 here attached the last to the top, regardless of overlap value
  for (let i = 0; i < reelOverlap; i++) {
    const offset = tiles.length - (i % tiles.length) - 1;
    loopBefore.push(tiles[offset]);
  }

  // [ 0, 1, 2 ] -> [ 0, 1, 2, +0, +1 ]
  const loopAfter = [];
  for (let i = 0; i < reelOverlap; i++) {
    loopAfter.push(tiles[i % tiles.length]);
  }

  return ([] as any[])
    .concat(loopBefore.reverse())
    .concat(tiles.map((rI) => rI))
    .concat(loopAfter);
};

export const getProgressiveSpinAngle = (perc: number, targetAngle: number, lastAngle: number) => {
  return getEasing(perc, 'easeInOutQuad') * (targetAngle - lastAngle);
};

/*
  from an array like [ 'a', 'b' ], figure out how to do something like
  "starting from "b", go to "a", and loop at least 2 times"

  this could probably get cleaned up and simplified but im sick of messing with it.
*/
export const projectSpinTarget = (numTiles: number, curIdx: number, nextIdx: number, loops: number) => {
  const change = nextIdx - curIdx;

  if (loops === 0) {
    if (change === 0) {
      return curIdx + numTiles;
    } else if (change > 0) {
      return curIdx + change;
    } else {
      return curIdx + numTiles + change;
    }
  } else {
    if (change === 0) {
      return curIdx + numTiles * loops;
    } else if (change > 0) {
      return curIdx + numTiles * loops + change;
    } else {
      return curIdx + numTiles * loops + (numTiles + change);
    }
  }
};

export const projectSpinAngle = (numTiles: number, targetIdx: number, curIdx: number) => {
  if (numTiles === 1) {
    return targetIdx * REEL_HEIGHT;
  }
  return (targetIdx / numTiles) * (numTiles * REEL_HEIGHT) - curIdx * REEL_HEIGHT;
};
