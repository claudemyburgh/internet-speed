import { createClient } from "@/lib/supabase/server-client";

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return Response.json(data.user ?? null);
}