

// code of route // code for register ::

import User from "../../model/user.js"
import bcrypt from 'bcrypt'
import SendMail from "../../middleware/email.js"

const Resend_code = async(req ,res)=>{
   try {

    const {email , password , name} = req.body

    if(result){ // checking if alredy exist
        console.log(result)
        return res.status(400).json({success:false , result:'email alredy used'})
    }

    let hashpass = bcrypt.hashSync(password, 10);
    
    console.log(hashpass)
    // we will save that varification code in our database and send same to user on email and 
    // check for varification
    
    const verificationcode = Math.ceil(Math.random()*100000 + Math.random()*900000).toString();

    const user_data = new User(
        {
            email,
            password:hashpass, // password is saved in hash form.....
            name,
            verificationcode
        }
    );
    
    const status =  SendMail({name , email , verificationcode})

    if(status){  // if we are able to send the mail means ... Given data is ok 
       user_data.save(); // we save the data here and give the success response
       return res.status(200).json({success:true, result:"data saved successfully"})
    }
   
   } 
   catch (error) {
     console.log('something went wrong'+ error)
     res.send(error)
   }
}

export default Resend_code

// Now user use verifyemail route to send that otp 


