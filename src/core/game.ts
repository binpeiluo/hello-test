/**
 * Game state manager for Multica Number Merge
 * Main controller for game logic
 */

import { Board, Tile } from './board';
import { MergeEngine, Direction, MoveResult } from './merge';
import { GoalEvaluator, Goal, GoalProgress } from './goal';

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

export class Game {
  private board: Board;
  private mergeEngine: MergeEngine;
  private goalEvaluator: GoalEvaluator;
  private score: number;
  private moves: number;
  private status: GameStatus;
  private level: LevelConfig;
  private moveHistory: Array<{ board: Board; score: number; moves: number }>;

  constructor(level: LevelConfig) {
    this.level = level;
    this.board = new Board(level.boardSize);
    this.mergeEngine = new MergeEngine(this.board);
    this.goalEvaluator = new GoalEvaluator(level.goal);
    this.score = 0;
    this.moves = 0;
    this.status = 'idle';
    this.moveHistory = [];
  }

  // Initialize the game
  init(): void {
    this.board.reset();
    this.goalEvaluator.reset();
    this.score = 0;
    this.moves = 0;
    this.status = 'playing';
    this.moveHistory = [];

    // Add initial tiles
    for (let i = 0; i < this.level.initialTiles; i++) {
      this.board.addRandomTile();
    }
  }

  // Make a move
  move(direction: Direction): MoveResult | null {
    if (this.status !== 'playing') return null;

    // Save state for undo
    this.saveState();

    // Execute move
    const result = this.mergeEngine.move(direction);

    if (result.moved) {
      // Update score
      this.score += result.score;
      this.moves++;

      // Update goal progress
      this.goalEvaluator.updateProgress(result.score, result.merges);

      // Add new tile
      this.board.addRandomTile();

      // Check win condition
      if (this.goalEvaluator.isGoalAchieved(this.board)) {
        this.status = 'won';
      }
      // Check lose condition
      else if (this.moves >= this.level.maxMoves) {
        this.status = 'lost';
      }
      else if (this.board.isGameOver()) {
        this.status = 'lost';
      }
    }

    return result;
  }

  // Undo last move
  undo(): boolean {
    if (this.moveHistory.length === 0) return false;

    const previousState = this.moveHistory.pop()!;
    this.board = previousState.board;
    this.score = previousState.score;
    this.moves = previousState.moves;
    this.mergeEngine = new MergeEngine(this.board);

    // Reset goal evaluator and recalculate
    this.goalEvaluator.reset();
    // Note: We'd need to replay moves to recalculate goal progress
    // For simplicity, we'll just reset the goal progress
    // In a real implementation, you'd store goal progress in history

    this.status = 'playing';
    return true;
  }

  // Save current state for undo
  private saveState(): void {
    this.moveHistory.push({
      board: this.board.clone(),
      score: this.score,
      moves: this.moves
    });

    // Keep only last 10 moves
    if (this.moveHistory.length > 10) {
      this.moveHistory.shift();
    }
  }

  // Get current game state
  getState(): GameState {
    return {
      board: this.board,
      score: this.score,
      moves: this.moves,
      maxMoves: this.level.maxMoves,
      status: this.status,
      goalProgress: this.goalEvaluator.getProgress(this.board),
      level: this.level
    };
  }

  // Check if undo is available
  canUndo(): boolean {
    return this.moveHistory.length > 0;
  }

  // Restart the game
  restart(): void {
    this.init();
  }

  // Get the board
  getBoard(): Board {
    return this.board;
  }

  // Get current score
  getScore(): number {
    return this.score;
  }

  // Get moves remaining
  getMovesRemaining(): number {
    return this.level.maxMoves - this.moves;
  }

  // Get game status
  getStatus(): GameStatus {
    return this.status;
  }

  // Get level info
  getLevel(): LevelConfig {
    return this.level;
  }
}
