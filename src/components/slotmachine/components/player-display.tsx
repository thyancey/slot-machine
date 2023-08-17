import { useContext, useMemo, useEffect, useCallback } from 'react';
import { AppContext } from '../../../store/appcontext';
import Display from './new-display';
import styled from 'styled-components';
import { getEffectDelta } from '../utils';
import { PlayerInfo, TRANSITION_DELAY } from '../../../store/data';
import { MixinBorders } from '../../../utils/styles';
import { UiContext } from '../../../store/uicontext';
import { off, on } from '../../../utils/events';

const ScDisplay = styled.div`
  background-color: var(--color-black);

  ${MixinBorders('--co-player-bordertop', '--co-player-borderside')}
  border-top: 0;
`;

interface Props {
  onClick?: () => void;
  playerInfo: PlayerInfo;
}
function PlayerDisplay({ onClick, playerInfo }: Props) {
  const { activeCombos, activeTiles } = useContext(AppContext);
  const { playerText, setPlayerText } = useContext(UiContext);

  const setText = useCallback(
    (e: CustomEvent) => {
      console.log('setText', e.detail);
      if (Array.isArray(e.detail)) {
        setPlayerText(e.detail[0], e.detail[1]);
      } else {
        setPlayerText(e.detail, TRANSITION_DELAY);
      }
    },
    [setPlayerText]
  );

  useEffect(() => {
    on('playerDisplay', setText);

    return () => {
      off('playerDisplay', setText);
    };
  });

  const attack = useMemo(() => {
    return getEffectDelta('attack', activeTiles, activeCombos);
  }, [activeTiles, activeCombos]);

  const messages = useMemo(() => {
    if (playerText) {
      return [playerText];
    }
    const mssgs = [];
    if (attack !== 0) {
      mssgs.push(`attack with ${attack} damage`);
    }
    if (activeCombos.length > 0) {
      mssgs.push(`${activeCombos[0].label}`, `x${activeCombos[0].bonus?.multiplier} multiplier`);
    }

    return mssgs.length > 0 ? mssgs : [];
  }, [activeCombos, playerText, attack]);

  return (
    <ScDisplay onClick={onClick}>
      <Display
        playerInfo={playerInfo}
        messages={messages}
        displayType={activeCombos.length > 0 ? 'combo' : undefined}
      />
    </ScDisplay>
  );
}

export default PlayerDisplay;
