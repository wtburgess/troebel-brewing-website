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

type Status = "idle" | "sending" | "success" | "error";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(interestOptions[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleTileClick = (e: React.MouseEvent<HTMLAnchorElement>, value: string) => {
    e.preventDefault();
    setInterest(value);
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, interest, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error ?? "Versturen mislukt. Probeer het later opnieuw.");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg("Geen verbinding. Probeer het later opnieuw.");
    }
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
      <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
        <h3>Stuur ons een berichtje</h3>
        <div className="form-row">
          <label>Naam</label>
          <input
            type="text"
            placeholder="Jouw naam"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>E-mail</label>
          <input
            type="email"
            placeholder="jij@voorbeeld.be"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
          <textarea
            placeholder="Vertel ons iets. Of alles."
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button className="submit-btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Versturen..." : "Verstuur →"}
        </button>
        {status === "success" && (
          <p style={{ marginTop: "1rem", color: "var(--troebel-gold)", fontWeight: 700 }}>
            Bedankt! Je bericht is verstuurd. We nemen snel contact op.
          </p>
        )}
        {status === "error" && (
          <p style={{ marginTop: "1rem", color: "#c0392b", fontWeight: 600 }}>{errorMsg}</p>
        )}
      </form>
    </div>
  );
}
