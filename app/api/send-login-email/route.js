// File: /app/api/send-login-email/route.js (Next.js 13+ /app router)
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { to, name } = await req.json();
    if (!to) {
      return NextResponse.json({ ok: false, error: "Recipient email is required" }, { status: 400 });
    }

    const safeName = name || "Investor";

    // Hardcoded Zoho SMTP credentials (use App Password)
    const ZOHO_EMAIL = "info@cryptexwallet.app";
    const ZOHO_PASSWORD = "KDiFG31b1a5N"; // Replace with Zoho app-specific password 

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 587,      // STARTTLS port
      secure: false,  // STARTTLS
      auth: {
        user: ZOHO_EMAIL,
        pass: ZOHO_PASSWORD,
      },
    });

    // Email HTML content
    const html = `
      <html>
        <body style="font-family:Arial;background-color:#f4f7fb;margin:0;padding:0;">
          <div style="max-width:600px;margin:40px auto;background-color:#fff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);overflow:hidden;">
            <div style="background-color:#0a1f44;padding:25px;text-align:center;">
              <h1 style="color:#ffd700;">Crptex Login Alert</h1>
            </div>
            <div style="padding:30px;">
              <h2 style="color:#0a1f44;">Hi ${safeName},</h2>
              <p>We noticed a successful login to your Crptex account.</p>
              <div style="margin:20px 0;padding:15px;border-left:4px solid #ffd700;background-color:#f8f9fc;border-radius:6px;">
                <p><strong>Details:</strong><br/>Time: ${new Date().toLocaleString()}</p>
              </div>
              <div style="text-align:center;margin:30px 0;">
                <a href="https://crptex.app/reset-password"
                  style="background-color:#ffd700;color:#0a1f44;padding:12px 25px;border-radius:8px;text-decoration:none;font-weight:600;">
                  Secure My Account
                </a>
              </div>
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
      subject: "Login Notification — Crptex Security Alert",
      html,
    });

    console.log("Email sent:", info.messageId);

    return NextResponse.json({ ok: true, message: "Login email sent!", info });
  } catch (err) {
    console.error("❌ SMTP Error:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
