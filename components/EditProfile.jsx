"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { updateUserProfile } from "../../lib/updateProfile";
import { onAuthStateChanged } from "firebase/auth";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const docRef = doc(db, "users", userAuth.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser({ uid: userAuth.uid, ...userData });
          setName(userData.name || "");
          setPreview(userData.image || "");
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const res = await updateUserProfile(user.uid, name, image);
    setLoading(false);
    if (res.success) alert("Profile updated successfully!");
    else alert(res.msg);
  };

  if (!user) return <p className="text-center mt-20">Loading profile...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Edit Profile</h1>

      <form onSubmit={handleUpdate} className="flex flex-col items-center gap-4 w-80">
        <div className="relative">
          <img
            src={preview || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <input
          type="text"
          value={name}
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
