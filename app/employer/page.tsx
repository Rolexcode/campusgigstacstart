"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  Plus,
  Users,
} from "lucide-react";
import { AppShell } from "../components/app-shell";
import { EmptyState } from "../components/empty-state";
import { StatusPill } from "../components/status-pill";
import { useDemoStore } from "../lib/demo-store";

export default function EmployerDashboardPage() {
  const { currentUser, gigs, applications, hydrated } = useDemoStore();
  const employerGigs = gigs.filter((gig) => gig.employerId === currentUser?.id || gig.employerId === "employer-nuru");
  const employerApplications = applications.filter((application) => employerGigs.some((gig) => gig.id === application.gigId));

  return (
    <AppShell>
      <div className="page-shell py-8 sm:py-10">
        {!hydrated ? (
          <div aria-label="Loading employer workspace" aria-busy="true">
            <div className="h-28 animate-pulse rounded-xl bg-muted-surface" />
            <div className="mt-6 grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-28 animate-pulse rounded-xl bg-muted-surface" />)}</div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-kicker">Employer workspace</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">See the work before you make the hire.</h1>
                <p className="mt-3 max-w-2xl text-muted">{currentUser?.company || "Nuru Labs"} uses Proof Tasks to compare how students think, build, and communicate.</p>
              </div>
              <Link href="/employer/gigs/new" className="btn btn-primary shrink-0"><Plus size={17} aria-hidden="true" />Post a gig</Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Employer overview">
              <div className="metric-card">
                <p className="text-sm font-semibold text-muted">Open gigs</p>
                <p className="mt-3 font-mono text-3xl font-bold">{employerGigs.filter((gig) => gig.status === "open").length}</p>
              </div>
              <div className="metric-card">
                <p className="text-sm font-semibold text-muted">Applicants with proof</p>
                <p className="mt-3 font-mono text-3xl font-bold">{employerApplications.filter((item) => item.proofComplete).length}</p>
              </div>
              <div className="metric-card">
                <p className="text-sm font-semibold text-muted">Shortlisted</p>
                <p className="mt-3 font-mono text-3xl font-bold text-primary">{employerApplications.filter((item) => item.status === "shortlisted").length}</p>
              </div>
            </div>

            <section className="mt-12" aria-labelledby="gigs-title">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="section-kicker">Your opportunities</p>
                  <h2 id="gigs-title" className="mt-2 text-2xl font-bold tracking-tight">Gigs and Proof Tasks</h2>
                </div>
                <Link href="/employer/gigs/new" className="btn btn-secondary hidden sm:inline-flex"><Plus size={16} aria-hidden="true" />New gig</Link>
              </div>

              {employerGigs.length ? (
                <div className="mt-6 grid gap-4">
                  {employerGigs.map((gig) => {
                    const gigApplications = applications.filter((item) => item.gigId === gig.id);
                    const completed = gigApplications.filter((item) => item.proofComplete).length;
                    return (
                      <article key={gig.id} className="card p-5 sm:p-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex min-w-0 items-start gap-4">
                            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><BriefcaseBusiness size={21} aria-hidden="true" /></span>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-xl font-bold">{gig.title}</h3>
                                <StatusPill label={gig.status === "open" ? "Open" : "Closed"} tone={gig.status === "open" ? "success" : "neutral"} />
                              </div>
                              <p className="mt-2 text-sm leading-6 text-muted">{gig.description}</p>
                              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-secondary">
                                <span className="font-mono font-bold">{gig.budget}</span>
                                <span className="flex items-center gap-1.5"><ClipboardCheck size={15} aria-hidden="true" />{gig.proofTask.title}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center justify-between gap-5 border-t border-border pt-4 lg:block lg:border-t-0 lg:pt-0 lg:text-right">
                            <div className="flex items-center gap-2 text-sm font-semibold text-secondary lg:justify-end"><Users size={16} aria-hidden="true" />{gigApplications.length} applicant{gigApplications.length === 1 ? "" : "s"}</div>
                            <p className="mt-1 text-xs text-muted">{completed} with proof submitted</p>
                            <Link href={`/employer/gigs/${gig.id}/applicants`} className="btn btn-secondary mt-3">Review applicants <ArrowRight size={15} aria-hidden="true" /></Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6"><EmptyState title="No gigs yet" description="Create your first remote opportunity and attach a task that lets students show how they work." actionLabel="Post your first gig" actionHref="/employer/gigs/new" /></div>
              )}
            </section>

            <section className="mt-12 grid gap-5 lg:grid-cols-2">
              <div className="card p-6 sm:p-7">
                <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary"><BadgeCheck size={22} aria-hidden="true" /></span>
                <h2 className="mt-5 text-xl font-bold">What the badge tells you</h2>
                <p className="mt-2 leading-7 text-muted">The student is currently connected to a university. The attached Proof Task shows you what they can do for this role.</p>
              </div>
              <div className="proof-panel">
                <p className="relative z-10 text-xs font-bold uppercase tracking-widest text-emerald-300">Hiring principle</p>
                <h2 className="relative z-10 mt-3 text-2xl font-bold">Compare confidence, not credentials.</h2>
                <p className="relative z-10 mt-3 leading-7 text-slate-300">Open an applicant’s proof, see the reasoning behind the work, and shortlist the person you can see succeeding.</p>
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
