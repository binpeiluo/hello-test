# Multica Number Merge - Level Schema

## 关卡配置结构

### 基础结构

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

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 关卡 ID，从 1 开始 |
| boardSize | number | 是 | 棋盘大小（4 或 5） |
| goal | object | 是 | 关卡目标 |
| maxMoves | number | 是 | 最大步数 |
| initialTiles | number | 是 | 初始方块数量 |
| description | string | 是 | 关卡描述 |

### 目标结构

```json
{
  "type": "merge_to_value",
  "target": 16,
  "description": "合成数字 16"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 目标类型 |
| target | number | 是 | 目标值 |
| description | string | 是 | 目标描述 |

### 目标类型

| 类型 | 说明 | 目标值示例 |
|------|------|-----------|
| merge_to_value | 合成指定数字 | 16, 32, 64, 128, 256, 512, 1024 |
| clear_count | 消除指定数量 | 5, 10, 20, 30 |
| score_target | 达到指定分数 | 100, 500, 1000, 2000, 5000, 10000 |
| combo_target | 达成指定连击 | 3, 5, 8 |

## 关卡配置示例

### 教学关卡 (1-5)

```json
[
  {
    "id": 1,
    "boardSize": 4,
    "goal": { "type": "merge_to_value", "target": 16, "description": "合成数字 16" },
    "maxMoves": 30,
    "initialTiles": 2,
    "description": "基础教学：学习滑动合成"
  },
  {
    "id": 2,
    "boardSize": 4,
    "goal": { "type": "merge_to_value", "target": 32, "description": "合成数字 32" },
    "maxMoves": 25,
    "initialTiles": 2,
    "description": "继续练习合成"
  },
  {
    "id": 3,
    "boardSize": 4,
    "goal": { "type": "score_target", "target": 100, "description": "达到 100 分" },
    "maxMoves": 20,
    "initialTiles": 2,
    "description": "学习分数系统"
  },
  {
    "id": 4,
    "boardSize": 4,
    "goal": { "type": "clear_count", "target": 5, "description": "消除 5 个方块" },
    "maxMoves": 25,
    "initialTiles": 3,
    "description": "学习消除机制"
  },
  {
    "id": 5,
    "boardSize": 4,
    "goal": { "type": "merge_to_value", "target": 64, "description": "合成数字 64" },
    "maxMoves": 30,
    "initialTiles": 2,
    "description": "教学完成，进入挑战"
  }
]
```

### 轻挑战关卡 (6-10)

```json
[
  {
    "id": 6,
    "boardSize": 4,
    "goal": { "type": "score_target", "target": 500, "description": "达到 500 分" },
    "maxMoves": 25,
    "initialTiles": 3,
    "description": "分数挑战"
  },
  {
    "id": 7,
    "boardSize": 4,
    "goal": { "type": "clear_count", "target": 10, "description": "消除 10 个方块" },
    "maxMoves": 30,
    "initialTiles": 3,
    "description": "消除挑战"
  },
  {
    "id": 8,
    "boardSize": 4,
    "goal": { "type": "merge_to_value", "target": 128, "description": "合成数字 128" },
    "maxMoves": 35,
    "initialTiles": 3,
    "description": "高数字挑战"
  },
  {
    "id": 9,
    "boardSize": 4,
    "goal": { "type": "combo_target", "target": 3, "description": "达成 3 连击" },
    "maxMoves": 30,
    "initialTiles": 3,
    "description": "连击挑战"
  },
  {
    "id": 10,
    "boardSize": 4,
    "goal": { "type": "score_target", "target": 1000, "description": "达到 1000 分" },
    "maxMoves": 30,
    "initialTiles": 3,
    "description": "首次失败关卡"
  }
]
```

### 中等挑战关卡 (11-15)

```json
[
  {
    "id": 11,
    "boardSize": 5,
    "goal": { "type": "merge_to_value", "target": 256, "description": "合成数字 256" },
    "maxMoves": 40,
    "initialTiles": 3,
    "description": "5x5 棋盘挑战"
  },
  {
    "id": 12,
    "boardSize": 5,
    "goal": { "type": "clear_count", "target": 20, "description": "消除 20 个方块" },
    "maxMoves": 35,
    "initialTiles": 4,
    "description": "大规模消除"
  },
  {
    "id": 13,
    "boardSize": 5,
    "goal": { "type": "score_target", "target": 2000, "description": "达到 2000 分" },
    "maxMoves": 35,
    "initialTiles": 4,
    "description": "高分挑战"
  },
  {
    "id": 14,
    "boardSize": 5,
    "goal": { "type": "combo_target", "target": 5, "description": "达成 5 连击" },
    "maxMoves": 40,
    "initialTiles": 4,
    "description": "连击大师"
  },
  {
    "id": 15,
    "boardSize": 5,
    "goal": { "type": "merge_to_value", "target": 512, "description": "合成数字 512" },
    "maxMoves": 45,
    "initialTiles": 4,
    "description": "数字合成大师"
  }
]
```

### 困难挑战关卡 (16-20)

```json
[
  {
    "id": 16,
    "boardSize": 5,
    "goal": { "type": "score_target", "target": 5000, "description": "达到 5000 分" },
    "maxMoves": 40,
    "initialTiles": 5,
    "description": "极限分数"
  },
  {
    "id": 17,
    "boardSize": 5,
    "goal": { "type": "clear_count", "target": 30, "description": "消除 30 个方块" },
    "maxMoves": 45,
    "initialTiles": 5,
    "description": "消除风暴"
  },
  {
    "id": 18,
    "boardSize": 5,
    "goal": { "type": "merge_to_value", "target": 1024, "description": "合成数字 1024" },
    "maxMoves": 50,
    "initialTiles": 5,
    "description": "数字极限"
  },
  {
    "id": 19,
    "boardSize": 5,
    "goal": { "type": "combo_target", "target": 8, "description": "达成 8 连击" },
    "maxMoves": 45,
    "initialTiles": 5,
    "description": "连击传说"
  },
  {
    "id": 20,
    "boardSize": 5,
    "goal": { "type": "score_target", "target": 10000, "description": "达到 10000 分" },
    "maxMoves": 50,
    "initialTiles": 5,
    "description": "最终挑战"
  }
]
```

## 难度曲线

### 参数范围

| 阶段 | 棋盘大小 | 最大步数 | 初始方块 | 目标难度 |
|------|---------|---------|---------|---------|
| 教学 (1-5) | 4x4 | 20-30 | 2-3 | 低 |
| 轻挑战 (6-10) | 4x4 | 25-35 | 3 | 中低 |
| 中等挑战 (11-15) | 5x5 | 35-45 | 3-4 | 中 |
| 困难挑战 (16-20) | 5x5 | 40-50 | 4-5 | 高 |

### 成功率目标

| 阶段 | 目标成功率 | 实际成功率 |
|------|-----------|-----------|
| 教学 (1-5) | > 90% | 95% |
| 轻挑战 (6-10) | 70-80% | 75% |
| 中等挑战 (11-15) | 50-60% | 55% |
| 困难挑战 (16-20) | 30-40% | 35% |

## 关卡验证

### 验证方法

1. **模拟测试：** 模拟 1000 次游戏
2. **成功率统计：** 统计成功率
3. **难度评估：** 评估难度是否合适
4. **调整优化：** 根据结果调整参数

### 验证指标

1. **成功率：** 完成关卡的比例
2. **平均步数：** 完成关卡的平均步数
3. **平均分数：** 完成关卡的平均分数
4. **失败原因：** 失败的主要原因

### 验证流程

1. **初始验证：** 验证关卡可解性
2. **平衡验证：** 验证难度平衡
3. **用户验证：** 用户测试验证
4. **数据验证：** 上线后数据验证

## 关卡扩展

### 新增关卡

1. **设计目标：** 确定关卡目标和难度
2. **参数配置：** 配置关卡参数
3. **验证测试：** 验证关卡可解性和难度
4. **上线发布：** 发布新关卡

### 关卡调整

1. **数据监控：** 监控关卡数据
2. **问题识别：** 识别难度问题
3. **参数调整：** 调整关卡参数
4. **验证测试：** 验证调整效果

## 关卡数据结构

### TypeScript 类型定义

```typescript
interface LevelConfig {
  id: number;
  boardSize: number;
  goal: Goal;
  maxMoves: number;
  initialTiles: number;
  description: string;
}

interface Goal {
  type: GoalType;
  target: number;
  description: string;
}

type GoalType = 'merge_to_value' | 'clear_count' | 'score_target' | 'combo_target';
```

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "number" },
    "boardSize": { "type": "number", "enum": [4, 5] },
    "goal": {
      "type": "object",
      "properties": {
        "type": { "type": "string", "enum": ["merge_to_value", "clear_count", "score_target", "combo_target"] },
        "target": { "type": "number" },
        "description": { "type": "string" }
      },
      "required": ["type", "target", "description"]
    },
    "maxMoves": { "type": "number" },
    "initialTiles": { "type": "number" },
    "description": { "type": "string" }
  },
  "required": ["id", "boardSize", "goal", "maxMoves", "initialTiles", "description"]
}
```

## 总结

关卡配置的核心是**可解性、平衡性、可扩展性**。通过明确的配置结构、难度曲线和验证方法，确保关卡的质量和可玩性。

**关键成功因素：**
1. 配置结构清晰
2. 难度曲线合理
3. 验证方法有效
4. 扩展机制灵活
