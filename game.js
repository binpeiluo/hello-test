/**
 * Main entry point for Multica Number Merge
 * WeChat Mini Game
 */

// Import core modules
const { Game } = require('./src/core/game');
const { Renderer } = require('./src/ui/renderer');
const { InputHandler } = require('./src/ui/input');
const { SaveManager } = require('./src/data/save');
const { LEVELS, getLevelById } = require('./src/data/levels');
const { WeChatAdapter } = require('./src/platform/wechat');

// Game state
let game = null;
let renderer = null;
let inputHandler = null;
let currentLevelId = 1;

// Canvas setup
const canvas = wx.createCanvas();
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Initialize the game
function initGame(levelId) {
  const level = getLevelById(levelId);
  if (!level) {
    console.error('Level not found:', levelId);
    return;
  }

  currentLevelId = levelId;
  game = new Game(level);
  game.init();

  // Set up renderer
  renderer = new Renderer(ctx, width, height);

  // Set up input handler
  if (inputHandler) {
    inputHandler.destroy();
  }
  inputHandler = new InputHandler(canvas);
  inputHandler.onSwipe(handleSwipe);
  inputHandler.onTap(handleTap);

  // Start game loop
  gameLoop();
}

// Handle swipe input
function handleSwipe(direction) {
  if (!game || game.getStatus() !== 'playing') return;

  const result = game.move(direction);
  if (result && result.moved) {
    // Vibrate on move
    WeChatAdapter.getInstance().vibrate('light');
  }
}

// Handle tap input
function handleTap(x, y) {
  if (!game) return;

  const state = game.getState();

  // Check if game is over
  if (state.status === 'won' || state.status === 'lost') {
    // Check for restart button
    if (isPointInRect(x, y, width / 2 - 75, height / 2 + 55, 150, 50)) {
      restartGame();
      return;
    }

    // Check for next level button (only on win)
    if (state.status === 'won') {
      if (isPointInRect(x, y, width / 2 - 75, height / 2 + 125, 150, 50)) {
        nextLevel();
        return;
      }
    }
  }
}

// Check if point is in rectangle
function isPointInRect(x, y, rectX, rectY, rectWidth, rectHeight) {
  return x >= rectX && x <= rectX + rectWidth &&
         y >= rectY && y <= rectY + rectHeight;
}

// Restart current game
function restartGame() {
  initGame(currentLevelId);
}

// Go to next level
function nextLevel() {
  const nextLevelId = currentLevelId + 1;
  if (nextLevelId <= LEVELS.length) {
    initGame(nextLevelId);
  } else {
    // All levels completed
    wx.showToast({
      title: '恭喜通关！',
      icon: 'success'
    });
  }
}

// Game loop
function gameLoop() {
  if (!game || !renderer) return;

  const state = game.getState();
  renderer.render(state);

  // Save progress on win
  if (state.status === 'won') {
    SaveManager.completeLevel(currentLevelId, state.score);
  }

  // Continue game loop
  requestAnimationFrame(gameLoop);
}

// Start the game
function start() {
  // Initialize WeChat adapter
  WeChatAdapter.getInstance().init();

  // Load save data
  const save = SaveManager.load();
  currentLevelId = save.currentLevel;

  // Start with first level or current level
  initGame(currentLevelId);
}

// Export for WeChat
module.exports = {
  start
};
