import { getEasing } from '../../utils';
import { ReelDef, ReelItem, ReelCombo, REEL_HEIGHT } from './reel-data';

export type ReelTarget = [itemIdx: number, spinCount: number];

// later on, some factors should weight the "random"
export const getRandomReelIdx = (reelDef: ReelDef) => Math.floor(Math.random() * reelDef.reelItems.length);
export const getRandomReelTargets = (reelSet: ReelDef[], spinCount: number) => {
  return reelSet.map((reelDef) => [getRandomReelIdx(reelDef), spinCount] as ReelTarget);
};

export const getActiveCombos = (reelItems: ReelItem[], reelCombos: ReelCombo[]) => {
  // loop each combo
    // gather groups of matching attributes
      // check labels for same or unique bonus
  // rank combos
  console.log('gac', reelItems, reelCombos);
  return [];
}


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