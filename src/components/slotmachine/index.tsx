import styled from 'styled-components';
import Reel from './components/reel';
import { useCallback, useEffect, useState, useContext } from 'react';
import { defaultReelState, reelComboDef, defaultTileDeck, DeckIdxCollection } from '../../store/data';
import { AppContext } from '../../store/appcontext';
import { getBasicScore, getComboScore, getRandomIdx } from './utils';
// import { getTileFromDeckIdx } from '../../store/utils';
// @ts-ignore
import useSound from 'use-sound';
import Sound from '../../assets/sounds';
import PlayerDisplay from './components/player-display';
import ScoreBox from '../scorebox';
import SideControls from './components/controls-side';
import HealthBar from '../entities/healthbar';

const ScWrapper = styled.div`
  text-align: center;

  display: grid;
  grid-template-columns: auto min-content;
  grid-template-rows: auto min-content min-content 3rem;
  grid-gap: 1rem;
`;

const ScReelContainer = styled.div`
  grid-row: 2;
  grid-column: 1;

  background-color: var(--color-brown-ligher);
  height: 100%;
  display: flex;
  padding: 0.5rem 0rem 0.75rem 0rem;

  align-items: center;
  justify-content: center;

  overflow: hidden;
`;

const ScReelSegment = styled.div`
  background-color: var(--color-brown);
  margin: 0rem 0.5rem;

  border-top: var(--val-depth) solid var(--color-player-bordertop);
  border-left: var(--val-depth) solid var(--color-player-borderside);
  border-right: var(--val-depth) solid var(--color-player-borderside);
  border-bottom: var(--val-depth) solid var(--color-player-bordertop);

  &:first-child {
    border-top: var(--val-depth) solid var(--color-player-bordertop);
    border-left: var(--val-depth) solid var(--color-player-borderside);
    border-right: 0;
    margin-left: 0;
  }
  &:last-child {
    border-top: var(--val-depth) solid var(--color-player-bordertop);
    border-left: 0;
    border-right: var(--val-depth) solid var(--color-player-borderside);
    margin-right: 0;
  }
`;

// const ScReelLabels = styled.div`
//   height: 3.25rem;

//   > div {
//     position: absolute;
//     display: flex;
//     justify-content: center;
//   }
// `;

const ScScoreBox = styled.div`
  grid-row: 1;
  grid-column: 1;

  background-color: var(--color-purple);
  
  border-top: var(--val-depth) solid var(--color-player-bordertop);
  border-left: var(--val-depth) solid var(--color-player-borderside);
  border-right: var(--val-depth) solid var(--color-player-borderside);
  /* border-bottom: var(--val-depth) solid var(--color-player-bordertop); */
`;

const ScDisplay = styled.div`
  grid-row: 3;
  grid-column: 1;
`;

const ScSideControls = styled.div`
  width: 7rem;
  height: 100%;
  /* background-color: var(--color-yellow); */
  grid-column: 2;
  grid-row: 1 / 5;
`;

const ScHealthBar = styled.div`
  grid-row: 4;
  grid-column: 1;
  position: relative;
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
    finishSpinTurn,
    playerInfo,
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
        finishSpinTurn();
      } else if (
        // one reel is done spinning, this doesnt always hit for some reason

        // at least one reel lands, this prevents a misfire earlier on
        reelResults.findIndex((r) => r > -1) > -1
      ) {
        sound_reelComplete();
      }
      // otherwise stuff like a reel is spinning, etc
    }
  }, [reelResults, reelStates, spinCount, sound_reelComplete, finishSpinTurn]);

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

  // const resultSet = useMemo(() => {
  //   if (spinCount === 0 || reelStates.length === 0 || reelResults.length === 0) {
  //     // wheel is not done spinning yet. (or hasnt loaded, or hasnt done first spin)
  //     return [];
  //   }
  //   return reelResults.map((slotIdx, reelIdx) => {
  //     // the undefined check avoids a bug when deleting a reel in the editor
  //     // while reelResults are populated
  //     if (slotIdx === -1 || reelStates[reelIdx] === undefined) return undefined;
  //     const deckIdx = reelStates[reelIdx][slotIdx];
  //     return getTileFromDeckIdx(deckIdx, tileDeck);
  //   });
  // }, [reelResults, reelStates, tileDeck, spinCount]);

  return (
    <ScWrapper>
      <ScScoreBox>
        <ScoreBox />
      </ScScoreBox>
      <ScReelContainer>
        {reelStates.map((reelState, reelIdx) => (
          <ScReelSegment key={reelIdx}>
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
          </ScReelSegment>
        ))}
      </ScReelContainer>
      <ScDisplay>
        <PlayerDisplay onClick={() => triggerSpin(reelStates)} />
      </ScDisplay>
      <ScSideControls>
        <SideControls spinLock={spinLock} spinTokens={spinTokens} triggerSpin={() => triggerSpin(reelStates)} />
      </ScSideControls>

      <ScHealthBar>
        <HealthBar hp={playerInfo.hp} hpMax={playerInfo.hpMax} defense={playerInfo.defense} buffs={[]} />
      </ScHealthBar>
    </ScWrapper>
  );
}

export default SlotMachine;
