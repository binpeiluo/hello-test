# Multica Number Merge - Technical Architecture

## 技术栈选择

### 推荐方案：原生 Canvas 2D + TypeScript

**选择理由：**
1. **微信小游戏原生支持：** 无需额外引擎，直接使用微信 API
2. **包体最小：** MVP 阶段控制包体大小
3. **性能可控：** 直接操作 Canvas，性能优化灵活
4. **学习成本低：** 团队熟悉 TypeScript

### 备选方案

| 方案 | 优点 | 缺点 |
|------|------|------|
| Cocos Creator + TypeScript | 功能完整，生态丰富 | 包体大，学习成本高 |
| LayaAir + TypeScript | 性能好，轻量级 | 社区较小 |

## 模块架构

```
src/
├── core/                    # 纯逻辑模块（可单元测试）
│   ├── board.ts            # 棋盘模型
│   ├── merge.ts            # 合成引擎
│   ├── goal.ts             # 目标评估器
│   └── game.ts             # 游戏状态管理
├── ui/                     # 渲染和交互
│   ├── renderer.ts         # Canvas 渲染器
│   └── input.ts            # 输入处理
├── data/                   # 数据管理
│   ├── levels.ts           # 关卡配置
│   └── save.ts             # 存档系统
└── platform/               # 平台适配
    ├── wechat.ts           # 微信 API 适配
    └── analytics.ts        # 数据埋点适配
```

## 核心模块职责

### 1. Board (棋盘模型)
- **职责：** 管理棋盘状态和方块操作
- **接口：**
  - `emptyCells(): Position[]` - 获取空白格子
  - `addRandomTile(): Tile` - 随机添加新方块
  - `getTile(row, col): Tile` - 获取方块
  - `setTile(row, col, tile): void` - 设置方块
  - `isGameOver(): boolean` - 检查游戏是否结束
  - `clone(): Board` - 克隆棋盘状态

### 2. MergeEngine (合成引擎)
- **职责：** 处理方块移动和合成逻辑
- **接口：**
  - `move(direction): MoveResult` - 执行移动
  - `canMove(): boolean` - 检查是否可移动
- **依赖：** Board

### 3. GoalEvaluator (目标评估器)
- **职责：** 评估关卡目标完成情况
- **接口：**
  - `updateProgress(score, merges): void` - 更新进度
  - `isGoalAchieved(board): boolean` - 检查目标是否达成
  - `getProgress(board): GoalProgress` - 获取进度
- **依赖：** Board

### 4. Game (游戏状态管理)
- **职责：** 管理游戏整体状态和流程
- **接口：**
  - `init(): void` - 初始化游戏
  - `move(direction): MoveResult` - 执行移动
  - `undo(): boolean` - 撤销操作
  - `restart(): void` - 重新开始
  - `getState(): GameState` - 获取游戏状态
- **依赖：** Board, MergeEngine, GoalEvaluator

### 5. Renderer (渲染器)
- **职责：** 绘制游戏界面
- **接口：**
  - `render(state): void` - 渲染游戏状态
- **依赖：** Canvas 2D Context

### 6. InputHandler (输入处理)
- **职责：** 处理触摸和鼠标输入
- **接口：**
  - `onSwipe(callback): void` - 注册滑动回调
  - `onTap(callback): void` - 注册点击回调
- **依赖：** Canvas Element

## 数据流

```
用户输入 → InputHandler → Game → MergeEngine → Board
                                    ↓
                              GoalEvaluator
                                    ↓
                              Renderer → Canvas
```

1. 用户触摸屏幕
2. InputHandler 识别手势方向
3. Game 调用 MergeEngine 执行移动
4. MergeEngine 更新 Board 状态
5. GoalEvaluator 评估目标进度
6. Renderer 绘制新状态到 Canvas

## 关卡配置 Schema

```json
{
  "id": 1,
  "boardSize": 4,
  "goal": {
    "type": "merge_to_value",
    "target": 16,
    "description": "合成数字 16"
  },
  "maxMoves": 30,
  "initialTiles": 2,
  "description": "基础教学：学习滑动合成"
}
```

## 存档结构

```json
{
  "currentLevel": 1,
  "completedLevels": [1, 2, 3],
  "highScores": {
    "1": 500,
    "2": 800
  },
  "totalScore": 1300,
  "lastPlayed": 1715900000000
}
```

## 性能预算

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 冷启动时间 | < 3 秒 | 从打开到可操作 |
| 帧率 | ≥ 30 FPS | 流畅操作体验 |
| 内存占用 | < 100 MB | 避免被系统回收 |
| 包体大小 | < 4 MB | 首次加载快 |
| 动画数量 | ≤ 3 个同时 | 避免性能瓶颈 |

## 微信平台适配

### 生命周期
- `onShow`: 恢复游戏状态
- `onHide`: 保存游戏状态

### 分享
- `shareAppMessage`: 分享游戏结果
- 分享图片: 自动生成游戏截图

### 存储
- `wx.setStorageSync`: 本地存档
- `wx.getStorageSync`: 读取存档

### 广告
- `createRewardedVideoAd`: 激励视频广告
- 用于获取额外道具或复活

## 测试策略

### 单元测试
- **目标：** 核心逻辑模块
- **工具：** Jest + ts-jest
- **覆盖：** Board, MergeEngine, GoalEvaluator

### 集成测试
- **目标：** Game 模块完整流程
- **方法：** 模拟用户操作序列

### 真机测试
- **目标：** 微信环境兼容性
- **设备：** iOS 和 Android 主流机型

## 开发流程

1. **Phase 1:** 核心逻辑模块（已完成）
2. **Phase 2:** UI 渲染和输入
3. **Phase 3:** 关卡系统和存档
4. **Phase 4:** 微信平台适配
5. **Phase 5:** 测试和优化
