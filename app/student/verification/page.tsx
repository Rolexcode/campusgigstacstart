"use client";

import Link from "next/link";
import { BadgeCheck, Clock3, GraduationCap, LoaderCircle, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AppShell } from "../../components/app-shell";
import { useDemoStore } from "../../lib/demo-store";

type Errors = Partial<Record<"university" | "schoolEmail" | "matricNumber" | "form", string>>;

export default function StudentVerificationPage() {
  const { currentUser, submitVerification } = useDemoStore();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      university: String(data.get("university") || "").trim(),
      schoolEmail: String(data.get("schoolEmail") || "").trim(),
      matricNumber: String(data.get("matricNumber") || "").trim(),
      note: String(data.get("note") || "").trim(),
    };
    const nextErrors: Errors = {};
    if (!values.university) nextErrors.university = "Enter your university.";
    if (!values.schoolEmail.includes("@")) nextErrors.schoolEmail = "Enter a valid school email.";
    if (!values.matricNumber) nextErrors.matricNumber = "Enter your student or matric number.";
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      window.requestAnimationFrame(() => document.getElementById(firstError)?.focus());
      return;
    }
    setSubmitting(true);
    try {
      await submitVerification(values);
      setSubmitting(false);
    } catch {
      setErrors({ form: "We could not save your verification request. Check your connection and try again." });
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="page-shell py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <Link href="/student" className="text-sm font-semibold text-primary hover:underline focus-ring rounded">← Back to opportunities</Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-5">
            <section className="lg:col-span-2">
              <p className="section-kicker">Student verification</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Build trust before the first conversation.</h1>
              <p className="mt-4 leading-7 text-muted">A verified badge confirms that the applicant is currently connected to a university. It does not score their ability—the Proof Task does that.</p>
              <div className="mt-8 border-l-2 border-primary pl-5">
                <p className="font-bold">A focused trust check</p>
                <p className="mt-2 text-sm leading-6 text-muted">No document upload is required. The admin reviews only the school details submitted here.</p>
              </div>
            </section>

            <section className="card card-raised p-5 sm:p-8 lg:col-span-3">
              {currentUser?.verificationStatus === "verified" ? (
                <div className="grid place-items-center py-10 text-center">
                  <span className="grid size-16 place-items-center rounded-2xl bg-primary-soft text-primary"><BadgeCheck size={32} aria-hidden="true" /></span>
                  <h2 className="mt-5 text-2xl font-bold">You’re a verified student</h2>
                  <p className="mt-3 max-w-md leading-7 text-muted">Employers can see your verified status beside every application and Proof Task submission.</p>
                  <Link href="/student" className="btn btn-primary mt-6">Browse opportunities</Link>
                </div>
              ) : currentUser?.verificationStatus === "pending" ? (
                <div className="grid place-items-center py-10 text-center">
                  <span className="grid size-16 place-items-center rounded-2xl bg-warning-soft text-warning"><Clock3 size={30} aria-hidden="true" /></span>
                  <h2 className="mt-5 text-2xl font-bold">Verification is ready for review</h2>
                  <p className="mt-3 max-w-md leading-7 text-muted">Our verification team will review the details and update your badge when it is approved.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="flex items-start gap-3 border-b border-border pb-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><GraduationCap size={22} aria-hidden="true" /></span>
                    <div>
                      <h2 className="text-xl font-bold">University details</h2>
                      <p className="mt-1 text-sm leading-6 text-muted">Our verification team uses these details to confirm your current student status.</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5">
                    <div className="field">
                      <label htmlFor="university">University <span aria-hidden="true">*</span></label>
                      <input
                        id="university"
                        name="university"
                        className="input"
                        autoComplete="organization"
                        defaultValue={currentUser?.university}
                        placeholder="University of Lagos"
                        aria-invalid={errors.university ? "true" : undefined}
                        aria-describedby={errors.university ? "university-error" : undefined}
                      />
                      {errors.university ? <p id="university-error" className="field-error">{errors.university}</p> : null}
                    </div>

                    <div className="field">
                      <label htmlFor="schoolEmail">School email <span aria-hidden="true">*</span></label>
                      <input
                        id="schoolEmail"
                        name="schoolEmail"
                        type="email"
                        className="input"
                        autoComplete="email"
                        spellCheck={false}
                        defaultValue={currentUser?.email}
                        placeholder="you@university.edu"
                        aria-invalid={errors.schoolEmail ? "true" : undefined}
                        aria-describedby={errors.schoolEmail ? "schoolEmail-error" : "schoolEmail-hint"}
                      />
                      {errors.schoolEmail ? <p id="schoolEmail-error" className="field-error">{errors.schoolEmail}</p> : <p id="schoolEmail-hint" className="field-hint">Use the email issued by your institution.</p>}
                    </div>

                    <div className="field">
                      <label htmlFor="matricNumber">Student or matric number <span aria-hidden="true">*</span></label>
                      <input
                        id="matricNumber"
                        name="matricNumber"
                        className="input"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="2023/182044"
                        aria-invalid={errors.matricNumber ? "true" : undefined}
                        aria-describedby={errors.matricNumber ? "matricNumber-error" : undefined}
                      />
                      {errors.matricNumber ? <p id="matricNumber-error" className="field-error">{errors.matricNumber}</p> : null}
                    </div>

                    <div className="field">
                      <label htmlFor="note">Short note <span className="font-normal text-muted">(optional)</span></label>
                      <textarea id="note" name="note" className="input" placeholder="Share your current year and what you’re learning or building." />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-large mt-7 w-full" disabled={submitting} aria-busy={submitting}>
                    {submitting ? <LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> : <ShieldCheck size={18} aria-hidden="true" />}
                    {submitting ? "Submitting for review…" : "Submit verification"}
                  </button>
                  {errors.form ? <p role="alert" className="field-error mt-3 text-center">{errors.form}</p> : null}
                </form>
              )}
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
