
import User from '../../model/user.js'
import Token from '../../utils/token.js'

const SaveData = async (req, res) => {
    const user_data = new User(req.body);
    const status = await user_data.save();
    
    const payload = {
        id: user_data._id,
        role:user_data.role
    };

    const token = Token(payload)
    
    if(token===null){
       return res.json({message : "jwt error"})
    }

    res.send({status , auth: token})
}

export default SaveData

