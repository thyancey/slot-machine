import { useContext, useMemo } from 'react';
import { AppContext } from '../../../store/appcontext';
import Display from './display';
import styled from 'styled-components';

const ScDisplay = styled.div`
  background-color: var(--color-black);
  border-radius: 0.5rem;
  border-left: 1.1rem solid var(--color-grey-light);
  border-top: 1.1rem solid var(--color-grey);
`;

function PlayerDisplay() {
  const { activeCombos } = useContext(AppContext);
  const messages = useMemo(() => {
    if (activeCombos.length > 0) {
      return [`${activeCombos[0].label}`, `x${activeCombos[0].bonus?.multiplier} multiplier`];
    }
    return ['spin the wheel please'];
  }, [activeCombos]);

  return (
    <ScDisplay>
      <Display messages={messages} displayType={activeCombos.length > 0 ? 'combo' : undefined} />
    </ScDisplay>
  );
}

export default PlayerDisplay;
