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
  const [ messageStates, setMessageStates ] = useState<string[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const eventId = playerType === 'player' ? 'playerDisplay' : 'enemyDisplay';

  const setMessage = useCallback(
    (messages: string[] | undefined = [], timeout: number | undefined = 0) => {
      setMessageStates(messages || []);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (timeout > 0) {
        // @ts-ignore
        timeoutRef.current = setTimeout(() => {
          setMessageStates([]);
        }, timeout);
      }
    },
    [setMessageStates]
  );
  
  const onMessageEvent = useCallback(
    (e: CustomEvent) => {
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
      <DisplayScreen playerInfo={playerInfo} messages={messageStates} />
    </ScDisplay>
  );
}

export default DisplayPanel;
