import styled from 'styled-components';
import TileList from './components/tilelist';
import MachineEditor from './components/machine-editor';
import Header from './components/header';
import Footer from './components/footer';
import Player from './components/entities/player';
import Enemy from './components/entities/enemy';

const ScWrapper = styled.main`
  position: absolute;
  inset: 0;
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;

const ScStage = styled.main`
  flex: 1;
  padding: 5rem;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
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
      <Header />
      <TileList />
      <ScStage>
        <Player />
        <Enemy />
      </ScStage>
      <Footer />
      <ScBg>
        <p>{bgText.join(' ! ')}</p>
      </ScBg>
      <MachineEditor />
    </ScWrapper>
  );
}

export default Layout;
