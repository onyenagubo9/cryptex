"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleSendClick = (type) => {
    setMessage(`⚠️ ${type} option is unavailable at the moment.`);
    // Optional: clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 sm:p-12">
      <h1 className="text-3xl font-bold mb-8 text-yellow-400">Send Funds</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Send to Crypto */}
        <div
          onClick={() => handleSendClick("Send to Crypto")}
          className="cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 shadow-lg transition-all hover:scale-105"
        >
          <div className="text-5xl mb-4">₿</div>
          <h2 className="text-xl font-semibold mb-2">Send to Crypto</h2>
          <p className="text-gray-400">Send cryptocurrency to another wallet</p>
        </div>

        {/* Send to Bank Account */}
        <div
          onClick={() => handleSendClick("Send to Bank Account")}
          className="cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 shadow-lg transition-all hover:scale-105"
        >
          <div className="text-5xl mb-4">🏦</div>
          <h2 className="text-xl font-semibold mb-2">Send to Bank Account</h2>
          <p className="text-gray-400">Transfer funds directly to a bank</p>
        </div>
      </div>

      {/* Unavailable message */}
      {message && (
        <div className="mt-8 bg-red-600 text-white text-center p-4 rounded-xl shadow-md max-w-md">
          {message}
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
