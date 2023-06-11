import styled from 'styled-components';
import SlotMachine from './components/slotmachine';
import Header from './components/header';

const ScWrapper = styled.main`
  position: absolute;
  inset: 0;
  overflow:hidden;

  display: flex;
  flex-direction: column;
`;

const ScHeader = styled.h1`
  margin: 1rem;
  margin-left: -10rem;
  font-size:5rem;
  white-space:nowrap;
  font-family: var(--font-8bit2);
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
  /* z-index: -1; */
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

const slotString = 'S L O T S'
function Layout() {
  const bgText = Array(100).fill(slotString);
  return (
    <ScWrapper>
      <Header />
      <ScStage>
        <SlotMachine />
      </ScStage>
      <ScBg><p>{bgText.join(' ! ')}</p></ScBg>
    </ScWrapper>
  );
}

export default Layout;
