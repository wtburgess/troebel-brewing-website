import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SMTPClient } from "denomailer";

interface ContactPayload {
  name: string;
  email: string;
  interest: string;
  message: string;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlAsBase64Mime(html: string) {
  const utf8 = new TextEncoder().encode(html);
  let bin = "";
  utf8.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/(.{76})/g, "$1\r\n");
}

function buildBreweryHtml(p: ContactPayload): string {
  return `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><title>Nieuw contactbericht — Troebel</title></head>
<body style="font-family:sans-serif;padding:20px;color:#1C1C1C;">
  <h2 style="color:#D4A017;">📬 Nieuw contactbericht via de site</h2>
  <p><strong>Naam:</strong> ${escapeHtml(p.name) || "(leeg)"}</p>
  <p><strong>E-mail:</strong> <a href="mailto:${escapeHtml(p.email)}" style="color:#D4A017;">${escapeHtml(p.email)}</a></p>
  <p><strong>Interesse:</strong> ${escapeHtml(p.interest)}</p>
  <p><strong>Bericht:</strong></p>
  <div style="background:#f9f9f9;border-left:4px solid #D4A017;padding:12px 16px;white-space:pre-wrap;">${escapeHtml(p.message) || "(leeg)"}</div>
  <hr>
  <p style="font-size:12px;color:#999;">Reply-to is ingesteld op de afzender — gewoon op antwoorden klikken werkt.</p>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  try {
    const body = (await req.json()) as Partial<ContactPayload>;

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const interest = (body.interest ?? "").trim();
    const message = (body.message ?? "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "invalid_email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!message) {
      return new Response(JSON.stringify({ error: "empty_message" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get("SMTP_HOST")!,
        port: Number(Deno.env.get("SMTP_PORT")!),
        tls: true,
        auth: {
          username: Deno.env.get("SMTP_USER")!,
          password: Deno.env.get("SMTP_PASS")!,
        },
      },
    });

    const from = Deno.env.get("FROM_EMAIL")!;
    const breweryEmail = Deno.env.get("BREWERY_EMAIL")!;

    const payload: ContactPayload = { name, email, interest, message };

    try {
      await client.send({
        from,
        to: breweryEmail,
        replyTo: email,
        subject: `Contactbericht: ${interest || "algemeen"} — ${name || email}`,
        mimeContent: [
          {
            mimeType: 'text/html; charset="utf-8"',
            content: htmlAsBase64Mime(buildBreweryHtml(payload)),
            transferEncoding: "base64",
          },
        ],
      });
    } finally {
      await client.close();
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[send-contact-email] Error:", err);
    return new Response(
      JSON.stringify({ error: String(err instanceof Error ? err.message : err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
