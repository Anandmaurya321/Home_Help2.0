

import '../../config/db.js' 
import ServicePro from '../../model/servicePro.js'

const ViewServicePro = async(req , res)=>{
    let service = req.params.service;
    const servicepro = await ServicePro.find({service: service})
    res.send(servicepro)
}

export default ViewServicePro;
