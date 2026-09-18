import type { Metadata } from "next";
import { Anton, Roboto_Condensed, Permanent_Marker } from "next/font/google";
import "./globals.css";
import ModalProvider from "@/components/providers/ModalProvider";
import { AGE_GATE_INLINE_SCRIPT } from "@/lib/age-gate";
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
  keywords: ["craft bier antwerpen", "nano brouwerij", "belgisch craft bier", "bier kopen antwerpen", "artisanaal bier", "craft brewery antwerp", "troebel brewing", "bier bestellen antwerpen", "tapverhuur antwerpen"],
  authors: [{ name: "Troebel Brewing Co." }],
  openGraph: {
    title: "Troebel Brewing Co. | Hopmerkelijke Brouwsels uit Antwerpen",
    description: "Nano-brouwerij uit Antwerpen. Belgische craft bieren met karakter.",
    type: "website",
    locale: "nl_BE",
    siteName: "Troebel Brewing Co.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Troebel Brewing Co." }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@troebelbrewing",
    title: "Troebel Brewing Co. | Hopmerkelijke Brouwsels uit Antwerpen",
    description: "Nano-brouwerij uit Antwerpen. Belgische craft bieren met karakter.",
    images: ["/opengraph-image"],
  },
  verification: {
    google: "zfUPVTN5_QGrx2cRKWot2bA-tBISE5yEMu_4TXRo16w",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "Brewery"],
  "name": "Troebel Brewing Co.",
  "url": "https://troebelbrewing.be",
  "logo": "https://troebelbrewing.be/logo.jpg",
  "email": "troebel.brew@gmail.com",
  "priceRange": "€€",
  "foundingDate": "2022",
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
  "areaServed": {
    "@type": "City",
    "name": "Antwerpen",
  },
  "sameAs": [
    "https://www.instagram.com/troebelbrewing",
    "https://untappd.com/TroebelBrewing",
  ],
  "description": "Nano-brouwerij uit Antwerpen. Belgische craft bieren met karakter. Gebrouwen door vrienden, voor vrienden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl-BE" suppressHydrationWarning>
      <body
        className={`${anton.variable} ${robotoCondensed.variable} ${permanentMarker.variable} antialiased`}
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{ __html: AGE_GATE_INLINE_SCRIPT }} />
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
