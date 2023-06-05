import styled from 'styled-components';
import Reel from './reel';
// import { PayoutItem } from './paytable';
import { useCallback, useEffect, useState } from 'react';
import { ReelDef, ReelItem, reelsData } from './reel-data';
import ResultLabel from './result-label';

export type ReelTarget = [itemIdx: number, spinCount: number];

const ScWrapper = styled.main`
  position: absolute;

  // TODO: at the moment, this is 2x the handle width, to center everything
  margin-left: -8rem;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto 4rem;
  justify-content: center;
  align-items: center;

  background-color: var(--color-white);
  box-shadow: 0 0 0 .75rem var(--color-purple), 0 0 0 1.5rem var(--color-pink);
  text-align: center;

  border-radius: 0.5rem;
`;

const ScScreen = styled.div`
  height: 10rem;
  background-color: var(--color-grey);
  border-radius: .6rem;
  padding: 1rem;
  width:calc(100% - 2rem);
  margin: 1rem auto;

  font-family: var(--font-8bit2);
  font-size: 5rem;
  color: var(--color-white);
`;

const ScReelContainer = styled.div`
  background-color: var(--color-grey);
  height: 100%;
  display: flex;
  margin: 1rem;
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
  display: flex;
  justify-content: center;
`;

/* stick it to the side */
const ScHandle = styled.div`
  position: absolute;
  width: 4rem;
  height: 100%;
  left: calc(100% + 4rem);
  top: 0;
  z-index:1;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  padding-top: 1rem;
  
  background-color: var(--color-white);
  color: var(--color-grey);
  box-shadow: 0 0 0 .75rem var(--color-purple), 0 0 0 1.5rem var(--color-pink);

  span{
    font-family: var(--font-8bit2);
    font-size: 4rem;
    line-height: 3rem;
    text-align:center;
  }

  cursor: pointer;

  &:hover {
    background-color: var(--color-yellow);
    color: var(--color-pink);
  }

  &.disabled{
    background-color: var(--color-grey);
    color: var(--color-black);

    &:hover {
      background-color: var(--color-grey);
    }
  }
`;
const ScSpinCount = styled.div``;

// const payoutItems: PayoutItem[] = [
//   {
//     label: 'c + c + c',
//     points: 100,
//   },
//   {
//     label: 'o + c + s',
//     points: 200,
//   },
//   {
//     label: 'o + o + o',
//     points: 500,
//   },
//   {
//     label: 's + s + s',
//     points: 1000,
//   },
// ];

// later on, some factors should weight the "random"
const getRandomReelIdx = (reelDef: ReelDef) => Math.floor(Math.random() * reelDef.reelItems.length);

const getRandomReelTargets = (reelSet: ReelDef[], spinCount: number) => {
  return reelSet.map((reelDef) => [getRandomReelIdx(reelDef), spinCount] as ReelTarget);
};

function SlotMachine() {
  // const [cachedSpinning, setCachedSpinning] = useState<boolean[]>([]);
  const [reelDefs, setReelDefs] = useState<ReelDef[]>([]);
  const [reelTargets, setReelTargets] = useState<ReelTarget[]>([]);
  const [curReelItems, setCurReelItems] = useState<(ReelItem | undefined)[]>([]);
  const [spinCount, setSpinCount] = useState(0);
  const [spinLock, setSpinLock] = useState(false);

  useEffect(() => {
    // later on, reel should store extra properties other than the reelItems
    setReelDefs(
      reelsData.map(
        (reel) =>
          ({
            ...reel,
            reelItems: reel.reelItems.map((rI, rIdx) => ({
              ...rI,
              idx: rIdx,
            })),
          } as ReelDef)
      )
    );

    setReelTargets(Array(reelsData.length).fill([-1, 0]));
    setCurReelItems(Array(reelsData.length).fill(undefined));
  }, []);

  const triggerSpin = useCallback(() => {
    if (!spinLock) {
      setReelTargets(getRandomReelTargets(reelDefs, spinCount));
      setSpinCount(spinCount + 1);
      setSpinLock(true);
    }
  }, [reelDefs, spinCount, spinLock]);

  const onCurReelItem = useCallback(
    (reelItem: ReelItem, reelIdx: number) => {
      // this mutation was the only way to get this working reliably...
      curReelItems[reelIdx] = reelItem;
      setCurReelItems([...curReelItems]);

      if (curReelItems.filter((rI) => rI === undefined).length === 0) {
        setSpinLock(false);
      }
    },
    [setCurReelItems, curReelItems, setSpinLock]
  );

  return (
    <ScWrapper>
      <ScScreen>
        <span>{'YOU WIN !'}</span>
      </ScScreen>
{/* 
      <ScPayTableContainer>
        <PayTable payoutItems={payoutItems} />
      </ScPayTableContainer> */}

      <ScReelContainer>
        {reelDefs.map((reelDef, rdIdx) => (
          <Reel
            key={`reel-${rdIdx}`}
            reelIdx={rdIdx}
            reelDef={reelDef}
            reelItems={reelDef.reelItems}
            reelTarget={reelTargets[rdIdx]}
            setCurReelItem={(reelItem: ReelItem) => onCurReelItem(reelItem, rdIdx)}
          />
        ))}
      </ScReelContainer>
      <ScReelLabels>
        {curReelItems.map((cri, idx) => (
          <ResultLabel key={idx} reelItem={cri} />
        ))}
      </ScReelLabels>
      <ScPayoutTray>
        <div />
      </ScPayoutTray>
      <ScHandle className={spinLock ? 'disabled' : ''} onClick={() => triggerSpin()} >
        <span>{'T R Y - A G A I N'}</span>
      </ScHandle>
      <ScSpinCount>{`spins: ${spinCount}`}</ScSpinCount>
    </ScWrapper>
  );
}

export default SlotMachine;