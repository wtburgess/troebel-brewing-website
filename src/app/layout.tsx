import type { Metadata } from "next";
import { Anton, Roboto_Condensed, Permanent_Marker } from "next/font/google";
import "./globals.css";
import ModalProvider from "@/components/providers/ModalProvider";

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
  metadataBase: new URL('https://troebel.wotis-cloud.com'),
  title: "Troebel Brewing Co. | Hopmerkelijke Brouwsels uit Antwerpen",
  description: "Nano-brouwerij uit Antwerpen. Belgische craft bieren met karakter. Gebrouwen door vrienden, voor vrienden.",
  keywords: ["craft beer", "Belgian beer", "nano brewery", "Antwerp", "Troebel", "Belgian Pale Ale", "IPA"],
  authors: [{ name: "Troebel Brewing Co." }],
  openGraph: {
    title: "Troebel Brewing Co. | Hopmerkelijke Brouwsels uit Antwerpen",
    description: "Nano-brouwerij uit Antwerpen. Belgische craft bieren met karakter.",
    type: "website",
    locale: "nl_BE",
  },
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
        {children}
        <ModalProvider />
      </body>
    </html>
  );
}
