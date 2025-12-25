
import SendMail from '../../middleware/email.js'
import '../../config/db.js'
import Admin from '../../model/admin.js'
import Token from '../../utils/token.js';

const Isadmin = async (req, res) => {
    
    const name = req.body.username; 
    const email = req.body.email;

    if (!name ||!email) {
        return res.json({ data: `Username and email both is required!`  , valid: 0});
    }

    const data = await Admin.findOne({ email: email , name : name});

    if (!data) { 
        return res.json({ data: "Invalid Admin Request!"  , valid: 0});
    }

    const verificationcode = Math.floor(100000 + Math.random() * 900000).toString();

    console.log('data is found-->>' , data)

    const status = await SendMail({name , email , verificationcode})

    if(status) console.log('otp sent to email')

    if(!status){
        console.log("sending otp face problem ")
        return res.json({ data: 'Something went wrong! , Check email address!', valid: 0 });
    }

     const payload = {
            id: data._id,
            role: data.role
        };

    console.log(payload)

    const token = Token({ name: data.name, email: data.email , role:'admin'});
    console.log('our token is :', token)
    if(token===null){
       return res.json({ data: 'Something went wrong!', valid: 0 });
    }
    console.log("token :" , token , "and now we are sending otp")

    return res.json({email , name , verificationcode , auth: token, valid: 1 });  
  
}

export default  Isadmin;
