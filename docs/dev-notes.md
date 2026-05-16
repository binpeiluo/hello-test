# Multica Number Merge - 开发笔记

## 开发环境搭建

### 前置要求

- **Node.js** >= 16 (推荐 18 LTS)
- **微信开发者工具** (最新稳定版)
- **Git**

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/binpeiluo/hello-test.git
cd hello-test

# 安装依赖
npm install
```

## 构建和运行命令

| 命令 | 说明 |
|------|------|
| `npm run build` | 编译 TypeScript 到 dist/ |
| `npm run dev` | 监听模式编译 (开发时使用) |
| `npm test` | 运行 Jest 单元测试 |

### 在微信开发者工具中运行

1. 打开微信开发者工具
2. 导入项目根目录
3. 项目配置会自动读取 `project.config.json`
4. 编译后的代码在 `dist/` 目录
5. 入口文件为 `game.js`

## 项目结构

```
hello-test/
├── src/
│   ├── core/                 # 核心逻辑 (纯 TypeScript，无平台依赖)
│   │   ├── board.ts         # 棋盘模型：格子管理、方块操作、游戏结束判定
│   │   ├── merge.ts         # 合成引擎：四方向移动、相邻合并、分数计算
│   │   ├── goal.ts          # 目标评估器：四种目标类型的进度追踪
│   │   └── game.ts          # 游戏状态管理：初始化、移动、撤销、胜负判定
│   ├── ui/                  # 渲染和交互
│   │   ├── renderer.ts      # Canvas 2D 渲染器：棋盘、方块、UI 元素绘制
│   │   └── input.ts         # 输入处理：触摸滑动和鼠标事件
│   ├── data/                # 数据管理
│   │   ├── levels.ts        # 20 个关卡配置 (4 种目标类型)
│   │   └── save.ts          # 存档系统：支持微信存储和 localStorage
│   ├── platform/            # 平台适配
│   │   └── wechat.ts        # 微信 API 适配器：生命周期、分享、广告、震动
│   └── types/
│       └── wx.d.ts          # 微信 API 类型声明
├── tests/
│   └── core/                # 单元测试
│       ├── board.test.ts    # 棋盘模型测试 (16 个用例)
│       ├── merge.test.ts    # 合成引擎测试 (19 个用例)
│       ├── goal.test.ts     # 目标评估器测试 (14 个用例)
│       └── game.test.ts     # 游戏状态管理测试 (14 个用例)
├── docs/                    # 设计文档
│   ├── creative-brief.md    # 创意简报
│   ├── rules-table.md       # 规则表
│   ├── technical-architecture.md  # 技术架构
│   ├── ux-flow.md           # UX 流程
│   ├── dev-notes.md         # 本文档
│   └── known-issues.md      # 已知问题
├── game.js                  # 微信小游戏入口
├── game.json                # 小游戏配置
├── project.config.json      # 微信开发者工具配置
├── package.json             # npm 配置
├── tsconfig.json            # TypeScript 配置
└── jest.config.js           # Jest 测试配置
```

## 关键设计决策

### 1. 纯逻辑与渲染分离

核心模块 (`core/`) 完全不依赖任何平台 API 或 DOM，可以独立进行单元测试。UI 模块 (`ui/`) 负责所有渲染和输入处理。这种分离使得：

- 核心逻辑可在 Node.js 环境下测试
- 游戏规则可以独立于平台验证
- 未来移植到其他平台只需重写 UI 层

### 2. 平台适配器模式

`WeChatAdapter` 使用单例模式封装所有微信 API 调用。核心模块不直接调用 `wx.*`，而是通过适配器间接访问。这使得：

- 核心代码在非微信环境也能运行
- 平台相关代码集中管理
- 测试时可以 mock 适配器

### 3. 关卡配置驱动

所有 20 个关卡通过 `levels.ts` 中的数据配置定义，包括棋盘大小、目标类型、最大步数等。新增关卡只需添加配置，无需修改代码。

### 4. 四种目标类型

- `merge_to_value`：合成指定数值的方块
- `clear_count`：消除指定数量的方块
- `score_target`：达到指定分数
- `combo_target`：单次移动达成指定连击数

### 5. 撤销系统

游戏支持撤销操作，保留最近 10 步的历史状态。每步保存棋盘克隆、分数和步数。

## 已知技术债务

1. **动画系统缺失**：当前渲染是即时的，没有平滑的移动/合成/消除动画。需要实现基于 `requestAnimationFrame` 的动画队列。

2. **音效系统缺失**：没有实现音效反馈。需要集成微信小游戏音频 API。

3. **道具系统未实现**：规则表中定义了撤回、清除、刷新三种道具，但代码中只实现了撤回。

4. **每日挑战未实现**：需要实现基于日期的固定种子随机数生成器。

5. **分享功能不完整**：`WeChatAdapter.shareGame()` 已实现基础分享，但缺少游戏截图生成功能。

6. **数据埋点缺失**：架构文档中规划了 `analytics.ts`，但尚未实现。

7. **`InputHandler.destroy()` 事件清理**：使用 `bind()` 创建的函数引用无法正确移除事件监听器，需要存储引用。

8. **存档系统未处理版本迁移**：如果存档数据结构在版本更新中发生变化，缺少迁移逻辑。
