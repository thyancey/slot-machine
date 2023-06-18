import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import ReelContent from './reel-content';
import { REEL_HEIGHT, REEL_OVERLAP, ReelItem, SPIN_POWER_RANGE } from '../data';
import { clamp, randInRange } from '../../../utils';
import { ReelTarget, buildReel, getProgressiveSpinAngle, projectSpinAngle, projectSpinTarget } from '../utils';

// imagine the construction as a ribbon, rendering each reelItem top to bottom
// to complete the looping effect, REEL_OVERLAP n of items are repeated at the top and bottom
// REEL_OVERLAP should be just enough to give the illusion of a wheel within the view area

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


type Props = {
  reelItems: ReelItem[];
  setCurReelItem: Function;
  reelTarget: ReelTarget;
  reelIdx: number; // mostly for identification / logging
};

function SlotReel({ reelItems, reelIdx, setCurReelItem, reelTarget }: Props) {
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
    // setCurIdx(0);
  }, [reelItems]);

  useEffect(() => {
    if (reelTarget && reelTarget[0] !== -1 && !isSpinning) {
      // console.log(`reelTarget: ${reelIdx} : ${reelTarget}`);
      triggerSpin();
    }
  }, [reelTarget]);

  useEffect(() => {
    if (isSpinning) {
      setSpinProgress(spinPower);
    }
  }, [isSpinning]);

  const triggerSpin = useCallback(() => {
    const nextSpinTarget = projectSpinTarget(
      reelItems.length,
      curIdx,
      reelTarget[0],
      3 // TODO: refactor this out, base spins off of # of items in reel
    );
    const projectedSpinAngle = projectSpinAngle(reelItems.length, nextSpinTarget, curIdx);
    const nextSpinAngle = spinAngle + projectedSpinAngle;

    setCurReelItem(undefined);
    setSpinAngleTarget(nextSpinAngle);
    setSpinPower(randInRange(SPIN_POWER_RANGE));
    setIsSpinning(true);
  }, [reelItems, reelTarget, spinAngle, curIdx]);

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
  }, [reelTarget, setCurIdx, reelItems, spinAngle]);

  const reelTop = useMemo(() => {
    // console.log('there are this many', reelItems.length)
    const reelTop = (-1 * spinAngle) % (REEL_HEIGHT * reelItems.length);
    // console.log('reelTop', reelTop)
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
