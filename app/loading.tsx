export default function Loading() {
  return (
    <main id="main-content" className="page-shell grid min-h-screen place-items-center py-16">
      <div className="grid gap-3 text-center" role="status" aria-live="polite">
        <div className="mx-auto size-10 animate-pulse rounded-xl bg-primary-soft" aria-hidden="true" />
        <p className="text-sm font-semibold text-muted">Loading CampusGig…</p>
      </div>
    </main>
  );
}
