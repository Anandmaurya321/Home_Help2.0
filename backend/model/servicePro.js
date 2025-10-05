
import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  email: { type: String, required: true }, // unique per provider
  rating: { type: Number, required: true },
  review: { type: String, required: true }
});

const ServiceProSchema = new mongoose.Schema({
    name: String,
    service: String,
    experience: String,
    contact: String,
    address: String,
    imageurl: String ,
    imagePublicId: String,
    email:String,
    password:String, 
    role :{
      type:String,
      default:"provider"
    },
    location: {
        latitude: String,
        longitude: String
    },
    reviews: [reviewSchema]
})

const ServicePro = mongoose.model('ServicePro', ServiceProSchema)

export default ServicePro;

