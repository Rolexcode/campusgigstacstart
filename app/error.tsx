"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content" className="page-shell grid min-h-screen place-items-center py-16">
      <div className="grid max-w-md place-items-center gap-4 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-warning-soft text-warning"><AlertTriangle size={28} aria-hidden="true" /></span>
        <h1 className="text-2xl font-bold">This workspace needs a reset.</h1>
        <p className="text-sm leading-6 text-muted">A temporary error interrupted the demo. Your saved browser data is still safe.</p>
        <button type="button" className="btn btn-primary" onClick={() => reset()}><RotateCcw size={17} aria-hidden="true" />Try again</button>
      </div>
    </main>
  );
}
