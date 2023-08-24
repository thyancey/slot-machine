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
  EnemyInfo,
  AttackDef,
  EMPTY_ATTACK,
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

  enemyAttack: AttackDef;
  setEnemyAttack: (value: SetStateAction<AttackDef>) => void;

  playerAttack: AttackDef;
  setPlayerAttack: (value: SetStateAction<AttackDef>) => void;

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
  enemyInfo: EnemyInfo | null;
  setEnemyInfo: (value: SetStateAction<EnemyInfo | null>) => void;

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
  const [enemyAttack, setEnemyAttack] = useState<AttackDef | undefined>(undefined);
  const [playerAttack, setPlayerAttack] = useState<AttackDef | undefined>(undefined);
  const turnRef = useRef(turn);
  const [round, setRound] = useState(-1);
  const [gameState, setGameState] = useState<GameState>('NEW_GAME');
  const prevGameState = useRef(gameState);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
    label: 'player',
    hp: 10,
    hpMax: 10,
    defense: 0,
  });
  const [enemyInfo, setEnemyInfo] = useState<EnemyInfo | null>(null);
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
    setUpgradeTokensState(clamp(newAmount, 0, MAX_REEL_TOKENS));
  };

  const enemyChooseAttack = useCallback(() => {
    if (enemyInfo) {
      const attackDef = pickRandomFromArray(enemyInfo.attackDefs) as AttackDef;
      setEnemyAttack(() => attackDef);
    }
  }, [enemyInfo, setEnemyAttack]);

  useEffect(() => {
    setGameState('NEW_ROUND');
  }, []);
  // next round
  useEffect(() => {
    if (round > -1) {
      if (round <= enemies.length - 1) {
        setEnemyInfo(enemies[round]);
      } else {
        // TODO: GAME WON?
        setEnemyInfo(pickRandomFromArray(enemies) as EnemyInfo);
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
    if (turnRef.current !== turn && enemyInfo && enemyAttack) {
      turnRef.current = turn;

      const mssg = [`${enemyInfo.label} WILL USE *${enemyAttack.label}*`];
      if (enemyAttack.attack > 0) {
        mssg.push(`ATTACKS WITH ${enemyAttack.attack} DAMAGE`);
      }
      if (enemyAttack.defense > 0) {
        mssg.push(`ADDS ${enemyAttack.defense} BLOCK`);
      }
      if (mssg.length === 1) {
        mssg.push('(STUMBLED)');
      }
      trigger('enemyDisplay', mssg.join('\n'));
    }
  }, [enemyInfo, turn, turnRef, enemyAttack]);

  useEffect(() => {
    // fixes initial load bug
    if (enemyInfo && !enemyAttack) {
      enemyChooseAttack();
    }
  }, [enemyInfo, enemyAttack, enemyChooseAttack]);

  const finishSpinTurn = useCallback(() => {
    const attack = getEffectDelta('attack', activeTiles, activeCombos);
    const defense = getEffectDelta('defense', activeTiles, activeCombos);

    setPlayerAttack({
      label: '',
      attack: attack,
      defense: defense,
    });
  }, [activeTiles, activeCombos]);

  // handles states during round and turn transitions

  const triggerPlayerAttack = useCallback(() => {
    if (enemyInfo) {
      // TODO playerAttack
      const attackResult = computeAttack(enemyInfo, playerAttack);
      trigger('playerDisplay', '');

      if (attackResult.defender.hp <= 0) {
        trigger('playerDisplay', `${enemyInfo.label} WAS DESTROYED!`);
        // enemy dead
        setEnemyInfo(null);
        return 'NEW_ROUND';
      } else {
        const mssg = [];
        if (attackResult.defender.defenseDelta < 0) mssg.push(`${attackResult.defender.defenseDelta} BLOCK`);
        if (attackResult.defender.hpDelta < 0) mssg.push(`${attackResult.defender.hpDelta} HP`);

        if (mssg.length > 0) {
          trigger('enemyDisplay', ['ENEMY WAS ATTACKED!'].concat(mssg).join('\n'));
        } else {
          trigger('enemyDisplay', '');
          trigger('playerDisplay', 'PLAYER STUMBLED!');
        }

        setEnemyInfo((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            hp: attackResult.defender.hp,
            defense: attackResult.defender.defense,
          };
        });
        return 'ENEMY_ATTACK';
      }
    } else {
      return 'NEW_ROUND';
    }
  }, [enemyInfo, playerAttack]);

  const triggerEnemyAttack = useCallback(() => {
    if (enemyInfo) {
      const attackResult = computeAttack(playerInfo, enemyAttack);

      if (attackResult.defender.hp <= 0) {
        trigger('playerDisplay', `PLAYER DIED!`);
        // player dead
        window.alert('you died!');
        return null;
      } else {
        console.log('computed enemyAttack', attackResult);
        const playerMssg = [];
        const enemyMssg = [];
        if (attackResult.defender.defenseDelta < 0) playerMssg.push(`${attackResult.defender.defenseDelta} BLOCK`);
        if (attackResult.defender.hpDelta < 0) playerMssg.push(`${attackResult.defender.hpDelta} HP`);
        if (attackResult.attacker.hpDelta > 0) {
          enemyMssg.push(`+${attackResult.attacker.hpDelta} HP`);
        }
        if (attackResult.attacker.defenseDelta > 0) {
          enemyMssg.push(`+${attackResult.attacker.defenseDelta} BLOCK`);
        }

        const combinedPlayerMssg = playerMssg.length === 0 ? '' : ['PLAYER WAS ATTACKED!'].concat(playerMssg).join('\n');
        const combinedEnemyMssg = enemyMssg.length === 0 ? '' : ['ENEMY BUFFED!'].concat(enemyMssg).join('\n');

        trigger('playerDisplay', combinedPlayerMssg);
        trigger('enemyDisplay', combinedEnemyMssg);

        console.log('after enemyAttack, attackResult:', attackResult);
        setEnemyInfo((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            defense: prev.defense + attackResult.attacker.defenseDelta,
          };
        });
        setPlayerInfo((prev) => {
          return {
            ...prev,
            hp: attackResult.defender.hp,
            defense: attackResult.defender.defense,
          };
        });
        return 'NEW_TURN';
      }
    } else {
      return 'NEW_ROUND';
    }
  }, [playerInfo, enemyInfo, enemyAttack]);

  const newTurn = useCallback(() => {
    // just in case these don't get re-populated while theres bugs...
    trigger('playerDisplay', '! SPIN TO WIN !');
    trigger('enemyDisplay', '');

    setTurn((prev) => prev + 1);
    enemyChooseAttack();
    setPlayerAttack(EMPTY_ATTACK);

    return 'SPIN';
  }, [setTurn, enemyChooseAttack]);

  const newRound = useCallback(() => {
    trigger('playerDisplay', `ROUND ${round + 1} COMPLETE!`);
    setRound((prev) => prev + 1);
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
    if (prevGameState.current !== gameState) {
      console.log(`gameState: ${prevGameState.current} > ${gameState}`);
      prevGameState.current = gameState;
      switch (gameState) {
        case 'PLAYER_ATTACK': {
          const next = triggerPlayerAttack();
          next &&
            setTimeout(() => {
              setGameState(next);
            }, TRANSITION_DELAY);
          break;
        }
        case 'ENEMY_ATTACK': {
          const next = triggerEnemyAttack();
          next &&
            setTimeout(() => {
              setGameState(next);
            }, TRANSITION_DELAY_TURN_END);
          break;
        }
        case 'NEW_TURN': {
          // is this state necessary? it just triggers "SPIN" state next
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
  }, [gameState, triggerPlayerAttack, triggerEnemyAttack, newTurn, newRound]);

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
    setReelStates(afterRemove);
  };

  const insertReel = (positionIdx: number) => {
    if (reelStates.length < MAX_REELS) {
      setReelStates(insertReelStateIntoReelStates(positionIdx, [selectedTileIdx], reelStates));
    } else {
      console.log(`cannot add more than ${MAX_REELS} reels!`);
    }
  };

  // console.log('-------------------');
  // console.log('enemyAttack', enemyAttack);
  // console.log('playerAttack', playerAttack);

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
