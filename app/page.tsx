import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  Code2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BrandMark } from "./components/brand-mark";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur-md">
        <div className="page-shell flex min-h-18 items-center justify-between gap-4">
          <BrandMark />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            <a className="nav-link" href="#how-it-works">How it works</a>
            <a className="nav-link" href="#proof-tasks">Proof Tasks</a>
            <a className="nav-link" href="#for-employers">For employers</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-quiet hidden sm:inline-flex">Sign in</Link>
            <Link href="/signup" className="btn btn-secondary hidden sm:inline-flex">Create account</Link>
            <Link href="/signup" className="btn btn-primary">
              Get started <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="landing-grid border-b border-border">
          <div className="page-shell grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
            <div>
              <div className="eyebrow">
                <Sparkles size={14} aria-hidden="true" />
                Future of Work · Proof-first hiring
              </div>
              <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-none tracking-tighter sm:text-6xl lg:text-7xl">
                Your first job shouldn’t require your first job.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
                CampusGig helps verified university students earn paid opportunities by showing what they can do—not how long they’ve been doing it.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup?role=student" className="btn btn-primary btn-large">
                  Find your next opportunity <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <Link href="/signup?role=employer" className="btn btn-secondary btn-large">
                  I’m hiring
                </Link>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-border pt-6">
                {[
                  ["Verified", "student profiles"],
                  ["Practical", "Proof Tasks"],
                  ["Direct", "shortlisting"],
                ].map(([value, label]) => (
                  <div key={value}>
                    <p className="text-sm font-bold text-foreground sm:text-base">{value}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="proof-tasks" className="proof-panel min-h-144">
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Proof Task · Submitted</p>
                  <p className="mt-2 text-sm text-slate-300">Junior Frontend Developer</p>
                </div>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs text-slate-300">CG-1042</span>
              </div>

              <div className="relative z-10 mt-8 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <span className="proof-core grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-300 text-ink">
                    <Code2 size={22} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-bold">Rebuild a responsive pricing card</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">Show responsive structure, keyboard focus, and one accessibility decision.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                  <span className="flex items-center gap-2"><Check size={15} className="text-emerald-300" aria-hidden="true" />GitHub submitted</span>
                  <span className="flex items-center gap-2"><Check size={15} className="text-emerald-300" aria-hidden="true" />Live preview ready</span>
                </div>
              </div>

              <div className="proof-orbit" aria-hidden="true" />

              <div className="relative z-10 mt-20 rounded-xl bg-white p-5 text-ink shadow-lg">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">AY</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">Amina Yusuf</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-1 text-xs font-bold text-primary">
                        <BadgeCheck size={13} aria-hidden="true" /> Verified student
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">University of Lagos · Computer Science</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-sm font-semibold text-slate-600">Proof reviewed</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary"><ShieldCheck size={16} aria-hidden="true" />Shortlisted</span>
                </div>
              </div>

              <div className="relative z-10 mt-6 flex items-center gap-3 border-t border-white/10 pt-5 text-xs font-bold uppercase tracking-widest">
                <span className="text-emerald-300">01 / 03</span>
                <span className="h-px flex-1 bg-white/15"><span className="block h-px w-1/3 bg-emerald-300" /></span>
                <span className="text-slate-400">Ability, made visible</span>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-border bg-surface py-20">
          <div className="page-shell">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
              <div>
                <p className="section-kicker">A clearer route in</p>
                <h2 className="section-title mt-3 max-w-xl">Experience starts with someone willing to see the evidence.</h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-muted lg:justify-self-end">
                CampusGig replaces the cold-start problem of empty CVs and zero platform ratings with one focused, job-relevant task.
              </p>
            </div>

            <ol className="mt-12 grid border-y border-border md:grid-cols-4">
              {[
                ["01", "Find a gig", "Browse paid, remote-friendly work built for emerging talent."],
                ["02", "Complete the proof", "Respond to a small practical task attached to the opportunity."],
                ["03", "Show your work", "Submit a response, repository, or live preview."],
                ["04", "Get shortlisted", "Employers compare evidence of ability—not years on a CV."],
              ].map(([number, title, copy], index) => (
                <li key={number} className={`py-7 md:px-6 ${index ? "border-t border-border md:border-l md:border-t-0" : ""}`}>
                  <span className="font-mono text-sm font-bold text-primary">{number}</span>
                  <h3 className="mt-8 text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="for-employers" className="py-20">
          <div className="page-shell grid gap-6 lg:grid-cols-5">
            <article className="rounded-2xl bg-ink p-7 text-white lg:col-span-3 sm:p-10">
              <span className="grid size-12 place-items-center rounded-xl bg-white/10 text-emerald-300">
                <BriefcaseBusiness size={23} aria-hidden="true" />
              </span>
              <p className="mt-14 font-mono text-xs uppercase tracking-widest text-slate-400">For employers</p>
              <h2 className="mt-3 max-w-xl text-4xl font-bold leading-tight tracking-tight">Hire for the work, not the résumé.</h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-300">
                Attach one practical task, review student submissions side by side, and give your hiring team a shared recommendation before you shortlist.
              </p>
              <Link href="/signup?role=employer" className="btn mt-8 bg-white text-ink hover:bg-slate-100">
                Build your hiring workflow <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>

            <article className="card p-7 lg:col-span-2 sm:p-10">
              <span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary">
                <GraduationCap size={24} aria-hidden="true" />
              </span>
              <p className="mt-14 font-mono text-xs uppercase tracking-widest text-muted">For students</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight">Let your work speak first.</h2>
              <p className="mt-4 leading-7 text-muted">Build a credible first track record through focused tasks that fit around university life.</p>
              <Link href="/signup?role=student" className="btn btn-secondary mt-8">Create a student account</Link>
            </article>
          </div>
        </section>

        <section className="border-y border-border bg-primary-soft py-14">
          <div className="page-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-kicker">Ready to prove it?</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Start with the work you can do today.</h2>
            </div>
            <Link href="/signup" className="btn btn-primary btn-large shrink-0">Create your account <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>

      <footer className="bg-surface py-10">
        <div className="page-shell flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark compact />
          <p className="text-sm text-muted">Built for StacStart · Future of Work / Access to Jobs</p>
        </div>
      </footer>
    </div>
  );
}
