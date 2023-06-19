import styled from 'styled-components';
import { DeckState, Tile, tileGlossary } from '../../store/data';
import { useEffect, useContext, useMemo } from 'react';
import { clamp } from '../../utils';
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

/**
 * Pull cards from the top of the deck. If there is no more draw pile, refill it from the discard. Do not
 */
export const drawTile = (deckState: DeckState, noRefill?: boolean) => {
  if (deckState.draw.length === 0) {
    if (noRefill || deckState.discard.length === 0) {
      console.log('!! no more cards!');
      // well apparently theres no cards left, so just give back what you had
      return deckState;
    }

    // refill / shuffle the deck
    const shuffledDraw = deckState.discard.sort(() => Math.random() - 0.5);
    deckState.draw = shuffledDraw;
    deckState.discard = [];
  }

  return {
    drawn: [...deckState.drawn, deckState.draw[deckState.draw.length - 1]],
    draw: deckState.draw.slice(0, -1),
    discard: deckState.discard,
  };
};

export const drawTiles = (numToDraw: number, deckState: DeckState) => {
  const availableToDraw = clamp(numToDraw, 1, deckState.draw.length + deckState.discard.length);
  const operations = Array.from(Array(availableToDraw).keys());

  return operations.reduce((acc, _) => {
    return drawTile(acc);
  }, deckState);
};

export const discardTiles = (discardIdxs: number[], deckState: DeckState) => {
  return {
    drawn: deckState.drawn.filter((tileIdx) => !discardIdxs.includes(tileIdx)),
    draw: deckState.draw,
    discard: [...deckState.discard, ...discardIdxs],
  };
};

const NUM_CHOICES = 3;

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
      const afterState = drawTiles(NUM_CHOICES, deckState);
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
