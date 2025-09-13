import { NextRequest } from "next/server";

// Mock API that simulates a test run and returns final metrics.
// In a later iteration we can switch to a real worker that downloads/upload blobs.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? crypto.randomUUID().slice(0, 10);

  // Simulated metrics
  const ping = Math.round(Math.random() * 50 + 5);
  const jitter = Number((Math.random() * 10 + 1).toFixed(1));
  const loss = Number((Math.random() * 2).toFixed(1));
  const download = Math.round(Math.random() * 800 + 50);
  const upload = Math.round(Math.random() * 200 + 20);

  return Response.json({
    id,
    metrics: { ping, jitter, loss, download, upload },
    created_at: new Date().toISOString(),
  });
}