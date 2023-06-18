import styled from 'styled-components';
import { Fragment, useCallback, useContext } from 'react';
import { AppContext } from '../../store/appcontext';
import { reelItemDef } from '../slotmachine/data';

const ScWrapper = styled.ul`
  background-color: var(--color-grey);
  flex: 1;

  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const ScReelContainer = styled.li`
  flex: 1;
  margin: 1rem;
  max-width: 15rem;
`;

const ScReelItems = styled.ul`
`;

const ScInsertButton = styled.button`
  width: 100%;
  font-size: 1rem;
  padding: 0rem;
  border: 0.125rem dashed var(--color-green);
  background-color: var(--color-grey);
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;

  transition: padding 0.2s, background-color 0.2s;

  cursor: pointer;

  &:hover {
    padding: 1rem;
    background-color: var(--color-green);
  }
`;

const ScReelContent = styled.div`
  height: 5rem;
  background-color: var(--color-white);
  text-align: center;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  position: relative;

  span{

  }

  img {
    height: 100%;
    filter: drop-shadow(0.2rem 0.2rem 0.1rem var(--color-black));
  }
`;

const ScRemoveLabel = styled.div`
  width:100%;
  height:100%;
  position:absolute;
  display:flex;
  align-items: center;
  justify-content: center;
  /* border: 0.125rem dashed var(--color-pink); */

  cursor: pointer;
  opacity: 0;
  transition: opacity .2s;

  &:hover{
    opacity: 1;
  }

  span{
    color: var(--color-white);
    z-index:1;
  }
  >div{
    position:absolute;
    background-color: var(--color-pink);
    width:100%;
    height:100%;
    opacity: .9;
  }
`

interface InsertButtonProps {
  onClick: Function;
}
const InsertButton = ({ onClick }: InsertButtonProps) => {
  return <ScInsertButton onClick={() => onClick()}>{'insert'}</ScInsertButton>;
};

interface Props {}
function ReelEditor({}: Props) {
  const { reelStates, insertIntoReel, removeFromReel } = useContext(AppContext);

  const onInsertClick = useCallback(
    (reelIdx: number, idx: number) => {
      insertIntoReel(reelIdx, idx);
    },
    [insertIntoReel]
  );

  const onRemoveClick = useCallback(
    (reelIdx: number, idx: number) => {
      removeFromReel(reelIdx, idx);
    },
    [removeFromReel]
  );

  return (
    <ScWrapper>
      {reelStates.map((rd, rIdx) => (
        <ScReelContainer key={rIdx}>
          <span>{`reel ${rIdx + 1}`}</span>
          <ScReelItems>
            <InsertButton key={`rc_-1`} onClick={() => onInsertClick(rIdx, -1)} />
            {rd.items.map((ri, itemIdx) => (
              <Fragment key={`rc_${itemIdx}`}>
                <ScReelContent>
                  <img src={reelItemDef[ri].img} />
                  <ScRemoveLabel onClick={() => onRemoveClick(rIdx, itemIdx)}>
                    <span>{'REMOVE'}</span>
                    <div />
                  </ScRemoveLabel>
                </ScReelContent>
                <InsertButton onClick={() => onInsertClick(rIdx, itemIdx)} />
              </Fragment>
            ))}
          </ScReelItems>
        </ScReelContainer>
      ))}
    </ScWrapper>
  );
}

export default ReelEditor;
