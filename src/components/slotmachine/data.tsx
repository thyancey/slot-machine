import R7 from '../../assets/reels/reel-7.gif';
import Rbar1 from '../../assets/reels/reel-bar1.gif';
import Rbar2 from '../../assets/reels/reel-bar2.gif';
import Rbar3 from '../../assets/reels/reel-bar3.gif';
import Rbat from '../../assets/reels/reel-bat.gif';
import Rcoins from '../../assets/reels/reel-coins.gif';
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

export type RawReelItem = {
  label: string;
  img?: string;
  effect?: string;
  value?: number;
  attributes?: string[];
  score?: number;
};
export interface ReelItem extends RawReelItem {
  idx: number;
};

export interface RawReelDef {
  spinRange?: MinMaxTouple;
  reelItems: RawReelItem[];
}
export interface ReelDef {
  spinRange?: MinMaxTouple;
  reelItems: ReelItem[];
}

export interface ReelItemDict {
  [key: string]: RawReelItem;
}

export const reelItemDef: ReelItemDict = {
  bat: { label: 'bat', img: Rbat, attributes: ['attack', 'creature'], effect: 'life steal', value: 1, score: 250 },
  coins: { label: 'coins', img: Rcoins, attributes: ['money'], effect: 'gold bonus', value: 5, score: 1000 },
  crazy: { label: 'crazy', img: Rcrazy, attributes: ['buff'], score: 0 },
  flame: { label: 'flame', img: Rflame, attributes: ['attack'], effect: 'fire damage', value: 1.1, score: 250 },
  halo: { label: 'halo', img: Rhalo, attributes: ['buff'], effect: 'extraLife', score: 1000 },
  heart: { label: 'heart', img: Rheart, attributes: ['buff'], effect: 'health', value: 1, score: 50 },
  lightning: {
    label: 'lightning',
    img: Rlightning,
    attributes: ['attack'],
    effect: 'lightning damage',
    value: 1.4,
    score: 500,
  },
  poison: { label: 'poison', img: Rpoison, attributes: ['attack'], effect: 'poison damage', value: 1.5, score: 200 },
  shield: { label: 'shield', img: Rshield, attributes: ['buff'], effect: 'defense', value: 1, score: 100 },
  slot_seven: { label: 'seven', img: R7, effect: 'score', value: 7, score: 700 },
  slot_bar1: { label: 'bar1', img: Rbar1, attributes: ['bar', '*'], score: 100 },
  slot_bar2: { label: 'bar2', img: Rbar2, attributes: ['bar', '*'], score: 200 },
  slot_bar3: { label: 'bar3', img: Rbar3, attributes: ['bar', '*'], score: 300 },
  snowflake: {
    label: 'snowflake',
    img: Rsnowflake,
    attributes: ['attack'],
    effect: 'freeze damage',
    value: 1.2,
    score: 120,
  },
  sword: { label: 'sword', img: Rsword, attributes: ['attack'], effect: 'extra damage', value: 2, score: 80 },
};

export const reelsData: RawReelDef[] = [
  {
    // spinRange: [ 5, 8 ],
    reelItems: [
      // reelItemDef.coins
      reelItemDef.crazy,
      reelItemDef.flame,
      reelItemDef.halo,
      reelItemDef.lightning,
      reelItemDef.poison,
      reelItemDef.shield,
      reelItemDef.snowflake,
      reelItemDef.sword,
    ],
  },
  {
    reelItems: [
      // reelItemDef.coins
      reelItemDef.crazy,
      reelItemDef.flame,
      reelItemDef.halo,
      reelItemDef.lightning,
      reelItemDef.poison,
      reelItemDef.shield,
      reelItemDef.snowflake,
      reelItemDef.sword,
    ],
  },
  {
    reelItems: [
      // reelItemDef.coins
      reelItemDef.crazy,
      reelItemDef.flame,
      reelItemDef.halo,
      reelItemDef.lightning,
      reelItemDef.poison,
      reelItemDef.shield,
      reelItemDef.snowflake,
      reelItemDef.sword,
    ],
  },
];

/* combo/bonus stuff */
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
  {
    label: '$$$ combo',
    attributes: ['money'],
    bonuses: [
      { bonusType: 'unique', multiplier: 2 },
      { bonusType: 'same', multiplier: 3 },
      { bonusType: 'any', multiplier: 1.5 },
    ],
  },
];