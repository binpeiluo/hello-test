/**
 * Save/Load system for Multica Number Merge
 * Handles local storage for game progress
 */

export interface SaveData {
  currentLevel: number;
  completedLevels: number[];
  highScores: { [levelId: number]: number };
  totalScore: number;
  lastPlayed: number;
}

const SAVE_KEY = 'multica_number_merge_save';

export class SaveManager {
  // Load save data from storage
  static load(): SaveData {
    try {
      // Try WeChat storage first
      if (typeof wx !== 'undefined') {
        const data = wx.getStorageSync(SAVE_KEY);
        if (data) return JSON.parse(data);
      }
      // Fallback to localStorage
      else if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(SAVE_KEY);
        if (data) return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load save data:', e);
    }

    // Return default save data
    return SaveManager.getDefaultSave();
  }

  // Save data to storage
  static save(data: SaveData): boolean {
    try {
      const json = JSON.stringify(data);

      // Try WeChat storage first
      if (typeof wx !== 'undefined') {
        wx.setStorageSync(SAVE_KEY, json);
        return true;
      }
      // Fallback to localStorage
      else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SAVE_KEY, json);
        return true;
      }
    } catch (e) {
      console.error('Failed to save data:', e);
    }
    return false;
  }

  // Update level completion
  static completeLevel(levelId: number, score: number): SaveData {
    const save = SaveManager.load();

    // Update completed levels
    if (!save.completedLevels.includes(levelId)) {
      save.completedLevels.push(levelId);
    }

    // Update high score
    if (!save.highScores[levelId] || score > save.highScores[levelId]) {
      save.highScores[levelId] = score;
    }

    // Update current level (unlock next)
    if (levelId >= save.currentLevel) {
      save.currentLevel = levelId + 1;
    }

    // Update total score
    save.totalScore += score;

    // Update last played
    save.lastPlayed = Date.now();

    // Save
    SaveManager.save(save);

    return save;
  }

  // Get high score for a level
  static getHighScore(levelId: number): number {
    const save = SaveManager.load();
    return save.highScores[levelId] || 0;
  }

  // Check if level is unlocked
  static isLevelUnlocked(levelId: number): boolean {
    const save = SaveManager.load();
    return levelId <= save.currentLevel;
  }

  // Reset all save data
  static reset(): void {
    SaveManager.save(SaveManager.getDefaultSave());
  }

  // Get default save data
  private static getDefaultSave(): SaveData {
    return {
      currentLevel: 1,
      completedLevels: [],
      highScores: {},
      totalScore: 0,
      lastPlayed: Date.now()
    };
  }
}
