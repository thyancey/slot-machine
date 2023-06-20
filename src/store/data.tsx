import { MinMaxTouple } from '../utils';
import AssetMap from '../assets';

export const REEL_HEIGHT = 120; // height of each reel cell
export const REEL_OVERLAP = 2; // # of looparound cells to add to edge of reel so that it can transition nicely
export const SPIN_POWER_RANGE: MinMaxTouple = [0.01, 0.03]; // RNG speed range for each reel
export const MAX_REELS = 6;
export const INITIAL_TOKENS = 2;
export const MAX_REEL_TOKENS = 5;
export const MAX_HAND_SIZE = 3;

export type UiState = 'game' | 'editor';

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
  img?: string;
  effect?: string;
  value?: number;
  attributes?: string[];
  score?: number;
};



/**
 * Internal definition for all tiles by unique Key. Player draws tiles from a TileDeck, however
 */
export interface TileGlossary {
  [key: string]: Tile;
}
export const tileGlossary: TileGlossary = {
  bat: { label: 'bat', img: AssetMap.Rbat, attributes: ['attack', 'creature'], effect: 'life steal', value: 1, score: 250 },
  coins: { label: 'coins', img: AssetMap.Rcoins, attributes: ['money'], effect: 'gold bonus', value: 5, score: 1000 },
  crazy: { label: 'crazy', img: AssetMap.Rcrazy, attributes: ['buff'], score: 0 },
  flame: { label: 'flame', img: AssetMap.Rflame, attributes: ['attack'], effect: 'fire damage', value: 1.1, score: 250 },
  halo: { label: 'halo', img: AssetMap.Rhalo, attributes: ['buff'], effect: 'extraLife', score: 1000 },
  heart: { label: 'heart', img: AssetMap.Rheart, attributes: ['buff'], effect: 'health', value: 1, score: 50 },
  lightning: {
    label: 'lightning',
    img: AssetMap.Rlightning,
    attributes: ['attack'],
    effect: 'lightning damage',
    value: 1.4,
    score: 500,
  },
  poison: { label: 'poison', img: AssetMap.Rpoison, attributes: ['attack'], effect: 'poison damage', value: 1.5, score: 200 },
  shield: { label: 'shield', img: AssetMap.Rshield, attributes: ['buff'], effect: 'defense', value: 1, score: 100 },
  slot_seven: { label: 'seven', img: AssetMap.R7, effect: 'score', value: 7, score: 700 },
  slot_bar1: { label: 'bar1', img: AssetMap.Rbar1, attributes: ['bar', '*'], score: 100 },
  slot_bar2: { label: 'bar2', img: AssetMap.Rbar2, attributes: ['bar', '*'], score: 200 },
  slot_bar3: { label: 'bar3', img: AssetMap.Rbar3, attributes: ['bar', '*'], score: 300 },
  snowflake: {
    label: 'snowflake',
    img: AssetMap.Rsnowflake,
    attributes: ['attack'],
    effect: 'freeze damage',
    value: 1.2,
    score: 120,
  },
  sword: { label: 'sword', img: AssetMap.Rsword, attributes: ['attack'], effect: 'extra damage', value: 2, score: 80 },
};


/* combo/bonus stuff */
export type MatchType = 'label' | 'attrAny' | 'attrUnique';





// unique: all reels must be bar, all labels must vary
// same: all reels must be bar, all labels must match
// any: all reels must be bar
// put "any" last, otherwise it could match ahead of others
export type BonusType = 'any' | 'unique' | 'same';
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
    label: 'bar combo',
    attributes: ['bar'],
    bonuses: [
      { bonusType: 'unique', multiplier: 1.1 },
      { bonusType: 'same', multiplier: 1.3 },
      { bonusType: 'any', multiplier: 1 },
    ],
  },
  {
    label: 'buff combo',
    attributes: ['buff'],
    bonuses: [
      { bonusType: 'unique', multiplier: 2 },
      { bonusType: 'same', multiplier: 3 },
      { bonusType: 'any', multiplier: 1.5 },
    ],
  },
  {
    label: 'attack combo',
    attributes: ['attack'],
    bonuses: [
      { bonusType: 'unique', multiplier: 2 },
      { bonusType: 'same', multiplier: 3 },
      { bonusType: 'any', multiplier: 1.5 },
    ],
  },
  {
    label: '$$$ combo',
    attributes: ['money'],
    bonuses: [
      { bonusType: 'unique', multiplier: 2 },
      { bonusType: 'same', multiplier: 3 },
      { bonusType: 'any', multiplier: 1.5 },
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
  'slot_bar2',
  'slot_bar3',
  'flame',
  'halo',
  'heart',
  'heart',
  'heart',
  'lightning',
  'sword',
  'shield',
  'crazy',
  'bat',
  'poison'
]

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
  drawn: number[],
  draw: number[],
  discard: number[]
}

export const defaultReelState: DeckIdxCollection[] = [
  [
    0,
    1,
    2
  ],
];