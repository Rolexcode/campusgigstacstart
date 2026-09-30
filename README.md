# CampusGig

**Proof-first hiring for university talent.**

CampusGig helps university students access paid opportunities by letting their work speak before their experience. Employers post remote-friendly roles with small, job-relevant Proof Tasks; verified students respond with real evidence of ability; hiring teams review the work together and shortlist candidates based on what they can do.

**Live product:** https://campusgigstacstart.vercel.app  
**Demo video:** https://youtu.be/kFZN7N3U5uU  
**Primary track:** Future of Work

## The problem

Students often face a cold-start problem: employers want experience, ratings, or an established track record, but students need a first opportunity before they can build any of those things.

CampusGig gives employers a better signal than an empty CV while giving students a fairer route into their first paid work.

## How CampusGig works

1. **Create one account** — CampusGig uses universal accounts, so users are not forced into a permanent student or employer role at signup.
2. **Post an opportunity** — anyone hiring can create a role with clear compensation and attach a small Proof Task that reflects a real slice of the work.
3. **Verify student status** — students add their university information and request verification before applying.
4. **Submit proof of ability** — verified students apply with their response, approach, GitHub repository, live project, or other relevant evidence.
5. **Review collaboratively** — hiring teams compare applicants, inspect submitted work, leave a shared recommendation, and add a handoff note.
6. **Shortlist with evidence** — employers move candidates forward based on demonstrated ability rather than years of prior experience.

## What makes CampusGig different

### Proof Tasks

Every opportunity can include a focused, time-boxed task tied to the actual role. Instead of asking emerging talent to prove years of experience they have not yet had the chance to earn, employers can evaluate a small piece of real work.

### Verified student identity

Student verification separates two questions:

- **Who is this person?** — verified student status provides an identity/trust signal.
- **Can they do the work?** — the Proof Task provides the skill signal.

### Collaborative hiring

Applicant review is designed for distributed teams. Reviewers can leave a recommendation — **Strong Yes**, **Follow Up**, or **Pass** — add a handoff note, inspect the submitted proof, and shortlist the candidate they want to move forward with.

### Universal accounts

CampusGig does not force users into separate permanent employer and student identities. The same account can post work, while verified students can also apply to opportunities.

## Tech stack

- **Next.js + TypeScript**
- **Tailwind CSS**
- **Firebase Authentication**
- **Cloud Firestore**

Firebase Authentication handles user accounts and persistent sessions, while Cloud Firestore stores profiles, opportunities, applications, verification requests, Proof Task submissions, and team reviews.

## Future of Work

CampusGig fits the **Future of Work** track by improving how emerging talent accesses remote work and how teams evaluate early-career candidates.

The product focuses on a simple idea:

> **Evidence before experience.**

Instead of treating a missing track record as proof that a student cannot do the work, CampusGig gives them a structured way to show what they can do.

## Run locally

```bash
npm install
npm run dev
```

Create a `.env.local` file using the Firebase variables documented in `.env.example`.

For a production check:

```bash
npm run lint
npm run build
```

---

Built for the StacStart Hackathon.
