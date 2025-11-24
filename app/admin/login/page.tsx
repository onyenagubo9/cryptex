"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPage, setShowPage] = useState(false);

  // Delay page load for smooth animation
  useEffect(() => {
    const t = setTimeout(() => setShowPage(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const creds = await signInWithEmailAndPassword(auth, email, password);
      const uid = creds.user.uid;

      // Check admin in Firestore
      const adminRef = doc(db, "admins", uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        setError("❌ Access denied. You are not an admin.");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading screen before showing login UI
  if (!showPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-yellow-400 text-xl font-semibold">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <Image src="/logo-crp.png" alt="Loading Logo" width={60} height={60} />
          <span>Loading Admin Panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-6">
      <div className="bg-gray-900/80 p-10 rounded-3xl shadow-xl w-full max-w-md text-white transition-all duration-700">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo-crp.png"
            alt="Admin Logo"
            width={80}
            height={80}
            className="rounded-xl animate-bounce"
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition text-white"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition text-white"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-center text-sm">{error}</p>}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-yellow-400 text-black font-bold py-3 rounded-full shadow-lg hover:bg-yellow-500 hover:scale-105 transition-transform duration-300 ${
              loading ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Verifying admin..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <p className="mt-6 text-center text-gray-300">
          <a
            href="/reset-password"
            className="text-yellow-400 hover:underline font-semibold"
          >
            Forgot Password?
          </a>
        </p>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
