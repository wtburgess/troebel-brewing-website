import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="logo" style={{ color: 'var(--warm-white)' }}>TROEBEL <span style={{ color: 'var(--troebel-gold)' }}>BREWING</span></div>
          <span className="footer-tagline">fuck helder</span>
        </div>
        <div className="footer-col">
          <h5>Navigatie</h5>
          <Link href="/#bieren">Onze bieren</Link>
          <Link href="/#wie">Wie wij zijn</Link>
          <Link href="/#tap">Tapverhuur</Link>
          <Link href="/#contact">Contact</Link>
          <Link href="/voorwaarden">Voorwaarden</Link>
          <Link href="/admin">Beheer</Link>
        </div>
        <div className="footer-col">
          <h5>Contact</h5><p>Congresstraat 22/01</p><p>2060 Antwerpen, België</p><a href="mailto:Troebel.brew@gmail.com">Troebel.brew@gmail.com</a><a href="https://instagram.com/troebelbrewing" target="_blank" rel="noreferrer">@troebelbrewing</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Troebel Brewing Co. — <span>ongefilterd sinds 2022</span></p>
      </div>
    </footer>
  );
}