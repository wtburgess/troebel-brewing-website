"use client";

import { useCartStore } from "@/store/cart";

interface FloatingCartBarProps {
  onCheckout: () => void;
  className?: string;
}

export default function FloatingCartBar({ onCheckout, className }: FloatingCartBarProps) {
  const items = useCartStore((state) => state.items);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (items.length === 0) return null;

  return (
    <div className={`fc-bar${className ? ` ${className}` : ""}`}>
      <div className="fc-bar-info">
        <span className="fc-bar-count">{totalItems}</span>
        <div>
          <span className="fc-bar-label">Je winkelmand</span>
          <span className="fc-bar-sub">Totaal € {totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <button type="button" onClick={onCheckout} className="fc-bar-go">
        Afrekenen →
      </button>
    </div>
  );
}
