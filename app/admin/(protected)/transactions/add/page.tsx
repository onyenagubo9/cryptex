"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

interface User {
  uid: string;
  name: string;
  email: string;
}

export default function AddTransactionPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [form, setForm] = useState({
    amount: "",
    type: "debit",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map((doc) => ({
        uid: doc.id,
        name: doc.data().name || "No Name",
        email: doc.data().email || "No Email",
      }));
      setUsers(list);
    };

    loadUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) {
      setError("Please select a user.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Add the transaction
      await addDoc(collection(db, "users", selectedUser, "transactions"), {
        amount: form.amount,
        type: form.type,
        description: form.description,
        createdAt: Timestamp.now(), // FIXED: Real Firebase Timestamp
      });

      const userRef = doc(db, "users", selectedUser);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      const user = userSnap.data();

      const currentBalance = Number(user.accountBalance?.toString().replace(/,/g, "")) || 0;
      const currentFuel = Number(user.fuelMoney || 0);
      const currentProfit = Number(user.totalProfit?.toString().replace(/,/g, "")) || 0;

      const amount = Number(form.amount);

      let newBalance = currentBalance;
      let newFuel = currentFuel;
      let newProfit = currentProfit;

      if (form.type === "debit") newBalance -= amount;
      if (form.type === "withdrawal") newBalance -= amount;
      if (form.type === "fuel") newFuel += amount;
      if (form.type === "profit") newProfit += amount;

      await updateDoc(userRef, {
        accountBalance: newBalance.toLocaleString(),
        fuelMoney: newFuel,
        totalProfit: newProfit.toLocaleString(),
      });

      setSuccess("Transaction added successfully!");

      setTimeout(() => {
        router.push("/admin/transactions");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to add transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">

      <Link href="/admin/transactions" className="flex items-center text-blue-600 hover:underline mb-6">
        <FiArrowLeft className="mr-2" /> Back
      </Link>

      <h1 className="text-3xl font-bold mb-6">Add Transaction</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-xl space-y-6 border">

        <div>
          <label className="block font-medium mb-1">Select User</label>
          <select
            className="w-full p-3 border rounded-lg"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">-- Select a User --</option>
            {users.map((u) => (
              <option key={u.uid} value={u.uid}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

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
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Saving..." : "Add Transaction"}
        </button>

      </form>
    </div>
  );
}
