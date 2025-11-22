"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();

  // 🔥 FIX — uid ALWAYS a string (prevents Firestore overload error)
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

  // -----------------------------------------------------
  // LOAD USER DETAILS
  // -----------------------------------------------------
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
        console.error(err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    if (uid) loadUser();
  }, [uid]);

  // -----------------------------------------------------
  // HANDLE INPUT CHANGE (Fully Typed)
  // -----------------------------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -----------------------------------------------------
  // SAVE CHANGES (Fully Typed)
  // -----------------------------------------------------
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

        // ❗ accountBalance & totalProfit stored as strings in Firestore
        accountBalance: form.accountBalance,
        totalProfit: form.totalProfit,

        fuelMoney: Number(form.fuelMoney),
      });

      setSuccess("User updated successfully!");

      setTimeout(() => {
        router.push(`/admin/users/${uid}`);
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading user...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-2xl">
      {/* Back Button */}
      <Link
        href={`/admin/users/${uid}`}
        className="flex items-center text-blue-600 hover:underline mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back to User Details
      </Link>

      <h1 className="text-3xl font-bold mb-6">Edit User</h1>

      <form
        onSubmit={handleSave}
        className="space-y-6 bg-white rounded-xl p-6 shadow border border-gray-200"
      >
        {/* NAME */}
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block font-medium mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* PROFILE IMAGE */}
        <div>
          <label className="block font-medium mb-1">Profile Image URL</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* ACCOUNT BALANCE */}
        <div>
          <label className="block font-medium mb-1">Account Balance</label>
          <input
            type="text"
            name="accountBalance"
            value={form.accountBalance}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* FUEL MONEY */}
        <div>
          <label className="block font-medium mb-1">Fuel Money</label>
          <input
            type="number"
            name="fuelMoney"
            value={form.fuelMoney}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* TOTAL PROFIT */}
        <div>
          <label className="block font-medium mb-1">Total Profit</label>
          <input
            type="text"
            name="totalProfit"
            value={form.totalProfit}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* STATUS */}
        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
