import { NextResponse } from "next/server";
import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
  "9938ae41ece30248ac7614d92c690e6e",
  "791802c2617efd3764c9ff94c11e8714"
);

const FROM_EMAIL = "info.crptex.usa@gmail.com";
const FROM_NAME = "Crptex";

export async function POST(req) {
  try {
    const { to, name } = await req.json();

    if (!to) {
      return NextResponse.json({ ok: false, error: "Missing recipient email" }, { status: 400 });
    }

    const safeName = name || "Investor";

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

    const request = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: FROM_EMAIL, Name: FROM_NAME },
          To: [{ Email: to, Name: safeName }],
          Subject: "Welcome to Crptex — Let’s Get Started!",
          HTMLPart: html,
        },
      ],
    });

    return NextResponse.json({ ok: true, message: "Signup email sent!", data: request.body });
  } catch (err) {
    console.error("❌ Mailjet Error:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
