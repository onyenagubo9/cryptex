"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import  app  from "@/firebase/config"; // your Firebase config file

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const token = await user.getIdTokenResult();
      if (token.claims.admin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        router.push("/unauthorized");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (isAdmin === null) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome, Admin 👋</p>

      {/* Add your Firestore data views below */}
    </div>
  );
}
