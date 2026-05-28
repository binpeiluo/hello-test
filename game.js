/**
 * Multica Number Merge - WeChat Mini Game
 * Main entry point
 */

// ==================== Board Module ====================
class Board {
  constructor(size = 4) {
    this.size = size;
    this.cells = this.createEmptyGrid();
    this.tileIdCounter = 0;
  }

  createEmptyGrid() {
    return Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => null)
    );
  }

  generateTileId() {
    return `tile_${++this.tileIdCounter}`;
  }

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

  addRandomTile() {
    const empty = this.emptyCells();
    if (empty.length === 0) return null;

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

  getTile(row, col) {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return null;
    return this.cells[row][col];
  }

  setTile(row, col, tile) {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return;
    this.cells[row][col] = tile;
    if (tile) {
      tile.row = row;
      tile.col = col;
    }
  }

  removeTile(row, col) {
    const tile = this.cells[row][col];
    this.cells[row][col] = null;
    return tile;
  }

  isFull() {
    return this.emptyCells().length === 0;
  }

  canMerge() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const tile = this.cells[row][col];
        if (!tile) continue;

        if (col < this.size - 1) {
          const right = this.cells[row][col + 1];
          if (right && right.value === tile.value) return true;
        }

        if (row < this.size - 1) {
          const down = this.cells[row + 1][col];
          if (down && down.value === tile.value) return true;
        }
      }
    }
    return false;
  }

  isGameOver() {
    return this.isFull() && !this.canMerge();
  }

  getTiles() {
    const tiles = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const tile = this.cells[row][col];
        if (tile) tiles.push(tile);
      }
    }
    return tiles;
  }

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

  reset() {
    this.cells = this.createEmptyGrid();
    this.tileIdCounter = 0;
  }
}

// ==================== MergeEngine Module ====================
class MergeEngine {
  constructor(board) {
    this.board = board;
  }

  move(direction) {
    const result = { moved: false, score: 0, merges: [] };
    const traversals = this.getTraversals(direction);

    for (const line of traversals) {
      const lineResult = this.processLine(line);
      if (lineResult.moved) result.moved = true;
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
        for (let row = 0; row < size; row++) {
          const line = [];
          for (let col = 0; col < size; col++) {
            line.push(row * size + col);
          }
          traversals.push(line);
        }
        break;
      case 'right':
        for (let row = 0; row < size; row++) {
          const line = [];
          for (let col = size - 1; col >= 0; col--) {
            line.push(row * size + col);
          }
          traversals.push(line);
        }
        break;
      case 'up':
        for (let col = 0; col < size; col++) {
          const line = [];
          for (let row = 0; row < size; row++) {
            line.push(row * size + col);
          }
          traversals.push(line);
        }
        break;
      case 'down':
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

  processLine(line) {
    const result = { moved: false, score: 0, merges: [] };
    const size = this.board.size;
    const tiles = [];

    // Collect tiles from the line
    for (const pos of line) {
      const row = Math.floor(pos / size);
      const col = pos % size;
      const tile = this.board.getTile(row, col);
      if (tile) tiles.push(tile);
    }

    // Merge adjacent same-value tiles
    const merged = [];
    let hasMerge = false;
    let i = 0;
    while (i < tiles.length) {
      if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
        const newValue = tiles[i].value * 2;
        const newTile = {
          value: newValue,
          row: 0,
          col: 0,
          id: `merged_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          mergedFrom: [tiles[i], tiles[i + 1]]
        };
        merged.push(newTile);
        result.score += newValue;
        result.merges.push({ row: 0, col: 0, value: newValue });
        hasMerge = true;
        i += 2;
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

        tile.row = row;
        tile.col = col;

        if (oldRow !== row || oldCol !== col) {
          result.moved = true;
        }

        this.board.setTile(row, col, tile);
      } else {
        this.board.setTile(row, col, null);
      }
    }

    // Any merge counts as a move
    if (hasMerge) result.moved = true;

    return result;
  }

  canMove() {
    const directions = ['up', 'down', 'left', 'right'];
    for (const dir of directions) {
      const tempBoard = this.board.clone();
      const tempEngine = new MergeEngine(tempBoard);
      const result = tempEngine.move(dir);
      if (result.moved) return true;
    }
    return false;
  }
}

// ==================== GoalEvaluator Module ====================
class GoalEvaluator {
  constructor(goal) {
    this.goal = goal;
    this.clearedTiles = 0;
    this.score = 0;
    this.maxCombo = 0;
  }

  updateProgress(score, merges) {
    this.score += score;
    this.clearedTiles += merges.length;
    if (merges.length > this.maxCombo) {
      this.maxCombo = merges.length;
    }
  }

  isGoalAchieved(board) {
    switch (this.goal.type) {
      case 'merge_to_value':
        return this.hasReachedValue(board, this.goal.target);
      case 'clear_count':
        return this.clearedTiles >= this.goal.target;
      case 'score_target':
        return this.score >= this.goal.target;
      case 'combo_target':
        return this.maxCombo >= this.goal.target;
      default:
        return false;
    }
  }

  getProgress(board) {
    let current = 0;
    switch (this.goal.type) {
      case 'merge_to_value':
        current = this.getMaxValue(board);
        break;
      case 'clear_count':
        current = this.clearedTiles;
        break;
      case 'score_target':
        current = this.score;
        break;
      case 'combo_target':
        current = this.maxCombo;
        break;
    }
    return { current, target: this.goal.target, completed: current >= this.goal.target };
  }

  hasReachedValue(board, targetValue) {
    for (let row = 0; row < board.size; row++) {
      for (let col = 0; col < board.size; col++) {
        const tile = board.getTile(row, col);
        if (tile && tile.value >= targetValue) return true;
      }
    }
    return false;
  }

  getMaxValue(board) {
    let max = 0;
    for (let row = 0; row < board.size; row++) {
      for (let col = 0; col < board.size; col++) {
        const tile = board.getTile(row, col);
        if (tile && tile.value > max) max = tile.value;
      }
    }
    return max;
  }

  reset() {
    this.clearedTiles = 0;
    this.score = 0;
    this.maxCombo = 0;
  }
}

// ==================== Game Module ====================
class Game {
  constructor(level) {
    this.level = level;
    this.board = new Board(level.boardSize);
    this.mergeEngine = new MergeEngine(this.board);
    this.goalEvaluator = new GoalEvaluator(level.goal);
    this.score = 0;
    this.moves = 0;
    this.status = 'idle';
    this.moveHistory = [];
  }

  init() {
    this.board.reset();
    this.goalEvaluator.reset();
    this.score = 0;
    this.moves = 0;
    this.status = 'playing';
    this.moveHistory = [];

    for (let i = 0; i < this.level.initialTiles; i++) {
      this.board.addRandomTile();
    }
  }

  move(direction) {
    if (this.status !== 'playing') return null;

    this.saveState();
    const result = this.mergeEngine.move(direction);

    if (result.moved) {
      this.score += result.score;
      this.moves++;
      this.goalEvaluator.updateProgress(result.score, result.merges);
      this.board.addRandomTile();

      if (this.goalEvaluator.isGoalAchieved(this.board)) {
        this.status = 'won';
      } else if (this.moves >= this.level.maxMoves) {
        this.status = 'lost';
      } else if (this.board.isGameOver()) {
        this.status = 'lost';
      }
    }

    return result;
  }

  undo() {
    if (this.moveHistory.length === 0) return false;

    const previousState = this.moveHistory.pop();
    this.board = previousState.board;
    this.score = previousState.score;
    this.moves = previousState.moves;
    this.mergeEngine = new MergeEngine(this.board);
    this.goalEvaluator.reset();
    this.status = 'playing';
    return true;
  }

  saveState() {
    this.moveHistory.push({
      board: this.board.clone(),
      score: this.score,
      moves: this.moves
    });
    if (this.moveHistory.length > 10) {
      this.moveHistory.shift();
    }
  }

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

  canUndo() {
    return this.moveHistory.length > 0;
  }

  restart() {
    this.init();
  }

  getBoard() { return this.board; }
  getScore() { return this.score; }
  getMovesRemaining() { return this.level.maxMoves - this.moves; }
  getStatus() { return this.status; }
  getLevel() { return this.level; }
}

// ==================== Level Configurations ====================
const LEVELS = [
  { id: 1, boardSize: 4, goal: { type: 'merge_to_value', target: 16, description: '合成数字 16' }, maxMoves: 30, initialTiles: 2, description: '基础教学：学习滑动合成' },
  { id: 2, boardSize: 4, goal: { type: 'merge_to_value', target: 32, description: '合成数字 32' }, maxMoves: 25, initialTiles: 2, description: '继续练习合成' },
  { id: 3, boardSize: 4, goal: { type: 'score_target', target: 100, description: '达到 100 分' }, maxMoves: 20, initialTiles: 2, description: '学习分数系统' },
  { id: 4, boardSize: 4, goal: { type: 'clear_count', target: 5, description: '消除 5 个方块' }, maxMoves: 25, initialTiles: 3, description: '学习消除机制' },
  { id: 5, boardSize: 4, goal: { type: 'merge_to_value', target: 64, description: '合成数字 64' }, maxMoves: 30, initialTiles: 2, description: '教学完成，进入挑战' },
  { id: 6, boardSize: 4, goal: { type: 'score_target', target: 500, description: '达到 500 分' }, maxMoves: 25, initialTiles: 3, description: '分数挑战' },
  { id: 7, boardSize: 4, goal: { type: 'clear_count', target: 10, description: '消除 10 个方块' }, maxMoves: 30, initialTiles: 3, description: '消除挑战' },
  { id: 8, boardSize: 4, goal: { type: 'merge_to_value', target: 128, description: '合成数字 128' }, maxMoves: 35, initialTiles: 3, description: '高数字挑战' },
  { id: 9, boardSize: 4, goal: { type: 'combo_target', target: 3, description: '达成 3 连击' }, maxMoves: 30, initialTiles: 3, description: '连击挑战' },
  { id: 10, boardSize: 4, goal: { type: 'score_target', target: 1000, description: '达到 1000 分' }, maxMoves: 30, initialTiles: 3, description: '首次失败关卡' },
  { id: 11, boardSize: 5, goal: { type: 'merge_to_value', target: 256, description: '合成数字 256' }, maxMoves: 40, initialTiles: 3, description: '5x5 棋盘挑战' },
  { id: 12, boardSize: 5, goal: { type: 'clear_count', target: 20, description: '消除 20 个方块' }, maxMoves: 35, initialTiles: 4, description: '大规模消除' },
  { id: 13, boardSize: 5, goal: { type: 'score_target', target: 2000, description: '达到 2000 分' }, maxMoves: 35, initialTiles: 4, description: '高分挑战' },
  { id: 14, boardSize: 5, goal: { type: 'combo_target', target: 5, description: '达成 5 连击' }, maxMoves: 40, initialTiles: 4, description: '连击大师' },
  { id: 15, boardSize: 5, goal: { type: 'merge_to_value', target: 512, description: '合成数字 512' }, maxMoves: 45, initialTiles: 4, description: '数字合成大师' },
  { id: 16, boardSize: 5, goal: { type: 'score_target', target: 5000, description: '达到 5000 分' }, maxMoves: 40, initialTiles: 5, description: '极限分数' },
  { id: 17, boardSize: 5, goal: { type: 'clear_count', target: 30, description: '消除 30 个方块' }, maxMoves: 45, initialTiles: 5, description: '消除风暴' },
  { id: 18, boardSize: 5, goal: { type: 'merge_to_value', target: 1024, description: '合成数字 1024' }, maxMoves: 50, initialTiles: 5, description: '数字极限' },
  { id: 19, boardSize: 5, goal: { type: 'combo_target', target: 8, description: '达成 8 连击' }, maxMoves: 45, initialTiles: 5, description: '连击传说' },
  { id: 20, boardSize: 5, goal: { type: 'score_target', target: 10000, description: '达到 10000 分' }, maxMoves: 50, initialTiles: 5, description: '最终挑战' }
];

function getLevelById(id) {
  return LEVELS.find(level => level.id === id);
}

// ==================== SaveManager Module ====================
const SAVE_KEY = 'multica_number_merge_save';

const SaveManager = {
  load() {
    try {
      if (typeof wx !== 'undefined') {
        const data = wx.getStorageSync(SAVE_KEY);
        if (data) return JSON.parse(data);
      } else if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(SAVE_KEY);
        if (data) return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load save data:', e);
    }
    return this.getDefaultSave();
  },

  save(data) {
    try {
      const json = JSON.stringify(data);
      if (typeof wx !== 'undefined') {
        wx.setStorageSync(SAVE_KEY, json);
        return true;
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SAVE_KEY, json);
        return true;
      }
    } catch (e) {
      console.error('Failed to save data:', e);
    }
    return false;
  },

  completeLevel(levelId, score) {
    const save = this.load();
    if (!save.completedLevels.includes(levelId)) {
      save.completedLevels.push(levelId);
    }
    if (!save.highScores[levelId] || score > save.highScores[levelId]) {
      save.highScores[levelId] = score;
    }
    if (levelId >= save.currentLevel) {
      save.currentLevel = levelId + 1;
    }
    save.totalScore += score;
    save.lastPlayed = Date.now();
    this.save(save);
    return save;
  },

  getHighScore(levelId) {
    const save = this.load();
    return save.highScores[levelId] || 0;
  },

  isLevelUnlocked(levelId) {
    const save = this.load();
    return levelId <= save.currentLevel;
  },

  reset() {
    this.save(this.getDefaultSave());
  },

  getDefaultSave() {
    return {
      currentLevel: 1,
      completedLevels: [],
      highScores: {},
      totalScore: 0,
      lastPlayed: Date.now()
    };
  }
};

// ==================== roundRect Polyfill ====================
function drawRoundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

// ==================== Renderer Module ====================
const TILE_COLORS = {
  2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f67c5f',
  32: '#f65e3b', 64: '#edcf72', 128: '#edcc61', 256: '#edc850',
  512: '#edc53f', 1024: '#edc22e', 2048: '#3c3a32'
};

const TEXT_COLORS = {
  2: '#776e65', 4: '#776e65', 8: '#f9f6f2', 16: '#f9f6f2',
  32: '#f9f6f2', 64: '#f9f6f2', 128: '#f9f6f2', 256: '#f9f6f2',
  512: '#f9f6f2', 1024: '#f9f6f2', 2048: '#f9f6f2'
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

  calculateLayout(boardSize) {
    const maxBoardWidth = this.width - this.padding * 2;
    const maxBoardHeight = this.height * 0.6;

    this.tileSize = Math.min(
      (maxBoardWidth - this.padding * (boardSize + 1)) / boardSize,
      (maxBoardHeight - this.padding * (boardSize + 1)) / boardSize
    );

    const boardWidth = this.tileSize * boardSize + this.padding * (boardSize + 1);
    this.boardOffsetX = (this.width - boardWidth) / 2;
    this.boardOffsetY = this.height * 0.2;
  }

  render(state) {
    this.calculateLayout(state.board.size);

    this.ctx.fillStyle = '#faf8ef';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.drawHeader(state);
    this.drawBoardBackground(state.board.size);
    this.drawTiles(state.board);
    this.drawGoalProgress(state);
    this.drawMovesRemaining(state);

    if (state.status === 'won' || state.status === 'lost') {
      this.drawGameOverOverlay(state);
    }
  }

  drawHeader(state) {
    this.ctx.fillStyle = '#776e65';
    this.ctx.font = 'bold 36px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Multica Number Merge', this.width / 2, 50);

    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillText('分数: ' + state.score, this.width / 2, 90);

    this.ctx.font = '18px Arial';
    this.ctx.fillText('关卡 ' + state.level.id + ': ' + state.level.description, this.width / 2, 120);
  }

  drawBoardBackground(boardSize) {
    const boardWidth = this.tileSize * boardSize + this.padding * (boardSize + 1);
    const boardHeight = this.tileSize * boardSize + this.padding * (boardSize + 1);

    this.ctx.fillStyle = '#bbada0';
    drawRoundRect(this.ctx, this.boardOffsetX, this.boardOffsetY, boardWidth, boardHeight, 8);
    this.ctx.fill();

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const x = this.boardOffsetX + this.padding + col * (this.tileSize + this.padding);
        const y = this.boardOffsetY + this.padding + row * (this.tileSize + this.padding);

        this.ctx.fillStyle = 'rgba(238, 228, 218, 0.35)';
        drawRoundRect(this.ctx, x, y, this.tileSize, this.tileSize, 6);
        this.ctx.fill();
      }
    }
  }

  drawTiles(board) {
    for (let row = 0; row < board.size; row++) {
      for (let col = 0; col < board.size; col++) {
        const tile = board.getTile(row, col);
        if (tile) this.drawTile(tile, row, col);
      }
    }
  }

  drawTile(tile, row, col) {
    const x = this.boardOffsetX + this.padding + col * (this.tileSize + this.padding);
    const y = this.boardOffsetY + this.padding + row * (this.tileSize + this.padding);

    const bgColor = TILE_COLORS[tile.value] || '#3c3a32';
    this.ctx.fillStyle = bgColor;
    drawRoundRect(this.ctx, x, y, this.tileSize, this.tileSize, 6);
    this.ctx.fill();

    const textColor = TEXT_COLORS[tile.value] || '#f9f6f2';
    this.ctx.fillStyle = textColor;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    let fontSize = this.tileSize * 0.4;
    if (tile.value >= 1000) fontSize = this.tileSize * 0.3;
    if (tile.value >= 10000) fontSize = this.tileSize * 0.25;

    this.ctx.font = 'bold ' + fontSize + 'px Arial';
    this.ctx.fillText(tile.value.toString(), x + this.tileSize / 2, y + this.tileSize / 2);
  }

  drawGoalProgress(state) {
    const y = this.boardOffsetY + this.tileSize * state.board.size + this.padding * (state.board.size + 1) + 30;

    this.ctx.fillStyle = '#776e65';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('目标: ' + state.level.goal.description, this.width / 2, y);

    const progress = state.goalProgress;
    const barWidth = 200;
    const barHeight = 20;
    const barX = (this.width - barWidth) / 2;
    const barY = y + 15;

    this.ctx.fillStyle = '#eee4da';
    drawRoundRect(this.ctx, barX, barY, barWidth, barHeight, 10);
    this.ctx.fill();

    const fillWidth = Math.min(barWidth, (progress.current / progress.target) * barWidth);
    this.ctx.fillStyle = progress.completed ? '#8f7a66' : '#bbada0';
    drawRoundRect(this.ctx, barX, barY, fillWidth, barHeight, 10);
    this.ctx.fill();

    this.ctx.fillStyle = '#776e65';
    this.ctx.font = '14px Arial';
    this.ctx.fillText(progress.current + ' / ' + progress.target, this.width / 2, barY + barHeight / 2);
  }

  drawMovesRemaining(state) {
    const y = this.boardOffsetY + this.tileSize * state.board.size + this.padding * (state.board.size + 1) + 100;

    this.ctx.fillStyle = '#776e65';
    this.ctx.font = '18px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('剩余步数: ' + (state.maxMoves - state.moves), this.width / 2, y);
  }

  drawGameOverOverlay(state) {
    this.ctx.fillStyle = 'rgba(238, 228, 218, 0.73)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#776e65';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const message = state.status === 'won' ? '恭喜过关！' : '游戏结束';
    this.ctx.fillText(message, this.width / 2, this.height / 2 - 50);

    this.ctx.font = '24px Arial';
    this.ctx.fillText('最终分数: ' + state.score, this.width / 2, this.height / 2 + 10);

    this.drawButton('重新开始', this.width / 2, this.height / 2 + 80, 150, 50);
    if (state.status === 'won') {
      this.drawButton('下一关', this.width / 2, this.height / 2 + 150, 150, 50);
    }
  }

  drawButton(text, x, y, width, height) {
    this.ctx.fillStyle = '#8f7a66';
    drawRoundRect(this.ctx, x - width / 2, y - height / 2, width, height, 6);
    this.ctx.fill();

    this.ctx.fillStyle = '#f9f6f2';
    this.ctx.font = 'bold 18px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }
}

// ==================== InputHandler Module ====================
class InputHandler {
  constructor(canvas) {
    this.canvas = canvas;
    this.swipeCallback = null;
    this.tapCallback = null;
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.minSwipeDistance = 30;
    this.maxSwipeTime = 300;
    this.setupEventListeners();
  }

  onSwipe(callback) { this.swipeCallback = callback; }
  onTap(callback) { this.tapCallback = callback; }

  setupEventListeners() {
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
  }

  onTouchMove(e) { e.preventDefault(); }

  onTouchEnd(e) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    this.processSwipe(touch.clientX, touch.clientY);
  }

  onMouseDown(e) {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startTime = Date.now();
  }

  onMouseUp(e) {
    this.processSwipe(e.clientX, e.clientY);
  }

  processSwipe(endX, endY) {
    const dx = endX - this.startX;
    const dy = endY - this.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const duration = Date.now() - this.startTime;

    if (distance < this.minSwipeDistance && duration < 200) {
      if (this.tapCallback) {
        const rect = this.canvas.getBoundingClientRect();
        this.tapCallback(endX - rect.left, endY - rect.top);
      }
      return;
    }

    if (distance >= this.minSwipeDistance && duration <= this.maxSwipeTime) {
      const direction = this.getSwipeDirection(dx, dy);
      if (this.swipeCallback) this.swipeCallback(direction);
    }
  }

  getSwipeDirection(dx, dy) {
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (absDx > absDy) return dx > 0 ? 'right' : 'left';
    return dy > 0 ? 'down' : 'up';
  }

  destroy() {
    this.canvas.removeEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.removeEventListener('touchmove', this.onTouchMove.bind(this));
    this.canvas.removeEventListener('touchend', this.onTouchEnd.bind(this));
    this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }
}

// ==================== Game Controller ====================
let game = null;
let renderer = null;
let inputHandler = null;
let currentLevelId = 1;
let canvas = null;
let ctx = null;
let width = 0;
let height = 0;

function initGame(levelId) {
  const level = getLevelById(levelId);
  if (!level) {
    console.error('Level not found:', levelId);
    return;
  }

  currentLevelId = levelId;
  game = new Game(level);
  game.init();

  renderer = new Renderer(ctx, width, height);

  if (inputHandler) inputHandler.destroy();
  inputHandler = new InputHandler(canvas);
  inputHandler.onSwipe(handleSwipe);
  inputHandler.onTap(handleTap);

  gameLoop();
}

function handleSwipe(direction) {
  if (!game || game.getStatus() !== 'playing') return;
  const result = game.move(direction);
  if (result && result.moved && typeof wx !== 'undefined') {
    wx.vibrateShort({ type: 'light' });
  }
}

function handleTap(x, y) {
  if (!game) return;
  const state = game.getState();

  if (state.status === 'won' || state.status === 'lost') {
    if (isPointInRect(x, y, width / 2 - 75, height / 2 + 55, 150, 50)) {
      restartGame();
      return;
    }
    if (state.status === 'won' && isPointInRect(x, y, width / 2 - 75, height / 2 + 125, 150, 50)) {
      nextLevel();
      return;
    }
  }
}

function isPointInRect(x, y, rectX, rectY, rectWidth, rectHeight) {
  return x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight;
}

function restartGame() {
  initGame(currentLevelId);
}

function nextLevel() {
  const nextId = currentLevelId + 1;
  if (nextId <= LEVELS.length) {
    initGame(nextId);
  } else {
    if (typeof wx !== 'undefined') {
      wx.showToast({ title: '恭喜通关！', icon: 'success' });
    }
  }
}

let lastSaveTime = 0;

function gameLoop() {
  if (!game || !renderer) return;

  const state = game.getState();
  renderer.render(state);

  // Save progress on win (throttled)
  if (state.status === 'won') {
    const now = Date.now();
    if (now - lastSaveTime > 1000) {
      SaveManager.completeLevel(currentLevelId, state.score);
      lastSaveTime = now;
    }
  }

  requestAnimationFrame(gameLoop);
}

function start() {
  // Canvas setup
  canvas = wx.createCanvas();
  ctx = canvas.getContext('2d');
  width = canvas.width;
  height = canvas.height;

  // Load save data
  const save = SaveManager.load();
  currentLevelId = save.currentLevel;

  // Start game
  initGame(currentLevelId);
}

// Start game
start();
