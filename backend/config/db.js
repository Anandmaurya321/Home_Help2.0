
// Connect the DataBase::::>>>>>>

import mongoose from 'mongoose'
const ConnectDb = async()=>{
    try{
     console.log('db connected' , process.env.DB_URL)
     mongoose.connect(process.env.DB_URL)
     console.log("DB is connectd Successfully::")
    }
    catch(err){
     console.log("DB is not connected with error: ",  err);
     return ;
    }
}

export default ConnectDb;

