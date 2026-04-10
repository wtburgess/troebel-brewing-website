"use client";

import Image from "next/image";
import Link from "next/link";
import { Beer, getLowestPrice, hasAvailableVariants } from "@/types/beer";
import { useModalStore } from "@/store/modal";

interface BeerCardProps {
  beer: Beer;
}

export default function BeerCard({ beer }: BeerCardProps) {
  const openModal = useModalStore((state) => state.openModal);
  // Get lowest price from available variants
  const lowestPrice = getLowestPrice(beer);
  const isAvailable = hasAvailableVariants(beer);

  // Determine beer class for styling
  const getBeerClass = () => {
    if (beer.slug.includes('renbier') || beer.name.includes('RENBIER')) return 'ren';
    if (beer.slug.includes('frambo') || beer.name.includes('FRAMBO')) return 'frambo';
    if (beer.slug.includes('brews') || beer.name.includes('BREWS')) return 'brews';
    return '';
  };

  const beerClass = getBeerClass();

  // Determine badge color based on ABV
  const getBadgeStyle = () => {
    if (beer.abv >= 8) return { background: '#cc3333', color: 'white' }; // Red for high ABV
    if (beer.abv >= 6) return { background: 'var(--color-yellow)', color: 'var(--color-dark)' }; // Yellow for medium
    if (beer.abv < 5) return { background: '#eee', color: 'var(--color-dark)' }; // Light gray for low
    return { background: 'var(--color-dark)', color: 'white' }; // Dark for pale ales etc
  };

  const badgeStyle = getBadgeStyle();

  // Custom styles for Brews Almighty
  const isBrews = beerClass === 'brews';

  return (
    <article className={`card-eticket group ${beerClass}`} style={isBrews ? { backgroundColor: '#fed3a6', borderColor: '#dc5b26' } : {}}>
      {/* Seasonal Ribbon */}
      {beer.isLimited && (
        <div className="ribbon-seasonal">SEASONAL</div>
      )}

      {/* ABV Badge */}
      <div
        className="absolute -top-4 -right-4 font-heading text-xl py-2 px-4 border-[3px] border-dark transform rotate-[5deg] z-10"
        style={{
          background: badgeStyle.background,
          color: badgeStyle.color,
        }}
      >
        {beer.abv}%
      </div>

      {/* Image Container */}
      <Link href={`/bieren/${beer.slug}`} className="block">
        <div className={`h-[320px] md:h-[350px] border-b-4 mb-4 overflow-hidden flex items-center justify-center ${isBrews ? 'bg-[#fed3a6] border-[#dc5b26]' : 'bg-gray-100 border-dark'}`}>
          <Image
            src={beer.image}
            alt={beer.name}
            width={300}
            height={350}
            className="max-h-[90%] w-auto object-contain transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="px-2">
        <h3 className="text-2xl md:text-3xl leading-[0.95] mb-1">
          <Link href={`/bieren/${beer.slug}`} className={`transition-colors ${isBrews ? 'text-[#dc5b26] hover:text-[#b84a1e]' : 'hover:text-yellow'}`}>
            {beer.name}
          </Link>
        </h3>

        <p className={`font-bold uppercase text-sm mb-3 ${isBrews ? 'text-[#dc5b26]' : 'text-gray-500'}`}>
          {beer.style}
        </p>

        <p className={`text-sm mb-4 leading-relaxed min-h-[40px] ${isBrews ? 'text-[#b84a1e]' : 'text-gray-600'}`}>
          {beer.description}
        </p>

        {/* Full Width Button - Opens quick add modal */}
        {isAvailable ? (
          <button
            onClick={() => openModal(beer)}
            className={`btn-brutal w-full text-center text-base py-3 ${isBrews ? 'bg-[#dc5b26] border-[#dc5b26] text-[#fed3a6] hover:bg-[#b84a1e] hover:border-[#b84a1e]' : ''}`}
            style={{ transform: 'none' }}
          >
            Bestellen - Vanaf €{lowestPrice.toFixed(2)}
          </button>
        ) : (
          <div className="w-full bg-gray-200 text-gray-500 py-3 font-heading text-base text-center uppercase">
            Uitverkocht
          </div>
        )}
      </div>
    </article>
  );
}
