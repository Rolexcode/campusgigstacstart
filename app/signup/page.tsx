"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { BrandMark } from "../components/brand-mark";
import { useDemoStore } from "../lib/demo-store";

type Errors = Partial<Record<"name" | "email" | "password" | "form", string>>;

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useDemoStore();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      password: String(data.get("password") || ""),
    };

    const nextErrors: Errors = {};
    if (values.name.length < 2) nextErrors.name = "Enter your full name.";
    if (!values.email.includes("@")) nextErrors.email = "Enter a valid email address.";
    if (values.password.length < 8) nextErrors.password = "Use at least 8 characters.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstInvalid = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      firstInvalid?.focus();
      return;
    }

    setSubmitting(true);
    try {
        const result = await signup({
          name: values.name,
          email: values.email,
          password: values.password,
        });
        if (result.emailVerificationSent) {
          setEmailVerificationSent(true);
          setSubmitting(false);
        } else {
          router.push("/student?welcome=1");
        }
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
          <div className="flex items-center gap-2"><Link href="/" className="text-sm font-semibold text-secondary hover:text-primary focus-ring rounded-lg px-3 py-2">Back to home</Link><Link href="/login" className="text-sm font-semibold text-secondary hover:text-primary focus-ring rounded-lg px-3 py-2">Sign in</Link></div>
        </div>
      </header>

      <main id="main-content" className="page-shell grid gap-10 py-12 lg:grid-cols-5 lg:py-16">
        <section className="lg:col-span-2 lg:pt-10">
          <p className="section-kicker">Create your account</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Start with what you can do.</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-muted">
            Create one CampusGig account. Browse opportunities, post work, and switch between student and client workflows whenever you need to.
          </p>

          <div className="mt-10 hidden border-l-2 border-primary pl-5 lg:block">
            <p className="font-bold">Built for real work</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Your account is secured by Firebase Authentication, and your profile stays available wherever you sign in.
            </p>
          </div>
        </section>

        <section className="card card-raised p-5 sm:p-8 lg:col-span-3">
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
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
                  placeholder="you@example.com"
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

            </div>

            <button className="btn btn-primary btn-large mt-7 w-full" type="submit" disabled={submitting} aria-busy={submitting}>
              {submitting ? <LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> : null}
              {submitting ? "Creating account…" : "Create account"}
            </button>
            {emailVerificationSent ? <div className="success-banner mt-5"><div><p className="font-bold text-foreground">Check your personal email</p><p className="mt-1 leading-6">Firebase sent a verification link. Confirm it, then continue to your workspace.</p><button type="button" className="btn btn-secondary mt-4" onClick={() => router.push("/student?welcome=1")}>Continue to workspace</button></div></div> : null}
            {errors.form ? <p role="alert" className="field-error mt-3 text-center">{errors.form}</p> : null}
            <p className="mt-4 text-center text-xs leading-5 text-muted">By creating an account, you agree to keep your profile and submissions accurate.</p>
          </form>
        </section>
      </main>
    </div>
  );
}
