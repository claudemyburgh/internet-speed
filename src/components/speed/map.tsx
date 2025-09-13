"use client";

import { useEffect, useRef } from "react";

type Props = {
  lat: number | null;
  lon: number | null;
};

export function MiniMap({ lat, lon }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || lat == null || lon == null) return;
    const el = ref.current;
    const img = new Image();
    const z = 4;
    const src = `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=${z}&l=map&size=450,240&pt=${lon},${lat},pm2rdm`;
    img.src = src;
    img.alt = "Server location map";
    img.className = "w-full h-full object-cover rounded-md border border-foreground/10";
    el.innerHTML = "";
    el.appendChild(img);
  }, [lat, lon]);

  return <div ref={ref} className="h-[160px] w-full bg-muted rounded-md" />;
}