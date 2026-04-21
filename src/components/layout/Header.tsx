"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartLink from './CartLink';

const HERO_PAGES = ['/', '/verhaal', '/horeca'];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const isHeroPage = HERO_PAGES.includes(pathname);

  useEffect(() => {
    if (!isHeroPage) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHeroPage]);

  const transparent = isHeroPage && !scrolled;

  return (
    <header
      className="hd"
      style={transparent ? { background: 'transparent', borderBottomColor: 'transparent' } : undefined}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/logo.jpg"
          alt="Troebel Brewing Co."
          style={{
            height: '75px',
            width: 'auto',
            objectFit: 'contain',
            mixBlendMode: transparent ? 'normal' : 'multiply',
          }}
        />
      </Link>
      <nav>
        <ul className="nav" style={transparent ? { color: 'var(--warm-white)' } : undefined}>
          <li><Link href="/#bieren" style={transparent ? { color: 'var(--warm-white)' } : undefined}>Bieren</Link></li>
          <li><Link href="/#wie" style={transparent ? { color: 'var(--warm-white)' } : undefined}>Wie wij zijn</Link></li>
          <li><Link href="/#contact" style={transparent ? { color: 'var(--warm-white)' } : undefined}>Contact</Link></li>
        </ul>
      </nav>
      <CartLink />
    </header>
  );
}
