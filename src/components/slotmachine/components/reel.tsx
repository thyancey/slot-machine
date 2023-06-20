import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import ReelContent from './reel-content';
import { DeckIdxCollection, REEL_HEIGHT, REEL_OVERLAP, TileKeyCollection } from '../../../store/data';
import { getReelTileStateFromReelState } from '../../../store/utils';
import { getLoopedReel, getProgressiveSpinAngle, getSpinTarget } from '../utils';
import { MinMaxTouple, clamp, randInRange } from '../../../utils';

// imagine the construction as a ribbon, rendering each tile top to bottom
// to complete the looping effect, REEL_OVERLAP n of tiles are repeated at the top and bottom
// REEL_OVERLAP should be just enough to give the illusion of a wheel within the view area

const SPIN_TICK = 30;
const SPIN_DURATION_RANGE = [0.01, 0.02] as MinMaxTouple;
const SLOT_DISTANCE_RANGE = [20, 40] as MinMaxTouple;

// kinda like the cutout you can see the reel through
const ScWrapper = styled.div`
  border: 0.5rem solid var(--color-white);
  width: 8rem;
  height: 12rem;
  position: relative;

  /* makes a cutout */
  clip-path: inset(0 0 round 10px);
`;

// shadow at top/bottom of reel to give depth effect
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

type Props = {
  reelIdx: number;
  reelState: DeckIdxCollection;
  tileDeck: TileKeyCollection;
  targetSlotIdx: number; // idx of tiles to go to, regardless of how much spinning to be done
  spinCount: number; // this helps determine when a spin started
  onSpinComplete: (reelIdx: number, slotIdx: number) => void;
};
function Reel({ reelIdx, reelState, tileDeck, targetSlotIdx, spinCount, onSpinComplete }: Props) {
  // (looped) idx of current item, number grows to infinity
  // ex, if reel is 2 items long, two spins to the first index would be a value of 4
  // [ 0, 1 ] > [ 2, 3 ] > [ 4, 5 ]
  const [loopedIdxs, setLoopedIdxs] = useState<MinMaxTouple>([0, 0]); // current, next
  const [spinProgress, setSpinProgress] = useState(1);
  const [spinSpeed, setSpinSpeed] = useState(0.1);

  // on initialize
  useEffect(() => {
    setLoopedIdxs([0, 0]);
  }, [reelState, reelIdx]);

  /* THIS SHOULD BE THE CATALYST TO START SPINNING */
  useEffect(() => {
    // console.log(`Reel [${reelIdx}] spin happened, new targetSlotIdx: `, targetSlotIdx);
    // -1 happens on mount
    if (targetSlotIdx !== -1) {
      // allows the reel to spin again
      setSpinProgress(0);
      setSpinSpeed(randInRange(SPIN_DURATION_RANGE));
      // the targetLoopedIdx (index [1]) will now be come the previous, so assign it as such, and
      // use it to calculate the next targetLoopedIdx all at once
      setLoopedIdxs((prev) => [
        prev[1],
        getSpinTarget(prev[1], targetSlotIdx, reelState.length, randInRange(SLOT_DISTANCE_RANGE, true)),
      ]);
    }
  }, [targetSlotIdx, reelIdx, spinCount, reelState, setLoopedIdxs, setSpinProgress, setSpinSpeed]);

  useEffect(() => {
    if (spinProgress >= 1) {
      // have to calculate the end result value here, over using "targetSlotIdx", because adding that
      // prop to this useEffect dependency array makes the reel think it finished spinning on a brand
      // new pull, cause spinProgress had not changed to 0 yet
      onSpinComplete(reelIdx, loopedIdxs[1] % reelState.length);
    } else {
      setTimeout(() => {
        // use an easing function to smoothly increment the % progress up to the value of 1
        setSpinProgress((prevProgress) => clamp(prevProgress + spinSpeed, 0, 1));
      }, SPIN_TICK);
    }
  }, [spinProgress, setSpinProgress, onSpinComplete, reelIdx, loopedIdxs, reelState.length, spinSpeed]);

  const reelTop = useMemo(() => {
    const curAngle = getProgressiveSpinAngle(spinProgress, loopedIdxs[1], loopedIdxs[0], REEL_HEIGHT);
    // reel moves UP (negative top value)
    const val = (-1 * curAngle) % (REEL_HEIGHT * reelState.length);

    // reel gets additonal offset from the repeated top items
    return val - REEL_OVERLAP * REEL_HEIGHT;
  }, [spinProgress, loopedIdxs, reelState.length]);

  const reelTileStates = useMemo(() => {
    const loopedReelState = getLoopedReel(reelState, REEL_OVERLAP);
    return getReelTileStateFromReelState(loopedReelState, tileDeck);
  }, [reelState, tileDeck]);

  return (
    <ScWrapper>
      <ScReelCenterer>
        <ScReelTape id={`reel-${reelIdx}`} style={{ top: `${reelTop}px` }}>
          {reelTileStates.map((tile, idx) => (
            <ReelContent key={`${reelIdx}-${idx}`} tile={tile} height={REEL_HEIGHT} />
          ))}
        </ScReelTape>
      </ScReelCenterer>
      <ScReelOverlay />
    </ScWrapper>
  );
}

export default Reel;
