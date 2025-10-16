"use client";

import React, { useEffect, useState } from "react";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image: string;
}

export default function LivePrices() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false"
        );
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCoins();
    const interval = setInterval(fetchCoins, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-400 border-solid"></div>
        <p className="ml-3 text-lg text-gray-300">Loading live prices...</p>
      </div>
    );

  return (
    <section id="live-prices" className="py-16 px-6 text-white">
      <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
        🔥 Live Coin Prices
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="bg-gray-800/60 p-6 rounded-3xl border border-gray-700 hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-xl">{coin.name}</h3>
                <p className="text-gray-400 uppercase text-sm">{coin.symbol}</p>
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-green-400">
              ${coin.current_price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
