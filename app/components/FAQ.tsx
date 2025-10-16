"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQ() {
  const faqs: FAQItem[] = [
    {
      q: "How secure is Cryptex?",
      a: "Your assets are protected with multi-layer encryption and cold storage wallets for maximum safety.",
    },
    {
      q: "Can I withdraw anytime?",
      a: "Yes, you can deposit or withdraw 24/7. All transactions are processed instantly with minimal fees.",
    },
    {
      q: "Which cryptocurrencies do you support?",
      a: "Cryptex supports Bitcoin, Ethereum, USDT, BNB, Solana, and many more with new assets added regularly.",
    },
    {
      q: "Do I need KYC to trade?",
      a: "Basic KYC verification ensures a safe and compliant trading experience for all users.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 px-6 text-white bg-gray-900">
      <h2 className="text-3xl font-bold text-yellow-400 text-center mb-10">
        ❓ Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-gray-800/70 p-4 rounded-2xl border border-gray-700 shadow-md hover:border-yellow-400 transition"
          >
            <button
              onClick={() => toggleFAQ(i)}
              className="flex justify-between items-center w-full text-left focus:outline-none"
            >
              <h3 className="text-xl font-semibold text-yellow-400">{faq.q}</h3>
              {openIndex === i ? (
                <ChevronUp className="w-5 h-5 text-yellow-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-yellow-400" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === i ? "max-h-96 mt-3" : "max-h-0"
              }`}
            >
              <p className="text-gray-300">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
