"use client";

import AccountData from "@/components/AccountData";
import ActionsCard from "@/components/ActionsCard";
import CryptoOverview from "@/components/CryptoOverview";

export default function Dashmain() {
  // Example data
  const accountData = { balance: 12500, fuelMoney: 250 };
  const graphData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [5000, 7000, 12000, 10000, 15000, 12500],
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 sm:p-12 flex flex-col gap-6">
      {/* Vertical stacked cards */}
      <AccountData title="Account Balance" balance={accountData.balance} fuelMoney={accountData.fuelMoney} />
       <ActionsCard />
         <CryptoOverview />

    </main>
  );
}
