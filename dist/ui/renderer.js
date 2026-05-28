"use strict";
/**
 * Canvas renderer for Multica Number Merge
 * Handles drawing the game board and UI elements
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
// Color palette for tile values
const TILE_COLORS = {
    2: '#eee4da',
    4: '#ede0c8',
    6: '#f2b179',
    8: '#f59563',
    16: '#f67c5f',
    32: '#f65e3b',
    64: '#edcf72',
    128: '#edcc61',
    256: '#edc850',
    512: '#edc53f',
    1024: '#edc22e',
    2048: '#3c3a32'
};
// Text colors for tile values
const TEXT_COLORS = {
    2: '#776e65',
    4: '#776e65',
    6: '#f9f6f2',
    8: '#f9f6f2',
    16: '#f9f6f2',
    32: '#f9f6f2',
    64: '#f9f6f2',
    128: '#f9f6f2',
    256: '#f9f6f2',
    512: '#f9f6f2',
    1024: '#f9f6f2',
    2048: '#f9f6f2'
};
class Renderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.padding = 10;
        this.tileSize = 0;
        this.boardOffsetX = 0;
        this.boardOffsetY = 0;
    }
    // Calculate layout based on board size
    calculateLayout(boardSize) {
        const maxBoardWidth = this.width - this.padding * 2;
        const maxBoardHeight = this.height * 0.6; // Use 60% of height for board
        this.tileSize = Math.min((maxBoardWidth - this.padding * (boardSize + 1)) / boardSize, (maxBoardHeight - this.padding * (boardSize + 1)) / boardSize);
        const boardWidth = this.tileSize * boardSize + this.padding * (boardSize + 1);
        const boardHeight = this.tileSize * boardSize + this.padding * (boardSize + 1);
        this.boardOffsetX = (this.width - boardWidth) / 2;
        this.boardOffsetY = this.height * 0.2; // Start at 20% from top
    }
    // Render the game
    render(state) {
        this.calculateLayout(state.board.size);
        // Clear canvas
        this.ctx.fillStyle = '#faf8ef';
        this.ctx.fillRect(0, 0, this.width, this.height);
        // Draw header
        this.drawHeader(state);
        // Draw board background
        this.drawBoardBackground(state.board.size);
        // Draw tiles
        this.drawTiles(state.board);
        // Draw goal progress
        this.drawGoalProgress(state);
        // Draw moves remaining
        this.drawMovesRemaining(state);
        // Draw game over overlay if needed
        if (state.status === 'won' || state.status === 'lost') {
            this.drawGameOverOverlay(state);
        }
    }
    // Draw header with score
    drawHeader(state) {
        // Title
        this.ctx.fillStyle = '#776e65';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Multica Number Merge', this.width / 2, 50);
        // Score
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`分数: ${state.score}`, this.width / 2, 90);
        // Level
        this.ctx.font = '18px Arial';
        this.ctx.fillText(`关卡 ${state.level.id}: ${state.level.description}`, this.width / 2, 120);
    }
    // Draw board background
    drawBoardBackground(boardSize) {
        const boardWidth = this.tileSize * boardSize + this.padding * (boardSize + 1);
        const boardHeight = this.tileSize * boardSize + this.padding * (boardSize + 1);
        // Board background
        this.ctx.fillStyle = '#bbada0';
        this.ctx.beginPath();
        this.ctx.roundRect(this.boardOffsetX, this.boardOffsetY, boardWidth, boardHeight, 8);
        this.ctx.fill();
        // Empty cell backgrounds
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const x = this.boardOffsetX + this.padding + col * (this.tileSize + this.padding);
                const y = this.boardOffsetY + this.padding + row * (this.tileSize + this.padding);
                this.ctx.fillStyle = 'rgba(238, 228, 218, 0.35)';
                this.ctx.beginPath();
                this.ctx.roundRect(x, y, this.tileSize, this.tileSize, 6);
                this.ctx.fill();
            }
        }
    }
    // Draw tiles
    drawTiles(board) {
        for (let row = 0; row < board.size; row++) {
            for (let col = 0; col < board.size; col++) {
                const tile = board.getTile(row, col);
                if (tile) {
                    this.drawTile(tile, row, col, board.size);
                }
            }
        }
    }
    // Draw a single tile
    drawTile(tile, row, col, boardSize) {
        const x = this.boardOffsetX + this.padding + col * (this.tileSize + this.padding);
        const y = this.boardOffsetY + this.padding + row * (this.tileSize + this.padding);
        // Tile background
        const bgColor = TILE_COLORS[tile.value] || '#3c3a32';
        this.ctx.fillStyle = bgColor;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, this.tileSize, this.tileSize, 6);
        this.ctx.fill();
        // Tile text
        const textColor = TEXT_COLORS[tile.value] || '#f9f6f2';
        this.ctx.fillStyle = textColor;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        // Adjust font size based on value
        let fontSize = this.tileSize * 0.4;
        if (tile.value >= 1000)
            fontSize = this.tileSize * 0.3;
        if (tile.value >= 10000)
            fontSize = this.tileSize * 0.25;
        this.ctx.font = `bold ${fontSize}px Arial`;
        this.ctx.fillText(tile.value.toString(), x + this.tileSize / 2, y + this.tileSize / 2);
    }
    // Draw goal progress
    drawGoalProgress(state) {
        const y = this.boardOffsetY + this.tileSize * state.board.size + this.padding * (state.board.size + 1) + 30;
        this.ctx.fillStyle = '#776e65';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`目标: ${state.level.goal.description}`, this.width / 2, y);
        // Progress bar
        const progress = state.goalProgress;
        const barWidth = 200;
        const barHeight = 20;
        const barX = (this.width - barWidth) / 2;
        const barY = y + 15;
        // Background
        this.ctx.fillStyle = '#eee4da';
        this.ctx.beginPath();
        this.ctx.roundRect(barX, barY, barWidth, barHeight, 10);
        this.ctx.fill();
        // Progress fill
        const fillWidth = Math.min(barWidth, (progress.current / progress.target) * barWidth);
        this.ctx.fillStyle = progress.completed ? '#8f7a66' : '#bbada0';
        this.ctx.beginPath();
        this.ctx.roundRect(barX, barY, fillWidth, barHeight, 10);
        this.ctx.fill();
        // Progress text
        this.ctx.fillStyle = '#776e65';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`${progress.current} / ${progress.target}`, this.width / 2, barY + barHeight / 2);
    }
    // Draw moves remaining
    drawMovesRemaining(state) {
        const y = this.boardOffsetY + this.tileSize * state.board.size + this.padding * (state.board.size + 1) + 100;
        this.ctx.fillStyle = '#776e65';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`剩余步数: ${state.maxMoves - state.moves}`, this.width / 2, y);
    }
    // Draw game over overlay
    drawGameOverOverlay(state) {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(238, 228, 218, 0.73)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        // Result text
        this.ctx.fillStyle = state.status === 'won' ? '#776e65' : '#776e65';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const message = state.status === 'won' ? '恭喜过关！' : '游戏结束';
        this.ctx.fillText(message, this.width / 2, this.height / 2 - 50);
        // Score
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`最终分数: ${state.score}`, this.width / 2, this.height / 2 + 10);
        // Buttons
        this.drawButton('重新开始', this.width / 2, this.height / 2 + 80, 150, 50);
        if (state.status === 'won') {
            this.drawButton('下一关', this.width / 2, this.height / 2 + 150, 150, 50);
        }
    }
    // Draw a button
    drawButton(text, x, y, width, height) {
        // Button background
        this.ctx.fillStyle = '#8f7a66';
        this.ctx.beginPath();
        this.ctx.roundRect(x - width / 2, y - height / 2, width, height, 6);
        this.ctx.fill();
        // Button text
        this.ctx.fillStyle = '#f9f6f2';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y);
    }
}
exports.Renderer = Renderer;
//# sourceMappingURL=renderer.js.map