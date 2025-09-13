"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpeedGauges, TestMetrics } from "@/components/speed/gauges";
import { MiniMap } from "@/components/speed/map";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser-client";
import { nanoid } from "nanoid";
import { clamp, haversineDistance } from "@/lib/utils";
import { CompareBars } from "@/components/compare/compare-bars";
import * as htmlToImage from "html-to-image";

type TestServer = {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
};

type TestState = "idle" | "running" | "done";

const SERVERS: TestServer[] = [
  { id: "lon", name: "London 1", city: "London", country: "UK", lat: 51.5074, lon: -0.1278 },
  { id: "nyc", name: "New York 1", city: "New York", country: "US", lat: 40.7128, lon: -74.006 },
  { id: "fra", name: "Frankfurt 1", city: "Frankfurt", country: "DE", lat: 50.1109, lon: 8.6821 },
  { id: "sin", name: "Singapore 1", city: "Singapore", country: "SG", lat: 1.3521, lon: 103.8198 },
];

export type SpeedResult = {
  id: string;
  metrics: TestMetrics;
  ip: string;
  isp: string;
  server: TestServer;
  created_at: string;
  routeLatency: number;
  stabilityScore: number; // based on jitter + loss
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function computeStability(jitter: number, loss: number) {
  // Simple heuristic 0..100
  const jScore = clamp(100 - Math.min(jitter, 100), 0, 100);
  const lScore = clamp(100 - Math.min(loss * 2, 100), 0, 100);
  return Math.round(jScore * 0.6 + lScore * 0.4);
}

export function TestRunner() {
  const [state, setState] = useState<TestState>("idle");
  const [metrics, setMetrics] = useState<Partial<TestMetrics>>({});
  const [server, setServer] = useState<TestServer>(SERVERS[0]);
  const [ipInfo, setIpInfo] = useState<{ ip: string; isp: string; lat?: number; lon?: number } | null>(null);
  const [result, setResult] = useState<SpeedResult | null>(null);
  const raf = useRef<number | null>(null);

  // fetch IP info and auto-select nearest server
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        const info = {
          ip: data.ip,
          isp: data.org || data.asn || "Unknown ISP",
          lat: Number(data.latitude ?? data.lat),
          lon: Number(data.longitude ?? data.lon),
        };
        setIpInfo(info);
        if (info.lat && info.lon) {
          const nearest = SERVERS.reduce((best, s) => {
            const d = haversineDistance(info.lat!, info.lon!, s.lat, s.lon);
            if (!best) return { server: s, d };
            return d < best.d ? { server: s, d } : best;
          }, null as null | { server: TestServer; d: number });
          if (nearest) setServer(nearest.server);
        }
      })
      .catch(() => setIpInfo({ ip: "0.0.0.0", isp: "Unknown ISP" }));
  }, []);

  async function runTest() {
    setState("running");
    setMetrics({});
    setResult(null);
    toast("Testing started", { description: "Sit tight, running ping, download and upload..." });

    // simulate phases with progressive updates
    let ping = randomBetween(5, 60);
    let jitter = randomBetween(1, 20);
    let loss = randomBetween(0, 3);
    let downloadTarget = randomBetween(50, 900); // Mb/s
    let uploadTarget = randomBetween(20, 300); // Mb/s

    // Ping phase
    await animateMetric("ping", ping, 1200);
    await animateMetric("jitter", jitter, 900);
    await animateMetric("loss", loss, 900);

    // Download phase
    await animateMetric("download", downloadTarget, 2500);
    // Upload phase
    await animateMetric("upload", uploadTarget, 2500);

    const routeLatency = Math.round(randomBetween(10, 120));
    const stabilityScore = computeStability(jitter, loss);

    const final: SpeedResult = {
      id: nanoid(10),
      metrics: {
        ping: Math.round(ping),
        jitter: Number(jitter.toFixed(1)),
        loss: Number(loss.toFixed(1)),
        download: Math.round(downloadTarget),
        upload: Math.round(uploadTarget),
      },
      ip: ipInfo?.ip ?? "0.0.0.0",
      isp: ipInfo?.isp ?? "Unknown ISP",
      server,
      created_at: new Date().toISOString(),
      routeLatency,
      stabilityScore,
    };

    setState("done");
    setResult(final);
    toast("Test complete", { description: "Results saved to your device. Sign in to store history." });

    // Save to local history (device)
    try {
      const key = "speedster:history";
      const arr = JSON.parse(localStorage.getItem(key) || "[]");
      arr.push(final);
      localStorage.setItem(key, JSON.stringify(arr.slice(-20)));
    } catch {}

    // Persist to Supabase if logged in
    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (auth.user) {
        await supabase.from("speed_results").insert({
          id: final.id,
          user_id: auth.user.id,
          ip: final.ip,
          isp: final.isp,
          server_id: final.server.id,
          server_city: final.server.city,
          server_country: final.server.country,
          ping: final.metrics.ping,
          jitter: final.metrics.jitter,
          loss: final.metrics.loss,
          download: final.metrics.download,
          upload: final.metrics.upload,
          route_latency: final.routeLatency,
          stability_score: final.stabilityScore,
          created_at: final.created_at,
        });
      }
    } catch {
      // ignore
    }
  }

  function animateMetric(key: keyof TestMetrics, target: number, duration = 1200) {
    return new Promise<void>((resolve) => {
      const start = performance.now();
      const from = key === "ping" || key === "jitter" || key === "loss" ? target : 0; // start high to low for ping? keep 0-start for simplicity
      const step = (t: number) => {
        const elapsed = t - start;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = 0 + (target - 0) * eased;
        setMetrics((m) => ({ ...m, [key]: value }));
        if (progress < 1) {
          raf.current = requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      raf.current = requestAnimationFrame(step);
    });
  }

  useEffect(() => {
    const handler = () => {
      if (state !== "running") runTest();
    };
    window.addEventListener("speedster:start", handler);
    return () => window.removeEventListener("speedster:start", handler);
  }, [state]);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Live Results</CardTitle>
            <div className="flex items-center gap-2">
              <select
                className="rounded-md border border-foreground/20 bg-background px-2 py-1 text-sm"
                value={server.id}
                onChange={(e) =>
                  setServer(SERVERS.find((s) => s.id === e.target.value) || SERVERS[0])
                }
              >
                {SERVERS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.city}
                  </option>
                ))}
              </select>
              <Button onClick={runTest} disabled={state === "running"}>
                {state === "running" ? "Testing..." : "Run again"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <SpeedGauges metrics={metrics} />
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <Info label="IP" value={ipInfo?.ip ?? "--"} />
              <Info label="ISP" value={ipInfo?.isp ?? "--"} />
              <Info label="Server" value={`${server.city}, ${server.country}`} />
              <Info label="Route Latency" value={`${result ? result.routeLatency : metrics.ping ? Math.round(metrics.ping) : "--"} ms`} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Server Location</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniMap lat={server.lat} lon={server.lon} />
            <div className="mt-3 text-sm text-foreground/70">
              Selected: {server.city}, {server.country}
            </div>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card id="speedster-summary">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2 text-sm">
              <span>Network stability score</span>
              <div className="text-3xl font-bold">{result.stabilityScore}/100</div>
              <div className="mt-4">
                <CompareBars download={result.metrics.download} upload={result.metrics.upload} />
              </div>
            </div>
            <div className="grid gap-2 text-sm">
              <span>Share</span>
              <SharePanel result={result} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-foreground/70">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function SharePanel({ result }: { result: SpeedResult }) {
  async function copyLink() {
    const url = `${window.location.origin}/results/${result.id}`;
    await navigator.clipboard.writeText(url);
    toast("Link copied");
  }
  async function shareTwitter() {
    const text = encodeURIComponent(
      `My internet speed: ${result.metrics.download}↓ / ${result.metrics.upload}↑, ping ${result.metrics.ping} ms — tested on Speedster`
    );
    const url = encodeURIComponent(`${window.location.origin}/results/${result.id}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  }
  async function saveImage() {
    const node = document.getElementById("speedster-summary");
    if (!node) return;
    const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 2 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `speedster-${result.id}.png`;
    a.click();
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={copyLink}>Copy link</Button>
      <Button variant="outline" onClick={shareTwitter}>Share to X</Button>
      <Button variant="outline" onClick={saveImage}>Save image</Button>
    </div>
  );
}