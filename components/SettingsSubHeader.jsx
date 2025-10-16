"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SettingsSubHeader({ title }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 px-4 py-4 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-20">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="p-2 rounded-full hover:bg-gray-800 transition"
      >
        <ArrowLeft className="w-5 h-5 text-gray-300" />
      </button>

      {/* Title */}
      <h1 className="text-lg font-semibold text-white">{title}</h1>
    </div>
  );
}
