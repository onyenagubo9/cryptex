"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import { Mail } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset link sent to your email! or spam");
      setEmail("");
    } catch (error) {
      console.error("Error resetting password:", error);
      if (error.code === "auth/user-not-found")
        setMessage("❌ No account found with that email.");
      else if (error.code === "auth/invalid-email")
        setMessage("⚠️ Invalid email address.");
      else setMessage("⚠️ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-6">
      <form className="bg-gray-900/80 p-10 rounded-3xl shadow-xl w-full max-w-md text-white" onSubmit={handleReset}>
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center animate-fadeIn">Reset Password</h2>

        {/* Email Input */}
        <div className="relative mb-4 animate-slideIn">
          <Mail className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-yellow-400 text-black font-bold py-3 rounded-full shadow-lg hover:bg-yellow-500 hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-3 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Message */}
        {message && <p className="mt-4 text-center text-sm">{message}</p>}

        {/* Back to Login */}
        <p className="mt-6 text-center text-sm text-gray-300 animate-fadeIn delay-100">
          <a href="/login" className="text-yellow-400 hover:underline font-semibold">Back to Login</a>
        </p>
      </form>

      {/* Animations */}
      <style jsx>{`
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 1s forwards;
        }
        .animate-slideIn {
          opacity: 0;
          transform: translateY(20px);
          animation: slideIn 0.7s forwards;
        }
        .delay-100 { animation-delay: 0.2s; }

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
