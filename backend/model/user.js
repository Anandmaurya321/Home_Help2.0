

import  mongoose from 'mongoose'

const Users_Schema = new mongoose.Schema({
    name :{
        type : String , 
        require: true , 
        unique: false
    },
    password: {
       type:String,
       required:true,
       unique:false
    },
    email :{
        type : String , 
        require : true ,
        unique : true
    },
    role :{
      type:String,
      default:"user"
    }
})

const User = mongoose.model('User' , Users_Schema);

export default User
