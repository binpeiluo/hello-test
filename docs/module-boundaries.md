# Multica Number Merge - Module Boundaries

## 模块架构概述

### 设计原则

1. **单一职责：** 每个模块只负责一个功能
2. **低耦合：** 模块之间通过接口通信
3. **高内聚：** 模块内部元素紧密相关
4. **可测试：** 模块可以独立测试

### 模块分类

1. **核心模块：** 纯逻辑模块，无外部依赖
2. **UI 模块：** 渲染和交互模块
3. **数据模块：** 数据管理模块
4. **平台模块：** 平台适配模块

## 核心模块

### 1. Board (棋盘模型)

**职责：** 管理棋盘状态和方块操作

**接口：**
```typescript
interface Board {
  size: number;
  cells: (Tile | null)[][];
  
  emptyCells(): Position[];
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
```

**依赖：** 无

**测试：** 单元测试

### 2. MergeEngine (合成引擎)

**职责：** 处理方块移动和合成逻辑

**接口：**
```typescript
interface MergeEngine {
  move(direction: Direction): MoveResult;
  canMove(): boolean;
}

interface MoveResult {
  moved: boolean;
  score: number;
  merges: Array<{ row: number; col: number; value: number }>;
}

type Direction = 'up' | 'down' | 'left' | 'right';
```

**依赖：** Board

**测试：** 单元测试

### 3. GoalEvaluator (目标评估器)

**职责：** 评估关卡目标完成情况

**接口：**
```typescript
interface GoalEvaluator {
  updateProgress(score: number, merges: Array<{ row: number; col: number; value: number }>): void;
  isGoalAchieved(board: Board): boolean;
  getProgress(board: Board): GoalProgress;
  reset(): void;
  getStats(): Stats;
}

interface GoalProgress {
  current: number;
  target: number;
  completed: boolean;
}

type GoalType = 'merge_to_value' | 'clear_count' | 'score_target' | 'combo_target';
```

**依赖：** Board

**测试：** 单元测试

### 4. Game (游戏状态管理)

**职责：** 管理游戏整体状态和流程

**接口：**
```typescript
interface Game {
  init(): void;
  move(direction: Direction): MoveResult | null;
  undo(): boolean;
  restart(): void;
  getState(): GameState;
  canUndo(): boolean;
  getBoard(): Board;
  getScore(): number;
  getMovesRemaining(): number;
  getStatus(): GameStatus;
  getLevel(): LevelConfig;
}

interface GameState {
  board: Board;
  score: number;
  moves: number;
  maxMoves: number;
  status: GameStatus;
  goalProgress: GoalProgress;
  level: LevelConfig;
}

type GameStatus = 'idle' | 'playing' | 'won' | 'lost';
```

**依赖：** Board, MergeEngine, GoalEvaluator

**测试：** 集成测试

## UI 模块

### 5. Renderer (渲染器)

**职责：** 绘制游戏界面

**接口：**
```typescript
interface Renderer {
  render(state: GameState): void;
}
```

**依赖：** Canvas 2D Context, GameState

**测试：** 视觉测试

### 6. InputHandler (输入处理)

**职责：** 处理触摸和鼠标输入

**接口：**
```typescript
interface InputHandler {
  onSwipe(callback: (direction: Direction) => void): void;
  onTap(callback: (x: number, y: number) => void): void;
  destroy(): void;
}
```

**依赖：** Canvas Element

**测试：** 交互测试

## 数据模块

### 7. LevelManager (关卡管理)

**职责：** 管理关卡配置和进度

**接口：**
```typescript
interface LevelManager {
  getLevel(id: number): LevelConfig;
  getTotalLevels(): number;
  isLevelUnlocked(id: number): boolean;
  completeLevel(id: number, score: number): void;
  getHighScore(id: number): number;
}
```

**依赖：** SaveManager

**测试：** 单元测试

### 8. SaveManager (存档管理)

**职责：** 管理游戏存档

**接口：**
```typescript
interface SaveManager {
  load(): SaveData;
  save(data: SaveData): boolean;
  completeLevel(levelId: number, score: number): SaveData;
  getHighScore(levelId: number): number;
  isLevelUnlocked(levelId: number): boolean;
  reset(): void;
}

interface SaveData {
  currentLevel: number;
  completedLevels: number[];
  highScores: { [levelId: number]: number };
  totalScore: number;
  lastPlayed: number;
}
```

**依赖：** 微信存储 API / localStorage

**测试：** 集成测试

## 平台模块

### 9. WeChatAdapter (微信适配器)

**职责：** 适配微信平台 API

**接口：**
```typescript
interface WeChatAdapter {
  init(): void;
  shareGame(title: string, imageUrl?: string): Promise<void>;
  showRewardedAd(): Promise<boolean>;
  getSystemInfo(): SystemInfo;
  vibrate(type: 'light' | 'medium' | 'heavy'): void;
}
```

**依赖：** 微信 API

**测试：** 平台测试

### 10. AnalyticsAdapter (数据埋点适配器)

**职责：** 适配数据埋点

**接口：**
```typescript
interface AnalyticsAdapter {
  trackEvent(event: string, properties?: object): void;
  trackPageView(page: string): void;
  trackError(error: Error): void;
}
```

**依赖：** 数据平台 API

**测试：** 集成测试

## 模块依赖关系

### 依赖图

```
Game
├── Board
├── MergeEngine
│   └── Board
└── GoalEvaluator
    └── Board

LevelManager
└── SaveManager

WeChatAdapter
└── 微信 API

AnalyticsAdapter
└── 数据平台 API

Renderer
└── Canvas 2D Context

InputHandler
└── Canvas Element
```

### 依赖规则

1. **核心模块不依赖 UI 模块**
2. **核心模块不依赖平台模块**
3. **UI 模块依赖核心模块**
4. **平台模块独立**
5. **数据模块独立**

## 模块接口规范

### 接口定义

1. **输入参数：** 明确类型和约束
2. **返回值：** 明确类型和可能值
3. **异常处理：** 明确异常类型和处理方式
4. **副作用：** 明确可能的副作用

### 接口示例

```typescript
// Board 接口
interface Board {
  // 获取指定位置的方块
  // 参数：row - 行号（0-3），col - 列号（0-3）
  // 返回：方块对象或 null（空位置）
  // 异常：无
  // 副作用：无
  getTile(row: number, col: number): Tile | null;
}
```

## 模块测试规范

### 测试类型

1. **单元测试：** 测试单个模块
2. **集成测试：** 测试模块交互
3. **端到端测试：** 测试完整流程

### 测试覆盖

1. **核心模块：** 100% 覆盖
2. **UI 模块：** 80% 覆盖
3. **数据模块：** 90% 覆盖
4. **平台模块：** 70% 覆盖

### 测试示例

```typescript
// Board 单元测试
describe('Board', () => {
  it('should create empty board', () => {
    const board = new Board(4);
    expect(board.emptyCells().length).toBe(16);
  });
  
  it('should add random tile', () => {
    const board = new Board(4);
    const tile = board.addRandomTile();
    expect(tile).not.toBeNull();
    expect(board.emptyCells().length).toBe(15);
  });
});
```

## 模块通信规范

### 通信方式

1. **直接调用：** 同步调用其他模块的方法
2. **事件机制：** 通过事件进行异步通信
3. **回调函数：** 通过回调函数进行异步通信

### 通信示例

```typescript
// 直接调用
const board = new Board(4);
const tile = board.getTile(0, 0);

// 事件机制
inputHandler.onSwipe((direction) => {
  game.move(direction);
});

// 回调函数
game.onStateChange((state) => {
  renderer.render(state);
});
```

## 模块扩展规范

### 扩展方式

1. **继承：** 通过继承扩展现有模块
2. **组合：** 通过组合扩展现有模块
3. **插件：** 通过插件机制扩展功能

### 扩展示例

```typescript
// 继承扩展
class CustomBoard extends Board {
  // 添加自定义方法
}

// 组合扩展
class GameWithBooster {
  private game: Game;
  private booster: Booster;
  
  // 组合游戏和道具功能
}

// 插件扩展
class GameWithPlugin {
  private game: Game;
  private plugins: Plugin[];
  
  // 通过插件扩展功能
}
```

## 模块版本管理

### 版本号

1. **主版本号：** 不兼容的 API 修改
2. **次版本号：** 向下兼容的功能性新增
3. **修订号：** 向下兼容的问题修正

### 版本示例

```
1.0.0 - 初始版本
1.1.0 - 添加新功能
1.1.1 - 修复 bug
2.0.0 - 不兼容的 API 修改
```

## 模块文档规范

### 文档内容

1. **模块描述：** 模块的职责和功能
2. **接口定义：** 模块的公共接口
3. **使用示例：** 模块的使用示例
4. **测试用例：** 模块的测试用例

### 文档示例

```markdown
# Board 模块

## 描述
管理棋盘状态和方块操作

## 接口
- `getTile(row, col)` - 获取指定位置的方块
- `setTile(row, col, tile)` - 设置指定位置的方块
- ...

## 使用示例
```typescript
const board = new Board(4);
const tile = board.getTile(0, 0);
```

## 测试用例
```typescript
it('should create empty board', () => {
  const board = new Board(4);
  expect(board.emptyCells().length).toBe(16);
});
```
```

## 总结

模块边界的设计核心是**单一职责、低耦合、高内聚、可测试**。通过明确的模块划分和接口规范，确保代码的可维护性、可测试性和可扩展性。

**关键成功因素：**
1. 模块职责单一
2. 接口定义清晰
3. 依赖关系明确
4. 测试覆盖完整
5. 文档规范完整
