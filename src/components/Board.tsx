"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { clsx } from "clsx";
import {
  Board as BoardType,
  List as ListType,
  Card as CardType,
  DragItem,
} from "@/types";
import { List } from "./List";
import { Card } from "./Card";
import { CardModal } from "./CardModal";
import { InlineEditor } from "./InlineEditor";
import { Modal } from "./Modal";

interface BoardProps {
  board: BoardType;
  onUpdateBoard: (id: string, title: string) => void;
  onDeleteBoard: (id: string) => void;
  onUpdateList: (id: string, title: string) => void;
  onDeleteList: (id: string) => void;
  onMoveList: (listId: string, newPosition: number) => void;
  onUpdateCard: (
    id: string,
    updates: Partial<Pick<CardType, "title" | "description">>
  ) => void;
  onDeleteCard: (id: string) => void;
  onMoveCard: (
    cardId: string,
    sourceListId: string,
    destinationListId: string,
    newPosition: number
  ) => void;
  onAddList: (boardId: string, title: string) => void;
  onAddCard: (listId: string, title: string) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onUpdateBoard,
  onDeleteBoard,
  onUpdateList,
  onDeleteList,
  onMoveList,
  onUpdateCard,
  onDeleteCard,
  onMoveCard,
  onAddList,
  onAddCard,
}) => {
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleTitleSave = (newTitle: string) => {
    if (newTitle !== board.title) {
      onUpdateBoard(board.id, newTitle);
    }
  };

  const handleAddList = () => {
    if (newListTitle.trim()) {
      onAddList(board.id, newListTitle.trim());
      setNewListTitle("");
    }
    setIsAddingList(false);
  };

  const handleCancelAddList = () => {
    setNewListTitle("");
    setIsAddingList(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddList();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelAddList();
    }
  };

  const handleDeleteBoard = () => {
    setIsConfirmOpen(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as any;

    if (data?.type === "card") {
      setActiveDragItem({
        type: "card",
        id: String(active.id),
        sourceListId: data.card.listId,
        sourceIndex: 0,
      });
    } else if (data?.type === "list") {
      setActiveDragItem({
        type: "list",
        id: String(active.id),
        sourceIndex: 0,
      });
    }
  };

  const findCardLocation = (
    cardId: string
  ): { listId: string; index: number } | null => {
    for (const list of board.lists) {
      const idx = list.cards.findIndex((c) => c.id === cardId);
      if (idx !== -1) return { listId: list.id, index: idx };
    }
    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveDragItem(null);
      return;
    }

    const activeData = active.data.current as any;
    const overData = over.data.current as any;

    if (activeData?.type === "list" && overData?.type === "list") {
      const destListIndex = board.lists.findIndex(
        (l) => l.id === String(over.id)
      );
      if (destListIndex !== -1) onMoveList(String(active.id), destListIndex);
    } else if (activeData?.type === "card") {
      // Resolve source from current state (robust)
      const sourceLoc = findCardLocation(String(active.id));
      if (!sourceLoc) {
        setActiveDragItem(null);
        return;
      }
      let destinationListId = sourceLoc.listId;
      let destinationIndex = sourceLoc.index;

      if (overData?.type === "card") {
        const overLoc = findCardLocation(String(over.id));
        if (overLoc) {
          destinationListId = overLoc.listId;
          destinationIndex = overLoc.index;
        }
      } else if (overData?.type === "list") {
        destinationListId = overData.list.id;
        const destList = board.lists.find((l) => l.id === destinationListId);
        destinationIndex = destList ? destList.cards.length : 0;
      }

      if (
        destinationListId === sourceLoc.listId &&
        destinationIndex === sourceLoc.index
      ) {
        setActiveDragItem(null);
        return;
      }
      // Adjust index when moving within same list and dropping after original index
      if (
        destinationListId === sourceLoc.listId &&
        destinationIndex > sourceLoc.index
      ) {
        destinationIndex = destinationIndex - 1;
      }
      onMoveCard(
        String(active.id),
        sourceLoc.listId,
        destinationListId,
        destinationIndex
      );
    }

    setActiveDragItem(null);
  };

  const handleOpenCardModal = (card: CardType) => {
    setSelectedCard(card);
  };

  const handleCloseCardModal = () => {
    setSelectedCard(null);
  };

  const sortedLists = [...board.lists].sort((a, b) => a.position - b.position);

  return (
    <>
      <div className="board">
        <div className="board-header">
          <InlineEditor
            value={board.title}
            onSave={handleTitleSave}
            placeholder="Board title"
            className="board-title"
            multiline={false}
          />
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleDeleteBoard}
            title="Delete board"
          >
            🗑️
          </button>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="lists-container">
            <SortableContext
              items={sortedLists.map((list) => list.id)}
              strategy={horizontalListSortingStrategy}
            >
              {sortedLists.map((list) => (
                <List
                  key={list.id}
                  list={list}
                  onUpdateList={onUpdateList}
                  onDeleteList={onDeleteList}
                  onUpdateCard={onUpdateCard}
                  onDeleteCard={onDeleteCard}
                  onOpenCardModal={handleOpenCardModal}
                  onAddCard={onAddCard}
                />
              ))}
            </SortableContext>

            {isAddingList ? (
              <div className="add-list-form">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input"
                  placeholder="Enter list title..."
                  autoFocus
                />
                <div className="add-list-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddList}
                    disabled={!newListTitle.trim()}
                  >
                    Add List
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleCancelAddList}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="add-list-button"
                onClick={() => setIsAddingList(true)}
              >
                + Add a list
              </button>
            )}
          </div>

          <DragOverlay>
            {activeDragItem?.type === "card" && (
              <Card
                card={activeDragItem as any}
                onUpdate={() => {}}
                onDelete={() => {}}
                onOpenModal={() => {}}
                isDragging={true}
              />
            )}
            {activeDragItem?.type === "list" && (
              <List
                list={activeDragItem as any}
                onUpdateList={() => {}}
                onDeleteList={() => {}}
                onUpdateCard={() => {}}
                onDeleteCard={() => {}}
                onOpenCardModal={() => {}}
                onAddCard={() => {}}
                isDragging={true}
              />
            )}
          </DragOverlay>
        </DndContext>

        <CardModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={handleCloseCardModal}
          onUpdate={onUpdateCard}
          onDelete={onDeleteCard}
        />
      </div>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Delete Board"
        size="sm"
      >
        <div className="confirm-modal-body">
          <p>Are you sure you want to delete the board "{board.title}"?</p>
        </div>
        <div className="drawer-footer">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setIsConfirmOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              onDeleteBoard(board.id);
              setIsConfirmOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
};
