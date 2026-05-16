# Multica Number Merge

一款面向微信小游戏平台的短局数字消除游戏。

## 游戏特色

- **目标制玩法：** 每关都有不同目标，不是单纯追求最大数字
- **消除机制：** 合成后的数字在满足条件时可被消除，释放棋盘空间
- **连锁反馈：** 连续合成或目标消除产生倍率、音效和动画奖励
- **每日挑战：** 使用固定关卡种子，让好友之间可比较
- **分享语境：** 分享的是挑战结果、残局局面，而不是强迫求助

## 技术架构

- **技术栈：** 原生 Canvas 2D + TypeScript
- **平台：** 微信小游戏
- **架构：** 模块化设计，核心逻辑可单元测试

## 项目结构

```
├── src/
│   ├── core/              # 核心逻辑模块
│   │   ├── board.ts      # 棋盘模型
│   │   ├── merge.ts      # 合成引擎
│   │   ├── goal.ts       # 目标评估器
│   │   └── game.ts       # 游戏状态管理
│   ├── ui/               # 渲染和交互
│   │   ├── renderer.ts   # Canvas 渲染器
│   │   └── input.ts      # 输入处理
│   ├── data/             # 数据管理
│   │   ├── levels.ts     # 关卡配置
│   │   └── save.ts       # 存档系统
│   └── platform/         # 平台适配
│       ├── wechat.ts     # 微信 API 适配
│       └── analytics.ts  # 数据埋点适配
├── assets/               # 游戏资源
├── docs/                 # 设计文档
├── tests/                # 测试文件
├── game.js               # 游戏入口
├── game.json             # 游戏配置
└── project.config.json   # 微信开发者工具配置
```

## 开发指南

### 环境准备

1. 安装 Node.js (>= 16)
2. 安装微信开发者工具
3. 克隆项目

```bash
git clone https://github.com/binpeiluo/hello-test.git
cd hello-test
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 测试

```bash
npm test
```

## 游戏规则

### 基础规则

1. 滑动屏幕移动所有方块
2. 相同数字的方块碰撞时合成一个
3. 合成后的数字在满足条件时可被消除
4. 每次移动后在空白位置随机生成一个新数字

### 关卡目标

- **合成指定数字：** 在棋盘上合成出指定数值的方块
- **消除指定数量：** 消除指定数量的方块
- **分数目标：** 达到指定分数
- **连击目标：** 达成指定连击数

### 胜利条件

- 达成关卡目标
- 在规定步数内完成目标

### 失败条件

- 步数耗尽但未完成目标
- 棋盘已满且无法进行任何合成

## 设计文档

- [创意简报](docs/creative-brief.md)
- [规则表](docs/rules-table.md)
- [技术架构](docs/technical-architecture.md)
- [UX 流程](docs/ux-flow.md)

## 许可证

MIT License
