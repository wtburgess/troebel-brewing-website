import type { Metadata } from "next";
import WebshopContent from "./WebshopContent";

export const metadata: Metadata = {
  title: "Craft Bier Bestellen | Webshop Troebel Brewing Co.",
  description:
    "Bestel onze Antwerpse craft bieren online. Verse kleine batches, direct van de brouwer. Afhalen bij de brouwerij op afspraak.",
  keywords: ["craft bier bestellen", "bier online bestellen antwerpen", "belgisch bier kopen", "artisanaal bier antwerpen", "troebel bier kopen"],
  alternates: {
    canonical: "https://troebelbrewing.be/webshop/",
  },
  openGraph: {
    title: "Craft Bier Bestellen | Webshop Troebel Brewing Co.",
    description:
      "Bestel onze Antwerpse craft bieren online. Verse kleine batches, direct van de brouwer.",
    url: "https://troebelbrewing.be/webshop/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Troebel Brewing Co. Webshop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Craft Bier Bestellen | Webshop Troebel Brewing Co.",
    description:
      "Bestel onze Antwerpse craft bieren online. Verse kleine batches, direct van de brouwer.",
  },
};

export default function WebshopPage() {
  return <WebshopContent />;
}
