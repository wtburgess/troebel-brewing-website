"use client";

import Link from "next/link";

interface HeroProps {
  tagline?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  heroImage?: string;
}

export default function Hero({
  tagline = "Nano-brouwerij uit Antwerpen",
  title = "TROUBLE",
  titleAccent = "Brewing?",
  description = "Nee, Troebel. Bier met karakter, gebrouwen door vrienden voor vrienden. Ongefilterd, ongedwongen en altijd in voor iets nieuws.",
  primaryCta = { label: "Onze Bieren", href: "#bieren" },
  secondaryCta = { label: "Untappd", href: "https://untappd.com/troebelbrewing" },
  heroImage = "/schol brews.png",
}: HeroProps) {
  return (
    <section className="hero min-h-screen bg-dark relative">
      {/* Desktop: 3-column grid | Mobile: stacked */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[auto_1fr_auto]">

        {/* Hero Image - Top on mobile, Right column on desktop */}
        <div
          className="lg:col-start-3 lg:row-start-1 lg:row-end-4 relative h-[40vh] lg:h-auto lg:min-h-full order-first lg:order-none bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        >
          {/* Gradient overlay - bottom fade on mobile, left fade on desktop */}
          <div
            className="absolute inset-0 lg:hidden"
            style={{
              background: "linear-gradient(to bottom, transparent 60%, var(--color-dark) 100%)",
            }}
          />
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              background: "linear-gradient(to right, var(--color-dark), transparent 50%)",
            }}
          />
        </div>

        {/* Content Container - overlaps image slightly on mobile */}
        <div className="lg:col-span-2 lg:row-span-3 flex flex-col justify-between -mt-16 lg:mt-0 relative z-10">

          {/* Tagline */}
          <p
            className="pt-8 lg:pt-40 px-6 lg:px-16 text-primary text-xs lg:text-sm tracking-[0.3em] lg:tracking-[0.4em] uppercase animate-fade-in-up"
          >
            {tagline}
          </p>

          {/* Main Title + Description Block */}
          <div className="px-6 lg:px-16 py-4 lg:py-0 flex-1 flex flex-col justify-center">
            <h1
              className="font-body font-black text-cream uppercase leading-[0.85] animate-troebel-reveal"
              style={{
                fontSize: "clamp(3.5rem, 15vw, 14rem)",
                letterSpacing: "-0.03em",
              }}
            >
              {title}
              <span
                className="block font-heading font-normal italic text-primary normal-case"
                style={{
                  fontSize: "0.6em",
                  letterSpacing: "0",
                  transform: "translateY(-0.2em)",
                }}
              >
                {titleAccent}
              </span>
            </h1>

            {/* Description - tucked under title */}
            <div
              className="mt-4 lg:mt-8 max-w-[400px] lg:max-w-[700px] animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <p className="font-heading italic text-primary text-xl lg:text-4xl leading-[1.3]">
                Nee, Troebel.
              </p>
              <p
                className="mt-2 lg:mt-3 text-sm lg:text-xl leading-[1.7] lg:leading-[1.6]"
                style={{ color: "rgba(255,253,247,0.7)" }}
              >
                Bier met karakter, gebrouwen door vrienden voor vrienden.
                <span className="hidden lg:inline"> Ongefilterd, ongedwongen en altijd in voor iets nieuws.</span>
              </p>
            </div>
          </div>

          {/* Bottom Section - CTAs */}
          <div className="px-6 lg:px-16 pb-8 lg:pb-16 flex justify-center lg:justify-end">

            {/* CTAs - Block Style matching wireframe */}
            <div
              className="flex flex-col sm:flex-row gap-0 w-full sm:w-auto animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Link
                href={primaryCta.href}
                className="bg-primary hover:bg-cream px-8 lg:px-12 py-4 lg:py-6 font-extrabold uppercase tracking-[0.1em] text-sm transition-all duration-200 text-center"
                style={{ color: "#000000" }}
              >
                {primaryCta.label}
              </Link>
              <Link
                href={secondaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent hover:bg-cream px-8 lg:px-12 py-4 lg:py-6 font-semibold uppercase tracking-[0.1em] text-sm border-2 border-cream transition-all duration-200 text-center text-white hover:!text-black"
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
