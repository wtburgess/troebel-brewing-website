import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const beers = [
  { id: "4778b270-9274-42a9-b1c6-8b02c38d8747", slug: "brews-almighty", file: "public/brews-almighty-mockup.png", ext: "png", type: "image/png" },
  { id: "2a7ff65a-a2d1-4686-b600-423308454d2c", slug: "frambo",         file: "public/Frambo_mockup.png",         ext: "png", type: "image/png" },
  { id: "b7ac777c-f6e7-4fac-bbc6-992af188e735", slug: "renbier",        file: "public/Renbier_mockup.jpeg",       ext: "jpg", type: "image/jpeg" },
];

for (const b of beers) {
  const path = `beers/${b.id}.${b.ext}`;
  const bytes = readFileSync(b.file);
  const up = await supabase.storage.from("beer-images").upload(path, bytes, {
    upsert: true,
    contentType: b.type,
  });
  if (up.error) { console.error(b.slug, "upload failed:", up.error); process.exit(1); }
  const { data: pub } = supabase.storage.from("beer-images").getPublicUrl(path);
  const url = `${pub.publicUrl}?v=${Date.now()}`;
  const upd = await supabase.from("beers").update({ image_url: url }).eq("id", b.id);
  if (upd.error) { console.error(b.slug, "db update failed:", upd.error); process.exit(1); }
  console.log(b.slug, "->", url);
}
