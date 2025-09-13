"use client";

import { CompareBars } from "@/components/compare/compare-bars";
import { Card, CardContent } from "@/components/ui/card";

export function Summary({
  download,
  upload,
}: {
  download: number;
  upload: number;
}) {
  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <div className="grid gap-3">
          <div className="text-sm text-foreground/70">Ranking</div>
          <CompareBars download={download} upload={upload} />
        </div>
      </CardContent>
    </Card>
  );
}