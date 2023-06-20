import styled from 'styled-components';
import { Tile, tileGlossary } from '../../store/data';
import { useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';

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
  deckIdx: number;
  tile: Tile;
}

interface Props {
  active: boolean;
  selectedTileIdx: number;
  onSelectTile: (deckIdx: number) => void;
}
function TileSelector({ active, selectedTileIdx, onSelectTile }: Props) {
  const { deckState, tileDeck, drawCards } = useContext(AppContext);

  // checks prevent an issue where the whole deck gets drawn at once
  /*
  useEffect(() => {
    if (active) {
      if (deckState.drawn.length === 0) {
        drawCards(3);
      }
    }
  }, [active, drawCards, deckState]);
  */

  const tiles: HandTile[] = useMemo(() => {
    return deckState.drawn.map((deckIdx) => ({
      deckIdx,
      tile: tileGlossary[tileDeck[deckIdx]],
    }));
  }, [deckState, tileDeck]);

  return (
    <ScWrapper>
      {tiles.map((handTile) => (
        <ScTile
          className={handTile.deckIdx === selectedTileIdx ? 'chosen' : ''}
          key={handTile.deckIdx}
          onClick={() => onSelectTile(handTile.deckIdx)}
        >
          <img src={handTile.tile.img || ''} />
        </ScTile>
      ))}
    </ScWrapper>
  );
}

export default TileSelector;
