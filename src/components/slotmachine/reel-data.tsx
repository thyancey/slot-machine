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
  effect?: string,
  value?: number;
};

export const reels: ReelItem[][] = [
  [
    { label: 'seven', effect: "score", value: 7, img: R7 },
    { label: 'bar1', img: Rbar1 },
    { label: 'bar2', img: Rbar2 },
    { label: 'bar3', img: Rbar3 },
    { label: 'bat', effect: "life steal", value: 1, img: Rbat },
    { label: 'coins', effect: "gold bonus", value: 5, img: Rcoins },
    { label: 'crazy', img: Rcrazy },
    { label: 'flame', effect: "fire damage", value: 1.1, img: Rflame },
    { label: 'halo', effect: "extraLife", img: Rhalo },
    { label: 'heart', effect: "health", value: 1, img: Rheart },
    { label: 'lightning', effect: "lightning damage", value: 1.4, img: Rlightning },
    { label: 'poison', effect: "poison damage", value: 1.5, img: Rpoison },
    { label: 'shield', effect: "defense", value: 1, img: Rshield },
    { label: 'snowflake', effect: "freeze damage", value: 1.2, img: Rsnowflake },
    { label: 'sword', effect: "extra damage", value: 2, img: Rsword }
  ],
  [
    { label: 'seven', effect: "score", value: 7, img: R7 },
    { label: 'bar1', img: Rbar1 },
    { label: 'bar2', img: Rbar2 },
    { label: 'bar3', img: Rbar3 },
    { label: 'bat', effect: "life steal", value: 1, img: Rbat },
    { label: 'coins', effect: "gold bonus", value: 5, img: Rcoins },
    { label: 'crazy', img: Rcrazy },
    { label: 'flame', effect: "fire damage", value: 1.1, img: Rflame },
    { label: 'halo', effect: "extraLife", img: Rhalo },
    { label: 'heart', effect: "health", value: 1, img: Rheart },
    { label: 'lightning', effect: "lightning damage", value: 1.4, img: Rlightning },
    { label: 'poison', effect: "poison damage", value: 1.5, img: Rpoison },
    { label: 'shield', effect: "defense", value: 1, img: Rshield },
    { label: 'snowflake', effect: "freeze damage", value: 1.2, img: Rsnowflake },
    { label: 'sword', effect: "extra damage", value: 2, img: Rsword }
  ],
  [
    { label: 'seven', effect: "score", value: 7, img: R7 },
    { label: 'bar1', img: Rbar1 },
    { label: 'bar2', img: Rbar2 },
    { label: 'bar3', img: Rbar3 },
    { label: 'bat', effect: "life steal", value: 1, img: Rbat },
    { label: 'coins', effect: "gold bonus", value: 5, img: Rcoins },
    { label: 'crazy', img: Rcrazy },
    { label: 'flame', effect: "fire damage", value: 1.1, img: Rflame },
    { label: 'halo', effect: "extraLife", img: Rhalo },
    { label: 'heart', effect: "health", value: 1, img: Rheart },
    { label: 'lightning', effect: "lightning damage", value: 1.4, img: Rlightning },
    { label: 'poison', effect: "poison damage", value: 1.5, img: Rpoison },
    { label: 'shield', effect: "defense", value: 1, img: Rshield },
    { label: 'snowflake', effect: "freeze damage", value: 1.2, img: Rsnowflake },
    { label: 'sword', effect: "extra damage", value: 2, img: Rsword }
  ],
];