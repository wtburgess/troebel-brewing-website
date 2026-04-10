"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import Vanta component (no SSR - requires window)
const VantaBackground = dynamic(
  () => import("@/components/ui/VantaBackground"),
  { ssr: false }
);

interface HeroProps {
  tagline?: string;
  title?: string;
  highlightedWord?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  heroImage?: string;
  vantaEffect?: "fog" | "clouds";
}

export default function Hero({
  title = "TROEBEL IS<br/>HET NIEUWE",
  highlightedWord = "HELDER",
  subtitle = "Nano-brouwerij met een hoek af. Wij brouwen wat we zelf willen drinken.",
  primaryCta = { label: "Ontdek onze bieren", href: "#bieren" },
  heroImage = "/Cartoon brouwen.png",
  vantaEffect = "fog", // Change to "clouds" to test the other effect
}: HeroProps) {
  return (
    <VantaBackground
      effect={vantaEffect}
      className="min-h-screen border-b-[5px] border-yellow"
    >
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-[55%_45%] pt-[100px] relative overflow-hidden">
        {/* Left Content */}
        <div className="p-8 lg:p-12 z-10 flex flex-col justify-center">
          <h1
            className="text-cream leading-[0.85] mb-8 transform -rotate-2 animate-troebel-reveal"
            style={{
              textShadow: "5px 5px 0px var(--color-yellow)",
              fontSize: "clamp(3.5rem, 10vw, 7rem)",
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: title }} />
            <br />
            <span
              className="block text-transparent"
              style={{
                WebkitTextStroke: "2px var(--color-cream)",
              }}
            >
              {highlightedWord}
            </span>
          </h1>

          <div className="bg-dark/80 backdrop-blur-sm text-white font-bold text-lg md:text-xl p-4 mb-8 max-w-[500px] border-l-[5px] border-yellow animate-fade-in-up">
            {subtitle}
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link href={primaryCta.href} className="btn-brutal">
              {primaryCta.label} →
            </Link>
          </div>
        </div>

        {/* Right Image - Cartoon */}
        <div className="relative h-full min-h-[400px] flex items-center justify-center p-4">
          {/* Main Cartoon Image */}
          <div className="relative w-[90%] max-w-[700px] transform rotate-2 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] animate-troebel-reveal">
            <Image
              src={heroImage}
              alt="Troebel Brewing Cartoon"
              width={700}
              height={500}
              className="w-full h-auto border-[6px] border-white"
              style={{
                boxShadow:
                  "0 0 0 4px var(--color-dark), 15px 15px 0px rgba(0,0,0,0.1)",
              }}
              priority
            />

            {/* GARAGE MADE! Sticker - Bottom Right of Image */}
            <div
              className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-red text-white py-3 px-5 md:py-4 md:px-6 rounded-full font-hand text-lg md:text-xl border-[3px] border-dark text-center leading-tight z-30"
              style={{
                boxShadow: "4px 4px 0px rgba(0,0,0,0.3)",
                transform: "rotate(12deg)",
              }}
            >
              GARAGE
              <br />
              MADE!
            </div>
          </div>
        </div>
      </section>
    </VantaBackground>
  );
}
