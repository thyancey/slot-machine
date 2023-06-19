import { ReactNode, createContext, useState } from 'react';
import { MAX_REELS } from './data';
import { clamp } from '../utils';

const AppContext = createContext({} as AppContextType);
interface AppContextType {
  score: number;
  selectedTileKey: string;
  reelStates: ReelState[];
  upgradeTokens: number;
  uiState: UiState;
  setUiState: Function;
  incrementScore: Function;
  setSelectedTileKey: Function;
  setReelStates: Function;
  insertIntoReel: Function;
  removeFromReel: Function;
  insertReel: Function;
  setUpgradeTokens: Function;
}

export type ReelState = string[];

export const insertIntoArray = (positionIdx: number, newItem: any, array: any[]) => {
  const newPos = positionIdx + 1;

  if (newPos < 0 || newPos > array.length) {
    console.error(`invalid index ${positionIdx} provided`);
    return array;
  }

  return [...array.slice(0, newPos), newItem, ...array.slice(newPos)];
};

export const insertAfterPosition = (reelIdx: number, positionIdx: number, tileKey: string, reelStates: ReelState[]) => {
  return reelStates.map((reelState, rIdx) => {
    if (rIdx === reelIdx) {
      return insertIntoArray(positionIdx, tileKey, reelState);
    } else {
      return reelState;
    }
  });
};

export const removeAtPosition = (reelIdx: number, positionIdx: number, reelStates: ReelState[]) => {
  if(reelStates.length === 1 && reelStates[0].length === 1){
    console.log('ARE YOU CRAZY?!?! YOU CANT HAVE NOTHING!!!!!');
    return reelStates;
  }

  return reelStates.map((reelState, rIdx) => {
    if(rIdx === reelIdx){
      return reelState.filter((_, index) => index !== positionIdx);
    } else {
      return reelState;
    }
  }).filter(rs => rs.length > 0);
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
  const [selectedTileKey, setSelectedTileKey] = useState('');
  const [reelStates, setReelStates] = useState<ReelState[]>([]);

  const incrementScore = (increment: number = 0) => {
    setScore((prevScore) => prevScore + increment);
  };

  const insertIntoReel = (reelIdx: number, positionIdx: number) => {
    setReelStates(insertAfterPosition(reelIdx, positionIdx, selectedTileKey, reelStates));
  };

  const removeFromReel = (reelIdx: number, positionIdx: number) => {
    setReelStates(removeAtPosition(reelIdx, positionIdx, reelStates));
  };

  const insertReel = (positionIdx: number) => {
    if(reelStates.length < MAX_REELS){
      setReelStates(insertIntoArray(positionIdx, [ selectedTileKey ], reelStates));
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
          selectedTileKey,
          reelStates,
          upgradeTokens,
          uiState,
          incrementScore,
          setSelectedTileKey,
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
