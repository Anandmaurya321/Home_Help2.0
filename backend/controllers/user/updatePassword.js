
import User from '../../model/user.js'
import Token from '../../utils/token.js'

const Update_Password = async (req, res) => {
  try {
    const password = req.body.password
    const email = req.body.email;
    console.log("Updating password for ", email);

    const result = await User.updateOne({ email: email },
      { $set: { password: password } }
    );

    const user = await User.findOne({ email: email });

    const payload = {
      id: user._id,
      role: user.role
    };

    const token = Token(payload);

    if(token===null){
        return res.json({message : 'jwt error'});
    }

    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: "Password Changed",
      auth : token
    });

  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default Update_Password;