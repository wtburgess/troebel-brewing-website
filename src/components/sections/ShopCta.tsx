import Image from "next/image";
import Link from "next/link";

interface ShopCtaProps {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function ShopCta({
  title = "RECHTSTREEKS VAN DE BRON",
  ctaLabel = "Naar de Webshop",
  ctaHref = "/bestellen",
}: ShopCtaProps) {
  return (
    <section className="bg-cream py-16 md:py-24 px-4 text-center border-t-[5px] border-dark">
      <h2
        className="text-3xl md:text-[4rem] text-dark mb-8 md:mb-12"
        style={{ textShadow: '4px 4px 0px var(--color-yellow)' }}
      >
        {title}
      </h2>

      {/* Etiquette Image */}
      <div className="relative inline-block">
        <div
          className="transform rotate-2 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02]"
        >
          <Image
            src="/Brews almighty (clean).png"
            alt="Brews Almighty Label"
            width={600}
            height={600}
            className="w-full max-w-[500px] md:max-w-[600px] h-auto border-4 border-dark"
            style={{
              boxShadow: '10px 10px 0px var(--color-yellow)',
            }}
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-8 md:mt-12">
        <Link
          href={ctaHref}
          className="btn-brutal inline-block"
          style={{ transform: 'scale(1.1) rotate(-2deg)' }}
        >
          {ctaLabel} →
        </Link>
      </div>
    </section>
  );
}
