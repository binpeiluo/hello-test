/**
 * Input handler for Multica Number Merge
 * Handles touch/swipe controls for mobile
 */
import { Direction } from '../core/merge';
export type InputCallback = (direction: Direction) => void;
export type TapCallback = (x: number, y: number) => void;
export declare class InputHandler {
    private canvas;
    private swipeCallback;
    private tapCallback;
    private startX;
    private startY;
    private startTime;
    private minSwipeDistance;
    private maxSwipeTime;
    constructor(canvas: HTMLCanvasElement);
    onSwipe(callback: InputCallback): void;
    onTap(callback: TapCallback): void;
    private setupEventListeners;
    private onTouchStart;
    private onTouchMove;
    private onTouchEnd;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
    private processSwipe;
    private getSwipeDirection;
    destroy(): void;
}
//# sourceMappingURL=input.d.ts.map