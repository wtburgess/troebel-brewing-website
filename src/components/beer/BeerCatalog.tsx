"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BeerCard from "@/components/beer/BeerCard";
import { Beer, BeerCategory } from "@/types/beer";

// Categories for filtering
const categories = [
  { id: "all", label: "Alles" },
  { id: "blond", label: "Blond" },
  { id: "pale-ale", label: "Pale Ale" },
  { id: "tripel", label: "Tripel" },
  { id: "saison", label: "Saison" },
  { id: "session", label: "Session" },
  { id: "seasonal", label: "Seizoen" },
] as const;

interface BeerCatalogProps {
  beers: Beer[];
}

export default function BeerCatalog({ beers }: BeerCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredBeers = useMemo(() => {
    if (activeCategory === "all") return beers;
    return beers.filter((beer) => beer.category === activeCategory);
  }, [beers, activeCategory]);

  return (
    <>
      <Header />

      <main className="pt-[70px] dots-pattern min-h-screen">
        {/* Page Header */}
        <section className="text-center px-6 py-12 md:py-16">
          <h1
            className="text-4xl md:text-[4rem] text-dark mb-4"
            style={{ textShadow: '4px 4px 0px var(--troebel-gold)' }}
          >
            De Line-up
          </h1>
          <p
            className="font-hand text-xl md:text-2xl text-gray-600"
            style={{ transform: 'rotate(-2deg)' }}
          >
            Alle Troebele Brouwsels
          </p>
        </section>

        {/* Beer Grid Section */}
        <section className="pb-16 md:pb-24 px-4 md:px-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 font-heading text-base uppercase border-[3px] border-dark transition-all duration-200 ${
                    activeCategory === category.id
                      ? "bg-dark text-[#D4961A] shadow-[4px_4px_0px_var(--troebel-gold)]"
                      : "bg-white text-dark hover:bg-yellow"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Beer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
              {filteredBeers.map((beer) => (
                <BeerCard key={beer.id} beer={beer} />
              ))}
            </div>

            {/* Empty state */}
            {filteredBeers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Geen bieren gevonden in deze categorie.
                </p>
              </div>
            )}

            {/* Mixed Pack Card */}
            <div
              className="bg-white border-4 border-dark p-6 md:p-8 mt-16 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{ boxShadow: '8px 8px 0px var(--troebel-gold)' }}
            >
              <div>
                <h3 className="text-2xl md:text-3xl font-heading text-dark mb-2">
                  Mixed Pack (6 Bieren)
                </h3>
                <p className="text-gray-600">
                  Proef al onze beschikbare bieren in één pakket.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-heading text-3xl text-dark">€18.00</span>
                <Link href="/bestellen" className="btn-brutal">
                  Bekijk Opties
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-yellow py-16 text-center px-6 border-t-4 border-dark">
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-3xl md:text-[3rem] text-dark mb-4">
              Interesse in grotere hoeveelheden?
            </h2>
            <p className="text-dark text-lg mb-8">
              Voor horeca en evenementen bieden we speciale tarieven.
            </p>
            <Link href="/horeca" className="btn-brutal btn-brutal-dark">
              Horeca Info →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
