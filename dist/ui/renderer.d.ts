/**
 * Canvas renderer for Multica Number Merge
 * Handles drawing the game board and UI elements
 */
import { GameState } from '../core/game';
export declare class Renderer {
    private ctx;
    private width;
    private height;
    private tileSize;
    private padding;
    private boardOffsetX;
    private boardOffsetY;
    constructor(ctx: CanvasRenderingContext2D, width: number, height: number);
    private calculateLayout;
    render(state: GameState): void;
    private drawHeader;
    private drawBoardBackground;
    private drawTiles;
    private drawTile;
    private drawGoalProgress;
    private drawMovesRemaining;
    private drawGameOverOverlay;
    private drawButton;
}
//# sourceMappingURL=renderer.d.ts.map