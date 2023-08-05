import styled from 'styled-components';
import SlotMachine from '../slotmachine';
import Enemy from './enemy';

const ScCard = styled.div`
  position: relative;

  box-shadow: 0.25rem 0.25rem 0.5rem 0.3rem var(--color-black);
  border-radius: 1rem;

  background: var(--co-player);

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
  padding: 1rem;
  padding-bottom: 1.5rem;
  border-top: 0.25rem dashed var(--co-enemy);

  /* --co-metal: var(--co-player); */
  --co-metal: hsla(var(--hsl-white), 0); //hide, only show the glint
  --co-glint: var(--co-player-highlight);

  background: var(--co-metal);
  background: linear-gradient(
    355deg,
    var(--co-metal) 0%,

    var(--co-metal) 15%,
    var(--co-glint) 17%,
    var(--co-glint) 25%,
    var(--co-metal) 35%,

    var(--co-metal) 55%,
    var(--co-glint) 60%,
    var(--co-glint) 70%,
    var(--co-metal) 80%,

    var(--co-metal) 100%
  );

	background-size: 100% 200%;
  background-repeat: repeat;

  @keyframes gradient-intermittent {
    0% {
      background-position: 50% -100%;
    }
    40% {
      background-position: 50% -100%;
    }
    60% {
      background-position: 50% 100%;
    }
    100% {
      background-position: 50% 100%;
    }
  }
  @keyframes gradient-wrap {
    0% {
      background-position: 0% 100%;
    }
    100% {
      background-position: 0% -100%;
    }
  }

  /* background: radial-gradient(var(--co-metal), var(--co-glint)); */
  /* animation: gradient2 5s ease-in-out infinite; */
  animation: gradient-wrap 10s ease-in-out infinite;

  // 60 [65 - 85] 90
  // width: 30 (60 - 90)
  // blur: 5 (65-90)
  // speed:

  border-radius: 0 0 1rem 1rem;

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
