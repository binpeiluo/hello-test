# Multica Number Merge - Save Data Schema

## 存档结构

### 基础结构

```json
{
  "currentLevel": 1,
  "completedLevels": [1, 2, 3],
  "highScores": {
    "1": 500,
    "2": 800,
    "3": 1200
  },
  "totalScore": 2500,
  "lastPlayed": 1715900000000
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| currentLevel | number | 是 | 当前解锁的最高关卡 |
| completedLevels | number[] | 是 | 已完成的关卡 ID 列表 |
| highScores | object | 是 | 每关最高分 |
| totalScore | number | 是 | 累计总分 |
| lastPlayed | number | 是 | 最后游戏时间戳 |

### 高分结构

```json
{
  "highScores": {
    "1": 500,
    "2": 800,
    "3": 1200
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| key | string | 关卡 ID |
| value | number | 该关卡最高分 |

## 存档操作

### 读取存档

```typescript
function loadSaveData(): SaveData {
  try {
    // 尝试微信存储
    if (typeof wx !== 'undefined') {
      const data = wx.getStorageSync('multica_number_merge_save');
      if (data) return JSON.parse(data);
    }
    // 回退到 localStorage
    else if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('multica_number_merge_save');
      if (data) return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load save data:', e);
  }
  
  // 返回默认存档
  return getDefaultSaveData();
}
```

### 保存存档

```typescript
function saveSaveData(data: SaveData): boolean {
  try {
    const json = JSON.stringify(data);
    
    // 尝试微信存储
    if (typeof wx !== 'undefined') {
      wx.setStorageSync('multica_number_merge_save', json);
      return true;
    }
    // 回退到 localStorage
    else if (typeof localStorage !== 'undefined') {
      localStorage.setItem('multica_number_merge_save', json);
      return true;
    }
  } catch (e) {
    console.error('Failed to save data:', e);
  }
  return false;
}
```

### 更新存档

```typescript
function updateSaveData(levelId: number, score: number): SaveData {
  const save = loadSaveData();
  
  // 更新已完成关卡
  if (!save.completedLevels.includes(levelId)) {
    save.completedLevels.push(levelId);
  }
  
  // 更新最高分
  if (!save.highScores[levelId] || score > save.highScores[levelId]) {
    save.highScores[levelId] = score;
  }
  
  // 更新当前关卡
  if (levelId >= save.currentLevel) {
    save.currentLevel = levelId + 1;
  }
  
  // 更新总分
  save.totalScore += score;
  
  // 更新最后游戏时间
  save.lastPlayed = Date.now();
  
  // 保存
  saveSaveData(save);
  
  return save;
}
```

## 存档验证

### 验证规则

1. **currentLevel：** 必须为正整数
2. **completedLevels：** 必须为正整数数组
3. **highScores：** 必须为对象，key 为字符串，value 为正整数
4. **totalScore：** 必须为非负整数
5. **lastPlayed：** 必须为有效时间戳

### 验证函数

```typescript
function validateSaveData(data: SaveData): boolean {
  // 验证 currentLevel
  if (typeof data.currentLevel !== 'number' || data.currentLevel < 1) {
    return false;
  }
  
  // 验证 completedLevels
  if (!Array.isArray(data.completedLevels)) {
    return false;
  }
  for (const levelId of data.completedLevels) {
    if (typeof levelId !== 'number' || levelId < 1) {
      return false;
    }
  }
  
  // 验证 highScores
  if (typeof data.highScores !== 'object') {
    return false;
  }
  for (const [key, value] of Object.entries(data.highScores)) {
    if (typeof key !== 'string' || typeof value !== 'number' || value < 0) {
      return false;
    }
  }
  
  // 验证 totalScore
  if (typeof data.totalScore !== 'number' || data.totalScore < 0) {
    return false;
  }
  
  // 验证 lastPlayed
  if (typeof data.lastPlayed !== 'number' || data.lastPlayed < 0) {
    return false;
  }
  
  return true;
}
```

## 存档恢复

### 默认存档

```typescript
function getDefaultSaveData(): SaveData {
  return {
    currentLevel: 1,
    completedLevels: [],
    highScores: {},
    totalScore: 0,
    lastPlayed: Date.now()
  };
}
```

### 重置存档

```typescript
function resetSaveData(): void {
  saveSaveData(getDefaultSaveData());
}
```

### 修复存档

```typescript
function repairSaveData(data: SaveData): SaveData {
  const repaired = { ...data };
  
  // 修复 currentLevel
  if (typeof repaired.currentLevel !== 'number' || repaired.currentLevel < 1) {
    repaired.currentLevel = 1;
  }
  
  // 修复 completedLevels
  if (!Array.isArray(repaired.completedLevels)) {
    repaired.completedLevels = [];
  } else {
    repaired.completedLevels = repaired.completedLevels.filter(
      id => typeof id === 'number' && id >= 1
    );
  }
  
  // 修复 highScores
  if (typeof repaired.highScores !== 'object') {
    repaired.highScores = {};
  } else {
    for (const [key, value] of Object.entries(repaired.highScores)) {
      if (typeof value !== 'number' || value < 0) {
        delete repaired.highScores[key];
      }
    }
  }
  
  // 修复 totalScore
  if (typeof repaired.totalScore !== 'number' || repaired.totalScore < 0) {
    repaired.totalScore = 0;
  }
  
  // 修复 lastPlayed
  if (typeof repaired.lastPlayed !== 'number' || repaired.lastPlayed < 0) {
    repaired.lastPlayed = Date.now();
  }
  
  return repaired;
}
```

## 存档迁移

### 版本管理

```typescript
interface SaveDataV1 {
  version: 1;
  currentLevel: number;
  completedLevels: number[];
  highScores: { [levelId: number]: number };
  totalScore: number;
  lastPlayed: number;
}

interface SaveDataV2 {
  version: 2;
  currentLevel: number;
  completedLevels: number[];
  highScores: { [levelId: number]: number };
  totalScore: number;
  lastPlayed: number;
  settings: {
    sound: boolean;
    music: boolean;
    vibration: boolean;
  };
}

type SaveData = SaveDataV1 | SaveDataV2;
```

### 迁移函数

```typescript
function migrateSaveData(data: any): SaveData {
  // 检查版本
  if (!data.version) {
    // 版本 1 -> 版本 2
    return migrateV1ToV2(data);
  }
  
  if (data.version === 1) {
    return migrateV1ToV2(data);
  }
  
  // 已是最新版本
  return data;
}

function migrateV1ToV2(data: SaveDataV1): SaveDataV2 {
  return {
    version: 2,
    currentLevel: data.currentLevel,
    completedLevels: data.completedLevels,
    highScores: data.highScores,
    totalScore: data.totalScore,
    lastPlayed: data.lastPlayed,
    settings: {
      sound: true,
      music: true,
      vibration: true
    }
  };
}
```

## 存档安全

### 数据加密

```typescript
function encryptSaveData(data: SaveData): string {
  const json = JSON.stringify(data);
  // 简单加密（实际应使用更安全的方法）
  return btoa(json);
}

function decryptSaveData(encrypted: string): SaveData {
  const json = atob(encrypted);
  return JSON.parse(json);
}
```

### 数据校验

```typescript
function checksumSaveData(data: SaveData): string {
  const json = JSON.stringify(data);
  // 简单校验和（实际应使用更安全的方法）
  let hash = 0;
  for (let i = 0; i < json.length; i++) {
    const char = json.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为 32 位整数
  }
  return hash.toString(16);
}
```

## 存档同步

### 云端同步

```typescript
interface CloudSaveManager {
  uploadSave(data: SaveData): Promise<boolean>;
  downloadSave(): Promise<SaveData | null>;
  mergeSave(local: SaveData, cloud: SaveData): SaveData;
}
```

### 同步策略

1. **自动同步：** 游戏结束时自动同步
2. **手动同步：** 用户手动触发同步
3. **冲突解决：** 使用最新版本

### 同步流程

```typescript
async function syncSaveData(): Promise<void> {
  const local = loadSaveData();
  const cloud = await cloudSaveManager.downloadSave();
  
  if (cloud) {
    // 合并本地和云端数据
    const merged = mergeSaveData(local, cloud);
    saveSaveData(merged);
    await cloudSaveManager.uploadSave(merged);
  } else {
    // 上传本地数据
    await cloudSaveManager.uploadSave(local);
  }
}
```

## 存档调试

### 调试工具

```typescript
function debugSaveData(): void {
  const data = loadSaveData();
  console.log('Save Data:', data);
  console.log('Valid:', validateSaveData(data));
  console.log('Current Level:', data.currentLevel);
  console.log('Completed Levels:', data.completedLevels);
  console.log('High Scores:', data.highScores);
  console.log('Total Score:', data.totalScore);
  console.log('Last Played:', new Date(data.lastPlayed));
}
```

### 测试用例

```typescript
describe('SaveData', () => {
  it('should load default save data', () => {
    const data = loadSaveData();
    expect(data.currentLevel).toBe(1);
    expect(data.completedLevels).toEqual([]);
    expect(data.highScores).toEqual({});
    expect(data.totalScore).toBe(0);
  });
  
  it('should save and load data', () => {
    const data = getDefaultSaveData();
    data.currentLevel = 5;
    data.completedLevels = [1, 2, 3, 4];
    data.highScores = { '1': 500, '2': 800 };
    data.totalScore = 1300;
    
    saveSaveData(data);
    const loaded = loadSaveData();
    
    expect(loaded.currentLevel).toBe(5);
    expect(loaded.completedLevels).toEqual([1, 2, 3, 4]);
    expect(loaded.highScores).toEqual({ '1': 500, '2': 800 });
    expect(loaded.totalScore).toBe(1300);
  });
  
  it('should validate save data', () => {
    const validData = getDefaultSaveData();
    expect(validateSaveData(validData)).toBe(true);
    
    const invalidData = { ...validData, currentLevel: -1 };
    expect(validateSaveData(invalidData)).toBe(false);
  });
});
```

## 存档性能

### 优化策略

1. **延迟保存：** 避免频繁保存
2. **增量保存：** 只保存变化的部分
3. **压缩数据：** 减少数据大小
4. **异步操作：** 避免阻塞主线程

### 性能指标

1. **加载时间：** < 100ms
2. **保存时间：** < 50ms
3. **数据大小：** < 10KB
4. **内存占用：** < 1MB

## 总结

存档系统的核心是**可靠性、安全性、可扩展性**。通过明确的数据结构、验证规则和恢复机制，确保玩家数据的安全和完整。

**关键成功因素：**
1. 数据结构清晰
2. 验证规则严格
3. 恢复机制完善
4. 同步策略合理
5. 性能优化到位
