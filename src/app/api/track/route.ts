import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json();
    const supabase = createServiceClient();
    supabase.from("page_views").insert({ path }).then(() => {});
  } catch {
    // fire-and-forget; never block the client
  }
  return NextResponse.json({ ok: true });
}
