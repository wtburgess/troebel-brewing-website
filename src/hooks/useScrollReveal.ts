"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Hook to trigger scroll reveal animations using IntersectionObserver
 * Adds 'visible' class to elements with 'scroll-reveal' class when they enter viewport
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", once = true } = options;

  useEffect(() => {
    const elements = document.querySelectorAll(
      ".scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right"
    );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);
}

/**
 * Hook for a single ref-based scroll reveal
 * Returns a ref to attach to the element you want to reveal
 */
export function useScrollRevealRef<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", once = true } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

/**
 * Component wrapper for scroll reveal with stagger support
 */
export function getStaggerClass(index: number, maxStagger = 8): string {
  const staggerIndex = Math.min(index + 1, maxStagger);
  return `stagger-${staggerIndex}`;
}
