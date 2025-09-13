import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server-client";

export async function GET(req: NextRequest) {
  // Return last 20 public results (if saved)
  const supabase = createClient();
  const { data, error } = await supabase
    .from("speed_results_public")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ results: data ?? [] });
}