

import User from "../../model/user.js"

const FindUser = async (req, res) => {
    
    const email = req.body.email;

    const data = await User.findOne({ email: email });

    if (!data) {
        return res.send({ success: true, isEmail: false, message: "Not registered yet" });
    }

    else{
       return res.send({success: true, isEmail: true, data:data})
    }

}

export default FindUser;

