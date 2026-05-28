/**
 * WeChat Mini Game platform adapter
 * Handles WeChat-specific APIs and lifecycle
 */
export declare class WeChatAdapter {
    private static instance;
    private constructor();
    static getInstance(): WeChatAdapter;
    init(): void;
    private onShow;
    private onHide;
    shareGame(title: string, imageUrl?: string): Promise<void>;
    showRewardedAd(): Promise<boolean>;
    getSystemInfo(): any;
    vibrate(type?: 'light' | 'medium' | 'heavy'): void;
}
//# sourceMappingURL=wechat.d.ts.map