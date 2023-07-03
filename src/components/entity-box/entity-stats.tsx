import styled from 'styled-components';
import { getEffectDelta } from '../slotmachine/utils';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import StatLabel from '../slotmachine/components/stat-label';

const ScWrapper = styled.div`
  background-color: var(--color-purple);
  position: absolute;
  bottom: 100%;
`;

const ScStatLabels = styled.ul`
  > li {
    display: inline-block;
    vertical-align: middle;
    width: 3rem;
  }
`;

const EntityStats = () => {
  const { activeTiles, activeCombos, playerInfo } = useContext(AppContext);

  const attackPower = useMemo(() => {
    return getEffectDelta('attack', activeTiles, activeCombos);
  }, [activeTiles, activeCombos]);
  const defense = useMemo(() => {
    return getEffectDelta('defense', activeTiles, activeCombos);
  }, [activeTiles, activeCombos]);
  const healthDelta = useMemo(() => {
    return getEffectDelta('health', activeTiles, activeCombos);
  }, [activeTiles, activeCombos]);
  const health = useMemo(() => {
    return playerInfo.hp;
  }, [playerInfo]);

  console.log('attackPower', attackPower);
  console.log('defense', defense);
  console.log('health', health);
  console.log('healthDelta', healthDelta);

  return (
    <ScWrapper>
      <ScStatLabels>
        {attackPower && <StatLabel type='attack' size={'lg'} value={attackPower}></StatLabel> || null}
        {defense && <StatLabel type='defense' size={'lg'} value={defense}></StatLabel> || null}
        {healthDelta && <StatLabel type='health' size={'lg'} value={healthDelta}></StatLabel> || null}
      </ScStatLabels>
    </ScWrapper>
  );
};

export default EntityStats;
