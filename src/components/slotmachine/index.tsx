import styled from 'styled-components';
import Reel from './reel';
import PayTable, { PayoutItem } from './paytable';
import { useCallback, useState } from 'react';
import { ReelItem, reels } from './reel-data';

const ScWrapper = styled.main`
  position: absolute;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto 4rem;
  justify-content: center;
  align-items: center;

  background-color: var(--color-blue);
  text-align: center;

  border-radius: 0.5rem;
`;

const ScPayTableContainer = styled.div`
  /* background-color: var(--color-black); */
  /* border: .25rem solid var(--color-pink); */
  padding: 0.5rem;
`;
const ScReelContainer = styled.div`
  background-color: var(--color-grey);
  height: 100%;
  display: flex;
  margin: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  align-items: center;
  justify-content: center;

  > div {
    margin: 0rem 0.5rem;
  }
`;
const ScPayoutTray = styled.div`
  padding: 0.5rem;
  height: 100%;

  > div {
    height: 100%;
    background-color: var(--color-black);
    border: 0.5rem solid var(--color-grey);
    border-radius: 0.5rem;
  }
`;

const ScReelLabels = styled.div`
  >div{
    display:inline-block;
    width: 8rem;
    margin: .5rem;

    background-color: var(--color-grey);
    border-radius: .5rem;
  }
`;

/* stick it to the side */
const ScHandle = styled.div`
  position: absolute;
  border: 0.25rem solid white;
  width: 2rem;
  height: 10rem;
  left: 100%;
  margin-left: 1rem;
  bottom: 50%;
  border-radius: 0.5rem;
  background-color: var(--color-purple);
  transition: background-color 0.2s ease-in-out;

  cursor: pointer;

  &:hover {
    background-color: var(--color-pink);
  }
`;

const payoutItems: PayoutItem[] = [
  {
    label: 'c + c + c',
    points: 100,
  },
  {
    label: 'o + c + s',
    points: 200,
  },
  {
    label: 'o + o + o',
    points: 500,
  },
  {
    label: 's + s + s',
    points: 1000,
  },
];

/*
  I could not get the async timers working with react state
  so this variable helps keeps things up to date when they happen
  at the same time. There is probably some better solution with
  useRef, but I couldn't get it to work.
*/
let activeSpin = [false, false, false];
const setActiveSpin = (newSpins: boolean[]) => {
  activeSpin = newSpins;
};
let cReelItems: (ReelItem | null)[] = [null, null, null];
const setCReelItems = (newReelItems: (ReelItem | null)[]) => {
  cReelItems = newReelItems;
};

function SlotMachine() {
  const [cachedSpinning, setCachedSpinning] = useState<boolean[]>([]);
  const [curReelItems, setCurReelItems] = useState<(ReelItem | null)[]>([
    null,
    null,
    null,
  ]);
  const startSpinning = useCallback(() => {
    if (!cachedSpinning.find((iS) => iS === true)) {
      setActiveSpin([true, true, true]);
      setCachedSpinning(activeSpin);
    }
  }, [cachedSpinning]);

  const onSpinComplete = useCallback(
    (reelIdx: number) => {
      const ret = activeSpin.map((iS, idx) => {
        if (idx === reelIdx) return false;
        return iS;
      });
      setActiveSpin(ret);
      setCachedSpinning(activeSpin);
    },
    [setCachedSpinning]
  );

  const onCurReelItem = useCallback(
    (reelItem: ReelItem, reelIdx: Number) => {
      setCReelItems(
        cReelItems.map((cri, idx) => {
          if (idx === reelIdx) return reelItem;
          return cri;
        })
      );
      setCurReelItems(cReelItems);
    },
    [setCurReelItems]
  );

  return (
    <ScWrapper>
      <ScPayTableContainer>
        <PayTable payoutItems={payoutItems} />
      </ScPayTableContainer>
      <ScReelContainer>
        <Reel
          reelIdx={0}
          reelItems={reels[0]}
          spinning={cachedSpinning[0]}
          onSpinComplete={() => onSpinComplete(0)}
          setCurReelItem={(reelItem: ReelItem) => onCurReelItem(reelItem, 0)}
        />
        <Reel
          reelIdx={1}
          reelItems={reels[1]}
          spinning={cachedSpinning[1]}
          onSpinComplete={() => onSpinComplete(1)}
          setCurReelItem={(reelItem: ReelItem) => onCurReelItem(reelItem, 1)}
        />
        <Reel
          reelIdx={2}
          reelItems={reels[2]}
          spinning={cachedSpinning[2]}
          onSpinComplete={() => onSpinComplete(2)}
          setCurReelItem={(reelItem: ReelItem) => onCurReelItem(reelItem, 2)}
        />
      </ScReelContainer>
      <ScReelLabels>
        {curReelItems.map((cri, idx) => (
          <div key={idx}>{cri?.label}</div>
        ))}
      </ScReelLabels>
      <ScPayoutTray>
        <div />
      </ScPayoutTray>
      <ScHandle onClick={() => startSpinning()} />
    </ScWrapper>
  );
}

export default SlotMachine;
