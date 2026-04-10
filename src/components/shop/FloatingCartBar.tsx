"use client";

import { useCartStore } from "@/store/cart";

interface FloatingCartBarProps {
  onCheckout: () => void;
}

export default function FloatingCartBar({ onCheckout }: FloatingCartBarProps) {
  const items = useCartStore((state) => state.items);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 right-5 bg-dark text-white py-4 px-5 flex justify-between items-center shadow-xl border-2 border-primary z-50 lg:hidden transition-transform duration-300">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 bg-primary text-dark rounded-full flex items-center justify-center font-bold text-sm">
          {totalItems}
        </span>
        <div className="flex flex-col">
          <span className="font-bold text-sm">Je Winkelmand</span>
          <span className="text-xs opacity-80">
            Totaal: € {totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        className="flex items-center gap-2 font-semibold text-sm hover:text-primary transition-colors"
      >
        AFREKENEN <span className="text-primary font-bold text-lg">→</span>
      </button>
    </div>
  );
}
