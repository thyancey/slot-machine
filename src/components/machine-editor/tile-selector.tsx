import styled from 'styled-components';
import { Tile, tileGlossary } from '../../store/data';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import MetalGlint from '../metal-glint';

const ScWrapper = styled.div`
  overflow-y: auto;
  padding: 1rem;
`;

const ScTiles = styled.ul`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  justify-content: center;
  align-content: flex-start;
  gap: 3rem;
  overflow-y: auto;

  padding-bottom: 2rem;
`;

const ScTile = styled.li`
  background-color: var(--color-white);
  /* border: var(--border-width-small) solid var(--color-); */
  box-shadow: 0px 3px 2px 6px var(--color-green-dark);

  &:first-child {
    box-shadow: 3px 3px 2px 6px var(--color-green-dark);
  }
  &:last-child {
    box-shadow: -3px 3px 2px 6px var(--color-green-dark);
  }

  padding: 0;
  list-style: none;
  padding: 1rem;
  /* border: var(--border-width-small) solid var(--color-white); */
  border-radius: 0.5rem;
  overflow: hidden;
  z-index: 1;
  position: relative;

  display: flex;
  align-items: center;
  width: 8rem;
  height: 11rem;

  cursor: pointer;

  transition: background-color 0.2s;

  &.chosen {
    background-color: var(--color-white);
  }

  &:hover {
    background-color: var(--color-yellow-light);

    &.chosen {
    }
  }

  img {
    /* height: 100%; */
    width: 80%;
    /* top:0; */
    left: 10%;
    position: absolute;
  }
`;

interface HandTile {
  deckIdx: number;
  tile: Tile;
}

interface Props {
  selectedTileIdx: number;
  onSelectTile: (deckIdx: number) => void;
}
function TileSelector({ selectedTileIdx, onSelectTile }: Props) {
  const { deckState, tileDeck } = useContext(AppContext);
  // console.log('deckState', deckState, tileDeck);
  // console.log('selectedIdx', selectedTileIdx);

  const tiles: HandTile[] = useMemo(() => {
    return deckState.drawn.map((deckIdx) => ({
      deckIdx,
      tile: tileGlossary[tileDeck[deckIdx]],
    }));
  }, [deckState, tileDeck]);

  const selectedTile = useMemo(() => {
    return tiles.find((tile) => tile.deckIdx === selectedTileIdx)?.tile || null;
  }, [selectedTileIdx, tiles]);

  return (
    <ScWrapper>
      <ScTiles>
        {tiles.map((handTile) => (
          <ScTile
            className={handTile.deckIdx === selectedTileIdx ? 'chosen' : ''}
            key={handTile.deckIdx}
            onClick={() => onSelectTile(handTile.deckIdx)}
          >
            <img src={handTile.tile.img || ''} />
            {handTile.deckIdx === selectedTileIdx && (
              <MetalGlint glintTheme={handTile.deckIdx === selectedTileIdx ? 'gold' : 'silver'} />
            )}
          </ScTile>
        ))}
      </ScTiles>
      {selectedTile && <h3>{selectedTile.label}</h3>}
    </ScWrapper>
  );
}

export default TileSelector;
