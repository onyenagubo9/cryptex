"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();

  const rawUid = Array.isArray(params.uid) ? params.uid[0] : params.uid;
  const uid = rawUid ?? "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    accountBalance: "",
    fuelMoney: "",
    totalProfit: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // LOAD USER DETAILS
  useEffect(() => {
    const loadUser = async () => {
      try {
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError("User not found.");
          return;
        }

        const data = snap.data();

        setForm({
          name: data.name || "",
          email: data.email || "",
          image: data.image || "",
          accountBalance: data.accountBalance?.toString() || "0",
          fuelMoney: data.fuelMoney?.toString() || "0",
          totalProfit: data.totalProfit?.toString() || "0",
        });
      } catch (err) {
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    if (uid) loadUser();
  }, [uid]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const ref = doc(db, "users", uid);

      await updateDoc(ref, {
        name: form.name.trim(),
        email: form.email.trim(),
        image: form.image.trim(),
        accountBalance: form.accountBalance,
        totalProfit: form.totalProfit,
        fuelMoney: Number(form.fuelMoney),
      });

      setSuccess("User updated successfully!");

      setTimeout(() => router.push(`/admin/users/${uid}`), 1200);
    } catch (err) {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p className="p-6 text-gray-300 animate-pulse">
        Loading user details...
      </p>
    );

  if (error)
    return <p className="p-6 text-red-500 font-semibold">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* BACK BUTTON */}
      <Link
        href={`/admin/users/${uid}`}
        className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition mb-8"
      >
        <FiArrowLeft size={20} />
        Back to User Details
      </Link>

      <h1 className="text-4xl font-extrabold text-white mb-8">
        Edit User
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-gray-900/70 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-2xl p-8 space-y-6 text-white"
      >
        {/* PROFILE PREVIEW */}
        <div className="flex justify-center mb-6">
          <Image
            src={form.image || "/placeholder.png"}
            alt="Profile"
            width={110}
            height={110}
            className="rounded-full border-4 border-gray-700 shadow-lg"
          />
        </div>

        {/* NAME */}
        <div>
          <label className="block text-gray-300 mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-gray-300 mb-1 font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-400"
          />
        </div>

        {/* IMAGE URL */}
        <div>
          <label className="block text-gray-300 mb-1 font-medium">Profile Image URL</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-400"
          />
        </div>

        {/* ACCOUNT BALANCE */}
        <div>
          <label className="block text-gray-300 mb-1 font-medium">Account Balance</label>
          <input
            type="text"
            name="accountBalance"
            value={form.accountBalance}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-400"
          />
        </div>

        {/* FUEL MONEY */}
        <div>
          <label className="block text-gray-300 mb-1 font-medium">Fuel Money</label>
          <input
            type="number"
            name="fuelMoney"
            value={form.fuelMoney}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-400"
          />
        </div>

        {/* TOTAL PROFIT */}
        <div>
          <label className="block text-gray-300 mb-1 font-medium">Total Profit</label>
          <input
            type="text"
            name="totalProfit"
            value={form.totalProfit}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-400"
          />
        </div>

        {/* STATUS */}
        {success && <p className="text-green-400">{success}</p>}
        {error && <p className="text-red-400">{error}</p>}

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-yellow-400 text-black py-3 rounded-full font-bold hover:bg-yellow-500 hover:scale-[1.02] transition disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
