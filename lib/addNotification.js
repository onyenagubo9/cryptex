import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase/config";

/**
 * Adds a notification for a specific user.
 * @param {string} userId - The ID of the user to notify
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 */
export const addNotification = async (userId, title, message) => {
  if (!userId) throw new Error("User ID is required");

  try {
    await addDoc(collection(firestore, "notifications"), {
      userId,
      title,
      message,
      createdAt: serverTimestamp(),
    });

    console.log("✅ Notification added successfully");
  } catch (error) {
    console.error("❌ Error adding notification:", error);
  }
};
