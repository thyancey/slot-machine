import { useEffect, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { PlayerInfo } from '../../store/data';
import { MixinBorders } from '../../utils/styles';
import { off, on } from '../../utils/events';
import DisplayScreen from './display-screen';

const ScDisplay = styled.div`
  background-color: var(--color-black);

  /* ${MixinBorders('--co-player-bordertop', '--co-player-borderside')} */
  border-top: 0;
  text-align:center;
`;

interface Props {
  onClick?: () => void;
  playerInfo: PlayerInfo;
  playerType: string;
}
function DisplayPanel({ onClick, playerInfo, playerType }: Props) {
  const [ message, setMessageState ] = useState('');
  const timeoutRef = useRef<number | null>(null);
  const eventId = playerType === 'player' ? 'playerDisplay' : 'enemyDisplay';

  const setMessage = useCallback(
    (text: string | undefined = '', timeout: number | undefined = 0) => {
      setMessageState(text);
      // console.log('setMessage', text, timeout);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (timeout > 0) {
        // @ts-ignore
        timeoutRef.current = setTimeout(() => {
          setMessageState('');
        }, timeout);
      }
    },
    [setMessageState]
  );
  

  const onMessageEvent = useCallback(
    (e: CustomEvent) => {
      // console.log('player.setText:', e.detail);
      setMessage(e.detail);
    },
    [setMessage]
  );

  useEffect(() => {
    on(eventId, onMessageEvent);

    return () => {
      off(eventId, onMessageEvent);
    };
  });

  return (
    <ScDisplay onClick={onClick}>
      <DisplayScreen playerInfo={playerInfo} message={message} />
    </ScDisplay>
  );
}

export default DisplayPanel;
