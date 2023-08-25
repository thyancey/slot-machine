import styled from 'styled-components';
import Button from './button';
import { useContext } from 'react';
import { AppContext } from '../store/appcontext';
import { COST_SPIN } from '../store/data';

const ScWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 5rem;
  background-color: var(--color-black);

  display: flex;
  align-items: center;
  justify-content: center;
`

function Footer() {
  const { triggerSpin, spinInProgress, score } = useContext(AppContext);

  return (
    <ScWrapper>
      <Button
        onClick={() => triggerSpin()}
        disabled={spinInProgress || score < COST_SPIN}
      >
        {'SPIN'}
      </Button>
    </ScWrapper>
  );
}

export default Footer;
