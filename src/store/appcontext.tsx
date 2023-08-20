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
  TRANSITION_DELAY,
  TRANSITION_DELAY_TURN_END,
} from './data';
import { clamp, pickRandomFromArray } from '../utils';
import { getTileFromDeckIdx, insertAfterPosition, insertReelStateIntoReelStates, removeAtPosition } from './utils';
import {
  computeAttack,
  discardTiles,
  drawTiles,
  getActiveCombos,
  getEffectDelta,
} from '../components/slotmachine/utils';
import { trigger } from '../utils/events';

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

  gameState: GameState;

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
  const turnRef = useRef(turn);
  const [round, setRound] = useState(-1);
  const [gameState, setGameState] = useState<GameState>('NEW_GAME');
  const prevGameState = useRef(gameState);
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

  useEffect(() => {
    setGameState('NEW_ROUND');
  }, [])
  // next round
  useEffect(() => {
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
      setUpgradeTokensState(INITIAL_UPGRADE_TOKENS);
      setReelResults(Array(numReelsRef.current).fill(-1));

      setTurn(0);
    } else {
      // setRound(0);
    }
  }, [round, setEnemyInfo, setTurn, setRound, setSpinTokens, setUpgradeTokensState, setReelResults]);

  // next turn, reset stuff
  useEffect(() => {
    setSpinTokens(INITIAL_SPIN_TOKENS);
    setUpgradeTokensState(INITIAL_UPGRADE_TOKENS);
    setReelResults(Array(numReelsRef.current).fill(-1));
  }, [turn, setSpinTokens, setUpgradeTokensState, setReelResults]);

  // const finishRound = useCallback(() => {
  //   setRound((prev) => prev + 1);
  // }, [setRound]);

  useEffect(() => {
    if(turnRef.current !== turn && enemyInfo){
      turnRef.current = turn;
      trigger('enemyDisplay', `${enemyInfo.label} WILL ATTACK WITH ${enemyInfo.attack} DAMAGE`);
    }
  }, [ enemyInfo, turn, turnRef ]);

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
      const attackResult = computeAttack(playerInfo, enemyInfo);
      trigger('playerDisplay', '');

      if (attackResult.defender.hp <= 0) {
        trigger('playerDisplay', `${enemyInfo.label} WAS DESTROYED!`);
        // enemy dead
        setEnemyInfo(null);
        return 'NEW_ROUND';
      } else {
        const mssg = [];
        if (attackResult.defender.defenseDelta > 0) mssg.push(`BLOCKED ${attackResult.defender.defenseDelta}`);
        if (attackResult.defender.hpDelta > 0) mssg.push(`TOOK ${attackResult.defender.hpDelta} DAMAGE`);
        const combinedMssg = (mssg.length === 0) ? 'PLAYER STUMBLED!' : [ 'ENEMY WAS ATTACKED!' ].concat(mssg).join('\n');

        trigger('enemyDisplay', combinedMssg);
        setEnemyInfo((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            attack: attackResult.defender.attack,
            hp: attackResult.defender.hp,
            defense: attackResult.defender.defense,
          };
        });
        return 'ENEMY_ATTACK';
      }
    } else {
      return 'NEW_ROUND';
    }
  }, [playerInfo, enemyInfo]);

  const enemyAttack = useCallback(() => {
    if (enemyInfo) {
      console.log('>>> ENEMY ATTACKS!');
      const attackResult = computeAttack(enemyInfo, playerInfo);

      if (attackResult.defender.hp <= 0) {
        trigger('playerDisplay', `PLAYER DIED!`);
        // player dead
        window.alert('you died!');
        return null;
      } else {
        const mssg = [];
        if (attackResult.defender.defenseDelta > 0) mssg.push(`BLOCKED ${attackResult.defender.defenseDelta}`);
        if (attackResult.defender.hpDelta > 0) mssg.push(`TOOK ${attackResult.defender.hpDelta} DAMAGE`);
        const combinedMssg = (mssg.length === 0) ? 'ENEMY STUMBLED!' : [ 'PLAYER WAS ATTACKED!' ].concat(mssg).join('\n');

        trigger('playerDisplay', combinedMssg);
        console.log(attackResult.defender)
        setPlayerInfo((prev) => {
          return {
            ...prev,
            attack: attackResult.defender.attack,
            hp: attackResult.defender.hp,
            defense: attackResult.defender.defense,
          };
        });
        return 'NEW_TURN';
      }
    } else {
      return 'NEW_ROUND';
    }
  }, [playerInfo, enemyInfo]);

  const newTurn = useCallback(() => {
    // just in case these don't get re-populated while theres bugs...
    trigger('playerDisplay', '! SPIN TO WIN !');
    trigger('enemyDisplay', '');

    setTurn((prev) => prev + 1);
    
    return 'SPIN';
  }, [setTurn]);

  const newRound = useCallback(() => {
    trigger('playerDisplay', `ROUND ${round + 1} COMPLETE!`);
    setRound((prev) => prev + 1);
    console.log('newRound spin')
    setGameState('NEW_TURN');
  }, [setRound, round]);

  // DO SOME FIGHTING
  const finishTurn = useCallback(() => {
    if (!enemyInfo) {
      setTurn((prev) => prev + 1);
      return;
    }

    setGameState('PLAYER_ATTACK');
  }, [setGameState, enemyInfo, setTurn]);

  useEffect(() => {
    // the timeouts here are brittle and likely to cause problems later
    if(prevGameState.current !== gameState){
      console.log(`gameState: ${prevGameState.current} > ${gameState}`);
      prevGameState.current = gameState;
      switch (gameState) {
        case 'PLAYER_ATTACK': {
          const next = playerAttack();
          next && setTimeout(() => {
            setGameState(next);
          }, TRANSITION_DELAY);
          break;
        }
        case 'ENEMY_ATTACK':{
          const next = enemyAttack();
          next && setTimeout(() => {
            setGameState(next);
          }, TRANSITION_DELAY_TURN_END);
          break;
        }
        case 'NEW_TURN':
          // is this state necessary? it just triggers "SPIN" state next
          {
            const next = newTurn();
            next && setGameState(next);
            break;
          }
        case 'NEW_ROUND':
            // eventually, might wanna delay this a bit
            newRound();
          break;
      }
    }
  }, [gameState, playerAttack, enemyAttack, newTurn, newRound]);

  
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

  return (
    <AppContext.Provider
      value={
        {
          gameState,

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
