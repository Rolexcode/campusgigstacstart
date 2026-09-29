"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";
import { BrandMark } from "../components/brand-mark";
import { useDemoStore } from "../lib/demo-store";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useDemoStore();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError("");
    setSubmitting(true);
    try {
      const role = await login(String(data.get("email") || ""), String(data.get("password") || ""));
      if (!role) throw new Error("Firebase is not configured for this environment.");
      const next = searchParams.get("next");
      const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : role === "employer" ? "/employer" : "/student";
      router.push(destination);
    } catch {
      setError("That email and password combination could not be signed in. Check the details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="page-shell flex min-h-18 items-center justify-between">
          <BrandMark />
          <Link href="/signup" className="text-sm font-semibold text-secondary hover:text-primary focus-ring rounded-lg px-3 py-2">Create account</Link>
        </div>
      </header>
      <main id="main-content" className="page-shell grid max-w-5xl gap-10 py-16 lg:grid-cols-2 lg:items-center">
        <section>
          <p className="section-kicker">Welcome back</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Pick up where your proof left off.</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-muted">Sign in to your CampusGig account and keep your profile, applications, and team review history synced through Firebase.</p>
        </section>
        <section className="card card-raised p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary"><LockKeyhole size={19} aria-hidden="true" /></span>
            <div><p className="font-bold">Sign in</p><p className="text-sm text-muted">CampusGig StacStart account</p></div>
          </div>
          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div className="field"><label htmlFor="login-email">Email address</label><input id="login-email" name="email" className="input" type="email" autoComplete="email" required /></div>
            <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" name="password" className="input" type="password" autoComplete="current-password" required /></div>
            {error ? <p role="alert" className="field-error">{error}</p> : null}
            <button className="btn btn-primary btn-large w-full" type="submit" disabled={submitting} aria-busy={submitting}>{submitting ? <LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> : null}{submitting ? "Signing in…" : "Sign in"}</button>
          </form>
        </section>
      </main>
    </div>
  );
}
