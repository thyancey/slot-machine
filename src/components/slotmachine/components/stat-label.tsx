import styled from 'styled-components';
import AssetMap from '../../../assets';

const ScWrapper = styled.li`
  z-index: 1;
  position: relative;
  filter: var(--filter-shadow1);

  &:hover {
    filter: var(--filter-shadow2);
    z-index: 2;
  }

  color: var(--color-black);
  &.st-attack {
    /* color: var(--color-black); */
    /* right: 0.5rem; */
    /* top: -11.5rem; */
  }
  &.st-defense {
    /* color: var(--color-black); */
    /* right: 0.5rem; */
    /* top: -8.5rem; */
  }
  &.st-health {
    /* color: var(--color-black); */
    /* right: 0.5rem; */
    /* top: -5.5rem; */
  }
`;

const ScCenterer = styled.div`
  position: absolute;

  width: 3rem;
  height: 3rem;
  line-height: 3rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;

  .size-lg > & {
    width: 4rem;
    height: 4rem;
    line-height: 4rem;

    font-size: 1.5rem;
  }

  > img {
    position: absolute;
    inset: 0;
    width: 200%;
    height: 200%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    pointer-events: none;
  }
`;

const getAssetFromType = (type: string) => {
  switch (type) {
    case 'attack':
      return AssetMap.UI_IconAttack;
    case 'defense':
      return AssetMap.UI_IconDefense;
    case 'hp':
      return AssetMap.UI_IconHealth;
    case 'health':
      return AssetMap.UI_IconCurse;
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
  let title = type;
  if(value && typeof value === 'number'){
    title = `${value >= 0 ? '+' : ''}${value} ${type}`;
  }
  return (
    <ScWrapper className={`st-${type} size-${size}`} title={title}>
      <ScCenterer>
        {value !== undefined && <span>{value}</span>}
        <img src={asset} />
      </ScCenterer>
    </ScWrapper>
  );
}

export default StatLabel;
