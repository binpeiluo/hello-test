/**
 * Merge logic for Multica Number Merge
 * Handles tile movement and merging in all four directions
 */

import { Board, Tile } from './board';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface MoveResult {
  moved: boolean;
  score: number;
  merges: Array<{ row: number; col: number; value: number }>;
}

export class MergeEngine {
  private board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  // Move tiles in a direction
  move(direction: Direction): MoveResult {
    const result: MoveResult = { moved: false, score: 0, merges: [] };

    // Get the traversal order based on direction
    const traversals = this.getTraversals(direction);

    // Process each line
    for (const line of traversals) {
      const lineResult = this.processLine(line, direction);
      if (lineResult.moved) result.moved = true;
      result.score += lineResult.score;
      result.merges.push(...lineResult.merges);
    }

    return result;
  }

  private getTraversals(direction: Direction): number[][] {
    const size = this.board.size;
    const traversals: number[][] = [];

    switch (direction) {
      case 'left':
        // Process each row left to right
        for (let row = 0; row < size; row++) {
          const line: number[] = [];
          for (let col = 0; col < size; col++) {
            line.push(row * size + col);
          }
          traversals.push(line);
        }
        break;

      case 'right':
        // Process each row right to left
        for (let row = 0; row < size; row++) {
          const line: number[] = [];
          for (let col = size - 1; col >= 0; col--) {
            line.push(row * size + col);
          }
          traversals.push(line);
        }
        break;

      case 'up':
        // Process each column top to bottom
        for (let col = 0; col < size; col++) {
          const line: number[] = [];
          for (let row = 0; row < size; row++) {
            line.push(row * size + col);
          }
          traversals.push(line);
        }
        break;

      case 'down':
        // Process each column bottom to top
        for (let col = 0; col < size; col++) {
          const line: number[] = [];
          for (let row = size - 1; row >= 0; row--) {
            line.push(row * size + col);
          }
          traversals.push(line);
        }
        break;
    }

    return traversals;
  }

  private processLine(line: number[], direction: Direction): MoveResult {
    const result: MoveResult = { moved: false, score: 0, merges: [] };
    const size = this.board.size;
    const tiles: Tile[] = [];

    // Collect tiles from the line
    for (const pos of line) {
      const row = Math.floor(pos / size);
      const col = pos % size;
      const tile = this.board.getTile(row, col);
      if (tile) tiles.push(tile);
    }

    // Merge adjacent same-value tiles
    const merged: Tile[] = [];
    let i = 0;
    while (i < tiles.length) {
      if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
        // Merge these two tiles
        const newValue = tiles[i].value * 2;
        const newTile: Tile = {
          value: newValue,
          row: 0, // Will be set later
          col: 0, // Will be set later
          id: `merged_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          mergedFrom: [tiles[i], tiles[i + 1]]
        };
        merged.push(newTile);
        result.score += newValue;
        result.merges.push({ row: 0, col: 0, value: newValue });
        i += 2; // Skip the next tile
      } else {
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
      } else {
        // Clear remaining cells
        this.board.setTile(row, col, null);
      }
    }

    return result;
  }

  // Check if a move is possible in any direction
  canMove(): boolean {
    const directions: Direction[] = ['up', 'down', 'left', 'right'];
    for (const dir of directions) {
      // Create a temporary copy to test
      const tempBoard = this.board.clone();
      const tempEngine = new MergeEngine(tempBoard);
      const result = tempEngine.move(dir);
      if (result.moved) return true;
    }
    return false;
  }
}
