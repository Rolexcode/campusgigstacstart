"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  AlertCircle,
  BadgeCheck,
  Check,
  ExternalLink,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { AppShell } from "../components/app-shell";
import { StatusPill } from "../components/status-pill";
import { useDemoStore, type User } from "../lib/demo-store";

export default function AdminPage() {
  const { verifications, users, gigs, applications, reviewVerification, refreshData } = useDemoStore();
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [previewIdCard, setPreviewIdCard] = useState<{ src: string; name: string } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const selectedRequest = selectedUser
    ? verifications.find((request) => request.userId === selectedUser.id)
    : undefined;

  useEffect(() => {
    if (!selectedUser && !previewIdCard) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (previewIdCard) setPreviewIdCard(null);
      else setSelectedUser(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [previewIdCard, selectedUser]);

  const registeredUsers = [...users].sort((a, b) => {
    const rank = { pending: 0, rejected: 1, verified: 2, not_submitted: 3 };
    const statusDiff = (rank[a.verificationStatus || "not_submitted"] ?? 3) - (rank[b.verificationStatus || "not_submitted"] ?? 3);
    return statusDiff || a.name.localeCompare(b.name);
  });

  const handleDecision = async (decision: "approved" | "rejected") => {
    if (!selectedRequest) return;
    await reviewVerification(selectedRequest.id, decision);
    setSelectedUser(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } finally {
      setRefreshing(false);
    }
  };

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
                  <h2 id="queue-title" className="mt-2 text-2xl font-bold tracking-tight">Registered users</h2>
                </div>
                <div className="flex items-center gap-3"><span className="hidden text-sm text-muted sm:block">{users.length} member{users.length === 1 ? "" : "s"} in the workspace</span><button type="button" className="btn btn-secondary" onClick={() => { void handleRefresh(); }} disabled={refreshing} aria-busy={refreshing}>{refreshing ? "Refreshing…" : "Refresh queue"}</button></div>
              </div>

              {registeredUsers.length ? (
                <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left">
                      <thead className="border-b border-border bg-muted-surface/60 text-xs uppercase tracking-wider text-muted">
                        <tr>
                          <th scope="col" className="px-5 py-4 font-bold">Member</th>
                          <th scope="col" className="px-5 py-4 font-bold">University</th>
                          <th scope="col" className="px-5 py-4 font-bold">Verification</th>
                          <th scope="col" className="px-5 py-4 font-bold">Joined</th>
                          <th scope="col" className="px-5 py-4 text-right font-bold">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {registeredUsers.map((user) => {
                          const request = verifications.find((item) => item.userId === user.id);
                          const status = user.verificationStatus || "not_submitted";
                          return (
                            <tr key={user.id} className="align-middle hover:bg-muted-surface/40">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <span className="avatar size-10"><GraduationCap size={18} aria-hidden="true" /></span>
                                  <div className="min-w-0">
                                    <p className="truncate font-bold">{user.name}</p>
                                    <p className="mt-1 flex items-center gap-1 text-sm text-muted"><Mail size={13} aria-hidden="true" />{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-sm font-semibold">{user.university || "Not added"}</td>
                              <td className="px-5 py-4"><StatusPill label={status === "pending" ? "Pending review" : status === "verified" ? "Verified" : status === "rejected" ? "Rejected" : "Not submitted"} tone={status === "pending" ? "pending" : status === "verified" ? "success" : status === "rejected" ? "danger" : "neutral"} /></td>
                              <td className="px-5 py-4 text-sm text-muted">{request ? formatDate(request.submittedAt) : "—"}</td>
                              <td className="px-5 py-4 text-right"><button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(user)}><ExternalLink size={16} aria-hidden="true" />Review details</button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mt-6 empty-state"><span className="empty-icon"><BadgeCheck size={24} aria-hidden="true" /></span><h3 className="text-lg font-bold">No registered users yet</h3><p className="max-w-md text-sm leading-6 text-muted">New accounts will appear here for profile and verification review.</p></div>
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
      {selectedUser ? (
        <>
          <button type="button" aria-label="Dismiss member details" className="fixed inset-0 z-40 cursor-default bg-ink/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <section role="dialog" aria-modal="true" aria-labelledby="member-details-title" className="fixed inset-x-4 top-[5vh] z-50 mx-auto max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl sm:inset-x-auto sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                <span className="avatar size-12"><GraduationCap size={22} aria-hidden="true" /></span>
                <div><p className="section-kicker">Member details</p><h2 id="member-details-title" className="mt-1 text-2xl font-bold">{selectedUser.name}</h2><p className="mt-1 text-sm text-muted">{selectedUser.email}</p></div>
              </div>
              <button type="button" className="btn btn-quiet" aria-label="Close member details" onClick={() => setSelectedUser(null)}><X size={18} aria-hidden="true" /></button>
            </div>
            <dl className="mt-8 grid gap-5 border-y border-border py-6 sm:grid-cols-2">
              <div><dt className="text-xs font-bold uppercase tracking-wider text-muted">University</dt><dd className="mt-2 font-semibold">{selectedUser.university || "Not added"}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-wider text-muted">Course</dt><dd className="mt-2 font-semibold">{selectedUser.course || "Not added"}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-wider text-muted">School email</dt><dd className="mt-2 break-all font-semibold">{selectedUser.schoolEmail || "Not added"}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-wider text-muted">Matric number</dt><dd className="mt-2 font-mono font-semibold">{selectedUser.matricNumber || "Not added"}</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Skills</dt><dd className="mt-2 font-semibold">{selectedUser.skills?.join(", ") || "Not added"}</dd></div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              {selectedUser.idCardUrl ? <button type="button" className="btn btn-secondary" onClick={() => setPreviewIdCard({ src: selectedUser.idCardUrl || "", name: selectedUser.name })}><ExternalLink size={16} aria-hidden="true" />View ID card</button> : <span className="text-sm text-muted">No ID card uploaded yet.</span>}
              {selectedUser.portfolioUrl ? <a className="btn btn-secondary" href={selectedUser.portfolioUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} aria-hidden="true" />Open work link</a> : null}
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-quiet" onClick={() => setSelectedUser(null)}>Dismiss</button>
              {selectedRequest?.status === "pending" ? <div className="flex flex-wrap gap-3"><button type="button" className="btn btn-danger" onClick={() => handleDecision("rejected")}><X size={16} aria-hidden="true" />Reject</button><button type="button" className="btn btn-primary" onClick={() => handleDecision("approved")}><Check size={16} aria-hidden="true" />Approve student</button></div> : <StatusPill label={selectedUser.verificationStatus === "verified" ? "Verified" : selectedUser.verificationStatus === "rejected" ? "Rejected" : "No request submitted"} tone={selectedUser.verificationStatus === "verified" ? "success" : selectedUser.verificationStatus === "rejected" ? "danger" : "neutral"} />}
            </div>
          </section>
        </>
      ) : null}
      {previewIdCard ? (
        <>
          <button type="button" aria-label="Close ID card preview" className="fixed inset-0 z-[60] cursor-default bg-ink/70 backdrop-blur-sm" onClick={() => setPreviewIdCard(null)} />
          <section role="dialog" aria-modal="true" aria-labelledby="id-card-preview-title" className="fixed inset-x-4 top-[5vh] z-[70] mx-auto max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-2xl sm:inset-x-auto sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div><p className="section-kicker">Verification evidence</p><h2 id="id-card-preview-title" className="mt-1 text-xl font-bold">{previewIdCard.name}&apos;s student ID</h2></div>
              <button type="button" className="btn btn-quiet" aria-label="Close ID card preview" onClick={() => setPreviewIdCard(null)}><X size={18} aria-hidden="true" /></button>
            </div>
            <div className="mt-5 max-h-[70vh] overflow-auto rounded-xl border border-border bg-ink/5 p-2">
              <Image src={previewIdCard.src} alt={`${previewIdCard.name}'s student ID card`} width={1200} height={900} unoptimized className="mx-auto h-auto max-h-[65vh] w-auto max-w-full rounded-lg object-contain" />
            </div>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}
