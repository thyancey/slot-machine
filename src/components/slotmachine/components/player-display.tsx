import { useContext, useMemo } from 'react';
import { AppContext } from '../../../store/appcontext';
import Display from './display';
import styled from 'styled-components';
import { getEffectDelta } from '../utils';

const ScDisplay = styled.div`
  background-color: var(--color-black);
  border-radius: 0.5rem;
  border-left: 1.1rem solid var(--color-grey-light);
  border-top: 1.1rem solid var(--color-grey);
`;

interface Props {
  onClick?: () => void;
}
function PlayerDisplay({onClick}: Props) {
  const { activeCombos, activeTiles } = useContext(AppContext);

  const attack = useMemo(() => {
    return getEffectDelta('attack', activeTiles, activeCombos);
  }, [activeTiles, activeCombos]);

  const messages = useMemo(() => {
    const mssgs = [];
    if (attack !== 0) {
      mssgs.push(`attack with ${attack} damage`);
    }
    if (activeCombos.length > 0) {
      mssgs.push(`${activeCombos[0].label}`, `x${activeCombos[0].bonus?.multiplier} multiplier`);
    }

    return mssgs.length > 0 ? mssgs : ['SPIN TO WIN'];
  }, [activeCombos, attack]);

  return (
    <ScDisplay onClick={onClick}>
      <Display messages={messages} displayType={activeCombos.length > 0 ? 'combo' : undefined} />
    </ScDisplay>
  );
}

export default PlayerDisplay;
