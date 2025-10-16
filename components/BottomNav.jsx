"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Wallet, Newspaper, Settings } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const links = [
    { href: "/dashboard", icon: <Home size={20} />, label: "Home" },
    { href: "/market", icon: <BarChart3 size={20} />, label: "Market" },
    { href: "/transactions", icon: <Wallet size={20} />, label: "History" },
    { href: "/news", icon: <Newspaper size={20} />, label: "News" },
    { href: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#111] border-t border-gray-800 flex justify-around py-3 md:hidden">
      {links.map(({ href, icon, label }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center text-xs ${
            pathname === href ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          {icon}
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
