"use client";

import { useState } from "react";

export default function InvestmentAlertPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSendEmail = async () => {
    if (!email) {
      setStatus("⚠️ Please enter an email address.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/send-investment-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          name: name || "Investor",
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setStatus("✅ Email sent successfully!");
      } else {
        setStatus("❌ Failed to send email: " + data.error);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("❌ Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-[#0a1f44]">
          Crptex Investment Alert
        </h1>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Recipient Name:
        </label>
        <input
          type="text"
          placeholder="Enter recipient name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Recipient Email:
        </label>
        <input
          type="email"
          placeholder="Enter recipient email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          onClick={handleSendEmail}
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#0a1f44] font-semibold py-2 rounded-md transition"
        >
          {loading ? "Sending..." : "Send Investment Alert"}
        </button>

        {status && (
          <p
            className={`mt-4 text-center text-sm ${
              status.startsWith("✅")
                ? "text-green-600"
                : status.startsWith("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
