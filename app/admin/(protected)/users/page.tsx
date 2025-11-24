"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";

interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  image?: string;
  accountBalance?: number;
  fuelMoney?: number;
  totalProfit?: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const list: User[] = snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            uid: d.uid ?? "",
            name: d.name ?? "No Name",
            email: d.email ?? "No Email",
            image: d.image,
            accountBalance: Number(d.accountBalance || 0),
            fuelMoney: Number(d.fuelMoney || 0),
            totalProfit: Number(d.totalProfit || 0),
          };
        });
        setUsers(list);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filtered = users.filter((u) => {
    const s = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(s) ||
      (u.name?.toLowerCase().includes(s) ?? false)
    );
  });

  return (
    <div className="p-6">

      {/* PAGE TITLE */}
      <h1 className="text-4xl font-extrabold mb-8 text-white tracking-tight">
        Users Management
      </h1>

      {/* SEARCH BAR */}
      <div className="mb-8 max-w-lg">
        <div className="flex items-center bg-gray-800/60 backdrop-blur-xl border border-gray-700 shadow-lg rounded-2xl px-4 py-3">
          <FiSearch className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-300 animate-pulse">Loading users...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <div className="overflow-auto rounded-2xl shadow-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-xl">
          <table className="min-w-full text-gray-200">
            <thead>
              <tr className="bg-gray-800/80 border-b border-gray-700 text-left">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Balance</th>
                <th className="p-4 font-semibold">Fuel Money</th>
                <th className="p-4 font-semibold">Total Profit</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-800 hover:bg-gray-800/60 transition"
                >
                  <td className="p-4 flex items-center gap-3">
                    <Image
                      src={user.image || "/placeholder.png"}
                      alt={user.name}
                      width={45}
                      height={45}
                      className="rounded-full object-cover border border-gray-700 shadow-md"
                    />
                    <span className="font-medium text-white">
                      {user.name}
                    </span>
                  </td>

                  <td className="p-4 text-gray-300">{user.email}</td>

                  <td className="p-4 font-semibold text-blue-400">
                    ${user.accountBalance?.toLocaleString()}
                  </td>

                  <td className="p-4 font-semibold text-yellow-400">
                    ${user.fuelMoney?.toLocaleString()}
                  </td>

                  <td className="p-4 font-semibold text-green-400">
                    ${user.totalProfit?.toLocaleString()}
                  </td>

                  <td className="p-4 text-right flex gap-3 justify-end">
                    {/* VIEW BUTTON */}
                    <Link
                      href={`/admin/users/${user.uid}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm shadow-md transition"
                    >
                      View
                    </Link>

                    {/* EDIT BUTTON */}
                    <Link
                      href={`/admin/users/${user.uid}/edit`}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm shadow-md transition"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}
