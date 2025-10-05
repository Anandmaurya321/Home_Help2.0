

import '../../config/db.js';

import ServiceRequest from '../../model/serviceRequests.js'

const Add_email_pass = async (req, res) => {
  try {
    const _id = req.body._id;
    const password = req.body.password
    const email = req.body.email;
    console.log("adding email and password  ", email , password);

    const result = await ServiceRequest.updateOne({ _id: _id },
      { 
        $set: { 
        email: email  ,
        password : password 
        } 
    }
    );
     if (result.matchedCount === 0) {
      // If no user with that _id was found, send a 404 error.
      return res.status(404).json({ success: false, message: "User not found with the provided ID." });
    }
    res.send(result);
    return;
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default Add_email_pass;

