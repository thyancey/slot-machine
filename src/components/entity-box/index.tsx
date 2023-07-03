import styled from 'styled-components';
import SlotMachine from '../slotmachine';
import EntityStats from './entity-stats';

const ScWrapper = styled.div`
  position: relative;


  max-width: 40rem;
  max-height: 40rem;
  width:100%;
  height:100%;
  position:absolute;
`;

const ScCard = styled.div`
  border-radius: 1.5rem;
  background-color: var(--color-white);
  filter: var(--filter-shadow2);

  padding: 3rem 2rem 2rem 2rem;

  /* width: 100%; */
  /* height:100%; */
  
  /* display: flex;
  justify-content: center;
  align-items: center; */
`;

export const PlayerEntityBox = () => {
  return (
    <ScWrapper>
      <ScCard>
        <EntityStats />
        <SlotMachine />
      </ScCard>
    </ScWrapper>
  );
};

export default {};
