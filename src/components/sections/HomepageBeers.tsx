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

export default function HomepageBeers({ beers }: { beers: Beer[] }) {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <>
      {beers.map((beer) => {
        const theme = SLUG_TO_THEME[beer.slug] ?? "";
        return (
          <button
            key={beer.id}
            type="button"
            onClick={() => openModal(beer)}
            className={`beer-card ${theme}`.trim()}
            style={{ textAlign: "left", font: "inherit", padding: 0 }}
          >
            <div className="beer-img">
              <span className="beer-abv">{formatAbv(beer.abv)}</span>
              {beer.isLimited && <span className="beer-tag">seasonal</span>}
              <img src={beer.image} alt={beer.name} />
            </div>
            <div className="beer-body">
              <h3 className="beer-name">{beer.name}</h3>
              <div className="beer-style">{beer.style}</div>
              <p className="beer-desc">{beer.description}</p>
              <span className="beer-btn">Bestellen →</span>
            </div>
          </button>
        );
      })}
    </>
  );
}
