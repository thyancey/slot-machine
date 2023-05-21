import { useEffect, useState } from 'react';
import styled from 'styled-components';

const REEL_HEIGHT = 50;

// kinda like the cutout you can see the reel through
const ScWrapper = styled.div`
  border: 0.5rem solid green;
  background-color: white;
  width: 6rem;
  height: 10rem;
  position: relative;

  /* clip-path: circle(4rem at center); */
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

export type ReelItem = {
  label: string;
};

type Props = {
  reelItems: ReelItem[];
  reelIdx: number;
};

const REEL_OVERLAP = 2;

// add redudant items to top and bottom of reel to make it seem continuous
const buildReel = (
  reelItems: ReelItem[],
  reelOverlap: number = REEL_OVERLAP
) => {
  // [ 0, 1, 2 ]

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

  return ([] as ReelItem[])
    .concat(loopBefore)
    .concat(reelItems.map((rI) => rI))
    .concat(loopAfter);
};

function SlotReel({ reelItems, reelIdx }: Props) {
  const [items, setItems] = useState<ReelItem[]>([]);

  useEffect(() => {
    setItems(buildReel(reelItems));
  }, [reelItems]);

  return (
    <ScWrapper>
      <ScReelCenterer>
        <ScReelTape>
          {items.map((reelItem, idx) => (
            <ScReelItem key={`${reelIdx}-${idx}`}>{reelItem.label}</ScReelItem>
          ))}
        </ScReelTape>
      </ScReelCenterer>
    </ScWrapper>
  );
}

export default SlotReel;
