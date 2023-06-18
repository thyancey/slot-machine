import styled from 'styled-components';
import Reel from './components/reel';
import { useCallback, useEffect, useState, useContext, useMemo } from 'react';
import { ReelItem, reelsData, reelComboDef, ReelCombo, ReelComboResult, reelItemDef } from './data';
import ResultLabel from './components/result-label';
import Display from './components/display';
import { ReelTarget, getActiveCombos, getComboScore, getRandom2dIdxs } from './utils';
import { AppContext } from '../../store/appcontext';
import UpgradeTray from './components/upgradetray';

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
  const [reelTargets, setReelTargets] = useState<ReelTarget[]>([]);
  const [curReelItems, setCurReelItems] = useState<(ReelItem | undefined)[]>([]);
  const [spinCount, setSpinCount] = useState(0);
  const [spinLock, setSpinLock] = useState(false);
  const [reelCombos, setReelCombos] = useState<ReelCombo[]>([]);
  const [activeCombos, setActiveCombos] = useState<ReelComboResult[]>([]);
  const { incrementScore, setReelStates, reelStates } = useContext(AppContext);

  useEffect(() => {
    setReelCombos(reelComboDef.map((reelCombo) => reelCombo));
    // only used for INITIALIZING state, after that reelState should be used.
    setReelStates(
      reelsData.map((reel) => ({
        items: reel.reelItems.map((r) => r.label),
      }))
    );
  }, []);

  useEffect(() => {
    setReelTargets(Array(reelStates.length).fill([-1, 0]));
    setCurReelItems(Array(reelStates.length).fill(undefined));
  }, [reelStates]);

  const triggerSpin = useCallback(() => {
    if (!spinLock) {
      const randomReelPositions = getRandom2dIdxs(reelStates.map((rs) => rs.items.map((r) => r)));
      setReelTargets(randomReelPositions.map((r) => [r, spinCount]));

      setSpinCount(spinCount + 1);
      setSpinLock(true);
      setActiveCombos([]);
    }
  }, [spinCount, spinLock, reelStates]);

  const onCurReelItem = useCallback(
    (reelItem: ReelItem, reelIdx: number) => {
      // this mutation was the only way to get this working reliably...
      curReelItems[reelIdx] = reelItem;
      setCurReelItems([...curReelItems]);

      // if no undefined reelItems, all reelItems are done spinning.
      if (curReelItems.filter((rI) => rI === undefined).length === 0) {
        // setActiveCombos
        // @ts-ignore curReelItems doesnt have any undefined values!
        const activeCombos = getActiveCombos(curReelItems, reelCombos);
        setActiveCombos(activeCombos);

        const comboScore = getComboScore(curReelItems as ReelItem[], activeCombos);
        if (comboScore !== 0) {
          incrementScore(comboScore);
        }
        setSpinLock(false);
      }
    },
    [setCurReelItems, curReelItems, setSpinLock, reelCombos]
  );

  const realReelItems = useMemo(() => {
    return reelStates.map((reelState) =>
      reelState.items.map((rI) => reelItemDef[rI])
    );
  }, [reelStates]);

  return (
    <ScWrapper>
      <ScDisplayContainer>
        []
        <Display reelCombos={reelCombos} activeCombos={activeCombos} numReels={reelStates.length} />
      </ScDisplayContainer>

      <ScReelContainer>
        {realReelItems.map((reelItems, rdIdx) => (
          <Reel
            key={`reel-${rdIdx}`}
            reelIdx={rdIdx}
            reelItems={reelItems}
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
