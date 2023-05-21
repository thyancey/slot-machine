import styled from "styled-components";

const ScWrapper = styled.div`
  border: 2px solid green;
  width: 5rem;
  position: relative;
  height:100%;
  
  clip-path: circle(4rem at center);
`;

const ScReel = styled.div`
  background-color:orange;
  position:absolute;
  top:0;
  left:0;
`

const ScReelItem = styled.div`
  width: 100%;
  height: 50px;
  border: 2px solid purple;
  text-align:center;
  
  display:flex;
  align-items: center;
  justify-content: center;
`;

export type ReelItem = {
  label: string;
};

type Props = {
  reelItems: ReelItem[];
  reelIdx: number;
};
function SlotReel({ reelItems, reelIdx }: Props) {
  return (
    <ScWrapper>
      <ScReel>
        {reelItems.map((reelItem, idx) => (
          <ScReelItem key={`${reelIdx}-${idx}`}>{reelItem.label}</ScReelItem>
        ))}
      </ScReel>
    </ScWrapper>
  );
}

export default SlotReel;
