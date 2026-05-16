/**
 * WeChat Mini Game platform adapter
 * Handles WeChat-specific APIs and lifecycle
 */

export class WeChatAdapter {
  private static instance: WeChatAdapter;

  private constructor() {}

  static getInstance(): WeChatAdapter {
    if (!WeChatAdapter.instance) {
      WeChatAdapter.instance = new WeChatAdapter();
    }
    return WeChatAdapter.instance;
  }

  // Initialize WeChat platform
  init(): void {
    if (typeof wx === 'undefined') {
      console.warn('WeChat API not available');
      return;
    }

    // Set up lifecycle callbacks
    wx.onShow(this.onShow.bind(this));
    wx.onHide(this.onHide.bind(this));
  }

  // Handle app show
  private onShow(res: any): void {
    console.log('App shown:', res);
    // Resume game if needed
  }

  // Handle app hide
  private onHide(): void {
    console.log('App hidden');
    // Save game state
  }

  // Share game
  shareGame(title: string, imageUrl?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof wx === 'undefined') {
        reject(new Error('WeChat API not available'));
        return;
      }

      wx.shareAppMessage({
        title,
        imageUrl,
        success: () => resolve(),
        fail: (err: any) => reject(err)
      });
    });
  }

  // Show rewarded video ad
  showRewardedAd(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (typeof wx === 'undefined') {
        reject(new Error('WeChat API not available'));
        return;
      }

      // Note: In production, you'd use a real ad unit ID
      const ad = wx.createRewardedVideoAd({
        adUnitId: 'adunit-xxx'
      });

      ad.onClose((res: any) => {
        resolve(res && res.isEnded);
      });

      ad.onError((err: any) => {
        reject(err);
      });

      ad.show().catch(() => {
        reject(new Error('Failed to show ad'));
      });
    });
  }

  // Get system info
  getSystemInfo(): any {
    if (typeof wx === 'undefined') {
      return {
        screenWidth: 375,
        screenHeight: 667,
        pixelRatio: 2
      };
    }

    return wx.getSystemInfoSync();
  }

  // Vibrate device
  vibrate(type: 'light' | 'medium' | 'heavy' = 'light'): void {
    if (typeof wx === 'undefined') return;

    switch (type) {
      case 'light':
        wx.vibrateShort({ type: 'light' });
        break;
      case 'medium':
        wx.vibrateShort({ type: 'medium' });
        break;
      case 'heavy':
        wx.vibrateLong();
        break;
    }
  }
}
