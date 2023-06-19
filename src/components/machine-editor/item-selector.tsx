import styled from 'styled-components';
import { reelItemDef } from '../slotmachine/data';
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

const ScItemOption = styled.li`
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
  selectedItemKey: string;
  onSelectItemKey: Function;
}
function ItemSelector({ active, selectedItemKey, onSelectItemKey }: Props) {
  const [itemKeys, setItemKeys] = useState<string[]>([]);

  useEffect(() => {
    if (active) {
      setItemKeys(pickRandomFromArray(NUM_CHOICES, Object.keys(reelItemDef)));
    }
  }, [active]);

  return (
    <ScWrapper>
      {itemKeys.map((key: string) => (
        <ScItemOption
          className={key === selectedItemKey ? 'chosen' : ''}
          key={key}
          onClick={() => onSelectItemKey(key)}
        >
          <img src={reelItemDef[key].img || ''} />
        </ScItemOption>
      ))}
    </ScWrapper>
  );
}

export default ItemSelector;