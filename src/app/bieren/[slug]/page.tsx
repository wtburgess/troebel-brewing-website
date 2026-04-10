import { notFound } from "next/navigation";
import { getBeerBySlug, getAllBeers, getAllBeerSlugs } from "@/lib/api/beers";
import { hasAvailableVariants } from "@/types/beer";
import BeerDetailClient from "@/components/beer/BeerDetailClient";

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

// Generate static paths for all beers at build time
export async function generateStaticParams() {
  const slugs = await getAllBeerSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function BeerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const beer = await getBeerBySlug(slug);

  if (!beer) {
    notFound();
  }

  // Get all beers for related beers section
  const allBeers = await getAllBeers();

  // Get related beers (excluding current, only available ones)
  const relatedBeers = allBeers
    .filter((b) => b.id !== beer.id && hasAvailableVariants(b))
    .slice(0, 3);

  return <BeerDetailClient beer={beer} relatedBeers={relatedBeers} />;
}
