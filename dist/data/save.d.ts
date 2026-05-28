/**
 * Save/Load system for Multica Number Merge
 * Handles local storage for game progress
 */
export interface SaveData {
    currentLevel: number;
    completedLevels: number[];
    highScores: {
        [levelId: number]: number;
    };
    totalScore: number;
    lastPlayed: number;
}
export declare class SaveManager {
    static load(): SaveData;
    static save(data: SaveData): boolean;
    static completeLevel(levelId: number, score: number): SaveData;
    static getHighScore(levelId: number): number;
    static isLevelUnlocked(levelId: number): boolean;
    static reset(): void;
    private static getDefaultSave;
}
//# sourceMappingURL=save.d.ts.map