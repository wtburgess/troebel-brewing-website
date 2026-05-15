"use client";

import { useState } from "react";

type Tile = {
  label: string;
  sub: string;
  interest: string;
};

const tiles: Tile[] = [
  {
    label: "Particulier bestellen",
    sub: "Koop rechtstreeks bij ons. Afhalen of levering in Antwerpen.",
    interest: "Particulier bestellen",
  },
  {
    label: "Horeca aanvraag",
    sub: "Troebel op jouw kaart? Stuur ons je gegevens.",
    interest: "Horeca aanvraag",
  },
  {
    label: "Tapverhuur voor events",
    sub: "Datum, locatie, verwachte bezoekers — wij maken een offerte op maat.",
    interest: "Tapverhuur voor een event",
  },
  {
    label: "Custom / eigen bier",
    sub: "Vertel ons je idee, hoe wild ook. We kijken wat we samen kunnen maken.",
    interest: "Custom / eigen bier",
  },
];

const interestOptions = [
  "Particulier bestellen",
  "Horeca aanvraag",
  "Tapverhuur voor een event",
  "Custom / eigen bier",
  "Iets anders",
];

export default function ContactSection() {
  const [interest, setInterest] = useState(interestOptions[0]);

  const handleTileClick = (e: React.MouseEvent<HTMLAnchorElement>, value: string) => {
    e.preventDefault();
    setInterest(value);
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="contact-grid">
      <div className="contact-types">
        {tiles.map((t) => (
          <a
            key={t.label}
            href="#contact-form"
            onClick={(e) => handleTileClick(e, t.interest)}
            className="ct-item"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className="ct-icon">→</span>
            <div>
              <div className="ct-label">{t.label}</div>
              <div className="ct-sub">{t.sub}</div>
            </div>
          </a>
        ))}
        <div style={{ padding: "1.5rem 0", fontSize: ".88rem", color: "var(--mid)", lineHeight: 1.8 }}>
          <strong style={{ fontSize: "1rem", color: "var(--dark)" }}>Troebel Brewing</strong>
          <br />
          Congresstraat 22/01, 2060 Antwerpen
          <br />
          <a
            href="mailto:Troebel.brew@gmail.com"
            style={{ color: "var(--troebel-gold)", textDecoration: "none", fontWeight: 700 }}
          >
            Troebel.brew@gmail.com
          </a>
        </div>
      </div>
      <div className="contact-form" id="contact-form">
        <h3>Stuur ons een berichtje</h3>
        <div className="form-row">
          <label>Naam</label>
          <input type="text" placeholder="Jouw naam" />
        </div>
        <div className="form-row">
          <label>E-mail</label>
          <input type="email" placeholder="jij@voorbeeld.be" />
        </div>
        <div className="form-row">
          <label>Ik ben geïnteresseerd in</label>
          <select value={interest} onChange={(e) => setInterest(e.target.value)}>
            {interestOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Bericht</label>
          <textarea placeholder="Vertel ons iets. Of alles."></textarea>
        </div>
        <button className="submit-btn">Verstuur →</button>
      </div>
    </div>
  );
}
