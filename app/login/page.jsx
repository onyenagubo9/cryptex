"use client";

import { useState, useEffect } from "react";
import { login } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) router.push("/dashboard");
    else setError(res.msg);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-6">
      <div
        className={`bg-gray-900/80 p-10 rounded-3xl shadow-xl w-full max-w-md text-white transform transition-all duration-700 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
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
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email Input */}
          <div className="relative animate-slideIn">
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
          <div className="relative animate-slideIn delay-75">
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
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        {/* Signup Link */}
        <p className="mt-6 text-center text-gray-300 animate-fadeIn delay-150">
          Don’t have an account?{" "}
          <span
            className="text-yellow-400 cursor-pointer font-semibold hover:underline"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </span>
        </p>

        {/* Forgot Password */}
        <p className="mt-3 text-center animate-fadeIn delay-200">
          <a
            href="/reset-password"
            className="text-yellow-400 hover:underline font-medium"
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
