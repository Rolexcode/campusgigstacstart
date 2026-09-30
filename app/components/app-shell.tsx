"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Plus,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { BrandMark } from "./brand-mark";
import { useDemoStore } from "../lib/demo-store";

const memberRoutes = [
  { href: "/student", label: "Find opportunities", icon: BriefcaseBusiness },
  { href: "/employer", label: "My gigs", icon: LayoutDashboard },
  { href: "/employer/gigs/new", label: "Post a gig", icon: Plus },
  { href: "/profile", label: "Profile", icon: UserRoundCheck },
];
const adminRoutes = [{ href: "/admin", label: "Review queue", icon: ShieldCheck }];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, backendConnected, authReady } = useDemoStore();
  const isWorkspaceRoute = pathname.startsWith("/student") || pathname.startsWith("/employer") || pathname.startsWith("/profile");
  const routes = pathname.startsWith("/admin") ? adminRoutes : memberRoutes;

  useEffect(() => {
    if (isWorkspaceRoute && authReady && !backendConnected) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [authReady, backendConnected, isWorkspaceRoute, pathname, router]);

  if (isWorkspaceRoute && !authReady) {
    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-background px-6 py-16 text-center">
        <div>
          <p className="section-kicker">CampusGig</p>
          <p className="mt-3 text-muted">Loading your workspace…</p>
        </div>
      </main>
    );
  }

  if (isWorkspaceRoute && authReady && !backendConnected) {
    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-background px-6 py-16 text-center">
        <div className="max-w-md">
          <p className="section-kicker">Sign in required</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Your workspace is waiting.</h1>
          <p className="mt-3 leading-7 text-muted">Sign in or create an account to access opportunities, applications, and hiring tools.</p>
          <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="btn btn-primary mt-6">Continue to sign in</Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="app-header">
        <div className="page-shell flex min-h-18 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-6">
            <BrandMark compact />
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Workspace navigation">
              {routes.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== "/student" && href !== "/employer" && pathname.startsWith(href));
                return (
                  <Link key={href} href={href} className={`nav-link ${active ? "nav-link-active" : ""}`}>
                    <Icon size={16} aria-hidden="true" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {backendConnected ? <details className="profile-menu">
              <summary className="profile-trigger focus-ring">
                <span className="avatar">{initials(currentUser?.name)}</span>
                <span className="hidden max-w-36 text-left leading-tight md:block">
                  <span className="block truncate text-sm font-semibold">
                    {currentUser?.name || "CampusGig member"}
                  </span>
                  <span className="block text-xs text-muted">CampusGig account</span>
                </span>
                <ChevronDown size={15} className="hidden text-muted md:block" aria-hidden="true" />
              </summary>
              <div className="profile-popover">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Account</p>
                <Link href="/profile" className="menu-action"><UserRoundCheck size={16} aria-hidden="true" />Edit profile</Link>
                <button type="button" className="menu-action" onClick={() => { void logout(); router.push("/"); }}><LogOut size={16} aria-hidden="true" />Sign out</button>
              </div>
            </details> : null}
          </div>
        </div>
        <nav className="page-shell flex gap-1 overflow-x-auto pb-2 lg:hidden" aria-label="Mobile workspace navigation">
          {routes.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`nav-link shrink-0 ${pathname === href ? "nav-link-active" : ""}`}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="main-content">{children}</main>
    </div>
  );
}

function initials(name?: string) {
  if (!name) return "CG";
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
