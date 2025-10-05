
import '../../config/db.js'
import ServiceRequests from '../../model/serviceRequests.js'

const ServiceReq = async (req, res) => {
  try {
    const {
      name,
      service,
      experience,
      contact,
      address,
      latitude,
      longitude
    } = req.body;

    // The multer-storage-cloudinary package puts the URL in `req.file.path`
    // and the public_id in `req.file.filename`. We need to save both.

    const serviceRequest = new ServiceRequests({
      name,
      service,
      experience,
      contact,
      address,
      location: {
        latitude,
        longitude
      },
      imageurl: req.file.path,          // This is the full URL for displaying the image
      imagePublicId: req.file.filename  // ✅ This is the ID required for deletion
    });
    
    const result = await serviceRequest.save();
    res.status(201).json({ message: 'Request submitted successfully', data: result  , acknowledged: true});
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process service provider request' , acknowledged: false});
  }
};

export default ServiceReq;


