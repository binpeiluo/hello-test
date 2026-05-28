"use strict";
/**
 * WeChat Mini Game platform adapter
 * Handles WeChat-specific APIs and lifecycle
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeChatAdapter = void 0;
class WeChatAdapter {
    constructor() { }
    static getInstance() {
        if (!WeChatAdapter.instance) {
            WeChatAdapter.instance = new WeChatAdapter();
        }
        return WeChatAdapter.instance;
    }
    // Initialize WeChat platform
    init() {
        if (typeof wx === 'undefined') {
            console.warn('WeChat API not available');
            return;
        }
        // Set up lifecycle callbacks
        wx.onShow(this.onShow.bind(this));
        wx.onHide(this.onHide.bind(this));
    }
    // Handle app show
    onShow(res) {
        console.log('App shown:', res);
        // Resume game if needed
    }
    // Handle app hide
    onHide() {
        console.log('App hidden');
        // Save game state
    }
    // Share game
    shareGame(title, imageUrl) {
        return new Promise((resolve, reject) => {
            if (typeof wx === 'undefined') {
                reject(new Error('WeChat API not available'));
                return;
            }
            wx.shareAppMessage({
                title,
                imageUrl,
                success: () => resolve(),
                fail: (err) => reject(err)
            });
        });
    }
    // Show rewarded video ad
    showRewardedAd() {
        return new Promise((resolve, reject) => {
            if (typeof wx === 'undefined') {
                reject(new Error('WeChat API not available'));
                return;
            }
            // Note: In production, you'd use a real ad unit ID
            const ad = wx.createRewardedVideoAd({
                adUnitId: 'adunit-xxx'
            });
            ad.onClose((res) => {
                resolve(res && res.isEnded);
            });
            ad.onError((err) => {
                reject(err);
            });
            ad.show().catch(() => {
                reject(new Error('Failed to show ad'));
            });
        });
    }
    // Get system info
    getSystemInfo() {
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
    vibrate(type = 'light') {
        if (typeof wx === 'undefined')
            return;
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
exports.WeChatAdapter = WeChatAdapter;
//# sourceMappingURL=wechat.js.map