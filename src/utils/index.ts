import { BonusGroup, Tile } from '../store/data';

export type MinMaxTouple = [min: number, max: number];
export const randInRange = (range: MinMaxTouple, isIndexes = false) => {
  const val = Math.random() * (range[1] - range[0]) + range[0];
  return isIndexes ? Math.floor(val) : val;
};
export const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

export type EasingFunction = 'linear' | 'easeInOutQuad' | 'easeInOutBounce';
export const getEasing = (perc: number, easingFunc: EasingFunction) => {
  switch(easingFunc){
    case 'linear': return easeLinear(perc);
    case 'easeInOutQuad': return easeInOutQuad(perc);
    default: return easeLinear(perc);
  }
};
const easeLinear = (t: number) => t;
const easeInOutQuad = (t: number) => {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

export const checkSameStrings = (items: string[]) => items.filter((i) => i === items[0]).length === items.length;
export const checkUniqueStrings = (items: string[]) => {
  const unique = items.reduce((acc, str) => {
    if (acc.indexOf(str) === -1) {
      return [...acc, str];
    }
    return acc;
  }, [] as string[]);
  return unique.length === items.length;
};

// if a tile has a wildcard AND a bonus accepts wildcards, then you can allow it
export const checkForWildCards = (bonuses: BonusGroup[], tiles: Tile[]) => {
  return !!tiles.find(t => t.attributes.includes('*')) && !!bonuses.find(b => b.bonusType === '*');
}

export const pickRandomFromArray = (numChoices: number, array: unknown[]) => {
  const idxs = Array.from(Array(array.length).keys());
  const shuffledIdxs = idxs.sort(() => Math.random() - 0.5);
  
  return shuffledIdxs.slice(0, numChoices).map(i => array[i]);
};