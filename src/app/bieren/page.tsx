import { getAllBeers } from "@/lib/api/beers";
import BeerCatalog from "@/components/beer/BeerCatalog";

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

export default async function BierenPage() {
  const beers = await getAllBeers();

  return <BeerCatalog beers={beers} />;
}
