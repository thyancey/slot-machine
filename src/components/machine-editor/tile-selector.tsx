import styled from 'styled-components';
import { tileGlossary } from '../../store/data';
import { useEffect, useState } from 'react';
import { pickRandomFromArray } from '../../utils';

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

const NUM_CHOICES = 4;

interface Props {
  active: boolean;
  selectedTileKey: string;
  onSelectTileKey: Function;
}
function TileSelector({ active, selectedTileKey, onSelectTileKey }: Props) {
  const [tiles, setTileKeys] = useState<string[]>([]);

  useEffect(() => {
    if (active) {
      setTileKeys(pickRandomFromArray(NUM_CHOICES, Object.keys(tileGlossary)));
    }
  }, [active]);

  return (
    <ScWrapper>
      {tiles.map((key: string) => (
        <ScTile
          className={key === selectedTileKey ? 'chosen' : ''}
          key={key}
          onClick={() => onSelectTileKey(key)}
        >
          <img src={tileGlossary[key].img || ''} />
        </ScTile>
      ))}
    </ScWrapper>
  );
}

export default TileSelector;
