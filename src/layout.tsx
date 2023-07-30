import styled from 'styled-components';
import MachineEditor from './components/machine-editor';
import Player from './components/entities/player';
import Palette from './components/palette';

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
`;

const ScBg = styled.div`
  position: absolute;
  background-color: var(--color-black);
  color: var(--color-black-light);
  inset: calc(-1 * var(--val-reel-height));
  font-size: var(--val-reel-height);
  font-family: var(--font-8bit2);
  line-height: 10rem;
  z-index: -1;
  letter-spacing: -3rem;
  transform: rotate(-20deg);
  top: -50%;
  opacity: 1;
`;

function Layout() {
  const bgText = Array(100).fill('S L O T S');
  return (
    <ScWrapper>
      <Palette />
      <ScMain>
        <Player />
      </ScMain>
      <ScBg>
        <p>{bgText.join(' ! ')}</p>
      </ScBg>
      <MachineEditor />
    </ScWrapper>
  );
}

export default Layout;
