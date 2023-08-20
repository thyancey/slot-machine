import styled from 'styled-components';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { AppContext } from '../../store/appcontext';
import Display from '../slotmachine/components/display';
import DisplayButton from '../display-button';
import { MixinBorders } from '../../utils/styles';
import Rivets from '../slotmachine/components/rivets';
import { UiContext } from '../../store/uicontext';
import { off, on } from '../../utils/events';

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
    line-height: 4.85rem;
  }
`;

export const Enemy = () => {
  const { enemyInfo, turn, finishTurn, reelResults, gameState } = useContext(AppContext);
  const { enemyText, setEnemyText } = useContext(UiContext);
  const enemyAttackRef = useRef(enemyInfo && enemyInfo.attack);

  const enemyAttackMessage = useMemo(() => {
    const mssgs = [];
    if (enemyInfo && enemyInfo.attack !== 0) {
      mssgs.push(`${enemyInfo.label} WILL ATTACK WITH ${enemyInfo.attack} DAMAGE`);
    }

    return mssgs.length > 0 ? mssgs.join('\n') : '';
  }, [enemyInfo]);

  // TODO, centralize this somewhere else, also better state check on new enemy move
  useEffect(() => {
    if (enemyInfo && enemyInfo.attack !== enemyAttackRef.current) {
      enemyAttackRef.current = enemyInfo.attack;
      if (enemyInfo && enemyInfo.attack !== 0) {
        setEnemyText(`${enemyInfo.label} WILL ATTACK WITH ${enemyInfo.attack} DAMAGE`);
      }
    }
  }, [enemyAttackRef, enemyInfo, setEnemyText]);

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
      // console.log('enemy.setText:', e.detail);
      setEnemyText(e.detail);
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
    if (gameState === 'NEW_TURN') {
      setEnemyText();
    }
  }, [gameState, setEnemyText]);

  const onHover = (text: string) => {
    console.log('onHover ', text);
    // setEnemyText(text);
  };

  if (!enemyInfo) {
    return null;
  }

  const message = enemyText || enemyAttackMessage;

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
        <DisplayButton
          buttonStyle='special'
          disabled={!canAttack}
          onClick={() => finishTurn()}
          onMouseEnter={() => onHover(`end turn`)}
        >
          {'A T K'}
        </DisplayButton>
        {/* </ScButton> */}
      </ScSideControls>
      <Rivets />
    </ScCard>
  );
};

export default Enemy;
