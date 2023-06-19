import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import ReelContent from './reel-content';
import { REEL_HEIGHT, REEL_OVERLAP, Tile, SPIN_POWER_RANGE } from '../../../store/data';
import { clamp, randInRange } from '../../../utils';
import { ReelTarget, buildReel, getProgressiveSpinAngle, projectSpinAngle, projectSpinTarget } from '../utils';

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
  clip-path: inset(0 0 round 10px);

  &.spinning {
  }
`;

const ScReelOverlay = styled.div`
  position: absolute;
  inset: -0.6rem;
  --color-grey-transparent: rgba(241, 91, 181, 0);
  background: var(--color-grey);
  background: linear-gradient(0deg, var(--color-grey) 0%, var(--color-grey-transparent) 20%, var(--color-grey-transparent) 80%, var(--color-grey) 100%);
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
  tiles: Tile[];
  setCurTile: (tile: Tile | undefined) => void;
  reelTarget: ReelTarget;
  reelIdx: number; // mostly for identification / logging
};

function SlotReel({ tiles, reelIdx, setCurTile, reelTarget }: Props) {
  const [reelTiles, setReelTiles] = useState<Tile[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinTimer = useRef<number | null>(null);
  const [spinPower, setSpinPower] = useState(0);
  const [curIdx, setCurIdx] = useState(0);

  const [spinProgress, setSpinProgress] = useState(0); // 0 to 1 percentage
  const [spinAngle, setSpinAngle] = useState(0);

  const [lastSpinAngle, setLastSpinAngle] = useState(0);
  const [spinAngleTarget, setSpinAngleTarget] = useState(0);

  /*
  useEffect(() => {
    console.log(`reel #${reelIdx} initialized with reelTarget: ${reelTarget}`);
  }, []);
  */

  useEffect(() => {
    // console.log('---------- RESET REEL ---------');
    setReelTiles(buildReel(tiles, REEL_OVERLAP));
    setSpinAngle(0);

    setLastSpinAngle(0);
    setSpinProgress(0);
     // reset the reel position, but maybe eventually keep it? itll be weird when adding/removing stuff
    setCurIdx(0);
  }, [tiles]);

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
      tiles.length,
      curIdx,
      reelTarget[0],
      3 // TODO: refactor this out, base spins off of # of tiles in reel
    );
    const projectedSpinAngle = projectSpinAngle(tiles.length, nextSpinTarget, curIdx);
    const nextSpinAngle = spinAngle + projectedSpinAngle;

    setCurTile(undefined);
    setSpinAngleTarget(nextSpinAngle);
    setSpinPower(randInRange(SPIN_POWER_RANGE));
    setIsSpinning(true);
  }, [tiles, reelTarget, spinAngle, curIdx]);

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
          // console.log('<< done', spinProgress);
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
    setCurTile(tiles[reelTarget[0]]);
  }, [reelTarget, setCurIdx, tiles, spinAngle]);

  const reelTop = useMemo(() => {
    // console.log('there are this many', tiles.length)
    const reelTop = (-1 * spinAngle) % (REEL_HEIGHT * tiles.length);
    // console.log('reelTop', reelTop)
    return reelTop - REEL_OVERLAP * REEL_HEIGHT;
  }, [spinAngle, tiles]);

  return (
    <ScWrapper className={isSpinning ? 'spinning' : ''}>
      <ScReelCenterer>
        <ScReelTape style={{ top: `${reelTop}px` }}>
          {reelTiles.map((tile, idx) => (
            <ReelContent key={`${reelIdx}-${idx}`} tile={tile} height={REEL_HEIGHT} />
          ))}
        </ScReelTape>
      </ScReelCenterer>
      <ScReelOverlay />
    </ScWrapper>
  );
}

export default SlotReel;
