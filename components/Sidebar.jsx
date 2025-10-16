"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Wallet, Settings, LogOut, Newspaper } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const links = [
    { href: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { href: "/market", icon: <BarChart3 size={20} />, label: "Market" },
    { href: "/transactions", icon: <Wallet size={20} />, label: "Transactions" },
    { href: "/news", icon: <Newspaper size={20} />, label: "news" },
    { href: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#111] border-r border-gray-800 p-5 sticky top-0 h-screen">
      <h2 className="text-2xl font-bold mb-10 text-yellow-400">Cryptex</h2>
      <nav className="space-y-5">
        {links.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 p-2 rounded-lg transition ${
              pathname === href
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:text-yellow-400"
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-10 border-t border-gray-700">
        <button className="flex items-center gap-3 hover:text-red-500 transition">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
