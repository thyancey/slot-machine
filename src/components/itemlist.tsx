import { useState } from 'react';
import styled from 'styled-components';
import { reelItemDef } from './slotmachine/data';

const ScWrapper = styled.aside`
  position: absolute;
  left:-20rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  height: 80%;
  transition: left .5s;
  background-color: var(--color-grey);

  &.panel-open {
    left: -.75rem;
  }
`;

const ScPanel = styled.div`
  border: 0.75rem solid var(--color-pink);
  border-radius: 0 1.5rem 1.5rem 0;
  width: 20rem;
  height: 100%;
  overflow-y: auto;
`;

const ScItemLabel = styled.li`
  margin: 0;
  padding: 0;
  list-style: none;
  padding: .5rem 1rem;
  border-bottom: 1px solid var(--color-purple);
  height: 6rem;

  display: flex;
  align-items: center;

  img{
    height:100%;
  }

  span{
    margin-left: 1rem;
    font-size: 2rem;
  }
`;

const ScTab = styled.div`
  position: absolute;
  left: calc(100% - 0.75rem);
  top: 50%;
  transform: translateY(-50%);
  border: 0.75rem solid var(--color-pink);
  border-radius: 0 1.5rem 1.5rem 0;
  width: 4rem;
  height: 10rem;

  background-color: var(--color-grey);
  cursor: pointer;
  >div{
    position: absolute;
    transform-origin: 0 0;
    transform: rotate(90deg);
    top: 1rem;
    left: 2.8rem;

    font-size:2rem;
  }
  &:hover{
    background-color: var(--color-purple);
  }
`;

const getItems = () => {
  return Object.keys(reelItemDef).map((key: string) => (
    <ScItemLabel key={key}>
      <img src={reelItemDef[key].img || ''} />
      <span>{` : ${reelItemDef[key].score}`}</span>
    </ScItemLabel>
  ));
}

function ItemList() {
  const [open, setOpen] = useState(false);
  return (
    <ScWrapper className={open ? 'panel-open' : ''}>
      <ScPanel>
        {getItems().map(item => (item))}
      </ScPanel>
      <ScTab
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div>
          <span>{'items'}</span>
        </div>
      </ScTab>
    </ScWrapper>
  );
}

export default ItemList;
