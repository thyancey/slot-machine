import styled from 'styled-components';
import Reel from './components/reel';
import { useCallback, useEffect, useState, useContext } from 'react';
import { defaultReelState, reelComboDef, defaultTileDeck, COST_UPGRADE } from '../../store/data';
import { AppContext } from '../../store/appcontext';
import { getBasicScore, getComboScore } from './utils';
// @ts-ignore
import useSound from 'use-sound';
import Sound from '../../assets/sounds';
import ScoreBox from './components/scorebox';
import { MixinBorders } from '../../utils/styles';
import Rivets from './components/rivets';
import { trigger } from '../../utils/events';
import DisplayPanel from '../display-panel';

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

  display: flex;
  gap: 1rem;
`;

const ScScoreBoxButton = styled.div`
  background-color: var(--color-black);
  /* color: var(--color-green-light); */
  color: var(--color-white-dark);

  padding: 1rem;

  transition: all 0.3s;

  ${MixinBorders('--co-player-bordertop', '--co-player-borderside')}
  border-left: 0;
  border-top: 0;

  font-size: 1.5rem;
  line-height: 1.25rem;
  white-space: pre-wrap; /* interpret /n as line breaks */
  /* max-width: 10rem; */
  text-align: right;

  padding-top: 0.75rem;
  padding-left: 1.25rem;

  p {
    opacity: 0.5;
  }

  &.active {
    background-color: var(--color-black-light);
    color: var(--color-yellow-light);
    p {
      opacity: 1;
    }
    cursor: pointer;

    &:hover {
      background-color: var(--color-grey-dark);
      color: var(--color-green-dark);
    }
  }

  > p:last-child {
    font-size: 1rem;
    font-style: italic;
    color: var(--color-red-light);
    margin-bottom: -1rem;
  }
`;

const ScScoreBox = styled.div`
  background-color: var(--color-black);

  ${MixinBorders('--co-player-bordertop', '--co-player-borderside')}
  border-top: 0;
  flex: 1;
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
`;

function SlotMachine() {
  // is each reel locked? if not, they are allowed to spin when their targetIdx is updated
  const [spinScore, setSpinScore] = useState(0);
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
    finishSpinTurn,
    playerInfo,
    setUiState,
    setSpinInProgress,
    targetSlotIdxs,
    reelLock,
    setReelLock,
    triggerSpin,
    spinCount,
    playerAttack,
    score,
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

    // TODO: move this somewhere better, when reels actually change size
    const middleRow = document.querySelector('#reels-container');
    if (middleRow) {
      // @ts-ignore
      const middleRowWidth = middleRow.offsetWidth;
      document.documentElement.style.setProperty('--var-reels-width', middleRowWidth + 'px');
    }
  }, [reelStates, setReelResults]);

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
  }, [reelResults, reelStates, spinCount, sound_reelComplete, setReelLock, finishSpinTurn, setSpinInProgress]);

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

  useEffect(() => {
    if (playerAttack && playerAttack.attack > 0 && playerAttack.defense > 0) {
      const mssgs = ['*ATTACK READY*'];

      if (playerAttack.attack > 0) {
        mssgs.push(`+${playerAttack.attack} DAMAGE`);
      }
      if (playerAttack.defense > 0) {
        mssgs.push(`+${playerAttack.defense} DEFENSE`);
      }

      // if (activeCombos.length > 0) {
      //   mssgs.push(`${activeCombos[0].label}`, `x${activeCombos[0].bonus?.multiplier} multiplier`);
      // }
      trigger('playerDisplay', mssgs);
    }
  }, [playerAttack]);

  const onBuyUpgrade = () => {
    setUiState('editor');
    incrementScore(-COST_UPGRADE);
  };

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
                isEnabled={!reelResults.includes(-1)}
                targetSlotIdx={targetSlotIdxs[reelIdx] !== undefined ? targetSlotIdxs[reelIdx] : -1}
                onSpinComplete={onSpinComplete}
                triggerSpin={(reelIdx) => triggerSpin(reelIdx)}
              />
            </ScReelSegment>
          ))}
        </ul>
        <Rivets />
      </ScReelContainer>

      <ScScoreBoxContainer>
        <ScScoreBox>
          <ScoreBox />
        </ScScoreBox>
        <ScScoreBoxButton
          className={score >= COST_UPGRADE ? 'active' : 'disabled'}
          onClick={() => (score > COST_UPGRADE ? onBuyUpgrade() : {})}
        >
          <p>{`UPGRADE`}</p>
          <p>{`-$${COST_UPGRADE}`}</p>
        </ScScoreBoxButton>
        <Rivets />
      </ScScoreBoxContainer>
    </ScWrapper>
  );
}

export default SlotMachine;
