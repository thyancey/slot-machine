import styled from 'styled-components';
import Button, { StyledButton } from './button';
import { useContext } from 'react';
import { AppContext } from '../store/appcontext';
import { COST_SPIN } from '../store/data';
import MetalGlint, { ScGlintWrapper } from './metal-glint';
import SimpleEditor from './machine-editor/simple';

const ScWrapper = styled.div`
  display: flex;
  justify-content: center;

  ${StyledButton} {
    overflow: hidden;
    position: relative;
    /* color: var(--color-black); */
    color: var(--color-black-light);
    font-size: 4rem;
    margin: 0.5rem 2rem 1rem 2rem;
    padding: 2rem 3rem 1rem 3rem;
    height: 100%;

    border-radius: 3rem;
    box-shadow: 0.25rem 0.25rem 1rem 0.25rem var(--color-black);

    background-color: transparent;
    transition: font-size 0.2s ease-out, color 0.3s, bottom 0.3s;

    font-family: var(--font-cursive);

    &:not(.disabled):hover {
      font-size: 5.5rem;
      color: var(--color-black);
      box-shadow: 0.35rem 0.35rem 2.25rem 0.25rem var(--color-black);

      ${ScGlintWrapper} {
        background-size: 200% 400%;
      }
    }

    &.disabled {
      font-size: 4.5rem;
      color: var(--color-grey);
    }
  }
`;

function Footer() {
  const { triggerSpin, spinInProgress, score, gameState, finishTurn, uiState } = useContext(AppContext);

  const spinDisabled = gameState !== 'SPIN' || spinInProgress || score < COST_SPIN;
  const attackDisabled = gameState !== 'SPIN' || spinInProgress;

  return (
    <ScWrapper>
      {uiState === 'editor' ? (
        <SimpleEditor />
      ) : (
        <>
          <Button onClick={() => triggerSpin()} disabled={spinDisabled}>
            <>
              {'SPIN'}
              <MetalGlint glintTheme={spinDisabled ? 'silver' : 'gold'} />
            </>
          </Button>
          <Button onClick={() => finishTurn()} disabled={attackDisabled}>
            <>
              {'FIGHT'}
              <MetalGlint glintTheme={attackDisabled ? 'silver' : 'enemy'} />
            </>
          </Button>
        </>
      )}
    </ScWrapper>
  );
}

export default Footer;
