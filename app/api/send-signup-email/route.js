// File: /app/api/send-signup-email/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { to, name } = await req.json();

    if (!to) {
      return NextResponse.json({ ok: false, error: "Missing recipient email" }, { status: 400 });
    }

    const safeName = name || "Investor";

    // Zoho credentials
    const ZOHO_EMAIL = "info@cryptexwallet.app";
    const ZOHO_PASSWORD = "KDiFG31b1a5N"; // Replace with Zoho app-specific password

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 587, // STARTTLS
      secure: false,
      auth: {
        user: ZOHO_EMAIL,
        pass: ZOHO_PASSWORD,
      },
    });

    // Email HTML
    const html = `
      <html>
        <body style="font-family:Arial;background-color:#f4f7fb;margin:0;padding:0;">
          <div style="max-width:600px;margin:40px auto;background-color:#fff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);overflow:hidden;">
            <div style="background-color:#0a1f44;padding:25px;text-align:center;">
              <h1 style="color:#ffd700;">Welcome to Crptex</h1>
            </div>
            <div style="padding:30px;">
              <h2 style="color:#0a1f44;">Hi ${safeName},</h2>
              <p>Welcome aboard 🎉 We're excited to have you join <strong>Crptex</strong>.</p>
              <div style="text-align:center;margin:30px 0;">
                <a href="https://crptex.app"
                  style="background-color:#ffd700;color:#0a1f44;padding:12px 25px;border-radius:8px;text-decoration:none;font-weight:600;">
                  Go to Dashboard
                </a>
              </div>
              <p style="color:#777;font-size:13px;">Need help? Just reply to this email.</p>
            </div>
            <div style="background-color:#0a1f44;padding:15px;text-align:center;">
              <p style="color:#ccc;font-size:12px;margin:0;">© 2025 Crptex. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Crptex" <${ZOHO_EMAIL}>`,
      to,
      subject: "Welcome to Crptex — Let’s Get Started!",
      html,
    });

    console.log("Email sent:", info.messageId);

    return NextResponse.json({ ok: true, message: "Signup email sent!", info });
  } catch (err) {
    console.error("❌ SMTP Error:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
