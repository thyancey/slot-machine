import styled from 'styled-components';
import Button from '../button';
import { useCallback, useContext, useEffect, useState } from 'react';
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

interface Props {}
function MachineEditor({}: Props) {
  const {
    uiState,
    setUiState,
    selectedItemKey,
    setSelectedItemKey,
    insertIntoReel,
    removeFromReel,
    insertReel,
    upgradeTokens,
    setUpgradeTokens,
  } = useContext(AppContext);
  const [preselectedItemKey, setPreselectedItemKey] = useState('');
  const [editorMode, setEditorMode] = useState<MachineEditorMode>('item');

  // close this sucker when you run out of money
  /*
  useEffect(() => {
    if (upgradeTokens <= 0) {
      setUiState('game');
    }
  }, [upgradeTokens]);
  */

  useEffect(() => {
    if (uiState !== 'editor') {
      if (upgradeTokens === 0) {
        setEditorMode('reel');
      } else {
        setEditorMode('item');
      }
      setPreselectedItemKey('');
    }
  }, [uiState]);

  // useEffect(() => {
  //   setEditorMode(selectedItemKey ? 'item' : 'reel');
  // }, [selectedItemKey]);

  const closeEditor = useCallback(() => {
    setSelectedItemKey('');
    setPreselectedItemKey('');
    setUiState('game');
  }, [selectedItemKey]);

  const onInsertIntoReel = useCallback(
    (reelIdx: number, itemIdx: number) => {
      insertIntoReel(reelIdx, itemIdx);
      setSelectedItemKey('');
      setPreselectedItemKey('');
      setUpgradeTokens(upgradeTokens - 1);
    },
    [insertIntoReel, upgradeTokens]
  );
  const onInsertReel = useCallback(
    (reelIdx: number) => {
      insertReel(reelIdx);
      setSelectedItemKey('');
      setPreselectedItemKey('');
      setUpgradeTokens(upgradeTokens - 1);
    },
    [insertIntoReel, upgradeTokens]
  );
  const onRemoveFromReel = useCallback(
    (reelIdx: number, itemIdx: number) => {
      removeFromReel(reelIdx, itemIdx);
      setSelectedItemKey('');
      setPreselectedItemKey('');
      setUpgradeTokens(upgradeTokens + 1);
    },
    [insertIntoReel, upgradeTokens]
  );

  return (
    <ScWrapper className={uiState === 'editor' ? 'panel-open' : ''}>
      <ScPanel>
        <h2>{editorMode === 'item' ? `choose your upgrade (${upgradeTokens} tokens)` : 'insert into reel'}</h2>
        <ScBody>
          {editorMode === 'item' ? (
            <ItemSelector
              active={uiState === 'editor'}
              selectedItemKey={preselectedItemKey}
              onSelectItemKey={(itemKey: string) => setPreselectedItemKey(itemKey)}
            />
          ) : (
            <ReelEditor
              onInsertIntoReel={onInsertIntoReel}
              onRemoveFromReel={onRemoveFromReel}
              onInsertReel={onInsertReel}
            />
          )}
        </ScBody>
        <ScFooter>
          <ScFooterButtons>
            {renderFooter(
              editorMode,
              preselectedItemKey,
              upgradeTokens,
              setSelectedItemKey,
              setPreselectedItemKey,
              setEditorMode,
              closeEditor
            )}
          </ScFooterButtons>
        </ScFooter>
      </ScPanel>
      <ScBg />
    </ScWrapper>
  );
}

const renderFooter = (
  editorMode: MachineEditorMode,
  preselectedItemKey: string,
  upgradeTokens: number,
  setSelectedItemKey: Function,
  setPreselectedItemKey: Function,
  setEditorMode: Function,
  closeEditor: Function
) => {
  const CloseButton = () => (
    <Button
      onClick={() => {
        closeEditor();
      }}
    >
      {'CLOSE'}
    </Button>
  );

  if (editorMode === 'item') {
    return (
      <>
        <CloseButton />
        <Button
          buttonStyle={preselectedItemKey === '' || upgradeTokens === 0 ? 'normal' : 'special'}
          onClick={() => {
            setSelectedItemKey(preselectedItemKey);
            setEditorMode('reel');
          }}
        >
          {!preselectedItemKey ? 'EDIT REEL' : 'INSERT'}
        </Button>
      </>
    );
  } else if (editorMode === 'reel') {
    if (upgradeTokens === 0) {
      return <CloseButton />;
    }

    if (preselectedItemKey !== '') {
      return (
        <>
          <Button
            onClick={() => {
              setSelectedItemKey('');
              setPreselectedItemKey('');
              setEditorMode('item');
            }}
          >
            {'<- CHANGE UPGRADE'}
          </Button>
          <CloseButton />
        </>
      );
    }

    return (
      <>
        <Button
          buttonStyle='special'
          onClick={() => {
            setSelectedItemKey('');
            setPreselectedItemKey('');
            setEditorMode('item');
          }}
        >
          {'PICK ANOTHER'}
        </Button>
        <CloseButton />
      </>
    );
  } else {
    return null;
  }
};

export default MachineEditor;
