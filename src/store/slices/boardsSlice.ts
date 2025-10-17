import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, Card, List, StorageData } from "@/types";
import { nanoid } from "nanoid";
import {
  initializeStorage,
  saveStorageData,
  setCurrentBoardId,
} from "@/utils/storage";
import {
  getNextPosition,
  reorderItems,
  moveItemBetweenLists,
  findBoardById,
  findListById,
  findCardById,
  updateBoardInBoards,
} from "@/utils/helpers";

export interface BoardsState {
  boards: Board[];
  currentBoardId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialData = initializeStorage();

const initialState: BoardsState = {
  boards: initialData.boards,
  currentBoardId: initialData.currentBoardId,
  isLoading: false,
  error: null,
};

const persist = (state: BoardsState) => {
  saveStorageData({
    boards: state.boards,
    currentBoardId: state.currentBoardId,
    lastUpdated: new Date().toISOString(),
  });
  if (state.currentBoardId) setCurrentBoardId(state.currentBoardId);
};

const DEFAULT_COLORS = [
  "#CD5A91",
  "#89609D",
  "#D29034",
  "#00603d",
  "#2E7EAF",
] as const;

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    createBoard: (
      state,
      action: PayloadAction<{ title: string; color?: string }>
    ) => {
      const color =
        action.payload.color && action.payload.color.trim()
          ? action.payload.color
          : DEFAULT_COLORS[4];
      const board: Board = {
        id: nanoid(),
        title: action.payload.title.trim() || "Untitled Board",
        createdAt: new Date(),
        updatedAt: new Date(),
        lists: [],
        color,
      };
      state.boards.push(board);
      state.currentBoardId = board.id;
      persist(state);
    },
    updateBoard: (
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      const board = findBoardById(state.boards, action.payload.id);
      if (!board) return;
      board.title = action.payload.title.trim() || "Untitled Board";
      board.updatedAt = new Date();
      persist(state);
    },
    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter((b) => b.id !== action.payload);
      if (state.currentBoardId === action.payload) {
        state.currentBoardId = state.boards[0]?.id || null;
      }
      persist(state);
    },
    setCurrentBoard: (state, action: PayloadAction<string>) => {
      state.currentBoardId = action.payload;
      persist(state);
    },

    createList: (
      state,
      action: PayloadAction<{ boardId: string; title: string }>
    ) => {
      const board = findBoardById(state.boards, action.payload.boardId);
      if (!board) return;
      const list: List = {
        id: nanoid(),
        title: action.payload.title.trim() || "Untitled List",
        boardId: board.id,
        position: getNextPosition(board.lists),
        createdAt: new Date(),
        updatedAt: new Date(),
        cards: [],
      };
      board.lists.push(list);
      board.updatedAt = new Date();
      persist(state);
    },
    updateList: (
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      const result = findListById(state.boards, action.payload.id);
      if (!result) return;
      const { board, list } = result;
      list.title = action.payload.title.trim() || "Untitled List";
      list.updatedAt = new Date();
      board.updatedAt = new Date();
      persist(state);
    },
    deleteList: (state, action: PayloadAction<string>) => {
      const result = findListById(state.boards, action.payload);
      if (!result) return;
      const { board } = result;
      board.lists = board.lists.filter((l) => l.id !== action.payload);
      board.updatedAt = new Date();
      persist(state);
    },
    moveList: (
      state,
      action: PayloadAction<{ listId: string; newPosition: number }>
    ) => {
      const result = findListById(state.boards, action.payload.listId);
      if (!result) return;
      const { board } = result;
      const from = board.lists.findIndex((l) => l.id === action.payload.listId);
      if (from === -1) return;
      board.lists = reorderItems(board.lists, from, action.payload.newPosition);
      board.updatedAt = new Date();
      persist(state);
    },

    createCard: (
      state,
      action: PayloadAction<{
        listId: string;
        title: string;
        description?: string;
      }>
    ) => {
      const result = findListById(state.boards, action.payload.listId);
      if (!result) return;
      const { board, list } = result;
      const card: Card = {
        id: nanoid(),
        title: action.payload.title.trim() || "Untitled Card",
        description: action.payload.description?.trim() || "",
        listId: list.id,
        position: getNextPosition(list.cards),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      list.cards.push(card);
      list.updatedAt = new Date();
      board.updatedAt = new Date();
      persist(state);
    },
    updateCard: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Pick<Card, "title" | "description">>;
      }>
    ) => {
      const result = findCardById(state.boards, action.payload.id);
      if (!result) return;
      const { board, list, card } = result;
      Object.assign(card, action.payload.updates);
      card.updatedAt = new Date();
      list.updatedAt = new Date();
      board.updatedAt = new Date();
      persist(state);
    },
    deleteCard: (state, action: PayloadAction<string>) => {
      const result = findCardById(state.boards, action.payload);
      if (!result) return;
      const { board, list } = result;
      list.cards = list.cards.filter((c) => c.id !== action.payload);
      list.updatedAt = new Date();
      board.updatedAt = new Date();
      persist(state);
    },
    moveCard: (
      state,
      action: PayloadAction<{
        cardId: string;
        sourceListId: string;
        destinationListId: string;
        newPosition: number;
      }>
    ) => {
      const sourceResult = findListById(
        state.boards,
        action.payload.sourceListId
      );
      const destResult = findListById(
        state.boards,
        action.payload.destinationListId
      );
      if (!sourceResult || !destResult) return;

      const { board: sourceBoard, list: sourceList } = sourceResult;
      const { board: destBoard, list: destList } = destResult;

      const fromIndex = sourceList.cards.findIndex(
        (c) => c.id === action.payload.cardId
      );
      if (fromIndex === -1) return;

      if (action.payload.sourceListId === action.payload.destinationListId) {
        // Same-list reorder
        sourceList.cards = reorderItems(
          sourceList.cards,
          fromIndex,
          action.payload.newPosition
        );
        sourceList.updatedAt = new Date();
        sourceBoard.updatedAt = new Date();
        persist(state);
        return;
      }

      // Cross-list move
      const { sourceList: newSource, destinationList: newDest } =
        moveItemBetweenLists(
          sourceList.cards,
          destList.cards,
          fromIndex,
          action.payload.newPosition,
          action.payload.cardId
        );

      sourceList.cards = newSource;
      destList.cards = newDest.map((c) =>
        c.id === action.payload.cardId
          ? { ...c, listId: destList.id, updatedAt: new Date() }
          : c
      );

      sourceList.updatedAt = new Date();
      destList.updatedAt = new Date();
      sourceBoard.updatedAt = new Date();
      destBoard.updatedAt = new Date();
      persist(state);
    },
  },
});

export const {
  createBoard,
  updateBoard,
  deleteBoard,
  setCurrentBoard,
  createList,
  updateList,
  deleteList,
  moveList,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
} = boardsSlice.actions;

export default boardsSlice.reducer;
