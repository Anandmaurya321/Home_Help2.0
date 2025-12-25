
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ConnectDb from './config/db.js';
dotenv.config();  // make available .env file :: 

ConnectDb().then(() => console.log("DB connected")).catch(err => {
  console.error("DB connection failed:", err);
  process.exit(1); // stop server if db fails::
});

const app = express();
const PORT = process.env.PORT || 8000;   // port at which it run:: >>>

const allowedOrigins = [
  "http://localhost:5173",              // your local frontend
  "https://home-help2-0.vercel.app",    // your deployed frontend
  "https://home-help2-0-2plim4f1t-anands-projects-64ad675c.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow server-to-server, mobile apps, Postman, curl
    if (!origin) return callback(null, true);

    const vercelPattern = /^https:\/\/home-help2-0.*\.vercel\.app$/;

    if (
      origin === "http://localhost:5173" ||
      vercelPattern.test(origin)
    ) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

import admin from './routes/admin.js'
import conversation from  './routes/conversation.js'
import servicePro from './routes/servicePro.js'
import serviceReq from './routes/serviceReq.js'
import user from './routes/user.js'

// app.use('/admin' , admin);
// app.use('/conversation' , conversation);
// app.use('/servicePro' , servicePro);
// app.use('/serviceReq' , serviceReq);
// app.use('/user' , user);

app.use(admin);
app.use(conversation);
app.use(servicePro);
app.use(serviceReq);
app.use(user);

console.log("NODEMAILER_USER:", process.env.NODEMAILER_USER);
console.log("NODEMAILER_PASS:", process.env.NODEMAILER_PASS ? "exists" : "missing");
console.log("MAIL_SEND_FROM:", process.env.MAIL_SEND_FROM);
console.log("MAIL_SEND_BY_EMAIL:", process.env.MAIL_SEND_BY_EMAIL);


app.listen(PORT , ()=>{console.log("Our server is running" , PORT)})




