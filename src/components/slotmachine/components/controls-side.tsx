import { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../../store/appcontext';
import Button from '../../button';

const ScWrapper = styled.div`
  color: var(--color-white);
  border-radius: 0.6rem;
  height: 100%;

  > button:first-child {
    flex: 1;
    font-size: 3rem;
    line-height: 4rem;
  }
  border-left: 1.1rem solid var(--color-grey-light);
  border-top: 1.1rem solid var(--color-grey);

  /* transform-origin: center; */
  /* transform: rotate(90deg); */
`;

const ScInner = styled.div`
  background-color: var(--color-black);
  filter: drop-shadow(-0.2rem -0.2rem 0.2rem var(--color-black));
  padding: 0.5rem;
  border-radius: 0 0 0.6rem 0;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  > button:first-child {
    flex: 1;
    font-size: 3rem;
    line-height: 4rem;
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

function SideControls({ spinLock, spinTokens, triggerSpin }: Props) {
  const { upgradeTokens, setUiState } = useContext(AppContext);

  return (
    <ScWrapper className={spinLock || spinTokens <= 0 ? 'spin-disabled' : ''}>
      <ScInner>
        <Button buttonStyle='special' disabled={spinLock || spinTokens <= 0} onClick={() => triggerSpin()}>
          {'S P I N'}
        </Button>
        <ScSpinTokens>
          <span>{spinTokens}</span>
        </ScSpinTokens>
        <Button
          buttonStyle={upgradeTokens > 0 ? 'special' : 'normal'}
          onClick={() => setUiState('editor')}
        >{`?`}</Button>
      </ScInner>
    </ScWrapper>
  );
}

export default SideControls;
