interface MarqueeProps {
  items?: string[];
}

export default function Marquee({
  items = [
    "NIEUWE RELEASE: MOESKOPJE",
    "GRATIS LEVERING VANAF €50",
    "DRINK LOKAAL OF STERF",
    "TROEBEL BREWING ANTWERPEN",
  ],
}: MarqueeProps) {
  // Duplicate items to create seamless loop
  const marqueeText = items.map((item) => `!!! ${item} `).join("");

  return (
    <div
      className="bg-yellow text-dark py-4 overflow-hidden whitespace-nowrap border-t-4 border-b-4 border-dark font-heading text-2xl z-20 relative -mt-8"
      style={{ transform: 'rotate(-1deg) scale(1.02)' }}
    >
      <div className="marquee-track">
        {marqueeText}
        {marqueeText}
      </div>
    </div>
  );
}
