# CampusGig

### Proof-first access to the first job

CampusGig is a skills-first hiring workflow for university students across Africa. Students do not need an existing network, years of experience, or an inflated CV to make a credible start: they verify their student status, complete a small job-relevant Proof Task, and let the work lead the conversation.

## Why this belongs in Future of Work

CampusGig addresses the gap between “I can do the work” and “I have enough experience to get hired.” Employers publish remote-friendly gigs with a fair, time-boxed task; students submit the work and context; hiring teams compare evidence and leave a shared recommendation before shortlisting.

The primary StacStart track is **Future of Work**, with **Access & Inclusion** as the supporting impact story. See the [official track definitions](https://stacstart.com/hackathon#tracks).

## Judge walkthrough

1. Create one account and open the student workspace.
2. Complete verification, then browse the seeded opportunity and open its Proof Task.
3. Submit the proof, then switch to the employer workspace in the same account.
4. Open the submission, leave a team recommendation, and shortlist the strongest proof.
5. Open the admin queue with PIN `2026` to see the lightweight verification step.
6. To test persistence, sign out and sign back in from another browser or device. The profile and records are stored in Firebase, not only in the browser.

## What makes the demo different

- **Proof Tasks:** one small, real slice of work replaces an experience wall.
- **Verification:** a visible student-status signal separates identity trust from skill assessment.
- **Team review:** “Strong yes”, “Follow up”, or “Pass” plus one handoff note keeps hiring decisions moving across a distributed team.
- **Universal accounts:** one account can post work or apply as a verified student; sign-up does not force a permanent role.
- **African context:** remote-friendly opportunities, Nigerian naira examples, and university-first verification.

## Backend architecture

- **Firebase Authentication:** email/password accounts with persistent Firebase sessions.
- **Cloud Firestore:** profiles, gigs, applications, verification requests, and team reviews.
- **Security rules:** authenticated reads; user-scoped profile/application creation; protected writes for review records.
- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS, and Lucide icons.
- **Project:** `campusgig-stacstart` (linked in `.firebaserc`).

The web SDK configuration is supplied through environment variables. The local `.env.local` file is ignored by Git; `.env.example` documents the required public Firebase settings.

## Submission details

- **Primary track:** Future of Work
- **Secondary story:** Access & Inclusion
- **Repository:** [github.com/Rolexcode/campusgigstacstart](https://github.com/Rolexcode/campusgigstacstart)
- **Product:** CampusGig StacStart
- **Audience:** African university students and small teams hiring emerging talent

## Engineering checks

```bash
npm run lint
npm run build
```

Both checks pass on the submitted build.
