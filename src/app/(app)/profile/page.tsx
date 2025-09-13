"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/browser-client";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type HistoryItem = {
  created_at: string;
  download: number;
  upload: number;
  ping: number;
};

export default function ProfilePage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data } = await supabase
        .from("speed_results")
        .select("created_at, download, upload, ping")
        .order("created_at", { ascending: true })
        .limit(50);
      setItems(data ?? []);
    })();
  }, [supabase]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="mt-6 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Speed history</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {items.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={items}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="created_at"
                    tickFormatter={(v) =>
                      new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="download" stroke="#22c55e" dot={false} />
                  <Line type="monotone" dataKey="upload" stroke="#06b6d4" dot={false} />
                  <Line type="monotone" dataKey="ping" stroke="#f59e0b" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-foreground/70">Sign in and run tests to see history.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}