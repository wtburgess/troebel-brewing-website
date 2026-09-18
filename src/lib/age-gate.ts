export const AGE_GATE_STORAGE_KEY = "troebel_age_ok";
export const AGE_GATE_ATTR = "data-age-ok";
export const AGE_GATE_ADMIN_PREFIX = "/admin";

/**
 * Runs synchronously as the first node in <body>, before the browser paints.
 * Marks <html> so the CSS in globals.css can hide the gate + unlock scrolling
 * for an already-verified session with zero flash. After hydration AgeGate.tsx
 * owns this attribute.
 *
 * If sessionStorage throws (Safari lockdown / storage blocked) the attribute
 * stays off and the gate shows — the correct fail-safe direction.
 *
 * NOTE: next.config.ts sets no Content-Security-Policy today. If one is ever
 * added, this inline script needs a nonce or a SHA-256 hash.
 */
export const AGE_GATE_INLINE_SCRIPT = `(function(){try{if(location.pathname.indexOf("${AGE_GATE_ADMIN_PREFIX}")===0||window.sessionStorage.getItem("${AGE_GATE_STORAGE_KEY}")==="1"){document.documentElement.setAttribute("${AGE_GATE_ATTR}","1")}}catch(e){}})()`;
