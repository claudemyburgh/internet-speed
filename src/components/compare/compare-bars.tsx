"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type CompareData = {
  national_avg_download: number;
  national_avg_upload: number;
  global_avg_download: number;
  global_avg_upload: number;
};

export function CompareBars({
  download,
  upload,
}: {
  download: number;
  upload: number;
}) {
  const [data, setData] = useState<CompareData | null>(null);

  useEffect(() => {
    fetch("/api/compare")
      .then((r) => r.json())
      .then(setData)
      .catch(() => null);
  }, []);

  if (!data) return null;

  return (
    <div className="grid gap-4">
      <Bar label="Vs National Avg (Down)" value={ratio(download, data.national_avg_download)} />
      <Bar label="Vs National Avg (Up)" value={ratio(upload, data.national_avg_upload)} />
      <Bar label="Vs Global Avg (Down)" value={ratio(download, data.global_avg_download)} />
      <Bar label="Vs Global Avg (Up)" value={ratio(upload, data.global_avg_upload)} />
    </div>
  );
}

function ratio(a: number, b: number) {
  return Math.max(0, Math.min(2, a / b)); // cap at 2x
}

function Bar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 50); // 1.0 -> 50%
  return (
    <Card className="p-3">
      <CardContent className="p-0">
        <div className="flex items-center justify-between text-xs text-foreground/70">
          <span>{label}</span>
          <span>{(value * 100).toFixed(0)}%</span>
        </div>
        <div className="mt-1 h-2 w-full rounded-full bg-foreground/10">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}