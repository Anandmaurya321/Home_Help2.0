// cloudinary.js
import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'service_provider_image',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg']
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG and PNG files are allowed'))
    }
    cb(null, true)
  },
})

export { cloudinary, upload }
