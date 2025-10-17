"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { Board } from "@/components/Board";
import {
  createList,
  updateList,
  deleteList,
  moveList,
  updateCard,
  deleteCard,
  moveCard,
  createCard,
  updateBoard,
  deleteBoard,
  setCurrentBoard,
} from "@/store/slices/boardsSlice";

function darken(hex: string, amount = 0.18) {
  const v = hex.replace("#", "");
  const r = Math.max(
    0,
    Math.min(255, Math.floor(parseInt(v.substring(0, 2), 16) * (1 - amount)))
  );
  const g = Math.max(
    0,
    Math.min(255, Math.floor(parseInt(v.substring(2, 4), 16) * (1 - amount)))
  );
  const b = Math.max(
    0,
    Math.min(255, Math.floor(parseInt(v.substring(4, 6), 16) * (1 - amount)))
  );
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function BoardDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((s) => s.boards);
  const board = boards.find((b) => b.id === id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (id) dispatch(setCurrentBoard(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (mounted && !board && boards.length > 0) {
      router.replace("/boards");
    }
  }, [mounted, board, boards.length, router]);

  useEffect(() => {
    if (!board?.color) return;
    const root = document.documentElement;
    const header = darken(board.color, 0.25);
    root.style.setProperty("--board-bg", board.color);
    root.style.setProperty("--board-header", header);
    return () => {
      root.style.removeProperty("--board-bg");
      root.style.removeProperty("--board-header");
    };
  }, [board?.color]);

  const handleDeleteBoard = (boardId: string) => {
    dispatch(deleteBoard(boardId));
    router.push("/boards");
  };

  if (!mounted) return null;
  if (!board) return null;

  return (
    <Board
      board={board}
      onUpdateBoard={(id, title) => dispatch(updateBoard({ id, title }))}
      onDeleteBoard={handleDeleteBoard}
      onUpdateList={(id, title) => dispatch(updateList({ id, title }))}
      onDeleteList={(id) => dispatch(deleteList(id))}
      onMoveList={(listId, newPosition) =>
        dispatch(moveList({ listId, newPosition }))
      }
      onUpdateCard={(id, updates) => dispatch(updateCard({ id, updates }))}
      onDeleteCard={(id) => dispatch(deleteCard(id))}
      onMoveCard={(cardId, sourceListId, destinationListId, newPosition) =>
        dispatch(
          moveCard({ cardId, sourceListId, destinationListId, newPosition })
        )
      }
      onAddList={(boardId, title) => dispatch(createList({ boardId, title }))}
      onAddCard={(listId, title) => dispatch(createCard({ listId, title }))}
    />
  );
}
