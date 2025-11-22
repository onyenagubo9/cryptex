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
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center bg-white shadow rounded-xl p-3 border border-gray-200 max-w-md">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by email or name..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : filtered.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-auto rounded-xl shadow border border-gray-100">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Balance</th>
                <th className="p-3">Fuel Money</th>
                <th className="p-3">Total Profit</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* USER + IMAGE */}
                  <td className="p-3 flex items-center gap-3">
                    <Image
                      src={user.image || "/placeholder.png"}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <span className="font-medium">{user.name}</span>
                  </td>

                  <td className="p-3">{user.email}</td>

                  <td className="p-3 font-semibold text-blue-600">
                    ${user.accountBalance?.toLocaleString()}
                  </td>

                  <td className="p-3 font-semibold text-yellow-600">
                    ${user.fuelMoney?.toLocaleString()}
                  </td>

                  <td className="p-3 font-semibold text-green-600">
                    ${user.totalProfit?.toLocaleString()}
                  </td>

                  <td className="p-3 text-right flex gap-2 justify-end">
                    {/* VIEW BUTTON */}
                    <Link
                      href={`/admin/users/${user.uid}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      View
                    </Link>

                    {/* EDIT BUTTON */}
                    <Link
                      href={`/admin/users/${user.uid}/edit`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
