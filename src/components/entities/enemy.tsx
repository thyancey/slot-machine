import styled from 'styled-components';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import Button from '../button';
import AttackBar from './attackbar';
import HealthBar from './healthbar';

const ScCard = styled.div`
  border-radius: 1.5rem;
  padding: 2rem 2rem 1rem 2rem;
  min-width: 20rem;

  background-color: var(--color-grey);
  color: var(--color-pink);
  border: 0.75rem solid var(--color-pink);
  filter: drop-shadow(0.25rem 0.25rem 1rem var(--color-black));

  > button {
    margin-bottom: 1rem;
    width: 100%;
  }
`;

const ScEnemy = styled.div`
  position: relative;

  font-size: 2rem;
  text-align: center;
`;

const ScEnemyImage = styled.img`
  width: 8rem;
  height: 8rem;
`;

const ScGameInfo = styled.ul`
  display: flex;
  font-size: 1rem;
  align-items: center;
  justify-content: space-between;
`;

const ScEnemyGrid = styled.div`
  display: grid;
  grid-template-columns: 8rem auto;
  grid-template-rows: auto;
  grid-gap: 2rem;
`;

export const Enemy = () => {
  const { enemyInfo, turn, finishTurn, reelResults, round } = useContext(AppContext);

  const canAttack = useMemo(() => {
    return turn > -1 && !reelResults.includes(-1);
  }, [reelResults, turn]);

  const className = useMemo(() => {
    const classes = [];
    if (canAttack) classes.push('active');
    return classes.join(' ');
  }, [canAttack]);

  if (!enemyInfo) {
    return null;
  }

  return (
    <ScCard id='enemy' className={className}>
      <AttackBar attack={enemyInfo.attack} modifiers={[]} />
      <ScEnemyGrid>
        <ScEnemy>
          {/* <ScEnemyImage style={{ 'background': `url(${enemyInfo.img})` }} /> */}
          <ScEnemyImage src={enemyInfo.img} />
        </ScEnemy>
        <Button buttonStyle='special' disabled={!canAttack} onClick={() => finishTurn()}>
          {'ATTACK'}
        </Button>
      </ScEnemyGrid>
      <ScGameInfo>
        <li>{''}</li>
        <li>{enemyInfo.label}</li>
        <li>{`turn #${turn + 1}`}</li>
      </ScGameInfo>
      <HealthBar hp={enemyInfo.hp} hpMax={enemyInfo.hpMax} defense={enemyInfo.defense} buffs={[]} />
    </ScCard>
  );
};

export default Enemy;
