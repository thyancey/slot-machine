import styled from 'styled-components';
import { useMemo } from 'react';
import { PlayerInfo } from '../../../store/data';
import HealthBar from '../../entities/healthbar';

const ScOuter = styled.div`
  width: auto;
  height: 10rem;
  position: relative;

  display: flex;
  flex-direction:column;

  cursor: pointer;
`;

const ScMessages = styled.div`
  flex: 1;

  background-color: var(--color-black);
  color: var(--color-white);
  padding: 1rem;

  font-family: var(--font-8bit2);
  transition: background-color ease-out 0.2s, color ease-out 0.2s;

  p {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 1.5rem;
    line-height: 1.5rem;
  }
  &.winner {
    background-color: var(--color-black-light);
    color: var(--color-white);
  }
`;

const ScHealthBar = styled.div`
  height: 3rem;
  padding: 1rem;

  position: relative;
`

interface Props {
  messages: string[];
  playerInfo: PlayerInfo;
  displayType?: 'combo';
}
function Display({ messages, displayType, playerInfo }: Props) {
  const className = useMemo(() => {
    return displayType === 'combo' ? 'winner' : '';
  }, [displayType]);

  return (
    <ScOuter>
      <ScMessages className={className}>
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
