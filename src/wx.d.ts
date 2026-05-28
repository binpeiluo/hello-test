declare namespace wx {
  function getStorageSync(key: string): string;
  function setStorageSync(key: string, data: string): void;
  function onShow(callback: (res: any) => void): void;
  function onHide(callback: () => void): void;
  function shareAppMessage(options: { title: string; imageUrl?: string; success?: () => void; fail?: (err: any) => void }): void;
  function createRewardedVideoAd(options: { adUnitId: string }): {
    onClose(callback: (res: any) => void): void;
    onError(callback: (err: any) => void): void;
    show(): Promise<void>;
  };
  function getSystemInfoSync(): any;
  function vibrateShort(options?: { type?: string }): void;
  function vibrateLong(): void;
}
