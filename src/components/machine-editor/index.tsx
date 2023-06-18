import styled from 'styled-components';
import Button from '../button';
import { useCallback, useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import ItemSelector from './item-selector';
import ReelEditor from './reel-editor';

const ScWrapper = styled.aside`
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0;
  pointer-events: none;

  &.panel-open {
    opacity: 1;
    pointer-events: all;
  }
`;

const ScPanel = styled.div`
  position: absolute;
  inset: 5rem;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;

  background-color: var(--color-grey);
  border: var(--border-width) solid var(--color-white);
  border-radius: 1.5rem;

  h2 {
    padding: 1rem;
    border-bottom: var(--border-width-small) solid var(--color-white);
  }
`;

const ScBody = styled.ul`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  overflow-y: auto;
  padding: 1rem;

  justify-content: center;
  gap: 1rem;
`;

const ScBg = styled.div`
  position: absolute;
  inset: 0;
  background-color: black;
  opacity: 0.5;
`;

const ScFooter = styled.div`
  border-top: var(--border-width-small) solid var(--color-white);
`;

const ScFooterButtons = styled.div`
  display: flex;
  flex-direction: row;
  > * {
    margin: 1rem;
    flex: 1;
    padding: 1rem;
  }
`;

export type MachineEditorMode = 'item' | 'reel';

interface Props {
  isOpen: boolean;
  onClose: Function;
}
function MachineEditor({ isOpen, onClose }: Props) {
  const { selectedItemKey, setSelectedItemKey } = useContext(AppContext);

  const closeEditor = useCallback(() => {
    setSelectedItemKey('');
    onClose();
  }, [onClose, selectedItemKey]);

  const mode: MachineEditorMode = useMemo(() => {
    return !selectedItemKey ? 'item' : 'reel';
  }, [selectedItemKey]);

  return (
    <ScWrapper className={isOpen ? 'panel-open' : ''}>
      <ScPanel>
        <h2>{mode === 'item' ? 'choose your upgrade' : 'insert into reel'}</h2>
        <ScBody>{mode === 'item' ? <ItemSelector /> : <ReelEditor />}</ScBody>
        <ScFooter>
          <ScFooterButtons>
            {mode === 'item' ? (
              <Button
                onClick={() => {
                  closeEditor();
                }}
              >
                {'skip'}
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setSelectedItemKey('');
                  }}
                >
                  {'back'}
                </Button>
                <Button
                  onClick={() => {
                    closeEditor();
                  }}
                >
                  {'OK'}
                </Button>
              </>
            )}
          </ScFooterButtons>
        </ScFooter>
      </ScPanel>
      <ScBg />
    </ScWrapper>
  );
}

export default MachineEditor;
