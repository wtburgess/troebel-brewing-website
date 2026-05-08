"use client";

import { useEffect, useRef } from "react";

export default function HeroImage() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const update = () => {
      if (!imgRef.current) return;
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      const gray = 100 - progress * 100;
      const contrast = 1.2 - progress * 0.15;
      imgRef.current.style.filter = `grayscale(${gray}%) contrast(${contrast})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <img
      ref={imgRef}
      src="https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=1200&q=80"
      alt="Troebel bier"
    />
  );
}
