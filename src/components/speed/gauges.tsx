"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, clamp } from "@/lib/utils";

type MetricKey = "download" | "upload" | "ping" | "jitter" | "loss";

export type TestMetrics = Record<MetricKey, number>;

export function SpeedGauges({ metrics }: { metrics: Partial<TestMetrics> }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <Gauge label="Ping" unit="ms" value={metrics.ping} max={200} goodLow />
      <Gauge label="Jitter" unit="ms" value={metrics.jitter} max={100} goodLow />
      <Gauge label="Loss" unit="%" value={metrics.loss} max={100} goodLow />
      <Gauge label="Download" unit="Mb/s" value={metrics.download} max={1000} />
      <Gauge label="Upload" unit="Mb/s" value={metrics.upload} max={1000} />
    </div>
  );
}

function Gauge({
  label,
  value,
  unit,
  max,
  goodLow = false,
}: {
  label: string;
  value?: number;
  unit: string;
  max: number;
  goodLow?: boolean;
}) {
  const pct = useMemo(() => {
    const v = typeof value === "number" ? value : 0;
    const normalized = clamp(v / max, 0, 1) * 100;
    return goodLow ? 100 - normalized : normalized;
  }, [value, max, goodLow]);

  const color = useMemo(() => {
    if (pct > 66) return "bg-emerald-500";
    if (pct > 33) return "bg-amber-500";
    return "bg-rose-500";
  }, [pct]);

  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <div className="text-xs text-foreground/70">{label}</div>
        <div className="text-2xl font-semibold tabular-nums">
          {typeof value === "number" ? value.toFixed(label === "Loss" ? 1 : 0) : "--"}{" "}
          <span className="text-sm font-normal text-foreground/70">{unit}</span>
        </div>
        <Progress
          value={pct}
          className="h-2 overflow-visible"
        >
        </Progress>
        <div className={cn("mt-1 h-1 rounded-full", color)} style={{ width: `${pct}%` }} />
      </CardContent>
    </Card>
  );
}