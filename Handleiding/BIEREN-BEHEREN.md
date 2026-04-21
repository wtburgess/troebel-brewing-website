# Bieren beheren — Handleiding voor Benny & Jonathan

Hallo Benny & Jonathan! Dit is jullie gids voor het beheerpaneel van de Troebel-website. Geen technische kennis nodig.

---

## Inloggen

Ga naar:

👉 **https://troebel-brewing-website.vercel.app/admin**

Vul in:

| Veld | Waarde |
|------|--------|
| **E-mail** | `admin@troebel.be` |
| **Wachtwoord** | TroebelAdmin2026!

Klik op **INLOGGEN** → je komt meteen op de bierpagina.

---

## Het beheerpaneel in een oogopslag

Bovenaan zie je twee tabbladen:

| Tabblad | Waarvoor |
|---------|---------|
| **Bieren** | Bieren toevoegen, aanpassen, verwijderen |
| **Bestellingen** | Inkomende bestellingen bekijken & afvinken |

Rechts bovenaan: **↗ Site** opent de publieke website in een nieuw tabblad.

---

## Een nieuw bier toevoegen

### Stap 1 — Klik op `+ NIEUW BIER`

Dat staat in de rechterzijbalk (desktop) of bovenaan (mobiel).

Er opent een formulier met **2 stappen**.

---

### Stap 1 van 2 — Details

**Afbeelding**
- Klik op het grote fotovlak of sleep er een foto naartoe
- Formaten: JPG, PNG of WebP
- Probeer een foto met transparante achtergrond (PNG) voor het mooiste resultaat

**Naam**
- Bijv. `Brews Almighty`
- De URL (slug) wordt automatisch aangemaakt, bijv. `/bieren/brews-almighty`

**Categorie**
Kies uit: Tripel · Blond · IPA · Pale Ale · Saison · Session · Seizoens

**Stijl Label**
- Vrije tekst die op de kaart staat, bijv. `Tripel` of `Belgian IPA`

**ABV (%)**
- Het alcoholpercentage, bijv. `8.5`

**IBU**
- Bitterheidswaarde — mag leegblijven als je het niet weet

**Korte beschrijving** *(verplicht)*
- Staat op de bierkaart in de webshop — max 2 zinnen
- Bijv. *"Een krachtige tripel met fruitige toetsen en een zachte afdronk."*

**Lange beschrijving**
- Staat op de detailpagina van het bier — mag uitgebreider
- Mag leegblijven

**Proefnotities**
- Komma gescheiden, bijv. `Peer, Banaan, Kaneel`

**Food pairings**
- Komma gescheiden, bijv. `Geitenkaas, Witlof`

**Vinkjes (statuslabels)**

| Vinkje | Wat het doet |
|--------|-------------|
| **Homepage line-up** | Bier verschijnt in de sectie "Onze Bieren" op de homepage |
| **Markeer als NIEUW** | Toont een geel "NIEUW"-badge op de kaart |
| **Markeer als SEIZOEN** | Toont een "SEIZOEN"-badge — voor tijdelijke bieren |

Klik op **Volgende →** als alles ingevuld is.

---

### Stap 2 van 2 — Varianten (flesjes, bakken, vaten)

Hier voeg je de bestelbare formaten toe. Zonder varianten kan een klant het bier niet bestellen.

**Een variant toevoegen:**

1. Kies het **Type**:
   - `Flesje` — losse fles
   - `Bak` — doos/krat
   - `Vat` — fust
   - `Custom` — eigen label (bijv. Growler)
2. Vul de **Maat** in, bijv. `33cl`, `75cl`, `24x33cl`, `30L`
3. Het **Label** wordt automatisch ingevuld, bijv. `Flesje 33cl` — pas aan als je wil
4. Vul de **Prijs** in in euro, bijv. `2.50`
5. Klik op **+ Voeg toe**

Herhaal dit voor elke verpakking die je wil aanbieden.

**Beschikbaarheid per variant:**
- Elke variant heeft een groene knop **✓ BESCHIKBAAR**
- Klik erop om te schakelen naar **✗ UITVERKOCHT** — de variant verdwijnt dan uit de webshop
- Klik nogmaals om terug beschikbaar te zetten

**Klik op BIER AANMAKEN** als je klaar bent. Het bier staat meteen live.

---

## Een bestaand bier aanpassen

1. Ga naar **Bieren**
2. Klik op het potlood-icoontje rechts van het bier
3. Pas aan wat nodig is (details in stap 1, varianten in stap 2)
4. Klik **OPSLAAN**

> Tip: gebruik het zoekvakje bovenaan om snel een bier te vinden.

---

## Een bier verwijderen

1. Klik op het **prullenbak-icoontje** naast het bier
2. Bevestig in de pop-up

Let op: dit kan niet ongedaan gemaakt worden.

---

## Bestellingen bekijken

Ga naar het tabblad **Bestellingen**.

Elke bestelling toont:
- Naam, e-mail en telefoonnummer van de klant
- Of het **afhalen** of **verzending** is
- Welke bieren & varianten besteld zijn
- Het totaalbedrag (incl. BTW)
- Eventuele nota van de klant

**Een bestelling afvinken:**
- Klik op de gele knop **✓ Verwerkt** als de bestelling klaar is
- De bestelling verschijnt dan grijs en kan gefilterd worden uit de lijst
- Vergissing? Klik **↩ Heropen** om terug te zetten

**Filteren:**
Gebruik de knoppen **Alle / Te verwerken / Verwerkt** om de lijst te filteren.

> Bestellingen komen ook per mail binnen op `Troebel.brew@gmail.com` — de website stuurt die automatisch.

---

## Snelle cheatsheet

| Ik wil... | Wat doen |
|-----------|---------|
| Nieuw bier toevoegen | Bieren → + NIEUW BIER |
| Bier aanpassen | Bieren → potlood-icoontje |
| Bier uitverkocht zetten | Bier bewerken → Varianten → klik op BESCHIKBAAR |
| Bier op homepage zetten | Bier bewerken → vink "Homepage line-up" aan |
| Bestelling afvinken | Bestellingen → ✓ Verwerkt |
| Uitloggen | Rechtsboven → Uitloggen |

---

## Hulp nodig?

Geef dit document aan Claude Code en zeg:

> "Ik ben Benny/Jonathan en ik heb hulp nodig met het beheerpaneel van Troebel. [beschrijf je vraag]"

Claude kent de volledige code en kan je verder helpen.

Of bel Wouter.
