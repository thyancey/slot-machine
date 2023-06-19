import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import ReelContent from './reel-content';
import { DeckIdxCollection, REEL_HEIGHT, REEL_OVERLAP, TileKeyCollection } from '../../../store/data';
import { getReelTileStateFromReelState } from '../../../store/utils';
import { getLoopedReelState, getSpinTarget } from '../utils';

// imagine the construction as a ribbon, rendering each tile top to bottom
// to complete the looping effect, REEL_OVERLAP n of tiles are repeated at the top and bottom
// REEL_OVERLAP should be just enough to give the illusion of a wheel within the view area

const SPIN_TICK = 30;

// kinda like the cutout you can see the reel through
const ScWrapper = styled.div`
  border: 0.5rem solid var(--color-white);
  width: 8rem;
  height: 12rem;
  position: relative;

  /* makes a cutout */
  /* clip-path: inset(0 0 round 10px); */
`;

const ScReelOverlay = styled.div`
  position: absolute;
  inset: -0.6rem;
  --color-grey-transparent: rgba(241, 91, 181, 0);
  background: var(--color-grey);
  background: linear-gradient(
    0deg,
    var(--color-grey) 0%,
    var(--color-grey-transparent) 20%,
    var(--color-grey-transparent) 80%,
    var(--color-grey) 100%
  );
`;

const ScReelCenterer = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  left: 0;
  margin-top: ${`-${REEL_HEIGHT / 2}`}px;
`;

const ScReelTape = styled.div`
  position: absolute;
  width: 100%;
  /* top is changed to spin the wheel */
  top: 0;
`;

const calcTop = (spinAngle: number, numTiles: number) => {
  const reelTop = (-1 * spinAngle) % (REEL_HEIGHT * numTiles);
  // console.log('reelTop', reelTop)
  return reelTop - REEL_OVERLAP * REEL_HEIGHT;
};

const MIN_SLOT_DISTANCE = 3;

type Props = {
  reelIdx: number;
  reelState: DeckIdxCollection;
  tileDeck: TileKeyCollection;
  targetSlotIdx: number; // idx of tiles to go to, regardless of how much spinning to be done
  spinCount: number; // this helps determine when a spin started
};
function NewReel({ reelIdx, reelState, tileDeck, targetSlotIdx, spinCount }: Props) {
  // (looped) idx of current item, number grows to infinity
  // ex, if reel is 2 items long, two spins to the first index would be a value of 4
  // [ 0, 1 ] > [ 2, 3 ] > [ 4, 5 ]
  const [curLoopedIdx, setCurLoopedIdx] = useState(0);
  const [targetLoopedIdx, setTargetLoopedIdx] = useState(0);

  // on initialize
  useEffect(() => {
    console.log(`Reel [${reelIdx}] initialized with reelState: `, reelState);
    setCurLoopedIdx(0);
  }, [reelState, reelIdx]);

  useEffect(() => {
    console.log(`Reel [${reelIdx}] spin happened, new targetSlotIdx: `, targetSlotIdx);
    setTargetLoopedIdx(getSpinTarget(curLoopedIdx, targetSlotIdx, reelState.length, MIN_SLOT_DISTANCE))
  }, [targetSlotIdx, reelIdx, spinCount, curLoopedIdx, reelState]);

  useEffect(() => {
    console.log(`Reel [${reelIdx}] targetLoopedIdx: `, targetLoopedIdx);
  }, [targetLoopedIdx, reelIdx]);

  const reelTileStates = useMemo(() => {
    const loopedReelState = getLoopedReelState(reelState, REEL_OVERLAP);
    return getReelTileStateFromReelState(loopedReelState, tileDeck);
  }, [reelState, tileDeck]);

  return (
    <ScWrapper>
      <ScReelCenterer>
        <ScReelTape id={`reel-${reelIdx}`}>
          {reelTileStates.map((tile, idx) => (
            <ReelContent key={`${reelIdx}-${idx}`} tile={tile} height={REEL_HEIGHT} />
          ))}
        </ScReelTape>
      </ScReelCenterer>
      {/* <ScReelOverlay /> */}
    </ScWrapper>
  );
}

export default NewReel;
