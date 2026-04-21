import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algemene voorwaarden | Troebel Brewing Co.",
  description:
    "Algemene voorwaarden voor de webshop van Troebel Brewing Co. — bestellingen, afhaling, herroeping en privacy.",
  openGraph: {
    title: "Algemene voorwaarden | Troebel Brewing Co.",
    description:
      "Algemene voorwaarden voor de webshop van Troebel Brewing Co. — bestellingen, afhaling, herroeping en privacy.",
  },
  robots: { index: false, follow: true },
};

export default function VoorwaardenPage() {
  return (
    <>
      <Header />
      <main>
        <section className="webshop-hero">
          <span className="webshop-hero-eyebrow">de kleine lettertjes</span>
          <h1 className="webshop-hero-title">ALGEMENE VOORWAARDEN</h1>
          <p className="webshop-hero-sub">
            Duidelijke afspraken. Geen verrassingen achteraf.
          </p>
        </section>

        <section className="checkout-canvas">
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <article className="checkout-section">
              <h2 className="checkout-section-title" style={{ marginBottom: "1rem" }}>
                1. Identiteit
              </h2>
              <p>
                Troebel Brewing Co. — microbrouwerij gevestigd te Congresstraat 22/01, 2060
                Antwerpen, België. Contact: Troebel.brew@gmail.com.
              </p>
            </article>

            <article className="checkout-section">
              <h2 className="checkout-section-title" style={{ marginBottom: "1rem" }}>
                2. Prijzen en BTW
              </h2>
              <p>
                Alle prijzen in de webshop zijn in euro en inclusief 21 % BTW. Eventuele
                aanvullende kosten worden steeds duidelijk vermeld vóór het plaatsen van de
                bestelling. Typografische fouten voorbehouden.
              </p>
            </article>

            <article className="checkout-section">
              <h2 className="checkout-section-title" style={{ marginBottom: "1rem" }}>
                3. Bestelling en bevestiging
              </h2>
              <p>
                Een bestelling komt tot stand zodra je de checkout hebt afgerond en wij jouw
                e-mailadres hebben ontvangen. Je krijgt een bevestigingsmail met het
                bestelnummer. Wij bevestigen je afhaaltijd schriftelijk vóór afhaling.
              </p>
            </article>

            <article className="checkout-section">
              <h2 className="checkout-section-title" style={{ marginBottom: "1rem" }}>
                4. Afhaling
              </h2>
              <p>
                Bestellingen worden enkel afgehaald bij de brouwerij in Antwerpen, op afspraak.
                Er is momenteel geen thuislevering beschikbaar. Niet-afgehaalde bestellingen
                blijven veertien dagen ter beschikking; daarna vervalt het recht op afhaling en
                wordt het betaalde bedrag (indien van toepassing) teruggestort onder aftrek van
                eventuele kosten.
              </p>
            </article>

            <article className="checkout-section">
              <h2 className="checkout-section-title" style={{ marginBottom: "1rem" }}>
                5. Herroepingsrecht
              </h2>
              <p>
                Alcoholische dranken waarvan de prijs afhankelijk is van schommelingen op de
                financiële markt, alsook snel bederfbare goederen, zijn uitgesloten van het
                herroepingsrecht conform artikel VI.53, 4° van het Wetboek van Economisch
                Recht. Voor onze bieren geldt dan ook géén wettelijk herroepingsrecht. Bij een
                duidelijk gebrek of fout in de bestelling nemen we uiteraard contact op en
                zoeken we samen een oplossing.
              </p>
            </article>

            <article className="checkout-section">
              <h2 className="checkout-section-title" style={{ marginBottom: "1rem" }}>
                6. Leeftijdsvereiste
              </h2>
              <p>
                Onze producten bevatten alcohol. Je bevestigt bij bestelling uitdrukkelijk dat je
                minstens 18 jaar oud bent. Wij behouden ons het recht voor om bij afhaling een
                identiteitsbewijs te vragen.
              </p>
            </article>

            <article className="checkout-section">
              <h2 className="checkout-section-title" style={{ marginBottom: "1rem" }}>
                7. Privacy
              </h2>
              <p>
                Wij verwerken enkel de gegevens die nodig zijn om je bestelling te verwerken
                (naam, e-mail, telefoon, bestelhistoriek) en conform de GDPR/AVG. Gegevens
                worden niet doorverkocht. Vragen of inzage: Troebel.brew@gmail.com.
              </p>
            </article>

            <article className="checkout-section">
              <h2 className="checkout-section-title" style={{ marginBottom: "1rem" }}>
                8. Toepasselijk recht
              </h2>
              <p>
                Op deze overeenkomst is het Belgisch recht van toepassing. Geschillen behoren
                uitsluitend tot de bevoegdheid van de rechtbanken van het arrondissement
                Antwerpen.
              </p>
            </article>

            <article className="checkout-section">
              <h2 className="checkout-section-title" style={{ marginBottom: "1rem" }}>
                9. Contact
              </h2>
              <p>
                Vragen, klachten of andere opmerkingen? Mail naar{" "}
                <a href="mailto:Troebel.brew@gmail.com">Troebel.brew@gmail.com</a> — we komen
                zo snel mogelijk bij je terug.
              </p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
