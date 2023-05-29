import { ReelItem } from './reel';

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

export type ReelItem = {
  label: string;
  img: string;
};

export const reels: ReelItem[][] = [
  [
    { label: 'seven', img: R7 },
    { label: 'bar1', img: Rbar1 },
    { label: 'bar2', img: Rbar2 },
    { label: 'bar3', img: Rbar3 },
    { label: 'bat', img: Rbat },
    { label: 'coins', img: Rcoins },
    { label: 'crazy', img: Rcrazy },
    { label: 'flame', img: Rflame },
    { label: 'halo', img: Rhalo },
    { label: 'heart', img: Rheart },
    { label: 'lightning', img: Rlightning },
    { label: 'poison', img: Rpoison },
    { label: 'shield', img: Rshield },
    { label: 'snowflake', img: Rsnowflake },
    { label: 'sword', img: Rsword }
  ],
  [
    { label: 'seven', img: R7 },
    { label: 'bar1', img: Rbar1 },
    { label: 'bar2', img: Rbar2 },
    { label: 'bar3', img: Rbar3 },
    { label: 'bat', img: Rbat },
    { label: 'coins', img: Rcoins },
    { label: 'crazy', img: Rcrazy },
    { label: 'flame', img: Rflame },
    { label: 'halo', img: Rhalo },
    { label: 'heart', img: Rheart },
    { label: 'lightning', img: Rlightning },
    { label: 'poison', img: Rpoison },
    { label: 'shield', img: Rshield },
    { label: 'snowflake', img: Rsnowflake },
    { label: 'sword', img: Rsword }
  ],
  [
    { label: 'seven', img: R7 },
    { label: 'bar1', img: Rbar1 },
    { label: 'bar2', img: Rbar2 },
    { label: 'bar3', img: Rbar3 },
    { label: 'bat', img: Rbat },
    { label: 'coins', img: Rcoins },
    { label: 'crazy', img: Rcrazy },
    { label: 'flame', img: Rflame },
    { label: 'halo', img: Rhalo },
    { label: 'heart', img: Rheart },
    { label: 'lightning', img: Rlightning },
    { label: 'poison', img: Rpoison },
    { label: 'shield', img: Rshield },
    { label: 'snowflake', img: Rsnowflake },
    { label: 'sword', img: Rsword }
  ],
];