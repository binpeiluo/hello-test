/**
 * Game state manager for Multica Number Merge
 * Main controller for game logic
 */
import { Board } from './board';
import { Direction, MoveResult } from './merge';
import { Goal, GoalProgress } from './goal';
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';
export interface LevelConfig {
    id: number;
    boardSize: number;
    goal: Goal;
    maxMoves: number;
    initialTiles: number;
    description: string;
}
export interface GameState {
    board: Board;
    score: number;
    moves: number;
    maxMoves: number;
    status: GameStatus;
    goalProgress: GoalProgress;
    level: LevelConfig;
}
export declare class Game {
    private board;
    private mergeEngine;
    private goalEvaluator;
    private score;
    private moves;
    private status;
    private level;
    private moveHistory;
    constructor(level: LevelConfig);
    init(): void;
    move(direction: Direction): MoveResult | null;
    undo(): boolean;
    private saveState;
    getState(): GameState;
    canUndo(): boolean;
    restart(): void;
    getBoard(): Board;
    getScore(): number;
    getMovesRemaining(): number;
    getStatus(): GameStatus;
    getLevel(): LevelConfig;
}
//# sourceMappingURL=game.d.ts.map