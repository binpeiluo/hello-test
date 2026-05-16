/**
 * Input handler for Multica Number Merge
 * Handles touch/swipe controls for mobile
 */

import { Direction } from '../core/merge';

export type InputCallback = (direction: Direction) => void;
export type TapCallback = (x: number, y: number) => void;

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private swipeCallback: InputCallback | null = null;
  private tapCallback: TapCallback | null = null;
  private startX: number = 0;
  private startY: number = 0;
  private startTime: number = 0;
  private minSwipeDistance: number = 30;
  private maxSwipeTime: number = 300;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupEventListeners();
  }

  // Set callback for swipe gestures
  onSwipe(callback: InputCallback): void {
    this.swipeCallback = callback;
  }

  // Set callback for tap gestures
  onTap(callback: TapCallback): void {
    this.tapCallback = callback;
  }

  // Set up event listeners
  private setupEventListeners(): void {
    // Touch events
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));

    // Mouse events (for desktop testing)
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  // Touch start handler
  private onTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
  }

  // Touch move handler
  private onTouchMove(e: TouchEvent): void {
    e.preventDefault();
  }

  // Touch end handler
  private onTouchEnd(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.changedTouches[0];
    this.processSwipe(touch.clientX, touch.clientY);
  }

  // Mouse down handler
  private onMouseDown(e: MouseEvent): void {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startTime = Date.now();
  }

  // Mouse move handler
  private onMouseMove(e: MouseEvent): void {
    // Nothing to do
  }

  // Mouse up handler
  private onMouseUp(e: MouseEvent): void {
    this.processSwipe(e.clientX, e.clientY);
  }

  // Process swipe gesture
  private processSwipe(endX: number, endY: number): void {
    const dx = endX - this.startX;
    const dy = endY - this.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const duration = Date.now() - this.startTime;

    // Check if it's a tap (short distance and short time)
    if (distance < this.minSwipeDistance && duration < 200) {
      if (this.tapCallback) {
        const rect = this.canvas.getBoundingClientRect();
        this.tapCallback(
          endX - rect.left,
          endY - rect.top
        );
      }
      return;
    }

    // Check if it's a swipe (sufficient distance and within time limit)
    if (distance >= this.minSwipeDistance && duration <= this.maxSwipeTime) {
      const direction = this.getSwipeDirection(dx, dy);
      if (this.swipeCallback) {
        this.swipeCallback(direction);
      }
    }
  }

  // Get swipe direction from delta values
  private getSwipeDirection(dx: number, dy: number): Direction {
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  }

  // Clean up event listeners
  destroy(): void {
    this.canvas.removeEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.removeEventListener('touchmove', this.onTouchMove.bind(this));
    this.canvas.removeEventListener('touchend', this.onTouchEnd.bind(this));
    this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }
}
