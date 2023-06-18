import styled from 'styled-components';
import { Fragment, useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import { MAX_REELS, reelItemDef } from '../slotmachine/data';

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
  border: 0.125rem dashed var(--color-green);
  cursor: pointer;

  &:hover {
    background-color: var(--color-green);
  }
`;

const ScInsertItemButton = styled(ScInsertButton)`
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  width: 100%;
  transition: padding 0.2s, background-color 0.2s;

  &:hover {
    padding: 1rem;
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
    filter: drop-shadow(0.2rem 0.2rem 0.1rem var(--color-black));
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
}
const InsertItemButton = ({ onClick }: InsertButtonProps) => {
  return <ScInsertItemButton onClick={() => onClick()}>{'insert'}</ScInsertItemButton>;
};

interface Props {}
function ReelEditor({}: Props) {
  const { reelStates, insertIntoReel, removeFromReel, insertReel } = useContext(AppContext);

  const canAddReels = useMemo(() => {
    return reelStates.length < MAX_REELS;
  }, [reelStates]);

  return (
    <ScWrapper>
      {canAddReels && (
        <ScReelContainer>
          <h3>{'NEW REEL'}</h3>
          <InsertItemButton onClick={() => insertReel(-1)} />
        </ScReelContainer>
      )}
      {reelStates.map((rd, rIdx) => (
        <ScReelContainer key={rIdx}>
          <h3>{`REEL ${rIdx + 1}`}</h3>
          <ScReelItems>
            <InsertItemButton key={`rc_-1`} onClick={() => insertIntoReel(rIdx, -1)} />
            {rd.items.map((ri, itemIdx) => (
              <Fragment key={`rc_${itemIdx}`}>
                <ScReelContent>
                  <img src={reelItemDef[ri].img} />
                  <ScRemoveLabel onClick={() => removeFromReel(rIdx, itemIdx)}>
                    <span>{'REMOVE'}</span>
                    <div />
                  </ScRemoveLabel>
                </ScReelContent>
                <InsertItemButton onClick={() => insertIntoReel(rIdx, itemIdx)} />
              </Fragment>
            ))}
          </ScReelItems>
        </ScReelContainer>
      ))}
      {canAddReels && (
        <ScReelContainer>
          <h3>{'NEW REEL'}</h3>
          <InsertItemButton onClick={() => insertReel(reelStates.length - 1)} />
        </ScReelContainer>
      )}
    </ScWrapper>
  );
}

export default ReelEditor;
