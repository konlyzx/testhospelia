"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Client-only dynamic imports to avoid Server Component SSR issues
const WhatsAppButton = dynamic(() => import("./WhatsAppButton"), {
  ssr: false,
  loading: () => null,
});

const Chatbot = dynamic(() => import("./Chatbot"), {
  ssr: false,
  loading: () => null,
});

/**
 * Defers mounting of heavy interactive widgets until after hydration
 * to improve INP and reduce main-thread contention.
 */
export default function DeferredWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Use requestIdleCallback when available, fallback to a small timeout
    const schedule = () => setReady(true);
    if (typeof (window as any).requestIdleCallback === "function") {
      (window as any).requestIdleCallback(schedule, { timeout: 1500 });
    } else {
      const t = setTimeout(schedule, 1200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!ready) return null;

  return (
    <>
      <WhatsAppButton />
      <Chatbot />
    </>
  );
}