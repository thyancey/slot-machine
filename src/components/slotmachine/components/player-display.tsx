import { useContext, useMemo } from 'react';
import { AppContext } from '../../../store/appcontext';
import Display from './new-display';
import styled from 'styled-components';
import { getEffectDelta } from '../utils';
import { PlayerInfo } from '../../../store/data';
import { MixinBorders } from '../../../utils/styles';
import { UiContext } from '../../../store/uicontext';

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
  const { playerText } = useContext(UiContext);

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

    return mssgs.length > 0 ? mssgs : ['SPIN TO WIN'];
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
