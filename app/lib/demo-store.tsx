"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loadFirebaseCollection,
  loginFirebaseAccount,
  logoutFirebaseAccount,
  persistFirestoreRecord,
  registerFirebaseAccount,
  subscribeToFirebaseAuth,
  prepareStudentIdImage,
} from "./firebase-actions";
import { firebaseEnabled } from "./firebase";

export type Persona = "student" | "employer" | "admin";
export type VerificationStatus = "not_submitted" | "pending" | "verified" | "rejected";
export type ApplicationStatus = "submitted" | "shortlisted" | "not_selected";

export type User = {
  id: string;
  name: string;
  email: string;
  /** Legacy role values are kept readable for existing records; new accounts are universal members. */
  role: "member" | "student" | "employer";
  university?: string;
  course?: string;
  company?: string;
  skills: string[];
  portfolioUrl?: string;
  idCardUrl?: string;
  matricNumber?: string;
  schoolEmail?: string;
  verificationStatus?: VerificationStatus;
};

export type ProofTask = {
  title: string;
  instructions: string;
  deliverable: string;
  timeEstimate: string;
};

export type Gig = {
  id: string;
  employerId: string;
  company: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  location: string;
  createdAt: string;
  status: "open" | "closed";
  selectedApplicantId?: string;
  selectedApplicantName?: string;
  proofTask: ProofTask;
};

export type Application = {
  id: string;
  gigId: string;
  studentId: string;
  studentName: string;
  university: string;
  skills: string[];
  introduction: string;
  proofResponse: string;
  githubUrl: string;
  previewUrl: string;
  proofComplete: boolean;
  status: ApplicationStatus;
  createdAt: string;
};

export type Review = {
  id: string;
  applicationId: string;
  authorId: string;
  authorName: string;
  decision: "strong_yes" | "follow_up" | "pass";
  note: string;
  updatedAt: string;
};

export type VerificationRequest = {
  id: string;
  userId: string;
  studentName: string;
  university: string;
  schoolEmail: string;
  matricNumber: string;
  idCardUrl?: string;
  portfolioUrl?: string;
  skills?: string[];
  note: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
};

type DemoState = {
  users: User[];
  gigs: Gig[];
  applications: Application[];
  reviews: Review[];
  verifications: VerificationRequest[];
  activePersona: Persona;
  activeUserId: string;
};

type SignupInput = {
  name: string;
  email: string;
  password: string;
};

type GigInput = Omit<Gig, "id" | "employerId" | "company" | "createdAt" | "status">;

type ApplicationInput = Pick<
  Application,
  "introduction" | "proofResponse" | "githubUrl" | "previewUrl"
>;

type VerificationInput = Pick<
  VerificationRequest,
  "university" | "schoolEmail" | "matricNumber" | "note" | "idCardUrl" | "portfolioUrl" | "skills"
>;

type ProfileInput = {
  university: string;
  course: string;
  schoolEmail: string;
  matricNumber: string;
  idCardUrl: string;
  idCardFile?: File;
  portfolioUrl: string;
  skills: string[];
  requestVerification?: boolean;
};

type DemoStore = DemoState & {
  hydrated: boolean;
  authReady: boolean;
  currentUser?: User;
  setPersona: (persona: Persona) => void;
  signup: (input: SignupInput) => Promise<string>;
  updateProfile: (input: ProfileInput) => Promise<void>;
  submitVerification: (input: VerificationInput) => Promise<void>;
  reviewVerification: (requestId: string, decision: "approved" | "rejected") => Promise<void>;
  createGig: (input: GigInput) => Promise<string>;
  submitApplication: (gigId: string, input: ApplicationInput) => Promise<void>;
  shortlistApplication: (applicationId: string) => Promise<void>;
  selectApplicant: (applicationId: string) => Promise<void>;
  saveReview: (applicationId: string, decision: Review["decision"], note: string) => Promise<void>;
  refreshData: () => Promise<void>;
  resetDemo: () => void;
  login: (email: string, password: string) => Promise<"student" | "employer" | "member" | null>;
  logout: () => Promise<void>;
  backendConnected: boolean;
};

const STORAGE_KEY = "campusgig-stacstart:v1";

const initialState: DemoState = {
  activePersona: "student",
  activeUserId: "student-amina",
  users: [
    {
      id: "student-amina",
      name: "Amina Yusuf",
      email: "amina@unilag.edu.ng",
      role: "student",
      university: "University of Lagos",
      course: "Computer Science",
      skills: ["React", "TypeScript", "UI engineering"],
      verificationStatus: "verified",
    },
    {
      id: "student-emmanuel",
      name: "Emmanuel Kalu",
      email: "emmanuel@futminna.edu.ng",
      role: "student",
      university: "Federal University of Technology, Minna",
      course: "Information Technology",
      skills: ["React", "Tailwind CSS", "Accessibility"],
      verificationStatus: "verified",
    },
    {
      id: "student-zara",
      name: "Zara Bello",
      email: "zara@ui.edu.ng",
      role: "student",
      university: "University of Ibadan",
      course: "Computer Science",
      skills: ["JavaScript", "Figma", "CSS"],
      verificationStatus: "verified",
    },
    {
      id: "student-david",
      name: "David Nwosu",
      email: "david@unn.edu.ng",
      role: "student",
      university: "University of Nigeria, Nsukka",
      course: "Electronic Engineering",
      skills: ["Frontend development", "Testing"],
      verificationStatus: "pending",
    },
    {
      id: "employer-nuru",
      name: "Tunde Adebayo",
      email: "tunde@nurulabs.africa",
      role: "employer",
      company: "Nuru Labs",
      skills: [],
    },
  ],
  gigs: [
    {
      id: "gig-frontend",
      employerId: "employer-nuru",
      company: "Nuru Labs",
      title: "Junior Frontend Developer",
      description:
        "Help our product team ship responsive onboarding screens for a fast-growing logistics platform serving small businesses across West Africa.",
      category: "Frontend development",
      budget: "₦120,000 / month",
      location: "Remote · Africa",
      createdAt: "2026-09-27T10:00:00.000Z",
      status: "open",
      proofTask: {
        title: "Rebuild a responsive pricing card",
        instructions:
          "Create the provided pricing card as a responsive React component. Match the hierarchy, include keyboard focus states, and explain one accessibility choice.",
        deliverable: "GitHub repository and a live preview URL",
        timeEstimate: "45–60 minutes",
      },
    },
    {
      id: "gig-content",
      employerId: "employer-nuru",
      company: "Nuru Labs",
      title: "Product Content Assistant",
      description:
        "Turn customer research notes into concise help-center articles and onboarding copy for new merchants.",
      category: "Content & research",
      budget: "₦65,000 / project",
      location: "Remote · Nigeria",
      createdAt: "2026-09-26T13:30:00.000Z",
      status: "open",
      proofTask: {
        title: "Rewrite an onboarding message",
        instructions:
          "Rewrite a 250-word onboarding message into a clear 100-word version for first-time business owners.",
        deliverable: "A short written response",
        timeEstimate: "20 minutes",
      },
    },
  ],
  applications: [
    {
      id: "application-emmanuel",
      gigId: "gig-frontend",
      studentId: "student-emmanuel",
      studentName: "Emmanuel Kalu",
      university: "Federal University of Technology, Minna",
      skills: ["React", "Tailwind CSS", "Accessibility"],
      introduction:
        "I build responsive interfaces and care about the details that make them usable on low-cost mobile devices.",
      proofResponse:
        "I rebuilt the card mobile-first, used semantic headings, and kept every action keyboard accessible. The layout collapses without changing reading order.",
      githubUrl: "https://github.com/emmanuelkalu/pricing-card",
      previewUrl: "https://pricing-card-demo.vercel.app",
      proofComplete: true,
      status: "submitted",
      createdAt: "2026-09-27T15:20:00.000Z",
    },
    {
      id: "application-zara",
      gigId: "gig-frontend",
      studentId: "student-zara",
      studentName: "Zara Bello",
      university: "University of Ibadan",
      skills: ["JavaScript", "Figma", "CSS"],
      introduction:
        "I enjoy translating product references into clear visual systems and reusable components.",
      proofResponse: "",
      githubUrl: "",
      previewUrl: "",
      proofComplete: false,
      status: "submitted",
      createdAt: "2026-09-27T16:05:00.000Z",
    },
  ],
  reviews: [
    {
      id: "review-emmanuel",
      applicationId: "application-emmanuel",
      authorId: "employer-nuru",
      authorName: "Tunde Adebayo",
      decision: "strong_yes",
      note: "Clear explanation and a strong accessibility instinct. Worth a first conversation.",
      updatedAt: "2026-09-28T09:20:00.000Z",
    },
  ],
  verifications: [
    {
      id: "verification-david",
      userId: "student-david",
      studentName: "David Nwosu",
      university: "University of Nigeria, Nsukka",
      schoolEmail: "david@unn.edu.ng",
      matricNumber: "2023/182044",
      note: "Third-year engineering student building frontend products.",
      status: "pending",
      submittedAt: "2026-09-28T08:15:00.000Z",
    },
  ],
};

const DemoStoreContext = createContext<DemoStore | null>(null);

function makeId(prefix: string) {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${suffix}`;
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [firebaseUserId, setFirebaseUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(!firebaseEnabled);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) queueMicrotask(() => setState(JSON.parse(saved) as DemoState));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      queueMicrotask(() => setHydrated(true));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const unsubscribe = subscribeToFirebaseAuth(async (authUser) => {
      if (!authUser || cancelled) {
        setFirebaseUserId(null);
        if (!cancelled) setAuthReady(true);
        return;
      }
      setFirebaseUserId(authUser.uid);
      try {
        const [users, gigs, applications, verifications, reviews] = await Promise.all([
          loadFirebaseCollection<User>("users"),
          loadFirebaseCollection<Gig>("gigs"),
          loadFirebaseCollection<Application>("applications"),
          loadFirebaseCollection<VerificationRequest>("verifications"),
          loadFirebaseCollection<Review>("reviews"),
        ]);
        if (cancelled) return;
        const authProfile = users.find((user) => user.id === authUser.uid);
        setState((current) => ({
          ...current,
          users,
          gigs,
          applications,
          verifications,
          reviews,
          activeUserId: authUser.uid,
          activePersona: authProfile?.role === "employer"
            ? "employer"
            : authProfile?.role === "student"
              ? "student"
              : current.activePersona,
        }));
      } catch {
        // Keep the seeded experience available if a backend read is temporarily unavailable.
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (hydrated && !firebaseUserId) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [firebaseUserId, hydrated, state]);

  const currentUser = state.users.find((user) => user.id === state.activeUserId);

  const value = useMemo<DemoStore>(() => {
    const setPersona = (persona: Persona) => {
      setState((current) => ({
        ...current,
        activePersona: persona,
        activeUserId: firebaseUserId
          ? current.activeUserId
          : persona === "student"
            ? "student-amina"
            : persona === "employer"
              ? "employer-nuru"
              : current.activeUserId,
      }));
    };

    const signup = async (input: SignupInput) => {
      const firebaseCredential = await registerFirebaseAccount(input);
      const id = firebaseCredential?.user.uid ?? makeId("member");
      const user: User = {
        id,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        role: "member",
        skills: [],
        verificationStatus: "not_submitted",
      };
      setState((current) => ({
        ...current,
        users: [...current.users, user],
        activePersona: "student",
        activeUserId: id,
      }));
      return id;
    };

    const login = async (email: string, password: string) => {
      const credential = await loginFirebaseAccount(email.trim(), password);
      if (!credential) return null;
      const profiles = await loadFirebaseCollection<User>("users");
      const profile = profiles.find((user) => user.id === credential.user.uid);
      if (profile) {
        setState((current) => ({
          ...current,
          users: profiles,
          activeUserId: profile.id,
          activePersona: profile.role === "employer" ? "employer" : "student",
        }));
      }
      return profile?.role === "employer" ? "employer" : profile?.role === "student" ? "student" : "member";
    };

    const updateProfile = async (input: ProfileInput) => {
      const user = state.users.find((item) => item.id === state.activeUserId);
      if (!user) return;
      const skills = input.skills.map((skill) => skill.trim()).filter(Boolean).slice(0, 12);
      let idCardUrl = user.idCardUrl || input.idCardUrl.trim();
      if (input.idCardFile) {
        idCardUrl = await prepareStudentIdImage(input.idCardFile);
      }
      const verificationStatus = input.requestVerification ? "pending" : user.verificationStatus;
      const updatedUser: User = {
        ...user,
        university: input.university.trim(),
        course: input.course.trim(),
        schoolEmail: input.schoolEmail.trim().toLowerCase(),
        matricNumber: input.matricNumber.trim(),
        idCardUrl,
        portfolioUrl: input.portfolioUrl.trim(),
        skills,
        verificationStatus,
      };
      await persistFirestoreRecord("users", updatedUser.id, updatedUser);

      let verificationRequest: VerificationRequest | null = null;
      if (input.requestVerification) {
        verificationRequest = {
          id: updatedUser.id,
          userId: updatedUser.id,
          studentName: updatedUser.name,
          university: updatedUser.university || "",
          schoolEmail: updatedUser.schoolEmail || "",
          matricNumber: updatedUser.matricNumber || "",
          idCardUrl: updatedUser.idCardUrl,
          portfolioUrl: updatedUser.portfolioUrl,
          skills: updatedUser.skills,
          note: `${updatedUser.course || "Student"} profile submitted for verification.`,
          status: "pending",
          submittedAt: new Date().toISOString(),
        };
        await persistFirestoreRecord("verifications", verificationRequest.id, verificationRequest);
      }

      setState((current) => ({
        ...current,
        users: current.users.map((item) => item.id === updatedUser.id ? updatedUser : item),
        verifications: verificationRequest
          ? [verificationRequest, ...current.verifications.filter((item) => item.userId !== updatedUser.id)]
          : current.verifications,
      }));
    };

    const logout = async () => {
      await logoutFirebaseAccount();
      setState((current) => ({
        ...current,
        activePersona: "student",
        activeUserId: "student-amina",
      }));
    };

    const submitVerification = async (input: VerificationInput) => {
      const user = state.users.find((item) => item.id === state.activeUserId);
      if (!user) return;
      const request: VerificationRequest = {
        id: makeId("verification"),
        userId: user.id,
        studentName: user.name,
        university: input.university.trim(),
        schoolEmail: input.schoolEmail.trim().toLowerCase(),
        matricNumber: input.matricNumber.trim(),
        note: input.note.trim(),
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      await persistFirestoreRecord("verifications", request.id, request);
      setState((current) => ({
        ...current,
        users: current.users.map((item) =>
          item.id === user.id
            ? { ...item, university: request.university, verificationStatus: "pending" }
            : item,
        ),
        verifications: [
          request,
          ...current.verifications.filter((item) => item.userId !== user.id),
        ],
      }));
    };

    const reviewVerification = async (
      requestId: string,
      decision: "approved" | "rejected",
    ) => {
      const request = state.verifications.find((item) => item.id === requestId);
      if (!request) return;
      const updatedRequest = { ...request, status: decision };
      const updatedUser = state.users.find((item) => item.id === request.userId);
      await persistFirestoreRecord("verifications", requestId, updatedRequest);
      if (updatedUser) {
        await persistFirestoreRecord("users", updatedUser.id, {
          ...updatedUser,
          verificationStatus: decision === "approved" ? "verified" : "rejected",
        });
      }
      setState((current) => {
        return {
          ...current,
          verifications: current.verifications.map((item) =>
            item.id === requestId ? { ...item, status: decision } : item,
          ),
          users: current.users.map((item) =>
            item.id === request.userId
              ? {
                  ...item,
                  verificationStatus: decision === "approved" ? "verified" : "rejected",
                }
              : item,
          ),
        };
      });
    };

    const createGig = async (input: GigInput) => {
      const id = makeId("gig");
      const employer = state.users.find((user) => user.id === state.activeUserId);
      const gig: Gig = {
        ...input,
        id,
        employerId: employer?.id ?? "employer-nuru",
        company: employer?.company || employer?.name || "CampusGig member",
        createdAt: new Date().toISOString(),
        status: "open",
      };
      await persistFirestoreRecord("gigs", gig.id, gig);
      setState((current) => ({ ...current, gigs: [gig, ...current.gigs] }));
      return id;
    };

    const submitApplication = async (gigId: string, input: ApplicationInput) => {
      const student = state.users.find((user) => user.id === state.activeUserId);
      if (!student) return;
      if (student.verificationStatus !== "verified") {
        throw new Error("Student verification is required before applying.");
      }
      const application: Application = {
        id: makeId("application"),
        gigId,
        studentId: student.id,
        studentName: student.name,
        university: student.university || "University student",
        skills: student.skills.length ? student.skills : [student.course || "Emerging talent"],
        introduction: input.introduction.trim(),
        proofResponse: input.proofResponse.trim(),
        githubUrl: input.githubUrl.trim(),
        previewUrl: input.previewUrl.trim(),
        proofComplete: true,
        status: "submitted",
        createdAt: new Date().toISOString(),
      };
      await persistFirestoreRecord("applications", application.id, application);
      setState((current) => ({
        ...current,
        applications: [
          application,
          ...current.applications.filter(
            (item) => !(item.gigId === gigId && item.studentId === student.id),
          ),
        ],
      }));
    };

    const shortlistApplication = async (applicationId: string) => {
      const application = state.applications.find((item) => item.id === applicationId);
      if (!application) return;
      const updatedApplication = { ...application, status: "shortlisted" as const };
      await persistFirestoreRecord("applications", applicationId, updatedApplication);
      setState((current) => ({
        ...current,
        applications: current.applications.map((item) =>
          item.id === applicationId ? updatedApplication : item,
        ),
      }));
    };

    const selectApplicant = async (applicationId: string) => {
      const application = state.applications.find((item) => item.id === applicationId);
      const gig = state.gigs.find((item) => item.id === application?.gigId);
      if (!application || !gig) return;
      const updatedGig: Gig = {
        ...gig,
        status: "closed",
        selectedApplicantId: application.studentId,
        selectedApplicantName: application.studentName,
      };
      const updatedApplications = state.applications
        .filter((item) => item.gigId === gig.id)
        .map((item) => ({
          ...item,
          status: item.id === applicationId ? "shortlisted" as const : "not_selected" as const,
        }));
      await persistFirestoreRecord("gigs", updatedGig.id, updatedGig);
      await Promise.all(updatedApplications.map((item) => persistFirestoreRecord("applications", item.id, item)));
      setState((current) => ({
        ...current,
        gigs: current.gigs.map((item) => item.id === updatedGig.id ? updatedGig : item),
        applications: current.applications.map((item) => updatedApplications.find((next) => next.id === item.id) || item),
      }));
    };

    const saveReview = async (
      applicationId: string,
      decision: Review["decision"],
      note: string,
    ) => {
      const reviewer = state.users.find((user) => user.id === state.activeUserId);
      if (!reviewer) return;
      const review: Review = {
        id: makeId("review"),
        applicationId,
        authorId: reviewer.id,
        authorName: reviewer.name,
        decision,
        note: note.trim(),
        updatedAt: new Date().toISOString(),
      };
      await persistFirestoreRecord("reviews", `${applicationId}-${reviewer.id}`, review);
      setState((current) => ({
        ...current,
        reviews: [
          review,
          ...current.reviews.filter(
            (item) => !(item.applicationId === applicationId && item.authorId === reviewer.id),
          ),
        ],
      }));
    };

    const refreshData = async () => {
      if (!firebaseUserId) return;
      const [users, gigs, applications, verifications, reviews] = await Promise.all([
        loadFirebaseCollection<User>("users"),
        loadFirebaseCollection<Gig>("gigs"),
        loadFirebaseCollection<Application>("applications"),
        loadFirebaseCollection<VerificationRequest>("verifications"),
        loadFirebaseCollection<Review>("reviews"),
      ]);
      setState((current) => ({ ...current, users, gigs, applications, verifications, reviews }));
    };

    const resetDemo = () => {
      window.localStorage.removeItem(STORAGE_KEY);
      setState(initialState);
    };

    return {
      ...state,
      hydrated,
      authReady,
      currentUser,
      setPersona,
      signup,
      updateProfile,
      submitVerification,
      reviewVerification,
      createGig,
      submitApplication,
      shortlistApplication,
      selectApplicant,
      saveReview,
      refreshData,
      resetDemo,
      login,
      logout,
      backendConnected: Boolean(firebaseUserId),
    };
  }, [authReady, currentUser, firebaseUserId, hydrated, state]);

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore() {
  const context = useContext(DemoStoreContext);
  if (!context) throw new Error("useDemoStore must be used within DemoStoreProvider");
  return context;
}
