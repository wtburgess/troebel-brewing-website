# Skills & AI — Handleiding voor Benny & Jonathan

Hallo Benny & Jonathan! Deze repo komt met **wat kant-en-klare AI-tools** voor wie met een AI-agent (Claude Code, OpenCode, Cursor, …) aan de website wil werken. Je hoeft hier niks mee te doen om de site te draaien — maar als je ooit iets wil aanpassen of een dev inhuurt, scheelt dit ze 30 minuten setup.

---

## Wat zit er in de repo?

| Bestand / map | Wat het doet |
|---|---|
| `.mcp.json` | Verbindt de AI-agent met de **Supabase MCP server** van dit project. De agent krijgt dan tools om in de database te kijken, SQL uit te voeren, edge functions te deployen, logs te bekijken — zonder dat je het zelf hoeft te typen. |
| `.agents/skills/supabase/` | De officiële **Supabase-skill** van Supabase zelf. Leert de agent de juiste Supabase-patronen: queries, migraties, auth, storage, RLS, edge functions. |
| `.agents/skills/supabase-postgres-best-practices/` | Postgres best-practices-skill — indexen, RLS-performance, schemaontwerp. |
| `skills-lock.json` | Pint de twee skills vast op specifieke versies (zoals `package-lock.json`, maar dan voor skills). |

`.claude/skills/` staat **niet** in git (het zijn symlinks die per computer anders zijn — je AI-agent maakt ze zelf opnieuw aan).

---

## Gebruik met Claude Code (makkelijkst)

1. Installeer Claude Code: <https://claude.com/claude-code>
2. Open een terminal in de repo-map en typ `claude`
3. De eerste keer vraagt Claude om de Supabase MCP aan te zetten (staat in `.mcp.json`). Druk **Enter** om toe te staan. Claude vraagt om een **Supabase Personal Access Token** — maak er één op <https://supabase.com/dashboard/account/tokens> en plak hem. Die blijft lokaal op jouw computer, komt niet in de repo.
4. De skills laden vanzelf uit `.agents/skills/`.
5. Klaar. Nu kan je gewoon zeggen: *"laat het bier-schema zien"* of *"schrijf een migratie die een kortingsveld toevoegt"*. Claude gebruikt de MCP + skills om het correct te doen.

> 💡 **Tip:** zeg ook gerust dingen als *"lees `Handleiding/HANDOVER.md` en voeg een kolom toe aan de orders-tabel"*. Claude leest alle handleiding-docs en snapt de context.

---

## Gebruik met OpenCode (of een andere MCP-compatibele agent)

OpenCode leest zijn MCP-config uit zijn eigen config-bestand, niet uit `.mcp.json`. Kopieer het serverblok over:

```jsonc
// ~/.config/opencode/config.json (of waar OpenCode hem ook bewaart)
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=wkbhgadmkucxjwidzsig"
    }
  }
}
```

**Skills bij OpenCode:** OpenCode heeft (nog) geen identiek skill-pakketsysteem als Claude Code. Maar elke skill is gewoon een Markdown-bestand op `.agents/skills/<naam>/SKILL.md`. Je kan die direct in een prompt aanhalen (*"lees `.agents/skills/supabase/SKILL.md` en gebruik die aanpak"*) of de relevante stukken in je system prompt plakken.

---

## Skills updaten (zelden nodig)

Als Supabase nieuwe versies uitbrengt, herberekenen met de skills-CLI:

```bash
# als je de skills-CLI geïnstalleerd hebt:
skills update
```

Of handmatig de hashes in `skills-lock.json` bijwerken vanuit <https://github.com/supabase/agent-skills>. Lage prioriteit — de gepinde versies werken gewoon.

---

## Ik snap er niks van

Geen zorgen. Zeg gewoon tegen je dev: *"de vorige dev heeft `.mcp.json` en `.agents/skills/` in de repo gezet, check `Handleiding/SKILLS-EN-AI.md` als je Claude Code of iets soortgelijks gebruikt"*. Die snapt het binnen 5 minuten.

Proost! 🍺
