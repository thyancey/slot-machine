import styled from 'styled-components';
import AssetMap from '../../../assets';

const ScWrapper = styled.div`
  position:absolute;
  right:0;
  top:0;

  z-index:1;
  font-size: 1.3rem;
  font-weight: bold;
  filter: var(--filter-shadow1);

  &.st-attack {
    color: var(--color-black);
    right: 0.5rem;
    top: -11.5rem;
  }
  &.st-defense {
    color: var(--color-black);
    right: 0.5rem;
    top: -8.5rem;
  }
  &.st-health {
    color: var(--color-black);
    right: 0.5rem;
    top: -5.5rem;
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
  
  >img{
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

type Props = {
  type: string;
  value?: number;
};

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

function StatLabel({ type, value }: Props) {
  const asset = getAssetFromType(type);
  return (
    <ScWrapper className={`st-${type}`}>
      <ScCenterer>
        {value !== undefined && <span>{value}</span>}
        <img src={asset} />
      </ScCenterer>
    </ScWrapper>
  );
}

export default StatLabel;
