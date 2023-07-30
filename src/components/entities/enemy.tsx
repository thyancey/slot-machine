import styled from 'styled-components';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import HealthBar from './healthbar';
import Display from '../slotmachine/components/display';
import DisplayButton from '../display-button';

const ScCard = styled.div`
  padding: 1rem 1rem 1rem 1rem;

  position: relative;

  min-width: 30rem;

  display: grid;
  grid-template-columns: auto min-content;
  grid-template-rows: auto min-content 3rem;
  grid-gap: 1rem;

  color: var(--color-black);
`;

const ScEnemy = styled.div`
  grid-row: 2;
  grid-column: 1;
  position: relative;

  /* position: absolute; */
  /* right: 0; */
  /* bottom: calc(100% - 5rem); */

  font-size: 3rem;
  line-height: 4rem;
  text-align: center;
`;

const ScEnemyImage = styled.img`
  position: absolute;
  right: 0;
  bottom: calc(100% - 4rem);
  width: 8rem;
  height: 8rem;
`;

const ScHealthBar = styled.div`
  grid-row: 3;
  grid-column: 1;
  position: relative;
`;

const ScGameInfo = styled.h1`
  font-size: 2rem;
  text-align: center;
`;

const ScDisplay = styled.div`
  grid-row: 1;
  grid-column: 1;

  background-color: var(--color-black);

  border-top: var(--val-depth) solid var(--co-enemy-bordertop);
  border-left: var(--val-depth) solid var(--co-enemy-borderside);
  border-right: var(--val-depth) solid var(--co-enemy-borderside);
  /* border-bottom: var(--val-depth) solid var(--co-enemy-bordertop); */
`;

const ScSideControls = styled.div`
  width: 7rem;
  height: 100%;
  grid-column: 2;
  grid-row: 1 / 4;

  border-top: var(--val-depth) solid var(--co-enemy-bordertop);
  /* border-left: var(--val-depth) solid var(--co-enemy-borderside); */
  border-right: var(--val-depth) solid var(--co-enemy-borderside);
  /* border-bottom: var(--val-depth) solid var(--co-enemy-bordertop); */
  
  background-color: var(--color-black);

  position: relative;
`;

const ScButton = styled.div`
  position: absolute;
  inset: 0.25rem;


  > button {
    font-size: 2.25rem;
    height: 100%;
  }
`;

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
      {/* <AttackBar attack={enemyInfo.attack} modifiers={[]} /> */}
      <ScDisplay>
        <Display messages={[`attacks with ${enemyInfo.attack} damage`]} />
      </ScDisplay>
      <ScEnemy>
        <ScGameInfo>{enemyInfo.label}</ScGameInfo>
        <ScEnemyImage src={enemyInfo.img} />
      </ScEnemy>
      <ScSideControls>
        <ScButton>
          <DisplayButton buttonStyle='special' disabled={!canAttack} onClick={() => finishTurn()}>
            {'A T K'}
          </DisplayButton>
        </ScButton>
      </ScSideControls>
      <ScHealthBar>
        <HealthBar hp={enemyInfo.hp} hpMax={enemyInfo.hpMax} defense={enemyInfo.defense} buffs={[]} />
      </ScHealthBar>
    </ScCard>
  );
};

export default Enemy;
