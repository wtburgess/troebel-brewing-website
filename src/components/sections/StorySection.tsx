'use client';

import Image from "next/image";
import Link from "next/link";

interface StorySectionProps {
  title?: string;
  paragraphs?: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

export default function StorySection({
  title = "WIJ ZIJN<br/>TROEBEL",
  paragraphs = [
    "Wat begon in een garage met een tweedehands brouwketel en te veel goesting, is nu Troebel.",
    "Wij geloven niet in gladgestreken marketing of smaakloos bier. Elk brouwsel heeft karakter.",
  ],
  ctaLabel = "Het hele verhaal",
  ctaHref = "/verhaal",
}: StorySectionProps) {
  return (
    <section className="bg-dark text-cream py-16 md:py-24 px-4 md:px-8 relative overflow-hidden stripe-border-top">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image - Left Side */}
          <div className="relative">
            <div
              className="polaroid"
              style={{ transform: 'rotate(-3deg)' }}
            >
              <Image
                src="/founders.jpg"
                alt="Founders of Troebel Brewing"
                width={600}
                height={450}
                className="w-full"
              />
              <div className="text-center font-hand text-xl md:text-2xl mt-4 text-dark">
                De Schuldigen (2024)
              </div>
            </div>
          </div>

          {/* Content - Right Side */}
          <div className="relative z-10">
            <h2
              className="text-4xl md:text-[4rem] text-yellow mb-6 md:mb-8 leading-[0.9] font-heading uppercase"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            <div className="space-y-4 mb-6">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-lg md:text-xl leading-relaxed ${
                    index === 0 ? 'text-cream' : 'text-gray-400'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="btn-brutal inline-block"
                style={{ background: 'var(--color-white)', color: 'var(--color-dark)' }}
              >
                {ctaLabel} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
