import styled from 'styled-components';

// kinda like the cutout you can see the reel through
const ScWrapper = styled.div`
  border: 0.5rem solid green;
  width: 5rem;
  height: 10rem;
  position: relative;
  vertical-align: middle;

  /* clip-path: circle(4rem at center); */
`;

const ScReel = styled.div`
  background-color: orange;
  position: absolute;
  top: 0;
  left: 0;
`;

const ScReelItem = styled.div`
  width: 100%;
  height: 50px;
  border: 2px solid purple;
  text-align: center;

  display: flex;
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
