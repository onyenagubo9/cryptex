// File: /app/api/send-reset-email/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });

    const ZOHO_EMAIL = "info@cryptexwallet.app";
    const ZOHO_PASSWORD = "YourZohoAppPassword"; // App-specific password

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 587,
      secure: false, // STARTTLS
      auth: { user: ZOHO_EMAIL, pass: ZOHO_PASSWORD },
    });

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f7fb; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
          .header { background: #0a1f44; color: #ffd700; text-align: center; padding: 25px; font-size: 24px; font-weight: bold; }
          .body { padding: 30px; color: #0a1f44; line-height: 1.6; }
          .body p { margin-bottom: 20px; }
          .button-container { text-align: center; margin: 30px 0; }
          .btn { background-color: #ffd700; color: #0a1f44; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: 600; display: inline-block; transition: all 0.3s ease; }
          .btn:hover { background-color: #e0bc00; transform: scale(1.05); }
          .footer { background: #0a1f44; color: #ccc; text-align: center; padding: 15px; font-size: 12px; }
          @media (max-width: 600px) {
            .container { margin: 20px; }
            .header { font-size: 20px; }
            .btn { padding: 10px 20px; font-size: 14px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Reset Your Password</div>
          <div class="body">
            <p>Hello,</p>
            <p>We received a request to reset your Crptex account password. Click the button below to reset it securely:</p>
            <div class="button-container">
              <a href="https://crptex.app/reset-password?email=${email}" class="btn">Reset My Password</a>
            </div>
            <p>If you didn't request this, you can safely ignore this email.</p>
          </div>
          <div class="footer">© 2025 Crptex. All rights reserved.</div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Crptex" <${ZOHO_EMAIL}>`,
      to: email,
      subject: "Crptex Password Reset Request",
      html,
    });

    return NextResponse.json({ ok: true, message: "Password reset email sent!" });
  } catch (err) {
    console.error("SMTP Error:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
