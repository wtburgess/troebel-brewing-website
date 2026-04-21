"use client";

import { useModalStore } from "@/store/modal";
import { Beer } from "@/types/beer";

const SLUG_TO_THEME: Record<string, string> = {
  renbier: "ren",
  frambo: "frambo",
  "brews-almighty": "brews",
};

function formatAbv(abv: number): string {
  return Number.isInteger(abv) ? `${abv}%` : `${abv.toString().replace(".", ",")}%`;
}

function isSoldOut(beer: Beer): boolean {
  return beer.variants.length === 0 || beer.variants.every(v => !v.isAvailable);
}

export default function HomepageBeers({ beers }: { beers: Beer[] }) {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <>
      {beers.map((beer) => {
        const theme = SLUG_TO_THEME[beer.slug] ?? "";
        const soldOut = isSoldOut(beer);
        return (
          <button
            key={beer.id}
            type="button"
            onClick={() => openModal(beer)}
            className={`beer-card ${theme}`.trim()}
            style={{ textAlign: "left", font: "inherit", padding: 0, position: "relative" }}
            aria-disabled={soldOut || undefined}
          >
            <div className="beer-img" style={{ position: "relative" }}>
              <span className="beer-abv">{formatAbv(beer.abv)}</span>
              {beer.isNew && <span className="beer-tag beer-tag--new">NIEUW</span>}
              {beer.isLimited && <span className="beer-tag beer-tag--seizoen" style={beer.isNew ? { top: '2.1rem' } : {}}>SEIZOEN</span>}
              <img src={beer.image} alt={beer.name} />
              {soldOut && <div className="sold-out-banner" />}
            </div>
            <div className="beer-body">
              <h3 className="beer-name">{beer.name}</h3>
              <div className="beer-style">{beer.style}</div>
              <p className="beer-desc">{beer.description}</p>
              <span className="beer-btn">{soldOut ? "Tijdelijk uitverkocht" : "Bestellen →"}</span>
            </div>
          </button>
        );
      })}
    </>
  );
}
