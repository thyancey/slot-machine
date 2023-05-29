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
const SPIN_VEL_RANGE = [15, 30]; // RNG speed range for each reel
const SPIN_DRAG = 0.99;

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

type Props = {
  reelItems: ReelItem[];
  reelIdx: number;
  onSpinComplete: Function;
  spinning?: boolean;
  setCurReelItem: Function;
};

function SlotReel({
  reelItems,
  reelIdx,
  spinning,
  onSpinComplete,
  setCurReelItem,
}: Props) {
  const [items, setItems] = useState<ReelItem[]>([]);
  const [spinAngle, setSpinAngle] = useState(0);
  const [curIdx, setCurIdx] = useState(0);
  const [spinVel, setSpinVel] = useState(0);
  const spinTimer = useRef<number | null>(null);

  useEffect(() => {
    setItems(buildReel(reelItems, REEL_OVERLAP));
    setSpinAngle(0);
  }, [reelItems, setSpinAngle]);

  const onSpin = useCallback(
    (vel: number = 1) => {
      setSpinAngle(spinAngle + vel);

      let nextVel = vel * SPIN_DRAG;
      // console.log('nextVel', nextVel)
      if (nextVel < 1) {
        setSpinVel(0);
      } else {
        setSpinVel(nextVel);
      }
    },
    [spinAngle]
  );

  // everytime i rewrite this, i end up with something i dont quite get. there should be something simpler, however
  // it has to account for small reels && varying overlap
  const reelTop = useMemo(() => {
    // this makes no sense
    const reelTop = spinAngle % (REEL_HEIGHT * reelItems.length);
    return reelTop - REEL_HEIGHT * (reelItems.length + REEL_OVERLAP); // offset for the bottom up position
  }, [spinAngle, reelItems]);

  useEffect(() => {
    const fullHeight = REEL_HEIGHT * reelItems.length;
    const angler = (spinAngle + REEL_HEIGHT / 3) % fullHeight;
    // the wheel spins backwards, so 70% is really 30% in terms of progress
    const percIdx = 1 - angler / fullHeight;
    if (percIdx === 1) {
      setCurIdx(reelItems.length - 1);
    } else {
      // ex, if you're looking 50% down the reel indexes, pick the index in the middle.
      let idx = Math.floor(percIdx * reelItems.length);
      setCurIdx(idx);
    }
  }, [spinAngle, reelItems]);

  useEffect(() => {
    setCurReelItem(reelItems[curIdx]);
  }, [curIdx, reelItems]);

  useEffect(() => {
    if (spinning) {
      // setSpinVel(SPIN_VEL);
      const randSpeed =
        Math.random() * (SPIN_VEL_RANGE[1] - SPIN_VEL_RANGE[0]) +
        SPIN_VEL_RANGE[0];
      setSpinVel(randSpeed);
    }
  }, [spinning, spinTimer]);

  useEffect(() => {
    return () => {
      // @ts-ignore
      clearTimeout(spinTimer.current);
    };
  }, []);

  useEffect(() => {
    if (spinVel > 0) {
      spinTimer.current = window.setTimeout(() => {
        onSpin(spinVel);
      }, 30);
    } else {
      onSpinComplete();
    }
  }, [spinVel]);

  // console.log('on', reelItems[curIdx]?.label)

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
