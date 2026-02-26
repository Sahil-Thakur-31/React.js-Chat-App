import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email, message } = await request.json();

    if (!email || !message) {
      return new Response(
        JSON.stringify({ error: "Email and message are required." }),
        { status: 400 }
      );
    }

    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,                // SMTP port (usually 587 for TLS)
      secure: true,            // true for 465, false for others
      auth: {
        user: process.env.SMTP_USER, // Add these in your .env.local
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL, // Your email to receive messages
      subject: "New Contact Form Message",
      text: `From: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>From:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    return new Response(JSON.stringify({ message: "Email sent!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
  console.error("Mail sending failed:", error);
  return new Response(
    JSON.stringify({ error: "Failed to send email." }),
    { status: 500 }
  );
}
}
