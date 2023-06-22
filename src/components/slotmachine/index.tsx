import styled from 'styled-components';
import Reel from './components/reel';
import { useCallback, useEffect, useState, useContext, useMemo } from 'react';
import {
  defaultReelState,
  reelComboDef,
  ReelCombo,
  ReelComboResult,
  defaultTileDeck,
  DeckIdxCollection,
} from '../../store/data';
import ResultLabel from './components/result-label';
import Display from './components/display';
import { AppContext } from '../../store/appcontext';
import { getActiveCombos, getComboScore, getRandomIdx } from './utils';
import { getTileFromDeckIdx } from '../../store/utils';
import InfoTray from './components/infotray';
// @ts-ignore
import useSound from 'use-sound';
import Sound from '../../assets/sounds';

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

const ScInfoTray = styled.div`
  width: calc(100% - 2rem);
  margin: 1rem auto;
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
  const [spinCount, setSpinCount] = useState(0);
  const [spinLock, setSpinLock] = useState(false);
  const [reelCombos, setReelCombos] = useState<ReelCombo[]>([]);
  const [activeCombos, setActiveCombos] = useState<ReelComboResult[]>([]);
  const [reelResults, setReelResults] = useState<DeckIdxCollection>([]);
  const [targetSlotIdxs, setTargetSlotIdxs] = useState<number[]>([]);
  const { setReelStates, reelStates, setTileDeck, setDeckState, tileDeck, incrementScore } = useContext(AppContext);

  const [sound_reelsComplete] = useSound(Sound.boop);
  const [sound_reelComplete] = useSound(Sound.beep);
  const [sound_lever] = useSound(Sound.explosion);

  useEffect(() => {
    setReelCombos(reelComboDef.map((reelCombo) => reelCombo));
    setReelStates(defaultReelState);
    setTileDeck(defaultTileDeck);
    setDeckState({
      drawn: [],
      // populate and shuffle the deck
      draw: Array.from(Array(defaultTileDeck.length).keys()).sort(() => Math.random() - 0.5),
      discard: [],
    });
  }, [setDeckState, setReelStates, setTileDeck]);

  useEffect(() => {
    console.log('resetReelResults', reelStates);
    setReelResults(Array(reelStates.length).fill(-1));
  }, [reelStates]);

  const triggerSpin = useCallback(() => {
    if (!spinLock) {
      // determine what the next line of slots will be, someday make this weighted
      setTargetSlotIdxs(reelStates.map((rs) => getRandomIdx(rs)));

      setSpinCount(spinCount + 1);
      setReelResults(Array(reelStates.length).fill(-1));
      setSpinLock(true);
      setActiveCombos([]);
    }
  }, [spinCount, spinLock, reelStates]);

  const onSpinComplete = useCallback(
    (reelIdx: number, slotIdx: number) => {
      // console.log(`(pre) reel [${reelIdx}] done spinning and landed on ${slotIdx}!`);
      setReelResults((prev) => prev.map((sIdx, rIdx) => (rIdx === reelIdx ? slotIdx : sIdx)));
    },
    [setReelResults]
  );

  useEffect(() => {
    if(spinCount > 0) sound_lever();
  }, [spinCount]);


  // events when the reels are done spinning. this could probably be simplified and moved to a custom hook
  useEffect(() => {
    if(
      // if we're spinnin and have at least one reel completed
      spinCount > 0 &&
      reelResults.length > 0
    ){
      if (
        reelResults.length === reelStates.length &&
        !reelResults.includes(-1)
      ) {
        // all reels are done spinning, check for points
        sound_reelComplete();
        sound_reelsComplete();
        //console.log('ALL REELS ARE DONE!', reelResults, reelStates, spinCount);
        const tiles = reelResults.map((slotIdx, reelIdx) => getTileFromDeckIdx(reelStates[reelIdx][slotIdx], tileDeck));

        const activeCombos = getActiveCombos(tiles, reelCombos);
        setActiveCombos(activeCombos);

        const comboScore = getComboScore(tiles, activeCombos);
        if (comboScore !== 0) {
          incrementScore(comboScore);
        }

        setSpinLock(false);
      } else if (
        // one reel is done spinning, this doesnt always hit for some reason
        
          // at least one reel lands, this prevents a misfire earlier on
          reelResults.findIndex(r => r > -1) > -1
        ){
          sound_reelComplete();
      }
      // otherwise stuff like a reel is spinning, etc
    }
  }, [reelResults, reelStates, tileDeck, reelCombos, incrementScore, spinCount, sound_reelsComplete, sound_reelComplete]);

  const resultSet = useMemo(() => {
    if (spinCount === 0 || reelStates.length === 0 || reelResults.length === 0) {
      // wheel is not done spinning yet. (or hasnt loaded, or hasnt done first spin)
      return [];
    }
    return reelResults
      .map((slotIdx, reelIdx) => {
        // the undefined check avoids a bug when deleting a reel in the editor
        // while reelResults are populated
        if (slotIdx === -1 || reelStates[reelIdx] === undefined) return undefined;
        const deckIdx = reelStates[reelIdx][slotIdx];
        return getTileFromDeckIdx(deckIdx, tileDeck);
      })
      .filter((rs) => rs !== undefined); // since some were undefined, clear em out
  }, [reelResults, reelStates, tileDeck, spinCount]);

  return (
    <ScWrapper>
      <ScDisplayContainer>
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
        {resultSet.map((tile, reelIdx) => (
          <ResultLabel key={reelIdx} tile={tile} />
        ))}
      </ScReelLabels>
      <ScHandle className={spinLock ? 'disabled' : ''} onClick={() => triggerSpin()}>
        <span>{'T R Y - A G A I N'}</span>
      </ScHandle>
      <ScInfoTray>
        <InfoTray />
      </ScInfoTray>
    </ScWrapper>
  );
}

export default SlotMachine;
