import styled from 'styled-components';
import SlotMachine from '../slotmachine';
import EntityStats from './entity-stats';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import { getEffectDelta } from '../slotmachine/utils';

const ScCard = styled.div`
  border-radius: 1.5rem;
  padding: 3rem 2rem 2rem 2rem;
  margin: 1rem;

  min-width: 30rem;
  background-color: var(--color-grey);
  border: 0.75rem solid var(--color-pink);
  filter: drop-shadow(0.5rem 0.5rem 0.5rem var(--color-black));
  cursor: pointer;
`;

const ScHoverTip = styled.div`
  position: absolute;
  inset: 0;
  background-color: var(--color-yellow);
  color: var(--color-pink);

  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease-in;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  span {
    font-size: 3rem;
  }

  ${ScCard}:hover & {
    opacity: 1;
    transition: opacity 0.2s ease-out;
  }
`;

export const Player = () => {
  const { activeTiles, activeCombos, playerInfo } = useContext(AppContext);
  const showHoverTip = false;

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
    <ScCard className='entity-player'>
      <EntityStats statInfo={{ attack: attack, defense: defense, health: health }} hp={hp} />
      {showHoverTip && (
        <ScHoverTip>
          <span>{'SPIN?'}</span>
        </ScHoverTip>
      )}
      <SlotMachine />
    </ScCard>
  );
};

export default Player;
