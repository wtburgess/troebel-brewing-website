"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Vanta effect interface
interface VantaEffectInstance {
  destroy: () => void;
  setOptions: (options: Record<string, unknown>) => void;
  resize: () => void;
}

interface VantaBackgroundProps {
  effect?: "fog" | "clouds";
  className?: string;
  children?: React.ReactNode;
}

// Troebel brand colors converted to hex integers
const COLORS = {
  dark: 0x1c1c1c,
  darker: 0x0d0d0d,
  cream: 0xfffdf7,
  gold: 0xd4a017,
  goldDark: 0xb8860b,
  yellow: 0xffc000,
};

// FOG effect configuration - atmospheric, matches "troebel" theme
const FOG_CONFIG = {
  highlightColor: COLORS.gold,
  midtoneColor: COLORS.darker,
  lowlightColor: COLORS.cream,
  baseColor: COLORS.dark,
  blurFactor: 0.6,
  speed: 0.8,
  zoom: 1.2,
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200,
  minWidth: 200,
};

// CLOUDS effect configuration - dramatic sky
const CLOUDS_CONFIG = {
  skyColor: COLORS.darker,
  cloudColor: COLORS.gold,
  cloudShadowColor: COLORS.cream,
  sunColor: COLORS.yellow,
  sunGlareColor: 0xff8833,
  sunlightColor: 0xfff7f8,
  speed: 0.5,
  scale: 2,
  scaleMobile: 6,
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200,
  minWidth: 200,
};

export default function VantaBackground({
  effect = "fog",
  className = "",
  children,
}: VantaBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<VantaEffectInstance | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically import Vanta effect
    const loadVanta = async () => {
      try {
        // Make THREE available globally (Vanta requires this)
        (window as unknown as { THREE: typeof THREE }).THREE = THREE;

        if (effect === "fog") {
          const VANTA_FOG = (await import("vanta/dist/vanta.fog.min")).default;
          vantaEffectRef.current = VANTA_FOG({
            el: containerRef.current,
            THREE,
            ...FOG_CONFIG,
          });
        } else if (effect === "clouds") {
          const VANTA_CLOUDS = (await import("vanta/dist/vanta.clouds.min")).default;
          vantaEffectRef.current = VANTA_CLOUDS({
            el: containerRef.current,
            THREE,
            ...CLOUDS_CONFIG,
          });
        }
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load Vanta effect:", error);
      }
    };

    loadVanta();

    // Cleanup on unmount
    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [effect]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        // Fallback background while Vanta loads
        backgroundColor: isLoaded ? "transparent" : "#1C1C1C",
      }}
    >
      {/* Content overlay */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
