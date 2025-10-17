"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { createBoard, setCurrentBoard } from "@/store/slices/boardsSlice";

const COLORS = ["#CD5A91", "#89609D", "#D29034", "#00603d", "#2E7EAF"] as const;

export default function BoardsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const boards = useAppSelector((s) => s.boards.boards);
  const currentBoardId = useAppSelector((s) => s.boards.currentBoardId);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState<string>(COLORS[4]);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("is-boards-page");
    return () => {
      document.documentElement.classList.remove("is-boards-page");
    };
  }, []);

  useEffect(() => {
    if (!isCreating) return;
    const onClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsCreating(false);
        setTitle("");
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isCreating]);

  useEffect(() => {
    if (shouldNavigate && currentBoardId) {
      router.push(`/boards/${currentBoardId}`);
      setShouldNavigate(false);
    }
  }, [shouldNavigate, currentBoardId, router]);

  const handleCreate = () => {
    if (!title.trim()) return;
    dispatch(createBoard({ title: title.trim(), color }));
    setTitle("");
    setIsCreating(false);
    setShouldNavigate(true);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsCreating(false);
      setTitle("");
    }
  };

  if (!mounted) return null;

  return (
    <div className="board-selector">
      <h1>My Boards</h1>
      <div className="boards-grid">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/boards/${board.id}`}
            className="board-card"
            style={{ background: board.color || COLORS[4], color: "#fff" }}
            onClick={() => dispatch(setCurrentBoard(board.id))}
          >
            <h3>{board.title}</h3>
          </Link>
        ))}

        {isCreating ? (
          <div ref={formRef} className="board-card add-board-card">
            <input
              type="text"
              className="input"
              placeholder="Enter board title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div
              className="color-picker"
              style={{ marginTop: 8, display: "flex", gap: 8 }}
            >
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="color-dot"
                  onClick={() => setColor(c)}
                  aria-label={`Pick ${c}`}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 9999,
                    border:
                      color === c
                        ? "2px solid #fff"
                        : "2px solid rgba(0,0,0,0.1)",
                    background: c,
                    boxShadow:
                      color === c
                        ? "0 0 0 2px rgba(46,126,175,0.4)"
                        : undefined,
                  }}
                />
              ))}
            </div>
            <div className="add-list-actions" style={{ marginTop: 12 }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={!title.trim()}
              >
                Create
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setIsCreating(false);
                  setTitle("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="board-card add-board-card"
            onClick={() => setIsCreating(true)}
          >
            <h3>Create New Board...</h3>
          </button>
        )}
      </div>
    </div>
  );
}
