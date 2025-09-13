"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function StartTestButton({
  onClick,
  disabled,
}: {
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      size="lg"
      className="group relative overflow-hidden"
      disabled={disabled}
      onClick={() => {
        // Smooth scroll or external action
        onClick?.();
        // Broadcast a global event so the runner can start immediately
        window.dispatchEvent(new CustomEvent("speedster:start"));
      }}
    >
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-80 transition-opacity group-hover:opacity-100" />
      <Play className="mr-2 h-5 w-5" />
      Start Speed Test
    </Button>
  );
}