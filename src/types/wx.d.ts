/**
 * WeChat Mini Game API type declarations
 */

interface WxShowResult {
  scene: string;
  path: string;
  query: Record<string, string>;
}

interface WxShareOptions {
  title: string;
  imageUrl?: string;
  success?: () => void;
  fail?: (err: any) => void;
}

interface WxVibrateOptions {
  type?: 'light' | 'medium' | 'heavy';
}

interface WxRewardedVideoAd {
  onClose(callback: (res: { isEnded: boolean }) => void): void;
  onError(callback: (err: any) => void): void;
  show(): Promise<void>;
  destroy(): void;
}

interface WxSystemInfo {
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  [key: string]: any;
}

interface WxStorage {
  getStorageSync(key: string): string;
  setStorageSync(key: string, value: string): void;
  removeStorageSync(key: string): void;
}

interface Wx {
  createCanvas(): HTMLCanvasElement;
  onShow(callback: (res: WxShowResult) => void): void;
  onHide(callback: () => void): void;
  shareAppMessage(options: WxShareOptions): void;
  vibrateShort(options?: WxVibrateOptions): void;
  vibrateLong(): void;
  getSystemInfoSync(): WxSystemInfo;
  createRewardedVideoAd(options: { adUnitId: string }): WxRewardedVideoAd;
  showToast(options: { title: string; icon?: string }): void;
  getStorageSync(key: string): string;
  setStorageSync(key: string, value: string): void;
}

declare const wx: Wx;
