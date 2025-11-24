"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import {
  collectionGroup,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: Timestamp | string;
  userId: string;
  userEmail: string;
}

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Search + Pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const txSnap = await getDocs(collectionGroup(db, "transactions"));
        const txList: Transaction[] = [];

        for (const txDoc of txSnap.docs) {
          const data = txDoc.data();
          const userId = txDoc.ref.parent.parent?.id || "unknown";

          let userEmail = "Unknown";
          if (userId !== "unknown") {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              userEmail = userSnap.data().email || "Unknown";
            }
          }

          txList.push({
            id: txDoc.id,
            amount: Number(data.amount),
            type: data.type,
            description: data.description,
            createdAt: data.createdAt,
            userId,
            userEmail,
          });
        }

        // Sort by newest
        txList.sort((a, b) => {
          const aTime =
            a.createdAt instanceof Timestamp
              ? a.createdAt.toDate()
              : new Date(a.createdAt);

          const bTime =
            b.createdAt instanceof Timestamp
              ? b.createdAt.toDate()
              : new Date(b.createdAt);

          return bTime.getTime() - aTime.getTime();
        });

        setTransactions(txList);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  if (loading)
    return (
      <p className="p-6 text-gray-300 text-xl animate-pulse">Loading…</p>
    );

  // SEARCH
  const filtered = transactions.filter((tx) => {
    const s = search.toLowerCase();
    return (
      tx.userEmail.toLowerCase().includes(s) ||
      tx.type.toLowerCase().includes(s) ||
      tx.description.toLowerCase().includes(s)
    );
  });

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Badge color
  const badge = (type: string) => {
    switch (type) {
      case "profit":
        return "bg-green-900 text-green-300 border border-green-700";
      case "debit":
        return "bg-red-900 text-red-300 border border-red-700";
      case "fuel":
        return "bg-yellow-900 text-yellow-300 border border-yellow-700";
      default:
        return "bg-gray-800 text-gray-300 border border-gray-700";
    }
  };

  return (
    <div className="p-6 text-white">

      {/* HEADER */}
      <div className="mb-10 bg-[#0b1220] rounded-2xl p-6 border border-[#1a2335] shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-yellow-400">
            Transactions Overview
          </h1>

          <Link
            href="/admin/transactions/add"
            className="px-5 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition shadow-lg"
          >
            + Add Transaction
          </Link>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 rounded-xl bg-[#101b2d] border border-[#1f2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
        />
      </div>

      {/* TABLE WRAPPER */}
      <div className="overflow-auto bg-[#0b1220] rounded-2xl border border-[#1a2335] shadow-xl">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#101b2d] text-gray-300 text-left">
              <th className="p-4">User</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Type</th>
              <th className="p-4">Description</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((tx) => {
              const date =
                tx.createdAt instanceof Timestamp
                  ? tx.createdAt.toDate()
                  : new Date(tx.createdAt);

              return (
                <tr
                  key={tx.id}
                  className="border-b border-[#1f2a40] hover:bg-[#131d31] transition"
                >
                  <td className="p-4 text-blue-400 underline">
                    <Link href={`/admin/users/${tx.userId}`}>
                      {tx.userEmail}
                    </Link>
                  </td>

                  <td className="p-4 font-bold text-lg text-green-300">
                    ${tx.amount.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${badge(
                        tx.type
                      )}`}
                    >
                      {tx.type}
                    </span>
                  </td>

                  <td className="p-4 text-gray-300">{tx.description}</td>

                  <td className="p-4 text-gray-400">
                    {date.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <Link
                      href={`/admin/transactions/${tx.id}/edit`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-8 flex justify-center gap-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-lg font-semibold border ${
              currentPage === i + 1
                ? "bg-yellow-500 text-black"
                : "bg-[#0b1220] text-white border-[#1f2a40] hover:bg-[#131d31]"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
