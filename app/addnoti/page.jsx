"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddNoti() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleAddNotification = async () => {
    if (!user) return alert("No user logged in!");
    if (!title || !message) return alert("Please fill in all fields.");

    try {
      await addDoc(collection(db, "users", user.uid, "notifications"), {
        title,
        message,
        createdAt: serverTimestamp(),
      });
      alert("Notification added successfully!");
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error("Error adding notification:", error);
      alert("Error adding notification!");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-yellow-400 text-center">
          Add Notification
        </h1>

        <div className="space-y-4">
          {/* Title input */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Message input */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              rows={3}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleAddNotification}
            className="w-full py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition"
          >
            Add Notification
          </button>
        </div>
      </div>
    </div>
  );
}
