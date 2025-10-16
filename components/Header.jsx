"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FiBell } from "react-icons/fi";
import { auth, db } from "@/firebase/config";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Header() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef();

  // ✅ Fetch user info + notifications
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (!userAuth) return;

      try {
        // Get user info
        const userRef = doc(db, "users", userAuth.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        const userData = userSnap.data();
        setUser({
          uid: userAuth.uid,
          name: userData.name || "User",
          image: userData.image || "/defaultAvatar.png",
        });

        // ✅ Fetch notifications (temporarily without orderBy to avoid index error)
        let notifQuery = query(
          collection(db, "users", userAuth.uid, "notifications")
          // Uncomment below line *after creating index in Firebase*
          // orderBy("createdAt", "desc")
        );

        const notifSnap = await getDocs(notifQuery);
        const notifData = notifSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "New Notification",
            message: data.message || "(No message provided)",
            createdAt: data.createdAt?.seconds
              ? new Date(data.createdAt.seconds * 1000)
              : null,
          };
        });

        setNotifications(notifData);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error.message);
      }
    });

    return unsubscribe;
  }, []);

  // ✅ Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center bg-transparent backdrop-blur-md border-b border-gray-800 px-6 py-4">
      {/* Left Side — Title */}
      <h1 className="text-xl md:text-2xl font-bold text-yellow-400">
        Dashboard
      </h1>

      {/* Right Side — Profile + Notification */}
      {user && (
        <div className="flex items-center gap-4 relative">
          <span className="text-sm md:text-base font-medium text-white">
            {user.name}
          </span>

          {/* Notification Icon */}
          <button
            onClick={() => setShowPopup((prev) => !prev)}
            className="relative text-white hover:text-yellow-400 transition"
          >
            <FiBell size={24} />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-900"></span>
            )}
          </button>

          {/* Notification Popup */}
          {showPopup && (
            <div
              ref={popupRef}
              className="absolute right-0 mt-12 w-80 max-h-96 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg overflow-y-auto z-50"
            >
              <h3 className="text-white font-semibold text-lg p-4 border-b border-gray-700">
                Notifications
              </h3>
              <div className="flex flex-col divide-y divide-gray-700">
                {notifications.length === 0 ? (
                  <p className="p-4 text-gray-400 text-center">
                    No notifications yet
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 hover:bg-gray-700/50 transition cursor-pointer"
                    >
                      <p className="text-white font-medium">{notif.title}</p>
                      <p className="text-gray-300 text-sm mb-1">
                        {notif.message}
                      </p>
                      <span className="text-gray-400 text-xs">
                        {notif.createdAt
                          ? notif.createdAt.toLocaleString()
                          : "No date"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* User Avatar */}
          <Image
            src={user.image}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full border border-yellow-400 object-cover"
          />
        </div>
      )}
    </header>
  );
}
