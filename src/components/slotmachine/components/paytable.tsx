import styled from "styled-components";


const ScWrapper = styled.div`
  display:grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: auto;

  background-color: var(--color-purple);
  border-radius: .5rem;
  padding: .5rem;
`
const ScPayoutRow = styled.div`
  top:0;
  left:0;
  border: 1px solid var(--color-white);
  margin:.25rem;
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
