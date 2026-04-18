import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomepageBeers from '@/components/sections/HomepageBeers';
import { getFeaturedBeers } from '@/lib/api/beers';

export const revalidate = 60;

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
          <div className="hero-label">Vers gebrouwen // Antwerpen</div>
          <img src="https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=1200&q=80" alt="Troebel bier" />
          <div className="hero-stamp">100%<br />ongefilterd</div>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee-inner">
          <span className="marquee-text">RENBIER <span className="marquee-dot">///</span> FRAMBO <span className="marquee-dot">///</span> BREWS ALMIGHTY <span className="marquee-dot">///</span> TAPVERHUUR <span className="marquee-dot">///</span> HORECA <span className="marquee-dot">///</span> EVENTS <span className="marquee-dot">///</span> CUSTOM BIER <span className="marquee-dot">///</span> </span>
          <span className="marquee-text">RENBIER <span className="marquee-dot">///</span> FRAMBO <span className="marquee-dot">///</span> BREWS ALMIGHTY <span className="marquee-dot">///</span> TAPVERHUUR <span className="marquee-dot">///</span> HORECA <span className="marquee-dot">///</span> EVENTS <span className="marquee-dot">///</span> CUSTOM BIER <span className="marquee-dot">///</span> </span>
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

          <div className="beer-card custom">
            <div className="beer-img">
              <span className="beer-abv">???</span>
              <img src="/Moeskop_mockup.jpeg" alt="Custom bier" />
            </div>
            <div className="beer-body">
              <h3 className="beer-name">JOUW BIER</h3>
              <div className="beer-style">Custom</div>
              <p className="beer-desc">Jouw merk, jouw label, jouw recept. Van concept tot kroonkurk. Wij brouwen het, jij neemt de credits.</p>
              <a href="#contact" className="beer-btn">Vertel ons je idee →</a>
            </div>
          </div>

        </div>
      </section>

      {/* WIE WIJ ZIJN */}
      <section className="wie" id="wie">
        <div className="wie-inner">
          <div className="wie-txt">
            <span className="section-label">wie wij zijn</span>
            <div className="section-title">TROEBEL<br />VAN<br />KARAKTER</div>
            <p>Troebel Brewing is een kleine brouwerij uit Antwerpen die in 2022 begon met één simpele overtuiging: <strong>ongefilterd is eerlijker.</strong></p>
            <p>We brouwen bieren die ergens naar smaken. Geen glad verhaal, geen neppe rustieke foto's. Gewoon bier, met tanden.</p>
            <p>Onze bieren zijn troebel omdat we niks eruit filteren. Geen smaak, geen karakter, geen gistdeeltjes die eigenlijk gewoon lekker zijn.</p>
            <p>We leveren aan particulieren, horeca en events — en we helpen je ook je eigen bier te brouwen. <strong>Want iedereen verdient een eigen bier.</strong></p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#contact" className="btn">Samenwerken →</a>
              <a href="#bieren" className="btn-outline">Onze bieren</a>
            </div>
            <div className="wie-team-img">
              <img src="/troebel-team.jpg" alt="Het Troebel Team" />
            </div>
          </div>
          <div className="wie-visual">
            <div className="wie-block">
              <span className="wie-num">01</span>
              <h4>Klein maar bijzonder</h4>
              <p>We brouwen in kleine batches. Geen schaalvoordelen, wel smaakvoordelen.</p>
            </div>
            <div className="wie-block">
              <span className="wie-num">02</span>
              <h4>Van Antwerpen, voor iedereen</h4>
              <p>Gebrouwen in de stad. Gedronken overal. Het liefst op een terras in de zon.</p>
            </div>
            <div className="wie-block">
              <span className="wie-num">03</span>
              <h4>Geen filter, geen bullshit</h4>
              <p>Wat in het bier zit, zit ook in onze communicatie. Eerlijk, direct, een beetje koppig.</p>
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
              <li>Volledige installatie inclusief</li>
              <li>Keuze uit onze bieren op tap</li>
              <li>Op maat voor kleine en grote events</li>
              <li>Horeca & privé mogelijk</li>
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
          <div className="contact-grid">
            <div className="contact-types">
              <div className="ct-item"><span className="ct-icon">→</span><div><div className="ct-label">Particulier bestellen</div><div className="ct-sub">Koop rechtstreeks bij ons. Afhalen of levering in Antwerpen.</div></div></div>
              <div className="ct-item"><span className="ct-icon">→</span><div><div className="ct-label">Horeca aanvraag</div><div className="ct-sub">Troebel op jouw kaart? Stuur ons je zaakgegevens.</div></div></div>
              <div className="ct-item"><span className="ct-icon">→</span><div><div className="ct-label">Tapverhuur voor events</div><div className="ct-sub">Datum, locatie, verwachte bezoekers — wij maken een offerte op maat.</div></div></div>
              <div className="ct-item"><span className="ct-icon">→</span><div><div className="ct-label">Custom / eigen bier</div><div className="ct-sub">Vertel ons je idee, hoe wild ook. We kijken wat we samen maken.</div></div></div>
              <div style={{ padding: '1.5rem 0', fontSize: '.88rem', color: 'var(--mid)', lineHeight: 1.8 }}>
                <strong style={{ fontSize: '1rem', color: 'var(--dark)' }}>Troebel Brewing</strong><br />
                Congresstraat 22/01, 2060 Antwerpen<br />
                <a href="mailto:info@troebelbrewing.be" style={{ color: 'var(--troebel-gold)', textDecoration: 'none', fontWeight: 700 }}>info@troebelbrewing.be</a>
              </div>
            </div>
            <div className="contact-form">
              <h3>Schrijf ons</h3>
              <div className="form-row"><label>Naam</label><input type="text" placeholder="Jouw naam" /></div>
              <div className="form-row"><label>E-mail</label><input type="email" placeholder="jij@voorbeeld.be" /></div>
              <div className="form-row">
                <label>Ik ben geïnteresseerd in</label>
                <select>
                  <option>Particulier bestellen</option><option>Horeca aanvraag</option><option>Tapverhuur voor een event</option><option>Custom / eigen bier</option><option>Iets anders</option>
                </select>
              </div>
              <div className="form-row"><label>Bericht</label><textarea placeholder="Vertel ons iets. Of alles."></textarea></div>
              <button className="submit-btn">Verstuur →</button>
            </div>
          </div>
        </div>
      </section>

      <a href="#bieren" className="sticker" style={{ textDecoration: 'none' }}>FUCK<br />HELDER</a>
      <Footer />
    </>
  );
}
