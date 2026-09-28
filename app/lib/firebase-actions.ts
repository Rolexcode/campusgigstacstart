"use client";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { firebaseAuth, firestore, firebaseEnabled } from "./firebase";
import type { User } from "./demo-store";

export async function registerFirebaseAccount(input: {
  name: string;
  email: string;
  password: string;
  role: "student" | "employer";
  university?: string;
  course?: string;
  company?: string;
}): Promise<UserCredential | null> {
  if (!firebaseEnabled || !firebaseAuth || !firestore) return null;
  try {
    const credential = await createUserWithEmailAndPassword(firebaseAuth, input.email, input.password);
    await updateProfile(credential.user, { displayName: input.name });
    const profile: User = {
      id: credential.user.uid,
      name: input.name,
      email: input.email,
      role: input.role,
      university: input.university,
      course: input.course,
      company: input.company,
      skills: [],
      verificationStatus: input.role === "student" ? "not_submitted" : undefined,
    };
    await setDoc(doc(firestore, "users", credential.user.uid), profile);
    return credential;
  } catch {
    // The local demo remains usable when Auth is not enabled on a fresh clone.
    return null;
  }
}

export async function persistFirestoreRecord(collection: string, id: string, value: unknown) {
  if (!firebaseEnabled || !firestore || !firebaseAuth?.currentUser) return;
  try {
    await setDoc(doc(firestore, collection, id), value);
  } catch {
    // Persistence is an enhancement for the demo; local state remains authoritative.
  }
}
