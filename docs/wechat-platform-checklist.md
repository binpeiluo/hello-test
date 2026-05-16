# Multica Number Merge - WeChat Platform Checklist

## 平台适配清单

### 1. 基础配置

#### 1.1 项目配置

- [x] game.json - 游戏配置文件
- [x] project.config.json - 开发者工具配置
- [x] appid - 微信小程序 AppID

#### 1.2 目录结构

- [x] game.js - 游戏入口
- [x] src/ - 源代码目录
- [x] assets/ - 资源目录
- [x] project.config.json - 项目配置

### 2. 生命周期

#### 2.1 应用生命周期

- [x] onShow - 应用显示
- [x] onHide - 应用隐藏
- [x] onError - 应用错误

#### 2.2 实现示例

```javascript
// game.js
App({
  onShow(res) {
    console.log('App shown:', res);
    // 恢复游戏状态
  },
  
  onHide() {
    console.log('App hidden');
    // 保存游戏状态
  },
  
  onError(err) {
    console.error('App error:', err);
    // 上报错误
  }
});
```

### 3. 渲染系统

#### 3.1 Canvas 创建

- [x] 创建 Canvas
- [x] 获取 Context
- [x] 设置 Canvas 尺寸

#### 3.2 实现示例

```javascript
// 创建 Canvas
const canvas = wx.createCanvas();
const ctx = canvas.getContext('2d');

// 设置尺寸
const { windowWidth, windowHeight } = wx.getSystemInfoSync();
canvas.width = windowWidth;
canvas.height = windowHeight;
```

### 4. 输入系统

#### 4.1 触摸事件

- [x] touchstart - 触摸开始
- [x] touchmove - 触摸移动
- [x] touchend - 触摸结束
- [x] touchcancel - 触摸取消

#### 4.2 实现示例

```javascript
// 触摸事件处理
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  // 记录起始位置
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  // 处理移动
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  const touch = e.changedTouches[0];
  // 处理滑动
});
```

### 5. 存储系统

#### 5.1 本地存储

- [x] wx.setStorageSync - 同步存储
- [x] wx.getStorageSync - 同步读取
- [x] wx.removeStorageSync - 同步删除
- [x] wx.clearStorageSync - 同步清空

#### 5.2 异步存储

- [x] wx.setStorage - 异步存储
- [x] wx.getStorage - 异步读取
- [x] wx.removeStorage - 异步删除
- [x] wx.clearStorage - 异步清空

#### 5.3 实现示例

```javascript
// 同步存储
function saveData(key, data) {
  try {
    wx.setStorageSync(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}

// 同步读取
function loadData(key) {
  try {
    const data = wx.getStorageSync(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Load failed:', e);
    return null;
  }
}
```

### 6. 分享系统

#### 6.1 分享配置

- [x] wx.showShareMenu - 显示分享按钮
- [x] wx.onShareAppMessage - 监听分享
- [x] wx.shareAppMessage - 主动分享

#### 6.2 实现示例

```javascript
// 显示分享按钮
wx.showShareMenu({
  withShareTicket: true,
  menus: ['shareAppMessage', 'shareTimeline']
});

// 监听分享
wx.onShareAppMessage(() => {
  return {
    title: '我在 Multica Number Merge 中获得了 5000 分！',
    imageUrl: 'assets/images/share.png'
  };
});

// 主动分享
function shareGame() {
  wx.shareAppMessage({
    title: '我在 Multica Number Merge 中获得了 5000 分！',
    imageUrl: 'assets/images/share.png'
  });
}
```

### 7. 广告系统

#### 7.1 激励视频广告

- [x] wx.createRewardedVideoAd - 创建激励视频
- [x] ad.show() - 显示广告
- [x] ad.onClose - 监听关闭
- [x] ad.onError - 监听错误

#### 7.2 实现示例

```javascript
// 创建激励视频
const rewardedAd = wx.createRewardedVideoAd({
  adUnitId: 'adunit-xxx'
});

// 监听关闭
rewardedAd.onClose((res) => {
  if (res && res.isEnded) {
    // 用户完整观看
    grantReward();
  } else {
    // 用户中途关闭
  }
});

// 监听错误
rewardedAd.onError((err) => {
  console.error('Ad error:', err);
});

// 显示广告
function showRewardedAd() {
  rewardedAd.show().catch(() => {
    // 广告加载失败
    rewardedAd.load().then(() => rewardedAd.show());
  });
}
```

### 8. 震动系统

#### 8.1 震动 API

- [x] wx.vibrateShort - 短震动
- [x] wx.vibrateLong - 长震动

#### 8.2 实现示例

```javascript
// 短震动
function vibrateShort(type = 'light') {
  wx.vibrateShort({ type });
}

// 长震动
function vibrateLong() {
  wx.vibrateLong();
}
```

### 9. 系统信息

#### 9.1 系统信息获取

- [x] wx.getSystemInfoSync - 同步获取
- [x] wx.getSystemInfo - 异步获取

#### 9.2 实现示例

```javascript
// 同步获取
const systemInfo = wx.getSystemInfoSync();
const { windowWidth, windowHeight, pixelRatio } = systemInfo;

// 异步获取
wx.getSystemInfo({
  success: (res) => {
    console.log('System info:', res);
  }
});
```

### 10. 网络状态

#### 10.1 网络状态监听

- [x] wx.getNetworkType - 获取网络类型
- [x] wx.onNetworkStatusChange - 监听网络变化

#### 10.2 实现示例

```javascript
// 获取网络类型
wx.getNetworkType({
  success: (res) => {
    console.log('Network type:', res.networkType);
  }
});

// 监听网络变化
wx.onNetworkStatusChange((res) => {
  console.log('Network status:', res.isConnected);
});
```

### 11. 性能优化

#### 11.1 帧率优化

- [x] requestAnimationFrame - 动画帧
- [x] 帧率监控
- [x] 性能预算

#### 11.2 内存优化

- [x] 对象池
- [x] 资源释放
- [x] 内存监控

#### 11.3 实现示例

```javascript
// 帧率监控
let lastTime = 0;
let frameCount = 0;

function gameLoop(currentTime) {
  frameCount++;
  if (currentTime - lastTime >= 1000) {
    console.log('FPS:', frameCount);
    frameCount = 0;
    lastTime = currentTime;
  }
  
  // 游戏逻辑
  update();
  render();
  
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
```

### 12. 错误处理

#### 12.1 错误捕获

- [x] try-catch - 同步错误
- [x] Promise.catch - 异步错误
- [x] window.onerror - 全局错误

#### 12.2 实现示例

```javascript
// 全局错误捕获
window.onerror = (msg, url, line, col, error) => {
  console.error('Global error:', msg, url, line, col, error);
  // 上报错误
  reportError(msg, url, line, col, error);
};

// Promise 错误捕获
window.onunhandledrejection = (event) => {
  console.error('Unhandled rejection:', event.reason);
  // 上报错误
  reportError(event.reason);
};
```

### 13. 数据埋点

#### 13.1 埋点事件

- [x] 游戏开始
- [x] 游戏结束
- [x] 关卡完成
- [x] 关卡失败
- [x] 分享操作
- [x] 广告观看

#### 13.2 实现示例

```javascript
// 数据埋点
function trackEvent(event, properties = {}) {
  // 微信数据上报
  if (typeof wx !== 'undefined' && wx.reportAnalytics) {
    wx.reportAnalytics(event, properties);
  }
  
  // 自定义上报
  console.log('Track event:', event, properties);
}
```

### 14. 资源加载

#### 14.1 图片加载

- [x] wx.createImage - 创建图片
- [x] 图片预加载
- [x] 图片缓存

#### 14.2 音频加载

- [x] wx.createInnerAudioContext - 创建音频
- [x] 音频预加载
- [x] 音频缓存

#### 14.3 实现示例

```javascript
// 图片预加载
function preloadImages(urls) {
  return Promise.all(urls.map(url => {
    return new Promise((resolve, reject) => {
      const img = wx.createImage();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load ${url}`));
      img.src = url;
    });
  }));
}

// 音频预加载
function preloadAudio(urls) {
  return urls.map(url => {
    const audio = wx.createInnerAudioContext();
    audio.src = url;
    return audio;
  });
}
```

### 15. 设备适配

#### 15.1 屏幕适配

- [x] 获取屏幕尺寸
- [x] 计算缩放比例
- [x] 适配不同分辨率

#### 15.2 实现示例

```javascript
// 屏幕适配
function adaptScreen() {
  const { windowWidth, windowHeight, pixelRatio } = wx.getSystemInfoSync();
  
  const designWidth = 750;
  const designHeight = 1334;
  
  const scale = Math.min(windowWidth / designWidth, windowHeight / designHeight);
  
  return {
    width: windowWidth,
    height: windowHeight,
    scale,
    pixelRatio
  };
}
```

### 16. 测试清单

#### 16.1 功能测试

- [x] 游戏启动
- [x] 游戏操作
- [x] 存档读取
- [x] 存档保存
- [x] 分享功能
- [x] 广告功能

#### 16.2 性能测试

- [x] 启动时间
- [x] 帧率表现
- [x] 内存占用
- [x] 包体大小

#### 16.3 兼容性测试

- [x] iOS 设备
- [x] Android 设备
- [x] 不同屏幕尺寸
- [x] 不同微信版本

### 17. 发布清单

#### 17.1 代码检查

- [x] 代码规范
- [x] 错误处理
- [x] 性能优化
- [x] 安全检查

#### 17.2 资源检查

- [x] 图片资源
- [x] 音频资源
- [x] 配置文件
- [x] 文档资料

#### 17.3 测试检查

- [x] 功能测试
- [x] 性能测试
- [x] 兼容性测试
- [x] 安全测试

### 18. 监控清单

#### 18.1 性能监控

- [x] 帧率监控
- [x] 内存监控
- [x] 启动时间监控
- [x] 加载时间监控

#### 18.2 错误监控

- [x] 错误上报
- [x] 错误分类
- [x] 错误统计
- [x] 错误告警

#### 18.3 用户行为监控

- [x] 用户留存
- [x] 关卡完成率
- [x] 分享率
- [x] 付费率

## 总结

微信平台适配的核心是**生命周期、渲染、输入、存储、分享、广告**。通过完整的适配清单，确保游戏在微信平台上正常运行。

**关键成功因素：**
1. 生命周期正确处理
2. 渲染性能优化
3. 输入响应及时
4. 存储可靠稳定
5. 分享体验流畅
6. 广告合理接入
