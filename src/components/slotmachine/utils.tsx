import { checkSameStrings, checkUniqueStrings, getEasing } from '../../utils';
import { ReelDef, ReelItem, ReelCombo, REEL_HEIGHT, ReelComboResult, BonusGroup } from './data';

export type ReelTarget = [itemIdx: number, spinCount: number];

// later on, some factors should weight the "random"
export const getRandomReelIdx = (reelDef: ReelDef) => Math.floor(Math.random() * reelDef.reelItems.length);
export const getRandomReelTargets = (reelSet: ReelDef[], spinCount: number) => {
  return reelSet.map((reelDef) => [getRandomReelIdx(reelDef), spinCount] as ReelTarget);
};

export const getFirstMatchingBonus = (bonuses: BonusGroup[], reelItems: ReelItem[]) => {
  for (var i = 0; i < bonuses.length; i++) {
    switch (bonuses[i].bonusType) {
      case 'same':
        if (checkSameStrings(reelItems.map((rI) => rI.label))) {
          return bonuses[i];
        }
        break;
      case 'unique':
        if (checkUniqueStrings(reelItems.map((rI) => rI.label))) {
          return bonuses[i];
        }
        break;
      default:
        return bonuses[i]; //any
    }
  }

  return null;
};

export const getActiveCombos = (reelItems: ReelItem[], reelCombos: ReelCombo[]) => {
  // loop each combo
  let activeCombos = reelCombos.reduce((combos, rC) => {
    for (var a = 0; a < rC.attributes.length; a++) {
      // if every item has a matching attribute
      if (
        reelItems.filter((rI) => {
          return rI.attributes && rI.attributes?.indexOf(rC.attributes[a]) > -1;
        }).length === reelItems.length
      ) {
        // you found one, this combo is validated
        combos.push({
          label: rC.label,
          attribute: rC.attributes[a],
          bonus: getFirstMatchingBonus(rC.bonuses, reelItems),
        });

        return combos;
      }
    }

    return combos;
  }, [] as ReelComboResult[]);
  // gather groups of matching attributes
  // check labels for same or unique bonus
  // rank combos
  console.log('gac', reelItems, reelCombos, activeCombos);

  return activeCombos;
};

export const getComboScore = (reelItems: ReelItem[], activeCombos: ReelComboResult[]) =>
  activeCombos.reduce((totScore, aC) => {
    console.log('reelItems', reelItems);
    let baseScore = reelItems.reduce((acc, reelItem) => (acc += (reelItem.score || 0)), 0);
    console.log('baseScore', baseScore);

    if (aC.bonus?.multiplier) {
      totScore += aC.bonus.multiplier * baseScore;
    }
    if (aC.bonus?.value) {
      totScore += aC.bonus.value;
    }

    return totScore;
  }, 0);

// add redudant items to top and bottom of reel to make it seem continuous
export const buildReel = (reelItems: any[], reelOverlap: number) => {
  // starting with [ 0, 1, 2 ]

  // [ +1, +2, 0, 1, 2 ]
  const loopBefore = [];
  // the +1 here attached the last to the top, regardless of overlap value
  for (let i = 0; i < reelOverlap; i++) {
    const offset = reelItems.length - (i % reelItems.length) - 1;
    loopBefore.push(reelItems[offset]);
  }

  // [ 0, 1, 2 ] -> [ 0, 1, 2, +0, +1 ]
  const loopAfter = [];
  for (let i = 0; i < reelOverlap; i++) {
    loopAfter.push(reelItems[i % reelItems.length]);
  }

  return ([] as any[])
    .concat(loopBefore.reverse())
    .concat(reelItems.map((rI) => rI))
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
export const projectSpinTarget = (numItems: number, curIdx: number, nextIdx: number, loops: number) => {
  const change = nextIdx - curIdx;

  if (loops === 0) {
    if (change === 0) {
      return curIdx + numItems;
    } else if (change > 0) {
      return curIdx + change;
    } else {
      return curIdx + numItems + change;
    }
  } else {
    if (change === 0) {
      return curIdx + numItems * loops;
    } else if (change > 0) {
      return curIdx + numItems * loops + change;
    } else {
      return curIdx + numItems * loops + (numItems + change);
    }
  }
};

export const projectSpinAngle = (numItems: number, targetIdx: number, curIdx: number) => {
  if (numItems === 1) {
    return targetIdx * REEL_HEIGHT;
  }
  return (targetIdx / numItems) * (numItems * REEL_HEIGHT) - curIdx * REEL_HEIGHT;
};
