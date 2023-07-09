import styled from 'styled-components';
import { useContext } from 'react';
import { AppContext } from '../../../store/appcontext';

const ScOuter = styled.div`
  width: auto;
  height: 5rem;
  position: relative;
  margin-bottom: 0.5rem;
`;

const ScWrapper = styled.div`
  position: absolute;
  inset: 0;
  background-color: var(--color-grey);
  color: var(--color-white);
  border-radius: 0.6rem;
  padding: 1rem;

  font-family: var(--font-8bit2);
  transition: background-color ease-out 0.2s, color ease-out 0.2s;

  span {
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

function Display() {
  const { activeCombos } = useContext(AppContext);

  return (
    <ScOuter>
      <ScWrapper className={activeCombos.length > 0 ? 'winner' : ''}>
        {activeCombos[0] ? (
          <ul>
            <li>{`${activeCombos[0].label}`}</li>
            {/* <li>{`"${activeCombos[0].bonus?.bonusType}" bonus!`}</li> */}
            <li>{`x${activeCombos[0].bonus?.multiplier} multiplier`}</li>
          </ul>
        ) : (
          <span>{`Do 13 damage, add 6 block for each reel in your hand`}</span>
        )}
      </ScWrapper>
    </ScOuter>
  );
}

export default Display;
