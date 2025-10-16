"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "@/firebase/config"; // ✅ adjust if needed
import { doc, onSnapshot } from "firebase/firestore";
import AccountCard from "./AccountCard";

export default function AccountData() {
  const [accountBalance, setAccountBalance] = useState(0);
  const [fuelMoney, setFuelMoney] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);

        const unsubscribeData = onSnapshot(
          userRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              setAccountBalance(data.accountBalance || 0);
              setFuelMoney(data.fuelMoney || 0);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching data:", error);
            setLoading(false);
          }
        );

        return () => unsubscribeData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-center">Fetching your data...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <AccountCard title="Account Balance" balance={accountBalance} />
      <AccountCard title="Fuel Account" balance={fuelMoney} fuelMoney={fuelMoney} />
    </div>
  );
}
