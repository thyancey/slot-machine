import styled from 'styled-components';
import AssetMap from '../../../assets';

const ScWrapper = styled.li`
  z-index:1;
  filter: var(--filter-shadow1);

  &.st-attack {
    color: var(--color-black);
    /* right: 0.5rem; */
    /* top: -11.5rem; */
  }
  &.st-defense {
    color: var(--color-black);
    /* right: 0.5rem; */
    /* top: -8.5rem; */
  }
  &.st-health {
    color: var(--color-black);
    /* right: 0.5rem; */
    /* top: -5.5rem; */
  }
`;

const ScCenterer = styled.div`
  position: absolute;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 6rem;
  height: 6rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.3rem;
  font-weight: bold;

  .size-lg >& {
    width: 8rem;
    height: 8rem;
    font-size: 1.6rem;
  }
  
  >img{
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;


const getAssetFromType = (type: string) => {
  switch (type) {
    case 'attack':
      return AssetMap.UI_IconAttack;
    case 'defense':
      return AssetMap.UI_IconDefense;
    case 'health':
      return AssetMap.UI_IconHealth;
    default:
      return AssetMap.UI_IconCoin;
  }
};

type Props = {
  type: string;
  value?: number | string;
  size?: 'lg' | 'sm';
};
function StatLabel({ type, value, size = 'sm' }: Props) {
  const asset = getAssetFromType(type);
  return (
    <ScWrapper className={`st-${type} size-${size}`}>
      <ScCenterer>
        {value !== undefined && <span>{value}</span>}
        <img src={asset} />
      </ScCenterer>
    </ScWrapper>
  );
}

export default StatLabel;
