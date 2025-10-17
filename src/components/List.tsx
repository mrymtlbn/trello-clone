"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { clsx } from "clsx";
import { List as ListType, Card as CardType } from "@/types";
import { Card } from "./Card";
import { InlineEditor } from "./InlineEditor";

interface ListProps {
  list: ListType;
  onUpdateList: (id: string, title: string) => void;
  onDeleteList: (id: string) => void;
  onUpdateCard: (
    id: string,
    updates: Partial<Pick<CardType, "title" | "description">>
  ) => void;
  onDeleteCard: (id: string) => void;
  onOpenCardModal: (card: CardType) => void;
  onAddCard: (listId: string, title: string) => void;
  isDragging?: boolean;
}

export const List: React.FC<ListProps> = ({
  list,
  onUpdateList,
  onDeleteList,
  onUpdateCard,
  onDeleteCard,
  onOpenCardModal,
  onAddCard,
  isDragging = false,
}) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  type MenuView = "root" | "confirmDeleteList" | "confirmDeleteAll";
  const [menuView, setMenuView] = useState<MenuView>("root");
  const menuRef = useRef<HTMLDivElement | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "list",
      list,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleSave = (newTitle: string) => {
    if (newTitle !== list.title) {
      onUpdateList(list.id, newTitle);
    }
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(list.id, newCardTitle.trim());
      setNewCardTitle("");
    }
    setIsAddingCard(false);
  };

  const handleCancelAdd = () => {
    setNewCardTitle("");
    setIsAddingCard(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCard();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelAdd();
    }
  };

  const handleDeleteList = () => {
    setMenuView("confirmDeleteList");
  };

  const handleDeleteAllCards = () => {
    setMenuView("confirmDeleteAll");
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setMenuView("root");
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setMenuView("root");
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  // Ensure menu opens on root view each time
  useEffect(() => {
    if (isMenuOpen) setMenuView("root");
  }, [isMenuOpen]);

  const cards = Array.isArray(list.cards) ? list.cards : [];
  const cardIds = cards.map((c) => c.id);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={clsx("list", {
          dragging: isSortableDragging || isDragging,
        })}
        {...attributes}
        {...listeners}
      >
        <div className="list-header">
          <InlineEditor
            value={list.title}
            onSave={handleTitleSave}
            placeholder="List title"
            className="list-title"
            multiline={false}
          />
          <div className="list-actions" ref={menuRef}>
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              title="List actions"
            >
              ⋯
            </button>
            {isMenuOpen && (
              <div className="menu" role="menu">
                {menuView === "root" && (
                  <>
                    <div className="menu-header">
                      <div className="menu-title">List Actions</div>
                      <button
                        type="button"
                        className="menu-close"
                        aria-label="Close"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setMenuView("root");
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div className="menu-body">
                      <button
                        type="button"
                        className="menu-item"
                        role="menuitem"
                        onClick={() => setMenuView("confirmDeleteList")}
                      >
                        Delete List
                      </button>
                      <button
                        type="button"
                        className="menu-item"
                        role="menuitem"
                        onClick={() => setMenuView("confirmDeleteAll")}
                      >
                        Delete All Cards
                      </button>
                    </div>
                  </>
                )}

                {menuView === "confirmDeleteList" && (
                  <>
                    <div className="menu-header">
                      <button
                        type="button"
                        className="menu-back"
                        aria-label="Back"
                        onClick={() => setMenuView("root")}
                      >
                        ←
                      </button>
                      <div className="menu-title">Delete List</div>
                      <button
                        type="button"
                        className="menu-close"
                        aria-label="Close"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setMenuView("root");
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div className="menu-body">
                      <p>
                        All actions will be removed from the activity feed and
                        you won’t be able to re-open the list. There is no undo.
                      </p>
                    </div>
                    <div className="menu-footer">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          onDeleteList(list.id);
                          setIsMenuOpen(false);
                          setMenuView("root");
                        }}
                      >
                        Delete list
                      </button>
                    </div>
                  </>
                )}

                {menuView === "confirmDeleteAll" && (
                  <>
                    <div className="menu-header">
                      <button
                        type="button"
                        className="menu-back"
                        aria-label="Back"
                        onClick={() => setMenuView("root")}
                      >
                        ←
                      </button>
                      <div className="menu-title">Delete All Cards</div>
                      <button
                        type="button"
                        className="menu-close"
                        aria-label="Close"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setMenuView("root");
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div className="menu-body">
                      <p>
                        This will remove all the cards in this list from the
                        board.
                      </p>
                    </div>
                    <div className="menu-footer">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          const cards = Array.isArray(list.cards)
                            ? list.cards
                            : [];
                          cards.forEach((c) => onDeleteCard(c.id));
                          setIsMenuOpen(false);
                          setMenuView("root");
                        }}
                      >
                        Delete all
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          <div className="cards-container">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onUpdate={onUpdateCard}
                onDelete={onDeleteCard}
                onOpenModal={onOpenCardModal}
              />
            ))}

            {isAddingCard ? (
              <div className="add-card-form">
                <textarea
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="textarea"
                  placeholder="Enter a title for this card..."
                  rows={3}
                  autoFocus
                  spellCheck={false}
                />
                <div className="add-card-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleAddCard}
                    disabled={!newCardTitle.trim()}
                  >
                    Add Card
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={handleCancelAdd}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="add-card-button"
                onClick={() => setIsAddingCard(true)}
              >
                + Add a card
              </button>
            )}
          </div>
        </SortableContext>
      </div>

      {/* in-popover confirmations handled above */}
    </>
  );
};
