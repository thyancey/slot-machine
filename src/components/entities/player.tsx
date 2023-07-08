import styled from 'styled-components';
import SlotMachine from '../slotmachine';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import { getEffectDelta } from '../slotmachine/utils';
import HealthBar from './healthbar';
import AttackBar from './attackbar';

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

export const Player = () => {
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
    <ScCard id="player" >
      <AttackBar attack={attack} modifiers={[{ type: 'health', value: health }]} />
      <HealthBar hp={hp} defense={defense} buffs={[]} />
      <SlotMachine />
    </ScCard>
  );
};

export default Player;
