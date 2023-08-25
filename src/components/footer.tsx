import styled from 'styled-components';
import Button, { StyledButton } from './button';
import { useContext } from 'react';
import { AppContext } from '../store/appcontext';
import { COST_SPIN } from '../store/data';
import MetalGlint, { ScGlintWrapper } from './metal-glint';

const ScWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  /* background-color: var(--color-black); */

  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;

  /* position:relative; */

  ${StyledButton} {
    overflow: hidden;
    position: relative;
    color: var(--color-purple-dark);
    font-size: 7rem;
    /* line-height: 2rem; */
    margin: 2rem;
    padding: 2rem 3rem 1rem 3rem;
    /* position: absolute; */
    bottom: 1.5rem;

    border-radius: 3rem;
    box-shadow: 0.25rem 0.25rem 1rem 0.25rem var(--color-black);

    background-color: transparent;
    transition: font-size 0.2s ease-out, color 0.3s, bottom 0.3s;

    font-family: var(--font-cursive);

    &:not(.disabled):hover {
      font-size: 9rem;
      color: var(--color-yellow-dark);
      box-shadow: 0.35rem 0.35rem 2.25rem 0.25rem var(--color-black);
      bottom: 3.5rem;

      ${ScGlintWrapper} {
        background-size: 200% 400%;
      }
    }

    &.disabled {
      font-size: 5rem;
      color: var(--color-grey);
    }
  }
`;

function Footer() {
  const { triggerSpin, spinInProgress, score, gameState, reelResults, finishTurn } = useContext(AppContext);

  const spinDisabled = spinInProgress || score < COST_SPIN;
  const attackDisabled = !(gameState === 'SPIN' && !reelResults.includes(-1));

  return (
    <ScWrapper>
      <Button onClick={() => triggerSpin()} disabled={spinDisabled}>
        <>
          {'SPIN'}
          <MetalGlint glintTheme={spinDisabled ? 'silver' : 'gold'} />
        </>
      </Button>
      <Button onClick={() => finishTurn()} disabled={attackDisabled}>
        <>
          {'ATTACK'}
          <MetalGlint glintTheme={attackDisabled ? 'silver' : 'gold'} />
        </>
      </Button>
    </ScWrapper>
  );
}

export default Footer;
