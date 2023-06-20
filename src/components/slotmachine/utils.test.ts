import { describe, it, expect } from 'vitest';
import { getLoopedReel, getActiveCombos, getSpinTarget } from './utils';
import { ReelCombo, Tile } from '../../store/data';

describe('slotmachine', () => {
  describe('slotmachine > reel', () => {
    describe('#getLoopedReel', () => {
      it('should keep tiles the same when no reelOverlap provided', () => {
        expect(getLoopedReel([0, 1, 2], 0)).toEqual(
          [0, 1, 2]
        );
      });
  
      it('should keep previx items before/after reel', () => {
        expect(getLoopedReel([0, 1, 2], 2)).toEqual(
          [
            1, 2,
            0, 1, 2,
            0, 1
          ]
        );
      });
  
      it('should handle repeat longer than array', () => {
        expect(getLoopedReel([0, 1], 3)).toEqual(
          [
            1, 0, 1,
            0, 1,
            0, 1, 0
          ]
        );
      });
  
      it('should handle repeat for a single tile', () => {
        expect(getLoopedReel([0], 3)).toEqual(
          [
            0, 0, 0,
            0,
            0, 0, 0
          ]
        );
      });
    });

    describe('#getSpinTarget', () => {
      // tests use a reel of 3 indicies, interpreted like this:
      // [ 0, 1, 2, | 3, 4, 5, | 6, 7, 8, | 9, 10, 11]
      it('should get adjacent spinTarget (no loop) with no minDistance', () => {
        expect(getSpinTarget(0, 1, 3, 0)).toBe(1)
      });
      it('should get adjacent spinTarget (no loop) with minDistance of 1', () => {
        expect(getSpinTarget(0, 1, 3, 1)).toBe(1)
      });
      it('should get next adjacent spinTarget (1 loop) with minDistance of 2', () => {
        expect(getSpinTarget(0, 1, 3, 2)).toBe(4)
      });
      it('should stay in same spot, if on idx and no minDistance', () => {
        expect(getSpinTarget(1, 1, 3, 0)).toBe(1)
      });
      it('should loop to next exact position, if on idx and minDistance length of set', () => {
        expect(getSpinTarget(1, 1, 3, 3)).toBe(4)
      });
      it('should loop to next exact position, if on idx and minDistance less than length of set, but greater than 0', () => {
        expect(getSpinTarget(1, 1, 3, 1)).toBe(4)
      });
      it('should loop a bunch of times with a big minDistance, and land on desired idx', () => {
        expect(getSpinTarget(1, 0, 3, 6)).toBe(9)
      });
    })
  });
  
  describe('#getActiveCombos', () => {

    it('should match "same" tiles', () => {
      const tiles = [
        { label: 'fire', attributes: ['attack', 'hot'] },
        { label: 'fire', attributes: ['attack', 'hot'] },
        { label: 'fire', attributes: ['attack', 'hot'] },
      ] as Tile[];

      const reelCombos = [
        {
          label: 'attack combo',
          attributes: ['attack'],
          bonuses: [
            { bonusType: 'same', multiplier: 3 },
            { bonusType: 'unique', multiplier: 2 },
            { bonusType: 'any', multiplier: 1.5 },
          ]
        },
      ] as ReelCombo[];

      const reelComboResult = {
        label: 'attack combo',
        attribute: 'attack',
        bonus: {
          bonusType: 'same',
          multiplier: 3
        }
      }

      expect(getActiveCombos(tiles, reelCombos)).toEqual([reelComboResult]);
    });

    it('should match "unique" tiles, and not do "any"', () => {
      const tiles = [
        { label: 'fire1', attributes: ['attack'] },
        { label: 'fire2', attributes: ['attack'] },
        { label: 'fire3', attributes: ['attack'] },
      ] as Tile[];

      const reelCombos = [
        {
          label: 'attack combo',
          attributes: ['attack'],
          bonuses: [
            { bonusType: 'same', multiplier: 3 },
            { bonusType: 'unique', multiplier: 2 },
            { bonusType: 'any', multiplier: 1.5 },
          ]
        },
      ] as ReelCombo[];

      const reelComboResult = {
        label: 'attack combo',
        attribute: 'attack',
        bonus: {
          bonusType: 'unique',
          multiplier: 2
        }
      }

      expect(getActiveCombos(tiles, reelCombos)).toEqual([reelComboResult]);
    });

    it('should match "any" tiles, if it trumps another rule', () => {
      const tiles = [
        { label: 'fire1', attributes: ['attack'] },
        { label: 'fire2', attributes: ['attack'] },
        { label: 'fire3', attributes: ['attack'] },
      ] as Tile[];

      const reelCombos = [
        {
          label: 'attack combo',
          attributes: ['attack'],
          bonuses: [
            { bonusType: 'any', multiplier: 1.5 },
            { bonusType: 'same', multiplier: 3 },
            { bonusType: 'unique', multiplier: 2 },
          ]
        },
      ] as ReelCombo[];

      const reelComboResult = {
        label: 'attack combo',
        attribute: 'attack',
        bonus: {
          bonusType: 'any',
          multiplier: 1.5
        }
      }

      expect(getActiveCombos(tiles, reelCombos)).toEqual([reelComboResult]);
    });

    it('should match "any" tiles, if other match types are bad', () => {
      const tiles = [
        { label: 'fire1', attributes: ['attack'] },
        { label: 'fire2', attributes: ['attack'] },
        { label: 'fire2', attributes: ['attack'] },
      ] as Tile[];

      const reelCombos = [
        {
          label: 'attack combo',
          attributes: ['attack'],
          bonuses: [
            { bonusType: 'same', multiplier: 3 },
            { bonusType: 'unique', multiplier: 2 },
            { bonusType: 'any', multiplier: 1.5 },
          ]
        },
      ] as ReelCombo[];

      const reelComboResult = {
        label: 'attack combo',
        attribute: 'attack',
        bonus: {
          bonusType: 'any',
          multiplier: 1.5
        }
      }

      expect(getActiveCombos(tiles, reelCombos)).toEqual([reelComboResult]);
    });
  });
});

/*
[
    {
        "label": "bat",
        "img": "/slot-machine/src/assets/reels/reel-bat.gif",
        "attributes": [
            "attack",
            "creature"
        ],
        "effect": "life steal",
        "value": 1,
        "idx": 4
    },
    {
        "label": "flame",
        "img": "/slot-machine/src/assets/reels/reel-flame.gif",
        "attributes": [
            "attack"
        ],
        "effect": "fire damage",
        "value": 1.1,
        "idx": 7
    },
    {
        "label": "snowflake",
        "img": "/slot-machine/src/assets/reels/reel-snowflake.gif",
        "attributes": [
            "attack"
        ],
        "effect": "freeze damage",
        "value": 1.2,
        "idx": 13
    }
]
*/

/*
const reelCombos = [
  {
      "label": "bar combo",
      "attributes": [
          "bar"
      ],
      "bonuses": {
          "any": 1.5,
          "same": 3,
          "unique": 2
      }
  },
  {
      "label": "buff combo",
      "attributes": [
          "buff"
      ],
      "bonuses": {
          "any": 1.5,
          "same": 3,
          "unique": 2
      }
  },
  {
      "label": "attack combo",
      "attributes": [
          "attack"
      ],
      "bonuses": {
          "any": 1.5,
          "same": 3,
          "unique": 2
      }
  }
]
*/
