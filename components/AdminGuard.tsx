"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      console.log("AUTH USER:", user);

      if (!user) {
        router.push("/admin/login");
        return;
      }

      try {
        // Check Firestore admin record
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          setAllowed(true); // admin confirmed
        } else {
          console.log("NOT ADMIN - REDIRECTING");
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("Admin check failed:", err);
        router.push("/admin/login");
      }

      setChecking(false);
    });

    return () => unsub();
  }, [router]);

  if (checking) return <div className="p-6">Loading admin...</div>;
  if (!allowed) return null;

  return <>{children}</>;
}
