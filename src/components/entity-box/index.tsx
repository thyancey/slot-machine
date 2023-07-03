import styled from 'styled-components';
import SlotMachine from '../slotmachine';
import EntityStats from './entity-stats';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import Enemy from './enemy';
import { getEffectDelta } from '../slotmachine/utils';

const ScWrapper = styled.div`
  position: relative;
  max-width: 40rem;
  max-height: 40rem;

  min-width: 20rem;
  min-height: 20rem;
`;

const ScCard = styled.div`
  border-radius: 1.5rem;
  padding: 3rem 2rem 2rem 2rem;
  margin: 1rem;

  .entity-player & {
    background-color: var(--color-white);
    filter: drop-shadow(0.5rem 0.5rem 0.5rem var(--color-black));
  }

  .entity-enemy & {
    background-color: var(--color-grey);
    color: var(--color-pink);
    border: 0.75rem solid var(--color-pink);
    filter: drop-shadow(0.25rem 0.25rem 1rem var(--color-black));
  }
`;

export const PlayerEntityBox = () => {
  const { activeTiles, activeCombos, playerInfo } = useContext(AppContext);

  const attack = useMemo(() => {
    return getEffectDelta('attack', activeTiles, activeCombos);
  }, [activeTiles, activeCombos]);
  const defense = useMemo(() => {
    return getEffectDelta('defense', activeTiles, activeCombos);
  }, [activeTiles, activeCombos]);
  const health = useMemo(() => {
    return getEffectDelta('health', activeTiles, activeCombos);
  }, [activeTiles, activeCombos]);
  const hp = useMemo(() => {
    return playerInfo.hp;
  }, [playerInfo]);

  return (
    <ScWrapper className='entity-player'>
      <ScCard>
        <EntityStats statInfo={{ attack: attack, defense: defense, health: health }} hp={hp} />
        <SlotMachine />
      </ScCard>
    </ScWrapper>
  );
};

export const EnemyEntityBox = () => {
  const { enemyInfo } = useContext(AppContext);
  if (!enemyInfo) {
    return null;
  }
  return (
    <ScWrapper className='entity-enemy'>
      <ScCard>
        <EntityStats
          statInfo={{
            attack: enemyInfo.attack,
            defense: enemyInfo.defense
          }}
          hp={enemyInfo.hp}
        />
        <Enemy enemyInfo={enemyInfo} />
      </ScCard>
    </ScWrapper>
  );
};

export default {};
