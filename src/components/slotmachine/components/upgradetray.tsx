import { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../../store/appcontext';
import { MAX_REEL_TOKENS } from '../../../store/data';
import AssetMap from '../../../assets';
import Button from '../../button';

const ScWrapper = styled.div`
  background-color: var(--color-black);
  color: var(--color-white);
  border-radius: 0.6rem;
  width: 100%;
  height: 100%;

  padding: 0.5rem;

  display: flex;
  flex-direction: row;
`;

const ScTokenContainer = styled.ul`
  background-color: var(--color-grey);
  border-radius: 0.4rem;
  flex: 1;
  padding-right: 0.75rem;
  margin-left: 0.5rem;
  text-align:left;
`;

const ScToken = styled.li`
  width: 3rem;
  height: 100%;
  display: inline-block;
  vertical-align:middle;
  background: url(${AssetMap.UI_Token_Empty}) no-repeat center / contain;
  filter: brightness(0.5);

  &.active {
    background-image: url(${AssetMap.UI_Token});
    filter: var(--filter-shadow1);
  }
`;

type Props = {};
function UpgradeTray({}: Props) {
  const { upgradeTokens, setUiState } = useContext(AppContext);
  const tokenStatus = useMemo(() => {
    return Array.from({ length: MAX_REEL_TOKENS }, (_, idx) => idx).map((idx) => idx < upgradeTokens);
  }, [upgradeTokens]);

  return (
    <ScWrapper>
      <Button
        // disabled={upgradeTokens <= 0}
        buttonStyle={upgradeTokens > 0 ? 'special': 'normal'}
        onClick={() => setUiState('editor')}
      >{`modify`}</Button>
      <ScTokenContainer>
        {tokenStatus.map((isActive, idx) => (
          <ScToken key={idx} className={isActive ? 'active' : ''} />
        ))}
      </ScTokenContainer>
    </ScWrapper>
  );
}

export default UpgradeTray;
