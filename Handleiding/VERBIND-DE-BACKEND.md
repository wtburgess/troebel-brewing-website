# Verbind de Backend — Handleiding voor Benny & Jonathan

Hallo Benny & Jonathan! Even een uitleg voor dummies — maar je kan het ook gewoon aan Claude geven en zeggen: "doe dit voor mij". Claude kent de hele context al.

---

## Wat is er al gedaan?

De **website staat live** op Vercel:
👉 https://troebel-brewing-website.vercel.app/

De **database en backend** draaien al in de cloud op **Supabase** (gratis tier). Ze moeten alleen nog aan elkaar gekoppeld worden via 3 sleuteltjes (environment variables).

---

## Stap 1 — Haal de 3 sleuteltjes op uit Supabase

1. Ga naar **https://supabase.com** en log in
2. Klik op het project **troebel** (project ref: `wkbhgadmkucxjwidzsig`)
3. Linksboven: klik op **Settings** (tandwieltje)
4. Klik in het menu op **API**
5. Kopieer deze 3 waarden (bewaar ze ergens veilig, bijv. in een notitie):

| Wat | Waar vind je het |
|-----|-----------------|
| **Project URL** | Bovenaan de pagina — begint met `https://...supabase.co` |
| **anon public** key | Onder "Project API keys" → `anon` `public` |
| **service_role** key | Onder "Project API keys" → `service_role` (klik op "Reveal") |

> **Let op:** de `service_role` key is geheim — deel die nooit publiek.

---

## Stap 2 — Voer de sleuteltjes in op Vercel

1. Ga naar **https://vercel.com** en log in (met het GitHub-account waarmee de site is gedeployed)
2. Klik op het project **troebel-brewing-website**
3. Klik bovenaan op **Settings**
4. Klik links op **Environment Variables**
5. Voeg deze 3 variabelen toe (één voor één, knop "Add"):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | De Project URL uit stap 1 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | De `anon public` key uit stap 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | De `service_role` key uit stap 1 |

6. Klik na elke variabele op **Save**

---

## Stap 3 — Herstart de website

Na het invoeren van de variabelen moet Vercel de site opnieuw bouwen:

1. Ga in Vercel naar het tabblad **Deployments**
2. Klik op de drie puntjes `...` naast de laatste deployment
3. Kies **Redeploy**
4. Wacht ~2 minuten

✅ De website haalt nu bieren, bestellingen en alles op uit Supabase.

---

## Stap 4 — Maak een admin-gebruiker aan (voor het beheerpaneel)

Het beheerpaneel op `/admin` werkt met een gewone login (e-mail + wachtwoord). Maak eenmalig een gebruiker aan in Supabase:

1. Ga naar **https://supabase.com** → jouw project
2. Linkermenu: **Authentication** → **Users**
3. Klik op **Add user** → **Create new user**
4. Vul in:
   - **Email:** `admin@troebel.be`
   - **Password:** kies een sterk wachtwoord
5. Klik op **Create user**

Nu kan je inloggen op `https://troebel-brewing-website.vercel.app/admin` met die gegevens.

---

## Stap 5 (optioneel) — Order-mails instellen

Bestellingen worden automatisch per mail verstuurd via Gmail. De secrets daarvoor staan al ingesteld in Supabase (via de Edge Function). Als ze nog niet werken, geef dan aan Claude:

> "De order-mails werken niet. Stel de SMTP-secrets in voor de `send-order-email` Edge Function in Supabase project `wkbhgadmkucxjwidzsig`."

Claude weet precies wat er moet.

---

## Samenvatting in één zin

> Kopieer 3 sleutels uit Supabase → plak ze in Vercel → klik Redeploy → klaar.

---

## Hulp nodig?

Geef dit document gewoon aan Claude en zeg:

> "Ik ben Benny/Jonathan. Help me de backend verbinden. Hier is de handleiding: [plak dit document]"

Claude doet de rest.
