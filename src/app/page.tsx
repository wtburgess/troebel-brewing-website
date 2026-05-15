import type { Metadata } from "next";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomepageBeers from '@/components/sections/HomepageBeers';
import HeroImage from '@/components/sections/HeroImage';
import ContactSection from '@/components/sections/ContactSection';
import { getFeaturedBeers } from '@/lib/api/beers';

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Troebel Brewing Co. | Hopmerkelijke Brouwsels uit Antwerpen",
  description: "Nano-brouwerij uit Antwerpen. Belgische craft bieren met karakter. Gebrouwen door vrienden, voor vrienden.",
  openGraph: {
    title: "Troebel Brewing Co. | Hopmerkelijke Brouwsels uit Antwerpen",
    description: "Nano-brouwerij uit Antwerpen. Belgische craft bieren met karakter.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Troebel Brewing Co." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Troebel Brewing Co. | Hopmerkelijke Brouwsels uit Antwerpen",
    description: "Nano-brouwerij uit Antwerpen. Belgische craft bieren met karakter.",
  },
};

export default async function Home() {
  const featured = await getFeaturedBeers();

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <span className="hero-eyebrow">Antwerpen // est. 2022</span>
          <h1>FUCK<br /><span className="outline">HELDER</span></h1>
          <p className="hero-sub">Bier voor wie niet alles wil uitklaren.</p>
          <div className="hero-cta">
            <a href="#bieren" className="btn" style={{ fontSize: '1rem', padding: '.65rem 2rem' }}>Onze bieren →</a>
            <a href="#contact" className="btn-outline">Samenwerken</a>
          </div>
          <div className="hero-tag">geen filter</div>
        </div>
        <div className="hero-right">
          <div className="hero-label">Brouwsels // Antwerpen</div>
          <HeroImage />
          <div className="hero-stamp">100%<br />ongefilterd</div>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee-inner">
          <span className="marquee-text">FUCK HELDER <span className="marquee-dot">///</span> BIER VOOR WIE NIET ALLES WIL UITKLAREN <span className="marquee-dot">///</span> FUCK HELDER <span className="marquee-dot">///</span> BIER VOOR WIE NIET ALLES WIL UITKLAREN <span className="marquee-dot">///</span> FUCK HELDER <span className="marquee-dot">///</span> BIER VOOR WIE NIET ALLES WIL UITKLAREN <span className="marquee-dot">///</span> FUCK HELDER <span className="marquee-dot">///</span> BIER VOOR WIE NIET ALLES WIL UITKLAREN <span className="marquee-dot">///</span> FUCK HELDER <span className="marquee-dot">///</span> BIER VOOR WIE NIET ALLES WIL UITKLAREN <span className="marquee-dot">///</span> </span>
          <span className="marquee-text">FUCK HELDER <span className="marquee-dot">///</span> BIER VOOR WIE NIET ALLES WIL UITKLAREN <span className="marquee-dot">///</span> FUCK HELDER <span className="marquee-dot">///</span> BIER VOOR WIE NIET ALLES WIL UITKLAREN <span className="marquee-dot">///</span> FUCK HELDER <span className="marquee-dot">///</span> BIER VOOR WIE NIET ALLES WIL UITKLAREN <span className="marquee-dot">///</span> FUCK HELDER <span className="marquee-dot">///</span> BIER VOOR WIE NIET ALLES WIL UITKLAREN <span className="marquee-dot">///</span> FUCK HELDER <span className="marquee-dot">///</span> BIER VOOR WIE NIET ALLES WIL UITKLAREN <span className="marquee-dot">///</span> </span>
        </div>
      </div>

      {/* BEERS */}
      <section className="beers" id="bieren">
        <div className="beers-header">
          <span className="section-label">wat we brouwen</span>
          <div className="section-title">ONZE<br />BIEREN</div>
        </div>
        <div className="beer-grid">

          <HomepageBeers beers={featured} />

          <a href="#contact" className="beer-card custom" style={{ textDecoration: 'none' }}>
            <div className="beer-img">
              <span className="beer-abv">???</span>
              <img src="/Moeskop_mockup.jpeg" alt="Custom bier" />
            </div>
            <div className="beer-body">
              <h3 className="beer-name">JOUW BIER</h3>
              <div className="beer-style">Custom</div>
              <p className="beer-desc">Jouw merk, jouw label, jouw recept. Van concept tot kroonkurk. Wij brouwen het, jij neemt de credits.</p>
              <span className="beer-btn">Vertel ons je idee →</span>
            </div>
          </a>

        </div>
      </section>

      {/* WIE WIJ ZIJN */}
      <section className="wie" id="wie">
        <div className="wie-inner">
          <div className="wie-txt">
            <span className="section-label">wie wij zijn</span>
            <div className="section-title">TROEBEL<br />VAN<br />KARAKTER</div>
            <p>Wat in 2022 begon als een experiment van een groep vrienden op een dakterras in Borgerhout, is inmiddels geland op de Dageraadplaats. In ons lab boven Café De Moeskop focussen we op wat we het leukst vinden: experimenteren op kleine schaal.</p>
            <p>Bij ons geen massaproductie, maar creativiteit in kleine volumes. En voor wie het zich afvraagt: nee, onze bieren zijn niet altijd troebel... als je er iets te veel van drinkt, zouden je gedachten dat wel eens kunnen worden.</p>
            <p>We leveren aan particulieren, horeca en events — en we helpen je ook je eigen bier te brouwen.</p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#contact" className="btn">Samenwerken →</a>
              <a href="#bieren" className="btn-outline">Onze bieren</a>
            </div>
          </div>
          <div className="wie-visual">
            <div className="wie-block">
              <span className="wie-num">01</span>
              <h4>Van Antwerpen, voor iedereen</h4>
              <p>Ontwikkeld in Antwerpen, overal gedronken.</p>
            </div>
            <div className="wie-block">
              <span className="wie-num">02</span>
              <h4>The lab</h4>
              <p>In ons lab experimenteren we op kleine schaal.</p>
            </div>
            <div className="wie-block">
              <span className="wie-num">03</span>
              <h4>Craft till I die</h4>
              <p>Kleine batches vol smaak.</p>
            </div>
            <div className="wie-team-img">
              <img src="/troebel-team.jpg" alt="Het Troebel Team" />
            </div>
          </div>
        </div>
      </section>

      {/* TAPVERHUUR */}
      <section className="tap" id="tap">
        <div className="tap-inner">
          <div>
            <span className="section-label" style={{ color: 'var(--troebel-gold)' }}>tapverhuur</span>
            <h2>JOUW EVENT,<br />ONZE <span>TAP</span></h2>
            <p>Wij leveren de tap, het bier en de kennis. Jij geniet van het feestje. Simpeler dan het klinkt, mooier dan je verwacht.</p>
            <ul className="tap-features">
              <li>Volledige installatie</li>
              <li>Keuze uit onze bieren op tap</li>
              <li>Antwerpen en omstreken</li>
            </ul>
            <a href="#contact" className="btn" style={{ fontSize: '1rem', padding: '.65rem 2rem' }}>Vraag een offerte →</a>
          </div>
          <div className="tap-img-wrap">
            <img src="/bbq.jpg" alt="Garden party met vrienden" />
            <div className="tap-img-badge">Beschikbaar voor events</div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="contact-inner">
          <span className="section-label">neem contact op</span>
          <div className="section-title">LATEN WE<br />IETS MAKEN</div>
          <ContactSection />
        </div>
      </section>

      <a href="#bieren" className="sticker" style={{ textDecoration: 'none' }}>
        <svg viewBox="0 0 190 190" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <path id="sticker-ring" d="M 95,95 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
          </defs>
          <text fontSize="13" fill="#1C1C1C" fontFamily="Anton, sans-serif" textAnchor="start">
            <textPath href="#sticker-ring" textLength="475" lengthAdjust="spacing" startOffset="7">NIEUW BIER • NIEUW BIER • NIEUW BIER •</textPath>
          </text>
        </svg>
        <img src="/Frambo_mockup.png" alt="Frambo" style={{ width: '115px', height: '135px', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
      </a>
      <Footer />
    </>
  );
}
