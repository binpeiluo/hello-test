# Multica Number Merge - Performance Budget

## 性能预算概述

### 设计原则

1. **流畅体验：** 游戏操作流畅无卡顿
2. **快速启动：** 冷启动时间 < 3 秒
3. **内存可控：** 内存占用 < 100 MB
4. **包体精简：** 首次加载 < 4 MB

### 目标设备

- **iOS：** iPhone 6s 及以上
- **Android：** 主流机型（骁龙 660 及以上）
- **屏幕：** 375px - 414px 宽度

## 启动性能

### 冷启动时间

**目标：** < 3 秒

**分解：**
- 资源加载：< 1 秒
- 代码执行：< 0.5 秒
- 渲染初始化：< 0.5 秒
- 首帧渲染：< 1 秒

**优化策略：**
1. **资源预加载：** 预加载关键资源
2. **代码分割：** 按需加载代码
3. **延迟初始化：** 延迟非关键初始化
4. **缓存策略：** 使用本地缓存

### 热启动时间

**目标：** < 1 秒

**优化策略：**
1. **状态恢复：** 快速恢复游戏状态
2. **资源缓存：** 使用缓存资源
3. **代码缓存：** 使用缓存代码

## 帧率性能

### 目标帧率

**目标：** ≥ 30 FPS

**最低帧率：** ≥ 20 FPS

**理想帧率：** 60 FPS

### 帧率监控

```javascript
// 帧率监控
let lastTime = 0;
let frameCount = 0;
let fps = 0;

function monitorFPS(currentTime) {
  frameCount++;
  if (currentTime - lastTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = currentTime;
    
    // 帧率告警
    if (fps < 20) {
      console.warn('Low FPS:', fps);
    }
  }
}
```

### 帧率优化

1. **减少绘制调用：** 合并绘制操作
2. **使用对象池：** 复用对象
3. **避免频繁 GC：** 减少对象创建
4. **优化动画：** 使用 requestAnimationFrame

## 内存性能

### 内存预算

**目标：** < 100 MB

**分解：**
- 游戏逻辑：< 10 MB
- 渲染资源：< 50 MB
- 音频资源：< 20 MB
- 其他：< 20 MB

### 内存监控

```javascript
// 内存监控
function monitorMemory() {
  if (typeof wx !== 'undefined' && wx.getPerformance) {
    const performance = wx.getPerformance();
    const memory = performance.memory;
    
    console.log('Used memory:', memory.usedJSHeapSize / 1024 / 1024, 'MB');
    console.log('Total memory:', memory.totalJSHeapSize / 1024 / 1024, 'MB');
    
    // 内存告警
    if (memory.usedJSHeapSize > 100 * 1024 * 1024) {
      console.warn('High memory usage:', memory.usedJSHeapSize / 1024 / 1024, 'MB');
    }
  }
}
```

### 内存优化

1. **对象池：** 复用对象
2. **资源释放：** 及时释放不用的资源
3. **避免内存泄漏：** 正确管理引用
4. **分批加载：** 按需加载资源

## 包体性能

### 包体预算

**首次加载：** < 4 MB

**总包体：** < 10 MB

### 包体分解

| 资源类型 | 大小 | 说明 |
|---------|------|------|
| 代码 | < 500 KB | JavaScript 代码 |
| 图片 | < 2 MB | 方块、背景、图标 |
| 音频 | < 1 MB | 音效、音乐 |
| 配置 | < 100 KB | 关卡、存档 |
| 其他 | < 400 KB | 字体、动画 |

### 包体优化

1. **代码压缩：** 使用 UglifyJS 压缩
2. **图片压缩：** 使用 TinyPNG 压缩
3. **音频压缩：** 使用 MP3 格式
4. **资源分包：** 按需加载资源

## 渲染性能

### Canvas 性能

**目标：** 60 FPS

**优化策略：**
1. **减少绘制调用：** 合并绘制操作
2. **使用离屏 Canvas：** 缓存静态内容
3. **避免频繁状态切换：** 批量处理
4. **使用硬件加速：** 开启 GPU 加速

### 绘制优化

```javascript
// 离屏 Canvas 缓存
const offscreenCanvas = wx.createCanvas();
const offscreenCtx = offscreenCanvas.getContext('2d');

// 绘制静态内容
function drawStaticContent() {
  offscreenCtx.fillStyle = '#faf8ef';
  offscreenCtx.fillRect(0, 0, width, height);
  
  // 绘制棋盘背景
  drawBoardBackground(offscreenCtx);
}

// 主循环
function gameLoop() {
  // 绘制静态内容（缓存）
  ctx.drawImage(offscreenCanvas, 0, 0);
  
  // 绘制动态内容
  drawTiles(ctx);
  drawUI(ctx);
  
  requestAnimationFrame(gameLoop);
}
```

## 输入性能

### 输入延迟

**目标：** < 50 ms

**优化策略：**
1. **事件优化：** 使用 passive 事件
2. **防抖处理：** 避免频繁触发
3. **预判处理：** 提前处理输入

### 输入优化

```javascript
// passive 事件
canvas.addEventListener('touchstart', (e) => {
  // 处理触摸
}, { passive: true });

// 防抖处理
let lastInputTime = 0;
const INPUT_INTERVAL = 16; // 60 FPS

function handleInput(e) {
  const now = Date.now();
  if (now - lastInputTime < INPUT_INTERVAL) {
    return;
  }
  lastInputTime = now;
  
  // 处理输入
}
```

## 音频性能

### 音频延迟

**目标：** < 100 ms

**优化策略：**
1. **预加载：** 预加载音频资源
2. **缓存：** 使用音频缓存
3. **复用：** 复用音频对象

### 音频优化

```javascript
// 音频池
const audioPool = {};

function getAudio(url) {
  if (!audioPool[url]) {
    audioPool[url] = wx.createInnerAudioContext();
    audioPool[url].src = url;
  }
  return audioPool[url];
}

function playSound(url) {
  const audio = getAudio(url);
  audio.play();
}
```

## 网络性能

### 网络请求

**目标：** < 5 秒

**优化策略：**
1. **请求合并：** 合并多个请求
2. **缓存策略：** 使用本地缓存
3. **超时处理：** 设置合理超时
4. **重试机制：** 失败后重试

### 网络优化

```javascript
// 请求缓存
const requestCache = {};

function requestWithCache(url, options = {}) {
  const cacheKey = url + JSON.stringify(options);
  
  if (requestCache[cacheKey]) {
    return Promise.resolve(requestCache[cacheKey]);
  }
  
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      ...options,
      success: (res) => {
        requestCache[cacheKey] = res.data;
        resolve(res.data);
      },
      fail: reject
    });
  });
}
```

## 存储性能

### 存储延迟

**目标：** < 100 ms

**优化策略：**
1. **批量操作：** 批量读写
2. **异步操作：** 使用异步 API
3. **压缩数据：** 压缩存储数据

### 存储优化

```javascript
// 批量存储
function saveBatch(data) {
  const json = JSON.stringify(data);
  wx.setStorageSync('game_data', json);
}

// 批量读取
function loadBatch() {
  const json = wx.getStorageSync('game_data');
  return json ? JSON.parse(json) : null;
}
```

## 性能监控

### 监控指标

| 指标 | 目标 | 告警阈值 |
|------|------|---------|
| 冷启动时间 | < 3 秒 | > 5 秒 |
| 热启动时间 | < 1 秒 | > 2 秒 |
| 帧率 | ≥ 30 FPS | < 20 FPS |
| 内存占用 | < 100 MB | > 150 MB |
| 包体大小 | < 4 MB | > 6 MB |
| 输入延迟 | < 50 ms | > 100 ms |
| 音频延迟 | < 100 ms | > 200 ms |

### 监控实现

```javascript
// 性能监控
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.start();
  }
  
  start() {
    // 帧率监控
    this.monitorFPS();
    
    // 内存监控
    this.monitorMemory();
    
    // 启动时间监控
    this.monitorStartup();
  }
  
  monitorFPS() {
    let lastTime = 0;
    let frameCount = 0;
    
    const loop = (currentTime) => {
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        this.metrics.fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        if (this.metrics.fps < 20) {
          this.report('low_fps', this.metrics.fps);
        }
      }
      requestAnimationFrame(loop);
    };
    
    requestAnimationFrame(loop);
  }
  
  monitorMemory() {
    setInterval(() => {
      if (typeof wx !== 'undefined' && wx.getPerformance) {
        const memory = wx.getPerformance().memory;
        this.metrics.memory = memory.usedJSHeapSize / 1024 / 1024;
        
        if (this.metrics.memory > 150) {
          this.report('high_memory', this.metrics.memory);
        }
      }
    }, 5000);
  }
  
  monitorStartup() {
    const startTime = Date.now();
    
    // 游戏初始化完成后
    this.metrics.startupTime = Date.now() - startTime;
    
    if (this.metrics.startupTime > 5000) {
      this.report('slow_startup', this.metrics.startupTime);
    }
  }
  
  report(type, value) {
    console.warn(`Performance issue: ${type} = ${value}`);
    // 上报到监控平台
  }
}
```

## 性能测试

### 测试环境

- **设备：** iPhone 6s, iPhone 12, 小米 8, 华为 P30
- **网络：** WiFi, 4G, 3G
- **场景：** 冷启动, 热启动, 游戏中, 切后台

### 测试用例

1. **冷启动测试：** 测量冷启动时间
2. **帧率测试：** 测量游戏帧率
3. **内存测试：** 测量内存占用
4. **包体测试：** 测量包体大小
5. **输入测试：** 测量输入延迟
6. **音频测试：** 测量音频延迟

### 测试指标

| 测试项 | 通过标准 | 实际结果 |
|--------|---------|---------|
| 冷启动 | < 3 秒 | |
| 帧率 | ≥ 30 FPS | |
| 内存 | < 100 MB | |
| 包体 | < 4 MB | |
| 输入延迟 | < 50 ms | |
| 音频延迟 | < 100 ms | |

## 性能优化清单

### 启动优化

- [ ] 资源预加载
- [ ] 代码分割
- [ ] 延迟初始化
- [ ] 缓存策略

### 帧率优化

- [ ] 减少绘制调用
- [ ] 使用对象池
- [ ] 避免频繁 GC
- [ ] 优化动画

### 内存优化

- [ ] 对象池
- [ ] 资源释放
- [ ] 避免内存泄漏
- [ ] 分批加载

### 包体优化

- [ ] 代码压缩
- [ ] 图片压缩
- [ ] 音频压缩
- [ ] 资源分包

### 渲染优化

- [ ] 离屏 Canvas
- [ ] 批量绘制
- [ ] 硬件加速
- [ ] 状态复用

### 输入优化

- [ ] passive 事件
- [ ] 防抖处理
- [ ] 预判处理

### 音频优化

- [ ] 预加载
- [ ] 缓存
- [ ] 复用

### 网络优化

- [ ] 请求合并
- [ ] 缓存策略
- [ ] 超时处理
- [ ] 重试机制

### 存储优化

- [ ] 批量操作
- [ ] 异步操作
- [ ] 压缩数据

## 总结

性能预算的核心是**流畅、快速、可控**。通过明确的性能目标、监控机制和优化策略，确保游戏在各种设备上都能提供良好的体验。

**关键成功因素：**
1. 启动时间 < 3 秒
2. 帧率 ≥ 30 FPS
3. 内存 < 100 MB
4. 包体 < 4 MB
5. 输入延迟 < 50 ms
6. 持续监控和优化
