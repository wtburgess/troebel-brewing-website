import type { Metadata } from "next";
import HorecaContent from "./HorecaContent";
import { faq } from "./faqData";

export const metadata: Metadata = {
  title: "Horeca samenwerking | Troebel Brewing Co.",
  description:
    "Craft bier voor jouw restaurant, café of bar. Persoonlijke levering in regio Antwerpen, flexibele bestellingen en exclusieve batches.",
  openGraph: {
    title: "Horeca samenwerking | Troebel Brewing Co.",
    description:
      "Craft bier voor jouw restaurant, café of bar. Persoonlijke levering in regio Antwerpen, flexibele bestellingen en exclusieve batches.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Troebel Brewing Co. Horeca" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Horeca samenwerking | Troebel Brewing Co.",
    description:
      "Craft bier voor jouw restaurant, café of bar. Persoonlijke levering in regio Antwerpen, flexibele bestellingen en exclusieve batches.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function HorecaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HorecaContent />
    </>
  );
}
