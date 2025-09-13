"use client";

import { motion } from "framer-motion";
import { StartTestButton } from "@/components/speed/start-button";

export function Hero() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 pt-16 pb-10 text-center">
      <motion.h1
        className="text-4xl sm:text-6xl font-bold tracking-tight"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Measure your internet speed precisely
      </motion.h1>
      <motion.p
        className="mt-3 text-foreground/70"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Real-time ping, jitter, packet loss, download and upload — with sharing and history.
      </motion.p>
      <motion.div
        className="mt-6 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <StartTestButton
          onClick={() => {
            const el = document.getElementById("runner");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </motion.div>
    </section>
  );
}