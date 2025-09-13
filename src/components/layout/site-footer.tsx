export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/10 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-foreground/70 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>© {new Date().getFullYear()} Speedster</div>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-foreground">Privacy</a>
          <a href="/terms" className="hover:text-foreground">Terms</a>
          <a href="https://github.com" target="_blank" className="hover:text-foreground">GitHub</a>
        </div>
      </div>
    </footer>
  );
}