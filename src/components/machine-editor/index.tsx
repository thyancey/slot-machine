import styled from 'styled-components';
import Button from '../button';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../store/appcontext';
import TileSelector from './tile-selector';
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

export type MachineEditorMode = 'hand' | 'reel';

interface Props {}
function MachineEditor({}: Props) {
  const {
    uiState,
    setUiState,
    selectedTileKey,
    setSelectedTileKey,
    insertIntoReel,
    removeFromReel,
    insertReel,
    upgradeTokens,
    setUpgradeTokens,
  } = useContext(AppContext);
  const [preselectedTileKey, setPreselectedTileKey] = useState('');
  const [editorMode, setEditorMode] = useState<MachineEditorMode>('hand');

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
        setEditorMode('hand');
      }
      setPreselectedTileKey('');
    }
  }, [uiState]);

  // useEffect(() => {
  //   setEditorMode(selectedTileKey ? 'hand' : 'reel');
  // }, [selectedTileKey]);

  const closeEditor = useCallback(() => {
    setSelectedTileKey('');
    setPreselectedTileKey('');
    setUiState('game');
  }, [selectedTileKey]);

  const onInsertIntoReel = useCallback(
    (reelIdx: number, tileIdx: number) => {
      insertIntoReel(reelIdx, tileIdx);
      setSelectedTileKey('');
      setPreselectedTileKey('');
      setUpgradeTokens(upgradeTokens - 1);
    },
    [insertIntoReel, upgradeTokens]
  );
  const onInsertReel = useCallback(
    (reelIdx: number) => {
      insertReel(reelIdx);
      setSelectedTileKey('');
      setPreselectedTileKey('');
      setUpgradeTokens(upgradeTokens - 1);
    },
    [insertIntoReel, upgradeTokens]
  );
  const onRemoveFromReel = useCallback(
    (reelIdx: number, tileIdx: number) => {
      removeFromReel(reelIdx, tileIdx);
      setSelectedTileKey('');
      setPreselectedTileKey('');
      setUpgradeTokens(upgradeTokens + 1);
    },
    [insertIntoReel, upgradeTokens]
  );

  return (
    <ScWrapper className={uiState === 'editor' ? 'panel-open' : ''}>
      <ScPanel>
        <h2>{editorMode === 'hand' ? `choose your upgrade (${upgradeTokens} tokens)` : 'insert into reel'}</h2>
        <ScBody>
          {editorMode === 'hand' ? (
            <TileSelector
              active={uiState === 'editor'}
              selectedTileKey={preselectedTileKey}
              onSelectTileKey={(tileKey: string) => setPreselectedTileKey(tileKey)}
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
              preselectedTileKey,
              upgradeTokens,
              setSelectedTileKey,
              setPreselectedTileKey,
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
  preselectedTileKey: string,
  upgradeTokens: number,
  setSelectedTileKey: Function,
  setPreselectedTileKey: Function,
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

  if (editorMode === 'hand') {
    return (
      <>
        <CloseButton />
        <Button
          buttonStyle={preselectedTileKey === '' || upgradeTokens === 0 ? 'normal' : 'special'}
          onClick={() => {
            setSelectedTileKey(preselectedTileKey);
            setEditorMode('reel');
          }}
        >
          {!preselectedTileKey ? 'EDIT REEL' : 'INSERT'}
        </Button>
      </>
    );
  } else if (editorMode === 'reel') {
    if (upgradeTokens === 0) {
      return <CloseButton />;
    }

    if (preselectedTileKey !== '') {
      return (
        <>
          <Button
            onClick={() => {
              setSelectedTileKey('');
              setPreselectedTileKey('');
              setEditorMode('hand');
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
            setSelectedTileKey('');
            setPreselectedTileKey('');
            setEditorMode('hand');
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
