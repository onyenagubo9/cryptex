// File: app/privacy-policy/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 sm:p-12">
      <div className="mx-auto max-w-4xl bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-lg relative">
        {/* 🔙 Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition"
        >
          <ArrowLeft size={22} />
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <header className="text-center mb-8 mt-4">
          <h1 className="text-3xl font-bold text-yellow-400">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mt-2">Last updated: October 15, 2025</p>
        </header>

        {/* Content */}
        <section className="space-y-6 text-gray-200 leading-relaxed">
          <p>
            Welcome to <strong>Cryptex</strong> (the “Service”). This Privacy Policy explains how
            Cryptex ("we", "our", "us") collects, uses, stores, and discloses information when you
            access or use our website at <strong>cryptexwallet.com</strong>, our mobile apps, or
            other related services (collectively, the “Service”).
          </p>

          <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
          <p>
            We collect information to provide, secure, and improve the Service. The information we
            collect includes:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Personal information:</strong> name, email address, phone number, and any
              other information you provide when registering or verifying your account (including
              KYC information where required).
            </li>
            <li>
              <strong>Account data:</strong> user ID, public wallet address(es), transaction
              metadata, and preferences.
            </li>
            <li>
              <strong>Usage and device data:</strong> IP address, browser type, device identifiers,
              operating system, and logs for analytics and security.
            </li>
            <li>
              <strong>Cookies and similar technologies:</strong> used to remember preferences and
              analyze usage. You can manage cookies from your browser settings.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Create and manage user accounts and enable transactions.</li>
            <li>Provide, maintain, and improve the Service and user experience.</li>
            <li>Detect, prevent, and respond to fraud or other security issues.</li>
            <li>Communicate important updates and support messages.</li>
            <li>Comply with legal and regulatory obligations (including AML and KYC).</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">3. Sharing and Disclosure</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Service providers who help operate the Service (hosting, analytics, KYC).</li>
            <li>Payment processors or blockchain services for transactions.</li>
            <li>Authorities when required by law or valid legal process.</li>
            <li>Other parties with your consent or direction.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">4. Data Security</h2>
          <p>
            We implement reasonable administrative, technical, and physical safeguards to protect
            your information. However, no system is perfectly secure — please protect your account
            credentials and enable available security features.
          </p>

          <h2 className="text-xl font-semibold text-white">5. Contact Us</h2>
          <ul className="list-none ml-0 space-y-1 text-gray-300">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:info.crptex.usa@gmail.com"
                className="text-yellow-400 hover:underline"
              >
                info.crptex.usa@gmail.com
              </a>
            </li>
            <li>
              <strong>Website:</strong>{" "}
              <a
                href="https://cryptexwallet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline"
              >
                cryptexwallet.com
              </a>
            </li>
          </ul>

          <p className="text-sm text-gray-500 mt-4">
            This Privacy Policy is provided for informational purposes and does not constitute
            legal advice. If you have specific legal questions, consult a qualified attorney.
          </p>
        </section>
      </div>
    </main>
  );
}
