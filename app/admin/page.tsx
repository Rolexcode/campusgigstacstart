"use client";

import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  BadgeCheck,
  Check,
  ClipboardList,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { AppShell } from "../components/app-shell";
import { StatusPill } from "../components/status-pill";
import { useDemoStore } from "../lib/demo-store";

export default function AdminPage() {
  const { verifications, users, gigs, applications, reviewVerification } = useDemoStore();
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setChecking(true);
    window.setTimeout(() => {
      if (pin === "2026") {
        setAuthenticated(true);
        setError("");
      } else {
        setError("That PIN is not correct. Check your admin credentials and try again.");
      }
      setChecking(false);
    }, 300);
  };

  return (
    <AppShell>
      <div className="page-shell py-8 sm:py-12">
        {!authenticated ? (
          <div className="mx-auto grid max-w-3xl gap-10 lg:grid-cols-5 lg:items-center">
            <section className="lg:col-span-3">
              <p className="section-kicker">Admin access</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">A small trust queue for a serious first step.</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">Approve student status requests before the verified badge appears in an employer’s applicant view.</p>
            </section>
            <section className="card card-raised p-6 sm:p-8 lg:col-span-2">
              <span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary"><LockKeyhole size={23} aria-hidden="true" /></span>
              <h2 className="mt-5 text-xl font-bold">Enter admin PIN</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Use the administrator PIN configured for this workspace.</p>
              <form className="mt-6" onSubmit={handleLogin}>
                <div className="field">
                  <label htmlFor="admin-pin">Admin PIN</label>
                  <input id="admin-pin" name="pin" type="password" inputMode="numeric" autoComplete="one-time-code" className="input font-mono tracking-widest" value={pin} onChange={(event) => setPin(event.target.value)} placeholder="••••" aria-invalid={error ? "true" : undefined} aria-describedby={error ? "pin-error" : "pin-hint"} />
                  {error ? <p id="pin-error" className="field-error flex items-center gap-1.5"><AlertCircle size={14} aria-hidden="true" />{error}</p> : <p id="pin-hint" className="field-hint">Enter the four-digit administrator PIN.</p>}
                </div>
                <button type="submit" className="btn btn-primary mt-5 w-full" disabled={checking || !pin} aria-busy={checking}>
                  {checking ? <LoaderCircle className="animate-spin" size={17} aria-hidden="true" /> : <ShieldCheck size={17} aria-hidden="true" />}
                  {checking ? "Checking…" : "Open review queue"}
                </button>
              </form>
            </section>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-kicker">Admin review queue</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Keep verification simple and accountable.</h1>
                <p className="mt-3 max-w-2xl text-muted">Review the details students submitted, then approve the badge that employers see beside their Proof Task.</p>
              </div>
              <StatusPill label="Admin session" tone="success" />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              <div className="metric-card"><p className="text-sm font-semibold text-muted">Pending</p><p className="mt-2 font-mono text-2xl font-bold text-warning">{verifications.filter((item) => item.status === "pending").length}</p></div>
              <div className="metric-card"><p className="text-sm font-semibold text-muted">Verified students</p><p className="mt-2 font-mono text-2xl font-bold text-primary">{users.filter((item) => item.verificationStatus === "verified").length}</p></div>
              <div className="metric-card"><p className="text-sm font-semibold text-muted">Open gigs</p><p className="mt-2 font-mono text-2xl font-bold">{gigs.filter((item) => item.status === "open").length}</p></div>
              <div className="metric-card"><p className="text-sm font-semibold text-muted">Applications</p><p className="mt-2 font-mono text-2xl font-bold">{applications.length}</p></div>
            </div>

            <section className="mt-10" aria-labelledby="queue-title">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="section-kicker">Student status</p>
                  <h2 id="queue-title" className="mt-2 text-2xl font-bold tracking-tight">Verification requests</h2>
                </div>
                <span className="hidden text-sm text-muted sm:block">{verifications.length} request{verifications.length === 1 ? "" : "s"} in the queue</span>
              </div>

              {verifications.length ? (
                <div className="mt-6 grid gap-4">
                  {verifications.map((request) => (
                    <article key={request.id} className={`card p-5 sm:p-6 ${request.status === "pending" ? "" : "opacity-80"}`}>
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          <span className="avatar size-12"><GraduationCap size={22} aria-hidden="true" /></span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xl font-bold">{request.studentName}</h3>
                              <StatusPill label={request.status === "pending" ? "Pending review" : request.status === "approved" ? "Approved" : "Rejected"} tone={request.status === "pending" ? "pending" : request.status === "approved" ? "success" : "danger"} />
                            </div>
                            <p className="mt-1 text-sm text-muted">Submitted {formatDate(request.submittedAt)}</p>
                          </div>
                        </div>
                        {request.status === "pending" ? (
                          <div className="flex gap-2 lg:shrink-0">
                            <button type="button" className="btn btn-danger" onClick={() => reviewVerification(request.id, "rejected")}><X size={16} aria-hidden="true" />Reject</button>
                            <button type="button" className="btn btn-primary" onClick={() => reviewVerification(request.id, "approved")}><Check size={16} aria-hidden="true" />Approve</button>
                          </div>
                        ) : null}
                      </div>
                      <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div><dt className="text-xs font-bold uppercase tracking-wider text-muted">University</dt><dd className="mt-2 text-sm font-semibold">{request.university}</dd></div>
                        <div><dt className="text-xs font-bold uppercase tracking-wider text-muted">School email</dt><dd className="mt-2 break-all text-sm font-semibold">{request.schoolEmail}</dd></div>
                        <div><dt className="text-xs font-bold uppercase tracking-wider text-muted">Student number</dt><dd className="mt-2 font-mono text-sm font-semibold">{request.matricNumber}</dd></div>
                        <div><dt className="text-xs font-bold uppercase tracking-wider text-muted">Skills</dt><dd className="mt-2 text-sm font-semibold">{request.skills?.join(", ") || "Not added"}</dd></div>
                      </dl>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {request.idCardUrl ? <a className="btn btn-secondary" href={request.idCardUrl} target="_blank" rel="noreferrer">Open ID card</a> : null}
                        {request.portfolioUrl ? <a className="btn btn-secondary" href={request.portfolioUrl} target="_blank" rel="noreferrer">Open work link</a> : null}
                      </div>
                      {request.note ? <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-muted"><ClipboardList size={16} className="mt-0.5 shrink-0" aria-hidden="true" />{request.note}</p> : null}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 empty-state"><span className="empty-icon"><BadgeCheck size={24} aria-hidden="true" /></span><h3 className="text-lg font-bold">Queue is clear</h3><p className="max-w-md text-sm leading-6 text-muted">New student verification requests will appear here.</p></div>
              )}
            </section>

            <section className="mt-12 card p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <UserRound className="mt-0.5 text-primary" size={21} aria-hidden="true" />
                <div>
                  <h2 className="font-bold">What this admin step is proving</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">For the hackathon, this is intentionally lightweight: a clear request, a visible decision, and a badge that carries into the hiring review. It is not pretending to be production KYC.</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}
