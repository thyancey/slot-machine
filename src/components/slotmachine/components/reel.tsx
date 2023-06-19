import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import ReelContent from './reel-content';
import { DeckIdxCollection, REEL_HEIGHT, TileKeyCollection } from '../../../store/data';
import { getReelTileStateFromReelState } from '../../../store/utils';

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
  /* clip-path: inset(0 0 round 10px); */
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
  reelIdx: number,
  reelState: DeckIdxCollection,
  tileDeck: TileKeyCollection
};

function NewReel({reelIdx, reelState, tileDeck}: Props) {

  const reelTileStates = useMemo(() => {
    return getReelTileStateFromReelState(reelState, tileDeck);
  }, [ reelState, tileDeck ])

  return (
    <ScWrapper>
      <ScReelCenterer>
        <ScReelTape>
          {reelTileStates.map((tile, idx) => (
            <ReelContent key={`${reelIdx}-${idx}`} tile={tile} height={REEL_HEIGHT} />
          ))}
        </ScReelTape>
      </ScReelCenterer>
      {/* <ScReelOverlay /> */}
    </ScWrapper>
  );
}

export default NewReel;
