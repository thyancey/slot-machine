import styled from 'styled-components';
import StatLabel from '../slotmachine/components/stat-label';

const ScWrapper = styled.div`
  /* background-color: var(--color-purple); */
  position: absolute;
  left:0;
  bottom: 100%;
  width: 100%;
  padding: 0 2rem;
  z-index: 2; // just makes the hover state of the cards simpler

  display:flex;
  justify-content: space-between;
`;

const ScStatLabels = styled.ul`
  > li {
    display: inline-block;
    vertical-align: bottom;
    width: 3rem;
  }
`;

export interface StatInfo {
  [key: string]: number;
}

interface PropsEntityStats {
  statInfo: StatInfo;
  hp: number;
}
const EntityStats = ({ statInfo, hp }: PropsEntityStats) => {
  if (!statInfo) {
    return null;
  }

  const keysToShow = ['attack', 'health'];

  return (
    <ScWrapper>
      <ScStatLabels>
        {keysToShow.map((k: string) => {
          if(!statInfo[k]) return null;
          return <StatLabel key={k} type={k} size={'lg'} value={statInfo[k]}></StatLabel>;
        }).filter(l => l !== null)}
      </ScStatLabels>
      <ScStatLabels>
        {statInfo.defense && <StatLabel type="defense" size={'lg'} value={statInfo.defense}></StatLabel> || null}
        <StatLabel type={'hp'} size={'lg'} value={hp}></StatLabel>
      </ScStatLabels>
    </ScWrapper>
  );
};
export default EntityStats;
