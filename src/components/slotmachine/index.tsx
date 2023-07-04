import styled from 'styled-components';
import Reel from './components/reel';
import { useCallback, useEffect, useState, useContext, useMemo } from 'react';
import { defaultReelState, reelComboDef, defaultTileDeck, DeckIdxCollection } from '../../store/data';
import { BasicLabel, EmptyResultLabel } from './components/result-label';
import { AppContext } from '../../store/appcontext';
import { getBasicScore, getComboScore, getRandomIdx } from './utils';
import { getTileFromDeckIdx } from '../../store/utils';
// @ts-ignore
import useSound from 'use-sound';
import Sound from '../../assets/sounds';
import Controls from './components/controls';
import Display from './components/display';

const ScWrapper = styled.div`
  padding: 1rem;

  filter: var(--filter-shadow2);

  &.no-display {
    grid-template-rows: auto 4rem;
  }

  border-radius: 1.5rem;
  border: 0.75rem solid var(--color-purple);

  background-color: var(--color-white);
  text-align: center;

  border-radius: 1.5rem;

  &.lit-up {
    border: 0.75rem solid var(--color-pink);
    background-color: var(--color-yellow);
  }
`;

const ScReelContainer = styled.div`
  background-color: var(--color-grey);
  height: 100%;
  display: flex;
  padding: 0.5rem;
  border-radius: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;

  > div {
    margin: 0rem 0.5rem;
  }
`;

const ScReelLabels = styled.div`
  height: 3.25rem;

  > div {
    position: absolute;
    display: flex;
    justify-content: center;
  }
`;

function SlotMachine() {
  const [spinCount, setSpinCount] = useState(0);
  const [spinLock, setSpinLock] = useState(false);
  const [spinScore, setSpinScore] = useState(0);
  const [targetSlotIdxs, setTargetSlotIdxs] = useState<number[]>([]);
  const {
    setReelCombos,
    activeTiles,
    activeCombos,
    reelResults,
    setReelResults,
    setReelStates,
    reelStates,
    setTileDeck,
    setDeckState,
    tileDeck,
    incrementScore,
    spinTokens,
    setSpinTokens,
  } = useContext(AppContext);

  const [sound_reelComplete] = useSound(Sound.beep, {
    playbackRate: 0.3 + reelResults.filter((r) => r !== -1).length * 0.3,
  });
  const [sound_lever] = useSound(Sound.alarm, { volume: 0.2, playbackRate: 0.1, loop: false });
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
  }, [setDeckState, setReelStates, setTileDeck, setReelCombos]);

  useEffect(() => {
    setReelResults(Array(reelStates.length).fill(-1));
  }, [reelStates, setReelResults]);

  const triggerSpin = useCallback(
    (reelStates: DeckIdxCollection[]) => {
      if (!spinLock && spinTokens > 0) {
        // determine what the next line of slots will be, someday make this weighted
        setTargetSlotIdxs(reelStates.map((rs) => getRandomIdx(rs)));

        setSpinTokens((prev) => prev - 1);
        setSpinCount(spinCount + 1);
        setReelResults(Array(reelStates.length).fill(-1));
        setSpinLock(true);
      }
    },
    [spinCount, spinLock, spinTokens, setSpinTokens, setReelResults]
  );

  const onSpinComplete = useCallback(
    (reelIdx: number, slotIdx: number) => {
      setReelResults((prev) => prev.map((sIdx, rIdx) => (rIdx === reelIdx ? slotIdx : sIdx)));
    },
    [setReelResults]
  );

  // PULL THAT LEVER
  useEffect(() => {
    if (spinCount > 0) sound_lever();
  }, [spinCount, sound_lever]);

  // events when the reels are done spinning. this could probably be simplified and moved to a custom hook
  useEffect(() => {
    if (
      // if we're spinnin and have at least one reel completed
      spinCount > 0 &&
      reelResults.length > 0
    ) {
      if (reelResults.length === reelStates.length && !reelResults.includes(-1)) {
        // all reels are done spinning, check for points
        sound_reelComplete();
        setSpinLock(false);
      } else if (
        // one reel is done spinning, this doesnt always hit for some reason

        // at least one reel lands, this prevents a misfire earlier on
        reelResults.findIndex((r) => r > -1) > -1
      ) {
        sound_reelComplete();
      }
      // otherwise stuff like a reel is spinning, etc
    }
  }, [reelResults, reelStates, spinCount, sound_reelComplete]);

  useEffect(() => {
    if (activeCombos.length > 0) {
      sound_combo();
    }

    const comboScore = getComboScore(activeTiles, activeCombos);
    if (comboScore !== 0) {
      // apply BONUSES
      setSpinScore(comboScore);
    } else {
      // just add up the raw scores then
      setSpinScore(getBasicScore(activeTiles));
    }
  }, [activeCombos, activeTiles, sound_combo, setSpinScore]);

  useEffect(() => {
    incrementScore(spinScore);
  }, [spinScore, incrementScore]);

  const resultSet = useMemo(() => {
    if (spinCount === 0 || reelStates.length === 0 || reelResults.length === 0) {
      // wheel is not done spinning yet. (or hasnt loaded, or hasnt done first spin)
      return [];
    }
    return reelResults.map((slotIdx, reelIdx) => {
      // the undefined check avoids a bug when deleting a reel in the editor
      // while reelResults are populated
      if (slotIdx === -1 || reelStates[reelIdx] === undefined) return undefined;
      const deckIdx = reelStates[reelIdx][slotIdx];
      return getTileFromDeckIdx(deckIdx, tileDeck);
    });
  }, [reelResults, reelStates, tileDeck, spinCount]);

  return (
    <ScWrapper className={activeCombos.length > 0 ? 'lit-up no-display' : 'no-display'}>
      <Display />
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
        <div>
          {resultSet.map((tile, reelIdx) =>
            tile ? <BasicLabel key={reelIdx} label={`$${tile.score || 0}`} /> : <EmptyResultLabel key={reelIdx} />
          )}
          {spinScore > 0 && <BasicLabel isSpecial={true} key='total' label={`$${spinScore}`} />}
        </div>
      </ScReelLabels>
      <Controls spinLock={spinLock} spinTokens={spinTokens} triggerSpin={() => triggerSpin(reelStates)} />
    </ScWrapper>
  );
}

export default SlotMachine;
