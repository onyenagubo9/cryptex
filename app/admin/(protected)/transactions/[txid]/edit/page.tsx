"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { db } from "@/firebase/config";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
} from "firebase/firestore";

interface TransactionData {
  amount: string;
  type: string;
  description: string;
}

export default function EditTransactionPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params?.txid;
  const txid = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const [form, setForm] = useState<TransactionData>({
    amount: "",
    type: "debit",
    description: "",
  });

  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------------------------------------
  // LOAD TRANSACTION
  // ----------------------------------------------------
  useEffect(() => {
    const loadTransaction = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));

        for (const u of usersSnap.docs) {
          const txRef = doc(db, "users", u.id, "transactions", txid);
          const txSnap = await getDoc(txRef);

          if (txSnap.exists()) {
            const data = txSnap.data();

            setUserId(u.id);

            setForm({
              amount: data.amount?.toString() ?? "",
              type: data.type ?? "debit",
              description: data.description ?? "",
            });

            break;
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load transaction.");
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [txid]);

  // ----------------------------------------------------
  // INPUT CHANGE
  // ----------------------------------------------------
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ----------------------------------------------------
  // SAVE CHANGES
  // ----------------------------------------------------
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const txRef = doc(db, "users", userId, "transactions", txid);

      await updateDoc(txRef, {
        amount: form.amount,
        type: form.type,
        description: form.description,
      });

      setSuccess("Transaction updated successfully!");

      setTimeout(() => router.push("/admin/transactions"), 1200);
    } catch (err) {
      console.error(err);
      setError("Failed to update transaction.");
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      {/* Back button */}
      <Link
        href="/admin/transactions"
        className="flex items-center mb-6 text-yellow-400 hover:text-yellow-300 transition"
      >
        <FiArrowLeft className="mr-2" /> Back to Transactions
      </Link>

      {/* Heading */}
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">
        Edit Transaction
      </h1>

      {/* Form card */}
      <form
        onSubmit={handleSave}
        className="bg-[#0d1117] border border-gray-700 p-6 rounded-xl shadow-lg space-y-6"
      >
        {/* Amount */}
        <div>
          <label className="block mb-1 text-gray-300">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-yellow-400 outline-none"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block mb-1 text-gray-300">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-yellow-400 outline-none"
          >
            <option value="debit">Debit</option>
            <option value="profit">Profit</option>
            <option value="fuel">Fuel</option>
            <option value="deposit">Deposit</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-gray-300">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-yellow-400 outline-none"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Messages */}
        {success && <p className="text-green-400">{success}</p>}
        {error && <p className="text-red-400">{error}</p>}

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
