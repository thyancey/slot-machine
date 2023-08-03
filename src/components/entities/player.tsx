import styled from 'styled-components';
import SlotMachine from '../slotmachine';
import Enemy from './enemy';

const ScCard = styled.div`
  position: relative;

  box-shadow: 0.25rem 0.25rem .5rem .3rem var(--color-black);
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0rem;
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
  
  ${ScShadowDiv} {
    box-shadow: 0 0 6rem 3rem var(--co-enemy-highlight);
  }

  /*
  .lit-up & {
    ${ScShadowDiv} {
      box-shadow: 0 0 6rem 3rem var(--co-enemy-highlight);
    }
  }
  */
`;

const ScPlayer = styled.div`
  position: relative;
  padding: 1rem;
  padding-bottom: 1.5rem;
  border-top: 0.25rem dashed var(--co-enemy);

  background-color: var(--co-player);
  border-radius: 0 0 1rem 1rem;

  ${ScShadowDiv} {
    box-shadow: 0 0 6rem 3rem var(--co-player-highlight);
  }

  /*
  .lit-up & {
    ${ScShadowDiv} {
      box-shadow: 0 0 6rem 2rem var(--co-player-highlight);
    }
  }
  */
`;

export const Player = () => {
  return (
    <ScCard id='player'>
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
