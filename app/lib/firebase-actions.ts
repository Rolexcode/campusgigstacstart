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
import { firebaseAuth, firestore, firebaseEnabled } from "./firebase";
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

export function prepareStudentIdImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      reject(new Error("Choose a JPG, PNG, or WebP image of your student ID."));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error("Choose an ID image smaller than 10 MB."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("That ID image could not be read. Choose another file."));
    reader.onload = () => {
      const image = new window.Image();
      image.onerror = () => reject(new Error("That ID image could not be opened. Choose another file."));
      image.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Your browser could not prepare that ID image."));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.74);
        if (dataUrl.length > 760_000) {
          reject(new Error("That image is too detailed after compression. Choose a smaller image."));
          return;
        }
        resolve(dataUrl);
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
