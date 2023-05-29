import styled from 'styled-components';
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

interface ImgMap {
  [ key: string ] : string;
}
const ImgLookup = {
  seven: R7,
  bar1: Rbar1,
  bar2: Rbar2,
  bar3: Rbar3,
  bat: Rbat,
  coins: Rcoins,
  crazy: Rcrazy,
  flame: Rflame,
  halo: Rhalo,
  heart: Rheart,
  lightning: Rlightning,
  poison: Rpoison,
  shield: Rshield,
  snowflake: Rsnowflake,
  sword: Rsword,
} as ImgMap;

interface ScProps {
  height: number
}
const ScWrapper = styled.div<ScProps>`
  width: 100%;
  height: ${p => p.height}px;
  background-color: var(--color-white);
  color: var(--color-black);
  text-align: center;
  border-bottom: 0.25rem solid var(--color-blue);

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;

  padding: .25rem;

  img {
    width:100%;
    filter: drop-shadow(.2rem .2rem .1rem var(--color-black));
  }
`;


type Props = {
  reelItem: ReelItem,
  height: number
};

function ReelContent({reelItem, height}: Props) {
  return (
    <ScWrapper height={height}><img src={ImgLookup[reelItem.img] || ImgLookup['bar1']}/></ScWrapper>
  );
}

export default ReelContent;
