"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, GraduationCap, LoaderCircle } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { BrandMark } from "../components/brand-mark";
import { useDemoStore } from "../lib/demo-store";

type Role = "student" | "employer";
type Errors = Partial<Record<"name" | "email" | "password" | "university" | "course" | "company" | "form", string>>;

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useDemoStore();
  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      password: String(data.get("password") || ""),
      university: String(data.get("university") || "").trim(),
      course: String(data.get("course") || "").trim(),
      company: String(data.get("company") || "").trim(),
    };

    const nextErrors: Errors = {};
    if (values.name.length < 2) nextErrors.name = "Enter your full name.";
    if (!values.email.includes("@")) nextErrors.email = "Enter a valid email address.";
    if (values.password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (role === "student" && !values.university) nextErrors.university = "Enter your university.";
    if (role === "student" && !values.course) nextErrors.course = "Enter your course of study.";
    if (role === "employer" && !values.company) nextErrors.company = "Enter your company name.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstInvalid = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      firstInvalid?.focus();
      return;
    }

    setSubmitting(true);
    try {
        await signup({
          name: values.name,
          email: values.email,
          password: values.password,
          role,
          university: values.university,
          course: values.course,
          company: values.company,
        });
        router.push(role === "student" ? "/student?welcome=1" : "/employer?welcome=1");
    } catch {
      setErrors({ form: "We could not create that Firebase account. The email may already be in use, or the connection may have failed." });
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="page-shell flex min-h-18 items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-2"><Link href="/login" className="text-sm font-semibold text-secondary hover:text-primary focus-ring rounded-lg px-3 py-2">Sign in</Link><Link href="/student" className="text-sm font-semibold text-secondary hover:text-primary focus-ring rounded-lg px-3 py-2">Explore demo</Link></div>
        </div>
      </header>

      <main id="main-content" className="page-shell grid gap-10 py-12 lg:grid-cols-5 lg:py-16">
        <section className="lg:col-span-2 lg:pt-10">
          <p className="section-kicker">Create your account</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Start with what you can do.</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-muted">
            Join as a student looking for a first opportunity, or as an employer ready to hire through evidence of skill.
          </p>

          <div className="mt-10 hidden border-l-2 border-primary pl-5 lg:block">
            <p className="font-bold">Hackathon demo note</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Your account is secured by Firebase Authentication. No payment information is required.
            </p>
          </div>
        </section>

        <section className="card card-raised p-5 sm:p-8 lg:col-span-3">
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend className="text-sm font-semibold text-secondary">I’m joining as</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className={`choice-card ${role === "student" ? "choice-card-active" : ""}`}>
                  <input
                    className="mt-1 size-4 accent-primary"
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={() => setRole("student")}
                  />
                  <span>
                    <GraduationCap size={22} className="text-primary" aria-hidden="true" />
                    <span className="mt-3 block font-bold">Student</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">Find paid work and prove your skills.</span>
                  </span>
                </label>
                <label className={`choice-card ${role === "employer" ? "choice-card-active" : ""}`}>
                  <input
                    className="mt-1 size-4 accent-primary"
                    type="radio"
                    name="role"
                    value="employer"
                    checked={role === "employer"}
                    onChange={() => setRole("employer")}
                  />
                  <span>
                    <Building2 size={22} className="text-primary" aria-hidden="true" />
                    <span className="mt-3 block font-bold">Employer</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">Hire emerging talent through real work.</span>
                  </span>
                </label>
              </div>
            </fieldset>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="field sm:col-span-2">
                <label htmlFor="name">Full name <span aria-hidden="true">*</span></label>
                <input
                  id="name"
                  name="name"
                  className="input"
                  autoComplete="name"
                  placeholder="Amina Yusuf"
                  aria-invalid={errors.name ? "true" : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name ? <p id="name-error" className="field-error">{errors.name}</p> : null}
              </div>

              <div className="field">
                <label htmlFor="email">Email address <span aria-hidden="true">*</span></label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder={role === "student" ? "you@university.edu" : "you@company.com"}
                  aria-invalid={errors.email ? "true" : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email ? <p id="email-error" className="field-error">{errors.email}</p> : null}
              </div>

              <div className="field">
                <label htmlFor="password">Password <span aria-hidden="true">*</span></label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="input pr-12"
                    autoComplete="new-password"
                    spellCheck={false}
                    placeholder="At least 8 characters"
                    aria-invalid={errors.password ? "true" : undefined}
                    aria-describedby={errors.password ? "password-error" : "password-hint"}
                  />
                  <button
                    type="button"
                    className="focus-ring absolute right-1 top-1 grid size-10 place-items-center rounded-md text-muted hover:bg-muted-surface hover:text-foreground"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>
                {errors.password ? <p id="password-error" className="field-error">{errors.password}</p> : <p id="password-hint" className="field-hint">Use 8 or more characters.</p>}
              </div>

              {role === "student" ? (
                <>
                  <div className="field">
                    <label htmlFor="university">University <span aria-hidden="true">*</span></label>
                    <input
                      id="university"
                      name="university"
                      className="input"
                      autoComplete="organization"
                      placeholder="University of Lagos"
                      aria-invalid={errors.university ? "true" : undefined}
                      aria-describedby={errors.university ? "university-error" : undefined}
                    />
                    {errors.university ? <p id="university-error" className="field-error">{errors.university}</p> : null}
                  </div>
                  <div className="field">
                    <label htmlFor="course">Course of study <span aria-hidden="true">*</span></label>
                    <input
                      id="course"
                      name="course"
                      className="input"
                      autoComplete="off"
                      placeholder="Computer Science"
                      aria-invalid={errors.course ? "true" : undefined}
                      aria-describedby={errors.course ? "course-error" : undefined}
                    />
                    {errors.course ? <p id="course-error" className="field-error">{errors.course}</p> : null}
                  </div>
                </>
              ) : (
                <div className="field sm:col-span-2">
                  <label htmlFor="company">Company name <span aria-hidden="true">*</span></label>
                  <input
                    id="company"
                    name="company"
                    className="input"
                    autoComplete="organization"
                    placeholder="Nuru Labs"
                    aria-invalid={errors.company ? "true" : undefined}
                    aria-describedby={errors.company ? "company-error" : undefined}
                  />
                  {errors.company ? <p id="company-error" className="field-error">{errors.company}</p> : null}
                </div>
              )}
            </div>

            <button className="btn btn-primary btn-large mt-7 w-full" type="submit" disabled={submitting} aria-busy={submitting}>
              {submitting ? <LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> : null}
              {submitting ? "Creating account…" : `Create ${role} account`}
            </button>
            {errors.form ? <p role="alert" className="field-error mt-3 text-center">{errors.form}</p> : null}
            <p className="mt-4 text-center text-xs leading-5 text-muted">By continuing, you agree to use this prototype with demo data only.</p>
          </form>
        </section>
      </main>
    </div>
  );
}
