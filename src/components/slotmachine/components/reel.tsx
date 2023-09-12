import { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import ReelContent from './reel-content';
import { DeckIdxCollection, REEL_HEIGHT, REEL_OVERLAP, TileKeyCollection } from '../../../store/data';
import { getReelTileStateFromReelState } from '../../../store/utils';
import { getLoopedReel, getProgressiveSpinAngle, getSpinTarget } from '../utils';
import { MinMaxTouple, clamp, randInRange } from '../../../utils';

// imagine the construction as a ribbon, rendering each tile top to bottom
// to complete the looping effect, REEL_OVERLAP n of tiles are repeated at the top and bottom
// REEL_OVERLAP should be just enough to give the illusion of a wheel within the view area

const Vars = {
  SPIN_TICK: 30,
  SPIN_DURATION_RANGE: [0.005, 0.02] as MinMaxTouple,
  SLOT_DISTANCE_RANGE: [20, 40] as MinMaxTouple,
};

const debug = window.location.search.indexOf('debug') > -1;
if (debug) {
  Vars.SPIN_TICK = 10;
  Vars.SPIN_DURATION_RANGE = [0.05, 0.1];
}

// kinda like the cutout you can see the reel through
export const ScReelWrapper = styled.div`
  width: var(--val-reel-width);
  height: calc(var(--val-reel-height) + var(--val-reel-peek));
  position: relative;

  /* makes a cutout */
  /* clip-path: inset(0 0 round 10px); */
  clip-path: inset(0 0);

  &.enabled {
    cursor: pointer;
    transition: filter 0.5s ease;
    &:hover {
      filter: brightness(1.5);
    }
  }
`;

const ScReelEditorHover = styled.a`
  .editor-reel & {
    position: absolute;
    inset: 0;
    /* TODO, conflicting with stat labels, which need to hover for tooltips */
    z-index: 2;

    text-align: center;
    font-size: 1.5rem;
    padding-top: 2rem;
    cursor: pointer;

    span {
      position: absolute;
      bottom: 2.5rem;
      left: 0;
      width: 100%;
      z-index: 1;
      border-left: 0;
      border-right: 0;
      display: block;
      border: 0.25rem dashed var(--co-editor-primary);
      color: var(--co-editor-primary);
      background-color: var(--color-white);

      transition: background-color 0.3s, color 0.3s;
    }

    > div {
      opacity: 0;
      position: absolute;
      z-index: -1;
      inset: 0;
      transition: opacity 0.3s;
    }

    &:hover {
      span {
        background-color: var(--co-editor-primary);
        color: var(--color-white);
      }

      > div {
        opacity: 0;
      }
    }
  }
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

interface ScReelBgProps {
  $bg?: string;
}
export const ScReelBg = styled.div<ScReelBgProps>`
  position: absolute;
  inset: 0;
  ${(props) =>
    props.$bg &&
    css`
      background: url(${props.$bg});
    `};
  background-color: var(--co-reel-bg);
  background-size: contain;
  z-index: -1;

  .editor-reel & {
    background-color: var(--co-reel-bg);
  }
`;

type Props = {
  reelIdx: number;
  reelState: DeckIdxCollection;
  tileDeck: TileKeyCollection;
  targetSlotIdx: number; // idx of tiles to go to, regardless of how much spinning to be done
  spinCount: number; // this helps determine when a spin started
  reelLock: boolean;
  isEnabled: boolean; // can click to spin this weel
  onSpinComplete: (reelIdx: number, slotIdx: number) => void;
  onClick: () => void;
};
function Reel({
  reelIdx,
  reelState,
  tileDeck,
  targetSlotIdx,
  reelLock,
  spinCount,
  onSpinComplete,
  onClick,
  isEnabled
}: Props) {
  // (looped) idx of current item, number grows to infinity
  // ex, if reel is 2 items long, two spins to the first index would be a value of 4
  // [ 0, 1 ] > [ 2, 3 ] > [ 4, 5 ]
  const [loopedIdxs, setLoopedIdxs] = useState<MinMaxTouple>([-1, 0]); // current, next
  const [spinProgress, setSpinProgress] = useState(0);
  const [spinSpeed, setSpinSpeed] = useState(0.1);
  const reelBg = ''; // eventually, stored in reel data
  // const reelBg = AssetMap.Reel_BG;

  // on initialize
  useEffect(() => {
    setLoopedIdxs([-1, 0]);
  }, [reelState, reelIdx]);

  /* THIS SHOULD BE THE CATALYST TO START SPINNING */
  useEffect(() => {
    // -1 happens on mount
    if (!reelLock && targetSlotIdx !== -1) {
      // allows the reel to spin again
      setSpinProgress(0);
      setSpinSpeed(randInRange(Vars.SPIN_DURATION_RANGE));
      // the targetLoopedIdx (index [1]) will now be come the previous, so assign it as such, and
      // use it to calculate the next targetLoopedIdx all at once
      setLoopedIdxs((prev) => [
        prev[1],
        getSpinTarget(prev[1], targetSlotIdx, reelState.length, randInRange(Vars.SLOT_DISTANCE_RANGE, true)),
      ]);
    }
  }, [targetSlotIdx, reelIdx, spinCount, reelState, setLoopedIdxs, setSpinProgress, setSpinSpeed, reelLock]);

  useEffect(() => {
    if (spinProgress >= 1) {
      // have to calculate the end result value here, over using "targetSlotIdx", because adding that
      // prop to this useEffect dependency array makes the reel think it finished spinning on a brand
      // new pull, cause spinProgress had not changed to 0 yet

      // this check avoids a false spin trigger after editing reel
      if (loopedIdxs[0] > -1) {
        onSpinComplete(reelIdx, loopedIdxs[1] % reelState.length);
      }
    } else {
      setTimeout(() => {
        // use an easing function to smoothly increment the % progress up to the value of 1
        setSpinProgress((prevProgress) => clamp(prevProgress + spinSpeed, 0, 1));
      }, Vars.SPIN_TICK);
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

  const onHover = () => {
    if (isEnabled) {
      // console.log(`spin reel #${reelIdx + 1}`);
    }
  };

  return (
    <ScReelWrapper
      // onClick={() => isEnabled && triggerSpin(reelIdx)}
      onClick={() => onClick()}
      className={isEnabled ? 'enabled' : ''}
      onMouseEnter={onHover}
    >
      {/* <ScReelEditorHover onClick={() => insertIntoReel(reelIdx, -1)}> */}
      <ScReelEditorHover>
        <span>{'ADD ITEM'}</span>
        <div />
      </ScReelEditorHover>
      <ScReelOverlay />
      <ScReelCenterer>
        <ScReelTape id={`reel-${reelIdx}`} style={{ top: `${reelTop}px` }}>
          {reelTileStates.map((tile, idx) => (
            <ReelContent
              key={`s${reelIdx}-${idx}`}
              tile={tile}
              height={REEL_HEIGHT}
              isActive={isEnabled && idx - REEL_OVERLAP === targetSlotIdx}
            />
          ))}
          <ScReelBg $bg={reelBg} />
        </ScReelTape>
      </ScReelCenterer>
    </ScReelWrapper>
  );
}

export default Reel;
