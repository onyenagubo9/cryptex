"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { FiMail, FiArrowLeft, FiUser } from "react-icons/fi";
import Link from "next/link";

// ----------------------
// TYPES
// ----------------------
interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: any; // Timestamp or string
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
  const { uid } = useParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        // ----------------------
        // Load user info
        // ----------------------
        const userRef = doc(db, "users", uid as string);
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
        const txRef = collection(db, "users", uid as string, "transactions");
        const txSnap = await getDocs(txRef);

        const txList: Transaction[] = txSnap.docs.map((d) => {
          const data = d.data();

          return {
            id: d.id,
            amount: Number(data.amount ?? 0),
            type: data.type ?? "unknown",
            description: data.description ?? "",
            createdAt:
              data.createdAt ??
              { toDate: () => new Date() }, // fallback to avoid errors
          };
        });

        // Sort by newest
        txList.sort((a, b) => {
          const da = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(a.createdAt.replace?.(" at ", " ") || a.createdAt);

          const dbb = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(b.createdAt.replace?.(" at ", " ") || b.createdAt);

          return dbb.getTime() - da.getTime();
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

  // Safe date formatting function
  const formatDate = (createdAt: any) => {
    if (createdAt?.toDate) return createdAt.toDate().toLocaleString();
    if (typeof createdAt === "string")
      return new Date(createdAt.replace(" at ", " ")).toLocaleString();
    return "N/A";
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
        <img
          src={user.image || "https://via.placeholder.com/150"}
          alt={user.name}
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
