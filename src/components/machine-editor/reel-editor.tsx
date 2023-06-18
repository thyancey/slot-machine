import styled from 'styled-components';
import { Fragment, useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import { MAX_REELS, ReelItem, reelItemDef } from '../slotmachine/data';

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

const ScReelItems = styled.ul``;

const ScInsertButton = styled.button`
  font-size: 1rem;
  background-color: var(--color-grey);
  border: 0.125rem dashed var(--color-pink);
  cursor: pointer;

  &:hover {
    background-color: var(--color-pink);
    /* border: 0.25rem solid var(--color-pink); */
  }
`;

const ScInsertItemButton = styled(ScInsertButton)`
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  width: 100%;
  transition: height 0.2s, background-color 0.2s;
  display:flex;
  align-items: center;
  justify-content: center;
  position: relative;

  height: 2rem;
  
  >*{
    position:absolute;
  }
  span{
    opacity:1;
    transition: opacity 0.3s;
  }
  img{
    opacity: 0;
    transition: opacity 0.3s;
    filter: var(--filter-shadow1);
  }

  &:hover {
    height: 5rem;
    span{
      opacity:0;
    }
    img{
      opacity: 1;
    }
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

  span {
  }

  img {
    height: 100%;
    filter: var(--filter-shadow1);
  }
`;

const ScRemoveLabel = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: 0.125rem dashed var(--color-pink); */

  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  span {
    color: var(--color-white);
    z-index: 1;
  }
  > div {
    position: absolute;
    background-color: var(--color-pink);
    width: 100%;
    height: 100%;
    opacity: 0.9;
  }
`;

interface InsertButtonProps {
  onClick: Function;
  reelItem: ReelItem;
}
const InsertItemButton = ({ onClick, reelItem }: InsertButtonProps) => {
  return (
    <ScInsertItemButton onClick={() => onClick()}>
      <span>{'insert'}</span>
      <img src={reelItem.img} />
    </ScInsertItemButton>
  );
};

interface Props {
  onInsertIntoReel: Function;
  onRemoveFromReel: Function;
  onInsertReel: Function;
}
function ReelEditor({ onInsertIntoReel, onRemoveFromReel, onInsertReel }: Props) {
  const { reelStates, selectedItemKey } = useContext(AppContext);

  const canAddReels = useMemo(() => {
    return reelStates.length < MAX_REELS;
  }, [reelStates]);

  const canRemoveItems = useMemo(() => {
    return !(reelStates.length === 1 && reelStates[0].items.length === 1);
  }, [ reelStates ]);

  const reelItem = useMemo(() => {
    return reelItemDef[selectedItemKey];
  }, [selectedItemKey]);


  return (
    <ScWrapper>
      {canAddReels && (
        <ScReelContainer>
          <h3>{'NEW REEL'}</h3>
          <InsertItemButton reelItem={reelItem} onClick={() => onInsertReel(-1)} />
        </ScReelContainer>
      )}
      {reelStates.map((rd, rIdx) => (
        <ScReelContainer key={rIdx}>
          <h3>{`REEL ${rIdx + 1}`}</h3>
          <ScReelItems>
            <InsertItemButton key={`rc_-1`} reelItem={reelItem} onClick={() => onInsertIntoReel(rIdx, -1)} />
            {rd.items.map((ri, itemIdx) => (
              <Fragment key={`rc_${itemIdx}`}>
                <ScReelContent>
                  <img src={reelItemDef[ri].img} />
                  {canRemoveItems && <ScRemoveLabel onClick={() => onRemoveFromReel(rIdx, itemIdx)}>
                    <span>{'REMOVE'}</span>
                    <div />
                  </ScRemoveLabel> }
                </ScReelContent>
                <InsertItemButton reelItem={reelItem} onClick={() => onInsertIntoReel(rIdx, itemIdx)} />
              </Fragment>
            ))}
          </ScReelItems>
        </ScReelContainer>
      ))}
      {canAddReels && (
        <ScReelContainer>
          <h3>{'NEW REEL'}</h3>
          <InsertItemButton reelItem={reelItem} onClick={() => onInsertReel(reelStates.length - 1)} />
        </ScReelContainer>
      )}
    </ScWrapper>
  );
}

export default ReelEditor;
