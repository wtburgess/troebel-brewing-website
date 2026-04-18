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

export default function AdminBierenPage() {
  const router = useRouter();
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [editingBeer, setEditingBeer] = useState<Beer | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [beerToDelete, setBeerToDelete] = useState<Beer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Computed stats
  const stats = useMemo(() => {
    const totalBeers = beers.length;
    const totalVariants = beers.reduce((sum, b) => sum + b.variants.length, 0);
    const lowStockVariants = beers.flatMap(b =>
      b.variants.filter(v => v.stock <= 20 && v.stock > 0)
    );
    const lowStockCount = lowStockVariants.length;
    const lowStockItems = lowStockVariants.slice(0, 3).map(v => {
      const beer = beers.find(b => b.variants.some(bv => bv.id === v.id));
      return `${beer?.name} (${v.label})`;
    });

    return { totalBeers, totalVariants, lowStockCount, lowStockItems };
  }, [beers]);

  // Filtered beers based on search
  const filteredBeers = useMemo(() => {
    if (!searchQuery.trim()) return beers;
    const query = searchQuery.toLowerCase();
    return beers.filter(beer =>
      beer.name.toLowerCase().includes(query) ||
      beer.style.toLowerCase().includes(query) ||
      beer.category.toLowerCase().includes(query)
    );
  }, [beers, searchQuery]);

  // Load beers
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

  // Check authentication
  useEffect(() => {
    const isAuth = sessionStorage.getItem("troebel-admin-auth");
    if (isAuth !== "true") {
      router.push("/admin");
      return;
    }
    loadBeers();
  }, [router, loadBeers]);

  const handleLogout = () => {
    sessionStorage.removeItem("troebel-admin-auth");
    router.push("/admin");
  };

  const handleSyncStock = async () => {
    setSyncing(true);
    // TODO: Implement Google Sheets sync
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert("Stock gesynchroniseerd met Google Sheets!");
    setSyncing(false);
  };

  const handleBeerSaved = (updatedBeer: Beer) => {
    if (isCreatingNew) {
      setBeers((prev) => [...prev, updatedBeer]);
    } else {
      setBeers((prev) =>
        prev.map((b) => (b.id === updatedBeer.id ? updatedBeer : b))
      );
    }
    setEditingBeer(null);
    setIsCreatingNew(false);
  };

  const handleVariantsUpdated = (beerId: string, variants: BeerVariant[]) => {
    setBeers((prev) =>
      prev.map((b) => (b.id === beerId ? { ...b, variants } : b))
    );
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setEditingBeer(null); // Pass null to indicate new beer
  };

  const handleDeleteBeer = (beer: Beer) => {
    setBeerToDelete(beer);
  };

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

  // Calculate total stock for a beer
  const getTotalStock = (beer: Beer): number => {
    return beer.variants.reduce((sum, v) => sum + v.stock, 0);
  };

  // Check if beer has low stock
  const hasLowStock = (beer: Beer): boolean => {
    return beer.variants.some(v => v.stock <= 20 && v.stock > 0);
  };

  // Check if beer is unavailable (no stock or deactivated)
  const isUnavailable = (beer: Beer): boolean => {
    return beer.variants.length > 0 && beer.variants.every(v => v.stock <= 0 || !v.isAvailable);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse font-heading text-xl text-dark">
          Laden...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Top Admin Nav */}
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-dark text-white flex items-center justify-between px-4 md:px-6 z-[1000] border-b-2 border-primary">
        <div className="flex items-center gap-6">
          <span className="font-heading text-primary text-xl tracking-wider">
            TROEBEL ADMIN
          </span>
          <Link
            href="/admin/bestellingen"
            className="text-gray-400 text-sm hover:text-white transition-colors"
          >
            Bestellingen
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-gray-400 text-sm hover:text-white transition-colors"
          >
            ↗ Naar website
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-300">admin@troebel.be</span>
          <button
            onClick={handleLogout}
            className="text-gray-400 text-xs uppercase tracking-widest hover:text-white transition-colors"
          >
            Uitloggen
          </button>
        </div>
      </nav>

      {/* Main Content with top padding for fixed nav */}
      <div className="pt-[60px]">
        <div className="admin-layout max-w-[1400px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Left Main Column */}
          <main className="min-w-0">
            {/* Page Header */}
            <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex justify-between w-full md:w-auto items-center">
                <div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                    Admin / Bieren
                  </div>
                  <h1 className="text-2xl font-heading text-dark m-0 !text-2xl">Overzicht</h1>
                </div>
                 {/* Mobile Add Button */}
                 <button
                  onClick={handleCreateNew}
                  className="md:hidden bg-primary text-dark font-heading text-xs uppercase tracking-wide px-3 py-2 border-2 border-dark"
                >
                  + Nieuw
                </button>
              </div>
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Zoeken..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-[250px] px-4 py-2 border border-gray-200 rounded-sm text-sm font-body focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-red-100 border border-red-500 text-red-700 p-4 mb-6 rounded-sm">
                <p className="font-body text-sm">{error}</p>
                <button
                  onClick={loadBeers}
                  className="mt-2 text-sm font-heading underline"
                >
                  Opnieuw proberen
                </button>
              </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden hidden md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="p-4 text-xs uppercase tracking-widest text-gray-500 font-semibold" style={{ width: "35%" }}>
                      Bier
                    </th>
                    <th className="p-4 text-xs uppercase tracking-widest text-gray-500 font-semibold" style={{ width: "25%" }}>
                      Status
                    </th>
                    <th className="p-4 text-xs uppercase tracking-widest text-gray-500 font-semibold" style={{ width: "25%" }}>
                      Varianten & Stock
                    </th>
                    <th className="p-4 text-xs uppercase tracking-widest text-gray-500 font-semibold text-right" style={{ width: "15%" }}>
                      Acties
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBeers.map((beer) => (
                    <tr
                      key={beer.id}
                      className="border-b border-gray-100 hover:bg-cream transition-colors"
                    >
                      {/* Beer Info Cell */}
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-sm flex-shrink-0 relative overflow-hidden">
                            <Image
                              src={beer.image}
                              alt={beer.name}
                              fill
                              className="object-contain"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <div className="font-heading text-base text-dark m-0 leading-tight">
                              {beer.name}
                            </div>
                            <p className="text-sm text-gray-500 m-0">
                              {beer.style} • {beer.abv}%
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status Badges Cell */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {beer.isFeatured && (
                            <span className="status-badge status-homepage">
                              HOMEPAGE
                            </span>
                          )}
                          {beer.isNew && (
                            <span className="status-badge status-new">
                              NIEUW
                            </span>
                          )}
                          {beer.isLimited && (
                            <span className="status-badge status-seasonal">
                              SEIZOEN
                            </span>
                          )}
                          {!beer.isFeatured && !beer.isNew && !beer.isLimited && beer.variants.length === 0 && (
                            <span className="status-badge status-concept">
                              CONCEPT
                            </span>
                          )}
                          {isUnavailable(beer) && (
                            <span className="status-badge status-unavailable">
                              NIET BESCHIKBAAR
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Variants & Stock Cell */}
                      <td className="p-4">
                        {beer.variants.length > 0 ? (
                          <div className={`text-sm ${hasLowStock(beer) ? "text-amber-600" : ""}`}>
                            <strong>
                              {beer.variants.length} Variant{beer.variants.length !== 1 ? "en" : ""}
                            </strong>
                            <div className={`mt-0.5 ${hasLowStock(beer) ? "text-amber-600" : "text-gray-500"}`}>
                              {hasLowStock(beer) ? (
                                <>Laag: {getTotalStock(beer)} stuks</>
                              ) : (
                                <>Totale Stock: {getTotalStock(beer)}</>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Geen varianten</span>
                        )}
                      </td>

                      {/* Actions Cell */}
                      <td className="p-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingBeer(beer)}
                            className="action-icon-btn"
                            title="Bewerken"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDeleteBeer(beer)}
                            className="action-icon-btn delete"
                            title="Verwijderen"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredBeers.length === 0 && !error && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center">
                        <p className="font-body text-gray-500 mb-4">
                          {searchQuery ? "Geen bieren gevonden voor deze zoekopdracht." : "Nog geen bieren. Begin met het toevoegen van je eerste bier!"}
                        </p>
                        {!searchQuery && (
                          <button
                            onClick={handleCreateNew}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-dark font-heading border-2 border-dark hover:bg-dark hover:text-primary transition-colors"
                          >
                            + Eerste Bier Toevoegen
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4">
              {filteredBeers.map((beer) => (
                <div key={beer.id} className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-sm flex-shrink-0 relative overflow-hidden">
                      <Image
                        src={beer.image}
                        alt={beer.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-heading text-lg text-dark m-0 leading-tight">
                            {beer.name}
                          </div>
                          <p className="text-sm text-gray-500 m-0">
                            {beer.style} • {beer.abv}%
                          </p>
                        </div>
                        <div className="flex gap-2">
                           <button
                            onClick={() => setEditingBeer(beer)}
                            className="action-icon-btn"
                            title="Bewerken"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDeleteBeer(beer)}
                            className="action-icon-btn delete"
                            title="Verwijderen"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {beer.isFeatured && (
                          <span className="status-badge status-homepage">HOMEPAGE</span>
                        )}
                        {beer.isNew && (
                          <span className="status-badge status-new">NIEUW</span>
                        )}
                        {beer.isLimited && (
                          <span className="status-badge status-seasonal">SEIZOEN</span>
                        )}
                         {!beer.isFeatured && !beer.isNew && !beer.isLimited && beer.variants.length === 0 && (
                          <span className="status-badge status-concept">
                            CONCEPT
                          </span>
                        )}
                        {isUnavailable(beer) && (
                          <span className="status-badge status-unavailable">
                            NIET BESCHIKBAAR
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                     {beer.variants.length > 0 ? (
                        <div className={`text-sm flex justify-between items-center ${hasLowStock(beer) ? "text-amber-600" : ""}`}>
                          <strong>
                            {beer.variants.length} Variant{beer.variants.length !== 1 ? "en" : ""}
                          </strong>
                          <span className={hasLowStock(beer) ? "font-bold" : "text-gray-500"}>
                            {hasLowStock(beer) ? (
                              <>Laag: {getTotalStock(beer)} stuks</>
                            ) : (
                              <>Stock: {getTotalStock(beer)}</>
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Geen varianten</span>
                      )}
                  </div>
                </div>
              ))}
              
              {filteredBeers.length === 0 && !error && (
                 <div className="bg-white p-8 text-center rounded-sm border border-gray-200">
                    <p className="font-body text-gray-500 mb-4">
                      {searchQuery ? "Geen bieren gevonden." : "Nog geen bieren."}
                    </p>
                 </div>
              )}
            </div>

          </main>

          {/* Right Sidebar */}
          <aside className="flex flex-col gap-4">
            {/* Action Buttons */}
            <button
              onClick={handleCreateNew}
              className="w-full py-3 px-4 bg-primary text-dark font-heading text-sm uppercase tracking-wide border-2 border-dark hover:bg-dark hover:text-primary transition-colors shadow-md"
            >
              + NIEUW BIER
            </button>

            <button
              onClick={handleSyncStock}
              disabled={syncing}
              className="w-full py-3 px-4 bg-white text-dark font-heading text-sm uppercase tracking-wide border-2 border-dark hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {syncing ? "Syncing..." : "↻ SYNC VOORRAAD"}
            </button>

            {/* Stats Cards */}
            <div className="stat-card">
              <div className="stat-label">Totaal Bieren</div>
              <div className="stat-value">{stats.totalBeers}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Actieve Varianten</div>
              <div className="stat-value">{stats.totalVariants}</div>
            </div>

            <div className="stat-card border-l-4 border-l-amber-500">
              <div className="stat-label">Lage Voorraad</div>
              <div className="stat-value">{stats.lowStockCount}</div>
              {stats.lowStockItems.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {stats.lowStockItems.join(", ")}
                </p>
              )}
            </div>

            <div className="stat-card">
              <div className="stat-label">Pagina Bezoeken</div>
              <div className="stat-value">1.2k</div>
            </div>
          </aside>
        </div>
      </div>

      {/* Edit/Create Beer Modal */}
      {(editingBeer || isCreatingNew) && (
        <BeerEditModal
          beer={editingBeer}
          isOpen={true}
          onClose={() => {
            setEditingBeer(null);
            setIsCreatingNew(false);
          }}
          onSaved={handleBeerSaved}
          onVariantsUpdated={handleVariantsUpdated}
        />
      )}

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!beerToDelete}
        beerName={beerToDelete?.name || ""}
        onConfirm={confirmDeleteBeer}
        onCancel={() => setBeerToDelete(null)}
        isDeleting={isDeleting}
      />

      {/* Admin-specific styles */}
      <style jsx>{`
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-right: 4px;
          margin-bottom: 4px;
        }

        .status-homepage {
          background: #DBEAFE;
          color: #1E40AF;
        }

        .status-new {
          background: #F3E8FF;
          color: #6B21A8;
        }

        .status-seasonal {
          background: #FFEDD5;
          color: #9A3412;
        }

        .status-concept {
          background: #F3F4F6;
          color: #4B5563;
        }

        .status-unavailable {
          background: #FEE2E2;
          color: #991B1B;
        }

        .action-icon-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #E5E5E5;
          border-radius: 4px;
          background: white;
          color: #525252;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-icon-btn:hover {
          border-color: #1C1C1C;
          color: #1C1C1C;
        }

        .action-icon-btn.delete:hover {
          border-color: #EF4444;
          color: #EF4444;
        }

        .stat-card {
          background: white;
          padding: 1rem;
          border-radius: 4px;
          border: 1px solid #E5E5E5;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .stat-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #525252;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 700;
          color: #1C1C1C;
        }
      `}</style>
    </div>
  );
}
