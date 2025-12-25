
import User from "../../model/user.js" 
import bcrypt from 'bcrypt'
import SendMail from "../../middleware/email.js"

const Register = async(req ,res)=>{
   try {

    const {email , password ,  forgotPassword} = req.body
   
    let name = req.body.name;

    if(!email || !password || !name) {
       return res.status(400).json({success:false , result:"Fill all the fields" })
    }

    let result = await User.findOne({'email': email})
    

    if(result && forgotPassword==undefined){ // checking if alredy exist
        console.log(result)
        return res.status(400).json({success:false , result:'email alredy used'})
    }

    if(result && forgotPassword!=undefined){
      name = result.name;
    }
   
   let hashpass;
   hashpass = bcrypt.hashSync(password, 10);
     
    
    console.log(hashpass)
    // we will save that varification code in our database and send same to user on email and 
    // check for varification
    
    const verificationcode = Math.floor(100000 + Math.random() * 900000).toString();

    const status =  SendMail({name , email , verificationcode})

    if(status){  
       console.log("otp Sending")
     
       return res.status(200).json({
            email,
            password:hashpass, // password is saved in hash form.....
            name,
            verificationcode
        })
    }
   
   } 
   catch (error) {
     console.log('something went wrong'+ error)
     res.send(error)
   }
}

export default Register;


