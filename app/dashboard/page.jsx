// app/dashboard/page.jsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import BottomNav from "../../components/BottomNav";
import Header from "../../components/Header";
import Dashmain from "../../components/Dashmain";

export default function DashboardPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Simulate loading delay (or fetch data here)
    const timer = setTimeout(() => setLoading(false), 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-t-blue-600 border-b-4 border-b-gray-700 border-l-4 border-l-gray-700 border-r-4 border-r-gray-700"></div>

        <p className="mt-4 text-gray-400 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white relative">
      {/* Sidebar for desktop */}
      {!isMobile && <Sidebar />}

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main dashboard content */}
        <div className="p-6 sm:p-12 overflow-y-auto flex-1">
          <Dashmain />
        </div>
      </main>

      {/* Bottom navigation for mobile */}
      {isMobile && <BottomNav />}
    </div>
  );
}
