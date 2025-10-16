"use client";

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Logo and Company Name */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Image
            src="/logo-crp.png" // replace with your actual logo path
            alt="Cryptex Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-yellow-400">Cryptex</span>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Link href="/privacy" className="hover:text-yellow-400 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-yellow-400 transition-colors">Terms</Link>
          <Link href="/support" className="hover:text-yellow-400 transition-colors">Support</Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook className="w-6 h-6 hover:text-yellow-400 transition-colors" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="w-6 h-6 hover:text-yellow-400 transition-colors" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram className="w-6 h-6 hover:text-yellow-400 transition-colors" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-6 h-6 hover:text-yellow-400 transition-colors" />
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-8"></div>

      {/* Copyright */}
      <p className="text-center text-gray-500 mt-6 text-sm">
        &copy; {new Date().getFullYear()} Cryptex. All rights reserved.
      </p>
    </footer>
  );
}
