"use strict";
/**
 * Board model for Multica Number Merge
 * Manages the grid state and tile operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
class Board {
    constructor(size = 4) {
        this.size = size;
        this.cells = this.createEmptyGrid();
        this.tileIdCounter = 0;
    }
    createEmptyGrid() {
        return Array.from({ length: this.size }, () => Array.from({ length: this.size }, () => null));
    }
    generateTileId() {
        return `tile_${++this.tileIdCounter}`;
    }
    // Get all empty cells
    emptyCells() {
        const cells = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (!this.cells[row][col]) {
                    cells.push({ row, col });
                }
            }
        }
        return cells;
    }
    // Add a random tile (2 or 4)
    addRandomTile() {
        const empty = this.emptyCells();
        if (empty.length === 0)
            return null;
        const { row, col } = empty[Math.floor(Math.random() * empty.length)];
        const value = Math.random() < 0.9 ? 2 : 4;
        const tile = {
            value,
            row,
            col,
            id: this.generateTileId(),
            isNew: true
        };
        this.cells[row][col] = tile;
        return tile;
    }
    // Get tile at position
    getTile(row, col) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size)
            return null;
        return this.cells[row][col];
    }
    // Set tile at position
    setTile(row, col, tile) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size)
            return;
        this.cells[row][col] = tile;
        if (tile) {
            tile.row = row;
            tile.col = col;
        }
    }
    // Remove tile at position
    removeTile(row, col) {
        const tile = this.cells[row][col];
        this.cells[row][col] = null;
        return tile;
    }
    // Check if board is full
    isFull() {
        return this.emptyCells().length === 0;
    }
    // Check if any merges are possible
    canMerge() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = this.cells[row][col];
                if (!tile)
                    continue;
                // Check right neighbor
                if (col < this.size - 1) {
                    const right = this.cells[row][col + 1];
                    if (right && right.value === tile.value)
                        return true;
                }
                // Check down neighbor
                if (row < this.size - 1) {
                    const down = this.cells[row + 1][col];
                    if (down && down.value === tile.value)
                        return true;
                }
            }
        }
        return false;
    }
    // Check if game is over (no moves available)
    isGameOver() {
        return this.isFull() && !this.canMerge();
    }
    // Get all tiles as flat array
    getTiles() {
        const tiles = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = this.cells[row][col];
                if (tile)
                    tiles.push(tile);
            }
        }
        return tiles;
    }
    // Clone the board state
    clone() {
        const newBoard = new Board(this.size);
        newBoard.tileIdCounter = this.tileIdCounter;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = this.cells[row][col];
                if (tile) {
                    newBoard.cells[row][col] = { ...tile };
                }
            }
        }
        return newBoard;
    }
    // Reset the board
    reset() {
        this.cells = this.createEmptyGrid();
        this.tileIdCounter = 0;
    }
}
exports.Board = Board;
//# sourceMappingURL=board.js.map