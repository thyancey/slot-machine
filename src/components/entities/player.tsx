import styled from 'styled-components';
import SlotMachine from '../slotmachine';
import Enemy from './enemy';
import MetalGlint from '../metal-glint';

const ScWrapper = styled.div`
  position: relative;

  box-shadow: 0.25rem 0.25rem 0.5rem 0.3rem var(--color-black);
  border-radius: 1rem 1rem 0.25rem 0.25rem;

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
  padding: 1.5rem 2rem 1rem 2rem;

  position: relative;
  

  ${ScShadowDiv} {
    /* box-shadow: 0 0 6rem 3rem var(--co-enemy-highlight); */
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
  padding: 1.75rem;
  padding-bottom: 2.25rem;
  border-top: 0.25rem solid var(--co-player-bordertop);

  border-radius: 0 0 1rem 1rem;
  background-color: transparent;

  ${ScShadowDiv} {
    /* box-shadow: 0 0 6rem 3rem var(--co-player-highlight); */
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
    <ScWrapper id='player'>
      <ScEnemy>
        <Enemy />
        <ScShadowDiv />
      </ScEnemy>
      <ScPlayer>
        <SlotMachine />
        <MetalGlint glintTheme="player"/>
        <ScShadowDiv />
      </ScPlayer>
    </ScWrapper>
  );
};

export default Player;
