"use client";

import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, CheckSquare2, LoaderCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AppShell } from "../../../components/app-shell";
import { useDemoStore } from "../../../lib/demo-store";
import { slugifyGigTitle } from "../../../lib/gig-routing";

type Errors = Partial<Record<"title" | "description" | "budget" | "taskTitle" | "instructions" | "deliverable" | "form", string>>;

export default function NewGigPage() {
  const router = useRouter();
  const { currentUser, createGig } = useDemoStore();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      title: String(data.get("title") || "").trim(),
      description: String(data.get("description") || "").trim(),
      category: String(data.get("category") || "Frontend development"),
      budget: String(data.get("budget") || "").trim(),
      location: "Remote · Africa",
      proofTask: {
        title: String(data.get("taskTitle") || "").trim(),
        instructions: String(data.get("instructions") || "").trim(),
        deliverable: String(data.get("deliverable") || "").trim(),
        timeEstimate: String(data.get("timeEstimate") || "45–60 minutes"),
      },
    };
    const nextErrors: Errors = {};
    if (values.title.length < 6) nextErrors.title = "Give the role a clear, specific title.";
    if (values.description.length < 30) nextErrors.description = "Add a short description of the work (30+ characters).";
    if (!values.budget) nextErrors.budget = "Add the compensation so students can make an informed choice.";
    if (values.proofTask.title.length < 6) nextErrors.taskTitle = "Name the practical task.";
    if (values.proofTask.instructions.length < 40) nextErrors.instructions = "Give students enough direction to complete the task.";
    if (values.proofTask.deliverable.length < 8) nextErrors.deliverable = "Describe what they should submit.";
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      window.requestAnimationFrame(() => document.getElementById(firstError)?.focus());
      return;
    }
    setSubmitting(true);
    try {
      const id = await createGig(values);
      router.push(`/employer/gigs/${slugifyGigTitle(values.title) || id}/applicants?created=1`);
    } catch {
      setErrors({ form: "We could not publish this gig. Check your connection and try again." });
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="page-shell py-8 sm:py-12">
        <Link href="/employer" className="focus-ring rounded text-sm font-semibold text-primary hover:underline"><ArrowLeft size={15} className="mr-1 inline" aria-hidden="true" />Back to employer workspace</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-5">
          <section className="lg:col-span-2">
            <p className="section-kicker">Post a gig</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Make the opportunity concrete.</h1>
            <p className="mt-4 leading-7 text-muted">A good Proof Task is small, job-relevant, and clear enough that a student can make a thoughtful attempt in under an hour.</p>
            <div className="proof-panel mt-8">
              <span className="relative z-10 grid size-11 place-items-center rounded-xl bg-emerald-300 text-ink"><Sparkles size={21} aria-hidden="true" /></span>
              <h2 className="relative z-10 mt-6 text-xl font-bold">Task writing prompt</h2>
              <p className="relative z-10 mt-3 text-sm leading-6 text-slate-300">Ask for the smallest realistic slice of the work. You’re testing how someone thinks, not whether they can work for free.</p>
            </div>
          </section>

          <section className="card card-raised p-5 sm:p-8 lg:col-span-3">
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex items-start gap-3 border-b border-border pb-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><BriefcaseBusiness size={22} aria-hidden="true" /></span>
                <div>
                  <p className="section-kicker">Gig details</p>
                  <h2 className="mt-1 text-xl font-bold">Tell students what they’ll build.</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="field sm:col-span-2">
                  <label htmlFor="title">Gig title <span aria-hidden="true">*</span></label>
                  <input id="title" name="title" className="input" placeholder="Junior Frontend Developer" aria-invalid={errors.title ? "true" : undefined} aria-describedby={errors.title ? "title-error" : undefined} />
                  {errors.title ? <p id="title-error" className="field-error">{errors.title}</p> : null}
                </div>
                <div className="field sm:col-span-2">
                  <label htmlFor="description">Short description <span aria-hidden="true">*</span></label>
                  <textarea id="description" name="description" className="input" placeholder="What will this person help your team ship?" aria-invalid={errors.description ? "true" : undefined} aria-describedby={errors.description ? "description-error" : undefined} />
                  {errors.description ? <p id="description-error" className="field-error">{errors.description}</p> : null}
                </div>
                <div className="field">
                  <label htmlFor="category">Category <span aria-hidden="true">*</span></label>
                  <select id="category" name="category" className="input" defaultValue="Frontend development">
                    <option>Frontend development</option>
                    <option>Product design</option>
                    <option>Content &amp; research</option>
                    <option>Data &amp; operations</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="budget">Compensation <span aria-hidden="true">*</span></label>
                  <input id="budget" name="budget" className="input" placeholder="₦120,000 / month" aria-invalid={errors.budget ? "true" : undefined} aria-describedby={errors.budget ? "budget-error" : undefined} />
                  {errors.budget ? <p id="budget-error" className="field-error">{errors.budget}</p> : null}
                </div>
              </div>

              <div className="mt-10 flex items-start gap-3 border-y border-border py-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><CheckSquare2 size={22} aria-hidden="true" /></span>
                <div>
                  <p className="section-kicker">Proof Task</p>
                  <h2 className="mt-1 text-xl font-bold">Give students a fair way to show their ability.</h2>
                </div>
              </div>

              <div className="mt-6 grid gap-5">
                <div className="field">
                  <label htmlFor="taskTitle">Task title <span aria-hidden="true">*</span></label>
                  <input id="taskTitle" name="taskTitle" className="input" placeholder="Rebuild a responsive pricing card" aria-invalid={errors.taskTitle ? "true" : undefined} aria-describedby={errors.taskTitle ? "taskTitle-error" : undefined} />
                  {errors.taskTitle ? <p id="taskTitle-error" className="field-error">{errors.taskTitle}</p> : null}
                </div>
                <div className="field">
                  <label htmlFor="instructions">Instructions <span aria-hidden="true">*</span></label>
                  <textarea id="instructions" name="instructions" className="input" placeholder="Describe the reference, constraints, and what a good attempt should demonstrate." aria-invalid={errors.instructions ? "true" : undefined} aria-describedby={errors.instructions ? "instructions-error" : undefined} />
                  {errors.instructions ? <p id="instructions-error" className="field-error">{errors.instructions}</p> : null}
                </div>
                <div className="field sm:grid-cols-2 sm:grid">
                  <div>
                    <label htmlFor="deliverable">Expected deliverable <span aria-hidden="true">*</span></label>
                    <input id="deliverable" name="deliverable" className="input mt-1.5" placeholder="GitHub repo and live preview" aria-invalid={errors.deliverable ? "true" : undefined} aria-describedby={errors.deliverable ? "deliverable-error" : undefined} />
                    {errors.deliverable ? <p id="deliverable-error" className="field-error">{errors.deliverable}</p> : null}
                  </div>
                  <div>
                    <label htmlFor="timeEstimate">Suggested time</label>
                    <select id="timeEstimate" name="timeEstimate" className="input mt-1.5" defaultValue="45–60 minutes">
                      <option>20 minutes</option>
                      <option>45–60 minutes</option>
                      <option>90 minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link href="/employer" className="btn btn-secondary">Cancel</Link>
                <button type="submit" className="btn btn-primary" disabled={submitting} aria-busy={submitting}>
                  {submitting ? <LoaderCircle className="animate-spin" size={17} aria-hidden="true" /> : null}
                  {submitting ? "Publishing gig…" : `Publish from ${currentUser?.name || "your account"}`}
                </button>
                {errors.form ? <p role="alert" className="field-error mt-3 text-right">{errors.form}</p> : null}
              </div>
            </form>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
