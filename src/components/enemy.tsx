import styled from 'styled-components';
import { useContext, useMemo } from 'react';
import { AppContext } from '../store/appcontext';
import DisplayButton from './display-button';
import { MixinBorders } from '../utils/styles';
import Rivets from './slotmachine/components/rivets';
import DisplayPanel from './display-panel';

const ScCard = styled.div`
  position: relative;

  min-width: 30rem;

  display: grid;
  grid-template-columns: auto;
  grid-template-rows: min-content auto;
  grid-gap: 0.5rem;

  color: var(--color-black);

  position: relative;
  padding: 1rem 1.75rem;
  background-color: var(--co-enemy-door);
  border-radius: 0.75rem;
`;

const ScEnemy = styled.div`
  grid-row: 2;
  grid-column: 1;
  position: relative;

  font-size: 3rem;
  line-height: 4rem;
  text-align: center;
`;

const ScLabel = styled.h3`
  text-align: right;
  margin-top: -0.5rem;
  margin-bottom: -0.5rem;
  color: var(--color-black-light);
`;

const ScDisplay = styled.div`
  grid-row: 1;
  grid-column: 1;

  ${MixinBorders('--co-enemy-bordertop', '--co-enemy-borderside')}
  border-bottom: 0;
`;

const ScSideControls = styled.div`
  position: absolute;
  left: calc(100% + 3.5rem);
  top: 0;
  width: 6rem;
  height: 100%;

  background-color: var(--color-black);

  > button {
    font-size: 3rem;
    line-height: 5.2rem;
  }
`;

export const Enemy = () => {
  const { enemyInfo, finishTurn, reelResults, gameState } = useContext(AppContext);

  const canAttack = useMemo(() => {
    return gameState === 'SPIN' && !reelResults.includes(-1);
  }, [reelResults, gameState]);

  const className = useMemo(() => {
    const classes = [];
    if (canAttack) classes.push('active');
    return classes.join(' ');
  }, [canAttack]);

  const onHover = (text: string) => {
    console.log('onHover ', text);
  };

  if (!enemyInfo) {
    return null;
  }

  return (
    <ScCard id='enemy' className={className}>
      <ScDisplay>
        <DisplayPanel playerType='enemy' playerInfo={enemyInfo} />
      </ScDisplay>
      <ScEnemy>
        <ScLabel>{`enemy: ${enemyInfo.label}`}</ScLabel>
      </ScEnemy>
      <ScSideControls>
        <DisplayButton
          buttonStyle='special'
          disabled={!canAttack}
          onClick={() => finishTurn()}
          onMouseEnter={() => onHover(`end turn`)}
        >
          {'A T K'}
        </DisplayButton>
      </ScSideControls>
      <Rivets />
    </ScCard>
  );
};

export default Enemy;
