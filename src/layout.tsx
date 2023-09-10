import styled from 'styled-components';
import Bg from './components/bg';
import { useMemo, useContext, useEffect } from 'react';
import { AppContext } from './store/appcontext';
import Enemy from './components/enemy';
import MetalGlint, { ScGlintWrapper } from './components/metal-glint';
import SlotMachine, { ScReelContainer } from './components/slotmachine';
import { ENEMY_HEIGHT } from './store/data';
import Palette from './components/palette';
import Footer from './components/footer';
import { ScReelBg } from './components/slotmachine/components/reel';

const ScWrapper = styled.main`
  position: absolute;
  inset: 0;
  overflow: hidden;

  &.mode-editor {
    --opacity-editorfade: 0.2;
  }

  &.editor-reel {
    ${ScReelContainer}{
      opacity: 1;
    }
  }
`;

// TODO: get rid of this extra div, make machine more responsive
const ScComboContainer = styled.div`
  width: 100%;
  height: 100%;
  height: calc(100% - 2rem);
  margin-top: 2rem;

  display: flex;
  flex-direction: column;

  /* overflow-y:auto; */
  /* justify-content: start; */
  align-items: center;
`;

const ScSpacing = styled.div`
  min-height: 7rem;
`;

const ScFooter = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  z-index: 1;
`;

const ScCombo = styled.div`
  position: relative;
  flex: 1;

  overflow-y: auto;

  box-shadow: 0px 0px 5px var(--co-enemy);
  padding: 3rem;

  border-radius: 1rem;
`;

const ScShadowDiv = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  z-index: -1;
`;
const ScEnemy = styled.div`
  position: absolute;
  /* width:100%; */
  left: 3rem;
  right: 3rem;
  height: ${ENEMY_HEIGHT}px;

  background-color: var(--co-enemy);
  border-radius: 1rem 1rem 0 0;
  padding: 1.5rem 2rem 1rem 2rem;
  box-shadow: 0.25rem 0.25rem 0.5rem 0.3rem var(--color-black);

  ${ScShadowDiv} {
    /* box-shadow: 0 0 6rem 3rem var(--co-enemy-highlight); */
  }

  /*
  .lit-up & {
    ${ScShadowDiv} {
      box-shadow: 0 0 6rem 3rem var(--co-enemy-highlight);
    }
  }
  */
`;

const ScEnemyPlaceholder = styled.div`
  height: ${ENEMY_HEIGHT}px;
  position: relative;
`;

const ScPlayer = styled.div`
  position: relative;
  padding: 1.75rem;
  padding-top: 1rem;
  padding-bottom: 2.25rem;
  z-index: 0;

  /* margin-top: ${ENEMY_HEIGHT}px; */

  /* refactor this shadow hack w/glint */
  box-shadow: 0.25rem 0.25rem 0.5rem 0.3rem var(--color-black);
  border-radius: 1.5rem 1.5rem 1rem 1rem;

  ${ScGlintWrapper} {
    border-radius: 1.5rem 1.5rem 1rem 1rem;
  }
  background-color: transparent;

  ${ScShadowDiv} {
    /* box-shadow: 0 0 6rem 3rem var(--co-player-highlight); */
  }

  /*
  .lit-up & {
    ${ScShadowDiv} {
      box-shadow: 0 0 6rem 2rem var(--co-player-highlight);
    }
  }
  */
`;

let paletteActive = false;

function Layout() {
  const { activeCombos, uiState, editorState } = useContext(AppContext);
  const litUp = useMemo(() => {
    return activeCombos.length > 0;
  }, [activeCombos.length]);

  useEffect(() => {
    paletteActive = window.location.search.indexOf('palette') > -1;
  });

  const classNames = [`mode-${uiState}`];
  editorState === 'reel' && classNames.push('editor-reel');
  litUp && classNames.push('lit-up');

  return (
    <ScWrapper className={classNames.join(' ')}>
      {paletteActive && <Palette />}
      <ScComboContainer>
        <ScCombo id='player'>
          <ScEnemyPlaceholder>
            <ScEnemy>
              <Enemy />
              <ScShadowDiv />
            </ScEnemy>
          </ScEnemyPlaceholder>
          <ScPlayer>
            <SlotMachine />
            <MetalGlint glintTheme='player' />
            <ScShadowDiv />
          </ScPlayer>
        </ScCombo>
        <ScSpacing />
        <ScFooter>
          <Footer />
        </ScFooter>
      </ScComboContainer>
      <Bg />
      {/* <MachineEditor /> */}
    </ScWrapper>
  );
}

export default Layout;
