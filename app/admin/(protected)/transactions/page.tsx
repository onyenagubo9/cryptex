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
              userEmail = (userSnap.data().email as string) || "Unknown";
            }
          }

          txList.push({
            id: txDoc.id,
            amount: Number(data.amount),
            type: data.type as string,
            description: data.description as string,
            createdAt: data.createdAt,
            userId,
            userEmail,
          });
        }

        // Sort newest first
        txList.sort((a, b) => {
          const da =
            a.createdAt instanceof Timestamp
              ? a.createdAt.toDate()
              : new Date(a.createdAt);

          const dbb =
            b.createdAt instanceof Timestamp
              ? b.createdAt.toDate()
              : new Date(b.createdAt);

          return dbb.getTime() - da.getTime();
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

  if (loading) {
    return <div className="p-6 text-gray-600">Loading transactions...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Transactions</h1>

      <div className="overflow-auto rounded-xl shadow border border-gray-200 bg-white">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Type</th>
              <th className="p-3">Description</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => {
              const date =
                tx.createdAt instanceof Timestamp
                  ? tx.createdAt.toDate()
                  : new Date(tx.createdAt);

              const typeColor =
                tx.type === "profit"
                  ? "text-green-600 bg-green-100"
                  : tx.type === "debit"
                  ? "text-red-600 bg-red-100"
                  : tx.type === "fuel"
                  ? "text-yellow-700 bg-yellow-100"
                  : tx.type === "withdrawal"
                  ? "text-purple-700 bg-purple-100"
                  : "text-gray-700 bg-gray-100";

              return (
                <tr
                  key={tx.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* USER EMAIL LINK */}
                  <td className="p-3">
                    <Link
                      href={`/admin/users/${tx.userId}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {tx.userEmail}
                    </Link>
                  </td>

                  {/* AMOUNT */}
                  <td className="p-3 font-semibold">
                    ${tx.amount.toLocaleString()}
                  </td>

                  {/* TYPE */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${typeColor}`}
                    >
                      {tx.type}
                    </span>
                  </td>

                  {/* DESCRIPTION */}
                  <td className="p-3 text-gray-700">{tx.description}</td>

                  {/* DATE */}
                  <td className="p-3 text-gray-600">
                    {date.toLocaleString()}
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="p-3 flex space-x-2">
                    {/* EDIT BUTTON */}
                    <Link
                      href={`/admin/transactions/${tx.id}/edit`}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                    >
                      Edit
                    </Link>

                    {/* ADD TRANSACTION */}
                    <Link
                      href={`/admin/transactions/add`}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      Add
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
