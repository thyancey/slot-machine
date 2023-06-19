import { ReactNode, createContext, useState } from 'react';
import { MAX_REELS } from '../components/slotmachine/data';
import { clamp } from '../utils';

const AppContext = createContext({} as AppContextType);
interface AppContextType {
  score: number;
  selectedItemKey: string;
  reelStates: ReelState[];
  upgradeTokens: number;
  uiState: UiState;
  setUiState: Function;
  incrementScore: Function;
  setSelectedItemKey: Function;
  setReelStates: Function;
  insertIntoReel: Function;
  removeFromReel: Function;
  insertReel: Function;
  setUpgradeTokens: Function;
}

export interface ReelState {
  items: string[];
}

export const insertIntoArray = (positionIdx: number, item: any, array: any[]) => {
  // console.log('insertIntoArray', itemKey, positionIdx, items);
  const newPos = positionIdx + 1;

  if (newPos < 0 || newPos > array.length) {
    console.error(`invalid index ${positionIdx} provided`);
    return array;
  }

  return [...array.slice(0, newPos), item, ...array.slice(newPos)];
};

export const insertAfterPosition = (reelIdx: number, positionIdx: number, itemKey: string, reelStates: ReelState[]) => {
  // console.log('insertIntoReel', reelIdx, positionIdx, itemKey, reelStates);
  return reelStates.map((reelState, rIdx) => {
    if (rIdx === reelIdx) {
      return {
        items: insertIntoArray(positionIdx, itemKey, reelState.items),
      };
    } else {
      return reelState;
    }
  });
};

export const removeAtPosition = (reelIdx: number, positionIdx: number, reelStates: ReelState[]) => {
  if(reelStates.length === 1 && reelStates[0].items.length === 1){
    console.log('ARE YOU CRAZY?!?! YOU CANT HAVE NOTHING!!!!!');
    return reelStates;
  }

  return reelStates.map((reelState, rIdx) => {
    if(rIdx === reelIdx){
      return {
        items: reelState.items.filter((_, index) => index !== positionIdx)
      }
    } else {
      return reelState;
    }
  }).filter(rs => rs.items.length > 0);
}

export const INITIAL_TOKENS = 2;
export const MAX_REEL_TOKENS = 5;

export type UiState = 'game' | 'editor';
interface Props {
  children: ReactNode;
}
const AppProvider = ({ children }: Props) => {
  const [score, setScore] = useState(0);
  const [uiState, setUiState] = useState<UiState>('game');
  const [upgradeTokens, setUpgradeTokensState] = useState(INITIAL_TOKENS);
  const [selectedItemKey, setSelectedItemKey] = useState('');
  const [reelStates, setReelStates] = useState<ReelState[]>([]);

  const incrementScore = (increment: number = 0) => {
    setScore((prevScore) => prevScore + increment);
  };

  const insertIntoReel = (reelIdx: number, positionIdx: number) => {
    setReelStates(insertAfterPosition(reelIdx, positionIdx, selectedItemKey, reelStates));
  };

  const removeFromReel = (reelIdx: number, positionIdx: number) => {
    setReelStates(removeAtPosition(reelIdx, positionIdx, reelStates));
  };

  const insertReel = (positionIdx: number) => {
    if(reelStates.length < MAX_REELS){
      setReelStates(insertIntoArray(positionIdx, { items: [ selectedItemKey ] }, reelStates));
    } else {
      console.log(`cannot add more than ${MAX_REELS} reels!`);
    }
  };

  const setUpgradeTokens = (newAmount: number) => {
    setUpgradeTokensState(clamp(newAmount, 0, MAX_REEL_TOKENS));
  }

  return (
    <AppContext.Provider
      value={
        {
          score,
          selectedItemKey,
          reelStates,
          upgradeTokens,
          uiState,
          incrementScore,
          setSelectedItemKey,
          setReelStates,
          insertIntoReel,
          removeFromReel,
          insertReel,
          setUpgradeTokens,
          setUiState,
        } as AppContextType
      }
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };