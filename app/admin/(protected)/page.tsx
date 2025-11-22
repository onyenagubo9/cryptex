"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/firebase/config";
import { collection, collectionGroup, getDocs } from "firebase/firestore";
import { FiUsers, FiBell, FiTrendingUp, FiDollarSign } from "react-icons/fi";

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [transactionsCount, setTransactionsCount] = useState<number | null>(null);
  const [notificationsCount, setNotificationsCount] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      setUsersCount(usersSnap.size);

      const txSnap = await getDocs(collectionGroup(db, "transactions"));
      setTransactionsCount(txSnap.size);

      const notSnap = await getDocs(collectionGroup(db, "notifications"));
      setNotificationsCount(notSnap.size);
    };

    loadData();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: usersCount ?? "Loading...",
      icon: <FiUsers size={28} />,
      color: "bg-blue-100 text-blue-700",
      link: "/admin/users",
    },
    {
      title: "Transactions",
      value: transactionsCount ?? "Loading...",
      icon: <FiTrendingUp size={28} />,
      color: "bg-green-100 text-green-700",
      link: "/admin/transactions",
    },
    {
      title: "Notifications",
      value: notificationsCount ?? "Loading...",
      icon: <FiBell size={28} />,
      color: "bg-yellow-100 text-yellow-700",
      link: "/admin/notifications",
    },
    {
      title: "Revenue",
      value: "$0.00",
      icon: <FiDollarSign size={28} />,
      color: "bg-purple-100 text-purple-700",
      link: "/admin/revenue", // placeholder
    },
  ];

  return (
    <div className="p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-8 text-gray-900 tracking-tight">
        Admin Dashboard
      </h1>

      {/* GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link href={card.link} key={index}>
            <div
              className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 
              transition-all duration-200 p-6 border border-gray-100 flex justify-between 
              items-center cursor-pointer"
            >
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{card.value}</p>
              </div>

              <div className={`p-4 rounded-xl ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* EXTRA SECTION */}
      <div className="mt-12 bg-white shadow rounded-2xl p-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-600">
          Charts and advanced analytics can be displayed here. 
          Tell me if you want to add charts or graphs.
        </p>
      </div>

    </div>
  );
}
