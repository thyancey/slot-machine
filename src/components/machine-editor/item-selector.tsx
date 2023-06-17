import styled from 'styled-components';
import { reelItemDef } from '../slotmachine/data';
import { useContext } from 'react';
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
    background-color: var(--color-purple);

    &.chosen {
      background-color: var(--color-pink);
    }
  }

  img {
    height: 100%;
  }
`;

interface Props {}
function ItemSelector({}: Props) {
  const { setSelectedItemKey, selectedItemKey } = useContext(AppContext);

  return (
    <ScWrapper>
      {Object.keys(reelItemDef).map((key: string) => (
        <ScItemOption
          className={key === selectedItemKey ? 'chosen' : ''}
          key={key}
          onClick={() => setSelectedItemKey(key)}
        >
          <img src={reelItemDef[key].img || ''} />
        </ScItemOption>
      ))}
    </ScWrapper>
  );
}

export default ItemSelector;
