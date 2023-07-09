import styled from 'styled-components';
import { useMemo } from 'react';

const ScOuter = styled.div`
  width: auto;
  height: 7rem;
  position: relative;
`;

const ScWrapper = styled.div`
  position: absolute;
  inset: 0;
  background-color: var(--color-black);
  color: var(--color-white);
  border-radius: 0.6rem;
  padding: 1rem;

  font-family: var(--font-8bit2);
  transition: background-color ease-out 0.2s, color ease-out 0.2s;

  p {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 1.2rem;
    line-height: 1.5rem;
  }

  &.winner {
    background-color: var(--color-pink);
    color: var(--color-white);
  }
`;

interface Props {
  messages: string[];
  displayType?: 'combo';
}
function Display({ messages, displayType }: Props) {
  const className = useMemo(() => {
    return displayType === 'combo' ? 'combo' : '';
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
