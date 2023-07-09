import styled from 'styled-components';
import MachineEditor from './components/machine-editor';
import Enemy from './components/entities/enemy';
import Player from './components/entities/player';

const ScWrapper = styled.main`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

const ScMain = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;

  padding: 2rem;
  padding-bottom: 4rem;

  display: flex;
  flex-direction: column-reverse;
  justify-content: space-evenly;
  align-items: center;
  gap: 3rem;
`;

const ScBg = styled.div`
  position: absolute;
  inset: calc(-1 * var(--val-reel-height));
  font-size: var(--val-reel-height);
  font-family: var(--font-8bit2);
  line-height: 10rem;
  z-index: -1;
  letter-spacing: -3rem;
  transform: rotate(-20deg);
  top: -50%;
  color: var(--color-pink);
  opacity: 0.2;
`;

function Layout() {
  const bgText = Array(100).fill('S L O T S');
  return (
    <ScWrapper>
      <ScMain>
        <Player />
        <Enemy />
      </ScMain>
      <ScBg>
        <p>{bgText.join(' ! ')}</p>
      </ScBg>
      <MachineEditor />
    </ScWrapper>
  );
}

export default Layout;
