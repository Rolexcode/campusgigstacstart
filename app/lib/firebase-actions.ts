"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseAuth, firebaseStorage, firestore, firebaseEnabled } from "./firebase";
import type { User } from "./demo-store";

export async function registerFirebaseAccount(input: {
  name: string;
  email: string;
  password: string;
}): Promise<UserCredential | null> {
  if (!firebaseEnabled || !firebaseAuth || !firestore) return null;
  const credential = await createUserWithEmailAndPassword(firebaseAuth, input.email, input.password);
  await updateProfile(credential.user, { displayName: input.name });
  const profile: User = {
    id: credential.user.uid,
    name: input.name,
    email: input.email,
    role: "member",
    skills: [],
    verificationStatus: "not_submitted",
  };
  await setDoc(doc(firestore, "users", credential.user.uid), profile);
  return credential;
}

export async function loginFirebaseAccount(email: string, password: string) {
  if (!firebaseEnabled || !firebaseAuth) return null;
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function logoutFirebaseAccount() {
  if (firebaseAuth) await signOut(firebaseAuth);
}

export function subscribeToFirebaseAuth(callback: Parameters<typeof onAuthStateChanged>[1]) {
  if (!firebaseAuth) return () => undefined;
  return onAuthStateChanged(firebaseAuth, callback);
}

export async function loadFirebaseCollection<T>(collectionName: string) {
  if (!firestore || !firebaseAuth?.currentUser) return [] as T[];
  const snapshot = await getDocs(collection(firestore, collectionName));
  return snapshot.docs.map((item) => item.data() as T);
}

export async function persistFirestoreRecord(collectionName: string, id: string, value: unknown) {
  if (!firebaseEnabled || !firestore || !firebaseAuth?.currentUser) return;
  await setDoc(doc(firestore, collectionName, id), value);
}

export async function uploadStudentId(file: File, userId: string) {
  if (!firebaseEnabled || !firebaseStorage || !firebaseAuth?.currentUser) return null;
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const storageRef = ref(firebaseStorage, `student-ids/${userId}/${Date.now()}-${safeName}`);
  const snapshot = await uploadBytes(storageRef, file, { contentType: file.type || "application/octet-stream" });
  return getDownloadURL(snapshot.ref);
}
