import { useEffect, useState } from "react";

export default function CryptoOverview() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchCoins = async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false"
      );
      const data = await res.json();
      setCoins(data);
    };
    fetchCoins();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Live Crypto Prices</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="bg-[#1c1c1c] p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <img src={coin.image} alt={coin.name} className="w-10 h-10" />
              <h2 className="text-lg font-semibold">{coin.name}</h2>
            </div>
            <p>💰 ${coin.current_price.toLocaleString()}</p>
            <p
              className={`mt-2 ${
                coin.price_change_percentage_24h > 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {coin.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
