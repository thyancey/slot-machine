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

export type ReelItem = {
  idx: number;
  label: string;
  img?: string;
  effect?: string;
  value?: number;
  attributes?: string[];
};

export interface RawReelDef {
  spinRange?: MinMaxTouple;
  reelItems: Partial<ReelItem>[];
}
export interface ReelDef {
  spinRange?: MinMaxTouple;
  reelItems: ReelItem[];
}

export type MatchType = 'label' | 'attrAny' | 'attrUnique'
export type BonusType = 'unique' | 'same';

export interface ReelCombo {
  label: string,
  attributes: string[],
  bonuses: {
    any?: number,
    same?: number,
    unique?: number
  }
}

export const reelComboDef: ReelCombo[] = [  
  // {
  //   label: 'default same combo',
  //   attributes: [ "*" ], // maybe * means this applies to any attribute?
  //   bonuses: {
  //     // all reels must share attribute, share label
  //     same: 1.5
  //   }
  // },
  {
    label: 'bar combo',
    attributes: [ 'bar' ],
    bonuses: {
      // all reels must be bar
      any: 1.5,
      // all reels must be bar, all labels must match
      same: 3,
      // all reels must be bar, all labels must vary
      unique: 2
    }
  },
  {
    label: 'buff combo',
    attributes: [ 'buff' ],
    bonuses: {
      any: 1.5,
      same: 3,
      unique: 2
    }
  },
  {
    label: 'attack combo',
    attributes: [ 'attack' ],
    bonuses: {
      any: 1.5,
      same: 3,
      unique: 2
    }
  }
]

export const reelsData: RawReelDef[] = [
  // {
  //   spinRange: [ 5, 8 ],
  //   reelItems: [
  //     { label: 'poison', effect: 'poison damage', value: 1.5, img: Rpoison },
  //   ],
  // },
  {
    reelItems: [
      { label: 'seven', img: R7, effect: 'score', value: 7 },
      { label: 'bar1', img: Rbar1, attributes: [ 'bar', '*' ] },
      { label: 'bar2', img: Rbar2, attributes: [ 'bar', '*' ] },
      { label: 'bar3', img: Rbar3, attributes: [ 'bar', '*' ] },
      { label: 'bat', img: Rbat, attributes: [ 'attack', 'creature' ], effect: 'life steal', value: 1 },
      { label: 'coins', img: Rcoins, attributes: [ 'money' ], effect: 'gold bonus', value: 5 },
      { label: 'crazy', img: Rcrazy, attributes: [ 'buff' ] },
      { label: 'flame', img: Rflame, attributes: [ 'attack' ], effect: 'fire damage', value: 1.1 },
      { label: 'halo', img: Rhalo, attributes: [ 'buff' ], effect: 'extraLife' },
      { label: 'heart', img: Rheart, attributes: [ 'buff' ], effect: 'health', value: 1 },
      {
        label: 'lightning',
        img: Rlightning,
        attributes: [ 'attack' ],
        effect: 'lightning damage',
        value: 1.4,
      },
      { label: 'poison', img: Rpoison, attributes: [ 'attack' ], effect: 'poison damage', value: 1.5 },
      { label: 'shield', img: Rshield, attributes: [ 'buff' ], effect: 'defense', value: 1 },
      {
        label: 'snowflake',
        img: Rsnowflake,
        attributes: [ 'attack' ],
        effect: 'freeze damage',
        value: 1.2,
      },
      { label: 'sword', img: Rsword, attributes: [ 'attack' ], effect: 'extra damage', value: 2 },
    ],
  },
  {
    reelItems: [
      { label: 'seven', img: R7, effect: 'score', value: 7 },
      { label: 'bar1', img: Rbar1, attributes: [ 'bar', '*' ] },
      { label: 'bar2', img: Rbar2, attributes: [ 'bar', '*' ] },
      { label: 'bar3', img: Rbar3, attributes: [ 'bar', '*' ] },
      { label: 'bat', img: Rbat, attributes: [ 'attack', 'creature' ], effect: 'life steal', value: 1 },
      { label: 'coins', img: Rcoins, attributes: [ 'money' ], effect: 'gold bonus', value: 5 },
      { label: 'crazy', img: Rcrazy, attributes: [ 'buff' ] },
      { label: 'flame', img: Rflame, attributes: [ 'attack' ], effect: 'fire damage', value: 1.1 },
      { label: 'halo', img: Rhalo, attributes: [ 'buff' ], effect: 'extraLife' },
      { label: 'heart', img: Rheart, attributes: [ 'buff' ], effect: 'health', value: 1 },
      {
        label: 'lightning',
        img: Rlightning,
        attributes: [ 'attack' ],
        effect: 'lightning damage',
        value: 1.4,
      },
      { label: 'poison', img: Rpoison, attributes: [ 'attack' ], effect: 'poison damage', value: 1.5 },
      { label: 'shield', img: Rshield, attributes: [ 'buff' ], effect: 'defense', value: 1 },
      {
        label: 'snowflake',
        img: Rsnowflake,
        attributes: [ 'attack' ],
        effect: 'freeze damage',
        value: 1.2,
      },
      { label: 'sword', img: Rsword, attributes: [ 'attack' ], effect: 'extra damage', value: 2 },
    ],
  },
  {
    reelItems: [
      { label: 'seven', img: R7, effect: 'score', value: 7 },
      { label: 'bar1', img: Rbar1, attributes: [ 'bar', '*' ] },
      { label: 'bar2', img: Rbar2, attributes: [ 'bar', '*' ] },
      { label: 'bar3', img: Rbar3, attributes: [ 'bar', '*' ] },
      { label: 'bat', img: Rbat, attributes: [ 'attack', 'creature' ], effect: 'life steal', value: 1 },
      { label: 'coins', img: Rcoins, attributes: [ 'money' ], effect: 'gold bonus', value: 5 },
      { label: 'crazy', img: Rcrazy, attributes: [ 'buff' ] },
      { label: 'flame', img: Rflame, attributes: [ 'attack' ], effect: 'fire damage', value: 1.1 },
      { label: 'halo', img: Rhalo, attributes: [ 'buff' ], effect: 'extraLife' },
      { label: 'heart', img: Rheart, attributes: [ 'buff' ], effect: 'health', value: 1 },
      {
        label: 'lightning',
        img: Rlightning,
        attributes: [ 'attack' ],
        effect: 'lightning damage',
        value: 1.4,
      },
      { label: 'poison', img: Rpoison, attributes: [ 'attack' ], effect: 'poison damage', value: 1.5 },
      { label: 'shield', img: Rshield, attributes: [ 'buff' ], effect: 'defense', value: 1 },
      {
        label: 'snowflake',
        img: Rsnowflake,
        attributes: [ 'attack' ],
        effect: 'freeze damage',
        value: 1.2,
      },
      { label: 'sword', img: Rsword, attributes: [ 'attack' ], effect: 'extra damage', value: 2 },
    ],
  },
];
