import styled from 'styled-components';
import SlotMachine from '../slotmachine';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import { getEffectDelta } from '../slotmachine/utils';
import HealthBar from './healthbar';
import AttackBar from './attackbar';

const ScCard = styled.div`
  position: relative;
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

  return (
    <ScCard id="player" >
      {attack !== 0 && <AttackBar attack={attack} modifiers={[{ type: 'health', value: health }]} />}
      <HealthBar hp={playerInfo.hp} hpMax={playerInfo.hpMax} defense={defense} buffs={[]} />
      <SlotMachine />
    </ScCard>
  );
};

export default Player;
