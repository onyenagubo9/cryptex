"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config"; // Update path if necessary

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "contactMessages"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      alert("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 px-6 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold text-yellow-400 text-center mb-10">
        📬 Contact Us
      </h2>

      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-gray-800/70 p-8 rounded-2xl border border-gray-700 shadow-md"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-4 rounded-lg border border-gray-600 bg-gray-900 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-4 rounded-lg border border-gray-600 bg-gray-900 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
            className="p-4 rounded-lg border border-gray-600 bg-gray-900 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-yellow-400 text-black font-bold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-500 hover:scale-105 transition-transform duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
