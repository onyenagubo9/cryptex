"use client";
import { useState } from "react";

export default function ResetForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return setMessage("Please enter your email.");
    setLoading(true);
    try {
      const res = await fetch("/api/send-reset-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-10 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-6 text-center">
          🔒 Reset Your Password
        </h2>
        <p className="text-gray-300 text-center mb-6">
          Enter your email address below and we'll send you a password reset link.
        </p>

        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg text-gray-900 font-medium mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-black bg-yellow-400 hover:bg-yellow-500 transition flex items-center justify-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            "Send Reset Link"
          )}
        </button>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.includes("sent") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
