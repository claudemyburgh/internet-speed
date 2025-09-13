import { createClient } from "@/lib/supabase/server-client";

// Returns simple ranking vs national/global averages (mocked for now).
export async function GET() {
  // To improve later: query aggregates from DB per ISP and country.
  const payload = {
    national_avg_download: 220,
    national_avg_upload: 60,
    global_avg_download: 160,
    global_avg_upload: 45,
  };
  return Response.json(payload);
}