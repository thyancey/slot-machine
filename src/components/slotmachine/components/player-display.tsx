import { useContext, useMemo, useEffect, useCallback, useRef } from 'react';
import { AppContext } from '../../../store/appcontext';
import Display from './display';
import styled from 'styled-components';
import { getEffectDelta } from '../utils';
import { PlayerInfo } from '../../../store/data';
import { MixinBorders } from '../../../utils/styles';
import { UiContext } from '../../../store/uicontext';
import { off, on } from '../../../utils/events';

const DEFAULT_TEXT = 'SPIN TO WIN!';

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
  const { activeCombos, activeTiles, gameState } = useContext(AppContext);
  const { playerText, setPlayerText } = useContext(UiContext);
  const comboLengthRef = useRef(activeCombos.length);

  const setText = useCallback(
    (e: CustomEvent) => {
      // console.log('player.setText:', e.detail);
      setPlayerText(e.detail);
    },
    [setPlayerText]
  );

  useEffect(() => {
    on('playerDisplay', setText);

    return () => {
      off('playerDisplay', setText);
    };
  });

  useEffect(() => {
    if (gameState === 'NEW_TURN') {
      console.log('set that player text to nothin!');
      setPlayerText();
    }
  }, [gameState, setPlayerText]);

  const attack = useMemo(() => {
    return getEffectDelta('attack', activeTiles, activeCombos);
  }, [activeTiles, activeCombos]);

  const message = playerText || DEFAULT_TEXT;

  // TODO, centralize this somewhere else, also better state check on new player move
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
        setPlayerText(mssgs.join('\n'));
      }
    }
  }, [comboLengthRef, activeCombos, setPlayerText, attack]);

  return (
    <ScDisplay onClick={onClick}>
      <Display playerInfo={playerInfo} message={message} displayType={activeCombos.length > 0 ? 'combo' : undefined} />
    </ScDisplay>
  );
}

export default PlayerDisplay;
