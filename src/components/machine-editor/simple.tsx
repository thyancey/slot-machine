import { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../store/appcontext';
import { MachineEditorMode } from '.';

const ScWrapper = styled.aside`

`;

function SimpleEditor() {
  const {
    uiState,
    setUiState,
  } = useContext(AppContext);
  const [editorMode, setEditorMode] = useState<MachineEditorMode>('hand');

  console.log(`uiState: ${uiState}, editorMode: ${editorMode}`);

  return (
    <ScWrapper className={uiState === 'editor' ? 'panel-open' : ''}>
    </ScWrapper>
  );
}

export default SimpleEditor;
