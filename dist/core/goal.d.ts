/**
 * Goal evaluator for Multica Number Merge
 * Handles win/loss conditions and level objectives
 */
import { Board } from './board';
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
export declare class GoalEvaluator {
    private goal;
    private clearedTiles;
    private score;
    private maxCombo;
    constructor(goal: Goal);
    updateProgress(score: number, merges: Array<{
        row: number;
        col: number;
        value: number;
    }>): void;
    isGoalAchieved(board: Board): boolean;
    getProgress(board: Board): GoalProgress;
    private hasReachedValue;
    private getMaxValue;
    reset(): void;
    getStats(): {
        clearedTiles: number;
        score: number;
        maxCombo: number;
    };
}
//# sourceMappingURL=goal.d.ts.map