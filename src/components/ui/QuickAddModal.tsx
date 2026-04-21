"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useModalStore } from "@/store/modal";
import { useToastStore } from "@/store/toast";
import { useCartStore } from "@/store/cart";
import { BeerVariant } from "@/types/beer";

export default function QuickAddModal() {
  const { isOpen, beer, closeModal } = useModalStore();
  const addToast = useToastStore((state) => state.addToast);
  const addItem = useCartStore((state) => state.addItem);

  const availableVariants = useMemo(
    () => beer?.variants.filter((v) => v.isAvailable) || [],
    [beer?.variants]
  );

  const soldOut = availableVariants.length === 0 && (beer?.variants.length ?? 0) > 0;

  const [selectedVariant, setSelectedVariant] = useState<BeerVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen && beer) {
      setSelectedVariant(availableVariants[0] || null);
      setQuantity(1);
      setIsClosing(false);
    }
  }, [isOpen, beer, availableVariants]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeModal();
      setIsClosing(false);
    }, 250);
  };

  const handleAdd = () => {
    if (beer && selectedVariant) {
      addItem(beer, selectedVariant, quantity);
      addToast({
        type: "success",
        message: `${beer.name} - ${selectedVariant.label} toegevoegd!`,
        action: { label: "Bekijk mand", href: "/webshop" },
      });
      handleClose();
    }
  };

  if (!isOpen || !beer) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-200 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Desktop Modal */}
      <div
        className={`hidden md:flex fixed inset-0 z-50 items-center justify-center p-4 pointer-events-none ${
          isClosing ? "opacity-0" : "opacity-100"
        } transition-opacity duration-200`}
      >
        <div
          className="bg-white max-w-[700px] w-full max-h-[90vh] overflow-y-auto border-4 border-dark relative pointer-events-auto"
          style={{ boxShadow: "8px 8px 0px var(--color-yellow)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-10 h-10 bg-dark text-white font-heading text-xl hover:bg-yellow hover:text-dark transition-colors flex items-center justify-center z-10"
          >
            ×
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="bg-gray-100 p-8 flex items-center justify-center">
              <div className="relative w-48 h-64">
                <Image src={beer.image} alt={beer.name} fill className="object-contain" sizes="200px" />
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <span className="font-body text-sm text-yellow uppercase tracking-wider">{beer.style}</span>
              <h2 className="text-3xl text-dark mb-2">{beer.name}</h2>
              <p className="font-body text-gray-600 italic mb-4">&quot;{beer.description}&quot;</p>

              <div className="flex gap-6 mb-4 pb-4 border-b border-gray-200">
                <div className="text-center">
                  <span className="font-heading text-xl text-dark block">{beer.abv}%</span>
                  <span className="font-body text-xs text-gray-500 uppercase">ABV</span>
                </div>
                {beer.ibu && (
                  <div className="text-center">
                    <span className="font-heading text-xl text-dark block">{beer.ibu}</span>
                    <span className="font-body text-xs text-gray-500 uppercase">IBU</span>
                  </div>
                )}
              </div>

              {soldOut ? (
                <div className="sold-out-modal-banner">UITVERKOCHT — kom snel terug</div>
              ) : (
                <>
                  {availableVariants.length > 1 && (
                    <div className="mb-4">
                      <label className="block font-heading text-sm text-dark mb-2">Kies formaat</label>
                      <select
                        value={selectedVariant?.id || ""}
                        onChange={(e) => {
                          const variant = availableVariants.find((v) => v.id === e.target.value);
                          if (variant) setSelectedVariant(variant);
                        }}
                        className="w-full px-3 py-2 border-2 border-dark font-body focus:outline-none focus:border-yellow hover:border-yellow transition-colors"
                      >
                        {availableVariants.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.label} - €{variant.price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="mb-4">
                    <span className="font-heading text-3xl text-dark">€{selectedVariant?.price.toFixed(2) || "-"}</span>
                    {availableVariants.length === 1 && selectedVariant && (
                      <span className="font-body text-sm text-gray-500 ml-2">/ {selectedVariant.label}</span>
                    )}
                  </div>

                  {selectedVariant && (
                    <div className="flex gap-3 mb-4">
                      <div className="flex items-center border-2 border-dark">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 font-heading text-xl hover:bg-dark hover:text-yellow transition-colors">−</button>
                        <span className="w-12 text-center font-heading text-lg">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 font-heading text-xl hover:bg-dark hover:text-yellow transition-colors">+</button>
                      </div>
                      <button
                        onClick={handleAdd}
                        className="flex-1 bg-yellow text-dark font-heading py-3 px-6 border-2 border-dark hover:bg-dark hover:text-yellow transition-all quickadd-cta"
                        style={{ transform: "skew(-4deg)", boxShadow: "3px 3px 0px var(--color-dark)" }}
                      >
                        IN WINKELMAND
                      </button>
                    </div>
                  )}
                </>
              )}

              {beer.tastingNotes && beer.tastingNotes.length > 0 && (
                <div className="mb-3">
                  <span className="font-heading text-sm text-dark">Smaaknoten:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {beer.tastingNotes.map((note) => (
                      <span key={note} className="px-2 py-1 bg-cream text-dark text-xs font-body border border-dark">{note}</span>
                    ))}
                  </div>
                </div>
              )}

              {beer.longDescription && (
                <p className="font-body text-sm text-gray-600 leading-relaxed">{beer.longDescription}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div className={`md:hidden fixed inset-x-0 bottom-0 z-50 ${isClosing ? "bottom-sheet-exit" : "bottom-sheet-enter"}`}>
        <div
          className="bg-white max-h-[85vh] border-t-4 border-dark rounded-t-xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
            <div className="w-10" />
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
            <button onClick={handleClose} className="w-10 h-10 bg-gray-100 text-dark font-heading text-xl hover:bg-gray-200 transition-colors flex items-center justify-center rounded-full" aria-label="Sluiten">×</button>
          </div>

          <div className="overflow-y-auto px-4 pb-4" style={{ maxHeight: 'calc(85vh - 200px)' }}>
            <div className="flex gap-4 mb-4">
              <div className="relative w-24 h-32 bg-gray-100 flex-shrink-0">
                <Image src={beer.image} alt={beer.name} fill className="object-contain" sizes="96px" />
              </div>
              <div className="flex-1">
                <span className="font-body text-xs text-yellow uppercase tracking-wider">{beer.style}</span>
                <h2 className="text-2xl text-dark leading-tight mb-1">{beer.name}</h2>
                <div className="flex gap-4 text-sm">
                  <span className="font-heading text-dark">{beer.abv}% ABV</span>
                  {beer.ibu && <span className="font-heading text-dark">{beer.ibu} IBU</span>}
                </div>
              </div>
            </div>

            <p className="font-body text-gray-600 italic text-sm mb-4">&quot;{beer.description}&quot;</p>

            {soldOut && (
              <div className="sold-out-modal-banner">UITVERKOCHT — kom snel terug</div>
            )}

            {!soldOut && availableVariants.length > 1 && (
              <div className="mb-4">
                <label className="block font-heading text-sm text-dark mb-2">Kies formaat</label>
                <select
                  value={selectedVariant?.id || ""}
                  onChange={(e) => {
                    const variant = availableVariants.find((v) => v.id === e.target.value);
                    if (variant) setSelectedVariant(variant);
                  }}
                  className="w-full px-3 py-3 border-2 border-dark font-body text-base focus:outline-none focus:border-yellow hover:border-yellow transition-colors"
                >
                  {availableVariants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.label} - €{variant.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {beer.tastingNotes && beer.tastingNotes.length > 0 && (
              <div className="mb-4">
                <span className="font-heading text-sm text-dark">Smaaknoten:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {beer.tastingNotes.map((note) => (
                    <span key={note} className="px-2 py-1 bg-cream text-dark text-xs font-body border border-dark">{note}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky footer */}
          <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200 safe-area-pb">
            {soldOut ? (
              <div className="sold-out-modal-banner" style={{ marginBottom: 0 }}>UITVERKOCHT — kom snel terug</div>
            ) : selectedVariant ? (
              <>
                <div className="mb-3 text-center">
                  <span className="font-heading text-3xl text-dark">€{selectedVariant.price.toFixed(2)}</span>
                  {availableVariants.length === 1 && (
                    <span className="font-body text-sm text-gray-500 ml-2">/ {selectedVariant.label}</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center border-2 border-dark">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 font-heading text-xl hover:bg-dark hover:text-yellow transition-colors">−</button>
                    <span className="w-10 text-center font-heading text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 font-heading text-xl hover:bg-dark hover:text-yellow transition-colors">+</button>
                  </div>
                  <button
                    onClick={handleAdd}
                    className="flex-1 bg-yellow text-dark font-heading py-3 px-6 border-2 border-dark hover:bg-dark hover:text-yellow transition-all text-lg quickadd-cta"
                    style={{ transform: "skew(-4deg)", boxShadow: "3px 3px 0px var(--color-dark)" }}
                  >
                    IN WINKELMAND
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
