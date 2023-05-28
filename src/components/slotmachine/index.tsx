import styled from 'styled-components';
import Reel, { ReelItem } from './reel';
import PayTable, { PayoutItem } from './paytable';
import { useCallback, useState } from 'react';

const ScWrapper = styled.main`
  background-color: var(--color-blue);
  text-align: center;

  position: absolute;
  height: 100%;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto 5rem;
  justify-content: center;
  align-items: center;
`;

const ScReelContainer = styled.div`
  background-color: var(--color-grey);
  border: .5rem solid var(--color-white);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > div {
    margin: 0.5rem;
  }
`;
const ScPayoutTray = styled.div`
  background-color: var(--color-grey);
  border: .5rem solid var(--color-white);
  height: 100%;
`;
const ScPayTableContainer = styled.div`
  background-color: var(--color-grey);
  border: .5rem solid cyan;
`;

/* stick it to the side */
const ScHandle = styled.div`
  position: absolute;
  border: 0.25rem solid white;
  width: 2rem;
  height: 12rem;
  left: 100%;
  bottom: 50%;
  border-radius: 5rem;
`;

const reels: ReelItem[][] = [
  [
    { label: 'apple' },
    { label: 'banana' },
    { label: 'cherry' },
    { label: 'durian' }
  ],
  [
    { label: 'apple' },
    { label: 'banana' },
    { label: 'cherry' },
    { label: 'durian' }
  ],
  [
    { label: 'apple' },
    { label: 'banana' },
    { label: 'cherry' },
    { label: 'durian' }
  ],
];

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
let activeSpin = [ false, false, false];
const setActiveSpin = (newSpins: boolean[]) => {
  activeSpin = newSpins;
}

function SlotMachine() {
  const [cachedSpinning, setCachedSpinning] = useState<boolean[]>([]);
  const startSpinning = useCallback(() => {
    if(!cachedSpinning.find(iS => iS === true)){
      setActiveSpin([true, true, true]);
      setCachedSpinning(activeSpin);
    }
  }, [ cachedSpinning ]);
  
  const onSpinComplete = useCallback((reelIdx: number) => {
    const ret = activeSpin.map((iS, idx) => {
      if(idx === reelIdx) return false;
      return iS;
    })
    setActiveSpin(ret);
    setCachedSpinning(activeSpin);
  }, [ cachedSpinning, setCachedSpinning ]);
  
  return (
    <ScWrapper>
      <ScPayTableContainer>
        <PayTable payoutItems={payoutItems} />
      </ScPayTableContainer>
      <ScReelContainer>
        <Reel reelIdx={0} reelItems={reels[0]} spinning={cachedSpinning[0]} onSpinComplete={onSpinComplete}/>
        <Reel reelIdx={1} reelItems={reels[1]} spinning={cachedSpinning[1]} onSpinComplete={onSpinComplete}/>
        <Reel reelIdx={2} reelItems={reels[2]} spinning={cachedSpinning[2]} onSpinComplete={onSpinComplete}/>
      </ScReelContainer>
      <ScPayoutTray />
      <ScHandle onClick={() => startSpinning()}/>
    </ScWrapper>
  );
}

export default SlotMachine;
