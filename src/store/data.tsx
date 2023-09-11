import AssetMap from '../assets';

export const REEL_HEIGHT = 100; // height of each reel cell, should match --val-reel-height rem value
export const REEL_OVERLAP = 2; // # of looparound cells to add to edge of reel so that it can transition nicely
export const MAX_REELS = 6;
export const INITIAL_UPGRADE_TOKENS = 1;
export const INITIAL_SCORE = 30000;
export const MAX_REEL_TOKENS = 1;
export const MAX_HAND_SIZE = 3;
export const TRANSITION_DELAY = 1500; // how long to wait between player/enemy attack messages during battle
export const TRANSITION_DELAY_TURN_END = 2000; // how long to see round results before next turn

export const ENEMY_HEIGHT = 170; // enemy is currently absolute to allow for animation, maybe make this responsive in the future

export const COST_SPIN = 10000;
export const COST_UPGRADE = 10000;

export const EMPTY_ATTACK = {
  label: '',
  attack: 0,
  defense: 0,
};

export type UiState = 'game' | 'editor';
export type EditorState = '' | 'hand' | 'reel';

export type GameState =
  | 'MENU'
  | 'NEW_GAME'
  | 'NEW_ROUND'
  | 'NEW_TURN'
  | 'SPIN'
  | 'PLAYER_BUFF'
  | 'PLAYER_ATTACK'
  | 'ENEMY_BUFF'
  | 'ENEMY_ATTACK'
  | 'ROUND_WIN'
  | 'ROUND_OVER'
  | 'GAME_OVER'
  | 'GAME_WIN';

/**
 * Tiles are defined in the TileGlossary (unique)
 * All tiles available to the player are stored in a draw TileDeck (subset, can have duplicate tiles)
 * Each turn, the payer will pull tiles from the TileDeck into their TileHand (subset of TileDeck, can have duplicate tiles)
 * Deferred/removed tiles are discarded into discard TileDeck. When the draw TileDeck is empty, it is refilled.
 *
 * 1 to MAX_REELS exists in the SlotMachine
 * Each Reel contains a TileCollection
 */

/**
 * An item that fits within a slot in a reel.
 */
export type Tile = {
  label: string;
  debugLabel?: string;
  img?: string;
  attributes: string[];
  score?: number;
  effects: EffectGroup[];
};

export type EffectType = 'attack' | 'defense' | 'health';
export type EffectGroup = {
  type: EffectType;
  value: number;
};

/**
 * Internal definition for all tiles by unique Key. Player draws tiles from a TileDeck, however
 */
export interface TileGlossary {
  [key: string]: Tile;
}
export const tileGlossary: TileGlossary = {
  bat: {
    label: 'Bat',
    debugLabel: 'attack +1, steal 3hp',
    img: AssetMap.Rbat,
    attributes: ['attack', 'creature'],
    score: 250,
    effects: [{ type: 'attack', value: 1 }],
  },
  coins: {
    label: 'Coins',
    debugLabel: '1000 points',
    img: AssetMap.Rcoins,
    attributes: ['money'],
    score: 1000,
    effects: [],
  },
  crazy: {
    label: 'Confusion',
    debugLabel: 'add 1 disoriented to enemy',
    img: AssetMap.Rcrazy,
    attributes: ['buff'],
    score: 0,
    effects: [],
  },
  flame: {
    label: 'Flame',
    debugLabel: 'attack +1, hurt self -1',
    img: AssetMap.Rflame,
    attributes: ['attack'],
    score: 250,
    effects: [
      { type: 'attack', value: 1 },
      { type: 'health', value: -1 },
    ],
  },
  halo: {
    label: 'Halo',
    debugLabel: 'heal self +10',
    img: AssetMap.Rhalo,
    attributes: ['buff'],
    score: 1000,
    effects: [{ type: 'health', value: 10 }],
  },
  heart: {
    label: 'Heart',
    debugLabel: 'heal self +2',
    img: AssetMap.Rheart,
    attributes: ['buff'],
    score: 50,
    effects: [{ type: 'health', value: 2 }],
  },
  lightning: {
    label: 'Lightning',
    debugLabel: 'attack +3, hurt self -1',
    img: AssetMap.Rlightning,
    attributes: ['attack'],
    score: 500,
    effects: [
      { type: 'attack', value: 3 },
      { type: 'health', value: -1 },
    ],
  },
  poison: {
    label: 'Poison',
    debugLabel: 'apply 2 poison, hurt self -1',
    img: AssetMap.Rpoison,
    attributes: ['attack'],
    score: 200,
    effects: [
      { type: 'attack', value: 2 },
      { type: 'health', value: -1 },
    ],
  },
  shield: {
    label: 'Shield',
    debugLabel: 'attack +1, defend self +1',
    img: AssetMap.Rshield,
    attributes: ['buff'],
    score: 100,
    effects: [{ type: 'defense', value: 1 }],
  },
  slot_seven: {
    label: 'seven',
    debugLabel: 'just a regular old 7, whatever that means',
    img: AssetMap.R7,
    attributes: [],
    score: 700,
    effects: [],
  },
  slot_bar1: {
    label: 'BAR',
    debugLabel: 'wildcard, defend self +1',
    img: AssetMap.Rbar1,
    attributes: ['bar', '*'],
    score: 100,
    effects: [{ type: 'defense', value: 6 }],
  },
  slot_bar2: {
    label: 'BAR II',
    debugLabel: 'wildcard, defend self +2',
    img: AssetMap.Rbar2,
    attributes: ['bar', '*'],
    score: 200,
    effects: [{ type: 'defense', value: 6 }],
  },
  slot_bar3: {
    label: 'BAR III',
    debugLabel: 'wildcard, defend self +3',
    img: AssetMap.Rbar3,
    attributes: ['bar', '*'],
    score: 300,
    effects: [{ type: 'defense', value: 6 }],
  },
  snowflake: {
    label: 'Freeze',
    debugLabel: 'attack +2, ice shield +1',
    img: AssetMap.Rsnowflake,
    attributes: ['attack'],
    score: 120,
    effects: [
      { type: 'attack', value: 2 },
      { type: 'defense', value: 1 },
    ],
  },
  sword: {
    label: 'Attack Boost',
    debugLabel: 'attack x2',
    img: AssetMap.Rsword,
    attributes: ['attack'],
    score: 0,
    effects: [{ type: 'attack', value: 1 }],
  },
};

/* combo/bonus stuff */
export type MatchType = 'label' | 'attrAny' | 'attrUnique';

// unique: all reels must be bar, all labels must vary
// same: all reels must be bar, all labels must match
// any: all reels must be bar
// put "any" last, otherwise it could match ahead of others
export type BonusType = 'any' | 'unique' | 'same' | '*';
export interface BonusGroup {
  bonusType: BonusType;
  multiplier?: number;
  value?: number;
}
export interface ReelComboResult {
  label: string;
  attribute: string;
  bonus: BonusGroup | null;
}

/**
 * A combination of attributes to check against a set of Tiles
 */
export interface ReelCombo {
  label: string;
  attributes: string[];
  bonuses: BonusGroup[];
}
export const reelComboDef: ReelCombo[] = [
  // {
  //   label: 'default same combo',
  //   attributes: [ "*" ], // maybe * means this applies to any attribute?
  //   bonuses: [
  //      // all reels must share attribute, share label
  //      { bonusType: 'same', multiplier: 1.5 }
  //   ]
  // },
  {
    label: '"bar" combo',
    attributes: ['bar'],
    bonuses: [
      { bonusType: 'unique', multiplier: 1.2 },
      { bonusType: 'same', multiplier: 1.4 },
      { bonusType: 'any', multiplier: 1.3 },
      { bonusType: '*', multiplier: 1.2 },
    ],
  },
  // {
  //   label: '"buff" combo',
  //   attributes: ['buff'],
  //   bonuses: [
  //     { bonusType: 'unique', multiplier: 2 },
  //     { bonusType: 'same', multiplier: 3 },
  //     { bonusType: 'any', multiplier: 1.5 },
  //     { bonusType: '*', multiplier: 1.2 },
  //   ],
  // },
  {
    label: '"attack" combo',
    attributes: ['attack'],
    bonuses: [
      { bonusType: 'unique', multiplier: 2 },
      { bonusType: 'same', multiplier: 3 },
      { bonusType: 'any', multiplier: 1.5 },
      { bonusType: '*', multiplier: 1.2 },
    ],
  },
  {
    label: '"$$$" combo',
    attributes: ['money'],
    bonuses: [
      { bonusType: 'unique', multiplier: 2 },
      { bonusType: 'same', multiplier: 3 },
      { bonusType: 'any', multiplier: 1.5 },
      { bonusType: '*', multiplier: 1.2 },
    ],
  },
];

/**
 * Holds a collection of tiles that the player will draw from. Typically contains a subset of all Tiles in the TileGlossary,
 * and will contain duplicates of tiles
 */
export type TileDeck = Tile[];
// a TileDeck holds all tiles available for a player to draw. It may or may not contain all tiles defined in the glossary
// (usually has less, the TileDeck changes as the player progresses)
export const defaultTileDeck: TileKeyCollection = [
  'slot_bar1',
  'slot_bar2', //1
  'slot_bar3',
  'flame',
  'halo',
  'coins', //5
  'coins',
  'coins',
  'lightning',
  'sword',
  'shield', //10
  'crazy',
  'bat',
  'poison',
];

/**
 * An array of tileKeys, used typically for state management and mapping
 * for various things. Tiles can be looked up via the tileGlossary
 */
export type TileKeyCollection = string[];

export type DeckIdxCollection = number[];

/**
 * Keeps track of TileDeck indicies while player is making choices
 * Generally, when discard is full, it refills draw
 */
export type DeckState = {
  drawn: number[];
  draw: number[];
  discard: number[];
};

// export const defaultReelState: DeckIdxCollection[] = [
//   [0, 1, 2, 3, 4, 5, 8, 9, 13],
//   [0, 1, 2, 3, 4, 5, 8, 9, 13],
//   [0, 1, 2, 3, 4, 5, 8, 9, 13],
// ];
export const defaultReelState: DeckIdxCollection[] = [
  [0, 9, 10],
  [0, 9, 10],
  [0, 9, 10],
];
/*
export const defaultReelState: DeckIdxCollection[] = [
  [0, 1, 2],
  [0, 1, 2],
  [0, 1, 2],
];
*/

// for the player and enemies, will need to be expanded in the future
export type PlayerInfo = {
  label: string;
  hp: number;
  hpMax: number;
  defense: number;
};

export type AttackDef = {
  label: string;
  attack: number;
  defense: number;
};

export type EnemyInfo = PlayerInfo & {
  img?: string;
  attackIdx: number;
  attackDefs: AttackDef[];
};

export const enemies: EnemyInfo[] = [
  {
    label: 'SQUIRREL',
    hp: 6,
    hpMax: 6,
    defense: 0,
    img: AssetMap.Enemy_Squirrel,
    attackIdx: 0,
    attackDefs: [
      {
        label: 'tail whip',
        attack: 3,
        defense: 0,
      },
      {
        label: 'acorn shield',
        attack: 0,
        defense: 5,
      },
    ],
  },
  {
    label: 'TORT',
    hp: 10,
    hpMax: 10,
    defense: 10,
    img: AssetMap.Enemy_Tortoise,
    attackIdx: 0,
    attackDefs: [
      {
        label: 'bite',
        attack: 3,
        defense: 0,
      },
      {
        label: 'shell up',
        attack: 0,
        defense: 10,
      },
    ],
  },
];
