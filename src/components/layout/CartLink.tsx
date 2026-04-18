"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";

export default function CartLink() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? totalItems : 0;

  return (
    <Link
      href="/webshop"
      className="btn"
      style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: ".45rem" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        aria-hidden="true"
      >
        <path d="M3 4h2.2l2 12.5a2 2 0 0 0 2 1.7h8.6a2 2 0 0 0 2-1.6L21.5 8H6.2" />
        <circle cx="10" cy="21" r="1.2" />
        <circle cx="18" cy="21" r="1.2" />
      </svg>
      <span>Bestellen</span>
      {mounted && count > 0 && (
        <span
          aria-label={`${count} in winkelmand`}
          className="fc-bar-count"
          style={{
            position: "absolute",
            top: "-.55rem",
            right: "-.55rem",
            width: "1.4rem",
            height: "1.4rem",
            fontSize: ".8rem",
            border: "2px solid var(--dark)",
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
