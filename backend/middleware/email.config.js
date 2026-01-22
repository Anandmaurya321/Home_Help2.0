
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

console.log("NODEMAILER_USER:", process.env.NODEMAILER_USER);
console.log("NODEMAILER_PASS:", process.env.NODEMAILER_PASS ? "exists" : "missing");
console.log("MAIL_SEND_FROM:", process.env.MAIL_SEND_FROM);
console.log("MAIL_SEND_BY_EMAIL:", process.env.MAIL_SEND_BY_EMAIL);


// We are creating Transporter Here :::
const Transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST ,    // send to gmail
  port: 587,
  secure: false,       // true for 465, false for other ports
  auth: {           
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
}); 


export default  Transporter  ;