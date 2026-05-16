/**
 * Goal evaluator for Multica Number Merge
 * Handles win/loss conditions and level objectives
 */

import { Board, Tile } from './board';

export type GoalType = 'merge_to_value' | 'clear_count' | 'score_target' | 'combo_target';

export interface Goal {
  type: GoalType;
  target: number;
  description: string;
}

export interface GoalProgress {
  current: number;
  target: number;
  completed: boolean;
}

export class GoalEvaluator {
  private goal: Goal;
  private clearedTiles: number;
  private score: number;
  private maxCombo: number;

  constructor(goal: Goal) {
    this.goal = goal;
    this.clearedTiles = 0;
    this.score = 0;
    this.maxCombo = 0;
  }

  // Update progress based on merge result
  updateProgress(score: number, merges: Array<{ row: number; col: number; value: number }>): void {
    this.score += score;

    // Count cleared tiles (merged tiles count as clearing the original)
    this.clearedTiles += merges.length;

    // Track max combo (consecutive merges in one move)
    if (merges.length > this.maxCombo) {
      this.maxCombo = merges.length;
    }
  }

  // Check if goal is achieved
  isGoalAchieved(board: Board): boolean {
    switch (this.goal.type) {
      case 'merge_to_value':
        return this.hasReachedValue(board, this.goal.target);
      case 'clear_count':
        return this.clearedTiles >= this.goal.target;
      case 'score_target':
        return this.score >= this.goal.target;
      case 'combo_target':
        return this.maxCombo >= this.goal.target;
      default:
        return false;
    }
  }

  // Get current progress
  getProgress(board: Board): GoalProgress {
    let current = 0;

    switch (this.goal.type) {
      case 'merge_to_value':
        current = this.getMaxValue(board);
        break;
      case 'clear_count':
        current = this.clearedTiles;
        break;
      case 'score_target':
        current = this.score;
        break;
      case 'combo_target':
        current = this.maxCombo;
        break;
    }

    return {
      current,
      target: this.goal.target,
      completed: current >= this.goal.target
    };
  }

  // Check if any tile has reached the target value
  private hasReachedValue(board: Board, targetValue: number): boolean {
    for (let row = 0; row < board.size; row++) {
      for (let col = 0; col < board.size; col++) {
        const tile = board.getTile(row, col);
        if (tile && tile.value >= targetValue) {
          return true;
        }
      }
    }
    return false;
  }

  // Get the maximum value on the board
  private getMaxValue(board: Board): number {
    let max = 0;
    for (let row = 0; row < board.size; row++) {
      for (let col = 0; col < board.size; col++) {
        const tile = board.getTile(row, col);
        if (tile && tile.value > max) {
          max = tile.value;
        }
      }
    }
    return max;
  }

  // Reset progress
  reset(): void {
    this.clearedTiles = 0;
    this.score = 0;
    this.maxCombo = 0;
  }

  // Get current stats
  getStats() {
    return {
      clearedTiles: this.clearedTiles,
      score: this.score,
      maxCombo: this.maxCombo
    };
  }
}
