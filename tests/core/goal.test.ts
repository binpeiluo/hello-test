/**
 * Tests for GoalEvaluator module
 */

import { Board, Tile } from '../../src/core/board';
import { GoalEvaluator, Goal } from '../../src/core/goal';

function makeTile(value: number, row: number, col: number): Tile {
  return { value, row, col, id: `tile_${row}_${col}` };
}

describe('GoalEvaluator', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board(4);
  });

  describe('merge_to_value goal', () => {
    it('should detect when target value is reached', () => {
      const goal: Goal = { type: 'merge_to_value', target: 16, description: '合成数字 16' };
      const evaluator = new GoalEvaluator(goal);

      expect(evaluator.isGoalAchieved(board)).toBe(false);

      board.setTile(0, 0, makeTile(16, 0, 0));
      expect(evaluator.isGoalAchieved(board)).toBe(true);
    });

    it('should detect when value exceeds target', () => {
      const goal: Goal = { type: 'merge_to_value', target: 16, description: '合成数字 16' };
      const evaluator = new GoalEvaluator(goal);

      board.setTile(0, 0, makeTile(32, 0, 0));
      expect(evaluator.isGoalAchieved(board)).toBe(true);
    });

    it('should report correct progress', () => {
      const goal: Goal = { type: 'merge_to_value', target: 64, description: '合成数字 64' };
      const evaluator = new GoalEvaluator(goal);

      board.setTile(0, 0, makeTile(8, 0, 0));
      board.setTile(1, 1, makeTile(16, 1, 1));

      const progress = evaluator.getProgress(board);
      expect(progress.current).toBe(16);
      expect(progress.target).toBe(64);
      expect(progress.completed).toBe(false);
    });
  });

  describe('clear_count goal', () => {
    it('should track cleared tiles from merges', () => {
      const goal: Goal = { type: 'clear_count', target: 3, description: '消除 3 个方块' };
      const evaluator = new GoalEvaluator(goal);

      evaluator.updateProgress(4, [{ row: 0, col: 0, value: 4 }]);
      expect(evaluator.isGoalAchieved(board)).toBe(false);

      evaluator.updateProgress(8, [{ row: 0, col: 0, value: 8 }, { row: 1, col: 0, value: 8 }]);
      expect(evaluator.isGoalAchieved(board)).toBe(true);
    });

    it('should report correct progress', () => {
      const goal: Goal = { type: 'clear_count', target: 5, description: '消除 5 个方块' };
      const evaluator = new GoalEvaluator(goal);

      evaluator.updateProgress(4, [{ row: 0, col: 0, value: 4 }]);

      const progress = evaluator.getProgress(board);
      expect(progress.current).toBe(1);
      expect(progress.target).toBe(5);
      expect(progress.completed).toBe(false);
    });
  });

  describe('score_target goal', () => {
    it('should track score progress', () => {
      const goal: Goal = { type: 'score_target', target: 100, description: '达到 100 分' };
      const evaluator = new GoalEvaluator(goal);

      evaluator.updateProgress(50, [{ row: 0, col: 0, value: 50 }]);
      expect(evaluator.isGoalAchieved(board)).toBe(false);

      evaluator.updateProgress(60, [{ row: 0, col: 0, value: 60 }]);
      expect(evaluator.isGoalAchieved(board)).toBe(true);
    });

    it('should accumulate score across multiple updates', () => {
      const goal: Goal = { type: 'score_target', target: 100, description: '达到 100 分' };
      const evaluator = new GoalEvaluator(goal);

      evaluator.updateProgress(30, []);
      evaluator.updateProgress(30, []);
      evaluator.updateProgress(30, []);

      const progress = evaluator.getProgress(board);
      expect(progress.current).toBe(90);
      expect(progress.completed).toBe(false);

      evaluator.updateProgress(20, []);
      expect(evaluator.isGoalAchieved(board)).toBe(true);
    });
  });

  describe('combo_target goal', () => {
    it('should track max combo from single move', () => {
      const goal: Goal = { type: 'combo_target', target: 3, description: '达成 3 连击' };
      const evaluator = new GoalEvaluator(goal);

      evaluator.updateProgress(10, [
        { row: 0, col: 0, value: 4 },
        { row: 1, col: 0, value: 8 },
        { row: 2, col: 0, value: 16 }
      ]);

      expect(evaluator.isGoalAchieved(board)).toBe(true);
    });

    it('should track max combo across moves', () => {
      const goal: Goal = { type: 'combo_target', target: 3, description: '达成 3 连击' };
      const evaluator = new GoalEvaluator(goal);

      evaluator.updateProgress(4, [{ row: 0, col: 0, value: 4 }]);
      expect(evaluator.isGoalAchieved(board)).toBe(false);

      evaluator.updateProgress(12, [
        { row: 0, col: 0, value: 4 },
        { row: 1, col: 0, value: 8 },
        { row: 2, col: 0, value: 16 }
      ]);
      expect(evaluator.isGoalAchieved(board)).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should return correct stats', () => {
      const goal: Goal = { type: 'score_target', target: 100, description: '达到 100 分' };
      const evaluator = new GoalEvaluator(goal);

      evaluator.updateProgress(50, [{ row: 0, col: 0, value: 50 }, { row: 1, col: 0, value: 50 }]);

      const stats = evaluator.getStats();
      expect(stats.clearedTiles).toBe(2);
      expect(stats.score).toBe(50);
      expect(stats.maxCombo).toBe(2);
    });
  });

  describe('reset', () => {
    it('should reset all progress', () => {
      const goal: Goal = { type: 'score_target', target: 100, description: '达到 100 分' };
      const evaluator = new GoalEvaluator(goal);

      evaluator.updateProgress(50, [{ row: 0, col: 0, value: 50 }]);
      evaluator.reset();

      const stats = evaluator.getStats();
      expect(stats.clearedTiles).toBe(0);
      expect(stats.score).toBe(0);
      expect(stats.maxCombo).toBe(0);
    });
  });
});
