/**
 * Level configurations for Multica Number Merge
 * 20 levels with progressive difficulty
 */

import { LevelConfig } from '../core/game';

export const LEVELS: LevelConfig[] = [
  // Tutorial levels (1-5)
  {
    id: 1,
    boardSize: 4,
    goal: { type: 'merge_to_value', target: 16, description: '合成数字 16' },
    maxMoves: 30,
    initialTiles: 2,
    description: '基础教学：学习滑动合成'
  },
  {
    id: 2,
    boardSize: 4,
    goal: { type: 'merge_to_value', target: 32, description: '合成数字 32' },
    maxMoves: 25,
    initialTiles: 2,
    description: '继续练习合成'
  },
  {
    id: 3,
    boardSize: 4,
    goal: { type: 'score_target', target: 100, description: '达到 100 分' },
    maxMoves: 20,
    initialTiles: 2,
    description: '学习分数系统'
  },
  {
    id: 4,
    boardSize: 4,
    goal: { type: 'clear_count', target: 5, description: '消除 5 个方块' },
    maxMoves: 25,
    initialTiles: 3,
    description: '学习消除机制'
  },
  {
    id: 5,
    boardSize: 4,
    goal: { type: 'merge_to_value', target: 64, description: '合成数字 64' },
    maxMoves: 30,
    initialTiles: 2,
    description: '教学完成，进入挑战'

  },

  // Light challenge levels (6-10)
  {
    id: 6,
    boardSize: 4,
    goal: { type: 'score_target', target: 500, description: '达到 500 分' },
    maxMoves: 25,
    initialTiles: 3,
    description: '分数挑战'
  },
  {
    id: 7,
    boardSize: 4,
    goal: { type: 'clear_count', target: 10, description: '消除 10 个方块' },
    maxMoves: 30,
    initialTiles: 3,
    description: '消除挑战'
  },
  {
    id: 8,
    boardSize: 4,
    goal: { type: 'merge_to_value', target: 128, description: '合成数字 128' },
    maxMoves: 35,
    initialTiles: 3,
    description: '高数字挑战'
  },
  {
    id: 9,
    boardSize: 4,
    goal: { type: 'combo_target', target: 3, description: '达成 3 连击' },
    maxMoves: 30,
    initialTiles: 3,
    description: '连击挑战'
  },
  {
    id: 10,
    boardSize: 4,
    goal: { type: 'score_target', target: 1000, description: '达到 1000 分' },
    maxMoves: 30,
    initialTiles: 3,
    description: '首次失败关卡'
  },

  // Medium challenge levels (11-15)
  {
    id: 11,
    boardSize: 5,
    goal: { type: 'merge_to_value', target: 256, description: '合成数字 256' },
    maxMoves: 40,
    initialTiles: 3,
    description: '5x5 棋盘挑战'
  },
  {
    id: 12,
    boardSize: 5,
    goal: { type: 'clear_count', target: 20, description: '消除 20 个方块' },
    maxMoves: 35,
    initialTiles: 4,
    description: '大规模消除'
  },
  {
    id: 13,
    boardSize: 5,
    goal: { type: 'score_target', target: 2000, description: '达到 2000 分' },
    maxMoves: 35,
    initialTiles: 4,
    description: '高分挑战'
  },
  {
    id: 14,
    boardSize: 5,
    goal: { type: 'combo_target', target: 5, description: '达成 5 连击' },
    maxMoves: 40,
    initialTiles: 4,
    description: '连击大师'
  },
  {
    id: 15,
    boardSize: 5,
    goal: { type: 'merge_to_value', target: 512, description: '合成数字 512' },
    maxMoves: 45,
    initialTiles: 4,
    description: '数字合成大师'
  },

  // Hard challenge levels (16-20)
  {
    id: 16,
    boardSize: 5,
    goal: { type: 'score_target', target: 5000, description: '达到 5000 分' },
    maxMoves: 40,
    initialTiles: 5,
    description: '极限分数'
  },
  {
    id: 17,
    boardSize: 5,
    goal: { type: 'clear_count', target: 30, description: '消除 30 个方块' },
    maxMoves: 45,
    initialTiles: 5,
    description: '消除风暴'
  },
  {
    id: 18,
    boardSize: 5,
    goal: { type: 'merge_to_value', target: 1024, description: '合成数字 1024' },
    maxMoves: 50,
    initialTiles: 5,
    description: '数字极限'
  },
  {
    id: 19,
    boardSize: 5,
    goal: { type: 'combo_target', target: 8, description: '达成 8 连击' },
    maxMoves: 45,
    initialTiles: 5,
    description: '连击传说'
  },
  {
    id: 20,
    boardSize: 5,
    goal: { type: 'score_target', target: 10000, description: '达到 10000 分' },
    maxMoves: 50,
    initialTiles: 5,
    description: '最终挑战'
  }
];

// Get level by ID
export function getLevelById(id: number): LevelConfig | undefined {
  return LEVELS.find(level => level.id === id);
}

// Get total number of levels
export function getTotalLevels(): number {
  return LEVELS.length;
}
