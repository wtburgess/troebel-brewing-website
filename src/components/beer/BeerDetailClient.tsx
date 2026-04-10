"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BeerCard from "@/components/beer/BeerCard";
import { Beer, BeerVariant, hasAvailableVariants } from "@/types/beer";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";

// Star icon component
const StarIcon = ({ className = "w-6 h-6 fill-primary" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// Share icons
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

type TabType = "description" | "tasting" | "pairing";

interface BeerDetailClientProps {
  beer: Beer;
  relatedBeers: Beer[];
}

export default function BeerDetailClient({ beer, relatedBeers }: BeerDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  // Get available variants
  const availableVariants = useMemo(() => {
    return beer.variants.filter((v) => v.isAvailable);
  }, [beer.variants]);

  // Default to first available variant
  const [selectedVariant, setSelectedVariant] = useState<BeerVariant | null>(
    availableVariants[0] || null
  );

  const isAvailable = hasAvailableVariants(beer);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link gekopieerd!");
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem(beer, selectedVariant, quantity);
      addToast({
        type: "success",
        message: `${beer.name} - ${selectedVariant.label} toegevoegd!`,
        action: { label: "Bekijk mand", href: "/bestellen" },
      });
    }
  };

  return (
    <>
      <Header />

      <main>
        {/* Product Section */}
        <section className="bg-gray-100 pt-24 pb-16">
          <div className="max-w-[1200px] mx-auto px-6">
            {/* Breadcrumb */}
            <nav className="py-4 text-sm text-gray-600">
              <Link href="/" className="hover:text-dark transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/bieren" className="hover:text-dark transition-colors">
                Bieren
              </Link>
              <span className="mx-2">/</span>
              <span className="text-dark">{beer.name}</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Product Gallery */}
              <div className="md:sticky md:top-24">
                <div className="bg-white p-8 lg:p-12 flex items-center justify-center aspect-square">
                  <div className="relative w-full h-full">
                    <Image
                      src={beer.image}
                      alt={beer.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="py-4">
                {/* Style */}
                <p className="text-sm font-semibold uppercase tracking-[2px] text-primary-dark mb-2">
                  {beer.style}
                </p>

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-2">
                  {beer.name}
                </h1>

                {/* Tagline */}
                <p className="text-lg text-gray-600 italic mb-6">
                  &ldquo;{beer.description}&rdquo;
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 py-4 border-t border-b border-gray-200 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-dark">{beer.abv}%</div>
                    <div className="text-xs uppercase text-gray-600">ABV</div>
                  </div>
                  {beer.ibu && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-dark">{beer.ibu}</div>
                      <div className="text-xs uppercase text-gray-600">IBU</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-dark">330</div>
                    <div className="text-xs uppercase text-gray-600">ml</div>
                  </div>
                </div>

                {/* Untappd Rating */}
                {beer.rating && (
                  <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-2xl font-bold">
                      <StarIcon />
                      {beer.rating.toFixed(2)}
                    </div>
                    <div>
                      <div className="font-medium">
                        {beer.ratingCount} ratings op Untappd
                      </div>
                      <a
                        href={`https://untappd.com/b/troebel-brewing-co-${beer.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-dark hover:underline"
                      >
                        Bekijk op Untappd →
                      </a>
                    </div>
                  </div>
                )}

                {/* Variant Selector */}
                {availableVariants.length > 1 && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Kies formaat
                    </label>
                    <select
                      value={selectedVariant?.id || ''}
                      onChange={(e) => {
                        const variant = availableVariants.find((v) => v.id === e.target.value);
                        if (variant) setSelectedVariant(variant);
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg font-body focus:outline-none focus:border-primary transition-colors"
                    >
                      {availableVariants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.label} - €{variant.price.toFixed(2)}
                          {variant.stock < 10 && variant.stock > 0 && ` (nog ${variant.stock})`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price */}
                <div className="text-3xl font-bold text-dark mb-4">
                  {selectedVariant ? (
                    <>€{selectedVariant.price.toFixed(2)}</>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                  {availableVariants.length === 1 && selectedVariant && (
                    <span className="text-base font-normal text-gray-500 ml-2">
                      / {selectedVariant.label}
                    </span>
                  )}
                </div>

                {/* Actions */}
                {isAvailable && selectedVariant ? (
                  <div className="flex flex-wrap gap-4 mb-8">
                    {/* Quantity Selector */}
                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-11 h-11 text-xl hover:bg-gray-100 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                        className="w-11 h-11 text-xl hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 px-8 py-3 bg-primary text-dark text-sm font-bold uppercase tracking-wider hover:bg-primary-dark transition-colors"
                    >
                      In Winkelmand
                    </button>
                  </div>
                ) : (
                  <div className="mb-8 p-4 bg-gray-200 text-gray-600 text-center font-semibold">
                    Dit bier is momenteel niet beschikbaar
                  </div>
                )}

                {/* Tabs */}
                <div className="border-b-2 border-gray-200 flex gap-8 mb-6">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`py-3 font-medium relative ${
                      activeTab === "description" ? "text-dark" : "text-gray-600"
                    }`}
                  >
                    Beschrijving
                    {activeTab === "description" && (
                      <span className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary" />
                    )}
                  </button>
                  {beer.tastingNotes && (
                    <button
                      onClick={() => setActiveTab("tasting")}
                      className={`py-3 font-medium relative ${
                        activeTab === "tasting" ? "text-dark" : "text-gray-600"
                      }`}
                    >
                      Smaaknoten
                      {activeTab === "tasting" && (
                        <span className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary" />
                      )}
                    </button>
                  )}
                  {beer.foodPairings && (
                    <button
                      onClick={() => setActiveTab("pairing")}
                      className={`py-3 font-medium relative ${
                        activeTab === "pairing" ? "text-dark" : "text-gray-600"
                      }`}
                    >
                      Food Pairing
                      {activeTab === "pairing" && (
                        <span className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary" />
                      )}
                    </button>
                  )}
                </div>

                {/* Tab Content */}
                <div className="min-h-[150px]">
                  {activeTab === "description" && (
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>{beer.longDescription || beer.description}</p>
                      <p>
                        <strong>Serveertip:</strong> Serveer gekoeld (6-8°C) in een tulpglas.
                      </p>
                    </div>
                  )}

                  {activeTab === "tasting" && beer.tastingNotes && (
                    <div>
                      <h4 className="font-semibold text-dark mb-3">Smaaknoten</h4>
                      <div className="flex flex-wrap gap-2">
                        {beer.tastingNotes.map((note) => (
                          <span
                            key={note}
                            className="px-4 py-1.5 bg-primary/20 text-primary-dark rounded-full text-sm font-medium"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "pairing" && beer.foodPairings && (
                    <div>
                      <p className="mb-4 text-gray-700">Dit bier past perfect bij:</p>
                      <div className="flex flex-wrap gap-3">
                        {beer.foodPairings.map((pairing) => (
                          <span
                            key={pairing}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                          >
                            {pairing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Share */}
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
                  <span className="text-sm text-gray-600 mr-auto">Deel dit bier:</span>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.href : ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-primary/20 transition-colors"
                    aria-label="Deel op Facebook"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Check dit bier: ${beer.name} - ${
                        typeof window !== "undefined" ? window.location.href : ""
                      }`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-primary/20 transition-colors"
                    aria-label="Deel op WhatsApp"
                  >
                    <WhatsAppIcon />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="w-11 h-11 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-primary/20 transition-colors"
                    aria-label="Kopieer link"
                  >
                    <LinkIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Beers */}
        <section className="bg-cream py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-dark text-center mb-12">
              Misschien vind je dit ook lekker
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
              {relatedBeers.map((relatedBeer) => (
                <BeerCard key={relatedBeer.id} beer={relatedBeer} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
