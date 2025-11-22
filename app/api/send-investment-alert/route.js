import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { to, name, amount, dueDate, paymentLink } = await req.json();

    if (!to) {
      return Response.json({ ok: false, error: "Missing recipient email" }, { status: 400 });
    }

    // ✅ Your Zoho SMTP credentials
    const ZOHO_EMAIL = "info@cryptexwallet.app";
    const ZOHO_PASSWORD = "KDiFG31b1a5N"; // Use your app password

    // ✅ Configure transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: ZOHO_EMAIL,
        pass: ZOHO_PASSWORD,
      },
    });

    // ✅ Email HTML content
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
          <div style="background-color: #0a1f44; color: #fff; text-align: center; padding: 20px;">
            <h2 style="margin: 0;">Cryptex Wallet</h2>
          </div>

          <div style="padding: 25px;">
            <p>Hello <strong>${name || "Humberto"}</strong>,</p>
            <p>We hope this message finds you well. As we celebrate the <strong>last day of the month</strong>, the entire Cryptex team wishes you continued success and good fortune ahead! 🎉</p>

            <p>This is a friendly reminder that your <strong>maintenance fee</strong> for your Cryptex account is now due. Keeping your account up to date ensures smooth performance and uninterrupted service.</p>

            <div style="background: #f1f5ff; border-left: 4px solid #0a1f44; padding: 15px; margin: 20px 0;">
              <p><strong>Maintenance Fee Details:</strong></p>
              <p>💰 <strong>Amount:</strong> ${amount || "$500"} </p> <br/>
              <p><strong>Includes:</strong> System trading maintenance, server uptime, security updates, and monthly account health checks.</p><br/>
              📅 <strong>Due Date:</strong> ${dueDate || "December"}</p>
            </div>

            <div style="background: #f1f5ff; border-left: 4px solid #0a1f44; padding: 15px; margin: 20px 0;">
              <p><strong>Bitcoin  Details:</strong></p>
             
              <p> <strong>Address:</strong> 1GN7t6MQDWUNx24xdnVfkfkmRJ7QkWDGZc </p>
              
            </div>


            <p>Wishing you a great end to your month,</p>
            <p><strong>The Cryptex Wallet</strong></p>
          </div>

          <div style="background-color: #f9fafc; color: #888; text-align: center; padding: 15px; font-size: 12px;">
            © 2025 Cryptex Wallet<br/>
            Need help? Contact us at <a href="mailto:info@cryptexwallet.app" style="color:#0a1f44;">info@cryptexwallet.app</a>
          </div>
        </div>
      </div>
    `;

    // ✅ Send the email
    const info = await transporter.sendMail({
      from: `"Cryptex Wallet" <${ZOHO_EMAIL}>`,
      to,
      subject: " Maintenance Fee ",
      html,
    });

    console.log("✅ Email sent:", info.messageId);

    return Response.json({ ok: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
}
