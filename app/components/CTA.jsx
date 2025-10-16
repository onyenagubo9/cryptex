"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  const fullText = "Start Trading Now";
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = 150; // milliseconds per character
    const pauseTime = 1000; // pause before repeating

    const interval = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      setIndex(prev => prev + 1);

      if (index >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => {
          setText("");
          setIndex(0);
        }, pauseTime);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <section className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-gray-900 py-20 px-6 text-center">
      {/* Typing Heading */}
      <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 min-h-[60px]">
        {text}
        <span className="animate-blink">|</span>
      </h2>

      {/* Tagline */}
      <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
        Join thousands of traders enjoying secure, fast, and simple crypto transactions today.
      </p>

      {/* Button with Icon */}
      <Link
        href="/signup"
        className="inline-flex items-center gap-3 bg-gray-900 text-yellow-400 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-800 hover:scale-105 transition-transform duration-300"
      >
        Create Account
        <ArrowRight className="w-5 h-5" />
      </Link>

      {/* Typing cursor animation */}
      <style jsx>{`
        .animate-blink {
          display: inline-block;
          width: 1ch;
          animation: blink 1s step-start infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
