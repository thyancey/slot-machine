import { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../../store/appcontext';
import Button from '../../button';
import DepthButton from '../../depth-button';
import DisplayButton from '../../display-button';

const ScWrapper = styled.div`
  color: var(--color-white);
  border-radius: 0.6rem;
  height: 100%;

  > button:first-child {
    flex: 1;
    font-size: 3rem;
    line-height: 4rem;
  }

  border-top: var(--val-depth) solid var(--co-player-bordertop);
  /* border-left: var(--val-depth) solid var(--co-player-borderside); */
  border-right: var(--val-depth) solid var(--co-player-borderside);
  border-bottom: var(--val-depth) solid var(--co-player-bordertop);
`;

const ScInner = styled.div`
  background-color: var(--color-black);
  padding: 0.5rem;
  border-radius: 0 0 0.6rem 0;
  height: 100%;

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
        <DisplayButton
          buttonStyle='special'
          disabled={spinLock || spinTokens <= 0}
          onClick={() => triggerSpin()}
        >
          {'S P I N'}
        </DisplayButton>
        <ScSpinTokens>
          <span>{spinTokens}</span>
        </ScSpinTokens>
        <DisplayButton
          buttonStyle={upgradeTokens > 0 ? 'special' : 'normal'}
          onClick={() => setUiState('editor')}
        >{`?`}</DisplayButton>
      </ScInner>
    </ScWrapper>
  );
}

export default SideControls;
