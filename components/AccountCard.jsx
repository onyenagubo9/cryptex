"use client";

export default function AccountCard({ title, balance, fuelMoney }) {
  return (
    <div className="bg-gradient-to-r from-gray-800/70 to-gray-700/50 backdrop-blur-md border border-gray-600 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl flex flex-col gap-3 sm:gap-4 md:gap-6 hover:scale-105 transition-transform duration-300 w-full">
      {/* Title with emoji */}
      <h3 className="text-base sm:text-lg md:text-xl text-yellow-400 font-semibold flex items-center gap-2">
        {title === "Account Balance" ? "💰" : "📊"} {title}
      </h3>

      {/* Balance */}
      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
        {title === "Account Balance" ? "💵" : "📈"} ${balance?.toLocaleString() ?? 0}
      </p>

      {/* Fuel Money */}
      {fuelMoney !== undefined && (
        <p className="text-sm sm:text-base md:text-lg text-gray-300 flex items-center gap-2">
          ⛽ Fuel Money: ${fuelMoney?.toLocaleString() ?? 0}
        </p>
      )}
    </div>
  );
}
