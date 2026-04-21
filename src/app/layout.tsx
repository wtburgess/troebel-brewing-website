import type { Metadata } from "next";
import { Anton, Roboto_Condensed, Permanent_Marker } from "next/font/google";
import "./globals.css";
import ModalProvider from "@/components/providers/ModalProvider";
import PageViewTracker from "@/components/providers/PageViewTracker";
import { Analytics } from "@vercel/analytics/next";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://troebelbrewing.be'),
  title: "Troebel Brewing Co. | Hopmerkelijke Brouwsels uit Antwerpen",
  description: "Nano-brouwerij uit Antwerpen. Belgische craft bieren met karakter. Gebrouwen door vrienden, voor vrienden.",
  authors: [{ name: "Troebel Brewing Co." }],
  openGraph: {
    title: "Troebel Brewing Co. | Hopmerkelijke Brouwsels uit Antwerpen",
    description: "Nano-brouwerij uit Antwerpen. Belgische craft bieren met karakter.",
    type: "website",
    locale: "nl_BE",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Troebel Brewing Co." }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@troebelbrewing",
    title: "Troebel Brewing Co. | Hopmerkelijke Brouwsels uit Antwerpen",
    description: "Nano-brouwerij uit Antwerpen. Belgische craft bieren met karakter.",
    images: ["/opengraph-image"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "Brewery"],
  "name": "Troebel Brewing Co.",
  "url": "https://troebelbrewing.be",
  "logo": "https://troebelbrewing.be/logo.jpg",
  "email": "info@troebelbrewing.be",
  "telephone": "+32-123-45-67-89",
  "priceRange": "€€",
  "servesCuisine": "Craft Beer",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Congresstraat 22/01",
    "addressLocality": "Antwerpen",
    "postalCode": "2060",
    "addressCountry": "BE",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.2333,
    "longitude": 4.4025,
  },
  "sameAs": [
    "https://www.instagram.com/troebelbrewing",
    "https://untappd.com/TroebelBrewing",
  ],
  "description": "Nano-brouwerij uit Antwerpen. Belgische craft bieren met karakter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl-BE">
      <body
        className={`${anton.variable} ${robotoCondensed.variable} ${permanentMarker.variable} antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <ModalProvider />
        <PageViewTracker />
        <Analytics />
      </body>
    </html>
  );
}
