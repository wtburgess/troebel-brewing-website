"use client";

import { useState } from "react";
import Image from "next/image";
import { Beer, BeerVariant } from "@/types/beer";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";

interface ShopCardProps {
  beer: Beer;
}

function getAvailabilityStatus(variant: BeerVariant): { label: string; textColor: string } {
  if (!variant.isAvailable) {
    return { label: "Uitverkocht", textColor: "text-red-500" };
  }
  return { label: "Beschikbaar", textColor: "text-green-600" };
}

export default function ShopCard({ beer }: ShopCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const availableVariants = beer.variants
    .filter((v) => v.isAvailable)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    availableVariants[0]?.id || beer.variants[0]?.id || ""
  );
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = beer.variants.find((v) => v.id === selectedVariantId);
  const availabilityStatus = selectedVariant ? getAvailabilityStatus(selectedVariant) : null;
  const isOutOfStock = !selectedVariant || !selectedVariant.isAvailable;
  const allSoldOut = beer.variants.length > 0 && beer.variants.every(v => !v.isAvailable);

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariant.isAvailable) return;
    setIsAdding(true);
    addItem(beer, selectedVariant, 1);
    addToast({ type: "success", message: `${beer.name} - ${selectedVariant.label} toegevoegd!` });
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary flex flex-col h-full group">
      {/* Image */}
      <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden flex items-center justify-center p-6">
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {beer.isNew && (
            <span className="text-[0.65rem] font-bold uppercase tracking-wider px-2 py-1 bg-primary text-dark">Nieuw</span>
          )}
          {beer.isLimited && (
            <span className="text-[0.65rem] font-bold uppercase tracking-wider px-2 py-1 bg-orange-100 text-orange-800">Seizoen</span>
          )}
        </div>
        <div className="relative w-full h-full">
          <Image
            src={beer.image}
            alt={beer.name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
            sizes="(max-width: 550px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
        </div>
        {allSoldOut && <div className="sold-out-banner" />}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-center mb-3">
          <p className="text-[0.7rem] uppercase tracking-[0.15em] text-gray-500 mb-1">{beer.style}</p>
          <h3 className="font-heading text-xl text-dark mb-1">{beer.name}</h3>
          <p className="text-sm text-gray-400">{beer.abv}% ABV</p>
        </div>

        <div className="bg-gray-100 p-3 rounded-sm mt-auto">
          <div className="relative mb-3">
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full py-2.5 px-3 pr-8 font-body text-sm border border-gray-200 rounded-sm bg-white appearance-none cursor-pointer focus:outline-none focus:border-primary"
            >
              {beer.variants.map((variant) => (
                <option key={variant.id} value={variant.id} disabled={!variant.isAvailable}>
                  {variant.label}{!variant.isAvailable ? " (Uitverkocht)" : ""}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[0.7rem] pointer-events-none">▼</span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <span className="font-heading font-bold text-lg text-dark">€ {selectedVariant?.price.toFixed(2) || "—"}</span>
            {availabilityStatus && (
              <span className={`text-xs font-body flex items-center gap-1 ${availabilityStatus.textColor}`}>
                ● {availabilityStatus.label}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
              isAdding
                ? "bg-green-600 border-green-600 text-white"
                : isOutOfStock
                ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-dark border border-dark text-white hover:bg-primary hover:border-primary hover:text-dark"
            }`}
          >
            {isAdding ? "✓ Toegevoegd" : isOutOfStock ? "Uitverkocht" : "+ In Winkelmand"}
          </button>
        </div>
      </div>
    </div>
  );
}
