// lib/checkAdmin.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function isAdminUid(uid: string) {
  if (!uid) return false;
  const ref = doc(db, "admins", uid);
  const snap = await getDoc(ref);
  return snap.exists();
}
