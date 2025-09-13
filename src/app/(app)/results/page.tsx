"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";

type LocalResult = {
  id: string;
  metrics: { download: number; upload: number; ping: number };
  created_at: string;
};

export default function ResultsPage() {
  const [items, setItems] = useState<LocalResult[]>([]);

  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem("speedster:history") || "[]") as any[];
      setItems(
        arr
          .map((r) => ({
            id: r.id,
            metrics: { download: r.metrics.download, upload: r.metrics.upload, ping: r.metrics.ping },
            created_at: r.created_at,
          }))
          .reverse()
      );
    } catch {}
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Recent Results</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.length === 0 && <div className="text-sm text-foreground/70">Run a test to see results here.</div>}
        {items.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle>{new Date(r.created_at).toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div>Download: {r.metrics.download} Mb/s</div>
              <div>Upload: {r.metrics.upload} Mb/s</div>
              <div>Ping: {r.metrics.ping} ms</div>
              <Link className="text-foreground underline mt-2 inline-block" href={`/results/${r.id}`}>Open</Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}