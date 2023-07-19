import styled from 'styled-components';
import SlotMachine from '../slotmachine';
import { useContext } from 'react';
import { AppContext } from '../../store/appcontext';
import Enemy from './enemy';

const ScCard = styled.div`
  position: relative;
  padding: 1rem 1rem 2.25rem 1rem;

  filter: drop-shadow(0.5rem 0.7rem 0 var(--color-grey-light)) drop-shadow(0.5rem 0.7rem 0 var(--color-grey-light))
    drop-shadow(0.25rem 0.25rem 0.5rem var(--color-black));
  
  border-radius: 1.5rem;

  background-color: var(--color-white);

  display: flex;
  flex-direction: column;
  gap: 2rem;

  &.lit-up {
    /* border: 0.75rem solid var(--color-pink); */
    background-color: var(--color-cyan);
    filter: drop-shadow(0.5rem 0.7rem 0 var(--color-blue)) drop-shadow(0.5rem 0.7rem 0 var(--color-blue))
      drop-shadow(0.25rem 0.25rem 0.5rem var(--color-black));
  }
`;

const ScEnemy = styled.div`
  background-color: var(--color-pink);
  border-radius: 0.5rem;
  border-left: 1.1rem solid var(--color-grey-light);
  border-top: 1.1rem solid var(--color-grey);
`;

const ScPlayer = styled.div`
  position: relative;
  
  background-color: var(--color-blue);
  border-radius: 0.5rem;
  border-left: 1.1rem solid var(--color-grey-light);
  border-top: 1.1rem solid var(--color-grey);
  padding: 1rem;
`;

export const Player = () => {
  const { activeCombos } = useContext(AppContext);

  return (
    <ScCard id='player' className={activeCombos.length > 0 ? 'lit-up' : ''}>
      <ScEnemy>
        <Enemy />
      </ScEnemy>
      <ScPlayer>
        <SlotMachine />
      </ScPlayer>
    </ScCard>
  );
};

export default Player;
