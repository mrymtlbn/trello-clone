import { Board, List, Card } from "@/types";

/**
 * Generate a unique ID using nanoid
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Sort items by position
 */
export const sortByPosition = <T extends { position: number }>(
  items: T[]
): T[] => {
  return [...items].sort((a, b) => a.position - b.position);
};

/**
 * Get next position for a new item
 */
export const getNextPosition = (items: { position: number }[]): number => {
  if (items.length === 0) return 0;
  return Math.max(...items.map((item) => item.position)) + 1;
};

/**
 * Reorder items after drag and drop
 */
export const reorderItems = <T extends { id: string; position: number }>(
  items: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(items);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  // Update positions
  return result.map((item, index) => ({
    ...item,
    position: index,
  }));
};

/**
 * Move item between lists
 */
export const moveItemBetweenLists = <
  T extends { id: string; position: number }
>(
  sourceList: T[],
  destinationList: T[],
  sourceIndex: number,
  destinationIndex: number,
  itemId: string
): { sourceList: T[]; destinationList: T[] } => {
  const sourceResult = Array.from(sourceList);
  const destinationResult = Array.from(destinationList);

  const [movedItem] = sourceResult.splice(sourceIndex, 1);

  // Update the moved item's position
  const updatedItem = { ...movedItem, position: destinationIndex };

  // Insert at destination
  destinationResult.splice(destinationIndex, 0, updatedItem);

  // Update positions for both lists
  const updatedSourceList = sourceResult.map((item, index) => ({
    ...item,
    position: index,
  }));

  const updatedDestinationList = destinationResult.map((item, index) => ({
    ...item,
    position: index,
  }));

  return {
    sourceList: updatedSourceList,
    destinationList: updatedDestinationList,
  };
};

/**
 * Find board by ID
 */
export const findBoardById = (
  boards: Board[],
  boardId: string
): Board | undefined => {
  return boards.find((board) => board.id === boardId);
};

/**
 * Find list by ID
 */
export const findListById = (
  boards: Board[],
  listId: string
): { board: Board; list: List } | null => {
  for (const board of boards) {
    const list = board.lists.find((list) => list.id === listId);
    if (list) {
      return { board, list };
    }
  }
  return null;
};

/**
 * Find card by ID
 */
export const findCardById = (
  boards: Board[],
  cardId: string
): { board: Board; list: List; card: Card } | null => {
  for (const board of boards) {
    for (const list of board.lists) {
      const card = list.cards.find((card) => card.id === cardId);
      if (card) {
        return { board, list, card };
      }
    }
  }
  return null;
};

/**
 * Update board in boards array
 */
export const updateBoardInBoards = (
  boards: Board[],
  updatedBoard: Board
): Board[] => {
  return boards.map((board) =>
    board.id === updatedBoard.id ? updatedBoard : board
  );
};

/**
 * Update list in boards array
 */
export const updateListInBoards = (
  boards: Board[],
  updatedList: List
): Board[] => {
  return boards.map((board) => ({
    ...board,
    lists: board.lists.map((list) =>
      list.id === updatedList.id ? updatedList : list
    ),
  }));
};

/**
 * Update card in boards array
 */
export const updateCardInBoards = (
  boards: Board[],
  updatedCard: Card
): Board[] => {
  return boards.map((board) => ({
    ...board,
    lists: board.lists.map((list) => ({
      ...list,
      cards: list.cards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      ),
    })),
  }));
};

/**
 * Remove board from boards array
 */
export const removeBoardFromBoards = (
  boards: Board[],
  boardId: string
): Board[] => {
  return boards.filter((board) => board.id !== boardId);
};

/**
 * Remove list from boards array
 */
export const removeListFromBoards = (
  boards: Board[],
  listId: string
): Board[] => {
  return boards.map((board) => ({
    ...board,
    lists: board.lists.filter((list) => list.id !== listId),
  }));
};

/**
 * Remove card from boards array
 */
export const removeCardFromBoards = (
  boards: Board[],
  cardId: string
): Board[] => {
  return boards.map((board) => ({
    ...board,
    lists: board.lists.map((list) => ({
      ...list,
      cards: list.cards.filter((card) => card.id !== cardId),
    })),
  }));
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * Format relative time
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Generate random color
 */
export const generateRandomColor = (): string => {
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
};
