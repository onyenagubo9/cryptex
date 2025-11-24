"use client";

import AdminGuard from "@/components/AdminGuard";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-900 text-white">

        {/* HEADER */}
        <header className="w-full px-6 py-4 bg-gray-800 border-b border-gray-700 shadow-md flex items-center justify-between">
          <h1 className="text-2xl font-bold text-yellow-400">Cryptex Admin Panel</h1>
        </header>

        {/* CONTENT */}
        <main className="p-6">{children}</main>

      </div>
    </AdminGuard>
  );
}
