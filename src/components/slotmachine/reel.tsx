import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import ReelContent from './reel-content';
import { ReelDef, ReelItem } from './reel-data';
import { MinMaxTouple, clamp, getEasing, randInRange } from '../../utils';
import { ReelTarget } from '.';

// imagine the construction as a ribbon, rendering each reelItem top to bottom
// to complete the looping effect, REEL_OVERLAP n of items are repeated at the top and bottom
// REEL_OVERLAP should be just enough to give the illusion of a wheel within the view area

const REEL_HEIGHT = 120; // height of each reel cell
const REEL_OVERLAP = 2; // # of looparound cells to add to edge of reel so that it can transition nicely
const SPIN_POWER_RANGE: MinMaxTouple = [0.01, 0.03]; // RNG speed range for each reel
const MIN_SPINS_RANGE: MinMaxTouple = [1, 2]; // RNG number of times to go around for each reel
const SPIN_TICK: number = 30;

// kinda like the cutout you can see the reel through
const ScWrapper = styled.div`
  border: 0.5rem solid var(--color-white);
  width: 8rem;
  height: 12rem;
  position: relative;

  /* makes a cutout */
  clip-path: inset(0 0 round 10px);

  &.spinning {
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

const getProgressiveSpinAngle = (perc: number, targetAngle: number, lastAngle: number) => {
  return getEasing(perc, 'easeInOutQuad') * (targetAngle - lastAngle);
};

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

/*
  from an array like [ 'a', 'b' ], figure out how to do something like
  "starting from "b", go to "a", and loop at least 2 times"

  this could probably get cleaned up and simplified but im sick of messing with it.
*/
export const projectSpinTarget = (numItems: number, curIdx: number, nextIdx: number, loops: number) => {
  const change = nextIdx - curIdx;

  if (loops === 0) {
    if (change === 0) {
      return curIdx + numItems;
    } else if (change > 0) {
      return curIdx + change;
    } else {
      return curIdx + numItems + change;
    }
  } else {
    if (change === 0) {
      return curIdx + numItems * loops;
    } else if (change > 0) {
      return curIdx + numItems * loops + change;
    } else {
      return curIdx + numItems * loops + (numItems + change);
    }
  }
};

const projectSpinAngle = (numItems: number, targetIdx: number, curIdx: number) => {
  if (numItems === 1) {
    return targetIdx * REEL_HEIGHT;
  }
  return (targetIdx / numItems) * (numItems * REEL_HEIGHT) - curIdx * REEL_HEIGHT;
};

type Props = {
  reelDef: ReelDef;
  reelItems: ReelItem[];
  reelIdx: number;
  setCurReelItem: Function;
  reelTarget: ReelTarget;
};

function SlotReel({ reelDef, reelItems, reelIdx, setCurReelItem, reelTarget }: Props) {
  const [items, setItems] = useState<ReelItem[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinTimer = useRef<number | null>(null);
  const [spinPower, setSpinPower] = useState(0);
  const [curIdx, setCurIdx] = useState(0);

  const [spinProgress, setSpinProgress] = useState(0); // 0 to 1 percentage
  const [spinAngle, setSpinAngle] = useState(0);

  const [lastSpinAngle, setLastSpinAngle] = useState(0);
  const [spinAngleTarget, setSpinAngleTarget] = useState(0);

  useEffect(() => {
    console.log(`reel #${reelIdx} initialized with reelTarget: ${reelTarget}`);
  }, []);

  useEffect(() => {
    console.log('---------- RESET REEL ---------');
    setItems(buildReel(reelItems, REEL_OVERLAP));
    setSpinAngle(0);

    setLastSpinAngle(0);
    setSpinProgress(0);
    setCurIdx(0);
  }, [reelItems]);

  useEffect(() => {
    if (reelTarget[0] !== -1 && !isSpinning) {
      console.log('reelTarget', reelTarget[0]);
      triggerSpin();
    }
  }, [reelTarget]);

  useEffect(() => {
    if (isSpinning) {
      setSpinProgress(spinPower);
    }
  }, [isSpinning]);

  const triggerSpin = useCallback(() => {
    console.log('triggerSpin', reelDef)
    const nextSpinTarget = projectSpinTarget(
      reelItems.length,
      curIdx,
      reelTarget[0],
      randInRange(reelDef.spinRange || MIN_SPINS_RANGE, true)
    );
    const projectedSpinAngle = projectSpinAngle(reelItems.length, nextSpinTarget, curIdx);
    const nextSpinAngle = spinAngle + projectedSpinAngle;

    setCurReelItem(undefined);
    setSpinAngleTarget(nextSpinAngle);
    setSpinPower(randInRange(SPIN_POWER_RANGE));
    setIsSpinning(true);
  }, [reelItems, reelTarget, spinAngle, reelDef]);

  // remove timer when unmounting
  useEffect(() => {
    return () => {
      // @ts-ignore
      clearTimeout(spinTimer.current);
    };
  }, []);

  useEffect(() => {
    if (isSpinning) {
      if (spinProgress < 1) {
        spinTimer.current = window.setTimeout(() => {
          const nextProgress = clamp(spinProgress + spinPower, 0, 1);
          const nextAngle = lastSpinAngle + getProgressiveSpinAngle(nextProgress, spinAngleTarget, lastSpinAngle);

          setSpinAngle(nextAngle);

          setSpinProgress(nextProgress);
        }, SPIN_TICK);
      } else {
        if (spinProgress > 1) {
          //recover
          const nextAngle = lastSpinAngle + getProgressiveSpinAngle(1, spinAngleTarget, lastSpinAngle);
          setSpinAngle(nextAngle);
          completeSpins();
        } else {
          console.log('<< done', spinProgress);
          completeSpins();
        }
      }
    }
  }, [spinProgress]);

  // reset, save values, tell parent about where you landed
  const completeSpins = useCallback(() => {
    setIsSpinning(false);
    setLastSpinAngle(spinAngle);
    setCurIdx(reelTarget[0]);
    setCurReelItem(reelItems[reelTarget[0]]);
  }, [reelTarget, reelIdx, setCurIdx, reelItems, spinAngle]);

  const reelTop = useMemo(() => {
    const reelTop = (-1 * spinAngle) % (REEL_HEIGHT * reelItems.length);
    return reelTop - REEL_OVERLAP * REEL_HEIGHT;
  }, [spinAngle, reelItems]);

  return (
    <ScWrapper className={isSpinning ? 'spinning' : ''}>
      <ScReelCenterer>
        <ScReelTape style={{ top: `${reelTop}px` }}>
          {items.map((reelItem, idx) => (
            <ReelContent key={`${reelIdx}-${idx}`} reelItem={reelItem} height={REEL_HEIGHT} />
          ))}
        </ScReelTape>
      </ScReelCenterer>
    </ScWrapper>
  );
}

export default SlotReel;
