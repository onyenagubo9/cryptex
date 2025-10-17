"use client";
import Sidebar from "../../components/Sidebar";
import BottomNav from "../../components/BottomNav";
import SubHeader from "../../components/SubHeader";
import { useState, useEffect } from "react";
import CryptoPrices from "../../components/CryptoPrices";

export default function MarketPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white relative">
      {!isMobile && <Sidebar activeTab="market" />} {/* Sticky Sidebar */}
      <main className="flex-1 flex flex-col">
        <SubHeader title=" 📈 Market"  />
        <div className="p-6 overflow-y-auto flex-1">
          <CryptoPrices />
        </div>
      </main>
      {isMobile && <BottomNav activeTab="transactions" />} {/* Bottom Tabbar */}
    </div>
  );
}
