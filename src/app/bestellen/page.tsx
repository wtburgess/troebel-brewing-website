"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
      <path d="M8 21h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3V3h-2v4H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
      <line x1="12" y1="9" x2="12" y2="21" />
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
      { id: "ren-bottle", beerId: "renbier-static", type: "bottle", size: "33cl", label: "Flesje 33cl", price: 3.50, stock: 100, volumeMl: 330, isAvailable: true, sortOrder: 1 },
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
    image: "/Frambo_mockup.png",
    isActive: true,
    isFeatured: true,
    displayOrder: 2,
    variants: [
      { id: "fra-bottle", beerId: "frambo-static", type: "bottle", size: "33cl", label: "Flesje 33cl", price: 3.80, stock: 100, volumeMl: 330, isAvailable: true, sortOrder: 1 }
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
      { id: "brews-bottle", beerId: "brews-static", type: "bottle", size: "33cl", label: "Flesje 33cl", price: 3.20, stock: 100, volumeMl: 330, isAvailable: true, sortOrder: 1 },
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

  // Get available beers for shop display
  const availableBeers = beers.filter((beer) => hasAvailableVariants(beer));

  // Loading state
  if (!mounted || beersLoading) {
    return (
      <>
        <Header />
        <main className="pt-[70px] dots-pattern min-h-screen">
          {/* Page Header */}
          <section className="bg-dark text-white py-16 md:py-24 text-center">
            <div className="max-w-[1200px] mx-auto px-6">
              <h1
                className="font-heading text-4xl md:text-6xl mb-6"
                style={{ textShadow: '4px 4px 0px #D4A017' }}
              >
                De Webshop
              </h1>
              <p className="font-body text-white/70 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                Laden...
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-[70px] dots-pattern min-h-screen">
        {/* Page Header */}
        <section className="bg-dark text-white py-16 md:py-24 text-center">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1
              className="font-heading text-4xl md:text-6xl mb-6"
              style={{ textShadow: '4px 4px 0px #D4A017' }}
            >
              De Webshop
            </h1>
            <p className="font-body text-white/70 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              Direct van de brouwerij naar jouw koelkast. Kies je favoriete bieren.
            </p>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-6">
          {/* State A: Shop Grid (empty cart or browsing) */}
          {items.length === 0 || viewMode === "shop" ? (
              <>
                {/* Filter Bar */}
                <section className="bg-cream py-12">
                  <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-dashed border-dark/20">
                    <span className="font-body font-bold text-dark uppercase text-sm">
                      Toont {availableBeers.length} bieren
                    </span>
                  </div>

                  {/* Shop Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {availableBeers.map((beer) => (
                      <ShopCard key={beer.id} beer={beer} />
                    ))}
                  </div>
                </section>

                {/* Floating Cart Bar (Mobile) */}
                <FloatingCartBar onCheckout={() => setViewMode("checkout")} className="bottom-8 right-8" />
              </>
            ) : (
              /* State B: Checkout Dashboard */
              <form onSubmit={handleSubmit}>
                <div className="max-w-[1200px] mx-auto px-6 py-12">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12">
                    {/* Left Column */}
                    <div className="space-y-10">
                      {/* Section 1: Cart */}
                      <section className="bg-white border-2 border-dark p-6 shadow-[6px_6px_0_#1C1C1C] relative transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_#1C1C1C]">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-dark">
                          <h2 className="font-heading text-3xl text-dark flex items-center gap-3 uppercase tracking-wide">
                            <span className="w-8 h-8 bg-primary text-dark border-2 border-dark flex items-center justify-center text-lg font-bold">
                              1
                            </span>
                            Jouw Mandje
                          </h2>
                          <button
                            type="button"
                            onClick={() => setViewMode("shop")}
                            className="font-heading uppercase text-primary hover:text-dark transition-colors flex items-center gap-2 tracking-wider text-sm font-bold"
                          >
                            ← Meer toevoegen
                          </button>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-6">
                          {items.map((item) => (
                            <div
                              key={getItemKey(item)}
                              className="flex gap-5 items-center pb-6 border-b-2 border-dashed border-dark/20 last:border-0 last:pb-0"
                            >
                              <div className="w-28 h-28 bg-cream border-2 border-dark flex items-center justify-center p-2 flex-shrink-0">
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
                                <h4 className="font-heading text-2xl mb-1 uppercase tracking-wide truncate">
                                  {item.beer.name}
                                </h4>
                                <p className="text-base font-body text-gray-600 mb-4">
                                  {item.variant.label}
                                </p>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center border-2 border-dark bg-white font-heading text-xl">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateQuantity(
                                          item.beer.id,
                                          item.variant.id,
                                          item.quantity - 1
                                        )
                                      }
                                      className="w-12 h-12 text-dark hover:bg-primary transition-colors border-r-2 border-dark"
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
                                      className="w-12 h-12 text-dark hover:bg-primary transition-colors border-l-2 border-dark"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeItem(item.beer.id, item.variant.id)}
                                    className="text-base font-body font-bold text-red-600 underline hover:text-dark transition-colors ml-2"
                                  >
                                    Verwijder
                                  </button>
                                </div>
                              </div>

                              <div className="font-heading text-2xl text-right">
                                € {(item.variant.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Upsell Section */}
                        {upsellBeers.length > 0 && (
                          <div className="mt-10 pt-10 border-t-2 border-dark">
                            <h3 className="font-heading text-2xl text-dark mb-5 flex items-center gap-2 uppercase tracking-wide">
                              <span>👀</span> Nog eentje voor de sfeer?
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              {upsellBeers.slice(0, 4).map((beer) => {
                                const availableVariants = beer.variants.filter(
                                  (v) => v.isAvailable && v.stock > 0
                                );
                                if (availableVariants.length === 0) return null;

                                const lowestPrice = Math.min(...availableVariants.map((v) => v.price));

                                return (
                                  <button
                                    key={beer.id}
                                    type="button"
                                    onClick={() => openModal(beer)}
                                    className="flex items-center gap-4 p-4 bg-white border-2 border-dark hover:bg-primary/10 hover:-translate-y-1 hover:shadow-[4px_4px_0_#1C1C1C] transition-all group text-left relative overflow-hidden"
                                  >
                                    <div className="w-16 h-24 relative flex-shrink-0 bg-cream border-2 border-dark p-2">
                                      <Image
                                        src={beer.image}
                                        alt={beer.name}
                                        fill
                                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                                        sizes="64px"
                                      />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <span className="font-heading text-2xl text-dark block uppercase tracking-wide truncate">
                                        {beer.name}
                                      </span>
                                      <span className="text-base font-body font-bold text-primary">
                                        Vanaf € {lowestPrice.toFixed(2)}
                                      </span>
                                    </div>
                                    <span className="w-10 h-10 bg-dark text-primary border-2 border-dark flex items-center justify-center text-xl font-heading group-hover:bg-primary group-hover:text-dark transition-colors flex-shrink-0">
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
                      <section className="bg-white border-2 border-dark p-6 shadow-[6px_6px_0_#1C1C1C] relative transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_#1C1C1C]">
                        <div className="flex items-center mb-8 pb-4 border-b-2 border-dark">
                          <h2 className="font-heading text-3xl text-dark flex items-center gap-3 uppercase tracking-wide">
                            <span className="w-8 h-8 bg-primary text-dark border-2 border-dark flex items-center justify-center text-lg font-bold">
                              2
                            </span>
                            Levering
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <label
                            className={`relative flex items-start gap-4 p-5 border-2 cursor-pointer transition-all ${fulfillment === "pickup"
                                ? "border-primary bg-primary/10 shadow-[4px_4px_0_#D4A017] text-dark"
                                : "border-dark hover:-translate-y-1 hover:shadow-[4px_4px_0_#1C1C1C]"
                              }`}
                          >
                            <input
                              type="radio"
                              name="fulfillment"
                              checked={fulfillment === "pickup"}
                              onChange={() => setFulfillment("pickup")}
                              className="mt-1.5 w-5 h-5 accent-primary"
                            />
                            <div>
                              <h4 className="font-bold text-base mb-1 uppercase font-body tracking-wider text-dark">Afhalen</h4>
                              <p className="text-sm text-gray-600 font-bold leading-relaxed">
                                Brouwerij Antwerpen (na afspraak).
                              </p>
                            </div>
                          </label>
                          <div className="opacity-50 grayscale bg-cream border-2 border-dark p-5">
                            <h4 className="font-bold text-base mb-1 uppercase font-body tracking-wider text-dark">Verzending</h4>
                            <p className="text-sm font-bold text-gray-600">Binnenkort.</p>
                          </div>
                        </div>
                      </section>

                      {/* Section 3: Details */}
                      <section className="bg-white border-2 border-dark p-6 shadow-[6px_6px_0_#1C1C1C]">
                        <h2 className="font-heading text-3xl mb-8 pb-4 border-b-2 border-dark uppercase tracking-wide">3. Gegevens</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <input type="text" placeholder="Voornaam *" required className="p-3 border-2 border-dark w-full" />
                          <input type="text" placeholder="Achternaam *" required className="p-3 border-2 border-dark w-full" />
                        </div>
                        <input type="email" placeholder="E-mail *" required className="mt-5 p-3 border-2 border-dark w-full" />
                      </section>

                      {/* Section 4: Payment */}
                      <section className="bg-white border-2 border-dark p-6 shadow-[6px_6px_0_#1C1C1C]">
                        <h2 className="font-heading text-3xl mb-8 pb-4 border-b-2 border-dark uppercase tracking-wide">4. Betaling</h2>
                        <div className="flex flex-wrap gap-4">
                          {['Bancontact', 'Payconiq', 'iDeal'].map(m => (
                            <label key={m} className="p-3 border-2 border-dark font-bold cursor-pointer hover:bg-primary/10">
                              <input type="radio" name="payment" className="mr-2" /> {m}
                            </label>
                          ))}
                        </div>
                      </section>
                    </div>

                    {/* Summary Aside */}
                    <aside className="lg:sticky lg:top-24 h-fit">
                      <div className="bg-dark text-white p-8 shadow-[8px_8px_0_#D4A017] border-2 border-dark">
                        <h3 className="font-heading text-3xl mb-8 pb-4 border-b-2 border-dashed border-white/20">Overzicht</h3>
                        <div className="flex justify-between font-heading text-4xl pt-8 border-t-2 border-dashed border-white/20">
                          <span>TOTAAL</span>
                          <span className="text-primary">€ {total.toFixed(2)}</span>
                        </div>
                        <button type="submit" className="w-full mt-10 bg-primary text-dark font-heading text-xl font-bold py-4 border-2 border-dark shadow-[4px_4px_0_#1C1C1C] hover:bg-primary/90">
                          BETALEN →
                        </button>
                      </div>
                    </aside>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }