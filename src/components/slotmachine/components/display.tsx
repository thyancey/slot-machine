import styled from 'styled-components';
import { useMemo } from 'react';

const ScOuter = styled.div`
  width: auto;
  height: 7rem;
  position: relative;

  cursor: pointer;
  
  filter: drop-shadow(-0.2rem -0.2rem 0.2rem var(--color-black));
`;

const ScWrapper = styled.div`
  position: absolute;
  inset: 0;
  background-color: var(--color-black);
  color: var(--color-white);
  padding: 1rem;
  border-radius: 0.5rem;

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
    background-color: var(--color-grey-light);
    color: var(--color-white);
  }
`;

interface Props {
  messages: string[];
  displayType?: 'combo';
}
function Display({ messages, displayType }: Props) {
  const className = useMemo(() => {
    return displayType === 'combo' ? 'winner' : '';
  }, [displayType]);

  return (
    <ScOuter>
      <ScWrapper className={className}>
        {messages.map((m, idx) => (
          <p key={idx}>{m}</p>
        ))}
      </ScWrapper>
    </ScOuter>
  );
}

export default Display;
