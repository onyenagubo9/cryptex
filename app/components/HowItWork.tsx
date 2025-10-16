"use client";

import { UserPlus, CreditCard, Repeat, BarChart2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UserPlus className="w-10 h-10 text-yellow-400 mx-auto mb-2" />,
      title: "Create an Account",
      description: "Sign up quickly and securely to start your crypto journey.",
    },
    {
      icon: <CreditCard className="w-10 h-10 text-yellow-400 mx-auto mb-2" />,
      title: "Deposit Crypto",
      description: "Add funds easily using multiple payment options.",
    },
    {
      icon: <Repeat className="w-10 h-10 text-yellow-400 mx-auto mb-2" />,
      title: "Send/Receive Crypto",
      description: "Transfer assets instantly and securely to anyone.",
    },
    {
      icon: <BarChart2 className="w-10 h-10 text-yellow-400 mx-auto mb-2" />,
      title: "Track Portfolio",
      description: "Monitor your investments and stay updated with real-time stats.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-gray-900/60 text-center text-white">
      <h2 className="text-3xl font-bold text-yellow-400 mb-12">How It Works</h2>

      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="bg-gray-800/50 p-6 rounded-xl hover:scale-105 transition-transform duration-300">
            {step.icon}
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">{step.title}</h3>
            <p className="text-gray-300">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
