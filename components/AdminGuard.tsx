"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("AUTH USER:", user);

      if (!user) {
        router.push("/admin/login");
        return;
      }

      // admin email check
      if (user.email === "admin@gmail.com") {
        setAllowed(true);
      } else {
        router.push("/admin/login");
      }

      setChecking(false);
    });

    return () => unsub();
  }, []);

  if (checking) return <div className="p-6">Loading admin...</div>;

  if (!allowed) return null;

  return <>{children}</>;
}
