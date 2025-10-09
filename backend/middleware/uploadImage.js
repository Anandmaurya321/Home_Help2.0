
import { upload } from "../config/cloudinary.js";

const Upload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    
    if (err) { // send json response instead of crashing ::>>>
      console.error("Upload middleware error:", err.message);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    next();
  });
};

export { Upload };


