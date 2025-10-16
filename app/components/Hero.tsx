"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white"
    >
      {/* Animated Heading */}
      <motion.h1
        className="text-4xl sm:text-6xl font-extrabold text-yellow-400 mb-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Welcome to Cryptex Wallet 💰
      </motion.h1>

      {/* Animated Image */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <Image
          src="/logo-crp.png" // Replace with your image path
          alt="Cryptex Wallet preview"
          width={400}
          height={400}
          className="rounded-2xl shadow-lg mb-6"
        />
      </motion.div>

      {/* Animated Tagline */}
      <motion.p
        className="text-lg sm:text-xl text-gray-300 max-w-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      >
        Buy, trade, and manage your crypto assets securely.  
        Real-time prices, simple transactions, and a transparent experience.
      </motion.p>

      {/* Animated Get Started Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8"
      >
        <Link
          href="/login"
          className="inline-block bg-yellow-400 text-black font-bold px-8 py-4 rounded-full shadow-lg hover:bg-yellow-500 transition-all"
        >
          Get Started
        </Link>
      </motion.div>
    </section>
  );
}
