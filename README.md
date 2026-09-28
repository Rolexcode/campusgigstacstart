# CampusGig — StacStart Edition

A focused hackathon prototype showing how verified university students can earn their first opportunity through practical Proof Tasks instead of years of experience.

## StacStart track fit

**Primary:** Future of Work — a lightweight hiring workflow for remote, skills-first opportunities.

**Supporting story:** Access & Inclusion — verified students get a fair route into paid work through evidence, not an existing network or years of experience.

The collaboration feature is a shared applicant review room: teammates can leave a recommendation and handoff note against the same Proof Task evidence.

## Demo flow

1. Create a student or employer account.
2. Submit a lightweight student verification request.
3. Approve it from the admin demo queue using PIN `2026`.
4. Create a gig with a Proof Task as the employer.
5. Submit proof as the student.
6. Compare applicants and shortlist a student as the employer.
7. Save a team recommendation so another reviewer can pick up the decision.

The prototype stores demo state in the browser so the complete flow survives refreshes without requiring external infrastructure.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Firebase

The app is linked to the Firebase project `campusgig-stacstart` through `.firebaserc`. Copy `.env.example` to `.env.local` for the web SDK configuration. Email/Password Auth and Firestore are enabled; Firestore rules live in `firestore.rules`.

## Production check

```bash
npm run lint
npm run build
```
