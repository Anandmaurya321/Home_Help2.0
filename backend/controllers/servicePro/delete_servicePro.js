


import ServicePro from '../../model/servicePro.js'

import { cloudinary } from '../../config/cloudinary.js'

const DeleteServicePro = async (req, res) => {
  try {
    
    const role = req.user.role;
    
    if(role!=='admin'){
      return res.status(401).json({ message: 'Only admins are allowed' });
    }

    const id = req.params.id;

    // 1. Find the service provider to get the stored public_id
    const servicePro = await ServicePro.findById(id);
    if (!servicePro) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    // 2. Delete the image from Cloudinary using the EXACT ID from your database
    if (servicePro.imagePublicId) {
        await cloudinary.uploader.destroy(servicePro.imagePublicId);
    }

    // 3. Delete the record from MongoDB
    await ServicePro.deleteOne({ _id: id });

    res.status(200).json({ acknowledged: true ,  message: 'Service provider deleted successfully' });

  } catch (error) {
    console.error('Error deleting service provider:', error);
    res.status(500).json({ acknowledged:false , error: 'Failed to delete service provider' });
  }
};

export default DeleteServicePro;



