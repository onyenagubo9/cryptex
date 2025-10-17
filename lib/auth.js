import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";



export const register = async (email, password, name) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    const uid = response.user.uid;

    // ✅ Ensure Firestore reference uses `db`
    await setDoc(doc(db, "users", uid), {
      name,
      email,
      uid,
      accountBalance: 0,
      fuelMoney: 0,
      totalProfit: 0,
    });

      // Send signup email via your backend
      await fetch("/api/send-signup-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: email, name }),
    });



    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    let msg = error.message;
    if (msg.includes("auth/email-already-in-use")) msg = "This email is already in use";
    if (msg.includes("auth/invalid-email")) msg = "Invalid email";
    return { success: false, msg };
  }
};

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    
      // Send login email via your backend
     await fetch("/api/send-login-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: email, name }),
  });

    return { success: true };
  } catch (error) {
    let msg = error.message;
    if (msg.includes('auth/user-not-found')) msg = "User not found";
    if (msg.includes('auth/wrong-password')) msg = "Incorrect password";
    return { success: false, msg };
  }
};
