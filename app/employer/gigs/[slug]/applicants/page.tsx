"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  Code2,
  Link2,
  MessageSquareText,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "../../../../components/app-shell";
import { EmptyState } from "../../../../components/empty-state";
import { StatusPill } from "../../../../components/status-pill";
import { useDemoStore } from "../../../../lib/demo-store";
import { findGigByRouteKey } from "../../../../lib/gig-routing";

export default function ApplicantsPage() {
  const params = useParams<{ slug: string }>();
  const { gigs, applications, users, reviews, shortlistApplication, selectApplicant, saveReview } = useDemoStore();
  const [openApplication, setOpenApplication] = useState<string | null>(null);
  const [openProfile, setOpenProfile] = useState<string | null>(null);
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, { decision: "strong_yes" | "follow_up" | "pass"; note: string }>>({});
  const [savedReview, setSavedReview] = useState<string | null>(null);

  const handleSaveReview = async (applicationId: string, decision: "strong_yes" | "follow_up" | "pass", note: string) => {
    try {
      await saveReview(applicationId, decision, note);
      setSavedReview(applicationId);
      window.setTimeout(() => setSavedReview(null), 1800);
    } catch {
      setSavedReview(null);
    }
  };
  const gig = findGigByRouteKey(gigs, params.slug);
  const gigApplications = applications.filter((item) => item.gigId === gig?.id);

  if (!gig) {
    return (
      <AppShell>
        <div className="page-shell py-16 text-center">
          <h1 className="text-3xl font-bold">Gig not found</h1>
          <p className="mt-3 text-muted">This opportunity may have closed or been removed.</p>
          <Link href="/employer" className="btn btn-primary mt-6">Back to employer workspace</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="page-shell py-8 sm:py-12">
        <Link href="/employer" className="focus-ring rounded text-sm font-semibold text-primary hover:underline"><ArrowLeft size={15} className="mr-1 inline" aria-hidden="true" />Back to employer workspace</Link>
        <div className="mt-6 flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Applicant review</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{gig.title}</h1>
            <p className="mt-3 max-w-2xl text-muted">Review each Proof Task, open the student profile, then choose who moves forward.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-secondary"><Users size={17} aria-hidden="true" />{gigApplications.length} applicant{gigApplications.length === 1 ? "" : "s"}</div>
        </div>

        {gig.selectedApplicantId ? (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={21} aria-hidden="true" /><div><p className="font-bold">{gig.selectedApplicantName} selected for this gig</p><p className="mt-1 text-sm leading-6 text-slate-300">The position is now closed. Their profile and Proof Task remain available for the next hiring step.</p></div></div>
            <StatusPill label="Position filled" tone="success" />
          </div>
        ) : null}

        {gigApplications.length ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="metric-card"><p className="text-sm font-semibold text-muted">Proof submitted</p><p className="mt-2 font-mono text-2xl font-bold">{gigApplications.filter((item) => item.proofComplete).length}<span className="text-base text-muted"> / {gigApplications.length}</span></p></div>
              <div className="metric-card"><p className="text-sm font-semibold text-muted">Verified students</p><p className="mt-2 font-mono text-2xl font-bold">{gigApplications.length}</p></div>
              <div className="metric-card"><p className="text-sm font-semibold text-muted">Shortlisted</p><p className="mt-2 font-mono text-2xl font-bold text-primary">{gigApplications.filter((item) => item.status === "shortlisted").length}</p></div>
            </div>

            <div className="mt-10 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary-soft p-4 text-sm text-secondary">
              <Sparkles className="mt-0.5 shrink-0 text-primary" size={18} aria-hidden="true" />
              <p><strong className="text-foreground">Review the evidence.</strong> A verified badge tells you who the student is. The Proof Task tells you how they work.</p>
            </div>

            <section className="mt-8 grid gap-5 lg:grid-cols-2" aria-label="Applicant comparison">
              {gigApplications.map((application) => {
                const proofOpen = openApplication === application.id;
                const profileOpen = openProfile === application.id;
                const existingReview = reviews.find((item) => item.applicationId === application.id);
                const studentProfile = users.find((user) => user.id === application.studentId);
                const selected = gig.selectedApplicantId === application.studentId;
                const reviewDraft = reviewDrafts[application.id] ?? {
                  decision: existingReview?.decision ?? "follow_up",
                  note: existingReview?.note ?? "",
                };
                return (
                  <article key={application.id} className={`card overflow-hidden ${application.status === "shortlisted" ? "border-primary/60" : ""}`}>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="avatar size-12 text-sm">{initials(application.studentName)}</span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-xl font-bold">{application.studentName}</h2>
                              <BadgeCheck size={17} className="text-primary" aria-label="Verified student" />
                            </div>
                            <p className="mt-1 text-sm text-muted">{application.university}</p>
                          </div>
                        </div>
                        {selected ? <StatusPill label="Selected" tone="success" /> : application.status === "not_selected" ? <StatusPill label="Not selected" tone="danger" /> : application.status === "shortlisted" ? <StatusPill label="Shortlisted" tone="success" /> : <StatusPill label="In review" tone="neutral" />}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {application.skills.map((skill) => <span key={skill} className="rounded-full bg-muted-surface px-2.5 py-1 text-xs font-semibold text-secondary">{skill}</span>)}
                      </div>

                      <div className="mt-6 rounded-xl border border-border bg-surface-raised p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-sm font-bold"><ShieldCheck size={17} className={application.proofComplete ? "text-primary" : "text-muted"} aria-hidden="true" />Proof Task</div>
                          <StatusPill label={application.proofComplete ? "Completed" : "Not submitted"} tone={application.proofComplete ? "success" : "neutral"} />
                        </div>
                        {application.proofComplete ? <p className="mt-3 text-sm leading-6 text-muted">The applicant submitted a written approach and project links for review.</p> : <p className="mt-3 text-sm leading-6 text-muted">This applicant has a profile and introduction, but no practical proof attached yet.</p>}
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button type="button" className="btn btn-secondary flex-1" onClick={() => setOpenApplication(proofOpen ? null : application.id)} aria-expanded={proofOpen}>
                          <ExternalLink size={16} aria-hidden="true" />{proofOpen ? "Hide submission" : "Review submission"}
                        </button>
                        <button type="button" className="btn btn-secondary flex-1" onClick={() => setOpenProfile(profileOpen ? null : application.id)} aria-expanded={profileOpen}>
                          <UserRound size={16} aria-hidden="true" />{profileOpen ? "Hide profile" : "View profile"}
                        </button>
                        <button type="button" className={`btn flex-1 ${application.status === "shortlisted" ? "btn-quiet" : "btn-primary"}`} onClick={() => { void shortlistApplication(application.id); }} disabled={application.status === "shortlisted" || selected || application.status === "not_selected"}>
                          <ShieldCheck size={16} aria-hidden="true" />{application.status === "shortlisted" ? "Shortlisted" : "Shortlist student"}
                        </button>
                      </div>

                      <button type="button" className="btn btn-primary mt-3 w-full" onClick={() => { void selectApplicant(application.id); }} disabled={Boolean(gig.selectedApplicantId) || application.status === "not_selected"}>
                        <CheckCircle2 size={16} aria-hidden="true" />{selected ? "Student selected" : gig.selectedApplicantId ? "Position filled" : "Select student"}
                      </button>

                      <div className="mt-5 rounded-xl border border-border bg-surface-raised p-4">
                        <div className="flex items-start gap-2">
                          <MessageSquareText className="mt-0.5 shrink-0 text-primary" size={17} aria-hidden="true" />
                          <div>
                            <p className="text-sm font-bold">Team review</p>
                            <p className="mt-1 text-xs leading-5 text-muted">Leave a recommendation your hiring team can act on.</p>
                          </div>
                        </div>
                        {existingReview ? <p className="mt-3 text-xs text-muted">Last note by <span className="font-semibold text-secondary">{existingReview.authorName}</span></p> : null}
                        <div className="mt-3 grid gap-3 sm:grid-cols-[11rem_1fr]">
                          <label className="sr-only" htmlFor={`decision-${application.id}`}>Team recommendation</label>
                          <select
                            id={`decision-${application.id}`}
                            className="field"
                            value={reviewDraft.decision}
                            onChange={(event) => setReviewDrafts((current) => ({ ...current, [application.id]: { ...reviewDraft, decision: event.target.value as typeof reviewDraft.decision } }))}
                          >
                            <option value="strong_yes">Strong yes</option>
                            <option value="follow_up">Follow up</option>
                            <option value="pass">Pass</option>
                          </select>
                          <label className="sr-only" htmlFor={`note-${application.id}`}>Team note</label>
                          <input
                            id={`note-${application.id}`}
                            className="field"
                            value={reviewDraft.note}
                            onChange={(event) => setReviewDrafts((current) => ({ ...current, [application.id]: { ...reviewDraft, note: event.target.value } }))}
                            placeholder="What should the next reviewer know?"
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-quiet mt-3 w-full justify-center sm:w-auto"
                          onClick={() => { void handleSaveReview(application.id, reviewDraft.decision, reviewDraft.note); }}
                        >
                          <Save size={15} aria-hidden="true" />{savedReview === application.id ? "Saved to team review" : "Save team note"}
                        </button>
                      </div>
                    </div>

                    {proofOpen ? (
                      <div className="border-t border-border bg-muted-surface p-5 sm:p-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted">Student introduction</p>
                        <p className="mt-2 text-sm leading-6 text-secondary">{application.introduction}</p>
                        {application.proofComplete ? (
                          <>
                            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-muted">Their approach</p>
                            <p className="mt-2 text-sm leading-6 text-secondary">{application.proofResponse}</p>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              {application.githubUrl ? <a className="btn btn-secondary justify-start" href={application.githubUrl} target="_blank" rel="noreferrer"><Code2 size={16} aria-hidden="true" />GitHub <ArrowUpRight size={14} className="ml-auto" aria-hidden="true" /></a> : null}
                              {application.previewUrl ? <a className="btn btn-secondary justify-start" href={application.previewUrl} target="_blank" rel="noreferrer"><Link2 size={16} aria-hidden="true" />Live preview <ArrowUpRight size={14} className="ml-auto" aria-hidden="true" /></a> : null}
                            </div>
                          </>
                        ) : <p className="mt-4 text-sm text-muted">There is no Proof Task response to open yet.</p>}
                      </div>
                    ) : null}
                    {profileOpen ? (
                      <div className="border-t border-border bg-surface-raised p-5 sm:p-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted">Student profile</p>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Course</p><p className="mt-2 font-semibold">{studentProfile?.course || "Not added"}</p></div>
                          <div><p className="text-xs font-bold uppercase tracking-wider text-muted">University</p><p className="mt-2 font-semibold">{studentProfile?.university || application.university}</p></div>
                          <div className="sm:col-span-2"><p className="text-xs font-bold uppercase tracking-wider text-muted">Skills</p><p className="mt-2 font-semibold">{studentProfile?.skills?.join(", ") || application.skills.join(", ") || "Not added"}</p></div>
                        </div>
                        {studentProfile?.portfolioUrl ? <a className="btn btn-secondary mt-5" href={studentProfile.portfolioUrl} target="_blank" rel="noreferrer"><Link2 size={16} aria-hidden="true" />Open work profile <ArrowUpRight size={14} aria-hidden="true" /></a> : <p className="mt-5 text-sm text-muted">No work profile link added.</p>}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </section>
          </>
        ) : (
          <div className="mt-8">
            <EmptyState title="No applicants yet" description="Your gig is live, but nobody has submitted a Proof Task. Share the opportunity with students when you’re ready." />
          </div>
        )}

        <section className="mt-12 card p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 text-primary" size={21} aria-hidden="true" />
            <div>
              <h2 className="font-bold">Keep the task fair</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Proof Tasks should test a real slice of the work, stay time-boxed, and leave room for a student to explain their choices.</p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}
