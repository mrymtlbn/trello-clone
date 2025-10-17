"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-left">
          {pathname !== "/boards" && (
            <Link href="/boards" className="site-nav-link" aria-label="Boards">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="columns"
                className="site-nav-icon"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64V160h160v256zm224 0H288V160h160v256z"
                ></path>
              </svg>
              Boards
            </Link>
          )}
        </div>
        <div className="site-header-center">
          <div className="site-logo" aria-label="Trello Clone">
            <img src="/logo.svg" alt="Logo" />
          </div>
        </div>
        <div className="site-header-right" />
      </div>
    </header>
  );
}
