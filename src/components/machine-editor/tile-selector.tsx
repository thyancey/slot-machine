import styled from 'styled-components';
import { MAX_HAND_SIZE, Tile, tileGlossary } from '../../store/data';
import { useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import { drawTiles } from './utils';

const ScWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  overflow-y: auto;
  padding: 1rem;

  justify-content: center;
  gap: 1rem;
`;

const ScTile = styled.li`
  padding: 0;
  list-style: none;
  padding: 1rem;
  border: var(--border-width-small) solid var(--color-pink);
  border-radius: 1.5rem;

  display: flex;
  align-items: center;
  width: 10rem;
  height: 10rem;

  cursor: pointer;

  transition: background-color 0.2s;

  &.chosen {
    background-color: var(--color-pink);
  }

  &:hover {
    background-color: var(--color-pink);

    &.chosen {
      background-color: var(--color-pink);
    }
  }

  img {
    height: 100%;
  }
`;

interface HandTile {
  deckIdx: number,
  tile: Tile
}

interface Props {
  active: boolean;
  selectedTileIdx: number;
  onSelectTile: (deckIdx: number) => void;
}
function TileSelector({ active, selectedTileIdx, onSelectTile }: Props) {
  const { deckState, setDeckState, tileDeck } = useContext(AppContext);

  // when loading screen, draw some cards
  useEffect(() => {
    if (active) {
      const afterState = drawTiles(MAX_HAND_SIZE, deckState);
      setDeckState(afterState);
    }
  }, [active]);

  const tiles: HandTile[] = useMemo(() => {
    return deckState.drawn.map((deckIdx) => ({
      deckIdx,
      tile: tileGlossary[tileDeck[deckIdx]]
    }));
  }, [deckState]);

  return (
    <ScWrapper>
      {tiles.map((handTile) => (
        <ScTile className={handTile.deckIdx === selectedTileIdx ? 'chosen' : ''} key={handTile.deckIdx} onClick={() => onSelectTile(handTile.deckIdx)}>
          <img src={handTile.tile.img || ''} />
        </ScTile>
      ))}
    </ScWrapper>
  );
}

export default TileSelector;
