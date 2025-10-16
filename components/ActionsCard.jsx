"use client";

import { useRouter } from "next/navigation";

export default function ActionsCard() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-gray-800/70 to-gray-700/50 backdrop-blur-md border border-gray-600 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl flex flex-col gap-4 hover:scale-105 transition-transform duration-300 w-full">
      {/* Card Title */}
      <h3 className="text-lg sm:text-xl md:text-2xl text-yellow-400 font-semibold flex items-center gap-2">
        💳 Wallet Actions
      </h3>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push("/deposit")}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-md"
        >
          💵 Deposit
        </button>

        <button
          onClick={() => router.push("/send")}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition shadow-md"
        >
          ✉️ Send
        </button>
      </div>
    </div>
  );
}
