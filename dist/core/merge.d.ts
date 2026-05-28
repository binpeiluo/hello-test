/**
 * Merge logic for Multica Number Merge
 * Handles tile movement and merging in all four directions
 */
import { Board } from './board';
export type Direction = 'up' | 'down' | 'left' | 'right';
export interface MoveResult {
    moved: boolean;
    score: number;
    merges: Array<{
        row: number;
        col: number;
        value: number;
    }>;
}
export declare class MergeEngine {
    private board;
    constructor(board: Board);
    move(direction: Direction): MoveResult;
    private getTraversals;
    private processLine;
    canMove(): boolean;
}
//# sourceMappingURL=merge.d.ts.map