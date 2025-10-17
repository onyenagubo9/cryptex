// app/api/send-reset-email/route.js
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { to, name } = await req.json();

    if (!to) {
      return NextResponse.json({ ok: false, error: "Missing recipient email" }, { status: 400 });
    }

    const safeName = name || "Investor";

    // Zoho SMTP credentials
    const ZOHO_EMAIL = "info@cryptexwallet.app";
    const ZOHO_APP_PASSWORD = "KDiFG31b1a5N"; // <- Use your app password here

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: ZOHO_EMAIL,
        pass: ZOHO_APP_PASSWORD,
      },
    });

    // Email HTML
    const html = `
      <html>
        <body style="font-family:Arial,sans-serif;background-color:#f4f7fb;margin:0;padding:0;">
          <div style="max-width:600px;margin:40px auto;background-color:#fff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);overflow:hidden;">
            <div style="background-color:#0a1f44;padding:25px;text-align:center;">
              <h1 style="color:#ffd700;">Reset Your Password</h1>
            </div>
            <div style="padding:30px;">
              <h2 style="color:#0a1f44;">Hi ${safeName},</h2>
              <p>We received a request to reset your password for your <strong>Crptex</strong> account.</p>
              <div style="text-align:center;margin:30px 0;">
                <a href="https://cryptex.app/reset-password"
                  style="background-color:#ffd700;color:#0a1f44;padding:12px 25px;border-radius:8px;text-decoration:none;font-weight:600;">
                  Reset Password
                </a>
              </div>
              <p style="color:#777;font-size:13px;">If you did not request a password reset, you can safely ignore this email.</p>
            </div>
            <div style="background-color:#0a1f44;padding:15px;text-align:center;">
              <p style="color:#ccc;font-size:12px;margin:0;">© 2025 Crptex. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain-text version
    const text = `
Hi ${safeName},

We received a request to reset your password for your Crptex account.

Reset your password here: https://cryptex.app/reset-password

If you did not request this, you can ignore this email.

© 2025 Crptex. All rights reserved.
`;

    // Send the email
    const info = await transporter.sendMail({
      from: `"Crptex" <${ZOHO_EMAIL}>`,
      to,
      subject: "Reset Your Crptex Password",
      text, // plain-text version
      html, // HTML version
    });

    return NextResponse.json({ ok: true, message: "Reset email sent!", info });
  } catch (err) {
    console.error("❌ SMTP Error:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
