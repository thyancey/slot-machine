// import R7 from '../../assets/reels/reel-7.gif';
// import Rbar1 from '../../assets/reels/reel-bar1.gif';
// import Rbar2 from '../../assets/reels/reel-bar2.gif';
// import Rbar3 from '../../assets/reels/reel-bar3.gif';
// import Rbat from '../../assets/reels/reel-bat.gif';
// import Rcoins from '../../assets/reels/reel-coins.gif';
import Rcrazy from '../../assets/reels/reel-crazy.gif';
import Rflame from '../../assets/reels/reel-flame.gif';
import Rhalo from '../../assets/reels/reel-halo.gif';
import Rheart from '../../assets/reels/reel-heart.gif';
import Rlightning from '../../assets/reels/reel-lightning.gif';
import Rpoison from '../../assets/reels/reel-poison.gif';
import Rshield from '../../assets/reels/reel-shield.gif';
import Rsnowflake from '../../assets/reels/reel-snowflake.gif';
import Rsword from '../../assets/reels/reel-sword.gif';
import { MinMaxTouple } from '../../utils';

export const REEL_HEIGHT = 120; // height of each reel cell
export const REEL_OVERLAP = 2; // # of looparound cells to add to edge of reel so that it can transition nicely
export const SPIN_POWER_RANGE: MinMaxTouple = [0.01, 0.03]; // RNG speed range for each reel
export const MIN_SPINS_RANGE: MinMaxTouple = [1, 2]; // RNG number of times to go around for each reel

export type ReelItem = {
  idx: number;
  label: string;
  img?: string;
  effect?: string;
  value?: number;
  attributes?: string[];
  score?: number;
};

export interface RawReelDef {
  spinRange?: MinMaxTouple;
  reelItems: Partial<ReelItem>[];
}
export interface ReelDef {
  spinRange?: MinMaxTouple;
  reelItems: ReelItem[];
}

export type MatchType = 'label' | 'attrAny' | 'attrUnique';

export interface ReelCombo {
  label: string;
  attributes: string[];
  bonuses: BonusGroup[];
}

export interface BonusGroup {
  bonusType: BonusType;
  multiplier?: number;
  value?: number;
}

// unique: all reels must be bar, all labels must vary
// same: all reels must be bar, all labels must match
// any: all reels must be bar
// put "any" last, otherwise it could match ahead of others
export type BonusType = 'any' | 'unique' | 'same';

export interface ReelComboResult {
  label: string;
  attribute: string;
  bonus: BonusGroup | null;
}

export const reelComboDef: ReelCombo[] = [
  // {
  //   label: 'default same combo',
  //   attributes: [ "*" ], // maybe * means this applies to any attribute?
  //   bonuses: [
  //      // all reels must share attribute, share label
  //      { bonusType: 'same', multiplier: 1.5 }
  //   ]
  // },
  {
    label: 'bar combo',
    attributes: ['bar'],
    bonuses: [
      { bonusType: 'unique', multiplier: 1.1 },
      { bonusType: 'same', multiplier: 1.3 },
      { bonusType: 'any', multiplier: 1 },
    ],
  },
  {
    label: 'buff combo',
    attributes: ['buff'],
    bonuses: [
      { bonusType: 'unique', multiplier: 2 },
      { bonusType: 'same', multiplier: 3 },
      { bonusType: 'any', multiplier: 1.5 },
    ],
  },
  {
    label: 'attack combo',
    attributes: ['attack'],
    bonuses: [
      { bonusType: 'unique', multiplier: 2 },
      { bonusType: 'same', multiplier: 3 },
      { bonusType: 'any', multiplier: 1.5 },
    ],
  },
];

export const reelsData: RawReelDef[] = [
  // {
  //   spinRange: [ 5, 8 ],
  //   reelItems: [
  //     { label: 'poison', effect: 'poison damage', value: 1.5, img: Rpoison },
  //   ],
  // },
  {
    reelItems: [
      // { label: 'seven', img: R7, effect: 'score', value: 7 },
      // { label: 'bar1', img: Rbar1, attributes: [ 'bar', '*' ] },
      // { label: 'bar2', img: Rbar2, attributes: [ 'bar', '*' ] },
      // { label: 'bar3', img: Rbar3, attributes: [ 'bar', '*' ] },
      // { label: 'bat', img: Rbat, attributes: [ 'attack', 'creature' ], effect: 'life steal', value: 1 },
      // { label: 'coins', img: Rcoins, attributes: [ 'money' ], effect: 'gold bonus', value: 5 },
      { label: 'crazy', img: Rcrazy, attributes: ['buff'], score: 0 },
      { label: 'flame', img: Rflame, attributes: ['attack'], effect: 'fire damage', value: 1.1, score: 250 },
      { label: 'halo', img: Rhalo, attributes: ['buff'], effect: 'extraLife', score: 1000 },
      { label: 'heart', img: Rheart, attributes: ['buff'], effect: 'health', value: 1, score: 50 },
      {
        label: 'lightning',
        img: Rlightning,
        attributes: ['attack'],
        effect: 'lightning damage',
        value: 1.4,
        score: 500,
      },
      { label: 'poison', img: Rpoison, attributes: ['attack'], effect: 'poison damage', value: 1.5, score: 200 },
      { label: 'shield', img: Rshield, attributes: ['buff'], effect: 'defense', value: 1, score: 100 },
      {
        label: 'snowflake',
        img: Rsnowflake,
        attributes: ['attack'],
        effect: 'freeze damage',
        value: 1.2,
        score: 120,
      },
      { label: 'sword', img: Rsword, attributes: ['attack'], effect: 'extra damage', value: 2, score: 80 },
    ],
  },
  {
    reelItems: [
      // { label: 'seven', img: R7, effect: 'score', value: 7 },
      // { label: 'bar1', img: Rbar1, attributes: [ 'bar', '*' ] },
      // { label: 'bar2', img: Rbar2, attributes: [ 'bar', '*' ] },
      // { label: 'bar3', img: Rbar3, attributes: [ 'bar', '*' ] },
      // { label: 'bat', img: Rbat, attributes: [ 'attack', 'creature' ], effect: 'life steal', value: 1 },
      // { label: 'coins', img: Rcoins, attributes: [ 'money' ], effect: 'gold bonus', value: 5 },
      { label: 'crazy', img: Rcrazy, attributes: ['buff'], score: 0 },
      { label: 'flame', img: Rflame, attributes: ['attack'], effect: 'fire damage', value: 1.1, score: 250 },
      { label: 'halo', img: Rhalo, attributes: ['buff'], effect: 'extraLife', score: 1000 },
      { label: 'heart', img: Rheart, attributes: ['buff'], effect: 'health', value: 1, score: 50 },
      {
        label: 'lightning',
        img: Rlightning,
        attributes: ['attack'],
        effect: 'lightning damage',
        value: 1.4,
        score: 500,
      },
      { label: 'poison', img: Rpoison, attributes: ['attack'], effect: 'poison damage', value: 1.5, score: 200 },
      { label: 'shield', img: Rshield, attributes: ['buff'], effect: 'defense', value: 1, score: 100 },
      {
        label: 'snowflake',
        img: Rsnowflake,
        attributes: ['attack'],
        effect: 'freeze damage',
        value: 1.2,
        score: 120,
      },
      { label: 'sword', img: Rsword, attributes: ['attack'], effect: 'extra damage', value: 2, score: 80 },
    ],
  },
  {
    reelItems: [
      // { label: 'seven', img: R7, effect: 'score', value: 7 },
      // { label: 'bar1', img: Rbar1, attributes: [ 'bar', '*' ] },
      // { label: 'bar2', img: Rbar2, attributes: [ 'bar', '*' ] },
      // { label: 'bar3', img: Rbar3, attributes: [ 'bar', '*' ] },
      // { label: 'bat', img: Rbat, attributes: [ 'attack', 'creature' ], effect: 'life steal', value: 1 },
      // { label: 'coins', img: Rcoins, attributes: [ 'money' ], effect: 'gold bonus', value: 5 },
      { label: 'crazy', img: Rcrazy, attributes: ['buff'], score: 0 },
      { label: 'flame', img: Rflame, attributes: ['attack'], effect: 'fire damage', value: 1.1, score: 250 },
      { label: 'halo', img: Rhalo, attributes: ['buff'], effect: 'extraLife', score: 1000 },
      { label: 'heart', img: Rheart, attributes: ['buff'], effect: 'health', value: 1, score: 50 },
      {
        label: 'lightning',
        img: Rlightning,
        attributes: ['attack'],
        effect: 'lightning damage',
        value: 1.4,
        score: 500,
      },
      { label: 'poison', img: Rpoison, attributes: ['attack'], effect: 'poison damage', value: 1.5, score: 200 },
      { label: 'shield', img: Rshield, attributes: ['buff'], effect: 'defense', value: 1, score: 100 },
      {
        label: 'snowflake',
        img: Rsnowflake,
        attributes: ['attack'],
        effect: 'freeze damage',
        value: 1.2,
        score: 120,
      },
      { label: 'sword', img: Rsword, attributes: ['attack'], effect: 'extra damage', value: 2, score: 80 },
    ],
  },
];
