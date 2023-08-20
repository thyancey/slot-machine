import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PlayerInfo } from '../../store/data';
import HealthBar from './healthbar';

const FLASH_DURATION = 200;

const ScOuter = styled.div`
  width: auto;
  height: 10rem;
  position: relative;

  display: flex;
  flex-direction: column;

  background-color: var(--color-black-dark);
  color: var(--color-white);
  transition: background-color ease-in 0.5s;

  &.highlighted {
    background-color: var(--color-grey-dark);
    transition: background-color ease-out 0.2s;
  }
`;

const ScMessages = styled.div`
  flex: 1;
  padding: 1rem;
  font-family: var(--font-8bit2);

  overflow-y:auto; /* hopefully this will never be needed... */

  p {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 1.5rem;
    line-height: 1.5rem;
    white-space: pre-wrap; /* interpret /n as line breaks */
  }
`;

const ScHealthBar = styled.div`
  height: 3rem;
  padding: 1rem;

  position: relative;
`;

interface Props {
  message: string;
  playerInfo: PlayerInfo;
}
function DisplayScreen({ message, playerInfo }: Props) {
  const [highlighted, setHighlighted] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const className = useMemo(() => {
    return highlighted ? 'highlighted' : '';
  }, [highlighted]);

  const setHighlightPlease = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHighlighted(true);
    // @ts-ignore
    timeoutRef.current = setTimeout(() => {
      setHighlighted(false);
    }, FLASH_DURATION);
  }, [setHighlighted]);

  useEffect(() => {
    setHighlightPlease();
  }, [message, setHighlightPlease]);

  return (
    <ScOuter className={className}>
      <ScMessages>
        <p>{message}</p>
      </ScMessages>
      <ScHealthBar>
        <HealthBar hp={playerInfo.hp} hpMax={playerInfo.hpMax} defense={playerInfo.defense} buffs={[]} />
      </ScHealthBar>
    </ScOuter>
  );
}

export default DisplayScreen;
