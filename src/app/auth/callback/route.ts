import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-client";

export async function GET(request: NextRequest) {
  const { nextUrl } = request;
  const code = nextUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();
    // Exchange the code for a session and set cookies
    await supabase.auth.exchangeCodeForSession(code);
  }

  const url = new URL("/", nextUrl.origin);
  return NextResponse.redirect(url);
}