/**
 * Board model for Multica Number Merge
 * Manages the grid state and tile operations
 */

export interface Tile {
  value: number;
  row: number;
  col: number;
  id: string;
  mergedFrom?: [Tile, Tile];
  isNew?: boolean;
}

export class Board {
  size: number;
  cells: (Tile | null)[][];
  private tileIdCounter: number;

  constructor(size: number = 4) {
    this.size = size;
    this.cells = this.createEmptyGrid();
    this.tileIdCounter = 0;
  }

  private createEmptyGrid(): (Tile | null)[][] {
    return Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => null)
    );
  }

  private generateTileId(): string {
    return `tile_${++this.tileIdCounter}`;
  }

  // Get all empty cells
  emptyCells(): { row: number; col: number }[] {
    const cells: { row: number; col: number }[] = [];
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
  addRandomTile(): Tile | null {
    const empty = this.emptyCells();
    if (empty.length === 0) return null;

    const { row, col } = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    const tile: Tile = {
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
  getTile(row: number, col: number): Tile | null {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return null;
    return this.cells[row][col];
  }

  // Set tile at position
  setTile(row: number, col: number, tile: Tile | null): void {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return;
    this.cells[row][col] = tile;
    if (tile) {
      tile.row = row;
      tile.col = col;
    }
  }

  // Remove tile at position
  removeTile(row: number, col: number): Tile | null {
    const tile = this.cells[row][col];
    this.cells[row][col] = null;
    return tile;
  }

  // Check if board is full
  isFull(): boolean {
    return this.emptyCells().length === 0;
  }

  // Check if any merges are possible
  canMerge(): boolean {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const tile = this.cells[row][col];
        if (!tile) continue;

        // Check right neighbor
        if (col < this.size - 1) {
          const right = this.cells[row][col + 1];
          if (right && right.value === tile.value) return true;
        }

        // Check down neighbor
        if (row < this.size - 1) {
          const down = this.cells[row + 1][col];
          if (down && down.value === tile.value) return true;
        }
      }
    }
    return false;
  }

  // Check if game is over (no moves available)
  isGameOver(): boolean {
    return this.isFull() && !this.canMerge();
  }

  // Get all tiles as flat array
  getTiles(): Tile[] {
    const tiles: Tile[] = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const tile = this.cells[row][col];
        if (tile) tiles.push(tile);
      }
    }
    return tiles;
  }

  // Clone the board state
  clone(): Board {
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
  reset(): void {
    this.cells = this.createEmptyGrid();
    this.tileIdCounter = 0;
  }
}
