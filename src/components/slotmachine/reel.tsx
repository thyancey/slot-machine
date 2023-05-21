import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const REEL_HEIGHT = 50;
const REEL_OVERLAP = 2;
const TOP_OFFSET = REEL_OVERLAP * -REEL_HEIGHT;

// kinda like the cutout you can see the reel through
const ScWrapper = styled.div`
  border: 0.5rem solid green;
  background-color: white;
  width: 6rem;
  height: 10rem;
  position: relative;

  clip-path: circle(4rem at center);
`;

const ScReelCenterer = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: ${`-${REEL_HEIGHT / 2}`}px;
`;

const ScReelTape = styled.div`
  position: absolute;
  /* top is changed to spin the wheel */
  top: 0;
`;

const ScReelItem = styled.div`
  width: 5rem;
  height: ${REEL_HEIGHT}px;
  background-color: grey;
  color: black;
  text-align: center;
  border-bottom: 0.5rem solid brown;

  display: flex;
  align-items: center;
  justify-content: center;
`;

// add redudant items to top and bottom of reel to make it seem continuous
export const buildReel = (
  reelItems: any[],
  reelOverlap: number
) => {
  // starting with [ 0, 1, 2 ]

  // [ +1, +2, 0, 1, 2 ]
  const loopBefore = [];
  for (let i = 0; i < reelOverlap; i++) {
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



export type ReelItem = {
  label: string;
};
type Props = {
  reelItems: ReelItem[];
  reelIdx: number;
  onSpinComplete: Function;
  spinning?: boolean;
};

const SPIN_VEL = 100;
const SPIN_DRAG = .9;

function SlotReel({ reelItems, reelIdx, onSpinComplete, spinning}: Props) {
  const [items, setItems] = useState<ReelItem[]>([]);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinVel, setSpinVel] = useState(0);
  const spinTimer = useRef<number | null>(null);

  useEffect(() => {
    setItems(buildReel(reelItems, REEL_OVERLAP));
  }, [reelItems]);

  // for now, this will snap them in place, but there really should be some bounce effect
  const alignReel = useCallback(() => {
    const nextTop = spinAngle % (REEL_HEIGHT);
    if(nextTop > REEL_HEIGHT / 2){
      setSpinAngle(spinAngle + REEL_HEIGHT - nextTop);
    }else {
      setSpinAngle(spinAngle - nextTop);
    }
    onSpinComplete(reelIdx);
  }, [ spinAngle ]);


  const onSpin = useCallback((vel: number = 1) => {
    setSpinAngle(spinAngle + vel);

    let nextVel = vel * SPIN_DRAG;
    if(nextVel < 1){
      setSpinVel(0);
    }else {
      setSpinVel(nextVel);
    }
  }, [spinAngle]);

  const reelTop = useMemo(() => {
    const newAng = ((TOP_OFFSET - spinAngle) % (REEL_HEIGHT * reelItems.length)) + TOP_OFFSET
    return newAng
  }, [ spinAngle, reelItems ]);

  useEffect(() => {
    if(spinning){
      setSpinVel(SPIN_VEL + Math.random() * 5);
    }
  }, [ spinning, spinTimer ]);

  useEffect(() => {
    return () => {
      // @ts-ignore
      clearTimeout(spinTimer.current)
    }
  }, [])

  useEffect(() => {
    if(spinVel > 0) {
      spinTimer.current = window.setTimeout(() => {
        onSpin(spinVel);
      }, 30)
    } else {
      alignReel();
    }
  }, [ spinVel ]);

  return (
    <ScWrapper>
      <ScReelCenterer>
        <ScReelTape style={{ top: `${reelTop}px` }}>
          {items.map((reelItem, idx) => (
            <ScReelItem key={`${reelIdx}-${idx}`}>{reelItem.label}</ScReelItem>
          ))}
        </ScReelTape>
      </ScReelCenterer>
    </ScWrapper>
  );
}

export default SlotReel;
