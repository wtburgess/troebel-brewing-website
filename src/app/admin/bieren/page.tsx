"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Beer, BeerVariant } from "@/types/beer";
import { getAllBeers } from "@/lib/api/beers";
import { deleteBeer } from "@/lib/api/admin";
import BeerEditModal from "@/components/admin/BeerEditModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { createClient } from "@/lib/supabase/client";

export default function AdminBierenPage() {
  const router = useRouter();
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageViews, setPageViews] = useState<string | null>(null);

  const [editingBeer, setEditingBeer] = useState<Beer | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [beerToDelete, setBeerToDelete] = useState<Beer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const stats = useMemo(() => {
    const totalBeers = beers.length;
    const totalVariants = beers.reduce((sum, b) => sum + b.variants.length, 0);
    const uitverkochtCount = beers.filter(b =>
      b.variants.length > 0 && b.variants.every(v => !v.isAvailable)
    ).length;
    return { totalBeers, totalVariants, uitverkochtCount };
  }, [beers]);

  const filteredBeers = useMemo(() => {
    if (!searchQuery.trim()) return beers;
    const query = searchQuery.toLowerCase();
    return beers.filter(beer =>
      beer.name.toLowerCase().includes(query) ||
      beer.style.toLowerCase().includes(query) ||
      beer.category.toLowerCase().includes(query)
    );
  }, [beers, searchQuery]);

  const loadBeers = useCallback(async () => {
    try {
      setError(null);
      const data = await getAllBeers();
      setBeers(data);
    } catch (err) {
      console.error("Failed to load beers:", err);
      setError("Kon bieren niet laden. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBeers(); }, [loadBeers]);

  useEffect(() => {
    const supabase = createClient();
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since)
      .then(({ count }) => {
        if (count !== null) {
          setPageViews(
            new Intl.NumberFormat("nl-BE", { notation: "compact" }).format(count)
          );
        }
      });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const handleBeerSaved = (updatedBeer: Beer) => {
    if (isCreatingNew) {
      setBeers((prev) => [...prev, updatedBeer]);
    } else {
      setBeers((prev) => prev.map((b) => (b.id === updatedBeer.id ? updatedBeer : b)));
    }
    setEditingBeer(null);
    setIsCreatingNew(false);
  };

  const handleVariantsUpdated = (beerId: string, variants: BeerVariant[]) => {
    setBeers((prev) => prev.map((b) => (b.id === beerId ? { ...b, variants } : b)));
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setEditingBeer(null);
  };

  const handleDeleteBeer = (beer: Beer) => { setBeerToDelete(beer); };

  const confirmDeleteBeer = async () => {
    if (!beerToDelete) return;
    setIsDeleting(true);
    const result = await deleteBeer(beerToDelete.id);
    if (result.success) {
      setBeers((prev) => prev.filter((b) => b.id !== beerToDelete.id));
      setBeerToDelete(null);
    } else {
      alert(`Verwijderen mislukt: ${result.error}`);
    }
    setIsDeleting(false);
  };

  const isUnavailable = (beer: Beer): boolean =>
    beer.variants.length > 0 && beer.variants.every(v => !v.isAvailable);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-warm-white" style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: ".1em" }}>
          Laden...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* ── Top Nav ── */}
      <nav className="admin-nav">
        <div className="admin-nav-left">
          <Link href="/admin/bieren" className="admin-nav-brand">
            <span className="admin-nav-logo">TROEBEL</span>
            <span className="admin-nav-tag">/ admin</span>
          </Link>
          <div className="admin-nav-links">
            <Link href="/admin/bieren" className="admin-nav-link admin-nav-link--active">
              Bieren
            </Link>
            <Link href="/admin/bestellingen" className="admin-nav-link">
              Bestellingen
            </Link>
            <Link href="/" target="_blank" className="admin-nav-link">
              ↗ Site
            </Link>
          </div>
        </div>
        <div className="admin-nav-right">
          <span className="admin-nav-email">admin@troebel.be</span>
          <button onClick={handleLogout} className="btn-outline admin-nav-logout">
            Uitloggen
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="admin-body">
        <div className="admin-layout">
          {/* ── Left Column ── */}
          <main className="admin-main">
            {/* Page Header */}
            <div className="admin-page-header">
              <div>
                <span className="section-label" style={{ fontSize: ".85rem" }}>admin / bieren</span>
                <h1 className="admin-page-title">Overzicht</h1>
              </div>
              <div className="admin-header-actions">
                <input
                  type="text"
                  placeholder="Zoeken..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-search"
                />
                <button onClick={handleCreateNew} className="btn md:hidden">
                  + Nieuw
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="admin-error-banner">
                <p>{error}</p>
                <button onClick={loadBeers} className="admin-error-retry">
                  Opnieuw proberen
                </button>
              </div>
            )}

            {/* Desktop Table */}
            <div className="admin-table-wrap hidden md:block">
              <table className="admin-table">
                <thead>
                  <tr className="admin-table-head-row">
                    <th className="admin-th" style={{ width: "35%" }}>Bier</th>
                    <th className="admin-th" style={{ width: "25%" }}>Status</th>
                    <th className="admin-th" style={{ width: "25%" }}>Varianten</th>
                    <th className="admin-th text-right" style={{ width: "15%" }}>Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBeers.map((beer) => (
                    <tr key={beer.id} className="admin-table-row">
                      <td className="admin-td">
                        <div className="admin-beer-cell">
                          <div className="admin-beer-thumb">
                            <Image src={beer.image} alt={beer.name} fill className="object-contain" sizes="56px" />
                          </div>
                          <div>
                            <div className="admin-beer-name">{beer.name}</div>
                            <p className="admin-beer-sub">{beer.style} · {beer.abv}%</p>
                          </div>
                        </div>
                      </td>
                      <td className="admin-td">
                        <div className="admin-badges">
                          {beer.isFeatured && <span className="admin-badge admin-badge--homepage">HOMEPAGE</span>}
                          {beer.isNew && <span className="admin-badge admin-badge--new">NIEUW</span>}
                          {beer.isLimited && <span className="admin-badge admin-badge--seizoen">SEIZOEN</span>}
                          {!beer.isFeatured && !beer.isNew && !beer.isLimited && beer.variants.length === 0 && (
                            <span className="admin-badge admin-badge--concept">CONCEPT</span>
                          )}
                          {isUnavailable(beer) && <span className="admin-badge admin-badge--unavailable">NIET BESCHIKBAAR</span>}
                        </div>
                      </td>
                      <td className="admin-td">
                        {beer.variants.length > 0 ? (
                          <div className="admin-stock-ok">
                            <strong>{beer.variants.length} Variant{beer.variants.length !== 1 ? "en" : ""}</strong>
                            {(() => {
                              const unavailable = beer.variants.filter(v => !v.isAvailable).length;
                              return unavailable > 0 ? (
                                <div className="admin-stock-sub" style={{ color: "#b45309" }}>
                                  {unavailable === beer.variants.length ? "Alle uitverkocht" : `${unavailable} uitverkocht`}
                                </div>
                              ) : (
                                <div className="admin-stock-sub">Alle beschikbaar</div>
                              );
                            })()}
                          </div>
                        ) : (
                          <span className="admin-stock-none">Geen varianten</span>
                        )}
                      </td>
                      <td className="admin-td">
                        <div className="admin-actions">
                          <button onClick={() => setEditingBeer(beer)} className="admin-action-btn" title="Bewerken">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.5 1.5L12.5 4.5L4.5 12.5H1.5V9.5L9.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button onClick={() => handleDeleteBeer(beer)} className="admin-action-btn admin-action-btn--delete" title="Verwijderen">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2 3.5H12M5 3.5V2H9V3.5M5.5 6V11M8.5 6V11M3 3.5L3.5 12H10.5L11 3.5H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredBeers.length === 0 && !error && (
                    <tr>
                      <td colSpan={4} className="admin-td-empty">
                        <p>{searchQuery ? "Geen bieren gevonden voor deze zoekopdracht." : "Nog geen bieren. Voeg je eerste bier toe!"}</p>
                        {!searchQuery && (
                          <button onClick={handleCreateNew} className="btn" style={{ marginTop: "1rem" }}>
                            + Eerste Bier Toevoegen
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4">
              {filteredBeers.map((beer) => (
                <div key={beer.id} className="admin-mobile-card">
                  <div className="admin-mobile-card-top">
                    <div className="admin-beer-thumb" style={{ width: 64, height: 64, flexShrink: 0 }}>
                      <Image src={beer.image} alt={beer.name} fill className="object-contain" sizes="64px" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div className="admin-beer-name">{beer.name}</div>
                          <p className="admin-beer-sub">{beer.style} · {beer.abv}%</p>
                        </div>
                        <div className="admin-actions">
                          <button onClick={() => setEditingBeer(beer)} className="admin-action-btn" title="Bewerken">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 1.5L12.5 4.5L4.5 12.5H1.5V9.5L9.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                          </button>
                          <button onClick={() => handleDeleteBeer(beer)} className="admin-action-btn admin-action-btn--delete" title="Verwijderen">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5H12M5 3.5V2H9V3.5M5.5 6V11M8.5 6V11M3 3.5L3.5 12H10.5L11 3.5H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                      </div>
                      <div className="admin-badges" style={{ marginTop: ".5rem" }}>
                        {beer.isFeatured && <span className="admin-badge admin-badge--homepage">HOMEPAGE</span>}
                        {beer.isNew && <span className="admin-badge admin-badge--new">NIEUW</span>}
                        {beer.isLimited && <span className="admin-badge admin-badge--seizoen">SEIZOEN</span>}
                        {!beer.isFeatured && !beer.isNew && !beer.isLimited && beer.variants.length === 0 && (
                          <span className="admin-badge admin-badge--concept">CONCEPT</span>
                        )}
                        {isUnavailable(beer) && <span className="admin-badge admin-badge--unavailable">NIET BESCHIKBAAR</span>}
                      </div>
                    </div>
                  </div>
                  <div className="admin-mobile-card-foot">
                    {beer.variants.length > 0 ? (
                      <div className="admin-mobile-stock-row">
                        <strong>{beer.variants.length} Variant{beer.variants.length !== 1 ? "en" : ""}</strong>
                        {(() => {
                          const unavailable = beer.variants.filter(v => !v.isAvailable).length;
                          return (
                            <span style={{ color: unavailable > 0 ? "#b45309" : undefined }}>
                              {unavailable === 0 ? "Alle beschikbaar" : unavailable === beer.variants.length ? "Alle uitverkocht" : `${unavailable} uitverkocht`}
                            </span>
                          );
                        })()}
                      </div>
                    ) : (
                      <span className="admin-stock-none">Geen varianten</span>
                    )}
                  </div>
                </div>
              ))}
              {filteredBeers.length === 0 && !error && (
                <div className="admin-table-wrap" style={{ padding: "2rem", textAlign: "center" }}>
                  <p style={{ color: "var(--mid)" }}>{searchQuery ? "Geen bieren gevonden." : "Nog geen bieren."}</p>
                </div>
              )}
            </div>
          </main>

          {/* ── Sidebar ── */}
          <aside className="admin-sidebar">
            <button onClick={handleCreateNew} className="btn admin-sidebar-cta">
              + NIEUW BIER
            </button>

            <div className="admin-stat-card">
              <div className="admin-stat-label">Totaal Bieren</div>
              <div className="admin-stat-value">{stats.totalBeers}</div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-label">Actieve Varianten</div>
              <div className="admin-stat-value">{stats.totalVariants}</div>
            </div>

            <div className="admin-stat-card admin-stat-card--low">
              <div className="admin-stat-label">Uitverkocht</div>
              <div className="admin-stat-value">{stats.uitverkochtCount}</div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-label">Pagina Bezoeken (30d)</div>
              <div className="admin-stat-value">{pageViews ?? "—"}</div>
            </div>
          </aside>
        </div>
      </div>

      {(editingBeer || isCreatingNew) && (
        <BeerEditModal
          beer={editingBeer}
          isOpen={true}
          onClose={() => { setEditingBeer(null); setIsCreatingNew(false); }}
          onSaved={handleBeerSaved}
          onVariantsUpdated={handleVariantsUpdated}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!beerToDelete}
        beerName={beerToDelete?.name || ""}
        onConfirm={confirmDeleteBeer}
        onCancel={() => setBeerToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
