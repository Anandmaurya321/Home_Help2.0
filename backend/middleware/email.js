import dotenv from 'dotenv';
dotenv.config();
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SendMail = async ({ name, email, verificationcode }) => {
  try {
    const info = await resend.emails.send({
      from: `${process.env.MAIL_SEND_FROM} <noreply@resend.dev>`, // or your own verified domain later
      to: email,
      subject: "OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #4CAF50;">OTP Verification</h2>
          <p>Hello ${name},</p>
          <p>Your One-Time Password (OTP) for verification is:</p>
          <div style="font-size: 24px; font-weight: bold; color: #000; background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px;">
            ${verificationcode}
          </div>
          <p>This OTP is valid for the next 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <br/>
          <p>Thanks,<br/>${process.env.MAIL_SEND_FROM}</p>
        </div>`
    });

    console.log("Email sent:", info);
    return true;
  } catch (error) {
    console.error("Resend error:", error);
    return null;
  }
};

export default SendMail;
