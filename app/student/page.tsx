"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "../components/app-shell";
import { EmptyState } from "../components/empty-state";
import { StatusPill } from "../components/status-pill";
import { useDemoStore } from "../lib/demo-store";
import { gigRouteKey } from "../lib/gig-routing";

export default function StudentDashboardPage() {
  const { currentUser, gigs, applications, hydrated } = useDemoStore();
  const [query, setQuery] = useState("");

  const filteredGigs = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return gigs.filter((gig) => gig.status === "open");
    return gigs.filter((gig) =>
      [gig.title, gig.company, gig.category, gig.location]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [gigs, query]);

  const studentApplications = applications.filter((item) => item.studentId === currentUser?.id);

  return (
    <AppShell>
      <div className="page-shell py-8 sm:py-10">
        {!hydrated ? (
          <LoadingDashboard />
        ) : (
          <>
            <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-kicker">Student workspace</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Find work that lets you show the work.</h1>
                <p className="mt-3 max-w-2xl text-muted">Welcome, {currentUser?.name?.split(" ")[0] || "student"}. Complete a focused task and give employers real evidence to review.</p>
              </div>
              <Link href="/signup" className="btn btn-secondary shrink-0">Create another account</Link>
            </div>

            <div className="mt-6">
              {currentUser?.verificationStatus === "verified" ? (
                <div className="success-banner">
                  <BadgeCheck className="mt-0.5 shrink-0 text-primary" size={19} aria-hidden="true" />
                  <div>
                    <p className="font-bold text-foreground">Verified student</p>
                    <p className="mt-1 leading-6">Your university status is visible to employers alongside every Proof Task submission.</p>
                  </div>
                </div>
              ) : (
                <div className="warning-banner">
                  <ShieldAlert className="mt-0.5 shrink-0 text-warning" size={19} aria-hidden="true" />
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-foreground">{currentUser?.verificationStatus === "pending" ? "Verification under review" : "Verify your student status"}</p>
                      <p className="mt-1 leading-6">{currentUser?.verificationStatus === "pending" ? "The demo admin can approve your request from the review queue." : "Submit your school details to earn the verified-student badge."}</p>
                    </div>
                    <Link href="/student/verification" className="btn btn-secondary shrink-0">Open verification</Link>
                  </div>
                </div>
              )}
            </div>

            <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Student overview">
              <div className="metric-card">
                <p className="text-sm font-semibold text-muted">Open opportunities</p>
                <p className="mt-3 font-mono text-3xl font-bold">{gigs.filter((gig) => gig.status === "open").length}</p>
              </div>
              <div className="metric-card">
                <p className="text-sm font-semibold text-muted">Proofs submitted</p>
                <p className="mt-3 font-mono text-3xl font-bold">{studentApplications.filter((item) => item.proofComplete).length}</p>
              </div>
              <div className="metric-card">
                <p className="text-sm font-semibold text-muted">Shortlisted</p>
                <p className="mt-3 font-mono text-3xl font-bold text-primary">{studentApplications.filter((item) => item.status === "shortlisted").length}</p>
              </div>
            </section>

            <section className="mt-12" aria-labelledby="opportunities-title">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="section-kicker">Open now</p>
                  <h2 id="opportunities-title" className="mt-2 text-2xl font-bold tracking-tight">Opportunities with Proof Tasks</h2>
                </div>
                <div className="relative w-full sm:max-w-sm">
                  <Search className="pointer-events-none absolute left-3.5 top-3.5 text-muted" size={18} aria-hidden="true" />
                  <label className="sr-only" htmlFor="gig-search">Search opportunities</label>
                  <input
                    id="gig-search"
                    type="search"
                    className="input pl-11"
                    placeholder="Search role, company, or skill"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
              </div>

              {filteredGigs.length ? (
                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  {filteredGigs.map((gig) => {
                    const application = studentApplications.find((item) => item.gigId === gig.id);
                    return (
                      <article key={gig.id} className="card flex flex-col p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                            <BriefcaseBusiness size={21} aria-hidden="true" />
                          </span>
                          {application ? (
                            <StatusPill
                              label={application.status === "shortlisted" ? "Shortlisted" : "Proof submitted"}
                              tone={application.status === "shortlisted" ? "success" : "proof"}
                            />
                          ) : (
                            <StatusPill label="Proof Task" tone="proof" />
                          )}
                        </div>
                        <p className="mt-5 text-sm font-semibold text-primary">{gig.company}</p>
                        <h3 className="mt-1 text-xl font-bold">{gig.title}</h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{gig.description}</p>
                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-secondary">
                          <span className="flex items-center gap-1.5"><MapPin size={15} aria-hidden="true" />{gig.location}</span>
                          <span className="flex items-center gap-1.5"><Clock3 size={15} aria-hidden="true" />{gig.proofTask.timeEstimate}</span>
                        </div>
                        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
                          <div>
                            <p className="font-mono text-sm font-bold">{gig.budget}</p>
                            <p className="mt-1 text-xs text-muted">{gig.category}</p>
                          </div>
                          <Link href={`/student/gigs/${gigRouteKey(gig)}`} className="btn btn-secondary">
                            {application ? "View submission" : "View Proof Task"} <ArrowRight size={16} aria-hidden="true" />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6">
                  <EmptyState
                    title="No matching opportunities"
                    description="Try a broader role, company, or skill. The seeded demo opportunities are still available when you clear the search."
                  />
                </div>
              )}
            </section>

            <section className="mt-12 proof-panel sm:flex sm:items-center sm:justify-between sm:gap-8">
              <div className="relative z-10 max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Proof-first advantage</p>
                <h2 className="mt-3 text-2xl font-bold">Don’t wait for experience to become visible.</h2>
                <p className="mt-3 leading-7 text-slate-300">One thoughtful submission can tell an employer more than another empty “years of experience” field.</p>
              </div>
              <Sparkles className="relative z-10 mt-8 size-14 shrink-0 text-emerald-300 sm:mt-0" strokeWidth={1.5} aria-hidden="true" />
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

function LoadingDashboard() {
  return (
    <div aria-label="Loading student workspace" aria-busy="true">
      <div className="h-28 animate-pulse rounded-xl bg-muted-surface" />
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => <div key={item} className="h-28 animate-pulse rounded-xl bg-muted-surface" />)}
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {[0, 1].map((item) => <div key={item} className="h-72 animate-pulse rounded-xl bg-muted-surface" />)}
      </div>
    </div>
  );
}
