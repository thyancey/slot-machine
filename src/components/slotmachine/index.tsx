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
import ResultLabel, { EmptyResultLabel } from './components/result-label';
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

  &.lit-up {
    box-shadow: 
      0 0 0 0.75rem var(--color-purple),
      0 0 0 1.5rem var(--color-pink),
      0 0 3rem 2rem var(--color-pink);
  }
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
  height: 100%;
  padding: 1.6rem 0; // hack to align temp spin counter
  left: calc(100% + 4rem);
  top: 0;
  z-index: 1;

  display:flex;
  flex-direction:column;
  >:first-child{
    flex: 1;
    margin-bottom: 4rem;
  }
`;
const ScHandleChild = styled.div`
  background-color: var(--color-yellow);
  color: var(--color-purple);
  box-shadow: 0 0 0 0.75rem var(--color-purple), 0 0 0 1.5rem var(--color-pink);
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  border-radius: 0.5rem;
  width: 4rem;

  .lit-up & {
    box-shadow: 
      0 0 0 0.75rem var(--color-purple),
      0 0 0 1.5rem var(--color-pink),
      0 0 3rem 2rem var(--color-pink);
  }

  span {
    font-family: var(--font-8bit2);
    font-size: 4rem;
    line-height: 3rem;
    text-align: center;
  }

  cursor: pointer;
  
  &:hover {
    background-color: var(--color-purple);
    color: var(--color-pink);
  }


  .spin-disabled & {
    cursor: default;
    background-color: var(--color-grey);
    color: var(--color-black);

    &:hover {
      background-color: var(--color-grey);
    }
  }
`;

const ScSpinHandle = styled(ScHandleChild)`
  flex: 1;
  margin-bottom: 4rem;
  display:flex;
  align-items: center;
`

const ScSpinTokens = styled(ScHandleChild)`
  font-size: 3rem;
  line-height: 3.3rem;
  padding-bottom: 0.2rem;
`

function SlotMachine() {
  const [spinCount, setSpinCount] = useState(0);
  const [spinLock, setSpinLock] = useState(false);
  const [reelCombos, setReelCombos] = useState<ReelCombo[]>([]);
  const [activeCombos, setActiveCombos] = useState<ReelComboResult[]>([]);
  const [reelResults, setReelResults] = useState<DeckIdxCollection>([]);
  const [targetSlotIdxs, setTargetSlotIdxs] = useState<number[]>([]);
  const { setReelStates, reelStates, setTileDeck, setDeckState, tileDeck, incrementScore, spinTokens, setSpinTokens } = useContext(AppContext);

  const [sound_reelsComplete] = useSound(Sound.boop);
  const [sound_reelComplete] = useSound(Sound.beep, {
    playbackRate: .3 + reelResults.filter(r => r !== -1).length * .3
  });
  const [sound_lever] = useSound(Sound.alarm, { volume: 0.2, playbackRate: .10, loop: false });
  const [sound_combo] = useSound(Sound.powerUp);

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
    setReelResults(Array(reelStates.length).fill(-1));
  }, [reelStates]);

  const triggerSpin = useCallback((reelStates: DeckIdxCollection[]) => {
    if (!spinLock && spinTokens > 0) {
      // determine what the next line of slots will be, someday make this weighted
      setTargetSlotIdxs(reelStates.map((rs) => getRandomIdx(rs)));

      setSpinTokens(prev => prev - 1);
      setSpinCount(spinCount + 1);
      setReelResults(Array(reelStates.length).fill(-1));
      setSpinLock(true);
      setActiveCombos([]);
    }
  }, [spinCount, spinLock, spinTokens, setSpinTokens]);

  const onSpinComplete = useCallback(
    (reelIdx: number, slotIdx: number) => {
      setReelResults((prev) => prev.map((sIdx, rIdx) => (rIdx === reelIdx ? slotIdx : sIdx)));
    },
    [setReelResults]
  );

  // PULL THAT LEVER
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
        //console.log('ALL REELS ARE DONE!', reelResults, reelStates, spinCount);
        const tiles = reelResults.map((slotIdx, reelIdx) => getTileFromDeckIdx(reelStates[reelIdx][slotIdx], tileDeck));

        const activeCombos = getActiveCombos(tiles, reelCombos);
        setActiveCombos(activeCombos);
        if(activeCombos.length > 0){
          sound_combo();
        }

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
  }, [reelResults, reelStates, tileDeck, spinCount]);

  return (
    <ScWrapper className={activeCombos.length > 0 ? 'lit-up' : ''}>
      <ScDisplayContainer>
        <Display resultSet={resultSet} activeCombos={activeCombos} />
      </ScDisplayContainer>

      <ScReelContainer>
        {reelStates.map((reelState, reelIdx) => (
          <Reel
            key={`reel-${reelIdx}`}
            reelIdx={reelIdx}
            reelState={reelState}
            tileDeck={tileDeck}
            spinCount={spinCount}
            spinLock={spinLock}
            targetSlotIdx={targetSlotIdxs[reelIdx] !== undefined ? targetSlotIdxs[reelIdx] : -1}
            onSpinComplete={onSpinComplete}
          />
        ))}
      </ScReelContainer>
      <ScReelLabels>
        {resultSet.map((tile, reelIdx) => (
          tile ? (<ResultLabel key={reelIdx} tile={tile} activeCombos={activeCombos}/>) : (<EmptyResultLabel key={reelIdx} />)
        ))}
      </ScReelLabels>
      <ScHandle className={(spinLock || spinTokens <= 0) ? 'spin-disabled' : ''} onClick={() => triggerSpin(reelStates)}>
        <ScSpinHandle>
          <span>{'S P I N'}</span>
        </ScSpinHandle>
        <ScSpinTokens>{spinTokens}</ScSpinTokens>
      </ScHandle>
      <ScInfoTray>
        <InfoTray />
      </ScInfoTray>
    </ScWrapper>
  );
}

export default SlotMachine;
