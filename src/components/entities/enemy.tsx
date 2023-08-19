import styled from 'styled-components';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import Display from '../slotmachine/components/new-display';
import DisplayButton from '../display-button';
import { MixinBorders } from '../../utils/styles';
import Rivets from '../slotmachine/components/rivets';
import { UiContext } from '../../store/uicontext';
import { TRANSITION_DELAY } from '../../store/data';
import { off, on } from '../../utils/events';

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

const ScLabel = styled.h3`
  /* font-size: 2rem; */
  text-align: right;
  margin-top: -.5rem;
  margin-bottom: -.5rem;
  color: var(--color-black-light);
`;

const ScDisplay = styled.div`
  grid-row: 1;
  grid-column: 1;

  /* background-color: var(--color-black); */

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
  const { enemyInfo, turn, finishTurn, reelResults, gameState } = useContext(AppContext);
  const { enemyText, setEnemyText } = useContext(UiContext);

  const message = useMemo(() => {
    if (enemyText) {
      return enemyText;
    }
    const mssgs = [];
    if (enemyInfo && enemyInfo.attack !== 0) {
      mssgs.push(`${enemyInfo.label} WILL ATTACK WITH ${enemyInfo.attack} DAMAGE`);
    }

    return mssgs.length > 0 ? mssgs.join('\n') : '';
  }, [enemyText, enemyInfo]);

  const canAttack = useMemo(() => {
    return turn > -1 && !reelResults.includes(-1);
  }, [reelResults, turn]);

  const className = useMemo(() => {
    const classes = [];
    if (canAttack) classes.push('active');
    return classes.join(' ');
  }, [canAttack]);

  const setText = useCallback(
    (e: CustomEvent) => {
      console.log('setEnemyText123:', e.detail);
      if (Array.isArray(e.detail)) {
        setEnemyText(e.detail[0], e.detail[1]);
      } else {
        // setEnemyText(e.detail, TRANSITION_DELAY);
        setEnemyText(e.detail, 0);
      }
    },
    [setEnemyText]
  );

  useEffect(() => {
    on('enemyDisplay', setText);

    return () => {
      off('enemyDisplay', setText);
    };
  });

  
  useEffect(() => {
    if(gameState === 'NEW_TURN'){
      console.log('set that text to nothin!')
      setEnemyText('');
    }
  }, [ gameState, setEnemyText ]);

  const onHover = (text: string)=> {
    // setEnemyText(text);
  }

  if (!enemyInfo) {
    return null;
  }

  return (
    <ScCard id='enemy' className={className}>
      {/* <AttackBar attack={enemyInfo.attack} modifiers={[]} /> */}
      <ScDisplay>
        <Display playerInfo={enemyInfo} message={message} />
      </ScDisplay>
      <ScEnemy>
        <ScLabel>{`enemy: ${enemyInfo.label}`}</ScLabel>
        {/* <ScEnemyImage src={enemyInfo.img} /> */}
      </ScEnemy>
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
