"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/firebase/config";
import { collection, collectionGroup, getDocs } from "firebase/firestore";
import { FiUsers, FiBell, FiTrendingUp } from "react-icons/fi";

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

  // REMOVED Revenue — only the 3 main cards remain
  const cards = [
    {
      title: "Total Users",
      value: usersCount ?? "Loading...",
      icon: <FiUsers size={28} />,
      color: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      link: "/admin/users",
    },
    {
      title: "Transactions",
      value: transactionsCount ?? "Loading...",
      icon: <FiTrendingUp size={28} />,
      color: "bg-green-500/20 text-green-300 border-green-500/40",
      link: "/admin/transactions",
    },
    {
      title: "Notifications",
      value: notificationsCount ?? "Loading...",
      icon: <FiBell size={28} />,
      color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
      link: "/admin/notifications",
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">

      {/* HEADER */}
      <h1 className="text-4xl font-extrabold mb-10 text-yellow-400 drop-shadow-lg tracking-wide animate-fadeIn">
        Dashboard Overview
      </h1>

      {/* GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-14">
        {cards.map((card, index) => (
          <Link href={card.link} key={index}>
            <div
              className={`
                bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl 
                border ${card.color} 
                p-7 flex justify-between items-center cursor-pointer hover:scale-[1.03]
                hover:shadow-yellow-400/20 transition-all duration-300 animate-slideUp
              `}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div>
                <p className="text-sm text-gray-300">{card.title}</p>
                <p className="text-4xl font-extrabold text-white mt-2 drop-shadow-sm">
                  {card.value}
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border shadow-inner 
                flex items-center justify-center`}
              >
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* OVERVIEW SECTION */}
      <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700 animate-fadeIn">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Overview</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          Analytics, real-time charts, revenue tracking, and activity logs can be added here.
          Tell me if you want live charts, crypto-style graphs, or user growth charts.
        </p>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        .animate-slideUp {
          opacity: 0;
          transform: translateY(20px);
          animation: slideUp 0.6s ease forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}
