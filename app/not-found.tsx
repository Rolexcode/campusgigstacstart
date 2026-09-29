import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="page-shell grid min-h-screen place-items-center py-16">
      <div className="grid max-w-md place-items-center gap-4 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-muted-surface text-muted"><SearchX size={28} aria-hidden="true" /></span>
        <h1 className="text-2xl font-bold">That page isn’t available.</h1>
        <p className="text-sm leading-6 text-muted">Return home to find opportunities or set up your hiring workspace.</p>
        <Link href="/" className="btn btn-primary"><ArrowLeft size={17} aria-hidden="true" />Back home</Link>
      </div>
    </main>
  );
}
