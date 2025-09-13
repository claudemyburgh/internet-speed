"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: { id: string };
};

type Result = {
  id: string;
  metrics: { download: number; upload: number; ping: number; jitter: number; loss: number };
  isp?: string;
  server_city?: string;
  server_country?: string;
  created_at: string;
};

export default function ResultDetails({ params }: Props) {
  const [data, setData] = useState<Result | null>(null);

  useEffect(() => {
    (async () => {
      // Try server (public) first
      const r = await fetch(`/api/results/${params.id}`);
      if (r.ok) {
        const json = await r.json();
        setData({
          id: json.id,
          metrics: {
            download: json.download,
            upload: json.upload,
            ping: json.ping,
            jitter: json.jitter,
            loss: json.loss,
          },
          isp: json.isp,
          server_city: json.server_city,
          server_country: json.server_country,
          created_at: json.created_at,
        });
        return;
      }
      // Fallback to local device history
      try {
        const arr = JSON.parse(localStorage.getItem("speedster:history") || "[]");
        const found = arr.find((x: any) => x.id === params.id);
        if (found) {
          setData({
            id: found.id,
            metrics: found.metrics,
            created_at: found.created_at,
          });
        }
      } catch {}
    })();
  }, [params.id]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Result {params.id}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>Download: {data ? data.metrics.download : "—"} Mb/s</div>
          <div>Upload: {data ? data.metrics.upload : "—"} Mb/s</div>
          <div>Ping: {data ? data.metrics.ping : "—"} ms</div>
          <div>Jitter: {data ? data.metrics.jitter : "—"} ms</div>
          <div>Packet loss: {data ? data.metrics.loss : "—"} %</div>
          <div className="col-span-2 text-foreground/70">
            {data
              ? `Tested ${new Date(data.created_at).toLocaleString()}`
              : "Looking up result..."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}