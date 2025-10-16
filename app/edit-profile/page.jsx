"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { updateUserProfile } from "../../lib/updateProfile";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const docRef = doc(db, "users", userAuth.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser({ uid: userAuth.uid, ...userData });
          setName(userData.name || "");
          setPreview(userData.image || "/defaultAvatar.png");
        }
      } else {
        router.push("/login");
      }
    });
    return unsubscribe;
  }, [router]);

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
    if (res.success) alert("✅ Profile updated successfully!");
    else alert(res.msg);
  };

  if (!user)
    return <p className="text-center mt-20 text-gray-400">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Sticky Subheader */}
      <header className="sticky top-0 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between p-4 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
        >
          <ArrowLeft size={22} />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-semibold text-center flex-1 -ml-8">
          ✏️ Edit Profile
        </h1>
      </header>

      {/* Main Form */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 py-10">
        <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 shadow-lg w-full max-w-md border border-gray-800">
          <form
            onSubmit={handleUpdate}
            className="flex flex-col items-center gap-6"
          >
            {/* Profile Image */}
            <div className="relative">
              <img
                src={preview || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-yellow-500 shadow-md"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* Name Input */}
            <div className="w-full">
              <label className="block text-sm text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-700 bg-gray-800 text-white w-full p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-3 rounded-xl transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
