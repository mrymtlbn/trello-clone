import { nanoid } from "nanoid";
import { Board, Card, List, StorageData } from "@/types";

// Storage keys
const STORAGE_KEYS = {
  TRELLO_DATA: "trello-clone-data",
  CURRENT_BOARD: "trello-clone-current-board",
} as const;

const DEFAULT_COLOR = "#2E7EAF";

// Default data removed: no pre-created board

/**
 * Check if localStorage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get data from localStorage
 */
export const getStorageData = (): StorageData | null => {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRELLO_DATA);
    if (!data) {
      return null;
    }

    const parsed = JSON.parse(data);

    // Convert date strings back to Date objects and ensure color exists
    parsed.boards = parsed.boards.map((board: any) => ({
      ...board,
      color: board.color || DEFAULT_COLOR,
      createdAt: new Date(board.createdAt),
      updatedAt: new Date(board.updatedAt),
      lists: board.lists.map((list: any) => ({
        ...list,
        createdAt: new Date(list.createdAt),
        updatedAt: new Date(list.updatedAt),
        cards: list.cards.map((card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
        })),
      })),
    }));

    return parsed;
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    return null;
  }
};

/**
 * Save data to localStorage
 */
export const saveStorageData = (data: StorageData): void => {
  if (!isStorageAvailable()) {
    console.warn("localStorage is not available");
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.TRELLO_DATA, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
};

/**
 * Get current board ID from localStorage
 */
export const getCurrentBoardId = (): string | null => {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_BOARD);
  } catch {
    return null;
  }
};

/**
 * Set current board ID in localStorage
 */
export const setCurrentBoardId = (boardId: string): void => {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_BOARD, boardId);
  } catch (error) {
    console.error("Error setting current board ID:", error);
  }
};

/**
 * Initialize storage with default data
 */
export const initializeStorage = (): StorageData => {
  const existingData = getStorageData();

  if (existingData) {
    return existingData;
  }

  const defaultData: StorageData = {
    boards: [],
    currentBoardId: null,
    lastUpdated: new Date().toISOString(),
  };

  saveStorageData(defaultData);

  return defaultData;
};

/**
 * Clear all storage data
 */
export const clearStorage = (): void => {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.TRELLO_DATA);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_BOARD);
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

/**
 * Export data for backup
 */
export const exportData = (): string => {
  const data = getStorageData();
  return JSON.stringify(data, null, 2);
};

/**
 * Import data from backup
 */
export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData) as StorageData;

    // Validate data structure
    if (!data.boards || !Array.isArray(data.boards)) {
      throw new Error("Invalid data format");
    }

    // Convert date strings to Date objects and ensure color exists
    data.boards = data.boards.map((board: any) => ({
      ...board,
      color: board.color || DEFAULT_COLOR,
      createdAt: new Date(board.createdAt),
      updatedAt: new Date(board.updatedAt),
      lists: board.lists.map((list: any) => ({
        ...list,
        createdAt: new Date(list.createdAt),
        updatedAt: new Date(list.updatedAt),
        cards: list.cards.map((card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
        })),
      })),
    }));

    saveStorageData(data);
    if (data.currentBoardId) {
      setCurrentBoardId(data.currentBoardId);
    }

    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};
