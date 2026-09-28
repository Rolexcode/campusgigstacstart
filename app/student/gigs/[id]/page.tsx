"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  Clock3,
  Code2,
  Link2,
  LoaderCircle,
  MapPin,
  Send,
  ShieldAlert,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { AppShell } from "../../../components/app-shell";
import { StatusPill } from "../../../components/status-pill";
import { useDemoStore } from "../../../lib/demo-store";

type Errors = Partial<Record<"introduction" | "proofResponse" | "links", string>>;

export default function StudentGigDetailPage() {
  const params = useParams<{ id: string }>();
  const { gigs, applications, currentUser, submitApplication } = useDemoStore();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const gig = gigs.find((item) => item.id === params.id);
  const application = applications.find(
    (item) => item.gigId === params.id && item.studentId === currentUser?.id,
  );

  if (!gig) {
    return (
      <AppShell>
        <div className="page-shell py-16 text-center">
          <h1 className="text-3xl font-bold">Opportunity not found</h1>
          <p className="mt-3 text-muted">This demo gig may have been reset or removed.</p>
          <Link href="/student" className="btn btn-primary mt-6">Back to opportunities</Link>
        </div>
      </AppShell>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      introduction: String(data.get("introduction") || "").trim(),
      proofResponse: String(data.get("proofResponse") || "").trim(),
      githubUrl: String(data.get("githubUrl") || "").trim(),
      previewUrl: String(data.get("previewUrl") || "").trim(),
    };
    const nextErrors: Errors = {};
    if (values.introduction.length < 20) nextErrors.introduction = "Write at least 20 characters about your fit.";
    if (values.proofResponse.length < 40) nextErrors.proofResponse = "Explain your approach in at least 40 characters.";
    if (!values.githubUrl && !values.previewUrl) nextErrors.links = "Add a GitHub or live preview URL.";
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      const fieldId = firstError === "links" ? "githubUrl" : firstError;
      window.requestAnimationFrame(() => document.getElementById(fieldId)?.focus());
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      submitApplication(gig.id, values);
      setSubmitting(false);
    }, 500);
  };

  return (
    <AppShell>
      <div className="page-shell py-8 sm:py-12">
        <Link href="/student" className="focus-ring rounded text-sm font-semibold text-primary hover:underline">← Back to opportunities</Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-5">
          <section className="lg:col-span-3">
            <div className="card p-5 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary"><BriefcaseBusiness size={23} aria-hidden="true" /></span>
                <StatusPill label="Open · Proof Task required" tone="proof" />
              </div>
              <p className="mt-6 font-semibold text-primary">{gig.company}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{gig.title}</h1>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-secondary">
                <span className="flex items-center gap-1.5"><MapPin size={16} aria-hidden="true" />{gig.location}</span>
                <span className="font-mono font-bold">{gig.budget}</span>
                <span>{gig.category}</span>
              </div>
              <div className="mt-8 border-t border-border pt-7">
                <h2 className="text-lg font-bold">About the opportunity</h2>
                <p className="mt-3 leading-7 text-muted">{gig.description}</p>
              </div>
            </div>

            <div className="proof-panel mt-6">
              <div className="relative z-10 flex items-start gap-4">
                <span className="proof-core grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-300 text-ink"><Code2 size={23} aria-hidden="true" /></span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Proof Task</p>
                  <h2 className="mt-2 text-2xl font-bold">{gig.proofTask.title}</h2>
                </div>
              </div>
              <p className="relative z-10 mt-6 max-w-2xl leading-7 text-slate-300">{gig.proofTask.instructions}</p>
              <dl className="relative z-10 mt-7 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Expected deliverable</dt>
                  <dd className="mt-2 text-sm font-semibold">{gig.proofTask.deliverable}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Suggested time</dt>
                  <dd className="mt-2 flex items-center gap-2 text-sm font-semibold"><Clock3 size={16} className="text-emerald-300" aria-hidden="true" />{gig.proofTask.timeEstimate}</dd>
                </div>
              </dl>
            </div>
          </section>

          <aside className="lg:col-span-2">
            {application ? (
              <div className="card card-raised sticky top-28 p-5 sm:p-7">
                <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary"><Check size={28} aria-hidden="true" /></span>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold">Proof submitted</h2>
                  <StatusPill label={application.status === "shortlisted" ? "Shortlisted" : "Under review"} tone={application.status === "shortlisted" ? "success" : "pending"} />
                </div>
                <p className="mt-3 leading-7 text-muted">Your response and links are now visible in the employer’s applicant comparison view.</p>
                <div className="mt-6 grid gap-3 border-y border-border py-5 text-sm">
                  {application.githubUrl ? <a className="flex min-h-10 items-center gap-2 font-semibold text-primary hover:underline focus-ring rounded" href={application.githubUrl} target="_blank" rel="noreferrer"><Code2 size={17} aria-hidden="true" />Open GitHub submission <ArrowUpRight size={14} aria-hidden="true" /></a> : null}
                  {application.previewUrl ? <a className="flex min-h-10 items-center gap-2 font-semibold text-primary hover:underline focus-ring rounded" href={application.previewUrl} target="_blank" rel="noreferrer"><Link2 size={17} aria-hidden="true" />Open live preview <ArrowUpRight size={14} aria-hidden="true" /></a> : null}
                </div>
                <p className="mt-5 text-sm leading-6 text-muted">You can reset the demo from the profile menu if you want to submit again.</p>
              </div>
            ) : currentUser?.verificationStatus !== "verified" ? (
              <div className="card card-raised sticky top-28 p-5 sm:p-7">
                <span className="grid size-14 place-items-center rounded-2xl bg-warning-soft text-warning"><ShieldAlert size={27} aria-hidden="true" /></span>
                <h2 className="mt-5 text-2xl font-bold">Verify before applying</h2>
                <p className="mt-3 leading-7 text-muted">Complete the lightweight verification flow so employers can trust your student status.</p>
                <Link href="/student/verification" className="btn btn-primary mt-6 w-full">Open verification</Link>
              </div>
            ) : (
              <form className="card card-raised sticky top-28 p-5 sm:p-7" onSubmit={handleSubmit} noValidate>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="section-kicker">Apply with proof</p>
                    <h2 className="mt-2 text-2xl font-bold">Show your approach</h2>
                  </div>
                  <BadgeCheck className="text-primary" size={26} aria-label="Verified student" />
                </div>

                <div className="mt-6 grid gap-5">
                  <div className="field">
                    <label htmlFor="introduction">Why you’re a fit <span aria-hidden="true">*</span></label>
                    <textarea id="introduction" name="introduction" className="input" placeholder="Connect your current skills to this opportunity." aria-invalid={errors.introduction ? "true" : undefined} aria-describedby={errors.introduction ? "introduction-error" : undefined} />
                    {errors.introduction ? <p id="introduction-error" className="field-error">{errors.introduction}</p> : null}
                  </div>
                  <div className="field">
                    <label htmlFor="proofResponse">Proof Task response <span aria-hidden="true">*</span></label>
                    <textarea id="proofResponse" name="proofResponse" className="input" placeholder="Explain what you built, your decisions, and what you would improve." aria-invalid={errors.proofResponse ? "true" : undefined} aria-describedby={errors.proofResponse ? "proofResponse-error" : undefined} />
                    {errors.proofResponse ? <p id="proofResponse-error" className="field-error">{errors.proofResponse}</p> : null}
                  </div>
                  <div className="field">
                    <label htmlFor="githubUrl">GitHub or project URL</label>
                    <input id="githubUrl" name="githubUrl" type="url" inputMode="url" className="input" spellCheck={false} placeholder="https://github.com/you/project" aria-invalid={errors.links ? "true" : undefined} aria-describedby={errors.links ? "links-error" : undefined} />
                  </div>
                  <div className="field">
                    <label htmlFor="previewUrl">Live preview URL</label>
                    <input id="previewUrl" name="previewUrl" type="url" inputMode="url" className="input" spellCheck={false} placeholder="https://your-project.vercel.app" aria-invalid={errors.links ? "true" : undefined} aria-describedby={errors.links ? "links-error" : undefined} />
                    {errors.links ? <p id="links-error" className="field-error">{errors.links}</p> : <p className="field-hint">Add at least one link. No file upload is required.</p>}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-large mt-6 w-full" disabled={submitting} aria-busy={submitting}>
                  {submitting ? <LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
                  {submitting ? "Submitting proof…" : "Submit Proof Task"}
                </button>
              </form>
            )}
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
