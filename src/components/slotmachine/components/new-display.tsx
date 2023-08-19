import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PlayerInfo } from '../../../store/data';
import HealthBar from '../../entities/healthbar';

const ScOuter = styled.div`
  width: auto;
  height: 10rem;
  position: relative;

  display: flex;
  flex-direction: column;

  transition: background-color ease-out 0.3s, color ease-out 0.3s;
  background-color: var(--color-black);
  color: var(--color-white);

  &.winner {
    background-color: var(--color-grey-dark);
    color: var(--color-white);
  }
`;

const ScMessages = styled.div`
  flex: 1;
  padding: 1rem;
  font-family: var(--font-8bit2);

  p {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 1.5rem;
    line-height: 1.5rem;
  }
`;

const ScHealthBar = styled.div`
  height: 3rem;
  padding: 1rem;

  position: relative;
`;

interface Props {
  messages: string[];
  playerInfo: PlayerInfo;
  displayType?: 'combo';
}
function Display({ messages, displayType, playerInfo }: Props) {
  const [highlighted, setHighlighted] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // const className = useMemo(() => {
  //   return displayType === 'combo' ? 'winner' : '';
  // }, [displayType]);

  // const className = useMemo(() => {
  //   if(highlighted) return 'winner';
  //   return displayType === 'combo' ? 'winner' : '';
  // }, [ displayType, highlighted]);

  const className = useMemo(() => {
    return highlighted ? 'winner' : '';
  }, [highlighted]);

  const setHighlightPlease = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHighlighted(true);
    // @ts-ignore
    timeoutRef.current = setTimeout(() => {
      setHighlighted(false);
    }, 1000);
  }, [setHighlighted]);

  useEffect(() => {
    setHighlightPlease();
  }, [messages, setHighlightPlease]);

  return (
    <ScOuter className={className}>
      <ScMessages>
        {messages.map((m, idx) => (
          <p key={idx}>{m}</p>
        ))}
      </ScMessages>
      <ScHealthBar>
        <HealthBar hp={playerInfo.hp} hpMax={playerInfo.hpMax} defense={playerInfo.defense} buffs={[]} />
      </ScHealthBar>
    </ScOuter>
  );
}

export default Display;
