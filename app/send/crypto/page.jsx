"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function CryptoWithdraw() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    coin: "BTC",
    network: "",
    address: "",
    amount: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitWithdrawal = async () => {
    if (!form.address || !form.amount || !form.network) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "withdrawals"), {
        type: "crypto",
        data: form,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("Withdrawal submitted successfully!");
      router.push("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-6">
      <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-8">

        <h1 className="text-2xl font-bold text-yellow-400 mb-6">
          Crypto Withdrawal
        </h1>

        <select name="coin" onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 mb-4">
          <option>BTC</option>
          <option>ETH</option>
          <option>USDT</option>
        </select>

        <input name="network" placeholder="Network"
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 mb-4"/>

        <input name="address" placeholder="Wallet Address"
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 mb-4"/>

        <input name="amount" type="number" placeholder="Amount"
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 mb-6"/>

        <button
          disabled={loading}
          onClick={submitWithdrawal}
          className="w-full bg-blue-600 py-3 rounded-lg font-semibold"
        >
          {loading ? "Submitting..." : "Submit Withdrawal"}
        </button>

      </div>
    </div>
  );
}
