"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black/60 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Image
          src="/logo-crp.png"
          alt="Cryptex Logo"
          width={36}
          height={36}
          className="rounded-md"
        />
        <h1 className="text-2xl font-bold text-yellow-400">Cryptex</h1>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-6 text-gray-300 font-medium">
        <li>
          <Link href="#home" className="hover:text-yellow-400 transition">Home</Link>
        </li>
        <li>
          <Link href="#live-prices" className="hover:text-yellow-400 transition">Live Prices</Link>
        </li>
        <li>
          <Link href="#about" className="hover:text-yellow-400 transition">About</Link>
        </li>
        <li>
          <Link href="#faq" className="hover:text-yellow-400 transition">FAQ</Link>
        </li>
      </ul>

      {/* Desktop Button */}
      <div className="hidden md:block">
        <Link
          href="/login"
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-yellow-400 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-md border-t border-gray-700 flex flex-col items-center py-6 space-y-4 md:hidden">
          <Link
            href="#home"
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-yellow-400 transition text-lg"
          >
            Home
          </Link>
          <Link
            href="#live-prices"
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-yellow-400 transition text-lg"
          >
            Live Prices
          </Link>
          <Link
            href="#about"
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-yellow-400 transition text-lg"
          >
            About
          </Link>
          <Link
            href="#faq"
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-yellow-400 transition text-lg"
          >
            FAQ
          </Link>
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
