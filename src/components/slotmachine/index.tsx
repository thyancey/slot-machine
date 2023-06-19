import styled from 'styled-components';
import Reel from './components/reel';
import { useCallback, useEffect, useState, useContext } from 'react';
import { Tile, defaultReelState, reelComboDef, ReelCombo, ReelComboResult, defaultTileDeck } from '../../store/data';
import ResultLabel from './components/result-label';
import Display from './components/display';
import { AppContext } from '../../store/appcontext';
import UpgradeTray from './components/upgradetray';
import { getRandomIdx } from './utils';

const ScWrapper = styled.main`
  position: absolute;

  margin-left: -8rem;
  min-width: 28rem;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto 4rem;
  justify-content: center;
  align-items: center;

  background-color: var(--color-white);
  box-shadow: 0 0 0 0.75rem var(--color-purple), 0 0 0 1.5rem var(--color-pink);
  text-align: center;

  border-radius: 0.5rem;
`;

const ScDisplayContainer = styled.div`
  height: 10rem;
  width: calc(100% - 2rem);
  margin: 1rem auto;
  position: relative;
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
const ScUpgradeTray = styled.div`
  width: calc(100% - 2rem);
  margin: 1rem auto;
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
  z-index: 1;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  padding-top: 1rem;

  background-color: var(--color-white);
  color: var(--color-grey);
  box-shadow: 0 0 0 0.75rem var(--color-purple), 0 0 0 1.5rem var(--color-pink);

  span {
    font-family: var(--font-8bit2);
    font-size: 4rem;
    line-height: 3rem;
    text-align: center;
  }

  cursor: pointer;

  &:hover {
    background-color: var(--color-yellow);
    color: var(--color-pink);
  }

  &.disabled {
    background-color: var(--color-grey);
    color: var(--color-black);

    &:hover {
      background-color: var(--color-grey);
    }
  }
`;

function SlotMachine() {
  const [curTiles, setCurTiles] = useState<(Tile | undefined)[]>([]);
  const [spinCount, setSpinCount] = useState(0);
  const [spinLock, setSpinLock] = useState(false);
  const [reelCombos, setReelCombos] = useState<ReelCombo[]>([]);
  const [activeCombos, setActiveCombos] = useState<ReelComboResult[]>([]);
  const { setReelStates, reelStates, setTileDeck, setDeckState, tileDeck } = useContext(AppContext);
  const [ targetSlotIdxs, setTargetSlotIdxs ] = useState<number[]>([]);

  useEffect(() => {
    // console.log('SlotMachine.initial load');
    setReelCombos(reelComboDef.map((reelCombo) => reelCombo));
    setReelStates(defaultReelState);
    setTileDeck(defaultTileDeck);
    setDeckState({
      drawn: [],
      // populate and shuffle the deck
      draw: Array.from(Array(defaultTileDeck.length).keys()).sort(() => Math.random() - 0.5),
      discard: []
    });
  }, [setDeckState, setReelStates, setTileDeck]);

  useEffect(() => {
    //setTargetSlotIdxs(Array(reelStates.length).fill([-1, 0]));
    // console.log('SlotMachine: reelStates changed', reelStates);
    setCurTiles(Array(reelStates.length).fill(undefined));
  }, [reelStates]);

  const triggerSpin = useCallback(() => {
    if (!spinLock) {
      //const randomReelPositions = getRandom2dIdxs(reelStates.map((rs) => rs.map((r) => r)));
      //setTargetSlotIdxs(randomReelPositions.map((r) => [r, spinCount]));
      // determine what the next line of slots will be, someday make this weighted
      setTargetSlotIdxs(reelStates.map(rs => getRandomIdx(rs)));

      setSpinCount(spinCount + 1);
      // setSpinLock(true);
      setActiveCombos([]);
    }
  }, [spinCount, spinLock, reelStates]);

  const onSpinComplete = useCallback((reelIdx: number) => {
    console.log(`reel [${reelIdx}] done spinning!`);
  }, []);

  console.log('SlotMachine: reelStates', reelStates, targetSlotIdxs)

  return (
    <ScWrapper>
      <ScDisplayContainer>
        []
        <Display reelCombos={reelCombos} activeCombos={activeCombos} numReels={reelStates.length} />
      </ScDisplayContainer>

      <ScReelContainer>
        {reelStates.map((reelState, reelIdx) => (
          <Reel
            key={`reel-${reelIdx}`}
            reelIdx={reelIdx}
            reelState={reelState}
            tileDeck={tileDeck}
            spinCount={spinCount}
            targetSlotIdx={targetSlotIdxs[reelIdx] !== undefined ? targetSlotIdxs[reelIdx] : -1}
            onSpinComplete={onSpinComplete}
          />
        ))}
      </ScReelContainer>
      <ScReelLabels>
        {curTiles.map((cri, idx) => (
          <ResultLabel key={idx} tile={cri} />
        ))}
      </ScReelLabels>
      <ScUpgradeTray>
        <UpgradeTray />
      </ScUpgradeTray>
      <ScHandle className={spinLock ? 'disabled' : ''} onClick={() => triggerSpin()}>
        <span>{'T R Y - A G A I N'}</span>
      </ScHandle>
    </ScWrapper>
  );
}

export default SlotMachine;
