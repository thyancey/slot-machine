import { ReactNode, SetStateAction, createContext, useCallback, useEffect, useMemo, useState } from 'react';
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
  ReelComboResult,
  ReelCombo,
  Tile,
} from './data';
import { clamp } from '../utils';
import { getTileFromDeckIdx, insertAfterPosition, insertReelStateIntoReelStates, removeAtPosition } from './utils';
import { discardTiles, drawTiles } from '../components/machine-editor/utils';
import { computeRound, getActiveCombos, pickRandomFromArray } from '../components/slotmachine/utils';

const AppContext = createContext({} as AppContextType);
interface AppContextType {
  activeTiles: Tile[];

  reelResults: DeckIdxCollection;
  setReelResults: (values: SetStateAction<DeckIdxCollection>) => void;

  activeCombos: ReelComboResult[];
  
  reelCombos: ReelCombo[];
  setReelCombos:  (values: SetStateAction<ReelCombo[]>) => void;

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
  finishTurn: () => void;

  round: number;
  setRound: (value: SetStateAction<number>) => void;

  playerInfo: PlayerInfo;
  setPlayerInfo: (value: SetStateAction<PlayerInfo>) => void;
  enemyInfo: PlayerInfo | null;
  setEnemyInfo: (value: SetStateAction<PlayerInfo | null>) => void;

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
  const [reelCombos, setReelCombos] = useState<ReelCombo[]>([]);
  // const [activeCombos, setActiveCombos] = useState<ReelComboResult[]>([]);
  const [reelStates, setReelStates] = useState<DeckIdxCollection[]>([]);
  const [reelResults, setReelResults] = useState<DeckIdxCollection>([]);
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
      const afterState = drawTiles(numToDraw, deckState);
      setDeckState(afterState);
    },
    [deckState]
  );

  const discardCards = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_: number) => {
      setDeckState(discardTiles(deckState.drawn, deckState));
    },
    [deckState]
  );

  const activeTiles = useMemo(() => {
    if(reelResults.includes(-1)) return [];

    return reelResults.map((slotIdx, reelIdx) => getTileFromDeckIdx(reelStates[reelIdx][slotIdx], tileDeck));
  }, [reelResults, tileDeck, reelStates]);
  
  const activeCombos = useMemo(() => {
    if(activeTiles.length === 0){
      return [];
    }
    return getActiveCombos(activeTiles, reelCombos);
  }, [activeTiles, reelCombos]);

  const incrementUpgradeTokens = (newAmount: number) => {
    setUpgradeTokensState(clamp(newAmount, 0, MAX_REEL_TOKENS));
  };

  // console.log('Context, activeTiles', activeTiles);
  // console.log('Context, reelCombos', reelCombos);

  // next round
  useEffect(() => {
    if(round > -1){
      if(round <= enemies.length - 1){
        setEnemyInfo(enemies[round]);
      } else {
        // TODO: GAME WON?
        setEnemyInfo(pickRandomFromArray(enemies) as PlayerInfo);
      }
      // ideally, next turn effect does this, but when turn is already 0, it doesnt see
      // a change
      setSpinTokens(INITIAL_SPIN_TOKENS);
      setUpgradeTokensState(INITIAL_UPGRADE_TOKENS);

      setTurn(0);
    } else {
      setRound(0);
    }
  }, [round, setEnemyInfo, setTurn, setRound, setSpinTokens, setUpgradeTokensState]);

  // next turn, fight each other then reset or whatever
  useEffect(() => {
    setSpinTokens(INITIAL_SPIN_TOKENS);
    setUpgradeTokensState(INITIAL_UPGRADE_TOKENS);
    setReelResults(Array(reelStates.length).fill(-1))
  }, [turn, setSpinTokens, setUpgradeTokensState, setReelResults, reelStates.length]);

  const finishRound = useCallback(() => {
    setRound(prev => prev + 1);
  }, [ setRound ]);

  const finishTurn = useCallback(() => {
    if(!enemyInfo){
      setTurn(prev => prev + 1);
      return;
    }

    console.log('----> FINISH TURN', playerInfo, enemyInfo, activeTiles, activeCombos);
    if(!enemyInfo) setTurn(prev => prev + 1);

    const roundResult = computeRound(playerInfo as PlayerInfo, enemyInfo as PlayerInfo, activeTiles, activeCombos);
    console.log('roundResult', roundResult);

    if(roundResult.player.hp === 0){
      window.alert('you died!');
    } else if(roundResult.enemy.hp === 0){
      setPlayerInfo(prev => ({
        ...prev,
        hp: [ roundResult.player.hp, prev.hp[1] ],
        defense: roundResult.player.defense
      }));
      setEnemyInfo(null);

      finishRound();
    } else {
      setPlayerInfo(prev => ({
        ...prev,
        hp: [ roundResult.player.hp, prev.hp[1] ],
        defense: roundResult.player.defense
      }));
      setEnemyInfo(prev => {
        if(!prev) return null;
        return {
          ...prev,
          hp: [ roundResult.enemy.hp, prev.hp[1] ],
          defense: roundResult.enemy.defense
        }
      });
      setTurn(prev => prev + 1);
    }


  }, [playerInfo, enemyInfo, setTurn, activeTiles, activeCombos, setPlayerInfo, setEnemyInfo, finishRound]);

  return (
    <AppContext.Provider
      value={
        {
          activeTiles,

          reelCombos,
          setReelCombos,

          activeCombos,

          score,
          incrementScore,

          selectedTileIdx,
          setSelectedTileIdx,

          reelStates,
          setReelStates,

          reelResults,
          setReelResults,

          upgradeTokens,
          incrementUpgradeTokens,

          spinTokens,
          setSpinTokens,

          turn,
          setTurn,
          finishTurn,

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
