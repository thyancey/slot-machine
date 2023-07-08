import styled from 'styled-components';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import Button from '../button';
import AttackBar from './attackbar';
import HealthBar from './healthbar';

const ScCard = styled.div`
  border-radius: 1.5rem;
  padding: 3rem 2rem 1rem 2rem;
  margin: 1rem;
  min-width: 20rem;

  background-color: var(--color-grey);
  color: var(--color-pink);
  border: 0.75rem solid var(--color-pink);
  filter: drop-shadow(0.25rem 0.25rem 1rem var(--color-black));

  >button{
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

export const Enemy = () => {
  const { enemyInfo, turn, finishTurn, reelResults, round } = useContext(AppContext);

  const canAttack = useMemo(() => {
    return turn > -1 && !reelResults.includes(-1);
  }, [reelResults, turn] )

  const className = useMemo(() => {
    const classes = [];
    if (canAttack) classes.push('active');
    return classes.join(' ');
  }, [canAttack]);

  if (!enemyInfo) {
    return null;
  }

  return (
    <ScCard id='enemy' className={className} >
      <AttackBar attack={enemyInfo.attack} modifiers={[]} />
      <ScEnemy>
        <h3>{enemyInfo.label}</h3>
        {/* <ScEnemyImage style={{ 'background': `url(${enemyInfo.img})` }} /> */}
        <ScEnemyImage src={enemyInfo.img} />
      </ScEnemy>
      <Button buttonStyle="special" disabled={!canAttack} onClick={() => finishTurn()}>{'ATTACK'}</Button>
      <ScGameInfo>
        <li>{`enemy #${round + 1}`}</li>
        <li>{`turn #${turn + 1}`}</li>
      </ScGameInfo>
      <HealthBar hp={enemyInfo.hp} defense={enemyInfo.defense} buffs={[]} />
    </ScCard>
  );
};

export default Enemy;
