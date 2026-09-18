"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import {
  AGE_GATE_ADMIN_PREFIX,
  AGE_GATE_ATTR,
  AGE_GATE_STORAGE_KEY,
} from "@/lib/age-gate";

type GateState = "gating" | "denied" | "passed";

/**
 * sessionStorage is not reactive, so the "did this session pass?" flag is
 * exposed as a tiny external store. useSyncExternalStore is the primitive for
 * this: it renders the server snapshot (false) during hydration and swaps to
 * the real value right after, so the first render stays identical on server
 * and client and no hydration mismatch is possible.
 */
let listeners: Array<() => void> = [];
// Set when storage refuses the write (Safari lockdown / blocked storage) so a
// visitor who answered is not re-asked on every render. Module scope, so it
// resets on the next page load — which is the session-only behaviour we want.
let passedThisLoad = false;

function subscribe(onChange: () => void) {
  listeners.push(onChange);
  return () => {
    listeners = listeners.filter((l) => l !== onChange);
  };
}

function getSnapshot() {
  if (passedThisLoad) return true;
  try {
    return window.sessionStorage.getItem(AGE_GATE_STORAGE_KEY) === "1";
  } catch {
    return false; // storage blocked -> keep gating (fail safe)
  }
}

function getServerSnapshot() {
  return false;
}

function markVerified() {
  passedThisLoad = true;
  try {
    window.sessionStorage.setItem(AGE_GATE_STORAGE_KEY, "1");
  } catch {
    /* storage blocked: the module flag still carries this page load */
  }
  listeners.forEach((l) => l());
}

export default function AgeGate() {
  const pathname = usePathname();
  const isAdmin = !!pathname && pathname.startsWith(AGE_GATE_ADMIN_PREFIX);

  const verified = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [denied, setDenied] = useState(false);

  // First render is ALWAYS "gating" on both server and client: the overlay ships
  // in the SSR HTML, and the inline script in layout.tsx hides it before paint
  // when this session already passed.
  const state: GateState = denied
    ? "denied"
    : isAdmin || verified
      ? "passed"
      : "gating";

  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const deniedTitleRef = useRef<HTMLHeadingElement>(null);

  // 1. React owns the <html> attribute after hydration. It drives both the
  //    pre-paint hide rule and the CSS scroll lock in globals.css.
  useEffect(() => {
    const el = document.documentElement;
    if (state === "passed") el.setAttribute(AGE_GATE_ATTR, "1");
    else el.removeAttribute(AGE_GATE_ATTR);
  }, [state]);

  // 2. Take the rest of the page out of the tab order and the a11y tree.
  useEffect(() => {
    if (state === "passed") return;
    const own = overlayRef.current;
    const siblings = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== own
    );
    siblings.forEach((el) => {
      el.inert = true;
    });
    return () => {
      siblings.forEach((el) => {
        el.inert = false;
      });
    };
  }, [state]);

  // 3. Move focus into the dialog, and onto the new heading when denied.
  useEffect(() => {
    if (state === "passed") return;
    const target = state === "denied" ? deniedTitleRef.current : yesRef.current;
    target?.focus();
  }, [state]);

  // 4. Escape is swallowed on purpose: an age gate has no "cancel" semantics,
  //    and dismissing it would expose the site without an answer. Every state
  //    keeps a keyboard-reachable exit (the Terug button), so nobody is stuck.
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (e.key !== "Tab") return;
    const root = cardRef.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    const inside = !!active && root.contains(active);
    if (e.shiftKey && (!inside || active === first)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (!inside || active === last)) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const accept = () => markVerified();

  if (state === "passed") return null;

  return (
    <div
      ref={overlayRef}
      className="agegate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agegate-title"
      aria-describedby="agegate-desc"
      onKeyDown={handleKeyDown}
    >
      <div className="agegate-card" ref={cardRef}>
        {state === "gating" ? (
          <>
            <div className="agegate-logo">
              Troebel<span>.</span>
            </div>
            <span className="agegate-eyebrow">Even checken</span>
            <h2 className="agegate-title" id="agegate-title">
              Leeftijdsverificatie
            </h2>
            <p className="agegate-q" id="agegate-desc">
              Ben je 18 jaar of ouder om deze website te bezoeken?
            </p>
            <div className="agegate-actions">
              <button
                ref={yesRef}
                type="button"
                className="btn agegate-btn"
                onClick={accept}
              >
                Ja, ik ben 18+
              </button>
              <button
                type="button"
                className="btn-outline agegate-btn"
                onClick={() => setDenied(true)}
              >
                Nee
              </button>
            </div>
            <hr className="agegate-divider" />
            <p className="agegate-note">
              Door verder te gaan bevestig je dat je 18 jaar of ouder bent. Lees onze{" "}
              <a href="/voorwaarden/">algemene voorwaarden</a>.
            </p>
            <p className="agegate-note agegate-note--alt">
              Geniet, maar drink met mate.
            </p>
          </>
        ) : (
          <>
            <span className="agegate-eyebrow">Sorry</span>
            <h2
              className="agegate-title"
              id="agegate-title"
              ref={deniedTitleRef}
              tabIndex={-1}
            >
              Nog even geduld
            </h2>
            <p className="agegate-q" id="agegate-desc">
              Je moet 18 jaar of ouder zijn om deze website te bekijken. Tot over een
              paar jaar — dan schenken we er graag eentje voor je uit.
            </p>
            <div className="agegate-actions">
              <button
                type="button"
                className="btn-outline agegate-btn"
                onClick={() => setDenied(false)}
              >
                Terug
              </button>
            </div>
            <hr className="agegate-divider" />
            <p className="agegate-note">
              Meer weten over alcohol en verantwoord gedrag? Kijk op{" "}
              <a href="https://www.bob.be/" target="_blank" rel="noopener noreferrer">
                bob.be
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
}
