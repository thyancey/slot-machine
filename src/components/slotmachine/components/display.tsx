import styled from 'styled-components';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../../store/appcontext';
import { ReelComboResult, Tile } from '../../../store/data';

const ScWrapper = styled.div`
  position: absolute;
  inset: 0;
  background-color: var(--color-grey);
  color: var(--color-white);
  border-radius: 0.6rem;
  /* padding: 1rem; */

  font-family: var(--font-8bit2);
  transition: background-color ease-out 0.2s, color ease-out 0.2s;

  display:flex;
  justify-content:center;

  p {
    font-size: 1.5rem;
    line-height: 1.85rem;
  }
`;

const ScCombos = styled.ul`
  li {
    font-size: 1rem;
    line-height: 1.25rem;
  }
`;

const ScStatus = styled.div`
  /* width:50%; */
  /* height: 100%; */
  /* display:inline-block; */
  /* vertical-align:top;*/
  display:flex;
  flex-direction:column;
  justify-content: center;
  text-align:center;
  flex:1;

  h3{
    margin: 0.5rem 1rem 0rem 1rem;
    padding-top: 0.5rem;
    border-top: 0.25rem dashed var(--color-white);
    font-size: 1.5rem;
    line-height: 1.25rem;
  }
`

const ScPlayer = styled(ScStatus)`
  color: var(--color-blue);
  h3{
    border-color: var(--color-blue);
  }
`;
const ScEnemy = styled(ScStatus)`
  color: var(--color-red);
  /* border-left: 0.75rem solid var(--color-white); */
  h3{
    border-color: var(--color-red);
  }
`;

interface Props {
  resultSet: (Tile | undefined)[];
  activeCombos: ReelComboResult[];
}
function Display({resultSet, activeCombos}: Props) {
  const { playerInfo, enemyInfo } = useContext(AppContext);

  const playerAttack = useMemo(() => {
    return resultSet.reduce((val, rS) => {
      if(rS?.effect === 'attack'){
        return (val + (rS.value || 0));
      }
      return val;
    }, 0);
  }, [resultSet]);

  const playerDefense = useMemo(() => {
    return resultSet.reduce((val, rS) => {
      if(rS?.effect === 'defense'){
        return (val + (rS.value || 0));
      }
      return val;
    }, 0);
  }, [resultSet]);

  return (
    <ScWrapper>
      <ScPlayer>
        <p>{`atk: ${playerAttack}`}</p>
        <p>{`def: ${playerDefense}`}</p>
        <p>{`hp: ${playerInfo.hp[0]} / ${playerInfo.hp[1]}`}</p>
        <h3>{playerInfo.label}</h3>
      </ScPlayer>
      {enemyInfo && (
        <ScEnemy>
          <p>{`atk: ${enemyInfo.attack}`}</p>
          <p>{`def: ${enemyInfo.defense}`}</p>
          <p>{`hp: ${enemyInfo.hp[0]} / ${enemyInfo.hp[1]}`}</p>
          <h3>{enemyInfo.label}</h3>
        </ScEnemy>
      )}
      <ScCombos></ScCombos>
    </ScWrapper>
  );
}

export default Display;
