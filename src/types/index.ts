// Core domain types for Trello clone

export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  createdAt: Date;
  updatedAt: Date;
  position: number;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lists: List[];
  color?: string;
}

// Drag and drop types
export interface DragItem {
  type: "card" | "list";
  id: string;
  sourceListId?: string; // For cards
  sourceIndex: number;
}

export interface DropResult {
  type: "card" | "list";
  id: string;
  destinationListId?: string; // For cards
  destinationIndex: number;
}

// Store types
export interface AppState {
  boards: Board[];
  currentBoardId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Action types
export interface BoardActions {
  createBoard: (payload: { title: string; color?: string }) => void;
  updateBoard: (id: string, title: string) => void;
  deleteBoard: (id: string) => void;
  setCurrentBoard: (id: string) => void;
}

export interface AppActions {
  initialize: () => void;
  clearError: () => void;
}

export interface ListActions {
  createList: (boardId: string, title: string) => void;
  updateList: (id: string, title: string) => void;
  deleteList: (id: string) => void;
  moveList: (listId: string, newPosition: number) => void;
}

export interface CardActions {
  createCard: (listId: string, title: string, description?: string) => void;
  updateCard: (
    id: string,
    updates: Partial<Pick<Card, "title" | "description">>
  ) => void;
  deleteCard: (id: string) => void;
  moveCard: (
    cardId: string,
    sourceListId: string,
    destinationListId: string,
    newPosition: number
  ) => void;
}

export type AppStore = AppState &
  AppActions &
  BoardActions &
  ListActions &
  CardActions;

// UI state types
export interface ModalState {
  isOpen: boolean;
  type: "card" | "board" | "list" | null;
  data: any;
}

export interface InlineEditState {
  isEditing: boolean;
  type: "card" | "list" | "board" | null;
  id: string | null;
  value: string;
}

// Form types
export interface CreateBoardForm {
  title: string;
  color?: string;
}

export interface CreateListForm {
  title: string;
}

export interface CreateCardForm {
  title: string;
  description?: string;
}

export interface UpdateCardForm {
  title: string;
  description: string;
}

// Utility types
export type SortOrder = "asc" | "desc";

export interface SortConfig {
  field: keyof Card | keyof List | keyof Board;
  order: SortOrder;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Storage types
export interface StorageData {
  boards: Board[];
  currentBoardId: string | null;
  lastUpdated: string;
}
