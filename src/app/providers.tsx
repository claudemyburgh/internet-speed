"use client";

import { AppToaster } from "@/components/ui/toaster";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AppToaster />
    </>
  );
}