import styled from "styled-components";

const ScWrapper = styled.div`
  border: .25rem solid cyan;
  height: 100%;
`;

const ScPayoutRow = styled.div`
  display:inline-block;
  width: 50%;
  border: .25rem solid white;
  top:0;
  left:0;
`

export type PayoutItem = {
  label: string;
  points: number;
};

type Props = {
  payoutItems: PayoutItem[];
};
function PayTable({ payoutItems }: Props) {
  return (
    <ScWrapper>
      {payoutItems.map((payoutItem, idx) => (
        <ScPayoutRow key={idx}>{`${payoutItem.label}: ${payoutItem.points}`}</ScPayoutRow>
      ))}
    </ScWrapper>
  );
}

export default PayTable;
