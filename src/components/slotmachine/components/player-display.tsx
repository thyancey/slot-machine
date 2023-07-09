import { useContext, useMemo } from 'react';
import { AppContext } from '../../../store/appcontext';
import Display from './display';

function PlayerDisplay() {
  const { activeCombos } = useContext(AppContext);
  const messages = useMemo(() => {
    if (activeCombos.length > 0) {
      return [`${activeCombos[0].label}`, `x${activeCombos[0].bonus?.multiplier} multiplier`];
    }
    return ['spin the wheel please'];
  }, [activeCombos]);

  return <Display messages={messages} displayType={activeCombos.length > 0 ? 'combo' : undefined} />;
}

export default PlayerDisplay;
