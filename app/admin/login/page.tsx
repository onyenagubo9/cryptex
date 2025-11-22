"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // -----------------------------
  // HANDLE LOGIN
  // -----------------------------
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sign into Firebase Auth
      const creds = await signInWithEmailAndPassword(auth, email, password);
      const uid = creds.user.uid;

      // Check admin privileges
      const adminRef = doc(db, "admins", uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        setError("Access denied. You are not an admin.");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
              placeholder="admin@example.com"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
              placeholder="********"
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
