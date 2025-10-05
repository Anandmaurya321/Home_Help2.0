
import ServiceRequests from '../../model/serviceRequests.js'
import { cloudinary } from '../../config/cloudinary.js'

const DeleteService = async (req, res) => {
  try {
    const id = req.params.id;

     // ADD THIS LINE FOR DEBUGGING
   console.log("DEBUGGING CLOUDINARY CONFIG:", cloudinary.config());

    // 1. Find the document to get the stored public_id
    const serviceRequest = await ServiceRequests.findById(id);
    if (!serviceRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // 2. Delete from Cloudinary using the EXACT public_id from your database
    // No more splitting or guessing!
    if (serviceRequest.imagePublicId) {
        await cloudinary.uploader.destroy(serviceRequest.imagePublicId);
    }

    // 3. Delete the record from your database
    await ServiceRequests.deleteOne({ _id: id });
    
    console.log(`Successfully deleted request ${id}`);
    res.status(200).json({ acknowledged : true  , message: 'Request denied and deleted successfully.' });

  } 
  catch (err) {
    console.error("Error during service deletion:", err);
    res.status(500).json({ acknowledged: false , error: 'An unexpected error occurred on the server.' });
  }
};

export default DeleteService;


