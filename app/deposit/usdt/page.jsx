"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UsdtDeposit() {
  const router = useRouter();
  const [address] = useState("TKEMagepP7twsu7DTBJ4NgssYUMfQ1bik3"); // Replace with real BTC address
  const [network] = useState("USDT Network (Trc20)");

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    alert("Address copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 sm:p-12">
      <h1 className="text-3xl font-bold mb-8 text-yellow-400">Deposit USDT 💵</h1>

      {/* QR Code / Image from public folder */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl w-64 h-64 flex items-center justify-center mb-6 shadow-lg overflow-hidden">
        <img 
          src="/usdt-code.jpeg" // Place your QR code image inside /public folder
          alt="Bitcoin QR Code" 
          className="object-contain w-full h-full"
        />
      </div>

      {/* Address */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 w-full max-w-md mb-4 flex justify-between items-center">
        <div>
          <p className="text-gray-400 mb-1 font-semibold">Wallet Address:</p>
          <p className="text-white break-all">{address}</p>
        </div>
        <button
          onClick={handleCopy}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md font-semibold transition"
        >
          Copy
        </button>
      </div>

      {/* Network */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 w-full max-w-md mb-6">
        <p className="text-gray-400 mb-1 font-semibold">Network:</p>
        <p className="text-white">{network}</p>
      </div>

      {/* Warning */}
      <p className="text-red-600 text-center max-w-md mb-6">
        ⚠️ Warning: Depositing to the wrong address may cause permanent loss of funds!
      </p>

      {/* Back button */}
      <button
        onClick={() => router.push("/deposit")}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
      >
        Back to Deposit Options
      </button>
    </div>
  );
}
