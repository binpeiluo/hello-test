"use strict";
/**
 * Goal evaluator for Multica Number Merge
 * Handles win/loss conditions and level objectives
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalEvaluator = void 0;
class GoalEvaluator {
    constructor(goal) {
        this.goal = goal;
        this.clearedTiles = 0;
        this.score = 0;
        this.maxCombo = 0;
    }
    // Update progress based on merge result
    updateProgress(score, merges) {
        this.score += score;
        // Count cleared tiles (merged tiles count as clearing the original)
        this.clearedTiles += merges.length;
        // Track max combo (consecutive merges in one move)
        if (merges.length > this.maxCombo) {
            this.maxCombo = merges.length;
        }
    }
    // Check if goal is achieved
    isGoalAchieved(board) {
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
    getProgress(board) {
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
    hasReachedValue(board, targetValue) {
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
    getMaxValue(board) {
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
    reset() {
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
exports.GoalEvaluator = GoalEvaluator;
//# sourceMappingURL=goal.js.map