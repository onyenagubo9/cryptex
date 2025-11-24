"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "@/firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        const txRef = collection(firestore, "users", user.uid, "transactions");
        const q = query(txRef, orderBy("createdAt", "desc"));

        const unsubscribeTx = onSnapshot(q, (snapshot) => {
          const txs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTransactions(txs);
          setLoading(false);
        });

        return () => unsubscribeTx();
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  const typeColors = {
    deposit: "text-green-500",
    debit: "text-red-500",
    fuel: "text-blue-500",
    profit: "text-yellow-500",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-transparent text-white">
        <p className="animate-pulse text-gray-300">Loading transactions...</p>
      </div>
    );
  }

  // PAGINATION CALCULATIONS
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-transparent text-white px-6 py-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-yellow-400">
      
      </h1>

      {transactions.length === 0 ? (
        <p className="text-gray-400 text-center">No transactions yet</p>
      ) : (
        <>
          {/* TRANSACTION LIST */}
          <div className="space-y-4">
            {currentItems.map((tx) => (
              <div
                key={tx.id}
                className="bg-[#111111]/80 backdrop-blur-md p-5 rounded-2xl border border-gray-800 shadow-md hover:shadow-yellow-400/20 transition duration-200"
              >
                <div className="flex justify-between items-center">
                  <p
                    className={`font-semibold capitalize ${
                      typeColors[tx.type] || "text-blue-400"
                    }`}
                  >
                    {tx.type}
                  </p>
                  <p className="text-lg font-bold text-gray-200">
                    ${tx.amount}
                  </p>
                </div>

                <p className="text-gray-400 mt-2">{tx.description}</p>

                <p className="text-gray-500 text-sm mt-1">
                  {tx.createdAt?.toDate
                    ? tx.createdAt.toDate().toLocaleString()
                    : "Pending..."}
                </p>
              </div>
            ))}
          </div>

          {/* PAGINATION BUTTONS */}
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === 1
                  ? "text-gray-500 border-gray-700"
                  : "text-white border-gray-400 hover:bg-gray-700"
              }`}
            >
              Previous
            </button>

            <p className="text-gray-300 text-sm">
              Page {currentPage} of {totalPages}
            </p>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === totalPages
                  ? "text-gray-500 border-gray-700"
                  : "text-white border-gray-400 hover:bg-gray-700"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
