/**
 * Brewery-themed section dividers
 * Foam wave and grain patterns for visual transitions between sections
 */

interface DividerProps {
  variant?: "foam" | "foam-inverse" | "grain";
  className?: string;
}

export default function SectionDivider({ variant = "foam", className = "" }: DividerProps) {
  if (variant === "foam") {
    return (
      <div className={`relative w-full h-12 -mt-1 ${className}`}>
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          fill="currentColor"
        >
          <path d="M0,60 C200,60 200,20 400,20 C600,20 600,50 800,40 C1000,30 1000,0 1200,0 L1200,60 Z" />
        </svg>
      </div>
    );
  }

  if (variant === "foam-inverse") {
    return (
      <div className={`relative w-full h-12 -mb-1 ${className}`}>
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full rotate-180"
          fill="currentColor"
        >
          <path d="M0,60 C200,60 200,20 400,20 C600,20 600,50 800,40 C1000,30 1000,0 1200,0 L1200,60 Z" />
        </svg>
      </div>
    );
  }

  // grain variant
  return (
    <div className={`relative w-full h-8 ${className}`}>
      <svg
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        fill="currentColor"
      >
        <path d="M0,16 Q150,0 300,16 T600,16 T900,16 T1200,16 L1200,32 L0,32 Z" />
      </svg>
    </div>
  );
}

/**
 * Hop leaf decorative element
 */
export function HopLeaf({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-6 h-6 text-primary ${className}`}
      fill="currentColor"
    >
      <path d="M12 2C7 2 3 6 3 11c0 4.5 3.5 8.5 8 9.5V22h2v-1.5c4.5-1 8-5 8-9.5 0-5-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z" />
      <circle cx="12" cy="11" r="3" />
    </svg>
  );
}
