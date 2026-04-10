import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAllBeers } from "@/lib/api/beers";
import BeerDetailClient from "@/components/beer/BeerDetailClient";
import { Beer } from "@/types/beer";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const beers = await getAllBeers();
  const beer = beers.find((b) => b.slug === slug);

  if (!beer) {
    return {
      title: "Bier niet gevonden | Troebel Brewing",
    };
  }

  return {
    title: `${beer.name} - ${beer.style} | Troebel Brewing`,
    description: beer.description,
  };
}

export async function generateStaticParams() {
  try {
    const beers = await getAllBeers();
    return beers.map((beer) => ({
      slug: beer.slug,
    }));
  } catch (error) {
    return [];
  }
}

export default async function BeerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let beers: Beer[] = [];
  
  try {
    beers = await getAllBeers();
  } catch (error) {
    console.error("Failed to fetch beers", error);
  }
  
  const beer = beers.find((b) => b.slug === slug);
  
  if (!beer) {
    notFound();
  }

  // Get up to 3 related beers to show at the bottom
  const relatedBeers = beers
    .filter((b) => b.id !== beer.id && b.category === beer.category)
    .slice(0, 3);
    
  if (relatedBeers.length < 3) {
    const additionalBeers = beers.filter((b) => b.id !== beer.id && !relatedBeers.find((r) => r.id === b.id));
    relatedBeers.push(...additionalBeers.slice(0, 3 - relatedBeers.length));
  }

  return <BeerDetailClient beer={beer} relatedBeers={relatedBeers} />;
}