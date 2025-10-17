"use client";

import React, { useEffect } from "react";
import { clsx } from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={clsx("drawer", { open: isOpen })}
      onClick={handleOverlayClick}
    >
      <div className="drawer-backdrop" />
      <div
        className={clsx("drawer-content", `modal-${size}`, className)}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="drawer-header">
            <h2 className="modal-title">{title}</h2>
            <button
              type="button"
              className="drawer-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div className="drawer-body">{children}</div>
      </div>
    </div>
  );
};
