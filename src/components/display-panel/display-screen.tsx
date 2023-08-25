import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PlayerInfo } from '../../store/data';
import HealthBar from './healthbar';

const FLASH_DURATION = 200;

const ScOuter = styled.div`
  width: auto;
  min-height: 10rem;
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

  overflow-y: auto; /* hopefully this will never be needed... */

  p {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 1.5rem;
    line-height: 1.5rem;
    white-space: pre-wrap; /* interpret /n as line breaks */
    &.special {
      color: var(--color-yellow);
    }
  }
`;

const ScHealthBar = styled.div`
  height: 3rem;
  padding: 1rem;

  position: relative;
`;

const isSpecial = (string: string) => {
  const regex = /\*[^*]+\*/g;
  return regex.test(string);
};

const betweenAsterisks = (string: string) =>  {
  const regex = /^\*(.*?)\*$/;
  const match = string.match(regex);
  
  if (match) {
    return match[1]; // Extracted text is captured in the first group
  } else {
    return string; // No text between asterisks found
  }
}

interface Props {
  messages: string[];
  playerInfo: PlayerInfo;
}
function DisplayScreen({ messages, playerInfo }: Props) {
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
    // no need to flash when clearing a message
    if (messages.length !== 0) {
      // if this gets noisy, compare ref of messages
      setHighlightPlease();
    }
  }, [messages, setHighlightPlease]);

  const fancyMessages = useMemo(() => {
    return messages.map((m) => {
      if (isSpecial(m)) {
        return [betweenAsterisks(m), 'special'];
      } else {
        return [m, ''];
      }
    });
  }, [messages]);

  return (
    <ScOuter className={className}>
      <ScMessages>
        {fancyMessages.map((m, i) => (
          <p key={i} className={m[1]}>
            {m[0]}
          </p>
        ))}
      </ScMessages>
      <ScHealthBar>
        <HealthBar hp={playerInfo.hp} hpMax={playerInfo.hpMax} defense={playerInfo.defense} buffs={[]} />
      </ScHealthBar>
    </ScOuter>
  );
}

export default DisplayScreen;
