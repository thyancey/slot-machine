import styled from 'styled-components';
import EntityStats from './entity-stats';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import Button from '../button';

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

const ScHoverTip = styled.div`
  position: absolute;
  inset: 0;
  background-color: var(--color-pink);
  color: var(--color-white);

  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 3rem;
  }

  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;

  ${ScCard}.behind:hover & {
    opacity: 1;
    cursor: pointer;
    pointer-events: all;
    z-index:1;
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
  const { enemyInfo, turn, finishTurn, reelResults, round, playerFocused, setPlayerFocused } = useContext(AppContext);

  const canAttack = useMemo(() => {
    return turn > -1 && !reelResults.includes(-1);
  }, [reelResults, turn] )

  const className = useMemo(() => {
    const classes = [];
    if (canAttack) classes.push('active');
    if (playerFocused) classes.push('behind');
    return classes.join(' ');
  }, [canAttack, playerFocused]);

  if (!enemyInfo) {
    return null;
  }

  return (
    <ScCard id='enemy' className={className} >
      <EntityStats
        statInfo={{
          attack: enemyInfo.attack,
          defense: enemyInfo.defense,
        }}
        hp={enemyInfo.hp}
      />
      <ScHoverTip onClick={() => setPlayerFocused(prev => !prev)}>
      </ScHoverTip>
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
    </ScCard>
  );
};

export default Enemy;
