"use client";

/**
 * Floating bubbles background effect - brewery themed
 * Creates subtle animated bubbles that rise up
 */
export default function Bubbles({ count = 12 }: { count?: number }) {
  // Generate random bubble properties
  const bubbles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 40 + 15, // 15-55px
    left: Math.random() * 100, // 0-100%
    duration: Math.random() * 8 + 8, // 8-16s
    delay: Math.random() * 5, // 0-5s
  }));

  return (
    <div className="bubbles-container">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            "--duration": `${bubble.duration}s`,
            "--delay": `${bubble.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
