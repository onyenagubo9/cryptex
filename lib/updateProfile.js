import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const updateUserProfile = async (uid, name, imageFile) => {
  try {
    let imageUrl = null;

    // ✅ Upload image to Cloudinary via API route
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) imageUrl = data.url;
      else throw new Error("Image upload failed");
    }

    // ✅ Update Firestore
    const userRef = doc(db, "users", uid);
    const updateData = { name };
    if (imageUrl) updateData.image = imageUrl;

    await updateDoc(userRef, updateData);
    return { success: true, imageUrl };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, msg: error.message };
  }
};
