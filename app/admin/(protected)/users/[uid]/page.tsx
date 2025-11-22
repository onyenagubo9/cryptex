"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { FiMail, FiArrowLeft, FiUser } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

// ----------------------
// TYPES
// ----------------------
interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: Timestamp | string;
}

interface UserData {
  uid: string;
  name: string;
  email: string;
  image?: string;
  accountBalance?: number;
  fuelMoney?: number;
  totalProfit?: number;
}

// ----------------------
// USER DETAILS PAGE
// ----------------------
export default function UserDetailsPage() {
  const params = useParams();

  // Ensure uid is ALWAYS a string
  const rawUid = Array.isArray(params.uid) ? params.uid[0] : params.uid;
  const uid = rawUid ?? ""; // 🔥 FIX: guarantee parameter is string

  const [user, setUser] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return; // Safety check

    const loadDetails = async () => {
      try {
        // ----------------------
        // Load user info
        // ----------------------
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const u = userSnap.data();
          setUser({
            uid: u.uid,
            name: u.name,
            email: u.email,
            image: u.image,
            accountBalance: u.accountBalance || 0,
            fuelMoney: u.fuelMoney || 0,
            totalProfit: u.totalProfit || 0,
          });
        }

        // ----------------------
        // Load transactions
        // ----------------------
        const txRef = collection(db, "users", uid, "transactions");
        const txSnap = await getDocs(txRef);

        const txList: Transaction[] = txSnap.docs.map((d) => {
          const data = d.data();

          return {
            id: d.id,
            amount: Number(data.amount ?? 0),
            type: (data.type as string) ?? "unknown",
            description: (data.description as string) ?? "",
            createdAt: data.createdAt ?? new Date().toISOString(),
          };
        });

        // Sort by newest
        txList.sort((a, b) => {
          const dateA =
            a.createdAt instanceof Timestamp
              ? a.createdAt.toDate()
              : new Date(a.createdAt);

          const dateB =
            b.createdAt instanceof Timestamp
              ? b.createdAt.toDate()
              : new Date(b.createdAt);

          return dateB.getTime() - dateA.getTime();
        });

        setTransactions(txList);
      } catch (err) {
        console.error("Error loading user details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [uid]);

  if (loading) {
    return <p className="p-6">Loading user details...</p>;
  }

  if (!user) {
    return <p className="p-6 text-red-500">User not found.</p>;
  }

  // Safe date formatting
  const formatDate = (createdAt: Timestamp | string) => {
    if (createdAt instanceof Timestamp)
      return createdAt.toDate().toLocaleString();

    return new Date(createdAt).toLocaleString();
  };

  return (
    <div className="p-6 space-y-8">
      {/* BACK BUTTON */}
      <Link
        href="/admin/users"
        className="flex items-center text-blue-600 hover:underline"
      >
        <FiArrowLeft className="mr-2" /> Back to Users
      </Link>

      {/* USER INFO CARD */}
      <div className="bg-white shadow rounded-2xl p-6 flex flex-col md:flex-row gap-6 border">
        {/* PROFILE IMAGE */}
        <Image
          src={user.image || "https://via.placeholder.com/150"}
          alt={user.name}
          width={128}
          height={128}
          className="w-32 h-32 rounded-xl object-cover border"
        />

        {/* USER INFO */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{user.name}</h1>

          <p className="flex items-center gap-2 text-gray-700">
            <FiMail /> {user.email}
          </p>

          <p className="flex items-center gap-2 text-gray-700">
            <FiUser /> UID: {user.uid}
          </p>
        </div>

        {/* ACCOUNT SUMMARY */}
        <div className="ml-auto flex flex-col justify-between">
          <p className="text-xl font-bold text-blue-700">
            Account Balance: ${user.accountBalance?.toLocaleString()}
          </p>

          <p className="text-lg font-semibold text-yellow-600">
            Fuel Money: ${user.fuelMoney?.toLocaleString()}
          </p>

          <p className="text-lg font-semibold text-green-600">
            Total Profit: ${user.totalProfit?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white shadow rounded-2xl p-6 border">
        <h2 className="text-2xl font-bold mb-4">Transactions</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-600">No transactions found.</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Amount</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">${tx.amount}</td>
                    <td className="p-3 capitalize">{tx.type}</td>
                    <td className="p-3">{tx.description}</td>
                    <td className="p-3">{formatDate(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
