"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import SubHeader from "@/components/SubHeader";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        try {
          const docRef = doc(db, "users", userAuth.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser({ uid: userAuth.uid, ...userData });
            setPreview(userData.image || "/defaultAvatar.png");
          } else {
            setUser({
              uid: userAuth.uid,
              name: userAuth.displayName || "Unknown User",
              email: userAuth.email,
              image: userAuth.photoURL || "/defaultAvatar.png",
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Loading user info...
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        No user found.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* ✅ New SubHeader */}
    

      {/* Existing content */}
      <header className="flex flex-col items-center justify-center py-8 border-b border-gray-800">
        <img
          src={preview}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-700 mb-3"
        />
        <h2 className="text-lg font-semibold">{user.name || "Unnamed User"}</h2>
        <p className="text-sm text-gray-400">{user.email}</p>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <button
          onClick={() => router.push("/edit-profile")}
          className="w-full py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition text-left px-4"
        >
          ✏️ Edit Profile
        </button>

        <button
          onClick={() => router.push("/change-password")}
          className="w-full py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition text-left px-4"
        >
          🔐 Change Password
        </button>

        <button
          onClick={() => router.push("/privacy-policy")}
          className="w-full py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition text-left px-4"
        >
          📜 Privacy Policy
        </button>

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-600 rounded-xl hover:bg-red-500 transition text-left px-4 mt-10"
        >
          🚪 Log Out
        </button>
      </main>
    </div>
  );
}
