"use client";

import { useEffect, useRef } from "react";

export default function HeroImage() {
  const imgRef = useRef<HTMLImageElement>(null);
  const hoveredRef = useRef(false);

  useEffect(() => {
    const update = () => {
      if (!imgRef.current) return;
      const progress = hoveredRef.current
        ? 1
        : Math.min(window.scrollY / window.innerHeight, 1);
      const gray = 100 - progress * 100;
      const contrast = 1.2 - progress * 0.15;
      imgRef.current.style.filter = `grayscale(${gray}%) contrast(${contrast})`;
      imgRef.current.style.transition = "filter 250ms ease-out";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });

    const img = imgRef.current;
    const onEnter = () => {
      hoveredRef.current = true;
      update();
    };
    const onLeave = () => {
      hoveredRef.current = false;
      update();
    };
    img?.addEventListener("mouseenter", onEnter);
    img?.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("scroll", update);
      img?.removeEventListener("mouseenter", onEnter);
      img?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src="https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=1200&q=80"
      alt="Troebel bier"
    />
  );
}
