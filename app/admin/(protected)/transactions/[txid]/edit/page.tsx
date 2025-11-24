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

  const txid = Array.isArray(params?.txid) ? params.txid[0] : params?.txid || "";

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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: any) => {
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

      setSuccess("Transaction updated!");

      setTimeout(() => router.push("/admin/transactions"), 1200);
    } catch (err) {
      console.error(err);
      setError("Failed to update transaction.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading transaction...</div>;

  return (
    <div className="p-6 max-w-xl">
      <Link href="/admin/transactions" className="flex items-center text-blue-600 hover:underline mb-6">
        <FiArrowLeft className="mr-2" /> Back
      </Link>

      <h1 className="text-3xl font-bold mb-6">Edit Transaction</h1>

      <form onSubmit={handleSave} className="bg-white p-6 shadow rounded-xl space-y-6">

        <div>
          <label className="block font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="debit">Debit</option>
            <option value="profit">Profit</option>
            <option value="fuel">Fuel</option>
            <option value="deposit">deposit</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          ></textarea>
        </div>

        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
