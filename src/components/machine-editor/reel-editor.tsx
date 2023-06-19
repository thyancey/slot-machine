import styled from 'styled-components';
import { Fragment, useContext, useMemo } from 'react';
import { AppContext, MAX_REEL_TOKENS } from '../../store/appcontext';
import { MAX_REELS, Tile, tileGlossary } from '../../store/data';

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

const ScTiles = styled.ul``;

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

const ScInsertTileButton = styled(ScInsertButton)`
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  width: 100%;
  transition: background-color 0.2s, max-height 0.2s, opacity 0.2s;
  display:flex;
  align-items: center;
  justify-content: center;
  position: relative;

  height: 5rem;
  max-height:0rem;
  opacity: 0;

  &.active{
    max-height: 2rem;
    opacity: 1;
  }
  
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

  &.active:hover {
    max-height: 5rem;
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
  onClick: React.MouseEventHandler;
  tile: Tile;
}
const InsertTileButton = ({ onClick, tile }: InsertButtonProps) => {
  return (
    <ScInsertTileButton className={tile ? 'active' : ''} onClick={() => onClick()}>
      <span>{'insert'}</span>
      {tile && <img src={tile.img} />}
    </ScInsertTileButton>
  );
};

interface Props {
  onInsertIntoReel: (reelIdx: number, positionIdx: number) => void;
  onRemoveFromReel: (reelIdx: number, positionIdx: number) => void;
  onInsertReel: (positionIdx: number) => void;
}
function ReelEditor({ onInsertIntoReel, onRemoveFromReel, onInsertReel }: Props) {
  const { reelStates, selectedTileIdx, upgradeTokens, tileDeck } = useContext(AppContext);

  const canAddReels = useMemo(() => {
    return reelStates.length < MAX_REELS;
  }, [reelStates]);

  const canRemoveTiles = useMemo(() => {
    return selectedTileIdx === -1 && upgradeTokens < MAX_REEL_TOKENS && !(reelStates.length === 1 && reelStates[0].length === 1);
  }, [ reelStates, selectedTileIdx, upgradeTokens ]);

  const tile = useMemo(() => {
    return tileGlossary[tileDeck[selectedTileIdx]];
  }, [selectedTileIdx]);


  return (
    <ScWrapper>
      {canAddReels && (
        <ScReelContainer>
          <h3>{'NEW REEL'}</h3>
          <InsertTileButton tile={tile} onClick={() => onInsertReel(-1)} />
        </ScReelContainer>
      )}
      {reelStates.map((rd, rIdx) => (
        <ScReelContainer key={rIdx}>
          <h3>{`REEL ${rIdx + 1}`}</h3>
          <ScTiles>
            <InsertTileButton key={`rc_-1`} tile={tile} onClick={() => onInsertIntoReel(rIdx, -1)} />
            {rd.map((ri, tileIdx) => (
              <Fragment key={`rc_${tileIdx}`}>
                <ScReelContent>
                  <img src={tileGlossary[ri].img} />
                  {canRemoveTiles && <ScRemoveLabel onClick={() => onRemoveFromReel(rIdx, tileIdx)}>
                    <span>{'REMOVE'}</span>
                    <div />
                  </ScRemoveLabel> }
                </ScReelContent>
                <InsertTileButton tile={tile} onClick={() => onInsertIntoReel(rIdx, tileIdx)} />
              </Fragment>
            ))}
          </ScTiles>
        </ScReelContainer>
      ))}
      {canAddReels && (
        <ScReelContainer>
          <h3>{'NEW REEL'}</h3>
          <InsertTileButton tile={tile} onClick={() => onInsertReel(reelStates.length - 1)} />
        </ScReelContainer>
      )}
    </ScWrapper>
  );
}

export default ReelEditor;
