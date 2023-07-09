import { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../../store/appcontext';
import Button from '../../button';

const ScWrapper = styled.div`
  background-color: var(--color-black);
  color: var(--color-white);
  border-radius: 0.6rem;
  width: 100%;
  height: 100%;
  border-left: 1.1rem solid var(--color-grey-light);
  border-top: 1.1rem solid var(--color-grey);
`;

const ScInner = styled.div`
  background-color: var(--color-black);
  filter: drop-shadow(-0.2rem -0.2rem 0.2rem var(--color-black));
  padding: 0.5rem;

  display: flex;
  flex-direction: row;
  gap: 1rem;

  > button:nth-child(2) {
    flex: 1;
  }
`;

const ScSpinTokens = styled.div`
  background-color: var(--color-black);

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  line-height: 3.3rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

interface Props {
  spinLock: boolean;
  spinTokens: number;
  triggerSpin: () => void;
}

function Controls({ spinLock, spinTokens, triggerSpin }: Props) {
  const { upgradeTokens, setUiState } = useContext(AppContext);

  return (
    <ScWrapper className={spinLock || spinTokens <= 0 ? 'spin-disabled' : ''}>
      <ScInner>
        <Button
          buttonStyle={upgradeTokens > 0 ? 'special' : 'normal'}
          onClick={() => setUiState('editor')}
        >{`x`}</Button>
        <Button buttonStyle='special' disabled={spinLock || spinTokens <= 0} onClick={() => triggerSpin()}>
          {'SPIN'}
        </Button>
        <ScSpinTokens>
          <span>{spinTokens}</span>
        </ScSpinTokens>
      </ScInner>
    </ScWrapper>
  );
}

export default Controls;
