import styled from 'styled-components';
import { EffectGroup } from '../../store/data';
import { useMemo } from 'react';

const ScWrapper = styled.div`
  position: absolute;
  /* left: 50%; */
  /* transform: translateX(-50%); */
  width: 100%;

  top: -1.5rem;
  padding: 0 0rem;
  z-index: 1;
  min-width: 25rem;
  filter: var(--filter-shadow2);
`;

const ScStatLabels = styled.ul`
  > li {
    display: inline-block;
    vertical-align: bottom;
    width: 3rem;
  }
`;

const ScHealthBar = styled.div`
  position: absolute;
  background-color: var(--color-grey);
  border: 0.25rem solid var(--color-grey);

  top: 1.85rem;
  border-radius: 1rem;
  height: 2rem;
  position: relative;

  color: var(--color-white);

  text-align: center;
  width: 100%;

  p {
    position: absolute;
    inset: 0;
    z-index: 1;
    font-size: 1.5rem;
    margin-top: -0.4rem;
  }
`;

const ScHealthBarBg = styled.div`
  position: absolute;
  background-color: var(--color-pink);
  /* border: 0.25rem solid var(--color-grey); */

  .defended & {
    background-color: var(--color-blue);
  }

  /* width % (0-100) is controlled inline by component */
  transition: width 0.2s ease-in;

  top: 0;
  left: 0;
  bottom: 0;
  border-radius: 0.65rem;
`;

const ScDefenseBox = styled.div`
  position: absolute;
  left: 0rem;
  bottom: -2.5rem;
  width: 3rem;
  height: 3.5rem;
  border-radius: 0 0 2rem 2rem;
  background-color: var(--color-pink);
  border: 0.25rem solid var(--color-grey);
  /* sit over bar */
  z-index: 1;

  color: var(--color-black);
  line-height: 2.75rem;
  font-size: 1.5rem;
  text-align: center;

  .defended & {
    background-color: var(--color-blue);
  }
`;

// const ScNotification = styled.div`
//   border: 0.5rem solid var(--color-cyan);
//   background-color: var(--color-cyan);
//   color: var(--color-black);
//   border-radius: 2rem;
//   position: absolute;
//   padding: 0.5rem;
//   z-index: 1;

//   transition: top 0.5s, opacity 0.5s;
// `;

export interface StatInfo {
  [key: string]: number;
}

interface PropsEntityStats {
  hp: number;
  hpMax: number;
  defense: number;
  buffs: EffectGroup[];
}
const HealthBar = ({ hp, hpMax, defense }: PropsEntityStats) => {
  // const [prevDefense, setPrevDefense] = useState<number>(0);
  // const [notifications, setNotifications] = useState<number[]>([]);
  // const notificationRef = useRef(0);

  const healthPerc = useMemo(() => {
    return Math.floor((hp / hpMax) * 100);
  }, [hp, hpMax]);

  // useEffect(() => {
  //   if (defense !== prevDefense) {
  //     console.log(`defense ${prevDefense} > ${defense}`);
  //     setPrevDefense(defense);

  //     if (defense !== 0) {
  //       console.log(`new: ${defense - prevDefense}`);
  //       setNotifications([...notifications].concat([defense - prevDefense]));
  //     }
  //   }
  // }, [defense, prevDefense, setNotifications, notifications]);


  // console.log(`current ${notificationRef.current} / ${defense}`, notifications);

  return (
    <ScWrapper className={defense !== 0 ? 'defended' : ''}>
      <ScStatLabels>
        {/* {(defense && <StatLabel type='defense' size={'lg'} value={defense}></StatLabel>) || null} */}
        {/* <StatLabel type={'hp'} size={'lg'} value={`${hp} / ${hpMax}`}></StatLabel> */}
      </ScStatLabels>
      <ScDefenseBox>{defense !== 0 && <p>{defense}</p>}</ScDefenseBox>
      {/* {notifications.map((n, nIdx) => (
        <ScNotification key={nIdx} className={notificationRef.current !== defense ? 'outro' : 'intro'}>
          <p>{n}</p>
        </ScNotification>
      ))} */}
      <ScHealthBar>
        <p>{`${hp} / ${hpMax}`}</p>
        <ScHealthBarBg style={{ width: `${healthPerc}%` }} />
      </ScHealthBar>
    </ScWrapper>
  );
};
export default HealthBar;
