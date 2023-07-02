import { ReactNode, SetStateAction, createContext, useCallback, useEffect, useState } from 'react';
import {
  DeckState,
  MAX_REELS,
  INITIAL_UPGRADE_TOKENS,
  INITIAL_SPIN_TOKENS,
  MAX_REEL_TOKENS,
  UiState,
  TileKeyCollection,
  DeckIdxCollection,
  PlayerInfo,
  enemies,
} from './data';
import { clamp } from '../utils';
import { insertAfterPosition, insertReelStateIntoReelStates, removeAtPosition } from './utils';
import { discardTiles, drawTiles } from '../components/machine-editor/utils';
import { pickRandomFromArray } from '../components/slotmachine/utils';

const AppContext = createContext({} as AppContextType);
interface AppContextType {
  score: number;
  incrementScore: (increment: number) => void;

  selectedTileIdx: number;
  setSelectedTileIdx: (idx: SetStateAction<number>) => void;

  tileDeck: TileKeyCollection;
  setTileDeck: (value: SetStateAction<TileKeyCollection>) => void;

  deckState: DeckState;
  setDeckState: (value: SetStateAction<DeckState>) => void;

  reelStates: DeckIdxCollection[];
  setReelStates: (values: SetStateAction<DeckIdxCollection[]>) => void;

  upgradeTokens: number;
  incrementUpgradeTokens: (value: number) => void;
  
  spinTokens: number;
  setSpinTokens: (value: SetStateAction<number>) => void;
  turn: number;
  setTurn: (value: SetStateAction<number>) => void;
  round: number;
  setRound: (value: SetStateAction<number>) => void;

  playerInfo: PlayerInfo;
  setPlayerInfo: (value: SetStateAction<PlayerInfo>) => void;
  enemyInfo: PlayerInfo | null;
  setEnemyInfo: (value: SetStateAction<PlayerInfo>) => void;

  uiState: UiState;
  setUiState: (value: SetStateAction<UiState>) => void;

  insertIntoReel: (reelIdx: number, positionIdx: number) => void;
  removeFromReel: (reelIdx: number, positionIdx: number) => void;
  insertReel: (positionIdx: number) => void;

  drawCards: (numToDraw: number) => void;
  discardCards: (ignoreIdx: number) => void;
}

interface Props {
  children: ReactNode;
}
const AppProvider = ({ children }: Props) => {
  const [score, setScore] = useState(0);
  const [turn, setTurn] = useState(-1);
  const [round, setRound] = useState(-1);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
    label: 'player',
    hp: [10,10],
    attack: 0,
    defense: 0
  });
  const [enemyInfo, setEnemyInfo] = useState<PlayerInfo | null>(null);
  const [spinTokens, setSpinTokens] = useState(INITIAL_SPIN_TOKENS);
  const [uiState, setUiState] = useState<UiState>('game');
  const [upgradeTokens, setUpgradeTokensState] = useState(INITIAL_UPGRADE_TOKENS);
  const [selectedTileIdx, setSelectedTileIdx] = useState(-1);
  const [reelStates, setReelStates] = useState<DeckIdxCollection[]>([]);
  const [tileDeck, setTileDeck] = useState<TileKeyCollection>([]);
  const [deckState, setDeckState] = useState<DeckState>({
    drawn: [],
    draw: [],
    discard: [],
  });

  const incrementScore = useCallback(
    (increment = 0) => {
      setScore((prevScore) => Math.floor(prevScore + increment));
    },
    [setScore]
  );

  // TODO - these should probably use useCallback, but it wasnt necessary when i first
  // put them in here.
  const insertIntoReel = (reelIdx: number, positionIdx: number) => {
    setReelStates(insertAfterPosition(reelIdx, positionIdx, selectedTileIdx, reelStates));
  };

  const removeFromReel = (reelIdx: number, positionIdx: number) => {
    const afterRemove = removeAtPosition(reelIdx, positionIdx, reelStates);
    console.log('afterRemove', afterRemove)
    setReelStates(afterRemove);
  };

  const insertReel = (positionIdx: number) => {
    if (reelStates.length < MAX_REELS) {
      console.log('3');
      setReelStates(insertReelStateIntoReelStates(positionIdx, [selectedTileIdx], reelStates));
    } else {
      console.log(`cannot add more than ${MAX_REELS} reels!`);
    }
  };

  const drawCards = useCallback(
    (numToDraw: number) => {
      console.log(`AppContext.drawCards(${numToDraw})`);
      const afterState = drawTiles(numToDraw, deckState);
      console.log('afterState:', afterState);

      setDeckState(afterState);
    },
    [deckState]
  );

  const discardCards = useCallback(
    (_: number) => {
      setDeckState(discardTiles(deckState.drawn, deckState));
    },
    [deckState]
  );

  const incrementUpgradeTokens = (newAmount: number) => {
    setUpgradeTokensState(clamp(newAmount, 0, MAX_REEL_TOKENS));
  };

  // next round
  useEffect(() => {
    if(round > -1){
      if(round <= enemies.length - 1){
        setEnemyInfo(enemies[round]);
      } else {
        // TODO: GAME WON?
        setEnemyInfo(pickRandomFromArray(enemies) as PlayerInfo);
      }
      setTurn(-1);
      setTurn(0);
    }
  }, [round, enemies, setEnemyInfo, setTurn]);

  // next turn
  useEffect(() => {
    setSpinTokens(INITIAL_SPIN_TOKENS);
    setUpgradeTokensState(INITIAL_UPGRADE_TOKENS);
  }, [turn, setSpinTokens, setUpgradeTokensState]);

  return (
    <AppContext.Provider
      value={
        {
          score,
          incrementScore,

          selectedTileIdx,
          setSelectedTileIdx,

          reelStates,
          setReelStates,

          upgradeTokens,
          incrementUpgradeTokens,

          spinTokens,
          setSpinTokens,

          turn,
          setTurn,
          round,
          setRound,

          uiState,
          setUiState,

          playerInfo,
          setPlayerInfo,
          
          enemyInfo,
          setEnemyInfo,

          insertIntoReel,
          removeFromReel,
          insertReel,

          tileDeck,
          setTileDeck,

          deckState,
          setDeckState,

          drawCards,
          discardCards,
        } as AppContextType
      }
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
