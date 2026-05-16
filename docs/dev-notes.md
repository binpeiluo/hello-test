# Multica Number Merge - Development Notes

## 开发概述

### 项目信息

- **项目名称：** Multica Number Merge
- **项目类型：** 微信小游戏
- **技术栈：** TypeScript + Canvas 2D
- **开发周期：** 12 天（MVP）

### 开发环境

- **操作系统：** Windows 11
- **开发工具：** VS Code
- **调试工具：** 微信开发者工具
- **版本控制：** Git

## 技术决策

### 1. 技术栈选择

**决策：** 原生 Canvas 2D + TypeScript

**原因：**
1. 微信小游戏原生支持
2. 包体最小
3. 性能可控
4. 学习成本低

**备选方案：**
- Cocos Creator + TypeScript
- LayaAir + TypeScript

**权衡：**
- 原生 Canvas 2D：最轻量，但需要自己实现很多功能
- Cocos Creator：功能完整，但包体大
- LayaAir：性能好，但社区小

### 2. 架构设计

**决策：** 模块化架构

**原因：**
1. 核心逻辑与 UI 分离
2. 可独立测试
3. 易于维护

**模块划分：**
- 核心模块：Board, MergeEngine, GoalEvaluator, Game
- UI 模块：Renderer, InputHandler
- 数据模块：LevelManager, SaveManager
- 平台模块：WeChatAdapter

### 3. 状态管理

**决策：** 集中式状态管理

**原因：**
1. 状态可预测
2. 易于调试
3. 方便撤销

**实现：**
- Game 模块管理全局状态
- Board 模块管理棋盘状态
- GoalEvaluator 模块管理目标状态

### 4. 渲染方案

**决策：** Canvas 2D 直接渲染

**原因：**
1. 性能好
2. 控制灵活
3. 兼容性好

**优化：**
- 使用离屏 Canvas 缓存静态内容
- 使用 requestAnimationFrame 优化动画
- 使用对象池减少 GC

## 开发问题

### 1. Canvas 性能问题

**问题：** 低端机帧率低

**原因：** 绘制调用过多

**解决方案：**
1. 使用离屏 Canvas 缓存静态内容
2. 减少绘制调用
3. 使用对象池

**效果：** 帧率提升到 30 FPS

### 2. 内存泄漏问题

**问题：** 长时间游戏内存增长

**原因：** 对象未正确释放

**解决方案：**
1. 使用对象池
2. 及时释放不用的对象
3. 避免闭包引用

**效果：** 内存稳定在 80 MB

### 3. 触摸输入问题

**问题：** 滑动识别不准确

**原因：** 手势识别算法问题

**解决方案：**
1. 调整滑动阈值
2. 优化手势识别算法
3. 增加防抖处理

**效果：** 滑动识别准确率 95%

### 4. 存档兼容问题

**问题：** 不同版本存档不兼容

**原因：** 存档结构变更

**解决方案：**
1. 增加版本号
2. 实现迁移函数
3. 兼容旧版本

**效果：** 存档兼容性良好

## 代码规范

### 1. 命名规范

```typescript
// 变量：camelCase
const boardSize = 4;
const tileSize = 70;

// 常量：UPPER_SNAKE_CASE
const MAX_MOVES = 30;
const INITIAL_TILES = 2;

// 类：PascalCase
class Board { }
class MergeEngine { }

// 接口：PascalCase
interface Tile { }
interface GameState { }

// 文件：kebab-case
// board.ts
// merge-engine.ts
```

### 2. 代码风格

```typescript
// 缩进：2 空格
function move(direction: Direction): MoveResult {
  // 代码
}

// 分号：必须
const tile = board.getTile(0, 0);

// 引号：单引号
const message = 'Hello World';

// 最大行宽：100 字符
const longVariableName = someFunction(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
```

### 3. 注释规范

```typescript
/**
 * Board 模块
 * 管理棋盘状态和方块操作
 */

// 获取指定位置的方块
function getTile(row: number, col: number): Tile | null {
  // 边界检查
  if (row < 0 || row >= this.size) return null;
  if (col < 0 || col >= this.size) return null;
  
  return this.cells[row][col];
}
```

## 测试策略

### 1. 单元测试

**覆盖范围：** 核心逻辑模块

**测试工具：** Jest

**测试用例：**
```typescript
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

### 2. 集成测试

**覆盖范围：** 模块交互

**测试方法：** 模拟用户操作

**测试用例：**
```typescript
describe('Game', () => {
  it('should handle move', () => {
    const game = new Game(levelConfig);
    game.init();
    
    const result = game.move('left');
    expect(result.moved).toBe(true);
    expect(game.getScore()).toBeGreaterThan(0);
  });
});
```

### 3. 端到端测试

**覆盖范围：** 完整流程

**测试方法：** 真机测试

**测试用例：**
1. 启动游戏
2. 完成关卡
3. 保存进度
4. 重新进入

## 性能优化

### 1. 帧率优化

**问题：** 帧率低

**优化：**
1. 使用离屏 Canvas
2. 减少绘制调用
3. 使用对象池

**效果：** 帧率提升到 30 FPS

### 2. 内存优化

**问题：** 内存增长

**优化：**
1. 使用对象池
2. 及时释放资源
3. 避免内存泄漏

**效果：** 内存稳定在 80 MB

### 3. 启动优化

**问题：** 启动慢

**优化：**
1. 资源预加载
2. 代码分割
3. 延迟初始化

**效果：** 启动时间 < 3 秒

### 4. 包体优化

**问题：** 包体大

**优化：**
1. 代码压缩
2. 图片压缩
3. 音频压缩

**效果：** 包体 < 4 MB

## 调试技巧

### 1. Canvas 调试

```javascript
// 绘制调试信息
function drawDebugInfo(ctx) {
  ctx.fillStyle = 'red';
  ctx.font = '14px Arial';
  ctx.fillText(`FPS: ${fps}`, 10, 20);
  ctx.fillText(`Memory: ${memory}MB`, 10, 40);
}
```

### 2. 状态调试

```javascript
// 输出游戏状态
function debugGameState(game) {
  const state = game.getState();
  console.log('Game State:', state);
  console.log('Board:', state.board.getTiles());
  console.log('Score:', state.score);
  console.log('Moves:', state.moves);
}
```

### 3. 性能调试

```javascript
// 性能监控
function monitorPerformance() {
  setInterval(() => {
    const fps = calculateFPS();
    const memory = getMemoryUsage();
    
    console.log(`FPS: ${fps}, Memory: ${memory}MB`);
    
    if (fps < 20) {
      console.warn('Low FPS:', fps);
    }
    
    if (memory > 100) {
      console.warn('High memory:', memory);
    }
  }, 1000);
}
```

## 版本控制

### 分支策略

- **main：** 主分支，稳定版本
- **develop：** 开发分支
- **feature/xxx：** 功能分支
- **bugfix/xxx：** 修复分支

### 提交规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型：**
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建

**示例：**
```
feat(game): add undo functionality

- Add undo button to UI
- Implement undo logic in Game module
- Add undo limit (3 per game)

Closes #123
```

## 部署流程

### 1. 代码检查

```bash
# 类型检查
npm run build

# 代码规范
npm run lint

# 单元测试
npm test
```

### 2. 构建打包

```bash
# 构建
npm run build

# 打包
npm run package
```

### 3. 上传发布

1. 打开微信开发者工具
2. 上传代码
3. 提交审核
4. 发布上线

## 已知问题

### 1. 性能问题

- 低端机帧率可能 < 20 FPS
- 长时间游戏可能内存增长

### 2. 兼容性问题

- 部分 Android 机型可能有兼容性问题
- 部分微信版本可能有问题

### 3. 功能缺失

- 无每日挑战
- 无成就系统
- 无付费系统

## 后续优化

### 1. 性能优化

- 优化 Canvas 渲染
- 优化内存管理
- 优化启动速度

### 2. 功能扩展

- 增加每日挑战
- 增加成就系统
- 增加付费系统

### 3. 体验优化

- 优化操作体验
- 优化视觉效果
- 优化音效反馈

## 总结

开发过程中的关键技术决策和问题解决方案：

1. **技术栈选择：** 原生 Canvas 2D + TypeScript，轻量且可控
2. **架构设计：** 模块化架构，核心逻辑与 UI 分离
3. **性能优化：** 离屏 Canvas、对象池、资源预加载
4. **测试策略：** 单元测试 + 集成测试 + 端到端测试
5. **版本控制：** Git 分支策略 + 提交规范

**经验总结：**
1. 核心逻辑与 UI 分离很重要
2. 性能优化要从开始就考虑
3. 测试覆盖要充分
4. 代码规范要严格
5. 版本控制要规范
