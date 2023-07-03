import styled from 'styled-components';
import { PlayerInfo } from '../../store/data';

const ScWrapper = styled.div`
  position: relative;
  max-width: 40rem;
  max-height: 40rem;

  min-width: 20rem;
  min-height: 10rem;

  font-size: 2rem;
  text-align: center;
`;

const ScEnemyImage = styled.img`
  width: 8rem;
  height: 8rem;
`;

interface Props {
  enemyInfo: PlayerInfo;
}
export const Enemy = ({ enemyInfo }: Props) => {
  return (
    <ScWrapper>
      <h3>{enemyInfo.label}</h3>
      {/* <ScEnemyImage style={{ 'background': `url(${enemyInfo.img})` }} /> */}
      <ScEnemyImage src={enemyInfo.img} />
    </ScWrapper>
  );
};

export default Enemy;
