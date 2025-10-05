import dotenv from 'dotenv'
dotenv.config();
import jwt from 'jsonwebtoken'
const Token = (payload)=>{
    try{
     const token =  jwt.sign(payload , process.env.JWT_KEY , { expiresIn: '2hr' })
     return token // return token
    }
    catch(err){
       console.log("jwt error : " , err);
       return null; // return null
    }
}

export default Token;

