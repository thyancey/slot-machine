import styled from 'styled-components';
import SlotMachine from '../slotmachine';
import { useContext } from 'react';
import { AppContext } from '../../store/appcontext';
import Enemy from './enemy';

const ScCard = styled.div`
  position: relative;

  box-shadow: 0 0 1rem .5rem var(--color-slate-light);
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0rem;

  &.lit-up {
    box-shadow: 0 0 0.25rem 0.25rem var(--color-brown-dark);
  }
`;

const ScShadowDiv = styled.div`
  position: absolute;
  z-index: -1;
  inset: 0;
  border-radius: 1rem;
`;
const ScEnemy = styled.div`
  background-color: var(--color-enemy);
  border-radius: 1rem 1rem 0 0;
  padding: 1rem;

  position: relative;

  .lit-up & {
    ${ScShadowDiv} {
      box-shadow: 0 0 3rem 2rem var(--color-pink);
    }
  }
`;

const ScPlayer = styled.div`
  position: relative;
  padding: 2rem;
  padding-top: 2rem;
  border-top: 0.25rem dashed var(--color-enemy);

  background-color: var(--color-player);
  border-radius: 0 0 1rem 1rem;

  .lit-up & {
    ${ScShadowDiv} {
      box-shadow: 0 0 3rem 1rem var(--color-blue);
    }
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
