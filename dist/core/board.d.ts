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
export declare class Board {
    size: number;
    cells: (Tile | null)[][];
    private tileIdCounter;
    constructor(size?: number);
    private createEmptyGrid;
    private generateTileId;
    emptyCells(): {
        row: number;
        col: number;
    }[];
    addRandomTile(): Tile | null;
    getTile(row: number, col: number): Tile | null;
    setTile(row: number, col: number, tile: Tile | null): void;
    removeTile(row: number, col: number): Tile | null;
    isFull(): boolean;
    canMerge(): boolean;
    isGameOver(): boolean;
    getTiles(): Tile[];
    clone(): Board;
    reset(): void;
}
//# sourceMappingURL=board.d.ts.map