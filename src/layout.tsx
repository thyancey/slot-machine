import styled from 'styled-components';
import MachineEditor from './components/machine-editor';
import Player from './components/entities/player';
import Bg from './components/bg';
import { useMemo, useContext } from 'react';
import { AppContext } from './store/appcontext';
// import Palette from './components/palette';

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

function Layout() {
  const { activeCombos } = useContext(AppContext);
  const litUp = useMemo(() => {
    return activeCombos.length > 0;
  }, [ activeCombos.length ])
  
  return (
    <ScWrapper className={litUp ? 'lit-up' : ''}>
    {/* <Palette /> */}
      <ScMain>
        <Player />
      </ScMain>
      <Bg />
      <MachineEditor />
    </ScWrapper>
  );
}

export default Layout;
