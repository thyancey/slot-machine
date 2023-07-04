import styled from 'styled-components';
import EntityStats from './entity-stats';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';

const ScCard = styled.div`
  border-radius: 1.5rem;
  padding: 3rem 2rem 1rem 2rem;
  margin: 1rem;
  min-width: 20rem;

  background-color: var(--color-grey);
  color: var(--color-pink);
  border: 0.75rem solid var(--color-pink);
  filter: drop-shadow(0.25rem 0.25rem 1rem var(--color-black));

  &.active{
    cursor: pointer;
  }
`;

const ScHoverTip = styled.div`
  position: absolute;
  inset: 0;
  background-color: var(--color-purple);
  color: var(--color-white);

  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;

  display: flex;
  align-items: center;
  justify-content: center;
  /* z-index: -1; */

  span {
    font-size: 3rem;
  }

  ${ScCard}.active:hover & {
    opacity: 1;
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
  const nextTurnAvailable = useMemo(() => {
    return turn > -1 && !reelResults.includes(-1);
  }, [reelResults, turn]);

  if (!enemyInfo) {
    return null;
  }

  return (
    <ScCard className={nextTurnAvailable ? 'active' : ''} onClick={() => nextTurnAvailable && finishTurn()}>
      <EntityStats
        statInfo={{
          attack: enemyInfo.attack,
          defense: enemyInfo.defense,
        }}
        hp={enemyInfo.hp}
      />
      <ScHoverTip >
        <span>{'ATTACK?'}</span>
      </ScHoverTip>
      <ScEnemy>
        <h3>{enemyInfo.label}</h3>
        {/* <ScEnemyImage style={{ 'background': `url(${enemyInfo.img})` }} /> */}
        <ScEnemyImage src={enemyInfo.img} />
      </ScEnemy>
      <ScGameInfo>
        <li>{`enemy #${round + 1}`}</li>
        <li>{`turn #${turn + 1}`}</li>
      </ScGameInfo>
    </ScCard>
  );
};

export default Enemy;
