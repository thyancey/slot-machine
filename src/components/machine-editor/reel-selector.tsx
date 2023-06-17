import styled from 'styled-components';
import { Fragment, useCallback, useContext, useMemo } from 'react';
import { AppContext } from '../../store/appcontext';
import Reel from '../slotmachine/components/reel';
import { REEL_HEIGHT, ReelDef, ReelItem, reelsData } from '../slotmachine/data';
import ReelContent from '../slotmachine/components/reel-content';
import Button, { StyledButton } from '../button';

const ScWrapper = styled.ul`
  background-color: var(--color-grey);
  flex: 1;

  display: flex;
  flex-direction: row;
  overflow-y: auto;
`;

const ScReelContainer = styled.li`
  flex: 1;
  margin: 1rem;
`;

const ScReelItems = styled.ul`
`;

const ScInsertButton = styled.button`
  width: 100%;
  font-size: 1rem;
  padding: 0rem;
  border: 0.125rem dashed var(--color-pink);
  background-color: var(--color-grey);
  margin-bottom: .25rem;
  margin-top: .25rem;

  transition: padding .2s, background-color .2s;
  
  cursor: pointer;

  &:hover{
    padding: 1rem;
    background-color: var(--color-pink);
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

  img {
    height: 100%;
    filter: drop-shadow(0.2rem 0.2rem 0.1rem var(--color-black));
  }
`
interface InsertButtonProps{
  onClick: Function
}
const InsertButton = ({onClick}:InsertButtonProps) => {
  return (
    <ScInsertButton onClick={() => onClick()}>{'insert'}</ScInsertButton>
  )
}

interface Props {}
function ReelSelector({}: Props) {
  // const { setSelectedItemKey, selectedItemKey } = useContext(AppContext);

  const onInsertClick = useCallback((idx: number) => {
    console.log('onInsertClick', idx);
  }, []);

  return (
    <ScWrapper>
      {reelsData.map((rd, rIdx) => (
        <ScReelContainer key={rIdx}>
          <span>{`reel ${rIdx + 1}`}</span>
          <ScReelItems>
            <InsertButton key={`rc_-1`} onClick={() => onInsertClick(-1)}/>
            {rd.reelItems.map((ri, riIdx) => (
              <Fragment key={`rc_${riIdx}`}>
                <ScReelContent>
                  <img src={ri.img} />
                </ScReelContent>
                <InsertButton onClick={() => onInsertClick(riIdx)}/>
              </Fragment>
            ))}
          </ScReelItems>
        </ScReelContainer>
      ))}
    </ScWrapper>
  );
}

export default ReelSelector;
