import dotenv from 'dotenv'
dotenv.config();
import Transporter from './email.config.js';

// Using that Transporter for Sending mail :::
const SendMail = async (name , gmail , varificationCode)=>{
    try {
    const info = await Transporter.sendMail({
    from: `"${process.env.MAIL_SEND_FROM}" <${process.env.MAIL_SEND_BY_EMAIL}>`,
    to: `"${name}" , ${gmail}`,
    subject: "OTP varification",
    text: `${varificationCode}`, // plain‑text body
    html: `<div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #4CAF50;">OTP Verification</h2>
    <p>Hello ${name},</p>
    <p>Your One-Time Password (OTP) for verification is:</p>
    <div style="font-size: 24px; font-weight: bold; color: #000; background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px;">
      ${varificationCode}
    </div>
    <p>This OTP is valid for the next 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <br/>
    <p>Thanks,<br/>${name}</p>
  </div>`
  });
  console.log("Message sent:", info);
  return true;
  }
  catch (error) {
        console.log(error)
        return null;
  }
}

export default SendMail;

