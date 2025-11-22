// components/AdminGuard.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { isAdminUid } from "@/lib/checkAdmin";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const ok = await isAdminUid(user.uid);
      if (!ok) {
        // not admin: sign out and redirect
        await signOut(auth);
        router.replace("/admin/login");
        return;
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading admin...</p>
      </div>
    );
  }

  return <>{children}</>;
}
