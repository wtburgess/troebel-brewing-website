import Link from "next/link";

interface ProfessionalsSectionProps {
  title?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

export default function ProfessionalsSection({
  title = "TROEBEL OP JE TOOG?",
  features = [
    "GEEN STANDAARD PILS",
    "CONVERSATIE STARTER",
    "GEEN WURGCONTRACTEN",
    "PERSOONLIJKE LEVERING",
  ],
  ctaLabel = "Partner Worden",
  ctaHref = "/horeca",
}: ProfessionalsSectionProps) {
  return (
    <section className="bg-yellow py-16 md:py-24 px-4 md:px-8 text-center border-t-4 border-dark">
      <div
        className="bg-white border-4 border-dark inline-block p-6 md:p-12 transform rotate-1 max-w-[800px]"
        style={{ boxShadow: '10px 10px 0px var(--color-dark)' }}
      >
        <h2 className="text-3xl md:text-[3rem] mb-6 md:mb-8">{title}</h2>

        <ul className="list-none text-left font-heading text-xl md:text-2xl mb-6 md:mb-8 space-y-3 md:space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 md:gap-4">
              <div className="check-box" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          href={ctaHref}
          className="btn-brutal btn-brutal-dark inline-block transform -rotate-1"
          style={{ transform: 'rotate(-1deg) scale(1.1)' }}
        >
          {ctaLabel} →
        </Link>
      </div>
    </section>
  );
}
