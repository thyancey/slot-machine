import styled from 'styled-components';
import SlotMachine from './components/slotmachine';

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

function Layout() {
  return (
    <ScWrapper>
      <ScHeader>{'! SLOTS ! SLOTS ! SLOTS ! SLOTS ! SLOTS ! SLOTS !'}</ScHeader>
      <ScStage>
        <SlotMachine />
      </ScStage>
    </ScWrapper>
  );
}

export default Layout;
