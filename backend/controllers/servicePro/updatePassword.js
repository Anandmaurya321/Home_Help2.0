
import ServicePro from '../../model/servicePro.js'; 
import Token from '../../utils/token.js'

const Update_Password = async (req, res) => {
  try {
    const password = req.body.password
    const email = req.body.email;
    console.log("Updating password of ServicePro of email: ", email);

    const result = await ServicePro.updateOne({ email: email },
      { $set: { password: password } }
    );

    const servicePro = await ServicePro.findOne({ email: email });

    const payload = {
      id: servicePro._id,
      role: servicePro.role
    };

    const token = Token(payload);

    if(token===null){
        res.status(500).json({ success: false, message: "jwt error" });
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




