import styled from 'styled-components';
import { reelItemDef } from './slotmachine/data';
import Button from './button';

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
    border-bottom: 0.25rem solid var(--color-white);
  }
`;

const ScItemContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  overflow-y: auto;
  padding: 1rem;

  justify-content: center;
  gap: 1rem;
`;

const ScItemLabel = styled.li`
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

  &:hover {
    background-color: var(--color-pink);
  }

  img {
    height: 100%;
  }
`;

const ScBg = styled.div`
  position: absolute;
  inset: 0;
  background-color: black;
  opacity: 0.5;
`;

const ScFooter = styled.div`
  padding: 1rem;
  border-top: 0.25rem solid var(--color-white);
`;

const getItems = () => {
  return Object.keys(reelItemDef).map((key: string) => (
    <ScItemLabel key={key}>
      <img src={reelItemDef[key].img || ''} />
    </ScItemLabel>
  ));
};

interface Props {
  isOpen: boolean;
  onClose: Function;
}
function ItemSelector({ isOpen, onClose }: Props) {
  return (
    <ScWrapper className={isOpen ? 'panel-open' : ''}>
      <ScPanel>
        <h2>{'choose your item'}</h2>
        <ScItemContainer>{getItems().map((item) => item)}</ScItemContainer>
        <ScFooter>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            {'skip'}
          </Button>
        </ScFooter>
      </ScPanel>
      <ScBg />
    </ScWrapper>
  );
}

export default ItemSelector;
