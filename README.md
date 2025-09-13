# Speedster — Internet Speed Test

Modern, privacy-friendly internet speed test built with:
- Next.js App Router
- Tailwind CSS v4
- shadcn/ui-inspired components
- Supabase (auth + DB)
- Framer Motion, Recharts, Sonner

## Features

- Landing page with animated gradient blobs and Start button
- Live speed test simulation: ping, jitter, packet loss, download, upload
- Real-time gauges and progress visualization
- Auto-select nearest server based on your geolocation (via IP)
- IP, ISP, server location map, route latency
- Dark mode (system default) with toggle
- Share via link, X (Twitter), or export image snapshot
- Save to Supabase when signed in; local history otherwise
- Results page, profile analytics, admin placeholder
- Public JSON API endpoints for integration

## Getting Started

1) Install deps
- npm install

2) Add environment variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3) Run
- npm run dev
- open http://localhost:3000

## Database

Create a table speed_results in Supabase:

```
create table if not exists public.speed_results (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  ip text,
  isp text,
  server_id text,
  server_city text,
  server_country text,
  ping int,
  jitter float,
  loss float,
  download int,
  upload int,
  route_latency int,
  stability_score int,
  created_at timestamptz default now()
);
```

Optionally a public view:
```
create or replace view public.speed_results_public as
  select id, ip, isp, server_id, server_city, server_country,
         ping, jitter, loss, download, upload, route_latency, stability_score, created_at
  from public.speed_results;
```

## Notes

- Speed test uses simulated metrics for now. Swap /api/test to real worker later.
- The share image snapshot uses html-to-image client-side.
- For Google OAuth, enable in Supabase and set Redirect URL to:
  - http://localhost:3000/auth/callback
