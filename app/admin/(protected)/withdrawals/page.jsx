"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "@/firebase/config";

export default function AdminWithdrawals() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "withdrawals"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "withdrawals", id), { status });
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">
        Withdrawal Requests
      </h1>

      <div className="space-y-4">
        {list.map(w => (
          <div key={w.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">

            <div>
              <p className="font-semibold">
                {w.type.toUpperCase()} - {w.data.amount}
              </p>
              <p className="text-sm text-gray-400">
                Status: <span className={
                  w.status === "approved" ? "text-green-400" :
                  w.status === "rejected" ? "text-red-400" :
                  "text-yellow-400"
                }>
                  {w.status}
                </span>
              </p>
            </div>

            {w.status === "pending" && (
              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(w.id, "approved")}
                  className="bg-green-600 px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(w.id, "rejected")}
                  className="bg-red-600 px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
