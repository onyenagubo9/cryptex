"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CryptoPrices() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCoins = async (pageNum = 1, append = false) => {
    try {
      const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 50,
          page: pageNum,
          sparkline: false,
          price_change_percentage: "24h",
        },
      });

      if (res.data.length === 0) {
        setHasMore(false);
        return;
      }

      setCoins((prev) => (append ? [...prev, ...res.data] : res.data));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching crypto data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(() => fetchCoins(), 30000); // auto-refresh prices every 30s
    return () => clearInterval(interval);
  }, []);

  const handleLoadMore = async () => {
    if (!hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchCoins(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 text-lg">
        Loading live prices...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">
        Live Crypto Prices
      </h2>

      {/* Coin Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-3">
              <img src={coin.image} alt={coin.name} className="w-10 h-10" />
              <div>
                <p className="font-semibold text-lg">{coin.name}</p>
                <p className="text-gray-400 text-sm uppercase">{coin.symbol}</p>
              </div>
            </div>
            <div>
              <p className="text-xl font-bold">${coin.current_price.toLocaleString()}</p>
              <p
                className={`text-sm ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
