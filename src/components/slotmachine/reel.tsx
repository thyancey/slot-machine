import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import ReelContent from './reel-content';
import { ReelItem } from './reel-data';
import { MinMaxTouple, randInRange } from '../../utils';
import { ReelTarget } from '.';

// imagine the construction as a ribbon, rendering each reelItem top to bottom
// to complete the looping effect, REEL_OVERLAP n of items are repeated at the top and bottom
// REEL_OVERLAP should be just enough to give the illusion of a wheel within the view area

const REEL_HEIGHT = 120; // height of each reel cell
const REEL_OVERLAP = 2; // # of looparound cells to add to edge of reel so that it can transition nicely
const SPIN_POWER_RANGE: MinMaxTouple = [15, 35]; // RNG speed range for each reel
const MIN_SPINS_RANGE: MinMaxTouple = [1, 3]; // RNG number of times to go around for each reel

// kinda like the cutout you can see the reel through
const ScWrapper = styled.div`
  border: 0.5rem solid var(--color-white);
  width: 8rem;
  height: 12rem;
  position: relative;

  /* makes a cutout */
  clip-path: inset(0 0 round 10px);

  &.spinning{

  }
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

// add redudant items to top and bottom of reel to make it seem continuous
export const buildReel = (reelItems: any[], reelOverlap: number) => {
  // starting with [ 0, 1, 2 ]

  // [ +1, +2, 0, 1, 2 ]
  const loopBefore = [];
  // the +1 here attached the last to the top, regardless of overlap value
  for (let i = 0; i < reelOverlap; i++) {
    const offset = reelItems.length - (i % reelItems.length) - 1;
    loopBefore.push(reelItems[offset]);
  }

  // [ 0, 1, 2 ] -> [ 0, 1, 2, +0, +1 ]
  const loopAfter = [];
  for (let i = 0; i < reelOverlap; i++) {
    loopAfter.push(reelItems[i % reelItems.length]);
  }

  return ([] as any[])
    .concat(loopBefore.reverse())
    .concat(reelItems.map((rI) => rI))
    .concat(loopAfter);
};

const projectSpinTarget = (
  numItems: number,
  nextIdx: number,
  startIdx: number = 0
) => {
  return numItems * randInRange(MIN_SPINS_RANGE, true) + (nextIdx - startIdx);
};

const projectSpinAngle = (numItems: number, targetIdx: number) => {
  return (targetIdx / numItems) * (numItems * REEL_HEIGHT);
};

type Props = {
  reelItems: ReelItem[];
  reelIdx: number;
  setCurReelItem: Function;
  reelTarget: ReelTarget;
};

function SlotReel({
  reelItems,
  reelIdx,
  setCurReelItem,
  reelTarget
}: Props) {
  const [items, setItems] = useState<ReelItem[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinTimer = useRef<number | null>(null);
  const [spinPower, setSpinPower] = useState(0);
  const [curIdx, setCurIdx] = useState(0);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinAngleTarget, setSpinAngleTarget] = useState(0);

  useEffect(() => {
    console.log(`reel #${reelIdx} initialized with reelTarget: ${reelTarget}`);
  }, []);

  useEffect(() => {
    setItems(buildReel(reelItems, REEL_OVERLAP));
    setSpinAngle(0);
  }, [reelItems, setSpinAngle]);

  useEffect(() => {
    if (reelTarget[0] !== -1 && !isSpinning) {
      setSpinny();
    }
  }, [reelTarget]);

  const setSpinny = useCallback(() => {
    const spinTarget = projectSpinTarget(reelItems.length, reelTarget[0], curIdx);
    const nextSpinAngle =
      spinAngle + projectSpinAngle(reelItems.length, spinTarget);

    setSpinAngleTarget(nextSpinAngle);
    setSpinPower(randInRange(SPIN_POWER_RANGE));
    setIsSpinning(true);
  }, [reelItems, reelTarget, spinAngle]);

  // remove timer when unmounting
  useEffect(() => {
    return () => {
      // @ts-ignore
      clearTimeout(spinTimer.current);
    };
  }, []);

  // remove timer when unmounting
  useEffect(() => {
    if (spinAngle < spinAngleTarget) {
      // console.log(`${spinAngle} < ${spinAngleTarget}`);
      spinTimer.current = window.setTimeout(() => {
        setSpinAngle(spinAngle + spinPower);
      }, 30);
    } else if (spinAngle !== spinAngleTarget) {
      //recover
      spinTimer.current = window.setTimeout(() => {
        // console.log('recover to ', spinAngleTarget)
        setSpinAngle(spinAngleTarget);
        completeSpins();
      }, 30);
    }
  }, [spinAngle, spinAngleTarget]);

  const completeSpins = useCallback(() => {
    // console.log(`completeSpins > reelIdx:${reelIdx} at reelTarget:${reelTarget}`, reelItems)
    setCurIdx(reelTarget[0]);
    setCurReelItem(reelItems[reelTarget[0]]);
    setIsSpinning(false);
  }, [reelTarget, reelIdx, setCurIdx, reelItems]);

  const reelTop = useMemo(() => {
    const reelTop = -1 * (spinAngle) % (REEL_HEIGHT * reelItems.length);
    return reelTop - REEL_OVERLAP * REEL_HEIGHT;
  }, [spinAngle, reelItems]);

  return (
    <ScWrapper className={isSpinning ? 'spinning' : ''}>
      <ScReelCenterer>
        <ScReelTape style={{ top: `${reelTop}px` }}>
          {items.map((reelItem, idx) => (
            <ReelContent
              key={`${reelIdx}-${idx}`}
              reelItem={reelItem}
              height={REEL_HEIGHT}
            />
          ))}
        </ScReelTape>
      </ScReelCenterer>
    </ScWrapper>
  );
}

export default SlotReel;
