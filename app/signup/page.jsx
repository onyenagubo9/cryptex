"use client";

import { useState, useEffect } from "react";
import { register } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { User, Mail, Lock } from "lucide-react";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPage, setShowPage] = useState(false); // 👈 Controls when to show the page

  useEffect(() => {
    // Simulate loading (e.g. fetching auth status, etc.)
    const timer = setTimeout(() => setShowPage(true), 1500); // Show page after 1.5s
    return () => clearTimeout(timer);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(email, password, name);
    setLoading(false);

    if (res.success) router.push("/login");
    else setError(res.msg);
  };

  // 🌀 Initial Loading Screen
  if (!showPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-yellow-400 text-xl font-semibold">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <Image src="/logo-crp.png" alt="Loading Logo" width={60} height={60} />
          <span>Loading Cryptex...</span>
        </div>
      </div>
    );
  }

  // ✅ Actual Signup Page
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-6">
      <div
        className={`bg-gray-900/80 p-10 rounded-3xl shadow-xl w-full max-w-md text-white transform transition-all duration-700 opacity-100 translate-y-0`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo-crp.png"
            alt="Cryptex Logo"
            width={80}
            height={80}
            className="rounded-xl animate-bounce"
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center animate-fadeIn">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* Name Input */}
          <div className="relative animate-slideIn">
            <User className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition text-white"
            />
          </div>

          {/* Email Input */}
          <div className="relative animate-slideIn delay-75">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition text-white"
            />
          </div>

          {/* Password Input */}
          <div className="relative animate-slideIn delay-150">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition text-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-yellow-400 text-black font-bold py-3 rounded-full shadow-lg hover:bg-yellow-500 hover:scale-105 transition-transform duration-300 mt-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-300 animate-fadeIn delay-200">
          Already have an account?{" "}
          <span
            className="text-yellow-400 cursor-pointer font-semibold hover:underline"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
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
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 1s forwards;
        }
        .animate-slideIn {
          opacity: 0;
          transform: translateY(20px);
          animation: slideIn 0.7s forwards;
        }
        .delay-75 { animation-delay: 0.1s; }
        .delay-150 { animation-delay: 0.2s; }
        .delay-200 { animation-delay: 0.3s; }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes slideIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
