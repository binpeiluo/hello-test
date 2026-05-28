"use strict";
/**
 * Merge logic for Multica Number Merge
 * Handles tile movement and merging in all four directions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeEngine = void 0;
class MergeEngine {
    constructor(board) {
        this.board = board;
    }
    // Move tiles in a direction
    move(direction) {
        const result = { moved: false, score: 0, merges: [] };
        // Get the traversal order based on direction
        const traversals = this.getTraversals(direction);
        // Process each line
        for (const line of traversals) {
            const lineResult = this.processLine(line, direction);
            if (lineResult.moved)
                result.moved = true;
            result.score += lineResult.score;
            result.merges.push(...lineResult.merges);
        }
        return result;
    }
    getTraversals(direction) {
        const size = this.board.size;
        const traversals = [];
        switch (direction) {
            case 'left':
                // Process each row left to right
                for (let row = 0; row < size; row++) {
                    const line = [];
                    for (let col = 0; col < size; col++) {
                        line.push(row * size + col);
                    }
                    traversals.push(line);
                }
                break;
            case 'right':
                // Process each row right to left
                for (let row = 0; row < size; row++) {
                    const line = [];
                    for (let col = size - 1; col >= 0; col--) {
                        line.push(row * size + col);
                    }
                    traversals.push(line);
                }
                break;
            case 'up':
                // Process each column top to bottom
                for (let col = 0; col < size; col++) {
                    const line = [];
                    for (let row = 0; row < size; row++) {
                        line.push(row * size + col);
                    }
                    traversals.push(line);
                }
                break;
            case 'down':
                // Process each column bottom to top
                for (let col = 0; col < size; col++) {
                    const line = [];
                    for (let row = size - 1; row >= 0; row--) {
                        line.push(row * size + col);
                    }
                    traversals.push(line);
                }
                break;
        }
        return traversals;
    }
    processLine(line, direction) {
        const result = { moved: false, score: 0, merges: [] };
        const size = this.board.size;
        const tiles = [];
        // Collect tiles from the line
        for (const pos of line) {
            const row = Math.floor(pos / size);
            const col = pos % size;
            const tile = this.board.getTile(row, col);
            if (tile)
                tiles.push(tile);
        }
        // Merge adjacent same-value tiles
        const merged = [];
        let hasMerge = false;
        let i = 0;
        while (i < tiles.length) {
            if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
                // Merge these two tiles
                const newValue = tiles[i].value * 2;
                const newTile = {
                    value: newValue,
                    row: 0, // Will be set later
                    col: 0, // Will be set later
                    id: `merged_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    mergedFrom: [tiles[i], tiles[i + 1]]
                };
                merged.push(newTile);
                result.score += newValue;
                result.merges.push({ row: 0, col: 0, value: newValue });
                hasMerge = true;
                i += 2; // Skip the next tile
            }
            else {
                merged.push(tiles[i]);
                i++;
            }
        }
        // Place tiles back in the line
        for (let j = 0; j < line.length; j++) {
            const row = Math.floor(line[j] / size);
            const col = line[j] % size;
            if (j < merged.length) {
                const tile = merged[j];
                const oldRow = tile.row;
                const oldCol = tile.col;
                // Update position
                tile.row = row;
                tile.col = col;
                // Check if position changed
                if (oldRow !== row || oldCol !== col) {
                    result.moved = true;
                }
                this.board.setTile(row, col, tile);
            }
            else {
                // Clear remaining cells
                this.board.setTile(row, col, null);
            }
        }
        // Any merge counts as a move
        if (hasMerge)
            result.moved = true;
        return result;
    }
    // Check if a move is possible in any direction
    canMove() {
        const directions = ['up', 'down', 'left', 'right'];
        for (const dir of directions) {
            // Create a temporary copy to test
            const tempBoard = this.board.clone();
            const tempEngine = new MergeEngine(tempBoard);
            const result = tempEngine.move(dir);
            if (result.moved)
                return true;
        }
        return false;
    }
}
exports.MergeEngine = MergeEngine;
//# sourceMappingURL=merge.js.map