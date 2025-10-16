"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LivePrices from "./components/LivePrices";
import About from "./components/About";
import FAQ from "./components/FAQ";
import HowItWorks from "./components/HowItWork";
import Footer from "./components/Footer";
import CTA from "./components/CTA";
import ContactUs from "./components/ContactUs";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (2 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // Loader Screen
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          {/* Text */}
          <p className="text-yellow-400 font-semibold text-lg animate-pulse">
            Loading Cryptex...
          </p>
        </div>
      </div>
    );
  }

  // Main Page Content
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <Navbar />
      <Hero />
      <LivePrices />
      <About />
       <CTA />
      <FAQ />
      <HowItWorks/>    
      <ContactUs/> 
      <Footer/>
    </div>
  );
}
