"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { clsx } from "clsx";
import { Card as CardType } from "@/types";
import { Modal } from "./Modal";

interface CardProps {
  card: CardType;
  onUpdate: (
    id: string,
    updates: Partial<Pick<CardType, "title" | "description">>
  ) => void;
  onDelete: (id: string) => void;
  onOpenModal: (card: CardType) => void;
  isDragging?: boolean;
}

export const Card: React.FC<CardProps> = ({
  card,
  onUpdate,
  onDelete,
  onOpenModal,
  isDragging = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleSave = (newTitle: string) => {
    if (newTitle !== card.title) {
      onUpdate(card.id, { title: newTitle });
    }
  };

  const handleCardClick = () => {
    onOpenModal(card);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(card.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={clsx("card", {
          dragging: isSortableDragging || isDragging,
          hovered: isHovered,
        })}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        {...attributes}
        {...listeners}
      >
        <div className="card-content">
          <p className="card-title">{card.title}</p>
          {card.description && (
            <p className="card-description">{card.description}</p>
          )}
        </div>

        {isHovered && (
          <div className="card-actions">
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={handleDeleteClick}
              title="Delete card"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Card"
        size="sm"
      >
        <div className="drawer-body">
          <p>
            All actions will be removed from the activity feed and you won’t be
            able to re-open the card. There is no undo.
          </p>
        </div>
        <div className="drawer-footer">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDeleteConfirm}
            style={{ background: "#dc2626", borderColor: "#dc2626" }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
};
