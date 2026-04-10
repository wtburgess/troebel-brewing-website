"use client";

import Link from "next/link";
import BeerCard from "@/components/beer/BeerCard";
import { Beer } from "@/types/beer";

interface FeaturedBeersProps {
  title?: string;
  subtitle?: string;
  beers: Beer[];
}

export default function FeaturedBeers({
  title = "De Line-up",
  subtitle = "Troebele Brouwsels voor Vrienden",
  beers,
}: FeaturedBeersProps) {
  return (
    <section className="dots-pattern py-16 md:py-24 px-4 md:px-8" id="bieren">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2
          className="text-4xl md:text-[4rem] text-dark mb-4"
          style={{ textShadow: '4px 4px 0px var(--color-yellow)' }}
        >
          {title}
        </h2>
        <p
          className="font-hand text-xl md:text-2xl text-gray-600"
          style={{ transform: 'rotate(-2deg)' }}
        >
          {subtitle}
        </p>
      </div>

      {/* Beer Grid - max 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 max-w-[1400px] mx-auto px-2 md:px-0">
        {beers.map((beer) => (
          <BeerCard key={beer.id} beer={beer} />
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center mt-12 md:mt-16">
        <Link
          href="/bieren"
          className="inline-block bg-transparent text-dark border-[3px] border-dark py-3 px-6 font-heading text-xl uppercase transition-colors duration-200 hover:bg-dark hover:text-yellow"
        >
          Bekijk Alles →
        </Link>
      </div>
    </section>
  );
}
