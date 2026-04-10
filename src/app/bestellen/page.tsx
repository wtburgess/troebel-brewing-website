"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ShopCard from "@/components/shop/ShopCard";
import FloatingCartBar from "@/components/shop/FloatingCartBar";
import { useCartStore } from "@/store/cart";
import { useModalStore } from "@/store/modal";
import { Beer, hasAvailableVariants, getVariantTypeLabel } from "@/types/beer";
import { getAllBeers } from "@/lib/api/beers";

// Icons for variants
const Icons = {
  Bottle: ({ className }: { className?: string }) => (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3V3h-2v4H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/>
      <line x1="12" y1="9" x2="12" y2="21"/>
    </svg>
  ),
  Crate: ({ className }: { className?: string }) => (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M3 10h18" />
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M8 14h8" />
    </svg>
  ),
  Keg: ({ className }: { className?: string }) => (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 6v12" /><path d="M19 6v12" />
      <path d="M12 6c4.42 0 8-1.34 8-3s-3.58-3-8-3-8 1.34-8 3 3.58 3 8 3z" />
      <path d="M12 21c4.42 0 8-1.34 8-3" />
      <path d="M4 18c0 1.66 3.58 3 8 3" />
    </svg>
  ),
  Other: ({ className }: { className?: string }) => (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  )
};

// Temporary Static Data to bypass PocketBase
const STATIC_BEERS: Beer[] = [
  {
    id: "renbier-static",
    name: "RENBIER",
    slug: "renbier",
    tagline: "Een tikkeltje rebellie",
    description: "Sinaasappelzeste, diepe kruiden en een tikkeltje rebellie.",
    style: "Dubbel",
    category: "tripel",
    abv: 7,
    ibu: 25,
    image: "/Renbier_mockup.jpeg", // Uses images from your public folder
    isActive: true,
    isFeatured: true,
    displayOrder: 1,
    variants: [
      { id: "ren-bottle", beerId: "renbier-static", type: "bottle", size: "33cl", label: "Fles 33cl", price: 3.50, stock: 100, volumeMl: 330, isAvailable: true, sortOrder: 1 },
      { id: "ren-crate", beerId: "renbier-static", type: "crate", size: "24x33cl", label: "Bak (24 x 33cl)", price: 75.00, stock: 20, volumeMl: 7920, isAvailable: true, sortOrder: 2 }
    ]
  },
  {
    id: "frambo-static",
    name: "FRAMBO",
    slug: "frambo",
    tagline: "One beer against the world",
    description: "Een beetje sour, een tikkeltje salty, maar verrassend zacht en fruitig van binnen.",
    style: "Raspberry Gose",
    category: "seasonal",
    abv: 4.8,
    ibu: 15,
    image: "/frambo_mockup.png",
    isActive: true,
    isFeatured: true,
    displayOrder: 2,
    variants: [
      { id: "fra-bottle", beerId: "frambo-static", type: "bottle", size: "33cl", label: "Fles 33cl", price: 3.80, stock: 100, volumeMl: 330, isAvailable: true, sortOrder: 1 }
    ]
  },
  {
    id: "brews-static",
    name: "BREWS ALMIGHTY",
    slug: "brews-almighty",
    tagline: "Bovenaards lekker",
    description: "Lichtblond met een machtige smaak. Hemelse citrusaccenten door whirlpoolhoppen.",
    style: "Blond",
    category: "blond",
    abv: 6.5,
    ibu: 30,
    image: "/Brews almighty_mockup.jpeg",
    isActive: true,
    isFeatured: true,
    displayOrder: 3,
    variants: [
      { id: "brews-bottle", beerId: "brews-static", type: "bottle", size: "33cl", label: "Fles 33cl", price: 3.20, stock: 100, volumeMl: 330, isAvailable: true, sortOrder: 1 },
      { id: "brews-keg", beerId: "brews-static", type: "keg", size: "20L", label: "Vat 20L", price: 110.00, stock: 5, volumeMl: 20000, isAvailable: true, sortOrder: 2 }
    ]
  }
];

type FulfillmentType = "pickup" | "delivery";
type PaymentMethod = "bancontact" | "payconiq" | "ideal" | "creditcard";
type ViewMode = "shop" | "checkout";

export default function BestellenPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getItemKey, syncWithBackend } =
    useCartStore();
  const openModal = useModalStore((state) => state.openModal);
  const [mounted, setMounted] = useState(false);
  const [beers, setBeers] = useState<Beer[]>([]);
  const [beersLoading, setBeersLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("shop");
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bancontact");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    notes: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [confirmAge, setConfirmAge] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  // Fetch beers from PocketBase on mount
  const fetchBeers = useCallback(async () => {
    setBeersLoading(true);
    try {
      // Bypassing PocketBase: using static data array
      const fetchedBeers = STATIC_BEERS;
      
      setBeers(fetchedBeers);
      // Sync cart items with fresh backend data (prices, stock)
      syncWithBackend(fetchedBeers);
    } catch (error) {
      console.error("Failed to fetch beers:", error);
    } finally {
      setBeersLoading(false);
    }
  }, [syncWithBackend]);

  useEffect(() => {
    setMounted(true);
    fetchBeers();
  }, [fetchBeers]);

  // Track previous item count to detect when items go from 0 to > 0
  const [prevItemCount, setPrevItemCount] = useState(0);

  // Switch to checkout view when:
  // 1. On initial mount if items exist
  // 2. When items are added to an empty cart (0 → >0)
  useEffect(() => {
    if (!mounted) return;

    const currentCount = items.length;

    // Switch to checkout when items are added to empty cart
    if (prevItemCount === 0 && currentCount > 0) {
      setViewMode("checkout");
    }

    setPrevItemCount(currentCount);
  }, [mounted, items.length, prevItemCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "Bedankt voor je bestelling! Je wordt doorgestuurd naar de betaalpagina..."
    );
  };

  const subtotal = getTotalPrice();
  const shipping = fulfillment === "delivery" ? 5.95 : 0;
  const total = subtotal + shipping;

  // Get all beers for upsell (filtered to exclude merch, show all available)
  const upsellBeers = beers.filter((beer) => hasAvailableVariants(beer));

  // Loading state
  if (!mounted || beersLoading) {
    return (
      <main className="bg-[var(--cream)] min-h-[80vh] pb-20 border-b-[3px] border-[var(--dark)]">
        <section className="bg-[var(--dark)] text-[var(--warm-white)] py-12 text-center relative overflow-hidden mb-12 border-b-[3px] border-[var(--dark)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="font-[family:var(--font-d)] text-4xl md:text-6xl text-[var(--warm-white)] mb-3 uppercase tracking-wide">
              De Webshop
            </h1>
            <p className="text-[var(--warm-white)]/70 max-w-xl mx-auto text-lg font-[family:var(--font-b)]">
              Laden...
            </p>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
          <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-[var(--dark)]/10 border-[3px] border-[var(--dark)]/20 shadow-[4px_4px_0_var(--dark)]" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const availableBeers = beers.filter((beer) => hasAvailableVariants(beer));

  return (
    <main className="bg-[var(--cream)] min-h-[80vh] pb-20 border-b-[3px] border-[var(--dark)]">
      {/* Shop Hero */}
      <section className="bg-[var(--dark)] text-[var(--warm-white)] py-12 text-center relative overflow-hidden mb-12 border-b-[3px] border-[var(--dark)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="font-[family:var(--font-d)] text-4xl md:text-6xl text-[var(--warm-white)] mb-4 uppercase tracking-wide">
            De Webshop
          </h1>
          <p className="text-[var(--warm-white)]/70 max-w-xl mx-auto text-xl font-[family:var(--font-b)] leading-relaxed">
            Direct van de brouwerij naar jouw koelkast. Kies je favoriete bieren.
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pb-20">
        {/* State A: Shop Grid (empty cart or browsing) */}
        {items.length === 0 || viewMode === "shop" ? (
          <>
            {/* Filter Bar */}
            <div className="flex justify-between items-center mb-10 pb-4 border-b-2 border-dashed border-[var(--dark)]/20">
              <span className="text-sm font-[family:var(--font-b)] font-bold text-[var(--mid)] uppercase">
                Toont {availableBeers.length} bieren
              </span>
            </div>

            {/* Shop Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
              {availableBeers.map((beer) => (
                <ShopCard key={beer.id} beer={beer} />
              ))}
            </div>

            {/* Floating Cart Bar (Mobile) */}
            <FloatingCartBar onCheckout={() => setViewMode("checkout")} className="bottom-8 right-8" />
          </>
        ) : (
          /* State B: Checkout Dashboard */
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12">
              {/* Left Column */}
              <div className="space-y-10">
                {/* Section 1: Cart */}
                <section className="bg-[var(--warm-white)] border-[3px] border-[var(--dark)] p-6 shadow-[6px_6px_0_var(--dark)] relative transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--dark)]">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b-[3px] border-[var(--dark)]">
                    <h2 className="font-[family:var(--font-d)] text-3xl text-[var(--dark)] flex items-center gap-3 uppercase tracking-wide">
                      <span className="w-8 h-8 bg-[var(--troebel-gold)] text-[var(--dark)] border-2 border-[var(--dark)] flex items-center justify-center text-lg">
                        1
                      </span>
                      Jouw Mandje
                    </h2>
                    <button
                      type="button"
                      onClick={() => setViewMode("shop")}
                      className="font-[family:var(--font-d)] uppercase text-[var(--troebel-gold)] hover:text-[var(--dark)] transition-colors flex items-center gap-2 tracking-wider text-sm"
                    >
                      ← Meer toevoegen
                    </button>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div
                        key={getItemKey(item)}
                        className="flex gap-5 items-center pb-6 border-b-2 border-dashed border-[var(--dark)]/20 last:border-0 last:pb-0"
                      >
                        <div className="w-28 h-28 bg-[var(--cream)] border-[3px] border-[var(--dark)] flex items-center justify-center p-2 flex-shrink-0">
                          <div className="relative w-full h-full">
                            <Image
                              src={item.beer.image}
                              alt={item.beer.name}
                              fill
                              className="object-contain"
                              sizes="112px"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-[family:var(--font-d)] text-2xl mb-1 uppercase tracking-wide truncate">
                            {item.beer.name}
                          </h4>
                          <p className="text-base font-[family:var(--font-b)] text-[var(--mid)] mb-4">
                            {item.variant.label}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border-[3px] border-[var(--dark)] bg-[var(--warm-white)] font-[family:var(--font-d)] text-xl">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.beer.id,
                                    item.variant.id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-12 h-12 text-[var(--dark)] hover:bg-[var(--troebel-gold)] transition-colors border-r-[3px] border-[var(--dark)]"
                              >
                                −
                              </button>
                              <span className="w-12 text-center font-bold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.beer.id,
                                    item.variant.id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-12 h-12 text-[var(--dark)] hover:bg-[var(--troebel-gold)] transition-colors border-l-[3px] border-[var(--dark)]"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.beer.id, item.variant.id)}
                              className="text-base font-[family:var(--font-b)] font-bold text-[var(--frambo-burg)] underline hover:text-[var(--dark)] transition-colors ml-2"
                            >
                              Verwijder
                            </button>
                          </div>
                        </div>

                        <div className="font-[family:var(--font-d)] text-2xl text-right">
                          € {(item.variant.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vergeten? Upsell Section */}
                  {upsellBeers.length > 0 && (
                    <div className="mt-10 pt-10 border-t-[3px] border-[var(--dark)]">
                      <h3 className="font-[family:var(--font-d)] text-2xl text-[var(--dark)] mb-5 flex items-center gap-2 uppercase tracking-wide">
                        <span>👀</span> Nog eentje voor de sfeer?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {upsellBeers.map((beer) => {
                          const availableVariants = beer.variants.filter(
                            (v) => v.isAvailable && v.stock > 0
                          );
                          if (availableVariants.length === 0) return null;

                          const variantTypes = [...new Set(availableVariants.map((v) => v.type))];
                          const GetVariantIcon = ({ type }: { type: string }) => {
                            switch (type) {
                              case "bottle": return <Icons.Bottle className="w-4 h-4" />;
                              case "crate": return <Icons.Crate className="w-4 h-4" />;
                              case "keg": return <Icons.Keg className="w-4 h-4" />;
                              default: return <Icons.Other className="w-4 h-4" />;
                            }
                          };

                          const lowestPrice = Math.min(...availableVariants.map((v) => v.price));

                          return (
                            <button
                              key={beer.id}
                              type="button"
                              onClick={() => openModal(beer)}
                              className="flex items-center gap-4 p-4 bg-[var(--warm-white)] border-[3px] border-[var(--dark)] hover:bg-[var(--troebel-gold)]/10 hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--dark)] transition-all group text-left relative overflow-hidden"
                            >
                              <div className="w-16 h-24 relative flex-shrink-0 bg-[var(--cream)] border-2 border-[var(--dark)] p-2">
                                <Image
                                  src={beer.image}
                                  alt={beer.name}
                                  fill
                                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                                  sizes="64px"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <span className="font-[family:var(--font-d)] text-2xl text-[var(--dark)] block uppercase tracking-wide truncate">
                                  {beer.name}
                                </span>
                                <div className="flex flex-wrap gap-1 my-2">
                                  {variantTypes.map((type) => (
                                    <span
                                      key={type}
                                      className="inline-flex items-center gap-1 text-[0.7rem] px-2 py-1 bg-[var(--dark)] text-[var(--troebel-gold)] font-bold uppercase tracking-wider"
                                    >
                                      <GetVariantIcon type={type} />
                                      <span>{getVariantTypeLabel(type)}</span>
                                    </span>
                                  ))}
                                </div>
                                  <span className="text-base font-[family:var(--font-b)] font-bold text-[var(--troebel-gold)]">
                                  Vanaf € {lowestPrice.toFixed(2)}
                                </span>
                              </div>

                              <span className="w-12 h-12 bg-[var(--dark)] text-[var(--troebel-gold)] border-[3px] border-[var(--dark)] flex items-center justify-center text-2xl font-[family:var(--font-d)] group-hover:bg-[var(--troebel-gold)] group-hover:text-[var(--dark)] transition-colors flex-shrink-0">
                                +
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </section>

                {/* Section 2: Fulfillment */}
                <section className="bg-[var(--warm-white)] border-[3px] border-[var(--dark)] p-6 shadow-[6px_6px_0_var(--dark)] relative transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--dark)]">
                  <div className="flex items-center mb-8 pb-4 border-b-[3px] border-[var(--dark)]">
                    <h2 className="font-[family:var(--font-d)] text-3xl text-[var(--dark)] flex items-center gap-3 uppercase tracking-wide">
                      <span className="w-8 h-8 bg-[var(--troebel-gold)] text-[var(--dark)] border-2 border-[var(--dark)] flex items-center justify-center text-lg">
                        2
                      </span>
                      Levering
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <label
                      className={`relative flex items-start gap-4 p-5 border-[3px] cursor-pointer transition-all ${
                        fulfillment === "pickup"
                          ? "border-[var(--troebel-gold)] bg-[var(--troebel-gold)]/10 shadow-[4px_4px_0_var(--troebel-gold)]"
                          : "border-[var(--dark)] hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--dark)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        value="pickup"
                        checked={fulfillment === "pickup"}
                        onChange={() => setFulfillment("pickup")}
                        className="mt-1.5 w-5 h-5 accent-[var(--troebel-gold)]"
                      />
                      <div>
                        <h4 className="font-bold text-base mb-1 uppercase font-[family:var(--font-b)] tracking-wider text-[var(--dark)]">Afhalen</h4>
                        <p className="text-sm text-[var(--mid)] font-bold leading-relaxed">
                          Bij de brouwerij in Antwerpen.
                          <br />
                          Na afspraak.
                        </p>
                      </div>
                      <span className="absolute top-3 right-3 bg-[var(--dark)] text-[var(--troebel-gold)] text-[0.7rem] font-bold px-2 py-1 uppercase tracking-wider">
                        GRATIS
                      </span>
                    </label>

                    <label className="flex items-start gap-4 p-5 border-[3px] border-[var(--dark)] opacity-50 cursor-not-allowed bg-[var(--cream)]">
                      <input
                        type="radio"
                        name="fulfillment"
                        value="delivery"
                        disabled
                        className="mt-1.5 w-5 h-5 accent-[var(--troebel-gold)]"
                      />
                      {/* Visually hidden checkbox for styling */}
                      <span className="sr-only">Thuislevering</span>
                      <div>
                        <h4 className="font-bold text-base mb-1 uppercase font-[family:var(--font-b)] tracking-wider text-[var(--dark)]">Thuislevering</h4>
                        <p className="text-sm font-bold text-[var(--mid)]">
                          Binnenkort beschikbaar.
                        </p>
                      </div>
                    </label>
                  </div>
                </section>

                {/* Section 3: Personal Details */}
                <section className="bg-[var(--warm-white)] border-[3px] border-[var(--dark)] p-6 shadow-[6px_6px_0_var(--dark)] relative transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--dark)] contact-form">
                  <div className="flex items-center mb-8 pb-4 border-b-[3px] border-[var(--dark)]">
                    <h2 className="font-[family:var(--font-d)] text-3xl text-[var(--dark)] flex items-center gap-3 uppercase tracking-wide">
                      <span className="w-8 h-8 bg-[var(--troebel-gold)] text-[var(--dark)] border-2 border-[var(--dark)] flex items-center justify-center text-lg">
                        3
                      </span>
                      Gegevens
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="form-row">
                        <label>Voornaam *</label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="Jan"
                        />
                      </div>
                      <div className="form-row">
                        <label>Achternaam *</label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Janssen"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <label>E-mailadres *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jan@voorbeeld.be"
                      />
                    </div>

                    <div className="form-row">
                      <label>Telefoonnummer *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+32 4..."
                      />
                    </div>

                    <div className="form-row">
                      <label>
                        Geboortedatum * <span className="lowercase text-xs font-normal opacity-80">(16+ controle)</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          required
                          min="1"
                          max="31"
                          value={formData.dobDay}
                          onChange={(e) => setFormData({ ...formData, dobDay: e.target.value })}
                          placeholder="DD"
                          className="text-center"
                        />
                        <input
                          type="number"
                          required
                          min="1"
                          max="12"
                          value={formData.dobMonth}
                          onChange={(e) => setFormData({ ...formData, dobMonth: e.target.value })}
                          placeholder="MM"
                          className="text-center"
                        />
                        <input
                          type="number"
                          required
                          min="1900"
                          max="2010"
                          value={formData.dobYear}
                          onChange={(e) => setFormData({ ...formData, dobYear: e.target.value })}
                          placeholder="JJJJ"
                          className="text-center"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <label>Opmerkingen</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Speciale wensen?"
                        style={{ height: '80px' }}
                      />
                    </div>
                  </div>
                </section>

                {/* Section 4: Payment */}
                <section className="bg-[var(--warm-white)] border-[3px] border-[var(--dark)] p-6 shadow-[6px_6px_0_var(--dark)] relative transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--dark)]">
                  <div className="flex items-center mb-8 pb-4 border-b-[3px] border-[var(--dark)]">
                    <h2 className="font-[family:var(--font-d)] text-3xl text-[var(--dark)] flex items-center gap-3 uppercase tracking-wide">
                      <span className="w-8 h-8 bg-[var(--troebel-gold)] text-[var(--dark)] border-2 border-[var(--dark)] flex items-center justify-center text-lg">
                        4
                      </span>
                      Betaling
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    {[
                      { id: "bancontact", label: "Bancontact" },
                      { id: "payconiq", label: "Payconiq" },
                      { id: "ideal", label: "iDEAL" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-center gap-2 p-3 border-[3px] cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? "border-[var(--troebel-gold)] bg-[var(--troebel-gold)]/10 shadow-[4px_4px_0_var(--troebel-gold)] text-[var(--dark)]"
                            : "border-[var(--dark)] hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--dark)]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id as PaymentMethod)}
                          className="sr-only"
                        />
                        <span className="font-bold text-sm uppercase tracking-wider text-[var(--dark)]">
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="space-y-3 text-sm font-bold font-[family:var(--font-b)]">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 border-2 border-[var(--dark)]"
                      />{/* Checkbox is styled by globals.css */}
                      <span className="text-[var(--mid)]">
                        Ik ga akkoord met de{" "}
                        <a href="#" className="text-[var(--troebel-gold)] underline">algemene voorwaarden</a>. *
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={confirmAge}
                        onChange={(e) => setConfirmAge(e.target.checked)}
                        className="mt-0.5 w-4 h-4 border-2 border-[var(--dark)]"
                      />{/* Checkbox is styled by globals.css */}
                      <span className="text-[var(--mid)]">
                        Ik ben 16 jaar of ouder. *
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newsletter}
                        onChange={(e) => setNewsletter(e.target.checked)}
                        className="mt-0.5 w-4 h-4 border-2 border-[var(--dark)]"
                      />{/* Checkbox is styled by globals.css */}
                      <span className="text-[var(--mid)]">
                        Ik wil nieuws ontvangen (optioneel)
                      </span>
                    </label>
                  </div>
                </section>
              </div>

              {/* Right Column - Sticky Order Summary */}
              <aside className="lg:sticky lg:top-24 h-fit space-y-6">
                <div className="bg-[var(--dark)] text-[var(--warm-white)] border-[3px] border-[var(--dark)] p-8 relative overflow-hidden shadow-[8px_8px_0_var(--troebel-gold)]">
                  <h3 className="font-[family:var(--font-d)] text-3xl text-[var(--warm-white)] mb-8 pb-4 border-b-2 border-dashed border-[var(--warm-white)]/20 uppercase tracking-wide">
                    Jouw Bestelling
                  </h3>

                  {/* Summary rows */}
                  <div className="space-y-5 mb-8 font-[family:var(--font-b)] font-bold text-xl">
                    <div className="flex justify-between text-[var(--warm-white)]/70">
                      <span>Artikelen ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                      <span className="text-[var(--warm-white)]">€ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--warm-white)]/70">
                      <span>Levering</span>
                      <span className="text-[var(--troebel-gold)] uppercase tracking-wider">GRATIS</span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--warm-white)]/40 font-normal">
                      <span>Waarvan BTW (21%)</span>{/* BTW calculation is for display only */}
                      <span>€ {((total * 0.21) / 1.21).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center font-[family:var(--font-d)] text-4xl pt-8 border-t-2 border-dashed border-[var(--warm-white)]/20">
                    <span className="text-[var(--warm-white)] uppercase">TOTAAL</span>
                    <span className="text-[var(--troebel-gold)]">€ {total.toFixed(2)}</span>
                  </div>

                  {/* Pay button */}
                  <button
                    type="submit"
                    className="submit-btn mt-10"
                    style={{ width: '100%', fontSize: '1.6rem', padding: '1.4rem', transform: 'skew(-4deg)' }}
                  >
                    BETALEN →
                  </button>

                  <p className="text-center text-sm font-bold text-[var(--warm-white)]/40 mt-5 uppercase tracking-widest">
                    Veilig betalen via Mollie
                  </p>
                </div>

                {/* Help box - Adjusted padding and text sizes */}
                <div className="bg-[var(--cream)] border-[3px] border-[var(--dark)] p-6 text-center shadow-[4px_4px_0_var(--dark)]">
                  <h4 className="font-[family:var(--font-d)] uppercase tracking-wide mb-2 text-[var(--dark)] text-lg">Hulp nodig?</h4>
                  <a
                    href="mailto:info@troebelbrewing.be"
                    className="text-base font-bold text-[var(--troebel-gold)] underline hover:text-[var(--dark)] transition-colors"
                  >
                    info@troebelbrewing.be
                  </a>
                </div>
              </aside>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
