"use client";

import { ShieldCheck, CreditCard, Zap } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-yellow-400 mx-auto mb-2" />,
      title: "Secure Wallet",
      description: "Your assets are protected with industry-leading encryption and security protocols.",
    },
    {
      icon: <CreditCard className="w-10 h-10 text-yellow-400 mx-auto mb-2" />,
      title: "Easy Deposits",
      description: "Deposit funds seamlessly with multiple payment options and instant verification.",
    },
    {
      icon: <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-2" />,
      title: "Fast Transfers",
      description: "Send and receive crypto instantly, anytime, anywhere in the world.",
    },
  ];

  return (
    <section id="about" className="py-20 px-6 bg-gray-900/60 text-center text-white">
      <h2 className="text-3xl font-bold text-yellow-400 mb-6">About Cryptex</h2>
      <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12">
        Cryptex is a next-generation crypto platform designed for simplicity, security, and speed.
        We make digital finance accessible to everyone — from beginners to experienced traders.
        Join millions exploring the decentralized future today.
      </p>

      <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-800/50 p-6 rounded-xl hover:scale-105 transition-transform duration-300">
            {feature.icon}
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>

      <p className="text-gray-400 max-w-3xl mx-auto mt-12">
        Our mission is to empower everyone to take control of their digital wealth. 
        We prioritize security at every step, ensuring your assets and data are always safe.
      </p>
    </section>
  );
}
