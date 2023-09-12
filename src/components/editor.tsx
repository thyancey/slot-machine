import { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { AppContext } from '../store/appcontext';
import { COST_UPGRADE, Tile, tileGlossary } from '../store/data';
import { convertToDollaridoos } from '../utils';

const ScWrapper = styled.aside`
  display: grid;
  grid-template-columns: auto 6rem;
  grid-template-rows: min-content 10rem minmax(5rem, min-content);

  width: 100%;

  gap: 0.5rem;
  padding: 1rem;

  background-color: var(--color-black);
  border-top: 0.75rem solid var(--color-green);

  > h2 {
    font-size: 2.5rem;
  }
`;

const ScSelectedInfo = styled.div`
  grid-column: 1 / span 1;
  grid-row: 3;
  /* padding: 0.5rem 1rem 1rem 1rem; */
  text-align: center;

  border: .75rem dashed var(--color-green);
  margin: 0 1rem 0 1rem;
  border-radius: 2rem;
  padding: 1rem;
  padding-bottom: 1.5rem;

  > h3{
    font-size: 2.5rem;
  }
  > p {
    font-size: 1.5rem;
  }
`;
const ScHand = styled.div`
  grid-column: 1;
  grid-row: 2;
`;

const ScInstructions = styled.h2`
  grid-column: 1 / span 1;
  grid-row: 1;
  text-align: center;
  padding: 0.25rem;
`;
const ScCancelContainer = styled.div`
  grid-column: 2;
  grid-row: 2 / span 2;

  padding: 1rem 1rem 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ScCancelButton = styled.button`
  cursor: pointer;
  background-color: var(--co-enemy);
  font-size: 3rem;
  height: 100%;
  width: 100%;
  border-radius: 1rem;

  &:hover {
    background-color: var(--co-enemy-highlight);
  }
`;

const ScCards = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  flex: 1;
  justify-content: space-around;
  padding: 1rem;

  gap: 1rem;
  height: 100%;

  position: relative;
`;

const ScCard = styled.li`
  background-color: var(--color-white);
  z-index: 1;

  width: 25%;
  height: 100%;
  border-radius: 2rem;
  padding: 0.5rem;

  overflow: hidden;

  cursor: pointer;

  transition: background-color 0.2s;

  &.chosen {
    border: 0.75rem dashed var(--color-green);
  }

  &:hover {
    background-color: var(--co-editor-secondary);

    &.chosen {
    }
  }

  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

interface HandTile {
  deckIdx: number;
  tile: Tile;
}

function Editor() {
  const {
    uiState,
    setUiState,
    selectedTileIdx,
    setSelectedTileIdx,
    setEditorState,
    discardCards,
    deckState,
    tileDeck,
  } = useContext(AppContext);

  const tiles: HandTile[] = useMemo(() => {
    return deckState.drawn.map((deckIdx) => ({
      deckIdx,
      tile: tileGlossary[tileDeck[deckIdx]],
    }));
  }, [deckState, tileDeck]);

  const selectedHandTile = useMemo(() => {
    return tiles.find((tile) => tile.deckIdx === selectedTileIdx) || null;
  }, [selectedTileIdx, tiles]);

  const chooseTileIdx = (idx: number) => {
    if (idx === selectedTileIdx) {
      setSelectedTileIdx(-1);
      setEditorState('hand');
    } else {
      setSelectedTileIdx(idx);
      setEditorState('reel');
    }
  };

  // console.log(`selectedTileIdx: ${selectedTileIdx}, uiState: ${uiState}, editorState: ${editorState}`);

  return (
    <ScWrapper className={uiState.indexOf('editor') > -1 ? 'panel-open' : ''}>
      <ScInstructions>
        {selectedHandTile ? `2: Select a reel -${convertToDollaridoos(COST_UPGRADE)}` : '1: Select a tile'}
      </ScInstructions>
      <ScHand>
        <ScCards>
          {tiles.map((handTile) => (
            <ScCard
              className={handTile.deckIdx === selectedTileIdx ? 'chosen' : ''}
              key={handTile.deckIdx}
              onClick={() => chooseTileIdx(handTile.deckIdx)}
            >
              <img src={handTile.tile.img || ''} />
            </ScCard>
          ))}
        </ScCards>
      </ScHand>
      <ScSelectedInfo>
        {selectedHandTile && (
          <>
            <h3>{selectedHandTile.tile.label}</h3>
            <p>{selectedHandTile.tile.debugLabel}</p>
          </>
        )}
      </ScSelectedInfo>
      <ScCancelContainer>
        <ScCancelButton
          onClick={() => {
            discardCards(-1);
            setEditorState('');
            setUiState('game');
          }}
        >
          {'X'}
        </ScCancelButton>
      </ScCancelContainer>
    </ScWrapper>
  );
}

export default Editor;
