import styled from 'styled-components';

const RIVETS = [1, 1, 1, 1];

const ScWrapper = styled.div`
  position:absolute;
  inset: .5rem 0.5rem;
  pointer-events: none;
  opacity: 0;
`;

const ScRivet = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  background-color:var(--color-grey);
  opacity: 0.5;
  border-radius: 100%;
  position:absolute;

  &:nth-child(1){
    top:0;
    left:0;
  }
  &:nth-child(2){
    top:0;
    right:0;
  }
  &:nth-child(3){
    bottom:0;
    left:0;
  }
  &:nth-child(4){
    bottom:0;
    right:0;
  }
`;

function Rivets() {
  return (
    <ScWrapper>
      {RIVETS.map((_, idx) => (
        <ScRivet key={idx} />
      ))}
    </ScWrapper>
  );
}

export default Rivets;
