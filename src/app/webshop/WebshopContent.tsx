"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomepageBeers from "@/components/sections/HomepageBeers";
import FloatingCartBar from "@/components/shop/FloatingCartBar";
import { useCartStore } from "@/store/cart";
import { useModalStore } from "@/store/modal";
import { Beer, hasAvailableVariants } from "@/types/beer";
import { getAllBeers } from "@/lib/api/beers";

type ViewMode = "shop" | "checkout";

export default function WebshopContent() {
  const { items, updateQuantity, removeItem, getTotalPrice, getItemKey, syncWithBackend, clearCart } =
    useCartStore();
  const openModal = useModalStore((state) => state.openModal);
  const [mounted, setMounted] = useState(false);
  const [beers, setBeers] = useState<Beer[]>([]);
  const [beersLoading, setBeersLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("shop");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    notes: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [confirmAge, setConfirmAge] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

  const fetchBeers = useCallback(async () => {
    setBeersLoading(true);
    try {
      const fetched = await getAllBeers();
      setBeers(fetched);
      syncWithBackend(fetched);
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

  const [prevItemCount, setPrevItemCount] = useState(0);
  useEffect(() => {
    if (!mounted) return;
    if (prevItemCount === 0 && items.length > 0) setViewMode("checkout");
    setPrevItemCount(items.length);
  }, [mounted, items.length, prevItemCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmAge) {
      setSubmitError("Bevestig aub dat je 18 jaar of ouder bent.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, items, fulfillment: "pickup" }),
      });
      if (res.ok) {
        const { orderNumber } = (await res.json()) as { orderNumber: string };
        clearCart();
        setOrderConfirmed(orderNumber);
        window.scrollTo(0, 0);
      } else {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setSubmitError(body.error ?? "Er ging iets mis. Probeer opnieuw.");
      }
    } catch {
      setSubmitError("Verbindingsfout. Controleer je internet en probeer opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getTotalPrice();
  const total = subtotal;
  const sortedBeers = [...beers].sort((a, b) => {
    const aOut = !hasAvailableVariants(a);
    const bOut = !hasAvailableVariants(b);
    return Number(aOut) - Number(bOut);
  });
  const upsellBeers = beers.filter((b) => hasAvailableVariants(b));

  if (!mounted || beersLoading) {
    return (
      <>
        <Header />
        <main>
          <section className="webshop-hero">
            <span className="webshop-hero-eyebrow">rechtstreeks van de bron</span>
            <h1 className="webshop-hero-title">DE WEBSHOP</h1>
            <p className="webshop-hero-sub">Direct van de brouwerij naar jouw koelkast.</p>
          </section>
          <section className="webshop-grid">
            <div className="webshop-grid-inner">
              {[1, 2, 3].map((i) => (
                <div key={i} className="beer-skeleton">
                  <div className="beer-skeleton-img" />
                  <div className="beer-skeleton-body">
                    <div className="beer-skeleton-line beer-skeleton-line--title" />
                    <div className="beer-skeleton-line beer-skeleton-line--sub" />
                    <div className="beer-skeleton-line beer-skeleton-line--desc" />
                    <div className="beer-skeleton-line beer-skeleton-line--desc" style={{ width: '60%' }} />
                    <div className="beer-skeleton-btn" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (orderConfirmed) {
    return (
      <>
        <Header />
        <main>
          <section className="webshop-hero">
            <span className="webshop-hero-eyebrow">gelukt</span>
            <h1 className="webshop-hero-title">PROOST!</h1>
            <p className="webshop-hero-sub">Je bestelling is geplaatst.</p>
          </section>
          <section className="confirm-canvas">
            <div className="confirm-card">
              <div className="order-summary-stripe" style={{ position: "absolute" }} />
              <span className="confirm-eyebrow">tot snel bij de brouwerij</span>
              <h2 className="confirm-title">BEDANKT!</h2>
              <p className="confirm-order">
                Bestelnummer <strong>{orderConfirmed}</strong>
              </p>
              <p className="confirm-body">
                We nemen binnenkort contact op om de afhaaltijd te bevestigen. Een bevestiging is
                onderweg naar je mailbox.
              </p>
              <button
                type="button"
                onClick={() => {
                  setOrderConfirmed(null);
                  setViewMode("shop");
                }}
                className="order-submit"
                style={{ maxWidth: 320 }}
              >
                Verder winkelen →
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const showShop = items.length === 0 || viewMode === "shop";

  return (
    <>
      <Header />
      <main>
        <section className="webshop-hero">
          <span className="webshop-hero-eyebrow">rechtstreeks van de bron</span>
          <h1 className="webshop-hero-title">DE WEBSHOP</h1>
          <p className="webshop-hero-sub">
            Direct van de brouwerij naar jouw koelkast. Kies je favoriete bieren.
          </p>
        </section>

        {showShop ? (
          <section className="webshop-grid">
            <div className="webshop-grid-inner">
              <HomepageBeers beers={sortedBeers} />
            </div>
            <FloatingCartBar onCheckout={() => setViewMode("checkout")} />
          </section>
        ) : (
          <section className="checkout-canvas">
            <form onSubmit={handleSubmit}>
              <div className="checkout-inner">
                <div className="checkout-col">
                  {/* Section 1 */}
                  <section className="checkout-section">
                    <div className="checkout-section-head">
                      <div className="checkout-section-title">
                        <span className="checkout-section-num">1</span>
                        Jouw mandje
                      </div>
                      <button
                        type="button"
                        className="checkout-section-link"
                        onClick={() => setViewMode("shop")}
                      >
                        ← Meer toevoegen
                      </button>
                    </div>

                    <p className="pickup-note">afhalen bij de brouwerij — op afspraak</p>

                    {items.map((item) => (
                      <div key={getItemKey(item)} className="checkout-row">
                        <div className="checkout-row-img">
                          <img src={item.beer.image} alt={item.beer.name} />
                        </div>
                        <div className="checkout-row-meta">
                          <h4 className="checkout-row-name">{item.beer.name}</h4>
                          <p className="checkout-row-variant">{item.variant.label}</p>
                          <div className="checkout-row-actions">
                            <div className="qty-stepper">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.beer.id, item.variant.id, item.quantity - 1)
                                }
                                aria-label="Verlaag aantal"
                              >
                                −
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.beer.id, item.variant.id, item.quantity + 1)
                                }
                                aria-label="Verhoog aantal"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              className="checkout-row-remove"
                              onClick={() => removeItem(item.beer.id, item.variant.id)}
                            >
                              Verwijder
                            </button>
                          </div>
                        </div>
                        <div className="checkout-row-price">
                          € {(item.variant.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}

                    {upsellBeers.length > 0 && (
                      <div className="upsell-block">
                        <h3 className="upsell-head">👀 Nog eentje voor de sfeer?</h3>
                        <div className="upsell-grid">
                          {upsellBeers.map((beer) => {
                            const av = beer.variants.filter((v) => v.isAvailable);
                            if (av.length === 0) return null;
                            const lowest = Math.min(...av.map((v) => v.price));
                            return (
                              <button
                                key={beer.id}
                                type="button"
                                className="upsell-tile"
                                onClick={() => openModal(beer)}
                              >
                                <div className="upsell-tile-img">
                                  <img src={beer.image} alt={beer.name} />
                                </div>
                                <div className="upsell-tile-meta">
                                  <span className="upsell-tile-name">{beer.name}</span>
                                  <span className="upsell-tile-price">
                                    Vanaf € {lowest.toFixed(2)}
                                  </span>
                                </div>
                                <span className="upsell-tile-plus">+</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Section 2 */}
                  <section className="checkout-section">
                    <div className="checkout-section-head">
                      <div className="checkout-section-title">
                        <span className="checkout-section-num">2</span>
                        Gegevens
                      </div>
                    </div>
                    <div className="checkout-form-grid">
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
                      <label>Telefoonnummer</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+32 4..."
                      />
                    </div>
                    <div className="form-row">
                      <label>Opmerkingen</label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Speciale wensen?"
                      />
                    </div>
                  </section>

                  {/* Section 3 */}
                  <section className="checkout-section">
                    <div className="checkout-section-head">
                      <div className="checkout-section-title">
                        <span className="checkout-section-num">3</span>
                        Bevestiging
                      </div>
                    </div>
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        required
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                      />
                      <span>
                        Ik ga akkoord met de <Link href="/voorwaarden">algemene voorwaarden</Link>. *
                      </span>
                    </label>
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        required
                        checked={confirmAge}
                        onChange={(e) => setConfirmAge(e.target.checked)}
                      />
                      <span>Ik ben 18 jaar of ouder. *</span>
                    </label>
                  </section>
                </div>

                {/* Right aside */}
                <aside className="order-summary-wrap">
                  <div className="order-summary">
                    <div className="order-summary-stripe" />
                    <h3 className="order-summary-title">Jouw bestelling</h3>
                    <div className="order-summary-line">
                      <span>Artikelen ({items.reduce((a, i) => a + i.quantity, 0)})</span>
                      <strong>€ {subtotal.toFixed(2)}</strong>
                    </div>
                    <div className="order-summary-line vat">
                      <span>Waarvan BTW (21%)</span>
                      <span>€ {((total * 0.21) / 1.21).toFixed(2)}</span>
                    </div>

                    <div className="order-total">
                      <span className="order-total-label">TOTAAL</span>
                      <span className="order-total-value">€ {total.toFixed(2)}</span>
                    </div>

                    {submitError && <div className="order-submit-err">{submitError}</div>}

                    <button type="submit" disabled={isSubmitting} className="order-submit">
                      {isSubmitting ? "Bezig..." : "BESTELLEN →"}
                    </button>
                    <p className="order-submit-note">Je ontvangt een bevestiging per e-mail.</p>
                  </div>

                  <div className="help-box">
                    <h4>Hulp nodig?</h4>
                    <a href="mailto:hallo@troebelbrewing.be">hallo@troebelbrewing.be</a>
                  </div>
                </aside>
              </div>
            </form>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
