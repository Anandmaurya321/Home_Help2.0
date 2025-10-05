
import mongoose from 'mongoose'

const AdminSchema = new mongoose.Schema({
    name:String,
    email:String
})

const AdminModel = mongoose.model('admins' , AdminSchema)

export default AdminModel;

