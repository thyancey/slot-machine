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

  padding: 0.5rem;

  display: flex;
  flex-direction: row;
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

const ScSpinButton = styled.div`
  flex: 1;
  color: var(--color-white);
  background-color: var(--color-purple);
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  border: var(--border-width-small) solid var(--color-cyan);
  border-radius: 0.75rem;

  margin: 0 0.5rem;

  font-size: 3rem;
  line-height: 3.3rem;

  cursor: pointer;

  &:hover {
    background-color: var(--color-pink);
    color: var(--color-yellow);
  }

  .spin-disabled & {
    cursor: default;
    background-color: var(--color-grey);
    color: var(--color-black);
    border-color: var(--color-black);

    &:hover {
      background-color: var(--color-grey);
    }
  }
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
      <Button buttonStyle={upgradeTokens > 0 ? 'special' : 'normal'} onClick={() => setUiState('editor')}>{`x`}</Button>
      <ScSpinButton onClick={() => triggerSpin()}>
        <span>{'SPIN'}</span>
      </ScSpinButton>
      <ScSpinTokens>
        <span>{spinTokens}</span>
      </ScSpinTokens>
    </ScWrapper>
  );
}

export default Controls;
