import styled from 'styled-components';
import SlotMachine from './components/slotmachine';

const ScWrapper = styled.main`
  position: absolute;
  inset: 0;
  overflow:hidden;

  display: flex;
  flex-direction: column;
`;

const ScHeader = styled.header`
  margin: 1rem;
  text-align: center;
`;

const ScStage = styled.main`
  flex: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 5rem;
  position: relative;
`;

function Layout() {
  return (
    <ScWrapper>
      <ScHeader>{'A slot machine'}</ScHeader>
      <ScStage>
        <SlotMachine />
      </ScStage>
    </ScWrapper>
  );
}

export default Layout;
