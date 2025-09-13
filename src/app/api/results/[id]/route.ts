import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server-client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("speed_results_public")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!data) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(data);
}