"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  Plus,
  RotateCcw,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { BrandMark } from "./brand-mark";
import { useDemoStore, type Persona } from "../lib/demo-store";

const routes = {
  student: [
    { href: "/student", label: "Opportunities", icon: BriefcaseBusiness },
    { href: "/student/verification", label: "Verification", icon: UserRoundCheck },
  ],
  employer: [
    { href: "/employer", label: "Overview", icon: LayoutDashboard },
    { href: "/employer/gigs/new", label: "Post a gig", icon: Plus },
  ],
  admin: [{ href: "/admin", label: "Review queue", icon: ShieldCheck }],
};

const personaMeta = {
  student: { label: "Student", icon: GraduationCap, href: "/student" },
  employer: { label: "Employer", icon: Building2, href: "/employer" },
  admin: { label: "Admin", icon: ShieldCheck, href: "/admin" },
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activePersona, currentUser, setPersona, resetDemo } = useDemoStore();

  const changePersona = (persona: Persona) => {
    setPersona(persona);
    router.push(personaMeta[persona].href);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="app-header">
        <div className="page-shell flex min-h-18 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-6">
            <BrandMark compact />
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Workspace navigation">
              {routes[activePersona].map(({ href, label, icon: Icon }) => {
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
            <div className="persona-switcher" aria-label="Demo persona switcher">
              {(["student", "employer", "admin"] as Persona[]).map((persona) => {
                const Icon = personaMeta[persona].icon;
                return (
                  <button
                    key={persona}
                    type="button"
                    className={`persona-button ${activePersona === persona ? "persona-button-active" : ""}`}
                    onClick={() => changePersona(persona)}
                    aria-pressed={activePersona === persona}
                    title={`View as ${personaMeta[persona].label}`}
                  >
                    <Icon size={15} aria-hidden="true" />
                    <span className="hidden sm:inline">{personaMeta[persona].label}</span>
                  </button>
                );
              })}
            </div>
            <details className="profile-menu">
              <summary className="profile-trigger focus-ring">
                <span className="avatar">{activePersona === "admin" ? "AD" : initials(currentUser?.name)}</span>
                <span className="hidden max-w-36 text-left leading-tight md:block">
                  <span className="block truncate text-sm font-semibold">
                    {activePersona === "admin" ? "Demo admin" : currentUser?.name || "Demo member"}
                  </span>
                  <span className="block text-xs capitalize text-muted">{activePersona} workspace</span>
                </span>
                <ChevronDown size={15} className="hidden text-muted md:block" aria-hidden="true" />
              </summary>
              <div className="profile-popover">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Demo controls</p>
                <button
                  type="button"
                  className="menu-action"
                  onClick={() => {
                    resetDemo();
                    router.push("/");
                  }}
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  Reset demo data
                </button>
              </div>
            </details>
          </div>
        </div>
        <nav className="page-shell flex gap-1 overflow-x-auto pb-2 lg:hidden" aria-label="Mobile workspace navigation">
          {routes[activePersona].map(({ href, label, icon: Icon }) => (
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
