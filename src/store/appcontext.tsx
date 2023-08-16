import { ReactNode, SetStateAction, createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  GameState,
} from './data';
import { clamp } from '../utils';
import { getTileFromDeckIdx, insertAfterPosition, insertReelStateIntoReelStates, removeAtPosition } from './utils';
import { discardTiles, drawTiles } from '../components/machine-editor/utils';
import {
  computeEnemyAttack,
  computePlayerAttack,
  computeRound,
  getActiveCombos,
  getEffectDelta,
  pickRandomFromArray,
} from '../components/slotmachine/utils';

const gameState_queue: GameState[] = [
  // 'MENU',
  // 'NEW_ROUND',
  'SPIN',
  'PLAYER_ATTACK',
  'ENEMY_ATTACK',
  // 'ROUND_WIN',
  // 'ROUND_OVER',
  // 'GAME_OVER',
  // 'GAME_WIN'
];

const AppContext = createContext({} as AppContextType);
interface AppContextType {
  activeTiles: Tile[];

  reelResults: DeckIdxCollection;
  setReelResults: (values: SetStateAction<DeckIdxCollection>) => void;

  activeCombos: ReelComboResult[];

  reelCombos: ReelCombo[];
  setReelCombos: (values: SetStateAction<ReelCombo[]>) => void;

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

  spinTurn: number;
  setSpinTurn: (value: SetStateAction<number>) => void;
  finishSpinTurn: () => void;

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
  const [gameState, setGameState] = useState<GameState>('SPIN');
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
    label: 'player',
    hp: 10,
    hpMax: 10,
    attack: 0,
    defense: 0,
  });
  const [enemyInfo, setEnemyInfo] = useState<PlayerInfo | null>(null);
  const [spinTokens, setSpinTokens] = useState(INITIAL_SPIN_TOKENS);
  const [uiState, setUiState] = useState<UiState>('game');
  const [upgradeTokens, setUpgradeTokensState] = useState(INITIAL_UPGRADE_TOKENS);
  const [selectedTileIdx, setSelectedTileIdx] = useState(-1);
  const [reelCombos, setReelCombos] = useState<ReelCombo[]>([]);
  // const [activeCombos, setActiveCombos] = useState<ReelComboResult[]>([]);
  const [reelStates, setReelStatesState] = useState<DeckIdxCollection[]>([]);

  // for acting on reelStates in a useEffect, but dont get triggered by them
  const numReelsRef = useRef(reelStates.length);

  const [reelResults, setReelResults] = useState<DeckIdxCollection>([]);
  const [tileDeck, setTileDeck] = useState<TileKeyCollection>([]);
  const [deckState, setDeckState] = useState<DeckState>({
    drawn: [],
    draw: [],
    discard: [],
  });

  const setReelStates = useCallback(
    (reelStates: DeckIdxCollection[]) => {
      setReelStatesState(reelStates);
      numReelsRef.current = reelStates.length;
    },
    [setReelStatesState]
  );

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
    console.log('afterRemove', afterRemove);
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
    if (reelResults.includes(-1)) return [];

    return reelResults.map((slotIdx, reelIdx) => getTileFromDeckIdx(reelStates[reelIdx][slotIdx], tileDeck));
  }, [reelResults, tileDeck, reelStates]);

  const activeCombos = useMemo(() => {
    if (activeTiles.length === 0) {
      return [];
    }
    return getActiveCombos(activeTiles, reelCombos);
  }, [activeTiles, reelCombos]);

  const incrementUpgradeTokens = (newAmount: number) => {
    console.log('incrementUpgradeTokens:', newAmount);
    setUpgradeTokensState(clamp(newAmount, 0, MAX_REEL_TOKENS));
  };

  // console.log('Context, activeTiles', activeTiles);
  // console.log('Context, reelCombos', reelCombos);

  // next round
  useEffect(() => {
    console.log('ue1:', round, numReelsRef.current);
    if (round > -1) {
      if (round <= enemies.length - 1) {
        setEnemyInfo(enemies[round]);
      } else {
        // TODO: GAME WON?
        setEnemyInfo(pickRandomFromArray(enemies) as PlayerInfo);
      }
      // ideally, next turn effect does this, but when turn is already 0, it doesnt see
      // a change
      setSpinTokens(INITIAL_SPIN_TOKENS);
      console.log('INITIAL_UPGRADE_TOKENS: ue1');
      setUpgradeTokensState(INITIAL_UPGRADE_TOKENS);
      setReelResults(Array(numReelsRef.current).fill(-1));

      setTurn(0);
    } else {
      setRound(0);
    }
  }, [round, setEnemyInfo, setTurn, setRound, setSpinTokens, setUpgradeTokensState, setReelResults]);

  // next turn, reset stuff
  useEffect(() => {
    setSpinTokens(INITIAL_SPIN_TOKENS);
    setUpgradeTokensState(INITIAL_UPGRADE_TOKENS);
    setReelResults(Array(numReelsRef.current).fill(-1));
  }, [turn, setSpinTokens, setUpgradeTokensState, setReelResults]);

  const finishRound = useCallback(() => {
    setRound((prev) => prev + 1);
  }, [setRound]);

  const finishSpinTurn = useCallback(() => {
    const attack = getEffectDelta('attack', activeTiles, activeCombos);
    const defense = getEffectDelta('defense', activeTiles, activeCombos);

    setPlayerInfo((prev) => {
      return {
        ...prev,
        attack: attack,
        defense: defense,
      };
    });
  }, [setPlayerInfo, activeTiles, activeCombos]);

  // handles states during round and turn transitions

  const playerAttack = useCallback(() => {
    if (enemyInfo) {
      console.log('>>> PLAYER ATTACKS!');
      const attackResult = computePlayerAttack(playerInfo, enemyInfo);

      if (attackResult.enemy.hp <= 0) {
        console.log('>>> PLAYER KILLS ENEMY!');
        // enemy dead
        setEnemyInfo(null);
        setGameState('NEW_ROUND');
        return;
      } else {
        console.log(`>>> ENEMY IS ATTACKED FOR ${enemyInfo.hp - attackResult.enemy.hp} DAMAGE!`);
        setEnemyInfo((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            attack: attackResult.enemy.attack,
            hp: attackResult.enemy.hp,
            defense: attackResult.enemy.defense,
          };
        });
        setGameState('ENEMY_ATTACK');
      }
    } else {
      setGameState('NEW_ROUND');
    }
  }, [setGameState, playerInfo, enemyInfo]);

  const enemyAttack = useCallback(() => {
    if (enemyInfo) {
      console.log('>>> ENEMY ATTACKS!');
      const attackResult = computeEnemyAttack(playerInfo, enemyInfo);

      if (attackResult.player.hp <= 0) {
        console.log(`>>> PLAYER DIED!`);
        // player dead
        window.alert('you died!');
      } else {
        console.log(`>>> PLAYER WAS ATTACKED FOR ${playerInfo.hp - attackResult.player.hp} DAMAGE!`);
        setPlayerInfo((prev) => {
          return {
            ...prev,
            attack: attackResult.player.attack,
            hp: attackResult.player.hp,
            defense: attackResult.player.defense,
          };
        });
        setGameState('NEW_TURN');
      }
    } else {
      setGameState('NEW_ROUND');
    }
  }, [setGameState, playerInfo, enemyInfo]);

  const newTurn = useCallback(() => {
    setTurn((prev) => prev + 1);
    setGameState('SPIN');
  }, [setTurn]);

  const newRound = useCallback(() => {
    setRound((prev) => prev + 1);
    setGameState('SPIN');
  }, [setRound]);

  useEffect(() => {
    // console.log('newState>>>>>>>>>>>>> ', gameState);
    switch (gameState) {
      case 'PLAYER_ATTACK':
        playerAttack();
        break;
      case 'ENEMY_ATTACK':
        setTimeout(() => {
          enemyAttack();
        }, 2000);
        break;
      case 'NEW_TURN':
        setTimeout(() => {
          newTurn();
        }, 2000);
        break;
      case 'NEW_ROUND':
        setTimeout(() => {
          newRound();
        }, 2000);
        break;
    }
  }, [gameState, playerAttack, enemyAttack, newTurn, newRound]);

  // DO SOME FIGHTING
  const finishTurn = useCallback(() => {
    if (!enemyInfo) {
      setTurn((prev) => prev + 1);
      return;
    }

    setGameState('PLAYER_ATTACK');
  }, [setGameState, enemyInfo, setTurn]);
  /*
  const finishTurn = useCallback(() => {
    if (!enemyInfo) {
      setTurn((prev) => prev + 1);
      return;
    }

    console.log('----> FINISH TURN', playerInfo, enemyInfo, activeTiles, activeCombos);
    if (!enemyInfo) setTurn((prev) => prev + 1);

    const roundResult = computeRound(playerInfo as PlayerInfo, enemyInfo as PlayerInfo);
    console.log('roundResult', roundResult);

    if (roundResult.player.hp === 0) {
      window.alert('you died!');
    } else if (roundResult.enemy.hp === 0) {
      setPlayerInfo((prev) => ({
        ...prev,
        attack: roundResult.player.attack,
        hp: roundResult.player.hp,
        defense: roundResult.player.defense,
      }));
      setEnemyInfo(null);

      finishRound();
    } else {
      setPlayerInfo((prev) => {
        return {
          ...prev,
          attack: roundResult.player.attack,
          hp: roundResult.player.hp,
          defense: roundResult.player.defense,
        };
      });

      setEnemyInfo((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          attack: roundResult.enemy.attack,
          hp: roundResult.enemy.hp,
          defense: roundResult.enemy.defense,
        };
      });
      setTurn((prev) => prev + 1);
    }
  }, [playerInfo, enemyInfo, setTurn, activeTiles, activeCombos, setPlayerInfo, setEnemyInfo, finishRound]);
*/
  return (
    <AppContext.Provider
      value={
        {
          activeTiles,
          finishSpinTurn,

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
