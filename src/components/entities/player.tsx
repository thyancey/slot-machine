import styled from 'styled-components';
import SlotMachine from '../slotmachine';
import { useContext } from 'react';
import { AppContext } from '../../store/appcontext';
import Enemy from './enemy';

const ScCard = styled.div`
  position: relative;

  /* filter: drop-shadow(0.5rem 0.7rem 0 var(--color-grey-light)) drop-shadow(0.5rem 0.7rem 0 var(--color-grey-light)) */
    /* drop-shadow(0.25rem 0.25rem 0.5rem var(--color-black)); */

  box-shadow: 0 0 .25rem .25rem var(--color-grey-light);
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0rem;

  &.lit-up {
    /* border: 0.75rem solid var(--color-pink); */
    background-color: var(--color-cyan);
    filter: drop-shadow(0.5rem 0.7rem 0 var(--color-blue)) drop-shadow(0.5rem 0.7rem 0 var(--color-blue))
      drop-shadow(0.25rem 0.25rem 0.5rem var(--color-black));
  }
`;

const ScShadowDiv = styled.div`
  position:absolute;
  z-index: -1;
  inset:0;
  border-radius: 1rem;
`
const ScEnemy = styled.div`
  background-color: var(--color-pink);
  border-radius: 1rem 1rem 0 0;
  padding-bottom: 1rem;
  /* border-left: 1.1rem solid var(--color-grey-light); */
  /* border-top: 1.1rem solid var(--color-grey); */

  position: relative;

  ${ScShadowDiv}{
    box-shadow: 0 0 3rem 2rem var(--color-pink);
  }
`;

const ScPlayer = styled.div`
  position: relative;
  padding: 1rem;
  padding-top: 2rem;
  border-top: 0.25rem solid var(--color-grey-light);

  background-color: var(--color-blue);
  border-radius: 0 0 1rem 1rem;
  /* border-left: 1.1rem solid var(--color-grey-light); */
  /* border-top: 1.1rem solid var(--color-grey); */
  
  ${ScShadowDiv}{
    box-shadow: 0 0 3rem 1rem var(--color-blue);
  }
`;

export const Player = () => {
  const { activeCombos } = useContext(AppContext);

  return (
    <ScCard id='player' className={activeCombos.length > 0 ? 'lit-up' : ''}>
      <ScEnemy>
        <Enemy />
        <ScShadowDiv />
      </ScEnemy>
      <ScPlayer>
        <SlotMachine />
        <ScShadowDiv />
      </ScPlayer>
    </ScCard>
  );
};

export default Player;
