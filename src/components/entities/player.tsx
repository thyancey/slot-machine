import styled from 'styled-components';
import SlotMachine from '../slotmachine';
import { useContext } from 'react';
import { AppContext } from '../../store/appcontext';
import Enemy from './enemy';

const ScCard = styled.div`
  position: relative;

  /* box-shadow: 0 0 1rem .5rem var(--color-grey); */
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0rem;

  &.lit-up {
    box-shadow: 0 0 0.25rem 0.25rem var(--co-player);
  }
`;

const ScShadowDiv = styled.div`
  position: absolute;
  z-index: -1;
  inset: 0;
  border-radius: 1rem;
`;
const ScEnemy = styled.div`
  background-color: var(--co-enemy);
  border-radius: 1rem 1rem 0 0;
  padding: 1rem;

  position: relative;

  .lit-up & {
    ${ScShadowDiv} {
      box-shadow: 0 0 3rem 2rem var(--co-enemy-highlight);
    }
  }
`;

const ScPlayer = styled.div`
  position: relative;
  padding: 2rem;
  padding-top: 2rem;
  border-top: 0.25rem dashed var(--co-enemy);

  background-color: var(--co-player);
  border-radius: 0 0 1rem 1rem;

  .lit-up & {
    ${ScShadowDiv} {
      box-shadow: 0 0 3rem 1rem var(--co-player-highlight);
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
