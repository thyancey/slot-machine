import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import ReelContent from './reel-content';
import { ReelItem } from './reel-data';

// imagine the construction as a ribbon, rendering each reelItem top to bottom
// next, additional items are rendered to assist in the looping effect:
// the last item is repeated at the start of the reel, and then N REEL_OVERLAP items
// REEL_OVERLAP should be just enough to give the illusion of a wheel within the view area

const REEL_HEIGHT = 120; // height of each reel cell
const REEL_OVERLAP = 2; // # of looparound cells to add to edge of reel so that it can transition nicely
const SPIN_VEL_RANGE: MinMaxTouple = [15, 35]; // RNG speed range for each reel
const MIN_SPINS_RANGE: MinMaxTouple = [1, 3]; // RNG speed range for each reel

// kinda like the cutout you can see the reel through
const ScWrapper = styled.div`
  border: 0.5rem solid var(--color-white);
  width: 8rem;
  height: 12rem;
  position: relative;

  /* makes a cutout */
  clip-path: inset(0 0 round 10px);
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

type MinMaxTouple = [min: number, max: number];
export const randInRange = (range: MinMaxTouple, isIndexes = false) => {
  const val = Math.random() * (range[1] - range[0]) + range[0];
  return isIndexes ? Math.floor(val) : val;
}
  

// add redudant items to top and bottom of reel to make it seem continuous
export const buildReel = (reelItems: any[], reelOverlap: number) => {
  // starting with [ 0, 1, 2 ]

  // [ +0, +1, +2, 0, 1, 2 ]
  const loopBefore = [];
  // the +1 here attached the last to the top, regardless of overlap value
  for (let i = 0; i < reelOverlap + 1; i++) {
    const offset = reelItems.length - (i % reelItems.length) - 1;
    loopBefore.push(reelItems[offset]);
  }
  loopBefore.reverse();

  // [ 0, 1, 2 ] -> [ 0, 1, 2, +0, +1 ]
  const loopAfter = [];
  for (let i = 0; i < reelOverlap; i++) {
    loopAfter.push(reelItems[i % reelItems.length]);
  }

  return ([] as any[])
    .concat(loopBefore)
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
  reelTarget: number;
  // onSpinComplete: Function;
  // spinning?: boolean;
};

function SlotReel({
  reelItems,
  reelIdx,
  setCurReelItem,
  reelTarget,
  // spinning,
  // onSpinComplete,
}: Props) {
  const [items, setItems] = useState<ReelItem[]>([]);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinAngleTarget, setSpinAngleTarget] = useState(0);
  const spinTimer = useRef<number | null>(null);
  const [spinPower, setSpinPower] = useState(0);
  const [curIdx, setCurIdx] = useState(0);

  useEffect(() => {
    console.log(`reel #${reelIdx} initialized with reelTarget: ${reelTarget}`);
  }, []);


  useEffect(() => {
    setItems(buildReel(reelItems, REEL_OVERLAP));
    setSpinAngle(0);
  }, [reelItems, setSpinAngle]);

  useEffect(() => {
    if (reelTarget !== -1) {
      //console.log(` ${reelIdx}: my new target is ${reelTarget}`);
      setSpinny();
    }
  }, [reelTarget]);

  const setSpinny = useCallback(() => {
    const spinTarget = projectSpinTarget(reelItems.length, reelTarget, curIdx);
    const nextSpinAngle = spinAngle + projectSpinAngle(reelItems.length, spinTarget);
    /*console.log(
      'setSpinny(), spinTarget:',
      spinTarget,
      ', spinAngle:',
      nextSpinAngle
    );*/

    setSpinAngleTarget(nextSpinAngle);
    setSpinPower(randInRange(SPIN_VEL_RANGE));
  }, [reelItems, reelTarget, spinAngle]);

  // remove timer when unmounting
  useEffect(() => {
    return () => {
      // @ts-ignore
      clearTimeout(spinTimer.current);
    };
  }, []);

  useEffect(() => {
    console.log('set for ', curIdx)
    setCurReelItem(reelItems[curIdx]);
  }, [curIdx, reelItems]);

  // remove timer when unmounting
  useEffect(() => {
    if (spinAngle < spinAngleTarget) {
      // console.log(`${spinAngle} < ${spinAngleTarget}`);
      spinTimer.current = window.setTimeout(() => {
        setSpinAngle(spinAngle + spinPower);
      }, 30);
    } else if(spinAngle !== spinAngleTarget) {
      //recover
      spinTimer.current = window.setTimeout(() => {
        console.log('recover to ', spinAngleTarget)
        setSpinAngle(spinAngleTarget);
        updateCurIdx()
      }, 30);
    }
  }, [spinAngle, spinAngleTarget]);

  const updateCurIdx = useCallback(() => {
    const fullHeight = REEL_HEIGHT * reelItems.length;
    const modAngle = (spinAngle + (REEL_HEIGHT / 2)) % fullHeight
    if (modAngle === fullHeight) {
      // 100%, so set to the end
      setCurIdx(reelItems.length - 1);
    } else {
      const percIdx = Math.floor((modAngle / fullHeight) * reelItems.length);
      setCurIdx(percIdx);
    }

  }, [spinAngle, reelItems]);

  // everytime i rewrite this, i end up with something i dont quite get. there should be something simpler, however
  // it has to account for small reels && varying overlap
  const reelTop = useMemo(() => {
    // this makes no sense
    //console.log(spinAngle)
    const reelTop = spinAngle % (REEL_HEIGHT * reelItems.length);
    return reelTop - REEL_HEIGHT * (reelItems.length + REEL_OVERLAP); // offset for the bottom up position
  }, [spinAngle, reelItems]);

  return (
    <ScWrapper>
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