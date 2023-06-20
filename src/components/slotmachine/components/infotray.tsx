import { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../../store/appcontext';
import Button from '../../button';
import ScoreBox from '../../scorebox';

const ScWrapper = styled.div`
  background-color: var(--color-grey);
  color: var(--color-white);
  border-radius: 0.6rem;
  width: 100%;
  height: 100%;

  padding: 0.5rem;

  display: flex;
  flex-direction: row;
`;

const ScScoreContainer = styled.div`
  flex: 1;
  margin-left: 0.5rem;
`;

function InfoTray() {
  const { upgradeTokens, setUiState } = useContext(AppContext);

  return (
    <ScWrapper>
      <Button
        buttonStyle={upgradeTokens > 0 ? 'special' : 'normal'}
        onClick={() => setUiState('editor')}
      >{`modify`}</Button>
      <ScScoreContainer>
        <ScoreBox />
      </ScScoreContainer>
    </ScWrapper>
  );
}

export default InfoTray;
