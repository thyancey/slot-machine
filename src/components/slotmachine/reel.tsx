import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import ReelContent from './reel-content';
import { ReelItem } from './reel-data';

const REEL_HEIGHT = 120;
const REEL_DIRECTION = 1; // nothing works well, eventually, -1 should allow the reel to go the other way.
const REEL_OVERLAP = 2; // # of looparound cells to add to edge of reel so that it can transition nicely
const TOP_OFFSET = REEL_OVERLAP * -REEL_HEIGHT; // move the real up this much to make all cells appear on screen
const SPIN_VEL_RANGE = [25, 80];  // RNG speed range for each reel
// const SPIN_VEL_RANGE = [1, 2];  // RNG speed range for each reel
const SPIN_DRAG = .98;

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
  width:100%;
  /* top is changed to spin the wheel */
  top: 0;
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


type Props = {
  reelItems: ReelItem[];
  reelIdx: number;
  onSpinComplete: Function;
  spinning?: boolean;
};


function SlotReel({ reelItems, reelIdx, onSpinComplete, spinning}: Props) {
  const [items, setItems] = useState<ReelItem[]>([]);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinVel, setSpinVel] = useState(0);
  const spinTimer = useRef<number | null>(null);

  useEffect(() => {
    setItems(buildReel(reelItems, REEL_OVERLAP));
    if(REEL_DIRECTION === 1){
      setSpinAngle(-1); 
    } else{
      setSpinAngle(0);
    }
  }, [reelItems, setSpinAngle]);

  // refactor this to not calc height
  // for now, this will snap them in place, but there really should be some bounce effect
  const alignReel = useCallback(() => {
    const nextTop = spinAngle % (REEL_HEIGHT);
    
    if(nextTop > REEL_HEIGHT / 2){
      setSpinAngle(spinAngle + REEL_HEIGHT - nextTop);
    }else {
      setSpinAngle(spinAngle - nextTop);
    }

    const item = getReelItemFromSpinAngle(spinAngle, reelItems);
    console.log(`>>>item (${reelIdx}): `, item)
    onSpinComplete(reelIdx);
  }, [ spinAngle, reelItems, reelIdx ]);


  // this is a litlte wacky, but it seems to work
  const getReelItemFromSpinAngle = (spinAngle: number, reelItems:ReelItem[]) => {
    const fullHeight = REEL_HEIGHT * reelItems.length;
    const angler = (spinAngle - (REEL_HEIGHT / 2)) % fullHeight;
    // the wheel spins backwards, so 70% is really 30% in terms of progress
    const percIdx = 1 - (angler / fullHeight);
    // ex, if you're looking 50% down the reel indexes, pick the index in the middle.
    const idx = Math.floor(percIdx * reelItems.length);
    return reelItems[idx];
  }


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
    const fullHeight = REEL_HEIGHT * reelItems.length;
    let newAng = spinAngle;
    // if(reelIdx === 0) console.log(`sa: ${spinAngle}, fh: ${fullHeight}, TOP_OFFSET: ${TOP_OFFSET}`);
    if(REEL_DIRECTION === 1){
      newAng = ((spinAngle + fullHeight) % fullHeight) - fullHeight + TOP_OFFSET;
    }
    return newAng
  }, [ spinAngle, reelItems ]);

  useEffect(() => {
    if(spinning){
      // setSpinVel(SPIN_VEL);
      const randSpeed = Math.random() * (SPIN_VEL_RANGE[1] - SPIN_VEL_RANGE[0]) + SPIN_VEL_RANGE[0];
      setSpinVel(randSpeed);
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
            <ReelContent key={`${reelIdx}-${idx}`} reelItem={reelItem} height={REEL_HEIGHT} />
          ))}
        </ScReelTape>
      </ScReelCenterer>
    </ScWrapper>
  );
}

export default SlotReel;
