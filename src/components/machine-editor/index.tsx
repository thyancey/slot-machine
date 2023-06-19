import styled from 'styled-components';
import Button from '../button';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../store/appcontext';
import TileSelector from './tile-selector';
import ReelEditor from './reel-editor';
import { discardTiles } from './utils';

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

function MachineEditor() {
  const {
    uiState,
    setUiState,
    setSelectedTileIdx,
    insertIntoReel,
    removeFromReel,
    insertReel,
    upgradeTokens,
    setUpgradeTokens,
    setDeckState,
    deckState,
  } = useContext(AppContext);
  const [preselectedTileIdx, setPreselectedTileIdx] = useState(-1);
  const [editorMode, setEditorMode] = useState<MachineEditorMode>('hand');

  useEffect(() => {
    if (uiState !== 'editor') {
      if (upgradeTokens === 0) {
        setEditorMode('reel');
      } else {
        setEditorMode('hand');
      }
      setPreselectedTileIdx(-1);
    }
  }, [uiState, upgradeTokens]);

  const closeEditor = useCallback(() => {
    setSelectedTileIdx(-1);
    setPreselectedTileIdx(-1);
    setDeckState(discardTiles(deckState.drawn, deckState));
    setUiState('game');
  }, [deckState, setSelectedTileIdx, setPreselectedTileIdx, setDeckState, setUiState]);

  const onInsertIntoReel = useCallback(
    (reelIdx: number, tileIdx: number) => {
      insertIntoReel(reelIdx, tileIdx);
      setSelectedTileIdx(-1);
      setPreselectedTileIdx(-1);
      setUpgradeTokens(upgradeTokens - 1);
    },
    [insertIntoReel, upgradeTokens, setSelectedTileIdx, setPreselectedTileIdx, setUpgradeTokens]
  );
  const onInsertReel = useCallback(
    (reelIdx: number) => {
      insertReel(reelIdx);
      setSelectedTileIdx(-1);
      setPreselectedTileIdx(-1);
      setUpgradeTokens(upgradeTokens - 1);
    },
    [upgradeTokens, setSelectedTileIdx, insertReel, setUpgradeTokens]
  );
  const onRemoveFromReel = useCallback(
    (reelIdx: number, tileIdx: number) => {
      removeFromReel(reelIdx, tileIdx);
      setSelectedTileIdx(-1);
      setPreselectedTileIdx(-1);
      setUpgradeTokens(upgradeTokens + 1);
    },
    [upgradeTokens, removeFromReel, setSelectedTileIdx, setPreselectedTileIdx, setUpgradeTokens]
  );

  return (
    <ScWrapper className={uiState === 'editor' ? 'panel-open' : ''}>
      <ScPanel>
        <h2>{editorMode === 'hand' ? `choose your upgrade (${upgradeTokens} tokens)` : 'insert into reel'}</h2>
        <ScBody>
          {editorMode === 'hand' ? (
            <TileSelector
              active={uiState === 'editor'}
              selectedTileIdx={preselectedTileIdx}
              onSelectTile={(deckIdx: number) => setPreselectedTileIdx(deckIdx)}
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
              preselectedTileIdx,
              upgradeTokens,
              setSelectedTileIdx,
              setPreselectedTileIdx,
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
  preselectedTileIdx: number,
  upgradeTokens: number,
  setSelectedTileIdx: (idx: number) => void,
  setPreselectedTileIdx: (idx: number) => void,
  setEditorMode: (str: MachineEditorMode) => void,
  closeEditor: () => void
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
          buttonStyle={preselectedTileIdx === -1 || upgradeTokens === 0 ? 'normal' : 'special'}
          onClick={() => {
            setSelectedTileIdx(preselectedTileIdx);
            setEditorMode('reel');
          }}
        >
          {!preselectedTileIdx ? 'EDIT REEL' : 'INSERT'}
        </Button>
      </>
    );
  } else if (editorMode === 'reel') {
    if (upgradeTokens === 0) {
      return <CloseButton />;
    }

    if (preselectedTileIdx !== -1) {
      return (
        <>
          <Button
            onClick={() => {
              setSelectedTileIdx(-1);
              setPreselectedTileIdx(-1);
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
            setSelectedTileIdx(-1);
            setPreselectedTileIdx(-1);
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
