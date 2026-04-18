import React from 'react';
import Link from 'next/link';
import CartLink from './CartLink';

export default function Header() {
  return (
    <header className="hd">
      <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/logo.jpg" alt="Troebel Brewing Co." style={{ height: '75px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} />
      </Link>
      <nav>
        <ul className="nav">
          <li><Link href="/#bieren">Bieren</Link></li>
          <li><Link href="/#wie">Wie wij zijn</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
        </ul>
      </nav>
      <CartLink />
    </header>
  );
}
