import styled from 'styled-components';
import { useContext } from 'react';
import { AppContext } from '../../../store/appcontext';

const ScWrapper = styled.div`
  background-color: var(--color-grey);
  color: var(--color-white);
  border-radius: 0.6rem;
  padding: 1rem;
  height: 8rem;

  font-family: var(--font-8bit2);
  transition: background-color ease-out 0.2s, color ease-out 0.2s;

  ul,
  li,
  span,
  p {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 1.5rem;
    line-height: 1.85rem;
  }

  &.winner {
    background-color: var(--color-pink);
    color: var(--color-white);
  }
`;

function Display() {
  const { activeCombos } = useContext(AppContext);

  return (
    <ScWrapper className={activeCombos.length > 0 ? 'winner' : ''}>
      {activeCombos[0] ? (
        <ul>
          <li>{`${activeCombos[0].label}`}</li>
          <li>{`"${activeCombos[0].bonus?.bonusType}" bonus!`}</li>
          <li>{`x${activeCombos[0].bonus?.multiplier} multiplier`}</li>
        </ul>
      ) : (
        <ul>
          <li>{`spin to get points`}</li>
          <li>{`combos make you stronger`}</li>
          <li>{`click NEXT TURN to attack`}</li>
        </ul>
      )}
    </ScWrapper>
  );
}

export default Display;
