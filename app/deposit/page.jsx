"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Deposit() {
  const router = useRouter();
  const [selectedCoin, setSelectedCoin] = useState("");

  const coins = [
    { name: "Bitcoin", emoji: "₿", symbol: "BTC", link: "/deposit/bitcoin" },
    { name: "Ethereum", emoji: "Ξ", symbol: "ETH", link: "/deposit/ethereum" },
    { name: "Tether", emoji: "💵", symbol: "USDT", link: "/deposit/usdt" },
  ];

  const handleDeposit = () => {
    if (!selectedCoin) return alert("Please select a cryptocurrency to deposit!");
    const coin = coins.find((c) => c.name === selectedCoin);
    if (coin) router.push(coin.link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 sm:p-12">
      <h1 className="text-3xl font-bold mb-8 text-yellow-400">Deposit Crypto</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        {coins.map((coin) => (
          <div
            key={coin.symbol}
            onClick={() => router.push(coin.link)}
            className={`cursor-pointer flex flex-col items-center p-6 rounded-2xl border transition-all shadow-lg hover:scale-105 hover:bg-gray-800/70 ${
              selectedCoin === coin.name
                ? "border-yellow-400 bg-gray-800/70"
                : "border-gray-700 bg-gray-800/50"
            }`}
          >
            <div className="text-5xl mb-4">{coin.emoji}</div>
            <h2 className="text-xl font-semibold mb-2">{coin.name}</h2>
            <p className="text-gray-400">{coin.symbol}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleDeposit}
        className="mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold text-white transition-all"
      >
        Deposit {selectedCoin ? `(${selectedCoin})` : ""}
      </button>

      <p
        onClick={() => router.push("/dashboard")}
        className="text-gray-400 text-sm mt-4 cursor-pointer hover:underline"
      >
        Back to Dashboard
      </p>
    </div>
  );
}
