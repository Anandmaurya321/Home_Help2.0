
import dotenv from 'dotenv'
dotenv.config();

// console.log("NODEMAILER_USER:", process.env.NODEMAILER_USER);
// console.log("NODEMAILER_PASS:", process.env.NODEMAILER_PASS ? "exists" : "missing");
// console.log("MAIL_SEND_FROM:", process.env.MAIL_SEND_FROM);
// console.log("MAIL_SEND_BY_EMAIL:", process.env.MAIL_SEND_BY_EMAIL);
// // SendMail({name , email , verificationcode}

import Transporter from './email.config.js';

// Using that Transporter for Sending mail :::
const SendMail = async ({name , email , verificationcode})=>{
    try {
    const info = await Transporter.sendMail({
    from: `${process.env.MAIL_SEND_FROM} <${process.env.NODEMAILER_USER}>`,
    to: `${name} , ${email}`,
    subject: "OTP varification",
    text: `${verificationcode}`, // plain‑text body
    html: `<div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #4CAF50;">OTP Verification</h2>
    <p>Hello ${name},</p>
    <p>Your One-Time Password (OTP) for verification is:</p>
    <div style="font-size: 24px; font-weight: bold; color: #000; background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px;">
      ${verificationcode}
    </div>
    <p>This OTP is valid for the next 2 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <br/>
    <p>Thanks,<br/>HOME_HELP</p>
  </div>`
  });
  console.log("Message sent --:", info);
  return 1;
  } 
  catch (error) { // if error
      console.log("problem in sending mail : " , error);
      return 0;
  }
}

export default SendMail;

