import dotenv from 'dotenv'
dotenv.config();
import nodemailer from 'nodemailer'

console.log("auth: " ,process.env.NODEMAILER_USER , process.env.NODEMAILER_PASS)
// We are creating Transporter Here :::
const Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",    // send to gmail
  port: 587,
  secure: false,       // true for 465, false for other ports
  auth: {           
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  },
}); 


export default Transporter  



