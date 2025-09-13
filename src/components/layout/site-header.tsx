"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";

export function SiteHeader() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-foreground/10 bg-background/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-tight">
            Speedster
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm text-foreground/70">
            <Link href="/results" className="hover:text-foreground">Results</Link>
            <Link href="/profile" className="hover:text-foreground">Profile</Link>
            <Link href="/admin" className="hover:text-foreground">Admin</Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          {user ? (
            <Button variant="outline" onClick={signOut}>Sign out</Button>
          ) : (
            <Button variant="default" onClick={signIn}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}