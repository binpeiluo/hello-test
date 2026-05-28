"use strict";
/**
 * Input handler for Multica Number Merge
 * Handles touch/swipe controls for mobile
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputHandler = void 0;
class InputHandler {
    constructor(canvas) {
        this.swipeCallback = null;
        this.tapCallback = null;
        this.startX = 0;
        this.startY = 0;
        this.startTime = 0;
        this.minSwipeDistance = 30;
        this.maxSwipeTime = 300;
        this.canvas = canvas;
        this.setupEventListeners();
    }
    // Set callback for swipe gestures
    onSwipe(callback) {
        this.swipeCallback = callback;
    }
    // Set callback for tap gestures
    onTap(callback) {
        this.tapCallback = callback;
    }
    // Set up event listeners
    setupEventListeners() {
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
    onTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.startTime = Date.now();
    }
    // Touch move handler
    onTouchMove(e) {
        e.preventDefault();
    }
    // Touch end handler
    onTouchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        this.processSwipe(touch.clientX, touch.clientY);
    }
    // Mouse down handler
    onMouseDown(e) {
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startTime = Date.now();
    }
    // Mouse move handler
    onMouseMove(e) {
        // Nothing to do
    }
    // Mouse up handler
    onMouseUp(e) {
        this.processSwipe(e.clientX, e.clientY);
    }
    // Process swipe gesture
    processSwipe(endX, endY) {
        const dx = endX - this.startX;
        const dy = endY - this.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const duration = Date.now() - this.startTime;
        // Check if it's a tap (short distance and short time)
        if (distance < this.minSwipeDistance && duration < 200) {
            if (this.tapCallback) {
                const rect = this.canvas.getBoundingClientRect();
                this.tapCallback(endX - rect.left, endY - rect.top);
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
    getSwipeDirection(dx, dy) {
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        if (absDx > absDy) {
            return dx > 0 ? 'right' : 'left';
        }
        else {
            return dy > 0 ? 'down' : 'up';
        }
    }
    // Clean up event listeners
    destroy() {
        this.canvas.removeEventListener('touchstart', this.onTouchStart.bind(this));
        this.canvas.removeEventListener('touchmove', this.onTouchMove.bind(this));
        this.canvas.removeEventListener('touchend', this.onTouchEnd.bind(this));
        this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
    }
}
exports.InputHandler = InputHandler;
//# sourceMappingURL=input.js.map