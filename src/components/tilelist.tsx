import { useState, useContext } from 'react';
import styled from 'styled-components';
import { TileKeyCollection, tileGlossary } from '../store/data';
import { AppContext } from '../store/appcontext';

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
  /* border: 0.75rem solid var(--color-black); */
  border-radius: 0 1.5rem 1.5rem 0;
  width: 20rem;
  height: 100%;
  overflow-y: auto;
`;

const ScTile = styled.li`
  margin: 0;
  padding: 0;
  list-style: none;
  padding: .5rem 1rem;
  /* border-bottom: 1px solid var(--color-black); */
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
  /* border: 0.75rem solid var(--color-black); */
  border-radius: 0 1.5rem 1.5rem 0;
  width: 4rem;
  height: 10rem;

  /* background-color: var(--color-grey); */
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
    /* background-color: var(--color-black); */
  }
`;

// const renderTiles = () => {
//   return Object.keys(tileGlossary).map((key: string) => (
//     <ScTile key={key}>
//       <img src={tileGlossary[key].img || ''} />
//       <span>{` : ${tileGlossary[key].score}`}</span>
//     </ScTile>
//   ));
// }

const renderTiles = (tileDeck: TileKeyCollection) => {
  return tileDeck.map((tileKey: string, idx: number) => (
    <ScTile key={`${idx}-${tileKey}`}>
      <img src={tileGlossary[tileKey].img || ''} />
      <span>{` : ${tileGlossary[tileKey].score}`}</span>
    </ScTile>
  ));
}

function TileList() {
  const [open, setOpen] = useState(false);
  const { tileDeck } = useContext(AppContext);

  return (
    <ScWrapper className={open ? 'panel-open' : ''}>
      <ScPanel>
        {renderTiles(tileDeck).map(tile => (tile))}
      </ScPanel>
      <ScTab
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div>
          <span>{'tiles'}</span>
        </div>
      </ScTab>
    </ScWrapper>
  );
}

export default TileList;
