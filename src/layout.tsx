import styled from 'styled-components';
import SlotMachine from './components/slotmachine';
import Header from './components/header';
import ItemList from './components/itemlist';
import MachineEditor from './components/machine-editor';

const ScWrapper = styled.main`
  position: absolute;
  inset: 0;
  overflow:hidden;

  display: flex;
  flex-direction: column;
`;

const ScStage = styled.main`
  flex: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 5rem;
  position: relative;
`;

const ScBg = styled.div`
  position:absolute;
  inset: -12rem;
  font-size: 12rem;
  font-family: var(--font-8bit2);
  line-height: 10rem;
  z-index:-1;
  letter-spacing: -3rem;
  transform: rotate(-20deg);
  top: -50%;
  color: var(--color-pink);
  opacity: .2;
`

function Layout() {
  const bgText = Array(100).fill('S L O T S');
  return (
    <ScWrapper>
      <Header/>
      <ItemList />
      <ScStage>
        <SlotMachine />
      </ScStage>
      <ScBg><p>{bgText.join(' ! ')}</p></ScBg>
      <MachineEditor />
    </ScWrapper>
  );
}

export default Layout;
