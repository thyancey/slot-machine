import styled from 'styled-components';
import { ReelItem } from './reel';

import ImgRaccoon from '../../assets/reels/reel-01.gif';
import ImgBar3 from '../../assets/reels/reel-02.gif';
import ImgBar2 from '../../assets/reels/reel-03.gif';
import ImgBar1 from '../../assets/reels/reel-04.gif';
import Img7 from '../../assets/reels/reel-05.gif';
import ImgSmile from '../../assets/reels/reel-06.gif';

interface ImgMap {
  [ key: string ] : string;
}
const ImgLookup = {
  raccoon: ImgRaccoon,
  bar1: ImgBar1,
  bar2: ImgBar2,
  bar3: ImgBar3,
  seven: Img7,
  smile: ImgSmile,
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
