import styled from 'styled-components';
import Reel from './reel';
import PayTable, { PayoutItem } from './paytable';
import { useCallback, useEffect, useState } from 'react';
import { ReelDef, ReelItem, reelsData } from './reel-data';

export type ReelTarget = [
  itemIdx: number,
  spinCount: number
];

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
  > div {
    display: inline-block;
    width: 8rem;
    margin: 0.5rem;

    background-color: var(--color-grey);
    border-radius: 0.5rem;
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
const ScSpinCount = styled.div``;

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

// later on, some factors should weight the "random"
const getRandomReelIdx = (reelDef: ReelDef) =>
  Math.floor(Math.random() * reelDef.reelItems.length);

const getRandomReelTargets = (reelSet: ReelDef[], spinCount: number) => {
  return reelSet.map((reelDef) => [ getRandomReelIdx(reelDef), spinCount ] as ReelTarget);
};

function SlotMachine() {
  // const [cachedSpinning, setCachedSpinning] = useState<boolean[]>([]);
  const [reelDefs, setReelDefs] = useState<ReelDef[]>([]);
  const [reelTargets, setReelTargets] = useState<ReelTarget[]>([]);
  const [curReelItems, setCurReelItems] = useState<(ReelItem | null)[]>([]);
  const [spinCount, setSpinCount] = useState(0);

  useEffect(() => {
    // later on, reel should store extra properties other than the reelItems
    setReelDefs(
      reelsData.map((reel) => ({
        reelItems: reel.reelItems.map(
          (rI, rIdx) =>
            ({
              ...rI,
              idx: rIdx,
            })
        ),
      }) as ReelDef)
    );

    setReelTargets(Array(reelsData.length).fill([0, 0]));
    setCurReelItems(Array(reelsData.length).fill(null));
  }, []);

  const startSpinning = useCallback(() => {
    setReelTargets(getRandomReelTargets(reelDefs, spinCount));
    setSpinCount(spinCount + 1);
  }, [reelDefs, spinCount]);

  const onCurReelItem = useCallback(
    (reelItem: ReelItem, reelIdx: number) => {

      // this mutation was the only way to get this working reliably...
      curReelItems[reelIdx] = reelItem;
      setCurReelItems([...curReelItems]);
    },
    [setCurReelItems, curReelItems]
  );

  return (
    <ScWrapper>
      <ScPayTableContainer>
        <PayTable payoutItems={payoutItems} />
      </ScPayTableContainer>
      <ScReelContainer>
        {reelDefs.map((reelDef, rdIdx) => (
          <Reel
            key={`reel-${rdIdx}`}
            reelIdx={rdIdx}
            reelItems={reelDef.reelItems}
            reelTarget={reelTargets[rdIdx]}
            setCurReelItem={(reelItem: ReelItem) => onCurReelItem(reelItem, rdIdx)}
          />
        ))}
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
      <ScSpinCount>{`spins: ${spinCount}`}</ScSpinCount>
    </ScWrapper>
  );
}

export default SlotMachine;
