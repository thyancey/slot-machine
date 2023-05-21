import styled from "styled-components";
import Reel, { ReelItem } from "./reel";
import PayTable, { PayoutItem } from "./paytable";

const ScWrapper = styled.main`
  border: .5rem dotted yellow;
  text-align:center;

  position:absolute;
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto min-content 5rem;
  justify-content: center;
  align-items: center;
`;

const ScReelContainer = styled.div`
  border: .25rem solid blue;
  height: 100%;
  >div{
    display:inline-block;
    margin: .5rem;
  }
`;
const ScPayoutTray = styled.div`
  border: .25rem solid grey;
  height: 100%;
`;

/* stick it to the side */
const ScHandle = styled.div`
  position:absolute;
  border: .25rem solid white;
  width: 2rem;
  height: 12rem;
  left:100%;
  bottom: 50%;
  border-radius: 5rem;
`;

const reels: ReelItem[][] = [
  [
    { label: "cherry" },
    { label: "lemon" },
    { label: "strawberry" },
    { label: "lime" },
    { label: "orange" },
  ],
  [
    { label: "cherry" },
    { label: "lemon" },
    { label: "strawberry" },
    { label: "lime" },
    { label: "orange" },
  ],
  [
    { label: "cherry" },
    { label: "lemon" },
    { label: "strawberry" },
    { label: "lime" },
    { label: "orange" },
  ],
];

const payoutItems: PayoutItem[] = [
  {
    label: 'c + c + c',
    points: 100
  },
  {
    label: 'o + c + s',
    points: 200
  },
  {
    label: 'o + o + o',
    points: 500
  },
  {
    label: 's + s + s',
    points: 1000
  },
]

function SlotMachine() {
  return (
    <ScWrapper>
      <ScReelContainer>
        <Reel reelIdx={0} reelItems={reels[0]} />
        <Reel reelIdx={1} reelItems={reels[1]} />
        <Reel reelIdx={2} reelItems={reels[2]} />
      </ScReelContainer>
      <PayTable payoutItems={payoutItems} />
      <ScPayoutTray />
      <ScHandle />
    </ScWrapper>
  );
}

export default SlotMachine;
