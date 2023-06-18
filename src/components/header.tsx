import styled from 'styled-components';
import { AppContext } from '../store/appcontext';
import { useContext, useMemo } from 'react';
import Button from './button';
import AssetMap from '../assets';

const ScWrapper = styled.header`
  border-bottom: 0.75rem solid var(--color-pink);
  background-color: var(--color-grey);
  color: var(--color-white);
  z-index: 1;

  padding: 0rem;

  width: 100%;
  display: flex;
  align-items: start;
  justify-content: center;
`;

const ScScorebox = styled.div`
  border: 1rem solid var(--color-pink);
  border-radius: 1.5rem;
  position: absolute;
  margin-top: -1.75rem;
  padding: 0 2rem;
  font-size: 4rem;
  background-color: var(--color-grey);

  p {
    margin: 0;
    padding: 0;
  }
`;

const ScDebugMenu = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  background-color: var(--color-grey);
  border: var(--border-width) solid var(--color-yellow);

  border-radius: 1.5rem;
`;

const ScTokenContainer = styled.ul`

`;

const ScToken = styled.li`
  width:2rem;
  height:2rem;
  display:inline-block;
  background: url(${AssetMap.UI_Token_Empty}) no-repeat center / contain;

  &.active{
    background-image: url(${AssetMap.UI_Token})
  }
`;

const MAX_TOKENS = 5;

interface Props {
  onOpenMachineEditor: Function;
}
function Header({ onOpenMachineEditor }: Props) {
  const { score, upgradeTokens } = useContext(AppContext);

  const tokenStatus = useMemo(() => {
    return Array.from({ length: MAX_TOKENS}, (_ , idx) => idx).map((idx) => idx < upgradeTokens);
  }, [ upgradeTokens ]);

  return (
    <ScWrapper>
      <ScScorebox>
        <p>{score}</p>
      </ScScorebox>
      <ScDebugMenu>
        <Button disabled={upgradeTokens <= 0} onClick={() => onOpenMachineEditor()}>{`upgrade (${upgradeTokens})`}</Button>
        <ScTokenContainer>
          {tokenStatus.map((isActive, idx) => (
            <ScToken key={idx} className={isActive ? 'active' : ''} />
          ))}
        </ScTokenContainer>
      </ScDebugMenu>
    </ScWrapper>
  );
}

export default Header;
