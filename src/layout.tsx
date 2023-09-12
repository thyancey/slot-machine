import styled, { css } from 'styled-components';
import Bg from './components/bg';
import { useMemo, useContext, useEffect } from 'react';
import { AppContext } from './store/appcontext';
import Enemy from './components/enemy';
import SlotMachine, { ScReelContainer } from './components/slotmachine';
import { COST_SPIN, COST_UPGRADE, ENEMY_HEIGHT } from './store/data';
import Palette from './components/palette';
import MachineEditor from './components/editor';

const PANEL_HEIGHT = 32;
const ScWrapper = styled.main`
  position: absolute;
  inset: 0;
  overflow: hidden;

  &.mode-editor {
    --opacity-editorfade: 0.2;
  }

  &.editor-reel {
    ${ScReelContainer} {
      opacity: 1;
    }
  }
`;

// TODO: get rid of this extra div, make machine more responsive
const ScComboContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  filter: drop-shadow(0.5rem 0.5rem 1rem black);
`;

const ScFooter = styled.div`
  width: 100%;
  bottom: 0;
  z-index: 1;
`;

const ScCombo = styled.div`
  position: relative;
  padding: 3rem;
  border-radius: 1rem;

  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

interface ScEnemyProps {
  $isAlive?: boolean;
  $isActive?: boolean;
}
const ScEnemy = styled.div<ScEnemyProps>`
  position: absolute;
  top: ${ENEMY_HEIGHT}px;

  left: 4rem;
  right: 4rem;
  /* 100 is extra buffer for the bounce anim so the bar doesnt look clipped */
  height: ${ENEMY_HEIGHT + 100}px;

  background-color: var(--co-enemy);
  border-radius: 1rem 1rem 0 0;
  padding: 0.75rem;
  padding-bottom: 5rem;

  transition: bottom 0.3s ease;

  @keyframes pop-in {
    0% {
      top: ${ENEMY_HEIGHT}px;
    }
    100% {
      top: -1rem;
    }
  }

  @keyframes pop-in2 {
    0% {
      top: -1rem;
    }
    100% {
      top: -5rem;
    }
  }

  ${(p) =>
    p.$isAlive &&
    css`
      animation: pop-in 1s linear forwards;
      animation-timing-function: linear(0, 1.483 10.4%, 0.766, 1.113, 0.945, 1.027, 0.987 63.3%, 1.001);
    `}
  ${(p) =>
    p.$isActive &&
    css`
      animation: pop-in2 1s linear forwards;
      animation-timing-function: linear(0, 1.483 10.4%, 0.766, 1.113, 0.945, 1.027, 0.987 63.3%, 1.001);
    `}
    
  ${(p) =>
    !p.$isAlive &&
    css`
      animation: none;
      animation-timing-function: none;
      top: ${ENEMY_HEIGHT}px;
      transition: top 0.3s ease;
    `}
`;

const ScEnemyPlaceholder = styled.div`
  height: ${ENEMY_HEIGHT}px;
  width: 100%;
  position: relative;

  /* position: absolute;
  bottom:100%;
  width: 100%;
  z-index:-1; */

  .mode-editor & {
    /* height: 0px; */
  }
`;

const ScPlayer = styled.div`
  position: relative;
  padding: 0.75rem;
  padding-bottom: 2rem;
  z-index: 0;
  background-color: var(--co-player);
  filter: drop-shadow(0 -0.25rem 0.5rem var(--color-black));

  /* refactor this shadow hack w/glint */
  border-radius: 1.5rem 1.5rem 1rem 1rem;
`;

interface ScSideBtnProps {
  $position: 'left' | 'right';
  $type: 'attack' | 'spin';
  $disabled?: boolean;
}

const ScSideBtnContainer = styled.div<ScSideBtnProps>`
  position: absolute;
  z-index: -1;
  height: 100%;
  width: 7rem;
  top: 0rem;
  cursor: pointer;

  opacity: var(--opacity-editorfade);

  ${(p) =>
    p.$disabled &&
    css`
      pointer-events: none;
    `}

  ${(p) =>
    p.$type === 'attack'
      ? css`
          right: 100%;
        `
      : css`
          left: 100%;
        `}

  @media (hover: hover) {
    &:hover > div {
      ${(p) =>
        p.$position === 'left' &&
        css`
          background-color: var(--color-red-light);
          border-color: var(--color-red-light);
          right: 2rem;
          color: var(--color-white);
        `}

      ${(p) =>
        p.$position === 'right' &&
        css`
          background-color: var(--color-blue-light);
          border-color: var(--color-blue-light);
          left: 2rem;
          color: var(--color-white);
        `}
    }
  }

  &:active {
    > div {
      ${(p) =>
        p.$position === 'left' &&
        css`
          right: -2rem;
          transition: right 0.1s;
        `}

      ${(p) =>
        p.$position === 'right' &&
        css`
          left: -2rem;
          transition: left 0.1s;
        `}
    }
  }

  ${(p) =>
    p.$position === 'left' &&
    p.$disabled &&
    css`
      > div {
        right: -1.5rem;
      }
    `}

  ${(p) =>
    p.$position === 'right' &&
    p.$disabled &&
    css`
      > div {
        left: -1.5rem;
      }
    `}
`;

const ScSideBtn = styled.div<ScSideBtnProps>`
  position: absolute;
  width: calc(${PANEL_HEIGHT}rem - 2rem);
  height: 8rem;

  ${(p) =>
    p.$type === 'attack'
      ? css`
          background-color: var(--co-sidebtn-attack);
          color: var(--co-sidebtn-attack-text);
        `
      : css`
          background-color: var(--co-sidebtn-spin);
          color: var(--co-sidebtn-spin-text);
        `}

  ${(p) =>
    p.$disabled &&
    css`
      background-color: var(--color-grey);
      color: var(--color-black);
    `}

  span {
    display: block;
    font-size: 3rem;
    text-align: center;
    margin-top: 0.25rem;
  }

  ${(p) =>
    p.$position === 'right' &&
    css`
      transform-origin: left;
      border-radius: 3rem 3rem 0 0;
      left: 1.5rem;
      top: -3.25rem;
      margin-left: 0rem;
      transform: rotate(90deg);
      transition: left 0.3s;
    `}

  ${(p) =>
    p.$position === 'left' &&
    css`
      transform-origin: right;
      border-radius: 3rem 3rem 0 0;
      margin-right: 0rem;
      transform: rotate(-90deg);
      transition: right 0.3s;

      right: 1.5rem;
      top: -3.25rem;
    `}
`;

interface ScBottomButtonProps {
  $disabled?: boolean;
}

const ScBottomButtonContainer = styled.div<ScBottomButtonProps>`
  margin-top: 3rem;
  height: 7rem;
  left: 4rem;
  right: 4rem;
  z-index: -2;
  position: absolute;
  cursor: pointer;
  
  opacity: var(--opacity-editorfade);

  > div {
    margin-top: -2.25rem;
  }

  ${(p) =>
    p.$disabled &&
    css`
      pointer-events: none;
      > div {
        margin-top: -5.5rem;
        background-color: var(--color-grey);
        color: var(--color-black);
      }
    `}

  @media (hover: hover) {
    &:hover > div {
      background-color: var(--color-green-light);
      /* color: var(--color-grey-light); */
      margin-top: -1.75rem;
    }
  }

  &:active {
    > div {
      margin-top: -5.5rem;
    }
  }
`;

const ScBottomButton = styled.div`
  position: absolute;
  background-color: var(--color-green);
  top: 0;
  padding: 1rem;
  padding-top: 3rem;
  width: 100%;
  z-index: 9;
  color: var(--color-white);

  border-radius: 0 0 3rem 3rem;

  transition: margin-top 0.3s ease;

  span {
    display: block;
    font-size: 3rem;
    text-align: center;
    margin-top: 0.25rem;
  }
`;

const ScBackTopPanel = styled.div`
  position: absolute;
  background-color: var(--color-white);
  top: -1rem;
  bottom: -1rem;
  left: 3rem;
  right: 3rem;
  border-radius: 0.5rem;
  z-index: -1;
`;

const ScBackPanels = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;

  > div {
    position: absolute;
    left: -1rem;
    right: -1rem;

    background-color: var(--co-player);
    padding: 2rem;
    /* border-radius: 1rem; */
    border-radius: 0.5rem;

    top: 8rem;
    height: ${PANEL_HEIGHT}rem;
  }
`;

let paletteActive = false;

function Layout() {
  const {
    activeCombos,
    uiState,
    editorState,
    enemyInfo,
    gameState,
    score,
    spinInProgress,
    triggerSpin,
    finishTurn,
    openEditor,
  } = useContext(AppContext);
  const litUp = useMemo(() => {
    return activeCombos.length > 0;
  }, [activeCombos.length]);

  useEffect(() => {
    paletteActive = window.location.search.indexOf('palette') > -1;
  });

  const spinDisabled = uiState === 'editor' || gameState !== 'SPIN' || spinInProgress || score < COST_SPIN;
  const attackDisabled = uiState === 'editor' || gameState !== 'SPIN' || spinInProgress;
  const upgradeDisabled = uiState === 'editor' || gameState !== 'SPIN' || spinInProgress || score < COST_UPGRADE;

  const classNames = [`mode-${uiState}`];
  editorState === 'reel' && classNames.push('editor-reel');
  litUp && classNames.push('lit-up');

  const enemyActive = gameState === 'PLAYER_ATTACK' || gameState === 'ENEMY_BUFF';

  return (
    <ScWrapper className={classNames.join(' ')}>
      {paletteActive && <Palette />}
      <ScComboContainer>
        <ScCombo id='player'>
          <ScEnemyPlaceholder>
            <ScEnemy $isActive={enemyActive} $isAlive={!!enemyInfo}>
              <Enemy />
            </ScEnemy>
          </ScEnemyPlaceholder>
          <ScPlayer>
            <SlotMachine />
            <ScBackTopPanel />
            <ScBackPanels>
              <div>
                <ScSideBtnContainer
                  onClick={() => triggerSpin()}
                  $position='right'
                  $type='spin'
                  $disabled={spinDisabled}
                >
                  <ScSideBtn $position='right' $type='spin' $disabled={spinDisabled}>
                    <span>{'SPIN'}</span>
                  </ScSideBtn>
                </ScSideBtnContainer>
                <ScSideBtnContainer
                  onClick={() => finishTurn()}
                  $position='left'
                  $type='attack'
                  $disabled={attackDisabled}
                >
                  <ScSideBtn $position='left' $type='attack' $disabled={attackDisabled}>
                    <span>{'FIGHT'}</span>
                  </ScSideBtn>
                </ScSideBtnContainer>
              </div>
            </ScBackPanels>
            <ScBottomButtonContainer $disabled={upgradeDisabled} onClick={() => openEditor()}>
              <ScBottomButton>
                <span>{'UPGRADE'}</span>
              </ScBottomButton>
            </ScBottomButtonContainer>
          </ScPlayer>
        </ScCombo>
        <ScFooter>{uiState === 'editor' && <MachineEditor />}</ScFooter>
      </ScComboContainer>
      <Bg />
    </ScWrapper>
  );
}

export default Layout;
