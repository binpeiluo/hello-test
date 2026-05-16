/**
 * Tests for Game module
 */

import { Game, LevelConfig } from '../../src/core/game';

function makeLevel(overrides: Partial<LevelConfig> = {}): LevelConfig {
  return {
    id: 1,
    boardSize: 4,
    goal: { type: 'merge_to_value', target: 16, description: '合成数字 16' },
    maxMoves: 30,
    initialTiles: 2,
    description: 'Test level',
    ...overrides
  };
}

describe('Game', () => {
  describe('initialization', () => {
    it('should start in idle state', () => {
      const game = new Game(makeLevel());
      expect(game.getStatus()).toBe('idle');
    });

    it('should start in playing state after init', () => {
      const game = new Game(makeLevel());
      game.init();
      expect(game.getStatus()).toBe('playing');
    });

    it('should place initial tiles on init', () => {
      const game = new Game(makeLevel({ initialTiles: 3 }));
      game.init();
      const tiles = game.getBoard().getTiles();
      expect(tiles.length).toBe(3);
    });

    it('should reset score and moves on init', () => {
      const game = new Game(makeLevel());
      game.init();
      expect(game.getScore()).toBe(0);
      expect(game.getMovesRemaining()).toBe(30);
    });
  });

  describe('move', () => {
    it('should return null when not playing', () => {
      const game = new Game(makeLevel());
      expect(game.move('left')).toBeNull();
    });

    it('should increment moves on successful move', () => {
      const game = new Game(makeLevel({ initialTiles: 0 }));
      game.init();

      // Place a tile that can move
      game.getBoard().setTile(0, 3, { value: 2, row: 0, col: 3, id: 'tile1' });
      const result = game.move('left');

      expect(result).not.toBeNull();
      expect(result!.moved).toBe(true);
      expect(game.getMovesRemaining()).toBe(29);
    });

    it('should not increment moves on no-op move', () => {
      const game = new Game(makeLevel({ initialTiles: 0 }));
      game.init();

      // Place a tile at the edge (can't move left)
      game.getBoard().setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      const result = game.move('left');

      expect(result!.moved).toBe(false);
      expect(game.getMovesRemaining()).toBe(30);
    });

    it('should add a random tile after a successful move', () => {
      const game = new Game(makeLevel({ initialTiles: 0 }));
      game.init();

      game.getBoard().setTile(0, 3, { value: 2, row: 0, col: 3, id: 'tile1' });
      game.move('left');

      // Should have 2 tiles: the moved one and the new random one
      const tiles = game.getBoard().getTiles();
      expect(tiles.length).toBe(2);
    });

    it('should update score on merge', () => {
      const game = new Game(makeLevel({ initialTiles: 0 }));
      game.init();

      game.getBoard().setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      game.getBoard().setTile(0, 1, { value: 2, row: 0, col: 1, id: 'tile2' });
      game.move('left');

      expect(game.getScore()).toBeGreaterThan(0);
    });
  });

  describe('win condition', () => {
    it('should win when goal is achieved', () => {
      const game = new Game(makeLevel({
        goal: { type: 'merge_to_value', target: 4, description: '合成数字 4' },
        initialTiles: 0
      }));
      game.init();

      // Set up tiles that will merge to 4
      game.getBoard().setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      game.getBoard().setTile(0, 1, { value: 2, row: 0, col: 1, id: 'tile2' });
      game.move('left');

      expect(game.getStatus()).toBe('won');
    });
  });

  describe('lose condition', () => {
    it('should lose when max moves exceeded', () => {
      const game = new Game(makeLevel({
        goal: { type: 'merge_to_value', target: 2048, description: '合成数字 2048' },
        maxMoves: 2,
        initialTiles: 0
      }));
      game.init();

      // Make two moves
      game.getBoard().setTile(0, 3, { value: 2, row: 0, col: 3, id: 'tile1' });
      game.move('left');
      game.getBoard().setTile(1, 3, { value: 2, row: 1, col: 3, id: 'tile2' });
      game.move('left');

      expect(game.getStatus()).toBe('lost');
    });
  });

  describe('undo', () => {
    it('should return false when no history', () => {
      const game = new Game(makeLevel());
      game.init();
      expect(game.undo()).toBe(false);
    });

    it('should restore previous state on undo', () => {
      const game = new Game(makeLevel({ initialTiles: 0 }));
      game.init();

      game.getBoard().setTile(0, 3, { value: 2, row: 0, col: 3, id: 'tile1' });
      const scoreBefore = game.getScore();
      game.move('left');

      expect(game.undo()).toBe(true);
      expect(game.getScore()).toBe(scoreBefore);
      expect(game.canUndo()).toBe(false);
    });
  });

  describe('restart', () => {
    it('should reset the game to playing state', () => {
      const game = new Game(makeLevel({ maxMoves: 2, initialTiles: 0 }));
      game.init();

      game.getBoard().setTile(0, 3, { value: 2, row: 0, col: 3, id: 'tile1' });
      game.move('left');
      game.getBoard().setTile(1, 3, { value: 2, row: 1, col: 3, id: 'tile2' });
      game.move('left');

      expect(game.getStatus()).toBe('lost');

      game.restart();
      expect(game.getStatus()).toBe('playing');
      expect(game.getScore()).toBe(0);
    });
  });

  describe('getState', () => {
    it('should return complete game state', () => {
      const level = makeLevel();
      const game = new Game(level);
      game.init();

      const state = game.getState();
      expect(state.board).toBe(game.getBoard());
      expect(state.score).toBe(0);
      expect(state.moves).toBe(0);
      expect(state.maxMoves).toBe(30);
      expect(state.status).toBe('playing');
      expect(state.level).toBe(level);
      expect(state.goalProgress).toBeDefined();
    });
  });

  describe('different goal types', () => {
    it('should handle score_target goal', () => {
      const game = new Game(makeLevel({
        goal: { type: 'score_target', target: 10, description: '达到 10 分' },
        initialTiles: 0
      }));
      game.init();

      game.getBoard().setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      game.getBoard().setTile(0, 1, { value: 2, row: 0, col: 1, id: 'tile2' });
      game.getBoard().setTile(0, 2, { value: 4, row: 0, col: 2, id: 'tile3' });
      game.getBoard().setTile(0, 3, { value: 4, row: 0, col: 3, id: 'tile4' });
      game.move('left');

      // Score should be 4 + 8 = 12, which is >= 10
      expect(game.getScore()).toBeGreaterThanOrEqual(10);
      expect(game.getStatus()).toBe('won');
    });

    it('should handle combo_target goal', () => {
      const game = new Game(makeLevel({
        goal: { type: 'combo_target', target: 2, description: '达成 2 连击' },
        initialTiles: 0
      }));
      game.init();

      // Set up two pairs that will merge in one move
      game.getBoard().setTile(0, 0, { value: 2, row: 0, col: 0, id: 'tile1' });
      game.getBoard().setTile(0, 1, { value: 2, row: 0, col: 1, id: 'tile2' });
      game.getBoard().setTile(1, 0, { value: 4, row: 1, col: 0, id: 'tile3' });
      game.getBoard().setTile(1, 1, { value: 4, row: 1, col: 1, id: 'tile4' });
      game.move('left');

      expect(game.getStatus()).toBe('won');
    });
  });
});
