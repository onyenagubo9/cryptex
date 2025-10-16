"use client";

import { useState } from "react";
import { auth } from "@/firebase/config";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const user = auth.currentUser;
    if (!user || !user.email) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccess("✅ Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");

      setTimeout(() => {
        router.push("/settings");
      }, 2000);
    } catch (err) {
      console.error("Change password error:", err.message);
      if (err.message.includes("wrong-password")) {
        setError("Current password is incorrect.");
      } else if (err.message.includes("weak-password")) {
        setError("New password should be at least 6 characters long.");
      } else {
        setError("Failed to change password. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* 🔹 Sticky Header */}
      <header className="sticky top-0 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex items-center gap-3 p-4 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
        >
          <ArrowLeft size={22} />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-semibold text-center flex-1 -ml-8">
          🔒 Change Password
        </h1>
      </header>

      {/* 🔹 Main Form */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 py-10">
        <form
          onSubmit={handleChangePassword}
          className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-800 w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Update Your Password
          </h2>

          {/* Feedback messages */}
          {error && (
            <div className="bg-red-600/80 text-white text-sm p-2 rounded-md mb-3 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-600/80 text-white text-sm p-2 rounded-md mb-3 text-center">
              {success}
            </div>
          )}

          <div className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-gray-800 text-white p-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-yellow-500 outline-none transition"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-gray-800 text-white p-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-yellow-500 outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-2">
                Must be at least 6 characters long.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-3 rounded-xl transition active:scale-95"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </main>
    </div>
  );
}
