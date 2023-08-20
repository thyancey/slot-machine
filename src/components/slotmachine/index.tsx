import styled from 'styled-components';
import Reel from './components/reel';
import { useCallback, useEffect, useState, useContext, useMemo, useRef } from 'react';
import { defaultReelState, reelComboDef, defaultTileDeck, DeckIdxCollection } from '../../store/data';
import { AppContext } from '../../store/appcontext';
import { getBasicScore, getComboScore, getEffectDelta } from './utils';
// @ts-ignore
import useSound from 'use-sound';
import Sound from '../../assets/sounds';
import ScoreBox from './components/scorebox';
import SideControls from './components/controls-side';
import { MixinBorders } from '../../utils/styles';
import Rivets from './components/rivets';
import { trigger } from '../../utils/events';
import DisplayPanel from '../display-panel';
import { getRandomIdx } from '../../utils';

const ScWrapper = styled.div`
  text-align: center;

  display: grid;
  grid-template-columns: auto;
  grid-template-rows: min-content min-content auto;
  grid-gap: 1rem;
`;

const ScReelContainer = styled.div`
  grid-row: 2;
  grid-column: 1;

  height: 100%;
  display: flex;
  position: relative;

  padding: 1rem 1.75rem;
  background-color: var(--co-player-door);
  border-radius: 0.75rem;

  align-items: center;
  justify-content: center;

  overflow: hidden;

  > ul {
    display: flex;
  }
`;

const ScReelSegment = styled.div`
  background-color: var(--co-player-border);
  margin: 0rem 0.75rem;

  ${MixinBorders('--co-player-bordertop', '--co-player-borderside')}
  border-top: 0;

  &:first-child {
    border-right: 0;
    margin-left: 0;
  }
  &:last-child {
    border-left: 0;
    margin-right: 0;
  }
`;

const ScScoreBoxContainer = styled.div`
  grid-row: 3;
  grid-column: 1;

  position: relative;
  padding: 1rem 1.75rem;
  background-color: var(--co-player-door);
  border-radius: 0.75rem;
`;

const ScScoreBox = styled.div`
  background-color: var(--color-black);

  ${MixinBorders('--co-player-bordertop', '--co-player-borderside')}
  border-top: 0;
`;

const ScDisplay = styled.div`
  position: relative;
  grid-row: 1;
  grid-column: 1;

  padding: 1rem 1.75rem;
  background-color: var(--co-player-door);
  border-radius: 0.75rem;

  max-width: var(--var-reels-width, 100%);
`;

const ScDisplayWrapper = styled.div`
  ${MixinBorders('--co-player-bordertop', '--co-player-borderside')}
  /* border-top: 0; */
  /* border-bottom: 0; */
`;

const ScSideControls = styled.div`
  position: absolute;
  left: calc(100% + 1rem);
  top: 0;
  width: 7rem;
  height: 100%;
`;

function SlotMachine() {
  const [spinCount, setSpinCount] = useState(0);
  const [spinInProgress, setSpinInProgress] = useState(false);
  // is each reel locked? if not, they are allowed to spin when their targetIdx is updated
  const [reelLock, setReelLock] = useState<boolean[]>([]);
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
  const comboLengthRef = useRef(activeCombos.length);

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

    // TODO: move this somewhere better, when reels actually change size
    const middleRow = document.querySelector('#reels-container');
    if (middleRow) {
      // @ts-ignore
      const middleRowWidth = middleRow.offsetWidth;
      document.documentElement.style.setProperty('--var-reels-width', middleRowWidth + 'px');
    }
  }, [reelStates, setReelResults]);

  const triggerSpin = useCallback(
    (reelStates: DeckIdxCollection[], onlyThisReelIdx?: number) => {
      if (!spinInProgress && spinTokens > 0) {
        // determine what the next line of slots will be, someday make this weighted
        if (onlyThisReelIdx !== undefined) {
          setTargetSlotIdxs(
            reelStates.map((reelState, reelIdx) =>
              reelIdx === onlyThisReelIdx ? getRandomIdx(reelState) : targetSlotIdxs[reelIdx]
            )
          );
        } else {
          setTargetSlotIdxs(reelStates.map((reelState) => getRandomIdx(reelState)));
        }

        setSpinTokens((prev) => prev - 1);
        setSpinCount(spinCount + 1);
        if (onlyThisReelIdx !== undefined) {
          // all should be locked/true EXCEPT the one that we are spinnin
          setReelResults((prev) => prev.map((rR, reelIdx) => (reelIdx === onlyThisReelIdx ? -1 : rR)));
          setReelLock(reelStates.map((_, reelIdx) => reelIdx !== onlyThisReelIdx));
        } else {
          setReelResults(Array(reelStates.length).fill(-1));
          setReelLock(reelStates.map(() => false));
        }
        setSpinInProgress(true);
      }
    },
    [spinCount, spinInProgress, spinTokens, setSpinTokens, setReelResults, targetSlotIdxs]
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
        setReelLock(reelStates.map(() => true));
        setSpinInProgress(false);
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

  // TODO, centralize this somewhere else, also better state check on new player move
  const attack = useMemo(() => {
    return getEffectDelta('attack', activeTiles, activeCombos);
  }, [activeTiles, activeCombos]);
  useEffect(() => {
    if (activeCombos.length !== comboLengthRef.current) {
      comboLengthRef.current = activeCombos.length;

      if (activeCombos.length > 0) {
        const mssgs = [];
        if (attack !== 0) {
          mssgs.push(`attack with ${attack} damage`);
        }
        if (activeCombos.length > 0) {
          mssgs.push(`${activeCombos[0].label}`, `x${activeCombos[0].bonus?.multiplier} multiplier`);
        }
        trigger('playerDisplay', mssgs.join('\n'));
      }
    }
  }, [comboLengthRef, activeCombos, attack]);

  return (
    <ScWrapper>
      <ScDisplay>
        <ScDisplayWrapper>
          <DisplayPanel playerType='player' playerInfo={playerInfo} />
        </ScDisplayWrapper>
        <Rivets />
      </ScDisplay>
      <ScReelContainer id='reels-container'>
        <ul>
          {reelStates.map((reelState, reelIdx) => (
            <ScReelSegment key={reelIdx}>
              <Reel
                key={`reel-${reelIdx}`}
                reelIdx={reelIdx}
                reelState={reelState}
                tileDeck={tileDeck}
                spinCount={spinCount}
                reelLock={reelLock[reelIdx]}
                // can only single-spin this reel if there are spins left, and all reels have been spun at least once
                isEnabled={spinTokens > 0 && !reelResults.includes(-1)}
                targetSlotIdx={targetSlotIdxs[reelIdx] !== undefined ? targetSlotIdxs[reelIdx] : -1}
                onSpinComplete={onSpinComplete}
                triggerSpin={(reelIdx) => triggerSpin(reelStates, reelIdx)}
              />
            </ScReelSegment>
          ))}
        </ul>
        <Rivets />
      </ScReelContainer>
      <ScSideControls>
        <SideControls
          spinInProgress={spinInProgress}
          spinTokens={spinTokens}
          triggerSpin={() => triggerSpin(reelStates)}
        />
      </ScSideControls>
      <ScScoreBoxContainer>
        <ScScoreBox>
          <ScoreBox />
        </ScScoreBox>
        <Rivets />
      </ScScoreBoxContainer>
    </ScWrapper>
  );
}

export default SlotMachine;
