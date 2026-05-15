import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

interface ContactBody {
  name?: string;
  email?: string;
  interest?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactBody;

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const interest = (body.interest ?? "").trim();
    const message = (body.message ?? "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Bericht is leeg." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase.functions.invoke("send-contact-email", {
      body: { name, email, interest, message },
    });

    if (error) {
      console.error("[contact] Edge function error:", error);
      return NextResponse.json({ error: "Versturen mislukt." }, { status: 502 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ error: "Interne fout." }, { status: 500 });
  }
}
