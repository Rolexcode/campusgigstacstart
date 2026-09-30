"use client";

import Link from "next/link";
import { BadgeCheck, ExternalLink, GraduationCap, LoaderCircle, Save, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AppShell } from "../components/app-shell";
import { useDemoStore } from "../lib/demo-store";

type Errors = Partial<Record<"university" | "schoolEmail" | "matricNumber" | "idCardUrl" | "form", string>>;

export default function ProfilePage() {
  const { currentUser, updateProfile } = useDemoStore();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const intent = String(data.get("intent") || "save");
    const values = {
      university: String(data.get("university") || "").trim(),
      course: String(data.get("course") || "").trim(),
      schoolEmail: String(data.get("schoolEmail") || "").trim(),
      matricNumber: String(data.get("matricNumber") || "").trim(),
      idCardUrl: currentUser?.idCardUrl || "",
      idCardFile: (() => {
        const value = data.get("idCard");
        return value instanceof File && value.size > 0 ? value : undefined;
      })(),
      portfolioUrl: String(data.get("portfolioUrl") || "").trim(),
      skills: String(data.get("skills") || "").split(",").map((skill) => skill.trim()).filter(Boolean),
    };
    const nextErrors: Errors = {};
    if (intent === "verify") {
      if (!values.university) nextErrors.university = "Add your university before requesting verification.";
      if (!values.schoolEmail.includes("@")) nextErrors.schoolEmail = "Add a valid school email before requesting verification.";
      if (!values.matricNumber) nextErrors.matricNumber = "Add your matric number before requesting verification.";
      if (!values.idCardUrl && !values.idCardFile) nextErrors.idCardUrl = "Upload your student ID card before requesting verification.";
    }
    if (values.idCardFile && values.idCardFile.size > 10 * 1024 * 1024) nextErrors.idCardUrl = "Keep the ID card file under 10 MB.";
    if (values.idCardFile && !["image/jpeg", "image/png", "image/webp"].includes(values.idCardFile.type)) nextErrors.idCardUrl = "Upload a JPG, PNG, or WebP image of your ID card.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setSavedMessage("");
    try {
      await updateProfile({ ...values, requestVerification: intent === "verify" });
      setSavedMessage(intent === "verify" ? "Profile saved and sent to the verification queue." : "Profile saved.");
    } catch {
      setErrors({ form: "We could not save your profile. Check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="page-shell py-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">Your profile</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Make your CampusGig profile useful.</h1>
              <p className="mt-3 max-w-2xl text-muted">Keep your skills and work links current. If you are a student, add your school details and ID link here for verification.</p>
            </div>
            {currentUser?.verificationStatus === "verified" ? (
              <span className="status-pill status-pill-success"><BadgeCheck size={15} aria-hidden="true" />Verified student</span>
            ) : currentUser?.verificationStatus === "pending" ? (
              <span className="status-pill status-pill-pending"><ShieldCheck size={15} aria-hidden="true" />Verification pending</span>
            ) : null}
          </div>

          <form className="mt-8 grid gap-6 lg:grid-cols-5" onSubmit={handleSubmit} noValidate encType="multipart/form-data">
            <section className="card card-raised p-5 sm:p-7 lg:col-span-3">
              <div className="flex items-start gap-3 border-b border-border pb-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><GraduationCap size={22} aria-hidden="true" /></span>
                <div>
                  <p className="section-kicker">Profile details</p>
                  <h2 className="mt-1 text-xl font-bold">What you bring to the work</h2>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="field sm:col-span-2">
                  <label htmlFor="skills">Skills</label>
                  <input id="skills" name="skills" className="input" defaultValue={currentUser?.skills.join(", ")} placeholder="React, research, copywriting" />
                  <p className="field-hint">Separate skills with commas.</p>
                </div>
                <div className="field sm:col-span-2">
                  <label htmlFor="portfolioUrl">Portfolio, GitHub, or work link</label>
                  <input id="portfolioUrl" name="portfolioUrl" type="url" className="input" defaultValue={currentUser?.portfolioUrl} placeholder="https://github.com/you" />
                </div>
                <div className="field">
                  <label htmlFor="university">University</label>
                  <input id="university" name="university" className="input" defaultValue={currentUser?.university} placeholder="University of Lagos" aria-invalid={errors.university ? "true" : undefined} />
                  {errors.university ? <p className="field-error">{errors.university}</p> : null}
                </div>
                <div className="field">
                  <label htmlFor="course">Course of study</label>
                  <input id="course" name="course" className="input" defaultValue={currentUser?.course} placeholder="Computer Science" />
                </div>
              </div>
            </section>

            <aside className="card p-5 sm:p-7 lg:col-span-2">
              <p className="section-kicker">Student verification</p>
              <h2 className="mt-2 text-xl font-bold">Show that you are a current student</h2>
              <p className="mt-3 text-sm leading-6 text-muted">These details are sent to the admin queue. Your ID link should point to a secure view of your student card.</p>

              <div className="mt-6 grid gap-5">
                <div className="field">
                  <label htmlFor="schoolEmail">School email</label>
                  <input id="schoolEmail" name="schoolEmail" type="email" className="input" defaultValue={currentUser?.schoolEmail || currentUser?.email} placeholder="you@university.edu" aria-invalid={errors.schoolEmail ? "true" : undefined} />
                  {errors.schoolEmail ? <p className="field-error">{errors.schoolEmail}</p> : null}
                </div>
                <div className="field">
                  <label htmlFor="matricNumber">Matric number</label>
                  <input id="matricNumber" name="matricNumber" className="input" defaultValue={currentUser?.matricNumber} placeholder="2023/182044" aria-invalid={errors.matricNumber ? "true" : undefined} />
                  {errors.matricNumber ? <p className="field-error">{errors.matricNumber}</p> : null}
                </div>
                <div className="field">
                  <label htmlFor="idCard">Student ID card upload</label>
                  <input id="idCard" name="idCard" type="file" accept="image/jpeg,image/png,image/webp" className="input" aria-invalid={errors.idCardUrl ? "true" : undefined} />
                  <p className="field-hint">JPG, PNG, or PDF up to 5 MB. Admins will review it with your student details.</p>
                  {currentUser?.idCardUrl ? <a className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline" href={currentUser.idCardUrl} target="_blank" rel="noreferrer">Open uploaded ID card <ExternalLink size={14} aria-hidden="true" /></a> : null}
                  {errors.idCardUrl ? <p className="field-error">{errors.idCardUrl}</p> : null}
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <button name="intent" value="save" type="submit" className="btn btn-secondary w-full" disabled={submitting}>
                  {submitting ? <LoaderCircle className="animate-spin" size={17} aria-hidden="true" /> : <Save size={17} aria-hidden="true" />}
                  {submitting ? "Saving…" : "Save profile"}
                </button>
                {currentUser?.verificationStatus !== "verified" ? (
                  <button name="intent" value="verify" type="submit" className="btn btn-primary mt-3 w-full" disabled={submitting}>
                    <ShieldCheck size={17} aria-hidden="true" />Request student verification
                  </button>
                ) : null}
                {savedMessage ? <p role="status" className="mt-3 text-center text-sm font-semibold text-primary">{savedMessage}</p> : null}
                {errors.form ? <p role="alert" className="field-error mt-3 text-center">{errors.form}</p> : null}
              </div>
            </aside>
          </form>

          {currentUser?.portfolioUrl ? <p className="mt-6 text-sm text-muted">Current work link: <a className="font-semibold text-primary hover:underline" href={currentUser.portfolioUrl} target="_blank" rel="noreferrer">Open profile link <ExternalLink size={14} className="inline" aria-hidden="true" /></a></p> : null}
          <Link href="/student" className="mt-8 inline-flex text-sm font-semibold text-primary hover:underline">← Back to opportunities</Link>
        </div>
      </div>
    </AppShell>
  );
}
