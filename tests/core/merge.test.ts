/**
 * Tests for MergeEngine module
 */

import { Board, Tile } from '../../src/core/board';
import { MergeEngine, Direction } from '../../src/core/merge';

describe('MergeEngine', () => {
  let board: Board;
  let engine: MergeEngine;

  beforeEach(() => {
    board = new Board(4);
    engine = new MergeEngine(board);
  });

  describe('move left', () => {
    it('should move tiles to the left', () => {
      board.setTile(0, 3, { value: 2, row: 0, col: 3, id: 'tile1' });
      const result = engine.move('left');

      expect(result.moved).toBe(true);
      expect(board.getTile(0, 0)!.value).toBe(2);
      expect(board.getTile(0, 3)).toBeNull();
    });

    it('should merge same value tiles', () => {
      board.setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      board.setTile(0, 1, { value: 2, row: 0, col: 1, id: 'tile2' });
      const result = engine.move('left');

      expect(result.moved).toBe(true);
      expect(result.score).toBe(4);
      expect(board.getTile(0, 0)!.value).toBe(4);
      expect(board.getTile(0, 1)).toBeNull();
    });

    it('should merge multiple pairs', () => {
      board.setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      board.setTile(0, 1, { value: 2, row: 0, col: 1, id: 'tile2' });
      board.setTile(0, 2, { value: 4, row: 0, col: 2, id: 'tile3' });
      board.setTile(0, 3, { value: 4, row: 0, col: 3, id: 'tile4' });
      const result = engine.move('left');

      expect(result.moved).toBe(true);
      expect(result.score).toBe(8); // 4 + 8
      expect(board.getTile(0, 0)!.value).toBe(4);
      expect(board.getTile(0, 1)!.value).toBe(8);
    });
  });

  describe('move right', () => {
    it('should move tiles to the right', () => {
      board.setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      const result = engine.move('right');

      expect(result.moved).toBe(true);
      expect(board.getTile(0, 3)!.value).toBe(2);
      expect(board.getTile(0, 0)).toBeNull();
    });

    it('should merge same value tiles', () => {
      board.setTile(0, 2, { value: 2, row: 0, col: 2, id: 'tile1' });
      board.setTile(0, 3, { value: 2, row: 0, col: 3, id: 'tile2' });
      const result = engine.move('right');

      expect(result.moved).toBe(true);
      expect(result.score).toBe(4);
      expect(board.getTile(0, 3)!.value).toBe(4);
      expect(board.getTile(0, 2)).toBeNull();
    });
  });

  describe('move up', () => {
    it('should move tiles up', () => {
      board.setTile(3, 0, { value: 2, row: 3, col: 0, id: 'tile1' });
      const result = engine.move('up');

      expect(result.moved).toBe(true);
      expect(board.getTile(0, 0)!.value).toBe(2);
      expect(board.getTile(3, 0)).toBeNull();
    });

    it('should merge same value tiles', () => {
      board.setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      board.setTile(1, 0, { value: 2, row: 1, col: 0, id: 'tile2' });
      const result = engine.move('up');

      expect(result.moved).toBe(true);
      expect(result.score).toBe(4);
      expect(board.getTile(0, 0)!.value).toBe(4);
      expect(board.getTile(1, 0)).toBeNull();
    });
  });

  describe('move down', () => {
    it('should move tiles down', () => {
      board.setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      const result = engine.move('down');

      expect(result.moved).toBe(true);
      expect(board.getTile(3, 0)!.value).toBe(2);
      expect(board.getTile(0, 0)).toBeNull();
    });

    it('should merge same value tiles', () => {
      board.setTile(2, 0, { value: 2, row: 2, col: 0, id: 'tile1' });
      board.setTile(3, 0, { value: 2, row: 3, col: 0, id: 'tile2' });
      const result = engine.move('down');

      expect(result.moved).toBe(true);
      expect(result.score).toBe(4);
      expect(board.getTile(3, 0)!.value).toBe(4);
      expect(board.getTile(2, 0)).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should not move if no tiles', () => {
      const result = engine.move('left');
      expect(result.moved).toBe(false);
      expect(result.score).toBe(0);
    });

    it('should not move if tiles cannot move', () => {
      board.setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      const result = engine.move('left');
      expect(result.moved).toBe(false);
    });

    it('should handle multiple merges in one move', () => {
      board.setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      board.setTile(0, 1, { value: 2, row: 0, col: 1, id: 'tile2' });
      board.setTile(0, 2, { value: 4, row: 0, col: 2, id: 'tile3' });
      board.setTile(0, 3, { value: 4, row: 0, col: 3, id: 'tile4' });
      const result = engine.move('left');

      expect(result.moved).toBe(true);
      expect(result.merges.length).toBe(2);
      expect(result.score).toBe(8); // 4 + 8
    });
  });

  describe('canMove', () => {
    it('should return true when move is possible', () => {
      board.setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      expect(engine.canMove()).toBe(true);
    });

    it('should return false when no moves possible', () => {
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

      expect(engine.canMove()).toBe(false);
    });
  });
});
