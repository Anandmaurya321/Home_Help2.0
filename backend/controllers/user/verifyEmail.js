
// we have verification code in database and we also send it to user 
// when user send it to verifyemail route we start mathching that both.....

import User from "../../model/user.js"

const Verifyemail = async(req ,res)=>{
   try {
    const {code} = req.body;
    let user = await User.findOne({verificationcode: code})
    if(!user){
        return res.status(400).json({success:True , message:'Invalid or Expired code'})
    }
    // if user is found with accurate code
    user.isvarified = true;
    user.verificationcode = undefined;
    await user.save() // saving all the changes in the Database..
    return res.status(200).json({success:true , email: user.email , message:'You are verified Now'})
   } 
   catch (error) {
    console.log(error)
     return res.status(400).json({success:false , message:'Something went wrong'})
   }
}

export default Verifyemail


