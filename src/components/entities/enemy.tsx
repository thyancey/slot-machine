import styled from 'styled-components';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import Display from '../slotmachine/components/new-display';
import DisplayButton from '../display-button';
import { MixinBorders } from '../../utils/styles';
import Rivets from '../slotmachine/components/rivets';
import { UiContext } from '../../store/uicontext';

const ScCard = styled.div`
  position: relative;

  min-width: 30rem;

  display: grid;
  grid-template-columns: auto;
  grid-template-rows: min-content auto ;
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

  /* position: absolute; */
  /* right: 0; */
  /* bottom: calc(100% - 5rem); */

  font-size: 3rem;
  line-height: 4rem;
  text-align: center;
`;

// const ScEnemyImage = styled.img`
//   position: absolute;
//   right: 0;
//   bottom: calc(100% - 4rem);
//   width: 8rem;
//   height: 8rem;
// `;

const ScGameInfo = styled.h1`
  font-size: 2rem;
  text-align: right;
`;

const ScDisplay = styled.div`
  grid-row: 1;
  grid-column: 1;

  background-color: var(--color-black);

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
    line-height: 4.85rem;
  }
`;

export const Enemy = () => {
  const { enemyInfo, turn, finishTurn, reelResults } = useContext(AppContext);
  const { setPlayerText } = useContext(UiContext);

  const canAttack = useMemo(() => {
    return turn > -1 && !reelResults.includes(-1);
  }, [reelResults, turn]);

  const className = useMemo(() => {
    const classes = [];
    if (canAttack) classes.push('active');
    return classes.join(' ');
  }, [canAttack]);

  const onHover = (text: string)=> {
    setPlayerText(text);
  }

  if (!enemyInfo) {
    return null;
  }

  return (
    <ScCard id='enemy' className={className}>
      {/* <AttackBar attack={enemyInfo.attack} modifiers={[]} /> */}
      <ScEnemy>
        <ScGameInfo>{`enemy: ${enemyInfo.label}`}</ScGameInfo>
        {/* <ScEnemyImage src={enemyInfo.img} /> */}
      </ScEnemy>
      <ScDisplay>
        <Display playerInfo={enemyInfo} messages={[`attacks with ${enemyInfo.attack} damage`]} />
      </ScDisplay>
      <ScSideControls>
        {/* <ScButton> */}
          <DisplayButton buttonStyle='special' disabled={!canAttack} onClick={() => finishTurn()} 
          onMouseEnter={() => onHover(`end turn`)}>
            {'A T K'}
          </DisplayButton>
        {/* </ScButton> */}
      </ScSideControls>
      <Rivets />
    </ScCard>
  );
};

export default Enemy;
