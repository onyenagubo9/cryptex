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
  const uid = Array.isArray(params.uid) ? params.uid[0] : params.uid ?? "";

  const [user, setUser] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // ------------------ LOAD DATA ------------------
  useEffect(() => {
    if (!uid) return;

    const loadDetails = async () => {
      try {
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

        const txRef = collection(db, "users", uid, "transactions");
        const txSnap = await getDocs(txRef);

        const list: Transaction[] = txSnap.docs.map((d) => ({
          id: d.id,
          amount: Number(d.data().amount ?? 0),
          type: d.data().type ?? "unknown",
          description: d.data().description ?? "",
          createdAt: d.data().createdAt ?? new Date().toISOString(),
        }));

        // Sort by newest
        list.sort((a, b) => {
          const A =
            a.createdAt instanceof Timestamp
              ? a.createdAt.toDate()
              : new Date(a.createdAt);
          const B =
            b.createdAt instanceof Timestamp
              ? b.createdAt.toDate()
              : new Date(b.createdAt);
          return B.getTime() - A.getTime();
        });

        setTransactions(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [uid]);

  if (loading)
    return <p className="p-6 text-gray-300 animate-pulse">Loading user...</p>;

  if (!user) return <p className="p-6 text-red-500">User not found.</p>;

  const formatDate = (createdAt: Timestamp | string) => {
    if (createdAt instanceof Timestamp)
      return createdAt.toDate().toLocaleString();
    return new Date(createdAt).toLocaleString();
  };

  // ------------------ UI ------------------
  return (
    <div className="p-6 space-y-10 text-white">

      {/* BACK BUTTON */}
      <Link
        href="/admin/users"
        className="inline-flex items-center text-yellow-400 hover:text-yellow-500 transition"
      >
        <FiArrowLeft className="mr-2" /> Back to Users
      </Link>

      {/* USER CARD */}
      <div className="
        bg-[#111]/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg 
        flex flex-col md:flex-row items-start gap-6 border border-gray-800
      ">
        <Image
          src={user.image || "/placeholder.png"}
          alt={user.name}
          width={120}
          height={120}
          className="rounded-xl border border-gray-700 object-cover shadow-md"
        />

        {/* INFO */}
        <div className="space-y-2 flex-1">
          <h1 className="text-3xl font-bold text-yellow-400">{user.name}</h1>

          <p className="flex items-center gap-2 text-gray-300">
            <FiMail /> {user.email}
          </p>

          <p className="flex items-center gap-2 text-gray-300">
            <FiUser /> UID: {user.uid}
          </p>
        </div>

        {/* BALANCES */}
        <div className="grid gap-3 text-right">
          <p className="text-xl font-bold text-blue-400">
            Balance: ${user.accountBalance?.toLocaleString()}
          </p>

          <p className="text-lg font-semibold text-yellow-400">
            Fuel: ${user.fuelMoney?.toLocaleString()}
          </p>

          <p className="text-lg font-semibold text-green-400">
            Profit: ${user.totalProfit?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-[#111]/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          Transactions
        </h2>

        {transactions.length === 0 ? (
          <p className="text-gray-400">No transactions found.</p>
        ) : (
          <div className="overflow-auto border border-gray-900 rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-gray-900/60">
                <tr>
                  <th className="p-3 text-gray-300">Amount</th>
                  <th className="p-3 text-gray-300">Type</th>
                  <th className="p-3 text-gray-300">Description</th>
                  <th className="p-3 text-gray-300">Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-800 hover:bg-gray-900/40 transition"
                  >
                    <td className="p-3 font-semibold text-blue-300">
                      ${tx.amount}
                    </td>
                    <td className="p-3 capitalize text-yellow-300">
                      {tx.type}
                    </td>
                    <td className="p-3 text-gray-300">{tx.description}</td>
                    <td className="p-3 text-gray-400">
                      {formatDate(tx.createdAt)}
                    </td>
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
