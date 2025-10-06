

import mongoose from 'mongoose'

const ServiceProSchema = new mongoose.Schema({
    name: String,
    service: String,
    experience: String,
    contact: String,
    address: String,
    email : String ,
    password : String,
    location: {
        latitude: String,
        longitude: String
    },
    imageurl: {
        type: String,
        required: true
    },
    imagePublicId: String
});



const ServiceRequest = mongoose.model('usersrequests', ServiceProSchema);

export default  ServiceRequest;
