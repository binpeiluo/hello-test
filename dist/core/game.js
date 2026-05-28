"use strict";
/**
 * Game state manager for Multica Number Merge
 * Main controller for game logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const board_1 = require("./board");
const merge_1 = require("./merge");
const goal_1 = require("./goal");
class Game {
    constructor(level) {
        this.level = level;
        this.board = new board_1.Board(level.boardSize);
        this.mergeEngine = new merge_1.MergeEngine(this.board);
        this.goalEvaluator = new goal_1.GoalEvaluator(level.goal);
        this.score = 0;
        this.moves = 0;
        this.status = 'idle';
        this.moveHistory = [];
    }
    // Initialize the game
    init() {
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
    move(direction) {
        if (this.status !== 'playing')
            return null;
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
    undo() {
        if (this.moveHistory.length === 0)
            return false;
        const previousState = this.moveHistory.pop();
        this.board = previousState.board;
        this.score = previousState.score;
        this.moves = previousState.moves;
        this.mergeEngine = new merge_1.MergeEngine(this.board);
        // Reset goal evaluator and recalculate
        this.goalEvaluator.reset();
        // Note: We'd need to replay moves to recalculate goal progress
        // For simplicity, we'll just reset the goal progress
        // In a real implementation, you'd store goal progress in history
        this.status = 'playing';
        return true;
    }
    // Save current state for undo
    saveState() {
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
    getState() {
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
    canUndo() {
        return this.moveHistory.length > 0;
    }
    // Restart the game
    restart() {
        this.init();
    }
    // Get the board
    getBoard() {
        return this.board;
    }
    // Get current score
    getScore() {
        return this.score;
    }
    // Get moves remaining
    getMovesRemaining() {
        return this.level.maxMoves - this.moves;
    }
    // Get game status
    getStatus() {
        return this.status;
    }
    // Get level info
    getLevel() {
        return this.level;
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map