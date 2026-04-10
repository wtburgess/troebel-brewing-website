// Untappd SVG icon
const UntappdIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
    <path d="M11.684 10.177l-1.912 3.397-1.912-3.397-3.397-1.912 3.397-1.912 1.912-3.397 1.912 3.397 3.397 1.912-3.397 1.912zm5.632 4.588l-1.303 2.316-1.303-2.316-2.316-1.303 2.316-1.303 1.303-2.316 1.303 2.316 2.316 1.303-2.316 1.303z" />
  </svg>
);

interface UntappdCtaProps {
  href?: string;
  label?: string;
}

export default function UntappdCta({
  href = "https://untappd.com/troebelbrewing",
  label = "Volg ons op Untappd",
}: UntappdCtaProps) {
  return (
    <section className="bg-dark py-8 text-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary text-dark px-8 py-4 text-[0.75rem] font-bold uppercase tracking-[0.15em] hover:bg-white transition-colors duration-300"
      >
        {label}
        <UntappdIcon />
      </a>
    </section>
  );
}
