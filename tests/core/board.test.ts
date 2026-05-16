/**
 * Tests for Board module
 */

import { Board, Tile } from '../../src/core/board';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board(4);
  });

  describe('initialization', () => {
    it('should create an empty board', () => {
      expect(board.size).toBe(4);
      expect(board.emptyCells().length).toBe(16);
    });

    it('should create board with custom size', () => {
      const board5x5 = new Board(5);
      expect(board5x5.size).toBe(5);
      expect(board5x5.emptyCells().length).toBe(25);
    });
  });

  describe('emptyCells', () => {
    it('should return all empty cells', () => {
      const empty = board.emptyCells();
      expect(empty.length).toBe(16);
      expect(empty).toContainEqual({ row: 0, col: 0 });
      expect(empty).toContainEqual({ row: 3, col: 3 });
    });

    it('should return fewer cells after adding tiles', () => {
      board.addRandomTile();
      expect(board.emptyCells().length).toBe(15);
    });
  });

  describe('addRandomTile', () => {
    it('should add a tile to an empty cell', () => {
      const tile = board.addRandomTile();
      expect(tile).not.toBeNull();
      expect(tile!.value).toBeGreaterThanOrEqual(2);
      expect(tile!.value).toBeLessThanOrEqual(4);
    });

    it('should return null when board is full', () => {
      // Fill the board
      for (let i = 0; i < 16; i++) {
        board.addRandomTile();
      }
      const tile = board.addRandomTile();
      expect(tile).toBeNull();
    });

    it('should generate 2 with 90% probability', () => {
      let count2 = 0;
      let count4 = 0;
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const testBoard = new Board(4);
        const tile = testBoard.addRandomTile();
        if (tile!.value === 2) count2++;
        else if (tile!.value === 4) count4++;
      }

      // Allow some variance
      expect(count2 / iterations).toBeGreaterThan(0.8);
      expect(count2 / iterations).toBeLessThan(1.0);
    });
  });

  describe('getTile and setTile', () => {
    it('should get and set tiles correctly', () => {
      const tile: Tile = { value: 2, row: 0, col: 0, id: 'test' };
      board.setTile(0, 0, tile);
      expect(board.getTile(0, 0)).toBe(tile);
    });

    it('should return null for empty cells', () => {
      expect(board.getTile(0, 0)).toBeNull();
    });

    it('should return null for out of bounds', () => {
      expect(board.getTile(-1, 0)).toBeNull();
      expect(board.getTile(4, 0)).toBeNull();
      expect(board.getTile(0, -1)).toBeNull();
      expect(board.getTile(0, 4)).toBeNull();
    });
  });

  describe('removeTile', () => {
    it('should remove a tile', () => {
      const tile: Tile = { value: 2, row: 0, col: 0, id: 'test' };
      board.setTile(0, 0, tile);
      const removed = board.removeTile(0, 0);
      expect(removed).toBe(tile);
      expect(board.getTile(0, 0)).toBeNull();
    });
  });

  describe('isFull', () => {
    it('should return false for empty board', () => {
      expect(board.isFull()).toBe(false);
    });

    it('should return true when board is full', () => {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          board.setTile(row, col, { value: 2, row, col, id: `tile_${row}_${col}` });
        }
      }
      expect(board.isFull()).toBe(true);
    });
  });

  describe('canMerge', () => {
    it('should return false for empty board', () => {
      expect(board.canMerge()).toBe(false);
    });

    it('should return true when adjacent tiles have same value', () => {
      board.setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      board.setTile(0, 1, { value: 2, row: 0, col: 1, id: 'tile2' });
      expect(board.canMerge()).toBe(true);
    });

    it('should return false when no adjacent tiles have same value', () => {
      board.setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      board.setTile(0, 1, { value: 4, row: 0, col: 1, id: 'tile2' });
      expect(board.canMerge()).toBe(false);
    });
  });

  describe('isGameOver', () => {
    it('should return false for empty board', () => {
      expect(board.isGameOver()).toBe(false);
    });

    it('should return true when board is full and no merges possible', () => {
      // Create a board with alternating values
      const values = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2]
      ];

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          board.setTile(row, col, {
            value: values[row][col],
            row,
            col,
            id: `tile_${row}_${col}`
          });
        }
      }

      expect(board.isGameOver()).toBe(true);
    });
  });

  describe('getTiles', () => {
    it('should return all tiles', () => {
      board.setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      board.setTile(1, 1, { value: 4, row: 1, col: 1, id: 'tile2' });
      const tiles = board.getTiles();
      expect(tiles.length).toBe(2);
    });
  });

  describe('clone', () => {
    it('should create a deep copy', () => {
      board.setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      const cloned = board.clone();

      // Modify original
      board.setTile(0, 0, { value: 4, row: 0, col: 0, id: 'tile2' });

      // Cloned should not be affected
      expect(cloned.getTile(0, 0)!.value).toBe(2);
    });
  });

  describe('reset', () => {
    it('should clear the board', () => {
      board.addRandomTile();
      board.addRandomTile();
      board.reset();
      expect(board.emptyCells().length).toBe(16);
    });
  });
});
