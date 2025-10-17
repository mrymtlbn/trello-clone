"use client";

import React, { useState, useEffect } from "react";
import { Card as CardType } from "@/types";
import { Modal } from "./Modal";

interface CardModalProps {
  card: CardType | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    id: string,
    updates: Partial<Pick<CardType, "title" | "description">>
  ) => void;
  onDelete: (id: string) => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  card,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || "");
      setHasChanges(false);
    }
  }, [card]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (card && hasChanges) {
      onUpdate(card.id, {
        title: title.trim() || "Untitled Card",
        description: description.trim(),
      });
    }
    onClose();
  };

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!card) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Card Details" size="md">
        <div className="card-modal-content">
          <div className="form-group">
            <label htmlFor="card-title" className="form-label">
              Title
            </label>
            <input
              id="card-title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              onKeyDown={handleKeyDown}
              className="input"
              placeholder="Card title"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="card-description" className="form-label">
              Description
            </label>
            <textarea
              id="card-description"
              value={description}
              onChange={handleDescriptionChange}
              onKeyDown={handleKeyDown}
              className="textarea"
              placeholder="Add a description..."
              rows={6}
            />
          </div>

          <div className="card-meta">
            <div className="meta-item">
              <span className="meta-label">Created:</span>
              <span className="meta-value">
                {new Date(card.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Last updated:</span>
              <span className="meta-value">
                {new Date(card.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete Card
          </button>
          <div className="footer-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      {card && (
        <Modal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="Delete Card"
          size="sm"
        >
          <div className="confirm-modal-body">
            <p>Are you sure you want to delete this card?</p>
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
              className="btn btn-primary"
              onClick={() => {
                if (!card) return;
                onDelete(card.id);
                setIsConfirmOpen(false);
                onClose();
              }}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};
