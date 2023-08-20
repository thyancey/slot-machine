import styled from 'styled-components';
import Button from '../button';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../store/appcontext';
import TileSelector from './tile-selector';
import ReelEditor from './reel-editor';
import CardPile from './cardpile';
import MetalGlint from '../metal-glint';
import { MixinBorders } from '../../utils/styles';
import { discardTiles } from '../slotmachine/utils';

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
  inset: 4rem;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--color-white);

  gap: 2rem;

  border-radius: 1rem;
  padding: 3rem 2rem;
`;

const ScHeader = styled.div`
  ${MixinBorders('--color-yellow-dark', '--color-yellow-light')}
  border-bottom: 0;
  background-color: var(--color-black);

  p {
    margin-top: -1rem;
    margin-bottom: 0.5rem;
  }
  h2 {
    flex: 1;
    padding: 1rem;
  }
`;

const ScBody = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;

  justify-content: center;
  gap: 1rem;
  position: relative;

  ${MixinBorders('--color-yellow-dark', '--color-yellow-light')}
  background-color: var(--color-black);
`;

const ScBg = styled.div`
  position: absolute;
  inset: 0;
  background-color: black;
  opacity: 0.5;
`;

const ScFooter = styled.div`
  ${MixinBorders('--color-yellow-dark', '--color-yellow-light')}
  border-top: 0;
  background-color: var(--color-black);
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

const ScDrawPile = styled.div`
  position: absolute;
  left: 5rem;
  bottom: 2rem;
`;
const ScDiscardPile = styled.div`
  position: absolute;
  right: 7rem;
  bottom: 2rem;
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
    incrementUpgradeTokens,
    setDeckState,
    deckState,
    discardCards,
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
      incrementUpgradeTokens(-1);
      discardCards(tileIdx);
    },
    [insertIntoReel, setSelectedTileIdx, setPreselectedTileIdx, incrementUpgradeTokens, discardCards]
  );
  const onInsertReel = useCallback(
    (reelIdx: number) => {
      insertReel(reelIdx);
      setSelectedTileIdx(-1);
      setPreselectedTileIdx(-1);
      incrementUpgradeTokens(-1);
    },
    [setSelectedTileIdx, insertReel, incrementUpgradeTokens]
  );
  const onRemoveFromReel = useCallback(
    (reelIdx: number, tileIdx: number) => {
      removeFromReel(reelIdx, tileIdx);
      setSelectedTileIdx(-1);
      setPreselectedTileIdx(-1);
      incrementUpgradeTokens(-1);
    },
    [removeFromReel, setSelectedTileIdx, setPreselectedTileIdx, incrementUpgradeTokens]
  );

  return (
    <ScWrapper className={uiState === 'editor' ? 'panel-open' : ''}>
      <ScPanel>
        <ScHeader>
          <h2>{editorMode === 'hand' ? `choose your upgrade` : 'edit reel'}</h2>
          <p>{`${upgradeTokens} moves available`}</p>
        </ScHeader>
        <ScBody>
          {editorMode === 'hand' ? (
            <>
              <TileSelector
                selectedTileIdx={preselectedTileIdx}
                onSelectTile={(deckIdx: number) => setPreselectedTileIdx(deckIdx)}
              />
              
              <ScDrawPile>
                <CardPile type={'draw'} cards={deckState.draw} />
              </ScDrawPile>
              <ScDiscardPile>
                <CardPile type={'discard'} cards={deckState.discard} />
              </ScDiscardPile>
            </>
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
              incrementUpgradeTokens,
              setEditorMode,
              discardCards,
              closeEditor
            )}
          </ScFooterButtons>
        </ScFooter>
        <MetalGlint glintTheme='ui' />
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
  incrementUpgradeTokens: (idx: number) => void,
  setEditorMode: (str: MachineEditorMode) => void,
  discardCards: (idx: number) => void,
  closeEditor: () => void
) => {
  // console.log('preselectedTileIdx', preselectedTileIdx);
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
          {preselectedTileIdx === -1 ? 'EDIT REEL' : 'INSERT'}
        </Button>
      </>
    );
  } else if (editorMode === 'reel') {
    if (upgradeTokens === 0) {
      return (
        <>
          <CloseButton />
          <Button
            buttonStyle='special'
            onClick={() => {
              incrementUpgradeTokens(3);
            }}
          >
            {'(debug) MORE TOKENS'}
          </Button>
        </>
      );
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
            discardCards(-1);
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
