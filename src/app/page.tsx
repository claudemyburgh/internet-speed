import { SiteHeader } from "@/components/layout/site-header";
import { StartTestButton } from "@/components/speed/start-button";
import { TestRunner } from "@/components/speed/test-runner";
import dynamic from "next/dynamic";

const Summary = dynamic(
  () => import("./(app)/results/components/summary").then((m) => m.Summary),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="relative">
        <div className="hero-bg absolute inset-0">
          <div className="hero-blob left-[-10%] top-[-10%] h-[50vh] w-[50vw] bg-fuchsia-400/50" />
          <div className="hero-blob right-[-10%] top-[10%] h-[40vh] w-[40vw] bg-cyan-400/50" />
          <div className="hero-blob bottom-[-10%] left-[20%] h-[40vh] w-[50vw] bg-violet-400/50" />
        </div>

        <section className="relative z-10 mx-auto max-w-6xl px-4 pt-16 pb-10 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Measure your internet speed precisely
          </h1>
          <p className="mt-3 text-foreground/70">
            Real-time ping, jitter, packet loss, download and upload — with sharing and history.
          </p>
          <div className="mt-6 flex justify-center">
            <StartTestButton
              onClick={() => {
                const el = document.getElementById("runner");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        </section>

        <section id="runner" className="relative z-10 mx-auto max-w-6xl px-4 pb-16">
          <TestRunner />
        </section>

        <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16">
          <h2 className="text-xl font-semibold mb-4">How do you compare?</h2>
          <Summary download={300} upload={80} />
        </section>
      </main>
    </div>
  );
}
