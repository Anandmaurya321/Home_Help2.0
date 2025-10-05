

import user from "../../model/user.js";

const addInfo = async(req , res)=>{
    try{
      console.log(req.body)
      const result = await user.create(req.body);
      console.log("data is added successfully:::>>" , result)
      res.send({result})
    }
    catch(err){
      console.log("do not store data with error" , err);
      res.send("do not store data with erroe :: " , err)
    }
}


export default addInfo







