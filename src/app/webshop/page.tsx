import type { Metadata } from "next";
import WebshopContent from "./WebshopContent";

export const metadata: Metadata = {
  title: "Webshop | Troebel Brewing Co.",
  description:
    "Bestel onze Antwerpse craft bieren online. Afhalen bij de brouwerij op afspraak.",
  openGraph: {
    title: "Webshop | Troebel Brewing Co.",
    description:
      "Bestel onze Antwerpse craft bieren online. Afhalen bij de brouwerij op afspraak.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Troebel Brewing Co. Webshop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Webshop | Troebel Brewing Co.",
    description:
      "Bestel onze Antwerpse craft bieren online. Afhalen bij de brouwerij op afspraak.",
  },
};

export default function WebshopPage() {
  return <WebshopContent />;
}
