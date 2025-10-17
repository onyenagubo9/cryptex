// app/api/send-reset-email/route.ts
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
    }

    await sendPasswordResetEmail(auth, email, {
      url: "http://localhost:3000/login", // Redirect after reset
      handleCodeInApp: true,
    });

    return NextResponse.json({ ok: true, message: "Reset email sent! Check your inbox or spam" });
  } catch (err: any) {
    console.error("Error sending reset email:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
