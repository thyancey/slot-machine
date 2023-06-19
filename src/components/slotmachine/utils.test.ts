import { describe, it, expect } from 'vitest';
import { buildReel, getActiveCombos, projectSpinTarget } from './utils';
import { ReelCombo, Tile } from './data';

describe('slotmachine', () => {
  describe('slotmachine > reel', () => {
    describe('#buildReel', () => {
      it('should keep tiles the same when no reelOverlap provided', () => {
        expect(buildReel(['A', 'B', 'C'], 0)).toEqual(
          ['A', 'B', 'C']
        );
      });
  
      it('should keep previx items before/after reel', () => {
        expect(buildReel(['A', 'B', 'C'], 2)).toEqual(
          [
            'B', 'C',
            'A', 'B', 'C',
            'A', 'B'
          ]
        );
      });
  
      it('should handle repeat longer than array', () => {
        expect(buildReel(['A', 'B'], 3)).toEqual(
          [
            'B', 'A', 'B',
            'A', 'B',
            'A', 'B', 'A'
          ]
        );
      });
  
      it('should handle repeat for a single tile', () => {
        expect(buildReel(['A'], 3)).toEqual(
          [
            'A', 'A', 'A',
            'A',
            'A', 'A', 'A'
          ]
        );
      });
    });
  
    // TODO: something wrong with wrapped spins
    describe('#projectSpinTarget', () => {
      // numTiles, curIdx, next, numLoops
      it('should return index for same loop', () => {
        expect(projectSpinTarget(2, 0, 0, 0)).toBe(2);
        expect(projectSpinTarget(2, 0, 1, 0)).toBe(1);
      })
      it('should return index for next loop', () => {
        expect(projectSpinTarget(2, 0, 0, 1)).toBe(2);
        expect(projectSpinTarget(2, 0, 1, 1)).toBe(3);
      })
      it('should return index for next, next loop', () => {
        expect(projectSpinTarget(2, 0, 0, 2)).toBe(4);
        expect(projectSpinTarget(2, 0, 1, 2)).toBe(5);
      })
      it('should return index for a loop, from offset', () => {
        expect(projectSpinTarget(2, 0, 1, 0)).toBe(1)
      })
      it('should not do this bug', () => {
        expect(projectSpinTarget(4, 2, 0, 1)).toBe(8)
      })
      it('should not do this other bug', () => {
        expect(projectSpinTarget(4, 1, 3, 1)).toBe(7)
      })
    });
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
