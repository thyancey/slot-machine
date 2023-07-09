import styled from 'styled-components';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import Button from '../button';
import AttackBar from './attackbar';
import HealthBar from './healthbar';
import Display from '../slotmachine/components/display';

const ScCard = styled.div`
  border-radius: 1.5rem;
  padding: 2rem 2rem 1rem 2rem;

  background-color: var(--color-grey-light);
  color: var(--color-white);
  /* filter: drop-shadow(0.25rem 0.25rem 1rem var(--color-black)); */
  
  filter: drop-shadow(0.5rem 0.7rem 0 var(--color-grey)) drop-shadow(0.5rem 0.7rem 0 var(--color-grey)) drop-shadow(0.25rem 0.25rem 0.5rem var(--color-black));

  display: flex;
  flex-direction: column;
  gap: 1rem;

  min-width: 30rem;
`;

const ScEnemy = styled.div`
  position: absolute;
  right: 0;
  bottom: calc(100% - 3rem);

  font-size: 2rem;
  text-align: center;
`;

const ScEnemyImage = styled.img`
  width: 8rem;
  height: 8rem;
`;

const ScGameInfo = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const ScDisplay = styled.div`
  background-color: var(--color-black);
  border-radius: 0.5rem;
  border-left: 1.1rem solid var(--color-grey);
  border-top: 1.1rem solid var(--color-grey);
`;

const ScButton = styled.div`
  position:absolute;
  left:calc(100% - 0.5rem);
  white-space: nowrap;
  top: 8rem;

  transform-origin: top;
  transform: rotate(90deg);
`

export const Enemy = () => {
  const { enemyInfo, turn, finishTurn, reelResults } = useContext(AppContext);

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
      <ScEnemy>
        <ScEnemyImage src={enemyInfo.img} />
      </ScEnemy>
      <ScDisplay>
        <Display messages={[`attacks with ${enemyInfo.attack} damage`]} />
      </ScDisplay>
      <ScGameInfo>{enemyInfo.label}</ScGameInfo>
      <ScButton>
        <Button buttonStyle='special' disabled={!canAttack} onClick={() => finishTurn()}>
          {'END TURN'}
        </Button>
      </ScButton>
      <HealthBar hp={enemyInfo.hp} hpMax={enemyInfo.hpMax} defense={enemyInfo.defense} buffs={[]} />
    </ScCard>
  );
};

export default Enemy;
